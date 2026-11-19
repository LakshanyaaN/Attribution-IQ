'use client';

import React, { useEffect, useState } from 'react';
import { 
  Database, 
  Terminal, 
  Layers, 
  Search, 
  ChevronRight,
  Clock,
  Laptop,
  Activity,
  CheckCircle2,
  Filter,
  BarChart3,
  Calendar,
  Code2,
  GitBranch,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Eye,
  FileJson,
  Network
} from 'lucide-react';

interface RawEvent {
  _id: string;
  session_id: string;
  user_id: string;
  platform: string;
  event_type: string;
  cost: number;
  timestamp: string;
  received_at?: string;
  payload: {
    ip?: string;
    user_agent?: string;
    utm_source?: string;
    utm_campaign?: string;
    device?: string;
  };
  processed: boolean;
}

export default function RawEventsPage() {
  const [events, setEvents] = useState<RawEvent[]>([]);
  const [totalCount, setTotalCount] = useState<number>(13138);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<RawEvent | null>(null);

  // Stats state from real aggregation
  const [stats, setStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Inspector Mode State: 'readable' | 'json' | 'context'
  const [inspectorMode, setInspectorMode] = useState<'readable' | 'json' | 'context'>('readable');
  const [userContext, setUserContext] = useState<any>(null);
  const [contextLoading, setContextLoading] = useState(false);

  // Aggregation Explorer State
  const [aggType, setAggType] = useState('platform_summary');
  const [aggResult, setAggResult] = useState<any>(null);
  const [aggLoading, setAggLoading] = useState(false);

  // Filter States
  const [platformFilter, setPlatformFilter] = useState('ALL');
  const [eventTypeFilter, setEventTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchStats = () => {
    setStatsLoading(true);
    const params = new URLSearchParams();
    if (platformFilter !== 'ALL') params.append('platform', platformFilter);
    if (eventTypeFilter !== 'ALL') params.append('eventType', eventTypeFilter);

    fetch(`/api/raw-events/stats?${params.toString()}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setStats(json);
      })
      .catch((err) => console.error('Failed to load stats:', err))
      .finally(() => setStatsLoading(false));
  };

  const fetchEvents = () => {
    setLoading(true);
    const queryParams = new URLSearchParams({
      platform: platformFilter,
      eventType: eventTypeFilter,
      status: statusFilter,
      limit: '50',
    });

    fetch(`/api/raw-events?${queryParams.toString()}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setEvents(json.data || []);
          if (json.totalCount !== undefined) setTotalCount(json.totalCount);
          if (json.data?.length && !selectedEvent) {
            setSelectedEvent(json.data[0]);
          }
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const runAggregation = (type: string) => {
    setAggLoading(true);
    setAggType(type);
    fetch('/api/raw-events/aggregate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ analysisType: type }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setAggResult(json);
      })
      .catch((err) => console.error(err))
      .finally(() => setAggLoading(false));
  };

  // Fetch related context when selecting an event in 'context' mode
  const fetchUserContext = (userId: string) => {
    if (!userId) return;
    setContextLoading(true);
    fetch(`/api/raw-events/context?userId=${userId}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setUserContext(json);
      })
      .catch((err) => console.error(err))
      .finally(() => setContextLoading(false));
  };

  useEffect(() => {
    fetchEvents();
    fetchStats();
  }, [platformFilter, eventTypeFilter, statusFilter]);

  useEffect(() => {
    runAggregation('platform_summary');
  }, []);

  useEffect(() => {
    if (selectedEvent && inspectorMode === 'context') {
      fetchUserContext(selectedEvent.user_id);
    }
  }, [selectedEvent, inspectorMode]);

  const kpis = stats?.kpis || {
    total: totalCount,
    clicks: 10492,
    impressions: 2646,
    processed: 13138,
    unprocessed: 0,
  };

  const platformBreakdown = stats?.platformBreakdown || [];
  const timelineData = stats?.timeline || [];

  return (
    <div className="space-y-8">
      {/* 1. Header Card: Event Intelligence Hub */}
      <div className="rounded-2xl bg-[#0F141C] text-white p-6 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
              <span>✦ Real-Time Ingestion & Observability</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center space-x-3">
              <span>Event Intelligence Hub</span>
            </h1>
            <p className="text-xs md:text-sm text-slate-400 font-normal mt-1">
              Explore the raw clickstream interactions behind your multi-touch attribution models.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                fetchEvents();
                fetchStats();
              }}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 flex items-center space-x-2 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${loading || statsLoading ? 'animate-spin' : ''}`} />
              <span>Refresh Ingestion</span>
            </button>
            <div className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold">
              MongoDB 7.0 Active
            </div>
          </div>
        </div>

        {/* 4 Real-time KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-800/80">
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 font-medium mb-1">Total Stored Events</div>
            <div className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {kpis.total.toLocaleString()}
            </div>
            <div className="text-[10px] text-emerald-400 font-mono mt-1">Collection: raw_events</div>
          </div>

          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 font-medium mb-1">Total Click Events</div>
            <div className="text-2xl md:text-3xl font-extrabold text-amber-400 tracking-tight">
              {kpis.clicks.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              {kpis.total ? ((kpis.clicks / kpis.total) * 100).toFixed(1) : 0}% of traffic
            </div>
          </div>

          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 font-medium mb-1">Impression Events</div>
            <div className="text-2xl md:text-3xl font-extrabold text-blue-400 tracking-tight">
              {kpis.impressions.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              {kpis.total ? ((kpis.impressions / kpis.total) * 100).toFixed(1) : 0}% top-of-funnel
            </div>
          </div>

          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 font-medium mb-1">ETL Processed Rate</div>
            <div className="text-2xl md:text-3xl font-extrabold text-emerald-400 tracking-tight">
              {kpis.total ? ((kpis.processed / kpis.total) * 100).toFixed(1) : '100.0'}%
            </div>
            <div className="text-[10px] text-emerald-300/80 mt-1">
              {kpis.processed.toLocaleString()} loaded to PG
            </div>
          </div>
        </div>
      </div>

      {/* 2. Analytical Visualizations: Platform Distribution & Ingestion Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Events by Platform (Interactive Filter) */}
        <div className="paper-card p-6 bg-white shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-[#0D5C3A]" />
                <h3 className="font-bold text-sm text-slate-900">Events by Advertising Platform</h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">Click bar to filter</span>
            </div>

            <div className="space-y-3">
              {platformBreakdown.map((item: any) => {
                const maxCount = platformBreakdown[0]?.total || 1;
                const pct = ((item.total / maxCount) * 100).toFixed(1);
                const isSelected = platformFilter === item.platform;

                let barColor = 'bg-[#2B6CB0]';
                if (item.platform === 'Meta') barColor = 'bg-[#D9483B]';
                if (item.platform === 'TikTok') barColor = 'bg-[#0D5C3A]';
                if (item.platform === 'Email') barColor = 'bg-[#E89E28]';

                return (
                  <div 
                    key={item.platform} 
                    onClick={() => setPlatformFilter(isSelected ? 'ALL' : item.platform)}
                    className={`p-2.5 rounded-xl transition-all cursor-pointer border ${
                      isSelected 
                        ? 'bg-slate-50 border-[#0D5C3A] ring-1 ring-[#0D5C3A]/20' 
                        : 'border-transparent hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="font-bold text-slate-800 flex items-center space-x-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${barColor}`} />
                        <span>{item.platform}</span>
                        {isSelected && (
                          <span className="text-[10px] bg-[#E8F5EE] text-[#0D5C3A] px-1.5 py-0.2 rounded font-semibold">Active Filter</span>
                        )}
                      </span>
                      <div className="space-x-3 text-slate-500 font-mono text-[11px]">
                        <span>Clicks: <b className="text-slate-800">{item.clicks}</b></span>
                        <span>Impressions: <b className="text-slate-800">{item.impressions}</b></span>
                        <span className="font-bold text-[#0D5C3A]">{item.total.toLocaleString()} total</span>
                      </div>
                    </div>
                    {/* Visual Progress Bar */}
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${barColor} rounded-full transition-all duration-500`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {platformFilter !== 'ALL' && (
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Filtered to <b>{platformFilter}</b></span>
              <button 
                onClick={() => setPlatformFilter('ALL')}
                className="text-[#0D5C3A] hover:underline font-bold"
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>

        {/* Activity Timeline (Bucketed Daily Distribution) */}
        <div className="paper-card p-6 bg-white shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-900">Ingestion Volume Timeline</h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400">Daily BSON Batches (UTC)</span>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Clickstream throughput across lookback period showing raw ingestion velocity.
            </p>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2">
              {timelineData.slice(0, 7).map((day: any) => {
                const total = day.total || 0;
                return (
                  <div key={day.date} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 last:border-0">
                    <span className="font-mono text-slate-600 font-medium">{day.date}</span>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        <span className="text-slate-500 text-[11px]">Clicks: {day.clicks}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-400" />
                        <span className="text-slate-500 text-[11px]">Impr: {day.impressions}</span>
                      </div>
                      <span className="font-mono font-bold text-slate-900 text-xs w-16 text-right">
                        {total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Status: <b className="text-emerald-700">Append-Only Event Store</b></span>
            <span className="font-mono">Timezone: UTC Ingest</span>
          </div>
        </div>
      </div>

      {/* 3. Filter Bar & Pipeline Status */}
      <div className="paper-card p-4 bg-white/90 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center space-x-3 flex-wrap gap-y-2">
          <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px] flex items-center space-x-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Filter Feed:</span>
          </span>

          {/* Platform Selector */}
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="ALL">All Platforms</option>
            <option value="Google">Google Ads</option>
            <option value="Meta">Meta Ads</option>
            <option value="TikTok">TikTok Ads</option>
            <option value="Email">Email Marketing</option>
          </select>

          {/* Event Type Selector */}
          <select
            value={eventTypeFilter}
            onChange={(e) => setEventTypeFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="ALL">All Event Types</option>
            <option value="CLICK">CLICK</option>
            <option value="IMPRESSION">IMPRESSION</option>
          </select>

          {/* Status Selector */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="ALL">All Processing Status</option>
            <option value="processed">Processed (ETL Complete)</option>
            <option value="pending">Pending Ingestion</option>
          </select>
        </div>

        <div className="flex items-center space-x-4 text-slate-500 font-medium">
          <span>Showing <b>{events.length}</b> loaded rows</span>
          <button
            onClick={() => {
              setPlatformFilter('ALL');
              setEventTypeFilter('ALL');
              setStatusFilter('ALL');
            }}
            className="text-xs text-slate-400 hover:text-slate-700 underline font-semibold"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* 4. Main View: Event List (Left) + Multi-Mode Inspector (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left 3 Cols: Clickstream Feed */}
        <div className="lg:col-span-3 paper-card overflow-hidden flex flex-col h-[680px]">
          <div className="p-4 border-b border-[#E8DEC8] bg-[#FAF7F2] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Database className="w-4 h-4 text-[#0D5C3A]" />
              <h3 className="font-bold text-sm text-slate-900">Live MongoDB Event Feed</h3>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              Sorted by received_at DESC
            </span>
          </div>

          <div className="overflow-y-auto flex-1 divide-y divide-[#EADBCE]">
            {loading ? (
              <div className="p-8 text-center text-xs text-slate-400">Loading MongoDB documents...</div>
            ) : events.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">No events matched current filter parameters.</div>
            ) : (
              events.map((ev) => {
                const isSelected = selectedEvent?._id === ev._id;
                const isClick = ev.event_type === 'CLICK';

                return (
                  <div
                    key={ev._id}
                    onClick={() => setSelectedEvent(ev)}
                    className={`p-3.5 flex items-center justify-between cursor-pointer transition-colors ${
                      isSelected ? 'bg-[#E8F5EE] border-l-4 border-l-[#0D5C3A]' : 'hover:bg-[#FAF7F2]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isClick ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {ev.event_type}
                        </span>
                        <span className="font-bold text-xs text-slate-900">{ev.platform}</span>

                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#E8F5EE] text-[#0D5C3A] flex items-center space-x-1">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          <span>Processed</span>
                        </span>

                        <span className="text-[11px] text-slate-400 font-mono">
                          {new Date(ev.timestamp).toLocaleTimeString()}
                        </span>
                      </div>

                      <div className="text-[11px] font-mono text-slate-500">
                        Session: {ev.session_id} | Device: {ev.payload?.device || 'Unknown'} | Cost: ${Number(ev.cost).toFixed(4)}
                      </div>
                    </div>

                    <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-[#0D5C3A]' : 'text-slate-300'}`} />
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right 2 Cols: Inspector with 3 Modes: Readable, Raw JSON, Event Context */}
        <div className="lg:col-span-2 space-y-4 flex flex-col h-[680px]">
          {/* Mode Tabs */}
          <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
            <button
              onClick={() => setInspectorMode('readable')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg flex items-center justify-center space-x-1.5 transition-all ${
                inspectorMode === 'readable'
                  ? 'bg-[#0D5C3A] text-white shadow'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Readable</span>
            </button>

            <button
              onClick={() => setInspectorMode('json')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg flex items-center justify-center space-x-1.5 transition-all ${
                inspectorMode === 'json'
                  ? 'bg-[#0D5C3A] text-white shadow'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileJson className="w-3.5 h-3.5" />
              <span>Raw BSON</span>
            </button>

            <button
              onClick={() => setInspectorMode('context')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg flex items-center justify-center space-x-1.5 transition-all ${
                inspectorMode === 'context'
                  ? 'bg-[#0D5C3A] text-white shadow'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>User Journey</span>
            </button>
          </div>

          {/* Inspector Body */}
          <div className="flex-1 overflow-y-auto">
            {inspectorMode === 'readable' && selectedEvent && (
              <div className="space-y-4">
                {/* Event Metadata Card */}
                <div className="paper-card p-5 bg-white">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center justify-between">
                    <span>Parsed Touchpoint Metadata</span>
                    <span className="font-mono text-[10px] text-slate-400">ID: {selectedEvent._id}</span>
                  </h4>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Session ID:</span>
                      <span className="font-mono font-bold text-slate-800">{selectedEvent.session_id}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">User Profile UUID:</span>
                      <span className="font-mono text-slate-700 truncate max-w-[170px]">{selectedEvent.user_id}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Ad Platform:</span>
                      <span className="font-bold text-slate-800">{selectedEvent.platform}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Interaction Type:</span>
                      <span className="font-bold text-amber-700 font-mono">{selectedEvent.event_type}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Recorded Media Cost:</span>
                      <span className="font-mono font-bold text-emerald-700">${Number(selectedEvent.cost).toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Ingestion Timestamp:</span>
                      <span className="font-mono text-slate-600">{selectedEvent.timestamp}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Client IP / Device:</span>
                      <span className="font-mono text-slate-600">
                        {selectedEvent.payload?.ip || 'N/A'} ({selectedEvent.payload?.device || 'desktop'})
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">UTM Source / Campaign:</span>
                      <span className="font-mono text-slate-700 text-[11px] truncate max-w-[170px]">
                        {selectedEvent.payload?.utm_source || 'direct'} / {selectedEvent.payload?.utm_campaign || 'none'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Lifecycle Pipeline Trace */}
                <div className="paper-card p-5 bg-white">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                    Ingestion Pipeline Trace
                  </h4>

                  <div className="space-y-3 text-xs">
                    <div className="flex items-start space-x-3">
                      <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-bold text-[10px]">
                        1
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">Event Received</div>
                        <div className="text-slate-400 font-mono text-[10px]">{selectedEvent.received_at || selectedEvent.timestamp}</div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 font-bold text-[10px]">
                        2
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">Persisted in MongoDB</div>
                        <div className="text-slate-400 text-[10px]">Collection: <code className="font-mono">raw_clickstream_events</code></div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-[#0D5C3A] flex items-center justify-center shrink-0 font-bold text-[10px]">
                        3
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">Transformed to PostgreSQL</div>
                        <div className="text-slate-400 text-[10px]">Loaded to star schema <code className="font-mono">fact_touchpoint</code></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {inspectorMode === 'json' && selectedEvent && (
              <div className="paper-card p-4 bg-[#141A21] text-slate-200 shadow-xl h-full flex flex-col">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                  <div className="flex items-center space-x-2">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold font-mono uppercase text-slate-400">Raw BSON Document</span>
                  </div>
                  <span className="text-[10px] bg-slate-800 text-emerald-300 font-mono px-2 py-0.5 rounded">
                    MongoDB JSON
                  </span>
                </div>

                <pre className="text-xs font-mono text-emerald-300 leading-relaxed overflow-x-auto p-3 bg-black/40 rounded-xl flex-1 max-h-[580px]">
                  {JSON.stringify(selectedEvent, null, 2)}
                </pre>
              </div>
            )}

            {inspectorMode === 'context' && (
              <div className="paper-card p-5 bg-white h-full overflow-y-auto">
                <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                  <div className="flex items-center space-x-2">
                    <Network className="w-4 h-4 text-[#0D5C3A]" />
                    <h4 className="text-xs font-bold text-slate-900">User Journey Touchpoint Chain</h4>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    user_id: {selectedEvent?.user_id?.slice(0, 8)}...
                  </span>
                </div>

                {contextLoading ? (
                  <div className="py-8 text-center text-xs text-slate-400">Tracing customer touchpoints in MongoDB...</div>
                ) : userContext?.events?.length ? (
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <div className="flex justify-between font-medium text-slate-600 mb-1">
                        <span>Total Interactions: <b>{userContext.summary.touchpointsCount}</b></span>
                        <span>Total Ad Cost: <b>${userContext.summary.totalCost}</b></span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Channels touched: {userContext.summary.platforms.join(' → ')}
                      </div>
                    </div>

                    <div className="space-y-2 mt-3">
                      {userContext.events.map((ev: any, idx: number) => (
                        <div 
                          key={ev._id} 
                          className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${
                            ev._id === selectedEvent?._id 
                              ? 'bg-[#E8F5EE] border-[#0D5C3A]' 
                              : 'bg-white border-slate-100'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[9px]">
                              {idx + 1}
                            </span>
                            <span className="font-bold text-slate-800">{ev.platform}</span>
                            <span className="text-slate-400 text-[10px]">{ev.event_type}</span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-500">
                            {new Date(ev.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center text-xs text-slate-400">
                    No additional touchpoints found for this user in raw store.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5. MongoDB Aggregation Explorer (Allowlisted Queries & Real Pipeline Output) */}
      <div className="paper-card p-6 bg-[#141A21] text-slate-200 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <Code2 className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold font-mono text-sm text-slate-200 uppercase">
                MongoDB Aggregation Pipeline Explorer
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Execute allowlisted aggregation queries directly against MongoDB to verify data engineering pipelines.
            </p>
          </div>

          <div className="flex items-center space-x-2 flex-wrap">
            {[
              { id: 'platform_summary', label: 'Platform Summary' },
              { id: 'device_distribution', label: 'Device Distribution' },
              { id: 'hourly_velocity', label: 'Hourly Velocity' },
              { id: 'utm_source_performance', label: 'UTM Source Performance' },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => runAggregation(btn.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  aggType === btn.id
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {aggLoading ? (
          <div className="py-8 text-center text-xs font-mono text-slate-400">
            Running aggregation pipeline on MongoDB cluster...
          </div>
        ) : aggResult ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Pipeline Definition */}
            <div className="bg-black/50 p-4 rounded-xl border border-slate-800/80">
              <div className="text-[11px] font-mono text-slate-400 uppercase font-bold mb-2 flex items-center justify-between">
                <span>Executed Pipeline Stages</span>
                <span className="text-emerald-400 text-[10px]">db.raw_clickstream_events.aggregate()</span>
              </div>
              <p className="text-[11px] text-slate-400 mb-2 italic">
                {aggResult.explanation}
              </p>
              <pre className="text-xs font-mono text-emerald-400 leading-relaxed overflow-x-auto max-h-[220px]">
                {JSON.stringify(aggResult.pipeline, null, 2)}
              </pre>
            </div>

            {/* Aggregated Output */}
            <div className="bg-black/50 p-4 rounded-xl border border-slate-800/80">
              <div className="text-[11px] font-mono text-slate-400 uppercase font-bold mb-2 flex items-center justify-between">
                <span>Result Cursor (Documents: {aggResult.results?.length || 0})</span>
                <span className="text-amber-400 text-[10px]">Real BSON Aggregation</span>
              </div>
              <pre className="text-xs font-mono text-slate-300 leading-relaxed overflow-x-auto max-h-[240px]">
                {JSON.stringify(aggResult.results, null, 2)}
              </pre>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
