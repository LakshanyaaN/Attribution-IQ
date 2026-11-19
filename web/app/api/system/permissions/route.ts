import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/pg';

// GET: Introspect real table grants from information_schema for analyst and manager
export async function GET(req: NextRequest) {
  try {
    const roles = ['app_analyst', 'app_manager'];

    // 1. Fetch real grants from information_schema
    const grantsRes = await query(
      `
      SELECT 
        grantee,
        table_name,
        privilege_type
      FROM information_schema.role_table_grants
      WHERE grantee IN ('app_analyst', 'app_manager')
        AND table_schema = 'public'
      ORDER BY table_name, privilege_type;
      `,
      [],
      'admin'
    );

    // Group grants by table and role
    const matrix: Record<string, { analyst: string[]; manager: string[] }> = {};
    const tables = [
      'dim_campaign',
      'dim_paid_campaign',
      'dim_email_campaign',
      'dim_creative',
      'dim_user',
      'fact_touchpoint',
      'fact_conversion',
      'fact_spend',
      'fact_refund',
      'audit_log',
    ];

    tables.forEach((t) => {
      matrix[t] = { analyst: [], manager: [] };
    });

    grantsRes.rows.forEach((row) => {
      const { grantee, table_name, privilege_type } = row;
      if (matrix[table_name]) {
        if (grantee === 'app_analyst') {
          matrix[table_name].analyst.push(privilege_type);
        } else if (grantee === 'app_manager') {
          matrix[table_name].manager.push(privilege_type);
        }
      }
    });

    return NextResponse.json({
      success: true,
      roles: {
        analyst: {
          roleName: 'app_analyst',
          type: 'Read-Only Analytical Persona',
          description: 'Restricted to SELECT queries on views and dimensions. Direct table mutations are rejected by PostgreSQL.',
        },
        manager: {
          roleName: 'app_manager',
          type: 'Operational Read/Write Persona',
          description: 'Authorized for SELECT, INSERT, UPDATE, DELETE on operational tables, campaigns, and creatives.',
        },
      },
      matrix,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
