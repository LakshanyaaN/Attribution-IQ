import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/pg';

// POST: Simulate / execute safe test actions under the specified database principal
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, role } = body;

    const testRole = (role === 'manager' ? 'manager' : 'analyst') as 'analyst' | 'manager';
    const roleDbUser = testRole === 'manager' ? 'app_manager' : 'app_analyst';

    let testSql = '';
    let description = '';
    let isWrite = false;

    switch (action) {
      case 'select_campaigns':
        testSql = 'SELECT campaign_id, name, channel FROM dim_campaign LIMIT 3;';
        description = 'Read operational campaign records';
        isWrite = false;
        break;

      case 'select_audit_log':
        testSql = 'SELECT log_id, table_name, operation FROM audit_log LIMIT 3;';
        description = 'Read security compliance audit log';
        isWrite = false;
        break;

      case 'insert_test_campaign':
        // Safe sandbox attempt using a rollbacked transaction or controlled dummy name
        testSql = `
          INSERT INTO dim_campaign (name, channel, is_active)
          VALUES ('[TEST SIMULATOR] ' || gen_random_uuid(), 'Google', FALSE)
          RETURNING campaign_id;
        `;
        description = 'Mutate catalog: INSERT new row into dim_campaign';
        isWrite = true;
        break;

      case 'update_budget':
        testSql = `
          UPDATE dim_paid_campaign 
          SET cpc_bid = cpc_bid 
          WHERE campaign_id = (SELECT campaign_id FROM dim_paid_campaign LIMIT 1);
        `;
        description = 'Mutate financial bids: UPDATE dim_paid_campaign';
        isWrite = true;
        break;

      case 'delete_touchpoint':
        testSql = `
          DELETE FROM fact_touchpoint 
          WHERE touchpoint_id = '00000000-0000-0000-0000-000000000000'::uuid;
        `;
        description = 'Destructive operation: DELETE FROM fact_touchpoint';
        isWrite = true;
        break;

      default:
        return NextResponse.json(
          { success: false, error: 'Unknown test action' },
          { status: 400 }
        );
    }

    const startTime = Date.now();
    try {
      // Execute under the real connection pool of that specific role!
      const result = await query(testSql, [], testRole);
      const executionTime = Date.now() - startTime;

      // If it's a test insert, clean up after the test to keep database clean
      if (action === 'insert_test_campaign' && result.rows?.[0]?.campaign_id) {
        await query(
          'DELETE FROM dim_campaign WHERE campaign_id = $1;',
          [result.rows[0].campaign_id],
          'manager'
        );
      }

      return NextResponse.json({
        success: true,
        allowed: true,
        action,
        roleTested: roleDbUser,
        description,
        executionTimeMs: executionTime,
        rowCount: result.rowCount || result.rows?.length || 0,
        statusMessage: `AUTHORIZED: PostgreSQL granted permission to ${roleDbUser} for this statement.`,
      });
    } catch (dbErr: any) {
      const executionTime = Date.now() - startTime;
      const isPermissionDenied = dbErr.code === '42501' || dbErr.message?.includes('permission denied');

      return NextResponse.json({
        success: true,
        allowed: false,
        action,
        roleTested: roleDbUser,
        description,
        executionTimeMs: executionTime,
        errorCode: dbErr.code,
        errorMessage: dbErr.message,
        statusMessage: isPermissionDenied
          ? `DENIED (SQLSTATE 42501): PostgreSQL enforced least-privilege boundary. ${roleDbUser} lacks permission.`
          : `FAILED: ${dbErr.message}`,
      });
    }
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
