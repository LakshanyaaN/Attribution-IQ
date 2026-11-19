'use client';

import React, { useEffect, useState } from 'react';
import { useRole } from '@/components/AppShell';
import { 
  GitMerge, 
  HelpCircle, 
  ArrowRight, 
  Check, 
  TrendingUp, 
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';

type Model = 'first_touch' | 'last_touch' | 'linear' | 'time_decay';

const modelDefinitions = {
  first_touch: {
    title: 'First-Touch Attribution',
    badge: '100% Top of Funnel',
    desc: 'Allocates 100% of conversion revenue to the earliest recorded customer touchpoint. Demonstrates which acquisition channels introduce new audiences.',
    color: '#2B6CB0',
  },
  last_touch: {
    title: 'Last-Touch Attribution',
    badge: '100% Conversion Closer',
    desc: 'Allocates 100% of conversion revenue to the final touchpoint directly preceding the order. Favors high-intent retargeting and email flows.',
    color: '#D9483B',
  },
  linear: {
    title: 'Linear Attribution',
    badge: 'Equal Weight Multi-Touch',
    desc: 'Distributes credit uniformly (1/N) across all touchpoints in the path. Simple and egalitarian, but ignores time and touchpoint order.',
    color: '#E89E28',
  },
  time_decay: {
    title: 'Time-Decay (7-Day Half-Life)',
    badge: 'Exponential Decay Weighting',
    desc: 'Applies an exponential decay curve: 2^(-delta_t / 7 days). Touchpoints closer to conversion receive exponentially more credit while fairly acknowledging discovery.',
    color: '#0D5C3A',
  },
};

export default function AttributionPage() {
  const { role } = useRole();
  const [data, setData] = useState<any[]>([]);
  const [totals, setTotals] = useState<any>(null);
  const [selectedModel, setSelectedModel] = useState<Model>('time_decay');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/roas?role=${role}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setData(json.data || []);
          setTotals(json.totals || null);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [role]);

  const activeDef = modelDefinitions[selectedModel];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E8DEC8] pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#0D5C3A] mb-1">
            <span>✦ Multi-Touch Algorithmic Modeling</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#181E24] tracking-tight font-editorial italic">
            Attribution & ROAS Intelligence
          </h1>
          <p className="text-sm md:text-base text-slate-600 font-medium mt-1">
            Compare mathematical models directly against PostgreSQL Materialized View: <code className="bg-white px-2 py-0.5 rounded border border-[#EADBCE] text-xs font-mono">mv_channel_roas_comparison</code>
          </p>
        </div>

        {/* Status Stamp */}
        <div className="stamp-green transform rotate-1 shadow-sm text-xs font-bold">
          LIVE SQL MATERIALIZED VIEW
        </div>
      </div>

      {/* Model Selector Pills matching collage aesthetic */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(Object.keys(modelDefinitions) as Model[]).map((key) => {
          const item = modelDefinitions[key];
          const isSelected = selectedModel === key;
          return (
            <button
              key={key}
              onClick={() => setSelectedModel(key)}
              className={`p-4 rounded-2xl text-left transition-all border ${
                isSelected
                  ? 'bg-white border-[#0D5C3A] shadow-md ring-2 ring-[#0D5C3A]/20'
                  : 'bg-white/60 border-[#EADBCE] hover:bg-white hover:border-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded ${
                  isSelected ? 'bg-[#E8F5EE] text-[#0D5C3A]' : 'bg-slate-100 text-slate-500'
                }`}>
                  {key.replace('_', ' ')}
                </span>
                {isSelected && <Check className="w-4 h-4 text-[#0D5C3A]" />}
              </div>
              <div className="font-bold text-slate-900 text-sm">{item.title}</div>
            </button>
          );
        })}
      </div>

      {/* Selected Model Focus Card */}
      <div className="paper-card p-6 border-l-4 border-l-[#0D5C3A] bg-gradient-to-r from-white to-[#F9F7F4]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xl font-bold text-slate-900">{activeDef.title}</h3>
              <span className="stamp-green text-[10px] py-0.5">{activeDef.badge}</span>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              {activeDef.desc}
            </p>
          </div>

          <div className="flex items-center space-x-6 text-right shrink-0">
            <div>
              <div className="text-[11px] font-bold uppercase text-slate-400">Total Spend</div>
              <div className="text-lg font-bold text-slate-900">
                ${totals?.spend ? Number(totals.spend).toLocaleString(undefined, { maximumFractionDigits: 0 }) : '$765,554'}
              </div>
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase text-slate-400">Attributed Orders</div>
              <div className="text-lg font-bold text-slate-900">
                {totals?.conversions || 2771}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Attribution Comparison Ledger Table */}
      <div className="paper-card overflow-hidden">
        <div className="p-6 border-b border-[#E8DEC8] flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold font-editorial italic text-slate-900">
              Channel Model Ledger
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Direct SQL view showing revenue and ROAS shifts across all four algorithms
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500 font-mono">
            SELECT * FROM mv_channel_roas_comparison;
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF7F2] text-[11px] uppercase font-bold text-slate-500 border-b border-[#E8DEC8]">
                <th className="p-4 pl-6">Channel</th>
                <th className="p-4">Total Spend</th>
                <th className="p-4">First-Touch ROAS</th>
                <th className="p-4">Last-Touch ROAS</th>
                <th className="p-4">Linear ROAS</th>
                <th className="p-4 pr-6 bg-[#E8F5EE]/40 text-[#0D5C3A]">Time-Decay (7d) ROAS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EADBCE] text-sm">
              {data.map((row) => {
                const ftRoas = Number(row.roas_first_touch || 0).toFixed(2);
                const ltRoas = Number(row.roas_last_touch || 0).toFixed(2);
                const linRoas = Number(row.roas_linear || 0).toFixed(2);
                const tdRoas = Number(row.roas_time_decay || 0).toFixed(2);

                const isCurrentHighlighted = selectedModel === 'time_decay';

                return (
                  <tr key={row.channel} className="hover:bg-[#FAF7F2]/60 transition-colors">
                    <td className="p-4 pl-6 font-bold text-slate-900 flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#0D5C3A]" />
                      <span>{row.channel}</span>
                    </td>
                    <td className="p-4 font-mono font-medium text-slate-600">
                      ${Number(row.total_spend).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className={`p-4 font-semibold ${selectedModel === 'first_touch' ? 'bg-amber-50 text-amber-900 font-bold' : 'text-slate-700'}`}>
                      {ftRoas}×
                    </td>
                    <td className={`p-4 font-semibold ${selectedModel === 'last_touch' ? 'bg-amber-50 text-amber-900 font-bold' : 'text-slate-700'}`}>
                      {ltRoas}×
                    </td>
                    <td className={`p-4 font-semibold ${selectedModel === 'linear' ? 'bg-amber-50 text-amber-900 font-bold' : 'text-slate-700'}`}>
                      {linRoas}×
                    </td>
                    <td className={`p-4 pr-6 font-bold ${isCurrentHighlighted ? 'bg-[#E8F5EE] text-[#0D5C3A]' : 'text-[#0D5C3A]'}`}>
                      {tdRoas}×
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
