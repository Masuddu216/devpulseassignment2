import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { sendSuccess } from '../../utils/response.util.js';
import { validateLoginBody, validateSignupBody } from './auth.validation.js';
import { loginUser, registerUser } from './auth.service.js';

// export async function signup(req: Request, res: Response): Promise<void> {
//   const validatedBody = validateSignupBody(req.body);
//   const user = await registerUser(validatedBody);
//   sendSuccess(res, StatusCodes.CREATED, 'User registered successfully', user);
// }

// export async function login(req: Request, res: Response): Promise<void> {
//   const validatedBody = validateLoginBody(req.body);
//   const result = await loginUser(validatedBody);
//   sendSuccess(res, StatusCodes.OK, 'Login successful', result);
// }