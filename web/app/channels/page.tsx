'use client';

import React, { useEffect, useState } from 'react';
import { useRole } from '@/components/AppShell';
import { 
  Layers, 
  DollarSign, 
  Target, 
  TrendingUp, 
  PieChart, 
  ArrowUpRight,
  Sparkles
} from 'lucide-react';

export default function ChannelsPage() {
  const { role } = useRole();
  const [data, setData] = useState<any[]>([]);
  const [totals, setTotals] = useState<any>(null);
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E8DEC8] pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#0D5C3A] mb-1">
            <span>✦ Omnichannel Portfolio Allocation</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#181E24] tracking-tight font-editorial italic">
            Channel Analytics & Unit Economics
          </h1>
          <p className="text-sm md:text-base text-slate-600 font-medium mt-1">
            Examine unit costs, conversion volume, and ROAS across Google, Meta, TikTok, and Email.
          </p>
        </div>

        <div className="stamp-green shadow-sm text-xs font-bold">
          4 ATTRIBUTED CHANNELS
        </div>
      </div>

      {/* Channel Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.map((c) => {
          const spend = Number(c.total_spend || 0);
          const orders = Number(c.total_attributed_conversions || 0);
          const rev = Number(c.revenue_time_decay || 0);
          const roas = Number(c.roas_time_decay || 0).toFixed(2);
          const cac = orders ? (spend / orders).toFixed(2) : '0.00';

          let borderTop = 'border-t-[#2B6CB0]';
          let badgeBg = 'bg-blue-50 text-blue-700';
          if (c.channel === 'Meta') {
            borderTop = 'border-t-[#D9483B]';
            badgeBg = 'bg-red-50 text-red-700';
          } else if (c.channel === 'TikTok') {
            borderTop = 'border-t-[#0D5C3A]';
            badgeBg = 'bg-emerald-50 text-emerald-800';
          } else if (c.channel === 'Email') {
            borderTop = 'border-t-[#E89E28]';
            badgeBg = 'bg-amber-50 text-amber-800';
          }

          return (
            <div key={c.channel} className={`paper-card p-6 border-t-4 ${borderTop} flex flex-col justify-between hover:shadow-lg transition-all`}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${badgeBg}`}>
                    {c.channel} Network
                  </span>
                  <span className="text-xs font-bold text-slate-500 font-mono">
                    {c.channel === 'Email' ? 'Direct Flow' : 'Paid Media'}
                  </span>
                </div>

                <div className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1">
                  ${spend.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <div className="text-xs text-slate-500 font-medium mb-5">
                  Total Channel Media Spend
                </div>

                <div className="space-y-3 pt-4 border-t border-[#E8DEC8] text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Attributed Orders:</span>
                    <span className="font-bold text-slate-900">{orders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Acquisition CAC:</span>
                    <span className="font-bold text-slate-900 font-mono">${cac}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Time-Decay Revenue:</span>
                    <span className="font-bold text-slate-900 font-mono">
                      ${rev.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E8DEC8] flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Time-Decay ROAS:</span>
                <span className="text-lg font-extrabold text-[#0D5C3A]">
                  {roas}×
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
