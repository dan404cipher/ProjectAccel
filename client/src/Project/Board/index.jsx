import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Route, useParams, useNavigate, useLocation } from 'react-router-dom';

import useMergeState from 'shared/hooks/mergeState';
import { Breadcrumbs, Modal } from 'shared/components';

import Header from './Header';
import Filters from './Filters';
import Lists from './Lists';
import IssueDetails from './IssueDetails';

const propTypes = {
  project: PropTypes.object.isRequired,
  fetchProject: PropTypes.func.isRequired,
  updateLocalProjectIssues: PropTypes.func.isRequired,
};

const defaultFilters = {
  searchTerm: '',
  userIds: [],
  myOnly: false,
  recent: false,
};

const ProjectBoard = ({ project, fetchProject, updateLocalProjectIssues }) => {
  console.log('Board component rendering with project:', project); // Debug log

  const { issueId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [filters, mergeFilters] = useMergeState(defaultFilters);

  return (
    <Fragment>
      <Breadcrumbs items={['Projects', project.name, 'Kanban Board']} />
      <Header />
      <Filters
        projectUsers={project.users}
        defaultFilters={defaultFilters}
        filters={filters}
        mergeFilters={mergeFilters}
      />
      <Lists
        project={project}
        filters={filters}
        updateLocalProjectIssues={updateLocalProjectIssues}
      />
      {issueId && (
        <Modal
          isOpen
          testid="modal:issue-details"
          width={1040}
          withCloseIcon={false}
          onClose={() => navigate(location.pathname.replace(`/issues/${issueId}`, ''))}
          renderContent={modal => (
            <IssueDetails
              issueId={issueId}
              projectUsers={project.users}
              fetchProject={fetchProject}
              updateLocalProjectIssues={updateLocalProjectIssues}
              modalClose={modal.close}
            />
          )}
        />
      )}
    </Fragment>
  );
};

ProjectBoard.propTypes = propTypes;

export default ProjectBoard;
