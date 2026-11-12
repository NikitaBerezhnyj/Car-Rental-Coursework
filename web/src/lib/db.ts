import "server-only";
import { AppError } from "./errors";
import { Pool, type QueryResultRow } from "pg";

const globalForPg = globalThis as unknown as { pool?: Pool };

export const pool =
  globalForPg.pool ?? new Pool({ connectionString: process.env.DATABASE_URL });

if (process.env.NODE_ENV !== "production") {
  globalForPg.pool = pool;
}

const PG_ERROR_MESSAGES: Record<string, string> = {
  "23505": "Запис з такими даними вже існує",
  "23503": "Операція неможлива: є пов'язані записи",
  "23514": "Дані порушують обмеження бази даних",
  "23P01": "Період перетинається з існуючим записом",
};

export async function query<T extends QueryResultRow>(
  text: string,
  params: unknown[] = [],
): Promise<T[]> {
  try {
    const { rows } = await pool.query<T>(text, params);
    return rows;
  } catch (error) {
    const message = PG_ERROR_MESSAGES[(error as { code?: string }).code ?? ""];
    if (message) throw new AppError(message, "CONFLICT");
    throw error;
  }
}
