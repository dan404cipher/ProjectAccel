import { Project, Sprint, IIssue } from 'entities';
import { catchErrors } from 'errors';
import { issuePartial } from 'serializers/issues';
import mongoose from 'mongoose';
import { createProjectSchema } from 'schemas/Project';
import { validateSchema } from 'middleware/validateSchema';

export const getProjects = catchErrors(async (_req, res) => {
  const projects = await Project.find().populate('users');
  res.respond({ projects });
});

export const getProjectWithUsersAndIssues = catchErrors(async (req, res) => {
  const projectId = req.params.projectId;
  console.log('Fetching project with ID:', projectId);

  if (!projectId || typeof projectId !== 'string') {
    console.error('Invalid project ID:', projectId);
    throw new Error('Project ID is required');
  }

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    console.error('Invalid MongoDB ObjectId:', projectId);
    return res.status(400).json({ error: 'Invalid project ID format' });
  }

  const project = await Project.findById(projectId)
    .populate('users', 'name email avatarUrl')
    .populate('issues')
    .populate('sprints');
  
  console.log('Found project:', project ? 'yes' : 'no');

  if (!project) {
    console.error('Project not found for ID:', projectId);
    throw new Error('Project not found');
  }

  const projectObj = project.toObject();
  const issues = (projectObj.issues || []) as unknown as IIssue[];
  
  // Ensure consistent response structure
  const response = {
    project: {
      ...projectObj,
      id: projectObj._id, // Add id field for backward compatibility
      _id: projectObj._id, // Keep _id for MongoDB compatibility
      issues: issues.map(issuePartial),
      users: projectObj.users || [],
      sprints: projectObj.sprints || []
    }
  };

  console.log('Sending response:', JSON.stringify(response, null, 2));
  res.respond(response);
});

export const create = [
  validateSchema(createProjectSchema),
  catchErrors(async (req, res) => {
    try {
      const project = await Project.create({
        ...req.body,
        users: [], // Create project without requiring users
      });
      
      const populatedProject = await project.populate('users');
      res.respond({ project: populatedProject });
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  })
];

export const update = catchErrors(async (req, res) => {
  console.log('Update project request:', {
    params: req.params,
    body: req.body
  });

  const projectId = req.params.projectId;
  if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
    console.error('Invalid project ID:', projectId);
    throw new Error('Invalid project ID');
  }

  const project = await Project.findByIdAndUpdate(
    projectId,
    { $set: req.body },
    { new: true }
  ).populate('users');

  if (!project) {
    console.error('Project not found:', projectId);
    throw new Error('Project not found');
  }

  console.log('Updated project:', project);
  res.respond({ project });
});

export const createSprint = catchErrors(async (req, res) => {
  const sprint = await Sprint.create({
    ...req.body,
    projectId: req.body.projectId,
  });
  res.respond({ sprint });
});

export const updateSprint = catchErrors(async (req, res) => {
  const sprint = await Sprint.findByIdAndUpdate(req.body.sprintId, req.body, { new: true });
  if (!sprint) {
    throw new Error('Sprint not found');
  }
  res.respond({ sprint });
});

export const getProjectSummary = catchErrors(async (req, res) => {
  const projectId = req.params.projectId || req.query.projectId;
  if (!projectId) throw new Error('Project ID is required');
  if (!mongoose.Types.ObjectId.isValid(projectId.toString())) {
    return res.status(400).json({ error: 'Invalid project ID format' });
  }
  // Get project with issues and users
  const project = await Project.findById(projectId.toString()).populate('issues users');
  if (!project) throw new Error('Project not found');

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const issues = project.issues as unknown as IIssue[];

  // Top stats
  const completed = issues.filter(i => i.status === 'done' && new Date(i.updatedAt) > sevenDaysAgo).length;
  const updated = issues.filter(i => new Date(i.updatedAt) > sevenDaysAgo).length;
  const created = issues.filter(i => new Date(i.createdAt) > sevenDaysAgo).length;

  // Status breakdown
  const statusBreakdown: { [key: string]: number } = {};
  for (const issue of issues) {
    statusBreakdown[issue.status] = (statusBreakdown[issue.status] || 0) + 1;
  }

  // Priority breakdown
  const priorityBreakdown: { [key: string]: number } = {};
  for (const issue of issues) {
    priorityBreakdown[issue.priority] = (priorityBreakdown[issue.priority] || 0) + 1;
  }

  // Type breakdown
  const typeBreakdown: { [key: string]: number } = {};
  for (const issue of issues) {
    typeBreakdown[issue.type] = (typeBreakdown[issue.type] || 0) + 1;
  }

  // Team workload
  const teamWorkload: { [key: string]: number } = {};
  for (const user of project.users) {
    teamWorkload[user.id.toString()] = 0;
  }
  for (const issue of issues) {
    if (issue.users) {
      for (const uid of issue.users) {
        if (teamWorkload[uid.toString()] !== undefined) teamWorkload[uid.toString()] += 1;
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
