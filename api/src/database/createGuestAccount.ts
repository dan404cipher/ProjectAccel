import { User, IUser, Project, IProject, Issue, IIssue, Comment, IComment } from '../entities';
import { IssueType, IssueStatus, IssuePriority } from '../constants/issues';
import { ProjectCategory } from '../constants/projects';

const seedUsers = (): Promise<IUser[]> => {
  const users = [
    {
      name: 'Demo User',
      email: 'demo@example.com',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
    },
    {
      name: 'Demo User 2',
      email: 'demo2@example.com',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo2',
    },
  ];

  return Promise.all(users.map(user => User.create(user)));
};

const seedProject = (users: IUser[]): Promise<IProject> =>
  Project.create({
    name: 'Demo Project',
    url: 'https://example.com',
    description: 'This is a demo project',
    category: ProjectCategory.SOFTWARE,
    users: users.map(user => user._id),
  });

const seedIssues = (project: IProject): Promise<IIssue[]> => {
  const issues = [
    {
      title: 'Setup project documentation',
      type: IssueType.TASK,
      status: IssueStatus.BACKLOG,
      priority: IssuePriority.HIGH,
      listPosition: 1,
      description: 'Document the project setup and requirements',
      estimate: 2,
      timeSpent: 0,
      reporterId: project.users[0],
      projectId: project._id,
      users: [project.users[0]],
    },
    {
      title: 'Design system architecture',
      type: IssueType.TASK,
      status: IssueStatus.BACKLOG,
      priority: IssuePriority.LOW,
      listPosition: 2,
      description: 'Create the initial system architecture design',
      estimate: 4,
      timeSpent: 0,
      reporterId: project.users[0],
      projectId: project._id,
      users: [project.users[0]],
    },
    {
      title: 'Implement authentication',
      type: IssueType.STORY,
      status: IssueStatus.BACKLOG,
      priority: IssuePriority.MEDIUM,
      listPosition: 3,
      description: 'Add user authentication and authorization',
      estimate: 3,
      timeSpent: 0,
      reporterId: project.users[0],
      projectId: project._id,
    },
    {
      title: 'Create database schema',
      type: IssueType.STORY,
      status: IssueStatus.BACKLOG,
      priority: IssuePriority.LOWEST,
      listPosition: 4,
      description: 'Design and implement the database schema',
      estimate: 2,
      timeSpent: 0,
      reporterId: project.users[0],
      projectId: project._id,
      users: [project.users[0]],
    },
    {
      title: 'Setup CI/CD pipeline',
      type: IssueType.TASK,
      status: IssueStatus.SELECTED,
      priority: IssuePriority.HIGHEST,
      listPosition: 5,
      description: 'Configure continuous integration and deployment',
      estimate: 3,
      timeSpent: 0,
      reporterId: project.users[0],
      projectId: project._id,
    },
    {
      title: 'Implement API endpoints',
      type: IssueType.STORY,
      status: IssueStatus.SELECTED,
      priority: IssuePriority.HIGH,
      listPosition: 6,
      description: 'Create RESTful API endpoints',
      estimate: 5,
      timeSpent: 0,
      reporterId: project.users[0],
      projectId: project._id,
      users: [project.users[0]],
    },
    {
      title: 'Add error handling',
      type: IssueType.TASK,
      status: IssueStatus.INPROGRESS,
      priority: IssuePriority.LOWEST,
      listPosition: 7,
      description: 'Implement global error handling',
      estimate: 2,
      timeSpent: 0,
      reporterId: project.users[0],
      projectId: project._id,
    },
    {
      title: 'Write unit tests',
      type: IssueType.TASK,
      status: IssueStatus.DONE,
      priority: IssuePriority.MEDIUM,
      listPosition: 8,
      description: 'Add unit tests for core functionality',
      estimate: 4,
      timeSpent: 4,
      reporterId: project.users[0],
      projectId: project._id,
      users: [project.users[0]],
    },
  ];

  return Promise.all(issues.map(issue => Issue.create(issue)));
};

const seedComments = (issues: IIssue[], users: IUser[]): Promise<IComment[]> => {
  const comments = issues.map(issue =>
    Comment.create({
      body: 'This is a demo comment',
      userId: users[0]._id,
      issueId: issue._id,
    })
  );

  return Promise.all(comments);
};

const createGuestAccount = async (): Promise<IUser> => {
  const users = await seedUsers();
  const project = await seedProject(users);
  const issues = await seedIssues(project);
  await seedComments(issues, users);

  return users[0];
};

export default createGuestAccount;
