import { Project, Sprint } from 'entities';
import { catchErrors } from 'errors';
import { findEntityOrThrow, updateEntity, createEntity } from 'utils/typeorm';
import { issuePartial } from 'serializers/issues';

export const getProjects = catchErrors(async (_req, res) => {
  const projects = await Project.createQueryBuilder('project')
    .leftJoinAndSelect('project.users', 'user')
    .getMany();

  res.respond({ projects });
});

export const getProjectWithUsersAndIssues = catchErrors(async (req, res) => {
  const projectId = req.query.projectId;
  if (!projectId || typeof projectId !== 'string') {
    throw new Error('Project ID is required');
  }
  
  const project = await findEntityOrThrow(Project, projectId, {
    relations: ['users', 'issues', 'sprints'],
  });
  res.respond({
    project: {
      ...project,
      issues: project.issues.map(issuePartial),
    },
  });
});

export const create = catchErrors(async (req, res) => {
  const project = await createEntity(Project, {
    ...req.body,
    users: [req.currentUser],
  });
  res.respond({ project });
});

export const update = catchErrors(async (req, res) => {
  const project = await updateEntity(Project, req.body.projectId, req.body);
  res.respond({ project });
});

export const createSprint = catchErrors(async (req, res) => {
  const sprint = await createEntity(Sprint, {
    ...req.body,
    projectId: req.body.projectId,
  });
  res.respond({ sprint });
});

export const updateSprint = catchErrors(async (req, res) => {
  const sprint = await updateEntity(Sprint, req.body.sprintId, req.body);
  res.respond({ sprint });
});

export const getProjectSummary = catchErrors(async (req, res) => {
  const projectId = req.params.projectId || req.query.projectId;
  if (!projectId) throw new Error('Project ID is required');

  // Get project with issues and users
  const project = await Project.createQueryBuilder('project')
    .leftJoinAndSelect('project.issues', 'issue')
    .leftJoinAndSelect('project.users', 'user')
    .where('project.id = :projectId', { projectId })
    .getOne();
  if (!project) throw new Error('Project not found');

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Top stats
  const completed = project.issues.filter(i => i.status === 'done' && new Date(i.updatedAt) > sevenDaysAgo).length;
  const updated = project.issues.filter(i => new Date(i.updatedAt) > sevenDaysAgo).length;
  const created = project.issues.filter(i => new Date(i.createdAt) > sevenDaysAgo).length;

  // Status breakdown
  const statusBreakdown: { [key: string]: number } = {};
  for (const issue of project.issues) {
    statusBreakdown[issue.status] = (statusBreakdown[issue.status] || 0) + 1;
  }

  // Priority breakdown
  const priorityBreakdown: { [key: string]: number } = {};
  for (const issue of project.issues) {
    priorityBreakdown[issue.priority] = (priorityBreakdown[issue.priority] || 0) + 1;
  }

  // Type breakdown
  const typeBreakdown: { [key: string]: number } = {};
  for (const issue of project.issues) {
    typeBreakdown[issue.type] = (typeBreakdown[issue.type] || 0) + 1;
  }

  // Team workload
  const teamWorkload: { [key: string]: number } = {};
  for (const user of project.users) {
    teamWorkload[user.id] = 0;
  }
  for (const issue of project.issues) {
    if (issue.userIds) {
      for (const uid of issue.userIds) {
        if (teamWorkload[uid] !== undefined) teamWorkload[uid] += 1;
      }
    }
  }

  res.respond({
    completed,
    updated,
    created,
    statusBreakdown,
    priorityBreakdown,
    typeBreakdown,
    teamWorkload,
    // Add more as needed
  });
});
