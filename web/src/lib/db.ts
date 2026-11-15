import "server-only";
import { CONSTRAINT_MESSAGES, PG_ERROR_MESSAGES } from "./dbMessages";
import { AppError } from "./errors";
import { Pool, type QueryResultRow } from "pg";

const globalForPg = globalThis as unknown as { pool?: Pool };

export const pool = globalForPg.pool ?? new Pool({ connectionString: process.env.DATABASE_URL });

if (process.env.NODE_ENV !== "production") {
  globalForPg.pool = pool;
}

export type QueryFn = <T extends QueryResultRow>(text: string, params?: unknown[]) => Promise<T[]>;

function toAppError(error: unknown): unknown {
  const { code, constraint, message } = error as {
    code?: string;
    constraint?: string;
    message?: string;
  };

  if (code === "P0001") {
    return new AppError(message ?? "Порушено бізнес-правило", "CONFLICT");
  }

  const known = CONSTRAINT_MESSAGES[constraint ?? ""] ?? PG_ERROR_MESSAGES[code ?? ""];
  return known ? new AppError(known, "CONFLICT") : error;
}

export const query: QueryFn = async (text, params = []) => {
  try {
    const { rows } = await pool.query(text, params);
    return rows;
  } catch (error) {
    throw toAppError(error);
  }
};

export async function withTransaction<T>(operation: (run: QueryFn) => Promise<T>): Promise<T> {
  const client = await pool.connect();

  const run: QueryFn = async (text, params = []) => {
    try {
      const { rows } = await client.query(text, params);
      return rows;
    } catch (error) {
      throw toAppError(error);
    }
  };

  try {
    await client.query("BEGIN");
    const result = await operation(run);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
