import styled, { css } from 'styled-components';

import { color } from 'shared/utils/styles';

export const ProjectSelectorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 0 16px;
  height: 100%;
  background: ${color.backgroundLight};
  border-right: 1px solid ${color.borderLightest};

  ${props =>
    props.sidebar &&
    css`
      background: none;
      border: none;
      padding: 8px 0 0 0;
      margin-bottom: 8px;
      height: auto;
    `}
`; 