import { Pool, QueryResult, QueryResultRow } from 'pg';

const PG_HOST = process.env.POSTGRES_HOST || 'localhost';
const PG_PORT = parseInt(process.env.POSTGRES_PORT || '5433', 10);
const PG_DB = process.env.POSTGRES_DB || 'attribution_db';

// Dual connection pools enforcing database-level RBAC
const pools: Record<string, Pool> = {
  analyst: new Pool({
    host: PG_HOST,
    port: PG_PORT,
    database: PG_DB,
    user: process.env.ANALYST_USER || 'app_analyst',
    password: process.env.ANALYST_PASSWORD || 'analyst_password_2026',
    max: 10,
    idleTimeoutMillis: 30000,
  }),
  manager: new Pool({
    host: PG_HOST,
    port: PG_PORT,
    database: PG_DB,
    user: process.env.MANAGER_USER || 'app_manager',
    password: process.env.MANAGER_PASSWORD || 'manager_password_2026',
    max: 10,
    idleTimeoutMillis: 30000,
  }),
  admin: new Pool({
    host: PG_HOST,
    port: PG_PORT,
    database: PG_DB,
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgrespassword',
    max: 10,
    idleTimeoutMillis: 30000,
  }),
};

/**
 * Execute a query using the specified database role.
 * Role-Based Access Control is enforced by the database engine itself.
 */
export async function query<T extends QueryResultRow = any>(
  text: string,
  params: any[] = [],
  role: 'analyst' | 'manager' | 'admin' = 'analyst'
): Promise<QueryResult<T>> {
  const pool = pools[role] || pools.analyst;
  const client = await pool.connect();
  try {
    return await client.query<T>(text, params);
  } finally {
    client.release();
  }
}
