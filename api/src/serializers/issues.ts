import { pick } from 'lodash';
import { IIssue } from 'entities';

export const issuePartial = (issue: IIssue): Partial<IIssue> =>
  pick(issue, [
    'id',
    'title',
    'type',
    'status',
    'priority',
    'listPosition',
    'createdAt',
    'updatedAt',
    'users',
  ]);
