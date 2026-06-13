import { getPool } from '../../config/db.js';
import type { SignupBody, UserRecord } from './auth.types.js';

export async function insertUser(
  data: Omit<SignupBody, 'password'> & { password: string; role: string }
): Promise<UserRecord> {
  const query = `
    INSERT INTO users (name, email, password, role)
    VALUES ($1, $2, $3, $4)
    RETURNING id, name, email, password, role, created_at, updated_at
  `;
  const values = [data.name, data.email, data.password, data.role];

  const result = await getPool().query<UserRecord>(query, values);
  // Non-null assertion because INSERT ... RETURNING always returns a row
  return result.rows[0]!;
}

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  const query = `
    SELECT id, name, email, password, role, created_at, updated_at
    FROM users
    WHERE email = $1
  `;
  const result = await getPool().query<UserRecord>(query, [email]);
  return result.rows[0] ?? null;
}

export async function findUserById(id: number): Promise<UserRecord | null> {
  const query = `
    SELECT id, name, email, password, role, created_at, updated_at
    FROM users
    WHERE id = $1
  `;
  const result = await getPool().query<UserRecord>(query, [id]);
  return result.rows[0] ?? null;
}