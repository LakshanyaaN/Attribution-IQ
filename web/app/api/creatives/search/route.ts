import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/pg';

export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams.get('q') || 'Attribution';
    const channel = req.nextUrl.searchParams.get('channel');
    const role = (req.nextUrl.searchParams.get('role') || 'analyst') as 'analyst' | 'manager';

    let sql = `
      WITH query_ref AS (
        SELECT embedding 
        FROM dim_creative 
        WHERE embedding IS NOT NULL 
          AND (headline ILIKE '%' || $1 || '%' OR body_text ILIKE '%' || $1 || '%')
        LIMIT 1
      ),
      fallback_ref AS (
        SELECT embedding 
        FROM dim_creative 
        WHERE embedding IS NOT NULL 
        LIMIT 1
      )
      SELECT 
        c.creative_id,
        c.headline,
        c.body_text,
        c.call_to_action,
        camp.name AS campaign_name,
        camp.channel,
        ROUND((1 - (c.embedding <=> COALESCE(qref.embedding, fref.embedding, c.embedding)))::numeric, 4) AS similarity_score
      FROM dim_creative c
      JOIN dim_campaign camp ON c.campaign_id = camp.campaign_id
      LEFT JOIN query_ref qref ON TRUE
      LEFT JOIN fallback_ref fref ON TRUE
      WHERE c.embedding IS NOT NULL
    `;

    const params: any[] = [q];
    if (channel && channel !== 'ALL') {
      sql += ` AND camp.channel = $2 `;
      params.push(channel);
    }

    sql += ` ORDER BY similarity_score DESC LIMIT 8;`;

    const result = await query(sql, params, role);

    return NextResponse.json({
      success: true,
      query: q,
      data: result.rows,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
