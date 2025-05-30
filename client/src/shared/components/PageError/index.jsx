import React from 'react';
import PropTypes from 'prop-types';

import { ErrorPage, ErrorPageInner, ErrorBox, StyledIcon, Title } from './Styles';

const PageError = ({ error }) => (
  <ErrorPage>
    <ErrorPageInner>
      <ErrorBox>
        <StyledIcon type="bug" />
        <Title>There's been a glitch…</Title>
        <p>
          {error?.message || "We're not quite sure what went wrong. Please try again or contact support."}
        </p>
        {error?.code && <p>Error code: {error.code}</p>}
      </ErrorBox>
    </ErrorPageInner>
  </ErrorPage>
);

PageError.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string,
    code: PropTypes.string,
  }),
};

PageError.defaultProps = {
  error: null,
};

export default PageError;
