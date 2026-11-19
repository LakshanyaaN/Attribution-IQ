import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/pg';

// GET: Paginated & Filtered Security Audit Logs from audit_log table
export async function GET(req: NextRequest) {
  try {
    const role = (req.nextUrl.searchParams.get('role') || 'analyst') as 'analyst' | 'manager';
    const operation = req.nextUrl.searchParams.get('operation');
    const tableName = req.nextUrl.searchParams.get('table');
    const limit = parseInt(req.nextUrl.searchParams.get('limit') || '50', 10);

    const conditions: string[] = [];
    const params: any[] = [];

    if (operation && operation !== 'ALL') {
      params.push(operation);
      conditions.push(`operation = $${params.length}`);
    }

    if (tableName && tableName !== 'ALL') {
      params.push(tableName);
      conditions.push(`table_name = $${params.length}`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // 1. Fetch Audit Logs
    const logsRes = await query(
      `
      SELECT 
        log_id,
        table_name,
        operation,
        record_id,
        old_data,
        new_data,
        performed_by,
        logged_at
      FROM audit_log
      ${whereClause}
      ORDER BY logged_at DESC
      LIMIT ${limit};
      `,
      params,
      role
    );

    // 2. Fetch Aggregations for Activity Charts
    const countRes = await query(
      `SELECT COUNT(*) as total_logs FROM audit_log;`,
      [],
      role
    );

    const opBreakdown = await query(
      `
      SELECT operation, COUNT(*) as count
      FROM audit_log
      GROUP BY operation
      ORDER BY count DESC;
      `,
      [],
      role
    );

    const tableBreakdown = await query(
      `
      SELECT table_name, COUNT(*) as count
      FROM audit_log
      GROUP BY table_name
      ORDER BY count DESC;
      `,
      [],
      role
    );

    const actorBreakdown = await query(
      `
      SELECT performed_by, COUNT(*) as count
      FROM audit_log
      GROUP BY performed_by
      ORDER BY count DESC;
      `,
      [],
      role
    );

    return NextResponse.json({
      success: true,
      totalCount: parseInt(countRes.rows[0]?.total_logs || '0', 10),
      logs: logsRes.rows,
      charts: {
        operations: opBreakdown.rows,
        tables: tableBreakdown.rows,
        actors: actorBreakdown.rows,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
