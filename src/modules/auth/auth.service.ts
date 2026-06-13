import { StatusCodes } from 'http-status-codes';
import { AppError } from '../../utils/AppError.js';
import { hashPassword, comparePassword } from '../../utils/password.util.js';
import { signToken } from '../../utils/jwt.util.js';
import { findUserByEmail, insertUser } from './auth.queries.js';
import type { LoginBody, SafeUser, SignupBody, UserRecord } from './auth.types.js';


function toSafeUser(user: UserRecord): SafeUser {
  const { password, ...safeUser } = user;
  return safeUser;
}

export async function registerUser(body: SignupBody): Promise<SafeUser> {
  const existingUser = await findUserByEmail(body.email);
  if (existingUser) {
    throw new AppError('Email is already registered', StatusCodes.BAD_REQUEST);
  }

  const hashedPassword = await hashPassword(body.password);

  const newUser = await insertUser({
    name: body.name,
    email: body.email,
    password: hashedPassword,
    role: body.role ?? 'contributor',
  });

  return toSafeUser(newUser);
}

export async function loginUser(
  body: LoginBody
): Promise<{ token: string; user: SafeUser }> {
  const user = await findUserByEmail(body.email);
  if (!user) {
    throw new AppError('Invalid email or password', StatusCodes.UNAUTHORIZED);
  }

  const isPasswordValid = await comparePassword(body.password, user.password);
  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', StatusCodes.UNAUTHORIZED);
  }

  const token = signToken({
    id: user.id,
    name: user.name,
    role: user.role,
  });

  return { token, user: toSafeUser(user) };
}