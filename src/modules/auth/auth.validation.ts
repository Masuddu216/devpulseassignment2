import { AppError } from '../../utils/AppError.js';
import { StatusCodes } from 'http-status-codes';
import type { LoginBody, SignupBody, UserRole } from './auth.types.js';


const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_ROLES: UserRole[] = ['contributor', 'maintainer'];

export function validateSignupBody(body: unknown): SignupBody {
  const errors: string[] = [];

  if (typeof body !== 'object' || body === null) {
    throw new AppError('Request body is required', StatusCodes.BAD_REQUEST);
  }

  const { name, email, password, role } = body as Record<string, unknown>;

  if (typeof name !== 'string' || name.trim().length === 0) {
    errors.push('name is required and must be a non-empty string');
  }

  if (typeof email !== 'string' || !EMAIL_REGEX.test(email)) {
    errors.push('email is required and must be a valid email address');
  }

  if (typeof password !== 'string' || password.length < 6) {
    errors.push('password is required and must be at least 6 characters');
  }

  let validatedRole: UserRole = 'contributor';
  if (role !== undefined) {
    if (typeof role !== 'string' || !VALID_ROLES.includes(role as UserRole)) {
      errors.push(`role must be one of: ${VALID_ROLES.join(', ')}`);
    } else {
      validatedRole = role as UserRole;
    }
  }

  if (errors.length > 0) {
    throw new AppError('Validation failed', StatusCodes.BAD_REQUEST, errors);
  }

  return {
    name: (name as string).trim(),
    email: (email as string).trim().toLowerCase(),
    password: password as string,
    role: validatedRole,
  };
}

export function validateLoginBody(body: unknown): LoginBody {
  const errors: string[] = [];

  if (typeof body !== 'object' || body === null) {
    throw new AppError('Request body is required', StatusCodes.BAD_REQUEST);
  }

  const { email, password } = body as Record<string, unknown>;

  if (typeof email !== 'string' || email.trim().length === 0) {
    errors.push('email is required');
  }

  if (typeof password !== 'string' || password.length === 0) {
    errors.push('password is required');
  }

  if (errors.length > 0) {
    throw new AppError('Validation failed', StatusCodes.BAD_REQUEST, errors);
  }

  return {
    email: (email as string).trim().toLowerCase(),
    password: password as string,
  };
}