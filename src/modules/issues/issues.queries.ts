import { pool } from '../../config/db.js';
import type {
  CreateIssueBody,
  IssueFilters,
  IssueRecord,
  IssueStatus,
  ReporterInfo,
  UpdateIssueBody,
} from './issues.types.js';

export async function insertIssue(
  data: CreateIssueBody & { reporterId: number }
): Promise<IssueRecord> {
  const query = `
    INSERT INTO issues (title, description, type, reporter_id)
    VALUES ($1, $2, $3, $4)
    RETURNING id, title, description, type, status, reporter_id, created_at, updated_at
  `;
  const values = [data.title, data.description, data.type, data.reporterId];
  const result = await pool.query<IssueRecord>(query, values);
  return result.rows[0]!;
}

export async function findAllIssues(filters: IssueFilters): Promise<IssueRecord[]> {
  const conditions: string[] = [];
  const values: unknown[] = [];

  if (filters.type) {
    values.push(filters.type);
    conditions.push(`type = $${values.length}`);
  }
  if (filters.status) {
    values.push(filters.status);
    conditions.push(`status = $${values.length}`);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const orderDirection = filters.sort === 'oldest' ? 'ASC' : 'DESC';

  const query = `
    SELECT id, title, description, type, status, reporter_id, created_at, updated_at
    FROM issues
    ${whereClause}
    ORDER BY created_at ${orderDirection}
  `;
  const result = await pool.query<IssueRecord>(query, values);
  return result.rows;
}

export async function findIssueById(id: number): Promise<IssueRecord | null> {
  const query = `
    SELECT id, title, description, type, status, reporter_id, created_at, updated_at
    FROM issues
    WHERE id = $1
  `;
  const result = await pool.query<IssueRecord>(query, [id]);
  return result.rows[0] ?? null;
}

export async function findReportersByIds(ids: number[]): Promise<ReporterInfo[]> {
  if (ids.length === 0) return [];
  const uniqueIds = [...new Set(ids)];
  const query = `
    SELECT id, name, role
    FROM users
    WHERE id = ANY($1::int[])
  `;
  const result = await pool.query<ReporterInfo>(query, [uniqueIds]);
  return result.rows;
}

export async function updateIssueById(
  id: number,
  data: UpdateIssueBody
): Promise<IssueRecord> {
  const setClauses: string[] = [];
  const values: unknown[] = [];

  if (data.title !== undefined) {
    values.push(data.title);
    setClauses.push(`title = $${values.length}`);
  }
  if (data.description !== undefined) {
    values.push(data.description);
    setClauses.push(`description = $${values.length}`);
  }
  if (data.type !== undefined) {
    values.push(data.type);
    setClauses.push(`type = $${values.length}`);
  }
  if (data.status !== undefined) {
    values.push(data.status);
    setClauses.push(`status = $${values.length}`);
  }

  setClauses.push('updated_at = NOW()');
  values.push(id);

  const query = `
    UPDATE issues
    SET ${setClauses.join(', ')}
    WHERE id = $${values.length}
    RETURNING id, title, description, type, status, reporter_id, created_at, updated_at
  `;
  const result = await pool.query<IssueRecord>(query, values);
  return result.rows[0]!;
}

export async function deleteIssueById(id: number): Promise<boolean> {
  const query = `DELETE FROM issues WHERE id = $1`;
  const result = await pool.query(query, [id]);
  return (result.rowCount ?? 0) > 0;
}

export type { IssueStatus };