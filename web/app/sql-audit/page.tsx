'use client';

import React, { useEffect, useState } from 'react';
import { useRole } from '@/components/AppShell';
import { 
  ShieldCheck, 
  Terminal, 
  Database, 
  Cpu, 
  HardDrive, 
  Zap, 
  Lock, 
  Layers,
  Activity,
  CheckCircle2,
  RefreshCw,
  Play,
  AlertTriangle,
  FileCheck2,
  ListFilter,
  BarChart2,
  Code2,
  Check,
  X,
  Gauge
} from 'lucide-react';

export default function SqlAuditPage() {
  const { role } = useRole();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Tab State: 'overview' | 'rbac_matrix' | 'audit_trail' | 'query_lab'
  const [activeTab, setActiveTab] = useState<'overview' | 'rbac_matrix' | 'audit_trail' | 'query_lab'>('overview');

  // Permission Matrix State
  const [permMatrix, setPermMatrix] = useState<any>(null);
  const [permLoading, setPermLoading] = useState(false);

  // Safe RBAC Simulator State
  const [simRole, setSimRole] = useState<'analyst' | 'manager'>(role);
  const [simAction, setSimAction] = useState('select_campaigns');
  const [simResult, setSimResult] = useState<any>(null);
  const [simRunning, setSimRunning] = useState(false);

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [auditCharts, setAuditCharts] = useState<any>(null);
  const [auditTotal, setAuditTotal] = useState(0);
  const [auditOpFilter, setAuditOpFilter] = useState('ALL');
  const [auditTableFilter, setAuditTableFilter] = useState('ALL');
  const [auditLoading, setAuditLoading] = useState(false);

  // Query Performance Lab State
  const [queryCatalog, setQueryCatalog] = useState<any[]>([]);
  const [selectedQueryId, setSelectedQueryId] = useState('channel_roas');
  const [queryPlanData, setQueryPlanData] = useState<any>(null);
  const [queryRunning, setQueryRunning] = useState(false);

  const fetchStats = () => {
    setLoading(true);
    fetch(`/api/system/audit?role=${role}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setStats(json);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const fetchPermissions = () => {
    setPermLoading(true);
    fetch('/api/system/permissions')
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setPermMatrix(json);
      })
      .catch((err) => console.error(err))
      .finally(() => setPermLoading(false));
  };

  const fetchAuditLogs = () => {
    setAuditLoading(true);
    const params = new URLSearchParams({
      role,
      operation: auditOpFilter,
      table: auditTableFilter,
      limit: '50',
    });

    fetch(`/api/system/audit-logs?${params.toString()}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setAuditLogs(json.logs || []);
          setAuditCharts(json.charts || null);
          setAuditTotal(json.totalCount || 0);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setAuditLoading(false));
  };

  const runSimulation = () => {
    setSimRunning(true);
    fetch('/api/system/simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: simAction, role: simRole }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setSimResult(json);
      })
      .catch((err) => console.error(err))
      .finally(() => setSimRunning(false));
  };

  const runQueryLab = (qId: string) => {
    setQueryRunning(true);
    setSelectedQueryId(qId);
    fetch(`/api/system/performance?role=${role}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ queryId: qId }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setQueryPlanData(json);
      })
      .catch((err) => console.error(err))
      .finally(() => setQueryRunning(false));
  };

  useEffect(() => {
    fetchStats();
    fetchPermissions();
    fetchAuditLogs();
    // Load Query Lab Catalog
    fetch('/api/system/performance')
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setQueryCatalog(json.queries || []);
          if (json.queries?.length) {
            runQueryLab(json.queries[0].id);
          }
        }
      });
  }, [role]);

  useEffect(() => {
    fetchAuditLogs();
  }, [auditOpFilter, auditTableFilter]);

  const bufferHit = stats?.bufferHitRatio || '99.8';

  return (
    <div className="space-y-8">
      {/* 1. Header with System Identity & Global Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E8DEC8] pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#0D5C3A] mb-1">
            <span>✦ Database Engineering & RBAC Observability</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#181E24] tracking-tight font-editorial italic">
            SQL Control Center & RBAC Infrastructure
          </h1>
          <p className="text-sm md:text-base text-slate-600 font-medium mt-1">
            PostgreSQL internal metrics: Buffer cache hit ratios, security permission matrices, live audit trails, and execution plan profiling.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              fetchStats();
              fetchAuditLogs();
              fetchPermissions();
            }}
            className="px-3.5 py-1.5 rounded-xl bg-white border border-[#EADBCE] text-xs font-bold text-slate-700 shadow-sm hover:border-slate-400 flex items-center space-x-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync Catalog</span>
          </button>
          <div className="stamp-green text-xs font-bold shadow-sm">
            PG 16.3 + PGVECTOR
          </div>
        </div>
      </div>

      {/* 2. Primary Feature Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {[
          { id: 'overview', label: 'Engine Overview', icon: Cpu },
          { id: 'rbac_matrix', label: 'Role Permission Matrix & Simulator', icon: ShieldCheck },
          { id: 'audit_trail', label: 'Persisted Audit Trail & Logs', icon: FileCheck2 },
          { id: 'query_lab', label: 'Query Performance Lab (EXPLAIN)', icon: Gauge },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-[#0D5C3A] text-white shadow-md'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-[#EADBCE]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: ENGINE OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Top 4 Database Health Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="paper-card p-5 relative overflow-hidden group hover:border-[#0D5C3A] transition-all">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>Buffer Cache Hit</span>
                </span>
              </div>
              <div className="text-3xl font-extrabold text-[#0D5C3A] tracking-tight">
                {bufferHit}%
              </div>
              <div className="mt-2 text-xs text-slate-500 font-medium">
                RAM throughput efficiency
              </div>
            </div>

            <div className="paper-card p-5 relative overflow-hidden group hover:border-[#0D5C3A] transition-all">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5">
                  <Cpu className="w-3.5 h-3.5 text-blue-500" />
                  <span>Storage Engine</span>
                </span>
              </div>
              <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
                PostgreSQL 16
              </div>
              <div className="mt-2 text-xs text-slate-500 font-medium">
                pgvector 0.7.0 extension active
              </div>
            </div>

            <div className="paper-card p-5 relative overflow-hidden group hover:border-[#0D5C3A] transition-all">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Database Principal</span>
                </span>
              </div>
              <div className="text-2xl font-extrabold text-slate-900 tracking-tight font-mono">
                {role === 'manager' ? 'app_manager' : 'app_analyst'}
              </div>
              <div className="mt-2 text-xs font-semibold text-slate-600">
                {role === 'manager' ? 'Permissions: SELECT, INSERT, UPDATE, DELETE' : 'Permissions: SELECT (Least Privilege)'}
              </div>
            </div>

            <div className="paper-card p-5 relative overflow-hidden group hover:border-[#0D5C3A] transition-all">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5">
                  <FileCheck2 className="w-3.5 h-3.5 text-purple-600" />
                  <span>Audit Trail Ledger</span>
                </span>
              </div>
              <div className="text-2xl font-extrabold text-slate-900 tracking-tight font-mono">
                {auditTotal} entries
              </div>
              <div className="mt-2 text-xs text-slate-500 font-medium">
                Recorded mutations in audit_log
              </div>
            </div>
          </div>

          {/* Tables & Index Health Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Table Sizes & Live Row Counts */}
            <div className="paper-card overflow-hidden">
              <div className="p-5 border-b border-[#E8DEC8] bg-[#FAF7F2] flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <HardDrive className="w-4 h-4 text-[#0D5C3A]" />
                  <h3 className="font-bold text-sm text-slate-900">Relation Sizes & Live Tuple Counts</h3>
                </div>
                <span className="text-[11px] font-mono text-slate-400">pg_stat_user_tables</span>
              </div>

              <div className="overflow-x-auto max-h-[380px]">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-white text-slate-400 uppercase font-mono border-b border-slate-100">
                      <th className="p-3 pl-5">Table Name</th>
                      <th className="p-3">Live Rows</th>
                      <th className="p-3">Table Size</th>
                      <th className="p-3 pr-5">Index Size</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EADBCE]">
                    {(stats?.tables || []).map((t: any) => (
                      <tr key={t.table_name} className="hover:bg-[#FAF7F2]/60">
                        <td className="p-3 pl-5 font-bold font-mono text-slate-900">{t.table_name}</td>
                        <td className="p-3 font-semibold text-slate-700">{Number(t.row_count).toLocaleString()}</td>
                        <td className="p-3 text-slate-500 font-mono">{t.table_size}</td>
                        <td className="p-3 pr-5 text-[#0D5C3A] font-mono font-bold">{t.index_size}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Index Utilization & Scans */}
            <div className="paper-card overflow-hidden">
              <div className="p-5 border-b border-[#E8DEC8] bg-[#FAF7F2] flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-emerald-600" />
                  <h3 className="font-bold text-sm text-slate-900">Index Scan Utilization Profiler</h3>
                </div>
                <span className="text-[11px] font-mono text-slate-400">pg_stat_user_indexes</span>
              </div>

              <div className="overflow-x-auto max-h-[380px]">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-white text-slate-400 uppercase font-mono border-b border-slate-100">
                      <th className="p-3 pl-5">Index Name</th>
                      <th className="p-3">Table</th>
                      <th className="p-3">Total Scans</th>
                      <th className="p-3 pr-5">Tuples Read</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EADBCE]">
                    {(stats?.indexes || []).slice(0, 8).map((idx: any) => (
                      <tr key={idx.index_name} className="hover:bg-[#FAF7F2]/60">
                        <td className="p-3 pl-5 font-bold font-mono text-slate-800 truncate max-w-[180px]">{idx.index_name}</td>
                        <td className="p-3 text-slate-600">{idx.table_name}</td>
                        <td className="p-3 font-bold text-[#0D5C3A] font-mono">{Number(idx.scans_count).toLocaleString()}</td>
                        <td className="p-3 pr-5 font-mono text-slate-500">{Number(idx.tuples_read).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RBAC PERMISSION MATRIX & SIMULATOR */}
      {activeTab === 'rbac_matrix' && (
        <div className="space-y-8">
          {/* Permission Matrix from information_schema */}
          <div className="paper-card overflow-hidden">
            <div className="p-5 border-b border-[#E8DEC8] bg-[#FAF7F2] flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  Role-Based Access Control (RBAC) Privilege Matrix
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verified grants extracted live from PostgreSQL <code className="font-mono">information_schema.role_table_grants</code>
                </p>
              </div>
              <span className="stamp-green text-[10px] py-0.5">Live Schema Introspection</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-white text-slate-400 uppercase font-mono border-b border-slate-100">
                    <th className="p-3 pl-6">Catalog Relation</th>
                    <th className="p-3 text-center bg-blue-50/40 text-blue-900 font-bold">
                      app_analyst (SELECT)
                    </th>
                    <th className="p-3 text-center bg-amber-50/40 text-amber-900 font-bold">
                      app_manager (SELECT)
                    </th>
                    <th className="p-3 text-center bg-amber-50/40 text-amber-900 font-bold">
                      app_manager (INSERT)
                    </th>
                    <th className="p-3 text-center bg-amber-50/40 text-amber-900 font-bold">
                      app_manager (UPDATE)
                    </th>
                    <th className="p-3 pr-6 text-center bg-amber-50/40 text-amber-900 font-bold">
                      app_manager (DELETE)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EADBCE]">
                  {Object.keys(permMatrix?.matrix || {}).map((table) => {
                    const row = permMatrix.matrix[table];
                    const analystSelect = row.analyst.includes('SELECT');
                    const mgrSelect = row.manager.includes('SELECT');
                    const mgrInsert = row.manager.includes('INSERT');
                    const mgrUpdate = row.manager.includes('UPDATE');
                    const mgrDelete = row.manager.includes('DELETE');

                    return (
                      <tr key={table} className="hover:bg-[#FAF7F2]/60">
                        <td className="p-3 pl-6 font-mono font-bold text-slate-900">{table}</td>
                        <td className="p-3 text-center bg-blue-50/20">
                          {analystSelect ? (
                            <span className="inline-flex items-center text-emerald-600 font-bold">
                              <Check className="w-4 h-4 mr-1" /> GRANTED
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-rose-500 font-bold">
                              <X className="w-4 h-4 mr-1" /> REVOKED
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-center bg-amber-50/10">
                          {mgrSelect ? (
                            <span className="inline-flex items-center text-emerald-600 font-bold">
                              <Check className="w-4 h-4 mr-1" /> GRANTED
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-rose-500 font-bold">
                              <X className="w-4 h-4 mr-1" /> REVOKED
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-center bg-amber-50/10">
                          {mgrInsert ? (
                            <span className="inline-flex items-center text-emerald-600 font-bold">
                              <Check className="w-4 h-4 mr-1" /> GRANTED
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-rose-500 font-bold">
                              <X className="w-4 h-4 mr-1" /> REVOKED
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-center bg-amber-50/10">
                          {mgrUpdate ? (
                            <span className="inline-flex items-center text-emerald-600 font-bold">
                              <Check className="w-4 h-4 mr-1" /> GRANTED
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-rose-500 font-bold">
                              <X className="w-4 h-4 mr-1" /> REVOKED
                            </span>
                          )}
                        </td>
                        <td className="p-3 pr-6 text-center bg-amber-50/10">
                          {mgrDelete ? (
                            <span className="inline-flex items-center text-emerald-600 font-bold">
                              <Check className="w-4 h-4 mr-1" /> GRANTED
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-rose-500 font-bold">
                              <X className="w-4 h-4 mr-1" /> REVOKED
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Safe RBAC Permission Simulator */}
          <div className="paper-card p-6 bg-white shadow-sm border-l-4 border-l-[#0D5C3A]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-[#0D5C3A]" />
                  <h3 className="font-bold text-base text-slate-900">
                    Safe Role-Based Permission Simulator
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Dispatch controlled SQL operations directly against PostgreSQL connection pools to observe server-enforced security boundaries.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <select
                  value={simRole}
                  onChange={(e) => setSimRole(e.target.value as any)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-xs text-slate-800"
                >
                  <option value="analyst">Test as app_analyst</option>
                  <option value="manager">Test as app_manager</option>
                </select>

                <select
                  value={simAction}
                  onChange={(e) => setSimAction(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-xs text-slate-800"
                >
                  <option value="select_campaigns">SELECT FROM dim_campaign</option>
                  <option value="select_audit_log">SELECT FROM audit_log</option>
                  <option value="insert_test_campaign">INSERT INTO dim_campaign</option>
                  <option value="update_budget">UPDATE dim_paid_campaign (Budget)</option>
                  <option value="delete_touchpoint">DELETE FROM fact_touchpoint</option>
                </select>

                <button
                  onClick={runSimulation}
                  disabled={simRunning}
                  className="px-4 py-1.5 bg-[#0D5C3A] hover:bg-[#0A472C] text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow transition-colors"
                >
                  <Play className={`w-3.5 h-3.5 ${simRunning ? 'animate-spin' : ''}`} />
                  <span>Execute Test</span>
                </button>
              </div>
            </div>

            {simResult && (
              <div className={`mt-4 p-4 rounded-xl border text-xs font-mono transition-all ${
                simResult.allowed 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950' 
                  : 'bg-rose-50 border-rose-200 text-rose-950'
              }`}>
                <div className="flex items-center justify-between font-bold mb-2">
                  <span className="flex items-center space-x-2">
                    {simResult.allowed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                    )}
                    <span>{simResult.statusMessage}</span>
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Execution Time: {simResult.executionTimeMs} ms
                  </span>
                </div>

                <div className="text-[11px] text-slate-600 space-y-1">
                  <div>Operation Target: <b>{simResult.description}</b></div>
                  <div>Principal Tested: <b>{simResult.roleTested}</b></div>
                  {simResult.errorCode && (
                    <div className="text-rose-700 font-bold">SQLSTATE Error Code: {simResult.errorCode}</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT TRAIL & LOGS */}
      {activeTab === 'audit_trail' && (
        <div className="space-y-8">
          {/* Audit Metrics Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="paper-card p-5 bg-white">
              <div className="text-xs font-bold uppercase text-slate-400 mb-2">Operations Logged</div>
              <div className="space-y-2">
                {(auditCharts?.operations || []).map((op: any) => (
                  <div key={op.operation} className="flex justify-between text-xs">
                    <span className="font-mono font-bold text-slate-700">{op.operation}</span>
                    <span className="font-mono text-slate-900 font-bold">{op.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="paper-card p-5 bg-white">
              <div className="text-xs font-bold uppercase text-slate-400 mb-2">Tables Audited</div>
              <div className="space-y-2">
                {(auditCharts?.tables || []).map((t: any) => (
                  <div key={t.table_name} className="flex justify-between text-xs">
                    <span className="font-mono text-slate-700">{t.table_name}</span>
                    <span className="font-mono text-[#0D5C3A] font-bold">{t.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="paper-card p-5 bg-white">
              <div className="text-xs font-bold uppercase text-slate-400 mb-2">Audit Triggers Active</div>
              <div className="text-xs text-slate-600 space-y-1.5">
                <div>• <code className="font-mono">trg_audit_campaign_budget</code> on dim_paid_campaign</div>
                <div>• <code className="font-mono">trg_deduct_refund</code> on fact_refund</div>
                <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                  Full before/after state diff captured in JSONB columns.
                </div>
              </div>
            </div>
          </div>

          {/* Audit Log Table */}
          <div className="paper-card overflow-hidden">
            <div className="p-5 border-b border-[#E8DEC8] bg-[#FAF7F2] flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  Persisted Security Audit Trail Ledger (<code className="font-mono">audit_log</code>)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Append-only immutable record of data mutations, budget adjustments, and refund deductions.
                </p>
              </div>

              {/* Filters */}
              <div className="flex items-center space-x-3 text-xs">
                <select
                  value={auditOpFilter}
                  onChange={(e) => setAuditOpFilter(e.target.value)}
                  className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg font-bold text-slate-700"
                >
                  <option value="ALL">All Operations</option>
                  <option value="UPDATE">UPDATE</option>
                  <option value="INSERT">INSERT</option>
                  <option value="DELETE">DELETE</option>
                </select>

                <select
                  value={auditTableFilter}
                  onChange={(e) => setAuditTableFilter(e.target.value)}
                  className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg font-bold text-slate-700"
                >
                  <option value="ALL">All Tables</option>
                  <option value="dim_paid_campaign">dim_paid_campaign</option>
                  <option value="fact_conversion">fact_conversion</option>
                  <option value="dim_campaign">dim_campaign</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto max-h-[500px]">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-white text-slate-400 uppercase font-mono border-b border-slate-100">
                    <th className="p-3 pl-6">Log ID</th>
                    <th className="p-3">Timestamp (UTC)</th>
                    <th className="p-3">Table</th>
                    <th className="p-3">Operation</th>
                    <th className="p-3">Record ID</th>
                    <th className="p-3">Actor</th>
                    <th className="p-3 pr-6">State Diff (Old vs New)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EADBCE]">
                  {auditLoading ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400">Loading audit records...</td>
                    </tr>
                  ) : auditLogs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500">No audit logs matching criteria.</td>
                    </tr>
                  ) : (
                    auditLogs.map((log) => (
                      <tr key={log.log_id} className="hover:bg-[#FAF7F2]/60">
                        <td className="p-3 pl-6 font-mono font-bold text-slate-800">#{log.log_id}</td>
                        <td className="p-3 font-mono text-slate-500">{new Date(log.logged_at).toLocaleString()}</td>
                        <td className="p-3 font-mono font-bold text-slate-900">{log.table_name}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 font-mono">
                            {log.operation}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-slate-600 truncate max-w-[120px]">{log.record_id}</td>
                        <td className="p-3 font-mono text-[#0D5C3A] font-semibold">{log.performed_by}</td>
                        <td className="p-3 pr-6 font-mono text-[11px] text-slate-600">
                          {log.new_data ? JSON.stringify(log.new_data) : 'N/A'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: QUERY PERFORMANCE LAB */}
      {activeTab === 'query_lab' && (
        <div className="space-y-6">
          {/* Query Selection Bar */}
          <div className="paper-card p-5 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Allowlisted Query Library</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Select an analytical workload to run live execution plan analysis via PostgreSQL <code className="font-mono">EXPLAIN (ANALYZE, BUFFERS)</code>
              </p>
            </div>

            <div className="flex items-center space-x-2 flex-wrap">
              {queryCatalog.map((q) => (
                <button
                  key={q.id}
                  onClick={() => runQueryLab(q.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedQueryId === q.id
                      ? 'bg-[#0D5C3A] text-white shadow'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {q.title}
                </button>
              ))}
            </div>
          </div>

          {queryRunning ? (
            <div className="py-12 text-center text-xs font-mono text-slate-500">
              Executing query & analyzing execution plan with EXPLAIN (ANALYZE, BUFFERS)...
            </div>
          ) : queryPlanData ? (
            <div className="space-y-6">
              {/* Metrics Summary Strip */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="paper-card p-4 bg-white">
                  <div className="text-[11px] font-bold text-slate-400 uppercase">Execution Time</div>
                  <div className="text-2xl font-extrabold text-[#0D5C3A] tracking-tight font-mono">
                    {queryPlanData.executionTimeMs} ms
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">Real database runtime</div>
                </div>

                <div className="paper-card p-4 bg-white">
                  <div className="text-[11px] font-bold text-slate-400 uppercase">Planning Time</div>
                  <div className="text-2xl font-extrabold text-blue-600 tracking-tight font-mono">
                    {queryPlanData.planningTimeMs} ms
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">Optimizer plan synthesis</div>
                </div>

                <div className="paper-card p-4 bg-white">
                  <div className="text-[11px] font-bold text-slate-400 uppercase">Returned Rows</div>
                  <div className="text-2xl font-extrabold text-slate-900 tracking-tight font-mono">
                    {queryPlanData.rowCount}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">Tuples delivered</div>
                </div>

                <div className="paper-card p-4 bg-white">
                  <div className="text-[11px] font-bold text-slate-400 uppercase">Buffer Hit Blocks</div>
                  <div className="text-2xl font-extrabold text-emerald-600 tracking-tight font-mono">
                    {queryPlanData.planSummary?.sharedHitBlocks || 'RAM Hit'}
                  </div>
                  <div className="text-[10px] text-emerald-600 font-semibold mt-1">Shared buffer cache hit</div>
                </div>
              </div>

              {/* SQL Statement + EXPLAIN Terminal View */}
              <div className="paper-card p-6 bg-[#141A21] text-slate-200 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold font-mono uppercase text-slate-300">
                      Live Query Execution Plan: {queryPlanData.title}
                    </span>
                  </div>
                  <span className="stamp-green text-[10px] py-0.5">EXPLAIN (ANALYZE, BUFFERS)</span>
                </div>

                {/* SQL Code Box */}
                <div className="mb-4 bg-black/60 p-3 rounded-lg border border-slate-800 font-mono text-xs text-amber-300">
                  <span className="text-slate-500 select-none">-- Target Query:</span>
                  <div className="mt-1">{queryPlanData.sql}</div>
                </div>

                {/* Raw EXPLAIN Output */}
                <pre className="text-xs font-mono text-emerald-400 leading-relaxed overflow-x-auto p-4 bg-black/40 rounded-xl max-h-[360px]">
                  {queryPlanData.planText}
                </pre>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
