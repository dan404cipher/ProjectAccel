import React from 'react';
import { Router, Switch, Route, Redirect } from 'react-router-dom';

import history from 'browserHistory';
import Project from 'Project';
import Authenticate from 'Auth/Authenticate';
import PageError from 'shared/components/PageError';
import CreateProject from 'Project/CreateProject';

const Routes = () => (
  <Router history={history}>
    <Switch>
      <Redirect exact from="/" to="/project" />
      <Route path="/authenticate" component={Authenticate} />
      <Route path="/project/create" component={CreateProject} />
      <Route path="/project/:projectId" component={Project} />
      <Route exact path="/project" component={Project} />
      <Route component={PageError} />
    </Switch>
  </Router>
);

export default Routes;
