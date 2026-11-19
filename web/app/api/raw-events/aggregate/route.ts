import { NextRequest, NextResponse } from 'next/server';
import { getMongoDb } from '@/lib/mongodb';

// Allowlisted Aggregation Pipelines
export async function POST(req: NextRequest) {
  try {
    const db = await getMongoDb();
    const coll = db.collection('raw_clickstream_events');
    const body = await req.json();
    const { analysisType } = body;

    let pipeline: any[] = [];
    let explanation = '';

    switch (analysisType) {
      case 'platform_summary':
        pipeline = [
          {
            $group: {
              _id: '$platform',
              totalEvents: { $sum: 1 },
              totalCost: { $sum: '$cost' },
              avgCost: { $avg: '$cost' },
              clickCount: { $sum: { $cond: [{ $eq: ['$event_type', 'CLICK'] }, 1, 0] } },
              impressionCount: { $sum: { $cond: [{ $eq: ['$event_type', 'IMPRESSION'] }, 1, 0] } },
            },
          },
          { $sort: { totalEvents: -1 } },
        ];
        explanation = 'Groups clickstream events by ad network (platform), calculating volume, aggregate spend, and click-through composition.';
        break;

      case 'device_distribution':
        pipeline = [
          {
            $group: {
              _id: { $ifNull: ['$payload.device', 'Unknown'] },
              totalEvents: { $sum: 1 },
              uniqueUsers: { $addToSet: '$user_id' },
            },
          },
          {
            $project: {
              _id: 1,
              totalEvents: 1,
              userCount: { $size: '$uniqueUsers' },
            },
          },
          { $sort: { totalEvents: -1 } },
        ];
        explanation = 'Extracts device client environment from nested BSON payload and computes event volume and estimated distinct user engagement.';
        break;

      case 'hourly_velocity':
        pipeline = [
          {
            $project: {
              hour: { $substr: ['$timestamp', 11, 2] },
              event_type: 1,
            },
          },
          {
            $group: {
              _id: '$hour',
              events: { $sum: 1 },
              clicks: { $sum: { $cond: [{ $eq: ['$event_type', 'CLICK'] }, 1, 0] } },
            },
          },
          { $sort: { _id: 1 } },
        ];
        explanation = 'Segments ingestion by hour of day (UTC) to reveal peak clickstream volume and bot vs human interaction windows.';
        break;

      case 'utm_source_performance':
        pipeline = [
          {
            $group: {
              _id: {
                source: { $ifNull: ['$payload.utm_source', 'direct'] },
                platform: '$platform',
              },
              count: { $sum: 1 },
              totalCost: { $sum: '$cost' },
            },
          },
          { $sort: { count: -1 } },
          { $limit: 10 },
        ];
        explanation = 'Correlates payload UTM tracking tags with upstream ad platform taxonomy to audit campaign attribution tagging hygiene.';
        break;

      default:
        return NextResponse.json(
          {
            success: false,
            error: `Analysis type '${analysisType}' is not supported. Allowlisted types: platform_summary, device_distribution, hourly_velocity, utm_source_performance`,
          },
          { status: 400 }
        );
    }

    const results = await coll.aggregate(pipeline).toArray();

    return NextResponse.json({
      success: true,
      analysisType,
      explanation,
      pipeline,
      results,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
