import React from 'react';
import { Router, Switch, Route, Redirect } from 'react-router-dom';

import history from 'browserHistory';
import Project from 'Project';
import Authenticate from 'Auth/Authenticate';
import PageError from 'shared/components/PageError';
import CreateProject from 'Project/CreateProject';

const Routes = () => {
  console.log('Routes component rendering'); // Debug log

  return (
    <Router history={history}>
      <Switch>
        <Redirect exact from="/" to="/project" />
        <Route path="/authenticate" component={Authenticate} />
        <Route path="/project/create" component={CreateProject} />
        <Route 
          path="/project/:projectId/board" 
          render={(props) => {
            console.log('Board route matched:', props); // Debug log
            return <Project {...props} />;
          }} 
        />
        <Route path="/project/:projectId/settings" component={Project} />
        <Route path="/project/:projectId/sprints" component={Project} />
        <Route path="/project/:projectId/summary" component={Project} />
        <Route path="/project/:projectId" component={Project} />
        <Route exact path="/project" component={Project} />
        <Route component={PageError} />
      </Switch>
    </Router>
  );
};

export default Routes;
