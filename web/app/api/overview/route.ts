import { NextResponse } from 'next/server';

export async function GET() {
  // Mock data for the last 7 days – in a real app you would query PostgreSQL.
  const data = [
    { date: '2026-11-06', spend: 1200.5, revenue: 2100.75 },
    { date: '2026-11-07', spend: 1300.0, revenue: 2250.1 },
    { date: '2026-11-08', spend: 1150.2, revenue: 2000.0 },
    { date: '2026-11-09', spend: 1400.8, revenue: 2400.6 },
    { date: '2026-11-10', spend: 1250.3, revenue: 2150.9 },
    { date: '2026-11-11', spend: 1350.7, revenue: 2300.4 },
    { date: '2026-11-12', spend: 1280.9, revenue: 2205.2 },
  ];
  return NextResponse.json({ success: true, data });
}
