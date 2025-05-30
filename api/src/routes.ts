import { Express } from 'express';
import * as auth from 'controllers/auth';
import * as projects from 'controllers/projects';
import * as issues from 'controllers/issues';
import * as comments from 'controllers/comments';
import * as users from 'controllers/users';

export const setupRoutes = (app: Express): void => {
  // Auth routes
  app.post('/auth/login', auth.login);
  app.post('/auth/register', auth.register);
  app.post('/auth/logout', auth.logout);

  // Project routes
  app.get('/projects', projects.getProjects);
  app.get('/projects/:projectId', projects.getProjectWithUsersAndIssues);
  app.post('/projects', projects.create);
  app.patch('/projects/:projectId', projects.update);
  app.get('/projects/:projectId/summary', projects.getProjectSummary);

  // Sprint routes
  app.post('/projects/:projectId/sprints', projects.createSprint);
  app.patch('/projects/:projectId/sprints/:sprintId', projects.updateSprint);

  // Issue routes
  app.get('/issues', issues.getIssues);
  app.get('/issues/:issueId', issues.getIssue);
  app.post('/issues', issues.createIssue);
  app.patch('/issues/:issueId', issues.updateIssue);
  app.delete('/issues/:issueId', issues.deleteIssue);

  // Comment routes
  app.post('/comments', comments.create);
  app.patch('/comments/:commentId', comments.update);
  app.delete('/comments/:commentId', comments.remove);

  // User routes
  app.get('/users', users.getCurrentUser);
};
