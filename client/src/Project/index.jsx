import React from 'react';
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

  console.log('Current route match:', match); // Debug log

  const issueSearchModalHelpers = createQueryParamModalHelpers('issue-search');
  const issueCreateModalHelpers = createQueryParamModalHelpers('issue-create');

  const [{ data, error, setLocalData }, fetchProject] = useApi.get(
    match.params.projectId ? '/projects/:projectId' : '/projects',
    match.params.projectId ? { projectId: match.params.projectId } : {},
    {
      onSuccess: (response) => {
        console.log('Project data:', response); // Debug log
      },
      onError: (error) => {
        console.error('Project fetch error:', error); // Debug log
      }
    }
  );

  console.log('Component state:', { data, error, match }); // Debug log

  // If we're at /project without an ID, show project selector
  if (!match.params.projectId) {
    console.log('Rendering project selector'); // Debug log
    return (
      <ProjectPage>
        <NavbarLeft
          issueSearchModalOpen={issueSearchModalHelpers.open}
          issueCreateModalOpen={issueCreateModalHelpers.open}
        />
        <div style={{ marginLeft: 60, padding: 32 }}>
          <h1>Select a Project</h1>
          <ProjectSelector currentProject={data?.project} />
        </div>
      </ProjectPage>
    );
  }

  if (!data) {
    console.log('Loading...'); // Debug log
    return <PageLoader />;
  }
  
  if (error) {
    console.log('Error:', error); // Debug log
    return <PageError />;
  }

  const { project } = data;
  console.log('Project data:', project); // Debug log

  // If project not found, redirect to project selector
  if (!project) {
    console.log('Project not found, redirecting to selector'); // Debug log
    return <Redirect to="/project" />;
  }

  const updateLocalProjectIssues = (issueId, updatedFields) => {
    setLocalData(currentData => ({
      project: {
        ...currentData.project,
        issues: updateArrayItemById(currentData.project.issues, issueId, updatedFields),
      },
    }));
  };

  // If we're at the exact project path (e.g., /project/123), redirect to board
  if (match.isExact) {
    console.log('Redirecting to board view'); // Debug log
    return <Redirect to={`/project/${project.id}/board`} />;
  }

  console.log('Rendering project view'); // Debug log
  return (
    <ProjectPage>
      <NavbarLeft
        issueSearchModalOpen={issueSearchModalHelpers.open}
        issueCreateModalOpen={issueCreateModalHelpers.open}
      />

      {project && <Sidebar project={project} />}

      {issueSearchModalHelpers.isOpen() && project && (
        <Modal
          isOpen
          testid="modal:issue-search"
          variant="aside"
          width={600}
          onClose={issueSearchModalHelpers.close}
          renderContent={() => <IssueSearch project={project} />}
        />
      )}

      {issueCreateModalHelpers.isOpen() && project && (
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
              onCreate={() => {
                if (project && project.id) {
                  history.push(`/project/${project.id}/board`);
                }
              }}
              modalClose={modal.close}
            />
          )}
        />
      )}

      <Route
        path={`${match.path}/board`}
        render={() => project && (
          <Board
            project={project}
            fetchProject={fetchProject}
            updateLocalProjectIssues={updateLocalProjectIssues}
          />
        )}
      />

      <Route
        path={`${match.path}/settings`}
        render={() => project && <ProjectSettings project={project} fetchProject={fetchProject} />}
      />

      <Route
        path={`${match.path}/sprints`}
        render={() => project && <Sprints project={project} fetchProject={fetchProject} />}
      />

      <Route
        path={`${match.path}/summary`}
        render={() => project && <Summary project={project} fetchProject={fetchProject} />}
      />
    </ProjectPage>
  );
};

export default Project;
