import { NextRequest, NextResponse } from 'next/server';
import { getMongoDb } from '@/lib/mongodb';

// GET: Metrics & Aggregations for MongoDB Raw Clickstream Events
export async function GET(req: NextRequest) {
  try {
    const db = await getMongoDb();
    const coll = db.collection('raw_clickstream_events');

    // Query parameters for filtering
    const platform = req.nextUrl.searchParams.get('platform');
    const eventType = req.nextUrl.searchParams.get('eventType');
    const startDate = req.nextUrl.searchParams.get('startDate');
    const endDate = req.nextUrl.searchParams.get('endDate');

    const filter: Record<string, any> = {};
    if (platform && platform !== 'ALL') {
      filter.platform = platform;
    }
    if (eventType && eventType !== 'ALL') {
      filter.event_type = eventType;
    }
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = startDate;
      if (endDate) filter.timestamp.$lte = endDate + 'T23:59:59';
    }

    // 1. KPI Counts
    const totalEvents = await coll.countDocuments(filter);
    const clickEvents = await coll.countDocuments({ ...filter, event_type: 'CLICK' });
    const impressionEvents = await coll.countDocuments({ ...filter, event_type: 'IMPRESSION' });
    const processedEvents = await coll.countDocuments({ ...filter, processed: true });
    const unprocessedEvents = totalEvents - processedEvents;

    // 2. Events by Platform Breakdown
    const platformCounts = await coll.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$platform',
          total: { $sum: 1 },
          clicks: { $sum: { $cond: [{ $eq: ['$event_type', 'CLICK'] }, 1, 0] } },
          impressions: { $sum: { $cond: [{ $eq: ['$event_type', 'IMPRESSION'] }, 1, 0] } },
          avgCost: { $avg: '$cost' },
        },
      },
      { $sort: { total: -1 } },
    ]).toArray();

    // 3. Activity Timeline (Bucketed by Day)
    const timeline = await coll.aggregate([
      { $match: filter },
      {
        $project: {
          day: { $substr: ['$timestamp', 0, 10] },
          event_type: 1,
        },
      },
      {
        $group: {
          _id: '$day',
          total: { $sum: 1 },
          clicks: { $sum: { $cond: [{ $eq: ['$event_type', 'CLICK'] }, 1, 0] } },
          impressions: { $sum: { $cond: [{ $eq: ['$event_type', 'IMPRESSION'] }, 1, 0] } },
        },
      },
      { $sort: { _id: 1 } },
    ]).toArray();

    // 4. Processing Status Distribution
    const processingStatus = {
      processed: processedEvents,
      unprocessed: unprocessedEvents,
      ratio: totalEvents > 0 ? ((processedEvents / totalEvents) * 100).toFixed(1) : '100.0',
    };

    return NextResponse.json({
      success: true,
      kpis: {
        total: totalEvents,
        clicks: clickEvents,
        impressions: impressionEvents,
        processed: processedEvents,
        unprocessed: unprocessedEvents,
      },
      platformBreakdown: platformCounts.map((p) => ({
        platform: p._id || 'Unknown',
        total: p.total,
        clicks: p.clicks,
        impressions: p.impressions,
        avgCost: p.avgCost ? Number(p.avgCost.toFixed(4)) : 0,
      })),
      timeline: timeline.map((t) => ({
        date: t._id,
        total: t.total,
        clicks: t.clicks,
        impressions: t.impressions,
      })),
      processingStatus,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
