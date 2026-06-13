import { StatusCodes } from 'http-status-codes';
import { AppError } from '../../utils/AppError.js';

import {
  deleteIssueById,
  findAllIssues,
  findIssueById,
  findReportersByIds,
  insertIssue,
  updateIssueById,
} from './issues.queries.js';
import type { CreateIssueBody, IssueFilters, IssueRecord, IssueWithReporter, ReporterInfo, UpdateIssueBody } from './issues.types.js';
import type { JwtPayload } from '../../utils/jwt.util.js';


function attachReporter(issue: IssueRecord, reporterMap: Map<number, ReporterInfo>): IssueWithReporter {
  const { reporter_id, ...rest } = issue;
  const reporter =
    reporterMap.get(reporter_id) ?? { id: reporter_id, name: 'Unknown User', role: 'unknown' };
  return { ...rest, reporter };
}

export async function createIssue(
  body: CreateIssueBody,
  reporterId: number
): Promise<IssueRecord> {
  return insertIssue({ ...body, reporterId });
}

export async function getAllIssues(filters: IssueFilters): Promise<IssueWithReporter[]> {
  const issues = await findAllIssues(filters);
  if (issues.length === 0) return [];

  const reporterIds = issues.map((issue) => issue.reporter_id);
  const reporters = await findReportersByIds(reporterIds);
  const reporterMap = new Map(reporters.map((r) => [r.id, r]));

  return issues.map((issue) => attachReporter(issue, reporterMap));
}

export async function getIssueById(id: number): Promise<IssueWithReporter> {
  const issue = await findIssueById(id);
  if (!issue) {
    throw new AppError('Issue not found', StatusCodes.NOT_FOUND);
  }

  const reporters = await findReportersByIds([issue.reporter_id]);
  const reporterMap = new Map(reporters.map((r) => [r.id, r]));

  return attachReporter(issue, reporterMap);
}

export async function updateIssue(
  id: number,
  body: UpdateIssueBody,
  requester: JwtPayload
): Promise<IssueRecord> {
  const issue = await findIssueById(id);
  if (!issue) {
    throw new AppError('Issue not found', StatusCodes.NOT_FOUND);
  }

  const isMaintainer = requester.role === 'maintainer';
  const isOwner = issue.reporter_id === requester.id;

  if (!isMaintainer && !isOwner) {
    throw new AppError(
      'You do not have permission to update this issue',
      StatusCodes.FORBIDDEN
    );
  }

  if (body.status !== undefined && !isMaintainer) {
    throw new AppError(
      'Only maintainers can change the issue status',
      StatusCodes.FORBIDDEN
    );
  }

  if (!isMaintainer && isOwner && issue.status !== 'open') {
    throw new AppError(
      'This issue can no longer be edited because it is not open',
      StatusCodes.CONFLICT
    );
  }

  return updateIssueById(id, body);
}

export async function deleteIssue(id: number): Promise<void> {
  const issue = await findIssueById(id);
  if (!issue) {
    throw new AppError('Issue not found', StatusCodes.NOT_FOUND);
  }
  await deleteIssueById(id);
}