import styled from 'styled-components';

import { color, font, mixin } from 'shared/utils/styles';

export const SprintManagerContainer = styled.div`
  padding: 20px;
  background: ${color.backgroundLightest};
  border-radius: 3px;
`;

export const SprintHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h2 {
    ${font.size(20)};
    ${font.medium};
  }
`;

export const SprintList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const SprintItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: ${color.backgroundLight};
  border-radius: 3px;
  ${mixin.boxShadowLight};

  h3 {
    ${font.size(16)};
    ${font.medium};
    margin-bottom: 5px;
  }

  p {
    ${font.size(14)};
    color: ${color.textMedium};
  }
`; 