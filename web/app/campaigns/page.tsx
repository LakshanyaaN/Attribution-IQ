'use client';

import React, { useEffect, useState } from 'react';
import { useRole } from '@/components/AppShell';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Plus, 
  Lock, 
  CheckCircle2, 
  AlertCircle,
  Database,
  ArrowRight,
  Filter,
  Search
} from 'lucide-react';

interface Campaign {
  campaign_id: string;
  name: string;
  channel: string;
  is_active: boolean;
  cpc_bid: string | null;
  target_network: string | null;
  daily_budget: string | null;
}

export default function CampaignsPage() {
  const { role } = useRole();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States for the Ledger Table
  const [channelFilter, setChannelFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Form States for creating a campaign
  const [newCampaignName, setNewCampaignName] = useState('');
  const [newChannel, setNewChannel] = useState('Meta');
  const [actionStatus, setActionStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
    detail?: string;
  }>({ type: null, message: '' });

  const fetchCampaigns = () => {
    setLoading(true);
    fetch(`/api/campaigns?role=${role}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setCampaigns(json.data || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCampaigns();
  }, [role]);

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionStatus({ type: null, message: '' });

    try {
      const res = await fetch(`/api/campaigns?role=${role}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCampaignName || 'Omnichannel Test Campaign',
          channel: newChannel,
        }),
      });

      const json = await res.json();

      if (json.success) {
        setActionStatus({
          type: 'success',
          message: `Campaign Created Successfully!`,
          detail: `PostgreSQL Role '${role}' has INSERT privilege on dim_campaign. ID: ${json.campaign_id}`,
        });
        setNewCampaignName('');
        fetchCampaigns();
      } else {
        setActionStatus({
          type: 'error',
          message: `PostgreSQL Access Denied: 42501 (insufficient_privilege)`,
          detail: json.detail || json.error,
        });
      }
    } catch (err: any) {
      setActionStatus({
        type: 'error',
        message: 'Request Failed',
        detail: err.message,
      });
    }
  };

  // Filtered campaigns according to Channel Filter and Search Query
  const filteredCampaigns = campaigns.filter((c) => {
    const matchesChannel = channelFilter === 'ALL' || c.channel.toLowerCase() === channelFilter.toLowerCase();
    const matchesSearch = searchQuery === '' || 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.channel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesChannel && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E8DEC8] pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#0D5C3A] mb-1">
            <span>✦ PostgreSQL Role-Based Access Control (RBAC)</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#181E24] tracking-tight font-editorial italic">
            Campaign Ledger & Security Demo
          </h1>
          <p className="text-sm md:text-base text-slate-600 font-medium mt-1">
            Test real database privileges: <code className="bg-white px-2 py-0.5 rounded border border-[#EADBCE] text-xs font-mono font-bold">app_analyst</code> (SELECT only) vs. <code className="bg-white px-2 py-0.5 rounded border border-[#EADBCE] text-xs font-mono font-bold">app_manager</code> (Full CRUD).
          </p>
        </div>

        {/* Current DB Role Badge */}
        <div className={`stamp-${role === 'manager' ? 'green' : 'red'} shadow-sm text-xs`}>
          {role === 'manager' ? 'MANAGER (READ/WRITE ACTIVE)' : 'ANALYST (READ-ONLY ACTIVE)'}
        </div>
      </div>

      {/* Box 1: Interactive Database Permission Tester */}
      <div className="paper-card p-6 bg-gradient-to-r from-white to-[#FBF8F4]">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold font-editorial italic text-slate-900">
            Interactive Database Permission Tester
          </h3>
          <span className="text-[11px] font-bold text-slate-400 font-mono uppercase">
            INSERT INTO dim_campaign
          </span>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Select target channel and insert a new campaign row as your active role ({role}).
        </p>

        <form onSubmit={handleCreateCampaign} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={newCampaignName}
            onChange={(e) => setNewCampaignName(e.target.value)}
            placeholder="New Campaign Name (e.g., 'Spring Clearance Sale')"
            className="flex-1 px-4 py-2.5 bg-[#FAF7F2] border border-[#EADBCE] rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0D5C3A]/20 focus:border-[#0D5C3A]"
          />

          {/* Creation Channel Dropdown */}
          <div className="flex items-center space-x-1.5 bg-white border border-[#EADBCE] px-3 py-1.5 rounded-xl">
            <span className="text-[11px] text-slate-400 font-bold uppercase">Channel:</span>
            <select
              value={newChannel}
              onChange={(e) => setNewChannel(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="Meta">Meta</option>
              <option value="Google">Google</option>
              <option value="TikTok">TikTok</option>
              <option value="Email">Email</option>
            </select>
          </div>

          <button
            type="submit"
            className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white shadow-md flex items-center justify-center space-x-2 transition-all ${
              role === 'manager'
                ? 'bg-[#0D5C3A] hover:bg-[#08422A]'
                : 'bg-slate-800 hover:bg-slate-900'
            }`}
          >
            {role === 'manager' ? <Plus className="w-4 h-4" /> : <Lock className="w-4 h-4 text-amber-400" />}
            <span>Insert Campaign as {role}</span>
          </button>
        </form>

        {/* Live Feedback Toast Banner */}
        {actionStatus.type && (
          <div className={`mt-4 p-4 rounded-xl border flex items-start space-x-3 text-xs leading-relaxed ${
            actionStatus.type === 'success'
              ? 'bg-[#E8F5EE] border-[#A3D9B1] text-[#0D5C3A]'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            {actionStatus.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 shrink-0 text-[#0D5C3A]" />
            ) : (
              <ShieldAlert className="w-5 h-5 shrink-0 text-red-600" />
            )}
            <div>
              <div className="font-bold text-sm mb-0.5">{actionStatus.message}</div>
              <div className="font-mono text-[11px] opacity-90">{actionStatus.detail}</div>
            </div>
          </div>
        )}
      </div>

      {/* Box 2: Active Campaigns Ledger with Real Channel Filter Bar */}
      <div className="paper-card overflow-hidden">
        <div className="p-6 border-b border-[#E8DEC8] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold font-editorial italic text-slate-900">
              Active Campaigns Ledger
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Filtered database view of campaigns and bid configurations
            </p>
          </div>

          {/* Interactive Channel Filter Bar */}
          <div className="flex items-center space-x-2 flex-wrap gap-y-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search campaigns..."
                className="pl-8 pr-3 py-1.5 bg-[#FAF7F2] border border-[#EADBCE] rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#0D5C3A]"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center space-x-1 bg-[#FAF7F2] p-1 rounded-xl border border-[#EADBCE] text-xs font-bold text-slate-600">
              {['ALL', 'Meta', 'Google', 'TikTok', 'Email'].map((ch) => (
                <button
                  key={ch}
                  type="button"
                  onClick={() => setChannelFilter(ch)}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    channelFilter === ch
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  {ch}
                </button>
              ))}
            </div>

            <span className="text-xs font-mono text-slate-500 pl-2">
              {filteredCampaigns.length} campaigns
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF7F2] text-[11px] uppercase font-bold text-slate-500 border-b border-[#E8DEC8]">
                <th className="p-4 pl-6">Campaign Name</th>
                <th className="p-4">Channel</th>
                <th className="p-4">CPC Bid</th>
                <th className="p-4">Daily Budget</th>
                <th className="p-4">Target Network</th>
                <th className="p-4 pr-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EADBCE] text-xs">
              {filteredCampaigns.length > 0 ? (
                filteredCampaigns.map((camp) => (
                  <tr key={camp.campaign_id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                    <td className="p-4 pl-6 font-bold text-slate-900">
                      {camp.name}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">
                        {camp.channel}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-slate-600">
                      {camp.cpc_bid ? `$${Number(camp.cpc_bid).toFixed(2)}` : '—'}
                    </td>
                    <td className="p-4 font-mono text-slate-600">
                      {camp.daily_budget ? `$${Number(camp.daily_budget).toFixed(2)}` : '—'}
                    </td>
                    <td className="p-4 text-slate-500">
                      {camp.target_network || 'Standard Feed'}
                    </td>
                    <td className="p-4 pr-6">
                      <span className="stamp-green text-[10px] py-0.5">
                        ACTIVE
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 font-medium">
                    No campaigns found matching channel "{channelFilter}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
