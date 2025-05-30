import React, { useEffect, useState } from 'react';
import { Route, Redirect, useRouteMatch, useHistory } from 'react-router-dom';

import useApi from 'shared/hooks/api';
import { updateArrayItemById } from 'shared/utils/javascript';
import { createQueryParamModalHelpers } from 'shared/utils/queryParamModal';
import { PageLoader, PageError, Modal, Button } from 'shared/components';

import NavbarLeft from './NavbarLeft';
import Sidebar from './Sidebar';
import Board from './Board';
import IssueSearch from './IssueSearch';
import IssueCreate from './IssueCreate';
import ProjectSettings from './ProjectSettings';
import ProjectSelector from './ProjectSelector';
import { ProjectPage, ProjectHeader } from './Styles';
import Sprints from './Sprints';
import Summary from './Summary';

const Project = () => {
  const match = useRouteMatch();
  const history = useHistory();
  const [key, setKey] = useState(0); // Add a key state to force re-render

  const issueSearchModalHelpers = createQueryParamModalHelpers('issue-search');
  const issueCreateModalHelpers = createQueryParamModalHelpers('issue-create');

  const [{ data, error, setLocalData }, fetchProject] = useApi.get(`/projects/${match.params.projectId}`, {}, { cachePolicy: 'no-cache' });

  // Add logging to debug the data flow
  console.log('Project data:', data);
  console.log('Project error:', error);
  console.log('Project ID from URL:', match.params.projectId);

  // Refetch project data when project ID changes
  useEffect(() => {
    fetchProject();
    setKey(prevKey => prevKey + 1); // Increment key to force re-render
  }, [match.params.projectId, fetchProject]);

  // Show loader while data is being fetched
  if (!data) {
    console.log('No data yet, showing loader');
    return <PageLoader />;
  }
  
  // Show error if there's an error or no project data
  if (error) {
    console.log('Error loading project:', error);
    return <PageError error={error} />;
  }

  if (!data.project) {
    console.log('No project data in response');
    return <PageError error={{ message: 'Project not found' }} />;
  }

  const { project } = data;
  console.log('Project loaded successfully:', project);

  const updateLocalProjectIssues = (issueId, updatedFields) => {
    setLocalData(currentData => ({
      project: {
        ...currentData.project,
        issues: updateArrayItemById(currentData.project.issues, issueId, updatedFields),
      },
    }));
  };

  return (
    <ProjectPage>
      <NavbarLeft
        issueSearchModalOpen={issueSearchModalHelpers.open}
        issueCreateModalOpen={issueCreateModalHelpers.open}
      />

      <Sidebar project={project} />

      {issueSearchModalHelpers.isOpen() && (
        <Modal
          isOpen
          testid="modal:issue-search"
          variant="aside"
          width={600}
          onClose={issueSearchModalHelpers.close}
          renderContent={() => <IssueSearch project={project} />}
        />
      )}

      {issueCreateModalHelpers.isOpen() && (
        <Modal
          isOpen
          testid="modal:issue-create"
          width={800}
          withCloseIcon={false}
          onClose={issueCreateModalHelpers.close}
          renderContent={modal => (
            <IssueCreate
              project={project}
              fetchProject={fetchProject}
              onCreate={() => history.push(`${match.url}/board`)}
              modalClose={modal.close}
            />
          )}
        />
      )}

      <Route
        path={`${match.path}/board`}
        render={() => (
          <Board
            key={key} // Add key prop to force re-render
            project={project}
            fetchProject={fetchProject}
            updateLocalProjectIssues={updateLocalProjectIssues}
          />
        )}
      />

      <Route
        path={`${match.path}/settings`}
        render={() => <ProjectSettings project={project} fetchProject={fetchProject} />}
      />

      <Route
        path={`${match.path}/sprints`}
        render={() => <Sprints project={project} fetchProject={fetchProject} />}
      />

      <Route
        path={`${match.path}/summary`}
        render={() => <Summary project={project} fetchProject={fetchProject} />}
      />

      {match.isExact && <Redirect to={`${match.url}/board`} />}
    </ProjectPage>
  );
};

export default Project;
