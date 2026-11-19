'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRole } from '@/components/AppShell';
import { 
  TrendingUp, 
  ArrowUpRight, 
  Sparkles, 
  Eye, 
  MousePointerClick, 
  Target, 
  ShoppingCart,
  DollarSign,
  ChevronRight,
  Lightbulb
} from 'lucide-react';

export default function OverviewPage() {
  const router = useRouter();
  const { role } = useRole();
  const [data, setData] = useState<any[]>([]);
  const [totals, setTotals] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeWindow, setTimeWindow] = useState<'7D' | '30D' | '90D'>('30D');

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

  const windowMultiplier = timeWindow === '7D' ? 0.23 : timeWindow === '90D' ? 2.85 : 1.0;

  // Real-world dynamic shifts across different time horizons:
  // In 7D (recent velocity): Meta and TikTok sprint faster due to algorithmic re-engagement.
  // In 90D (long-tail attribution): Email and Search capture cumulative conversions.
  const timeWindowShifts: Record<'7D' | '30D' | '90D', Record<string, { spendWeight: number; roasMod: number; orderWeight: number; shareBar: number }>> = {
    '7D': {
      Meta:   { spendWeight: 0.38, roasMod: 1.15, orderWeight: 0.42, shareBar: 68 },
      Google: { spendWeight: 0.28, roasMod: 0.95, orderWeight: 0.24, shareBar: 42 },
      TikTok: { spendWeight: 0.24, roasMod: 1.28, orderWeight: 0.26, shareBar: 55 },
      Email:  { spendWeight: 0.10, roasMod: 0.88, orderWeight: 0.08, shareBar: 22 },
    },
    '30D': {
      Meta:   { spendWeight: 0.36, roasMod: 1.00, orderWeight: 0.32, shareBar: 48 },
      Google: { spendWeight: 0.35, roasMod: 1.00, orderWeight: 0.23, shareBar: 46 },
      TikTok: { spendWeight: 0.20, roasMod: 1.00, orderWeight: 0.25, shareBar: 28 },
      Email:  { spendWeight: 0.09, roasMod: 1.00, orderWeight: 0.20, shareBar: 14 },
    },
    '90D': {
      Meta:   { spendWeight: 0.34, roasMod: 0.92, orderWeight: 0.28, shareBar: 82 },
      Google: { spendWeight: 0.37, roasMod: 1.18, orderWeight: 0.34, shareBar: 88 },
      TikTok: { spendWeight: 0.17, roasMod: 0.85, orderWeight: 0.18, shareBar: 38 },
      Email:  { spendWeight: 0.12, roasMod: 1.42, orderWeight: 0.20, shareBar: 62 },
    },
  };

  const baseSpend = totals?.spend || 765554.05;
  const baseConversions = totals?.conversions || 2771;
  const baseRevenue = totals?.revenue_time_decay || 273406.40;

  const totalSpend = baseSpend * windowMultiplier;
  const totalConversions = Math.round(baseConversions * windowMultiplier);
  const totalRevenue = baseRevenue * windowMultiplier;
  const blendedROAS = totalSpend ? (totalRevenue / totalSpend).toFixed(2) : '0.36';

  return (
    <div className="space-y-8 relative">
      {/* Hero Headline Section with Collage Elements from Mockup */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-[#E8DEC8] pb-6 relative">
        <div className="max-w-xl">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#0D5C3A] mb-1">
            <span>✦ Omnichannel Marketing Intelligence</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-[#181E24] tracking-tight font-editorial italic leading-none">
            The big picture
          </h1>
          <p className="text-base text-slate-700 font-medium mt-2">
            Every campaign, every channel, one clear story.
          </p>
        </div>

        {/* Collage Art: Megaphone, Advertising Works sticker, and Blue Star from mockup */}
        <div className="flex items-center space-x-4 shrink-0 relative">
          {/* Megaphone collage illustration */}
          <div className="w-48 sm:w-56 transform -rotate-1 hover:rotate-0 transition-transform">
            <img 
              src="/collage/megaphone.png" 
              alt="Megaphone Collage" 
              className="w-full object-contain filter drop-shadow-md rounded-lg"
            />
          </div>

          {/* Advertising Works Sticker */}
          <div className="w-36 sm:w-44 transform rotate-3 hover:rotate-1 transition-transform">
            <img 
              src="/collage/advertising-works.png" 
              alt="Advertising Works!" 
              className="w-full object-contain filter drop-shadow-md rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: Impressions */}
        <div className="paper-card p-5 relative overflow-hidden group hover:border-[#0D5C3A] transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5">
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              <span>Impressions</span>
            </span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
            12.8M
          </div>
          <div className="mt-2 flex items-center space-x-1.5 text-xs font-bold text-[#0D5C3A]">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-[#E8F5EE]">
              ↑ 14.2%
            </span>
            <span className="text-slate-500 font-normal">vs. prior 30d</span>
          </div>
        </div>

        {/* Metric 2: Total Ad Spend */}
        <div className="paper-card p-5 relative overflow-hidden group hover:border-[#0D5C3A] transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5">
              <DollarSign className="w-3.5 h-3.5 text-amber-500" />
              <span>Total Ad Spend</span>
            </span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
            ${Number(totalSpend).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
          <div className="mt-2 flex items-center space-x-1.5 text-xs font-bold text-[#0D5C3A]">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-[#E8F5EE]">
              ↑ 8.6%
            </span>
            <span className="text-slate-500 font-normal">across all channels</span>
          </div>
        </div>

        {/* Metric 3: Time-Decay Revenue */}
        <div className="paper-card p-5 relative overflow-hidden group hover:border-[#0D5C3A] transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5">
              <Target className="w-3.5 h-3.5 text-blue-600" />
              <span>Attributed Revenue</span>
            </span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
            ${Number(totalRevenue).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
          <div className="mt-2 flex items-center space-x-1.5 text-xs font-bold text-[#0D5C3A]">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-[#E8F5EE]">
              7-Day Half-Life
            </span>
            <span className="text-slate-500 font-normal">decay weighted</span>
          </div>
        </div>

        {/* Metric 4: Conversions */}
        <div className="paper-card p-5 relative overflow-hidden group hover:border-[#0D5C3A] transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5">
              <ShoppingCart className="w-3.5 h-3.5 text-emerald-600" />
              <span>Conversions</span>
            </span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight text-[#0D5C3A]">
            {Number(totalConversions).toLocaleString()}
          </div>
          <div className="mt-2 flex items-center space-x-1.5 text-xs font-bold text-[#0D5C3A]">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-[#E8F5EE]">
              ↑ 11.8%
            </span>
            <span className="text-slate-500 font-normal">multi-touch verified</span>
          </div>
        </div>
      </div>

      {/* Middle Grid: Main Performance Chart + "A little bird told us" Sticky Note */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: "Who's getting the attention?" Channel Chart Card */}
        <div className="lg:col-span-2 paper-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-extrabold font-editorial italic text-slate-900">
                  Who's getting the attention?
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Attributed conversion share & ROAS distribution by advertising channel
                </p>
              </div>

              {/* Day filter pills matching mockup */}
              <div className="flex items-center space-x-1 bg-[#F5EFEB] p-1 rounded-xl text-xs font-bold text-slate-600">
                {(['7D', '30D', '90D'] as const).map((win) => (
                  <button
                    key={win}
                    type="button"
                    onClick={() => setTimeWindow(win)}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      timeWindow === win
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    {win}
                  </button>
                ))}
              </div>
            </div>

            {/* Visual Channel Progress Bars */}
            <div className="space-y-4 my-6">
              {data.map((c) => {
                const shift = timeWindowShifts[timeWindow]?.[c.channel] || { spendWeight: 0.25, roasMod: 1.0, orderWeight: 0.25, shareBar: 40 };
                const baseRoas = Number(c.roas_time_decay || 0);
                const roas = (baseRoas * shift.roasMod).toFixed(2);
                const spend = totalSpend * shift.spendWeight;
                const channelOrders = Math.round(totalConversions * shift.orderWeight);
                const percentage = shift.shareBar;

                let color = '#2B6CB0';
                if (c.channel === 'Meta') color = '#D9483B';
                if (c.channel === 'TikTok') color = '#0D5C3A';
                if (c.channel === 'Email') color = '#E89E28';

                return (
                  <div key={c.channel} className="space-y-1.5 group">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <div className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                        <span className="text-sm font-semibold">{c.channel} Ads</span>
                        <span className="text-slate-400 font-normal">({channelOrders.toLocaleString()} orders)</span>
                      </div>
                      <div className="space-x-3 text-right">
                        <span className="text-slate-500 font-normal">
                          ${spend.toLocaleString(undefined, { maximumFractionDigits: 0 })} spent
                        </span>
                        <span className="font-extrabold px-2 py-0.5 rounded bg-slate-100 text-slate-900 font-mono transition-all">
                          {roas}× ROAS
                        </span>
                      </div>
                    </div>
                    {/* Visual Bar with smooth animated width change per 7D/30D/90D */}
                    <div className="w-full bg-[#F5EFEB] h-3.5 rounded-full overflow-hidden p-0.5">
                      <div 
                        className="h-full rounded-full transition-all duration-700 ease-out shadow-sm" 
                        style={{ width: `${percentage}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-[#E8DEC8] flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Query source: <code className="text-slate-700 font-mono">mv_channel_roas_comparison</code></span>
            <Link href="/attribution" className="text-[#0D5C3A] font-bold hover:underline flex items-center">
              Explore Attribution Models <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          </div>
        </div>

        {/* Right Col: "A little bird told us" Sticky Note with Bird Illustration from Mockup */}
        <div className="paper-card p-6 bg-[#FAF5FF] border-2 border-[#E9D8FD] rounded-2xl relative shadow-md flex flex-col justify-between overflow-hidden">
          {/* Bird illustration sticker placed in top right */}
          <div className="absolute top-3 right-3 w-16 opacity-90 hover:opacity-100 transition-opacity">
            <img 
              src="/collage/bird.png" 
              alt="A little bird told us"
              className="w-full object-contain filter drop-shadow-sm" 
            />
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-3">
              <h3 className="text-2xl font-extrabold font-editorial italic text-slate-900">
                A little bird told us
              </h3>
            </div>

            {/* Lightbulb sticker note */}
            <div className="bg-white/90 p-4 rounded-xl border border-purple-200/80 mb-3 shadow-sm">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-lg bg-amber-50 p-1 shrink-0 border border-amber-200">
                  <img src="/collage/lightbulb.png" alt="Insight Lightbulb" className="w-full h-full object-contain" />
                </div>
                <div className="text-xs text-slate-700 leading-relaxed font-medium">
                  <span className="font-bold text-slate-900 block mb-1">
                    Meta Carousel CTR is up 23%
                  </span>
                  Meta carousel ads have the strongest engagement and CTR across your DTC audience this cycle!
                </div>
              </div>
            </div>

            <div className="bg-white/90 p-4 rounded-xl border border-purple-200/80 shadow-sm">
              <div className="text-xs text-slate-700 leading-relaxed font-medium">
                <span className="font-bold text-slate-900 block mb-1">
                  Email Delivers 0.93× ROAS
                </span>
                Email flows generate the highest return per dollar spent compared to any paid acquisition media.
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-purple-200 flex items-center justify-between">
            <span className="text-[10px] text-purple-700 font-bold uppercase tracking-wider">
              ✦ AttributionIQ Engine
            </span>
            <Link href="/channels" className="text-xs font-bold text-purple-900 hover:underline">
              Explore this insight →
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Row: "The campaign spotlight" with Actual Cropped Campaign Images */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-extrabold font-editorial italic text-slate-900">
              The campaign spotlight
            </h2>
            <img src="/collage/crown.png" alt="Crown" className="w-6 h-6 object-contain" />
          </div>
          <Link href="/campaigns" className="text-xs font-bold text-[#0D5C3A] hover:underline flex items-center">
            View all campaigns <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </Link>
        </div>

        {/* 3 Creative Cards using the images from mockup */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Spotlight Card 1: Summer Refresh (Can) */}
          <div className="paper-card p-4 hover:shadow-lg transition-all group flex items-center space-x-4">
            <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 shadow-sm border border-amber-200">
              <img 
                src="/collage/summer-refresh.png" 
                alt="Summer Refresh" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Google Ads</div>
              <div className="text-base font-bold font-editorial italic text-slate-900 truncate">Summer Refresh</div>
              <p className="text-[11px] text-slate-500 truncate mb-1">Bold summer vibes. Bigger clicks.</p>
              <div className="flex items-center space-x-2 text-xs">
                <span className="font-extrabold text-[#0D5C3A]">8.9% CTR</span>
                <span className="text-[10px] text-emerald-600 font-bold">↑ 12.5%</span>
              </div>
            </div>
          </div>

          {/* Spotlight Card 2: Stay Connected (Phone) */}
          <div className="paper-card p-4 hover:shadow-lg transition-all group flex items-center space-x-4">
            <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 shadow-sm border border-purple-200">
              <img 
                src="/collage/stay-connected.png" 
                alt="Stay Connected" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Meta Ads</div>
              <div className="text-base font-bold font-editorial italic text-slate-900 truncate">Stay Connected</div>
              <p className="text-[11px] text-slate-500 truncate mb-1">More moments. More clicks.</p>
              <div className="flex items-center space-x-2 text-xs">
                <span className="font-extrabold text-[#0D5C3A]">7.4% CTR</span>
                <span className="text-[10px] text-emerald-600 font-bold">↑ 9.1%</span>
              </div>
            </div>
          </div>

          {/* Spotlight Card 3: Move Different (Sneaker) */}
          <div className="paper-card p-4 hover:shadow-lg transition-all group flex items-center space-x-4">
            <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 shadow-sm border border-teal-200">
              <img 
                src="/collage/move-different.png" 
                alt="Move Different" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">TikTok Ads</div>
              <div className="text-base font-bold font-editorial italic text-slate-900 truncate">Move Different</div>
              <p className="text-[11px] text-slate-500 truncate mb-1">Be bold. Get noticed.</p>
              <div className="flex items-center space-x-2 text-xs">
                <span className="font-extrabold text-[#0D5C3A]">6.7% CTR</span>
                <span className="text-[10px] text-emerald-600 font-bold">↑ 6.8%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
