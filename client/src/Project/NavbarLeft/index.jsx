import React from 'react';
import PropTypes from 'prop-types';

import { Icon, AboutTooltip } from 'shared/components';
import { useHistory } from 'react-router-dom';

import { NavLeft, LogoLink, StyledLogo, Bottom, Item, ItemText } from './Styles';

const propTypes = {
  issueSearchModalOpen: PropTypes.func.isRequired,
  issueCreateModalOpen: PropTypes.func.isRequired,
};

const ProjectNavbarLeft = ({ issueSearchModalOpen, issueCreateModalOpen }) => {
  const history = useHistory();
  return (
    <NavLeft>
      <LogoLink to="/">
        <StyledLogo color="#fff" />
      </LogoLink>

      <Item onClick={issueSearchModalOpen}>
        <Icon type="search" size={22} top={1} left={3} />
        <ItemText>Search issues</ItemText>
      </Item>

      <Item onClick={() => history.push('/project/create')}>
        <Icon type="plus" size={27} />
        <ItemText>Create Project</ItemText>
      </Item>

      <Item onClick={issueCreateModalOpen}>
        <Icon type="plus" size={27} />
        <ItemText>Create Issue</ItemText>
      </Item>

      <Bottom>
        <AboutTooltip
          placement="right"
          offset={{ top: -218 }}
          renderLink={linkProps => (
            <Item {...linkProps}>
              <Icon type="help" size={25} />
              <ItemText>About</ItemText>
            </Item>
          )}
        />
      </Bottom>
    </NavLeft>
  );
};

ProjectNavbarLeft.propTypes = propTypes;

export default ProjectNavbarLeft;
