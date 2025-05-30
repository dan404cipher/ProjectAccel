import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import { ProjectCategoryCopy } from 'shared/constants/projects';
import { Icon, ProjectAvatar } from 'shared/components';

import ProjectSelector from '../ProjectSelector';
import {
  Sidebar,
  ProjectInfo,
  ProjectTexts,
  ProjectName,
  ProjectCategory,
  Divider,
  LinkItem,
  LinkText,
  NotImplemented,
} from './Styles';

const propTypes = {
  project: PropTypes.object.isRequired,
};

const ProjectSidebar = ({ project }) => {
  const projectId = project.id;

  return (
    <Sidebar>
      <ProjectInfo>
        <ProjectAvatar />
        <ProjectTexts>
          <ProjectName>{project.name}</ProjectName>
          <ProjectCategory>{ProjectCategoryCopy[project.category]} project</ProjectCategory>
        </ProjectTexts>
      </ProjectInfo>
      <ProjectSelector currentProject={project} label="Projects" sidebar />
      <Divider />
      {renderLinkItem(projectId, 'Kanban Board', 'board', '/board')}
      {renderLinkItem(projectId, 'Project settings', 'settings', '/settings')}
      <Divider />
      {renderLinkItem(projectId, 'Summary', 'reports', '/summary')}
      {renderLinkItem(projectId, 'Backlog', 'issues', '/backlog')}
      {renderLinkItem(projectId, 'Calendar', 'calendar', '/calendar')}
      {renderLinkItem(projectId, 'List', 'issues', '/list')}
      {renderLinkItem(projectId, 'Sprints', 'stopwatch', '/sprints')}
      {renderLinkItem(projectId, 'Releases', 'shipping')}
      {renderLinkItem(projectId, 'Issues and filters', 'issues')}
      {renderLinkItem(projectId, 'Pages', 'page')}
      {renderLinkItem(projectId, 'Reports', 'reports')}
      {renderLinkItem(projectId, 'Components', 'component')}
    </Sidebar>
  );
};

const renderLinkItem = (projectId, text, iconType, path) => {
  const isImplemented = !!path;

  const linkItemProps = isImplemented
    ? { as: NavLink, exact: true, to: path ? `/project/${projectId}${path}` : '#' }
    : { as: 'div' };

  return (
    <LinkItem {...linkItemProps}>
      <Icon type={iconType} />
      <LinkText>{text}</LinkText>
      {!isImplemented && <NotImplemented>Not implemented</NotImplemented>}
    </LinkItem>
  );
};

ProjectSidebar.propTypes = propTypes;

export default ProjectSidebar;
