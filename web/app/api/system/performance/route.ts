import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/pg';

// Allowlisted Query Catalog for Query Performance Lab
const QUERY_CATALOG: Record<
  string,
  {
    id: string;
    title: string;
    description: string;
    sql: string;
    category: string;
  }
> = {
  channel_roas: {
    id: 'channel_roas',
    title: 'Channel ROAS Multi-Touch Comparison',
    description: 'Queries PostgreSQL Materialized View to compare first-touch, last-touch, linear and 7-day time decay returns across all channels.',
    sql: 'SELECT channel, total_spend, revenue_time_decay, roas_time_decay FROM mv_channel_roas_comparison ORDER BY total_spend DESC;',
    category: 'Materialized Views',
  },
  journey_paths: {
    id: 'journey_paths',
    title: 'Customer Journey Path Traversal (Recursive CTE)',
    description: 'Profiles the recursive CTE assembling chronologically ordered touchpoints into multi-channel conversion journeys.',
    sql: 'SELECT conversion_id, full_journey_path, total_touchpoints FROM view_customer_journey_paths LIMIT 20;',
    category: 'Complex Joins & CTEs',
  },
  high_performing_campaigns: {
    id: 'high_performing_campaigns',
    title: 'High-Performing Campaign Ranking',
    description: 'Scans campaigns generating over 2.0x ROAS with spend filtering and index joins on dimensions.',
    sql: 'SELECT campaign_id, campaign_name, channel, total_spend, roas FROM view_high_performing_campaigns LIMIT 15;',
    category: 'Star Schema Aggregations',
  },
  touchpoint_index_scan: {
    id: 'touchpoint_index_scan',
    title: 'Touchpoint User B-Tree Index Scan',
    description: 'Profiles idx_touchpoint_user_ts composite index behavior for high-throughput single-user customer journey lookups.',
    sql: 'SELECT user_id, COUNT(*) AS total_interactions, SUM(cost) AS total_user_cost FROM fact_touchpoint WHERE user_id = (SELECT user_id FROM dim_user LIMIT 1) GROUP BY user_id;',
    category: 'Index Utilization',
  },
  vector_similarity_hnsw: {
    id: 'vector_similarity_hnsw',
    title: 'Ad Embedding HNSW Index Cosine Distance Search',
    description: 'Executes cosine distance search against 384-dimensional embeddings using the pgvector HNSW index.',
    sql: 'SELECT creative_id, headline, channel, 1 - (embedding <=> (SELECT embedding FROM dim_creative LIMIT 1)) AS similarity FROM dim_creative ORDER BY similarity DESC LIMIT 5;',
    category: 'pgvector AI Search',
  },
};

// GET: List available allowlisted queries
export async function GET() {
  return NextResponse.json({
    success: true,
    queries: Object.values(QUERY_CATALOG).map(({ id, title, description, category }) => ({
      id,
      title,
      description,
      category,
    })),
  });
}

// POST: Execute EXPLAIN (ANALYZE, BUFFERS) on the allowlisted query
export async function POST(req: NextRequest) {
  try {
    const role = (req.nextUrl.searchParams.get('role') || 'analyst') as 'analyst' | 'manager';
    const body = await req.json();
    const { queryId } = body;

    const queryDef = QUERY_CATALOG[queryId];
    if (!queryDef) {
      return NextResponse.json(
        {
          success: false,
          error: `Query '${queryId}' not in allowlisted query catalog. Arbitrary SQL execution is disabled for database security.`,
        },
        { status: 400 }
      );
    }

    const startTime = Date.now();

    // 1. Execute EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
    const explainResult = await query(
      `EXPLAIN (ANALYZE, BUFFERS, TIMING, FORMAT JSON) ${queryDef.sql}`,
      [],
      role
    );

    // 2. Execute EXPLAIN in Text mode for terminal view
    const explainTextResult = await query(
      `EXPLAIN (ANALYZE, BUFFERS, TIMING) ${queryDef.sql}`,
      [],
      role
    );

    // 3. Execute the actual query to get row count and preview sample
    const dataResult = await query(queryDef.sql, [], role);
    const measuredTimeMs = Date.now() - startTime;

    const planJson = explainResult.rows[0]?.['QUERY PLAN']?.[0] || {};
    const planText = explainTextResult.rows.map((r: any) => r['QUERY PLAN']).join('\n');

    return NextResponse.json({
      success: true,
      queryId,
      title: queryDef.title,
      description: queryDef.description,
      sql: queryDef.sql,
      category: queryDef.category,
      measuredTimeMs,
      planningTimeMs: planJson['Planning Time'] || 0,
      executionTimeMs: planJson['Execution Time'] || 0,
      rowCount: dataResult.rowCount || dataResult.rows?.length || 0,
      sampleRows: dataResult.rows.slice(0, 5),
      planSummary: {
        nodeType: planJson.Plan?.['Node Type'] || 'Unknown',
        totalCost: planJson.Plan?.['Total Cost'] || 0,
        sharedHitBlocks: planJson.Plan?.['Shared Hit Blocks'] || 0,
        sharedReadBlocks: planJson.Plan?.['Shared Read Blocks'] || 0,
      },
      planText,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
