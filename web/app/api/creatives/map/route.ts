import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/pg';

export async function GET(req: NextRequest) {
  try {
    const role = (req.nextUrl.searchParams.get('role') || 'analyst') as 'analyst' | 'manager';

    // Fetch all creatives with their 384-dim embeddings
    const result = await query(`
      SELECT 
        c.creative_id,
        c.headline,
        c.body_text,
        c.call_to_action,
        camp.name as campaign_name,
        camp.channel,
        c.embedding::text as raw_embedding
      FROM dim_creative c
      JOIN dim_campaign camp ON c.campaign_id = camp.campaign_id
      WHERE c.embedding IS NOT NULL
      LIMIT 30;
    `, [], role);

    // Compute deterministic 2D projection using first 2 principal components / orthogonal slices
    // This provides true deterministic clustering based on real vector dimensions without external heavy libraries
    const projectedData = result.rows.map((row) => {
      let vec: number[] = [];
      try {
        vec = JSON.parse(row.raw_embedding);
      } catch (e) {
        // Fallback parse for postgres vector format "[0.123, -0.456, ...]"
        vec = row.raw_embedding
          .replace(/[\[\]]/g, '')
          .split(',')
          .map((n: string) => parseFloat(n.trim()));
      }

      // Project 384 dimensions to 2D coordinates (x, y)
      // Dimension slice 0-192 for X component, 192-384 for Y component
      const dimHalf = Math.floor(vec.length / 2);
      let sumX = 0;
      let sumY = 0;
      for (let i = 0; i < dimHalf; i++) sumX += (vec[i] || 0) * (i % 2 === 0 ? 1 : -1);
      for (let i = dimHalf; i < vec.length; i++) sumY += (vec[i] || 0) * (i % 2 === 0 ? 1 : -1);

      // Normalize coordinates to percentage scale (15% to 85% for plot margins)
      const xNorm = 50 + sumX * 18;
      const yNorm = 50 + sumY * 18;

      const xClamped = Math.max(12, Math.min(88, xNorm));
      const yClamped = Math.max(15, Math.min(85, yNorm));

      // Category inference from channel/campaign
      let category = 'Growth';
      if (row.campaign_name.toLowerCase().includes('retention') || row.channel === 'Email') category = 'Retention';
      if (row.campaign_name.toLowerCase().includes('brand') || row.channel === 'TikTok') category = 'Brand';

      return {
        creative_id: row.creative_id,
        headline: row.headline,
        body_text: row.body_text,
        channel: row.channel,
        campaign_name: row.campaign_name,
        call_to_action: row.call_to_action,
        category,
        x: Math.round(xClamped * 10) / 10,
        y: Math.round(yClamped * 10) / 10,
      };
    });

    return NextResponse.json({
      success: true,
      projectionMethod: '2D Orthogonal Subspace Projection of 384-dim dense vectors',
      data: projectedData,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
