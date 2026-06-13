import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { sendSuccess } from '../../utils/response.util.js';
import {
  createIssue,
  deleteIssue,
  getAllIssues,
  getIssueById,
  updateIssue,
} from './issues.service.js';
import {
  validateCreateIssueBody,
  validateIssueFilters,
  validateIssueId,
  validateUpdateIssueBody,
} from './issues.validation.js';

export async function createIssueHandler(req: Request, res: Response): Promise<void> {
  const validatedBody = validateCreateIssueBody(req.body);
  const reporterId = req.user!.id;
  const issue = await createIssue(validatedBody, reporterId);
  sendSuccess(res, StatusCodes.CREATED, 'Issue created successfully', issue);
}

export async function getAllIssuesHandler(req: Request, res: Response): Promise<void> {
  const filters = validateIssueFilters(req.query as Record<string, unknown>);
  const issues = await getAllIssues(filters);
  sendSuccess(res, StatusCodes.OK, 'Issues retrieved successfully', issues);
}

export async function getIssueByIdHandler(req: Request, res: Response): Promise<void> {
  const id = validateIssueId(req.params.id!);
  const issue = await getIssueById(id);
  sendSuccess(res, StatusCodes.OK, 'Issue retrieved successfully', issue);
}

export async function updateIssueHandler(req: Request, res: Response): Promise<void> {
  const id = validateIssueId(req.params.id!);
  const validatedBody = validateUpdateIssueBody(req.body);
  const issue = await updateIssue(id, validatedBody, req.user!);
  sendSuccess(res, StatusCodes.OK, 'Issue updated successfully', issue);
}

export async function deleteIssueHandler(req: Request, res: Response): Promise<void> {
  const id = validateIssueId(req.params.id!);
  await deleteIssue(id);
  sendSuccess(res, StatusCodes.OK, 'Issue deleted successfully', null);
}