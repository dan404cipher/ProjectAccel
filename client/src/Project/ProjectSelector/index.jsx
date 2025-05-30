import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

import useApi from 'shared/hooks/api';
import { Select } from 'shared/components';

import { ProjectSelectorContainer } from './Styles';

const ProjectSelector = ({ currentProject, label, sidebar }) => {
  const history = useHistory();
  const [{ data }] = useApi.get('/projects');

  const handleProjectChange = (projectId) => {
    console.log('Selected project ID:', projectId); // Debug log
    if (projectId) {
      const newPath = `/project/${projectId}/board`;
      console.log('Navigating to:', newPath); // Debug log
      history.push(newPath);
    }
  };

  if (!data) return null;

  const { projects } = data;
  const projectOptions = projects.map(project => ({
    value: project.id,
    label: project.name,
  }));

  return (
    <ProjectSelectorContainer sidebar={sidebar}>
      {label && <div style={{ fontWeight: 500, marginBottom: 4, fontSize: 13 }}>{label}</div>}
      <Select
        variant={sidebar ? 'normal' : 'empty'}
        dropdownWidth={200}
        withClearValue={false}
        name="project"
        value={currentProject?.id}
        options={projectOptions}
        onChange={handleProjectChange}
        placeholder="Select a project"
        renderValue={({ value }) => {
          const selectedProject = projectOptions.find(option => option.value === value);
          return selectedProject ? selectedProject.label : 'Select a project';
        }}
      />
    </ProjectSelectorContainer>
  );
};

ProjectSelector.propTypes = {
  currentProject: PropTypes.object,
  label: PropTypes.string,
  sidebar: PropTypes.bool,
};

ProjectSelector.defaultProps = {
  currentProject: undefined,
  label: undefined,
  sidebar: false,
};

export default ProjectSelector; 