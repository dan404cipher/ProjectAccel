import { Request, Response } from 'express';
import { Issue, Project } from '../entities';
import { NotFoundError } from '../errors';
import { validateSchema } from '../middleware/validateSchema';
import { createIssueSchema, updateIssueSchema } from '../schemas/Issue';
import { catchErrors } from '../errors/asyncCatch';

export const getIssues = async (req: Request, res: Response) => {
  const { projectId } = req.query;
  const { searchTerm, status, type, priority } = req.query;

  const query: any = {};

  if (projectId) {
    query.projectId = projectId;
  }

  if (searchTerm) {
    query.$or = [
      { title: { $regex: searchTerm, $options: 'i' } },
      { description: { $regex: searchTerm, $options: 'i' } }
    ];
  }

  if (status) {
    query.status = status;
  }

  if (type) {
    query.type = type;
  }

  if (priority) {
    query.priority = priority;
  }

  const issues = await Issue.find(query)
    .populate('users', 'name email avatarUrl')
    .populate('comments')
    .populate({
      path: 'comments',
      populate: {
        path: 'user',
        select: 'name email avatarUrl'
      }
    })
    .sort({ listPosition: 1 });

  res.json(issues);
};

export const getIssue = async (req: Request, res: Response) => {
  const issue = await Issue.findById(req.params.issueId)
    .populate('users', 'name email avatarUrl')
    .populate('comments')
    .populate({
      path: 'comments',
      populate: {
        path: 'user',
        select: 'name email avatarUrl'
      }
    });

  if (!issue) {
    throw new NotFoundError('Issue not found');
  }

  res.json(issue);
};

export const createIssue = [
  validateSchema(createIssueSchema),
  catchErrors(async (req: Request, res: Response) => {
    console.log('Creating issue with data:', req.body);

    const { title, type, status, priority, listPosition, description, estimate, timeSpent, reporterId, projectId, users } = req.body;

    // Validate project exists
    const project = await Project.findById(projectId);
    if (!project) {
      console.error('Project not found:', projectId);
      throw new NotFoundError('Project not found');
    }

    const issue = await Issue.create({
      title,
      type,
      status,
      priority,
      listPosition,
      description,
      estimate,
      timeSpent,
      reporterId,
      projectId,
      users
    });

    await issue.populate('users', 'name email avatarUrl');
    console.log('Created issue:', issue);

    res.status(201).json(issue);
  })
];

export const updateIssue = [
  validateSchema(updateIssueSchema),
  async (req: Request, res: Response) => {
    const { title, type, status, priority, listPosition, description, estimate, timeSpent, reporterId, projectId, users } = req.body;

    const issue = await Issue.findByIdAndUpdate(
      req.params.issueId,
      {
        title,
        type,
        status,
        priority,
        listPosition,
        description,
        estimate,
        timeSpent,
        reporterId,
        projectId,
        users
      },
      { new: true }
    ).populate('users', 'name email avatarUrl');

    if (!issue) {
      throw new NotFoundError('Issue not found');
    }

    res.json(issue);
  }
];

export const deleteIssue = async (req: Request, res: Response) => {
  const issue = await Issue.findByIdAndDelete(req.params.issueId);

  if (!issue) {
    throw new NotFoundError('Issue not found');
  }

  res.status(204).send();
};
