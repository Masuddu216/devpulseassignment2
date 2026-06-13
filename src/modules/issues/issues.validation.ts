import { StatusCodes } from 'http-status-codes';
import { AppError } from '../../utils/AppError.js';
import type { CreateIssueBody, IssueFilters, IssueStatus, IssueType, UpdateIssueBody } from './issues.types.js';


const VALID_TYPES: IssueType[] = ['bug', 'feature_request'];
const VALID_STATUSES: IssueStatus[] = ['open', 'in_progress', 'resolved'];
const VALID_SORTS = ['newest', 'oldest'] as const;

const TITLE_MAX_LENGTH = 150;
const DESCRIPTION_MIN_LENGTH = 20;

export function validateCreateIssueBody(body: unknown): CreateIssueBody {
  const errors: string[] = [];

  if (typeof body !== 'object' || body === null) {
    throw new AppError('Request body is required', StatusCodes.BAD_REQUEST);
  }

  const { title, description, type } = body as Record<string, unknown>;

  if (typeof title !== 'string' || title.trim().length === 0) {
    errors.push('title is required and must be a non-empty string');
  } else if (title.length > TITLE_MAX_LENGTH) {
    errors.push(`title must not exceed ${TITLE_MAX_LENGTH} characters`);
  }

  if (typeof description !== 'string' || description.trim().length === 0) {
    errors.push('description is required and must be a non-empty string');
  } else if (description.trim().length < DESCRIPTION_MIN_LENGTH) {
    errors.push(`description must be at least ${DESCRIPTION_MIN_LENGTH} characters`);
  }

  if (typeof type !== 'string' || !VALID_TYPES.includes(type as IssueType)) {
    errors.push(`type must be one of: ${VALID_TYPES.join(', ')}`);
  }

  if (errors.length > 0) {
    throw new AppError('Validation failed', StatusCodes.BAD_REQUEST, errors);
  }

  return {
    title: (title as string).trim(),
    description: (description as string).trim(),
    type: type as IssueType,
  };
}

export function validateUpdateIssueBody(body: unknown): UpdateIssueBody {
  const errors: string[] = [];

  if (typeof body !== 'object' || body === null) {
    throw new AppError('Request body is required', StatusCodes.BAD_REQUEST);
  }

  const { title, description, type, status } = body as Record<string, unknown>;
  const result: UpdateIssueBody = {};

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim().length === 0) {
      errors.push('title must be a non-empty string');
    } else if (title.length > TITLE_MAX_LENGTH) {
      errors.push(`title must not exceed ${TITLE_MAX_LENGTH} characters`);
    } else {
      result.title = title.trim();
    }
  }

  if (description !== undefined) {
    if (typeof description !== 'string' || description.trim().length === 0) {
      errors.push('description must be a non-empty string');
    } else if (description.trim().length < DESCRIPTION_MIN_LENGTH) {
      errors.push(`description must be at least ${DESCRIPTION_MIN_LENGTH} characters`);
    } else {
      result.description = description.trim();
    }
  }

  if (type !== undefined) {
    if (typeof type !== 'string' || !VALID_TYPES.includes(type as IssueType)) {
      errors.push(`type must be one of: ${VALID_TYPES.join(', ')}`);
    } else {
      result.type = type as IssueType;
    }
  }

  if (status !== undefined) {
    if (typeof status !== 'string' || !VALID_STATUSES.includes(status as IssueStatus)) {
      errors.push(`status must be one of: ${VALID_STATUSES.join(', ')}`);
    } else {
      result.status = status as IssueStatus;
    }
  }

  if (Object.keys(result).length === 0 && errors.length === 0) {
    errors.push('At least one field (title, description, type, status) must be provided');
  }

  if (errors.length > 0) {
    throw new AppError('Validation failed', StatusCodes.BAD_REQUEST, errors);
  }

  return result;
}

export function validateIssueFilters(query: Record<string, unknown>): IssueFilters {
  const errors: string[] = [];

  const sortRaw = typeof query.sort === 'string' ? query.sort : 'newest';
  if (!VALID_SORTS.includes(sortRaw as IssueFilters['sort'])) {
    errors.push(`sort must be one of: ${VALID_SORTS.join(', ')}`);
  }

  let type: IssueType | undefined;
  if (query.type !== undefined) {
    if (typeof query.type !== 'string' || !VALID_TYPES.includes(query.type as IssueType)) {
      errors.push(`type must be one of: ${VALID_TYPES.join(', ')}`);
    } else {
      type = query.type as IssueType;
    }
  }

  let status: IssueStatus | undefined;
  if (query.status !== undefined) {
    if (
      typeof query.status !== 'string' ||
      !VALID_STATUSES.includes(query.status as IssueStatus)
    ) {
      errors.push(`status must be one of: ${VALID_STATUSES.join(', ')}`);
    } else {
      status = query.status as IssueStatus;
    }
  }

  if (errors.length > 0) {
    throw new AppError('Validation failed', StatusCodes.BAD_REQUEST, errors);
  }



  
  const result: IssueFilters = { sort: sortRaw as IssueFilters['sort'] };
  if (type !== undefined) result.type = type;
  if (status !== undefined) result.status = status;
  return result;
}

export function validateIssueId(idParam: string): number {
  const id = Number(idParam);
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError('Invalid issue id', StatusCodes.BAD_REQUEST);
  }
  return id;
}