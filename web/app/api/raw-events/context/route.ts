import { NextRequest, NextResponse } from 'next/server';
import { getMongoDb } from '@/lib/mongodb';

// GET: Related context for a specific user_id or session_id
export async function GET(req: NextRequest) {
  try {
    const db = await getMongoDb();
    const coll = db.collection('raw_clickstream_events');

    const userId = req.nextUrl.searchParams.get('userId');
    const sessionId = req.nextUrl.searchParams.get('sessionId');

    if (!userId && !sessionId) {
      return NextResponse.json(
        { success: false, error: 'userId or sessionId query parameter is required' },
        { status: 400 }
      );
    }

    const query: Record<string, any> = {};
    if (userId) query.user_id = userId;
    if (sessionId) query.session_id = sessionId;

    const relatedEvents = await coll
      .find(query)
      .sort({ timestamp: 1 })
      .limit(20)
      .toArray();

    // Summary of journey
    const touchpointsCount = relatedEvents.length;
    const platforms = Array.from(new Set(relatedEvents.map((e) => e.platform)));
    const totalCost = relatedEvents.reduce((acc, curr) => acc + (curr.cost || 0), 0);

    return NextResponse.json({
      success: true,
      query,
      summary: {
        touchpointsCount,
        platforms,
        totalCost: Number(totalCost.toFixed(4)),
        firstTouch: relatedEvents[0]?.timestamp || null,
        lastTouch: relatedEvents[relatedEvents.length - 1]?.timestamp || null,
      },
      events: relatedEvents,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
