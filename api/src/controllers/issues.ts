import { Issue } from 'entities';
import { catchErrors } from 'errors';
import { updateEntity, deleteEntity, createEntity, findEntityOrThrow } from 'utils/typeorm';

interface NewIssue {
  projectId: number;
  [key: string]: any;
}

const calculateListPosition = async (newIssue: NewIssue): Promise<number> => {
  const issues = await Issue.find({
    where: { projectId: newIssue.projectId },
    order: { listPosition: 'DESC' },
    take: 1,
  });

  const maxListPosition = issues.length > 0 ? issues[0].listPosition : 0;
  return maxListPosition + 1;
};

export const getProjectIssues = catchErrors(async (req, res) => {
  const { currentProjectId } = req.currentUser;
  const { searchTerm } = req.query;

  let whereSQL = 'issue.projectId = :projectId';

  if (searchTerm) {
    whereSQL += ' AND (issue.title ILIKE :searchTerm OR issue.descriptionText ILIKE :searchTerm)';
  }

  const issues = await Issue.createQueryBuilder('issue')
    .select()
    .where(whereSQL, { projectId: currentProjectId, searchTerm: `%${searchTerm}%` })
    .getMany();

  res.respond({ issues });
});

export const getIssueWithUsersAndComments = catchErrors(async (req, res) => {
  const issue = await findEntityOrThrow(Issue, req.params.issueId, {
    relations: ['users', 'comments', 'comments.user'],
  });
  res.respond({ issue });
});

export const create = catchErrors(async (req, res) => {
  const listPosition = await calculateListPosition({
    ...req.body,
    projectId: req.currentUser.currentProjectId,
  });
  const issue = await createEntity(Issue, {
    ...req.body,
    projectId: req.currentUser.currentProjectId,
    listPosition,
  });
  res.respond({ issue });
});

export const update = catchErrors(async (req, res) => {
  const issue = await updateEntity(Issue, req.params.issueId, req.body);
  res.respond({ issue });
});

export const remove = catchErrors(async (req, res) => {
  await deleteEntity(Issue, req.params.issueId);
  res.respond({});
});
