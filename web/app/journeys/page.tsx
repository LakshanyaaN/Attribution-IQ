'use client';

import React, { useEffect, useState } from 'react';
import { 
  GitCommit, 
  ArrowRight, 
  CheckCircle2, 
  MapPin, 
  Layers, 
  Users,
  Filter
} from 'lucide-react';

interface JourneyPath {
  full_journey_path: string;
  journey_frequency: string;
  avg_touchpoints: string;
}

export default function JourneysPage() {
  const [journeys, setJourneys] = useState<JourneyPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTouchpoints, setFilterTouchpoints] = useState<string>('ALL');

  useEffect(() => {
    fetch('/api/journeys')
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setJourneys(json.data || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = journeys.filter((j) => {
    if (filterTouchpoints === 'ALL') return true;
    return Math.round(Number(j.avg_touchpoints)).toString() === filterTouchpoints;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E8DEC8] pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#0D5C3A] mb-1">
            <span>✦ Multi-Touch Sequence Graph</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#181E24] tracking-tight font-editorial italic">
            Customer Journey Paths
          </h1>
          <p className="text-sm md:text-base text-slate-600 font-medium mt-1">
            Recursive path aggregation of multi-touch user sequences leading to verified conversion.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2 bg-white p-1 rounded-xl border border-[#EADBCE] text-xs font-bold text-slate-700 shadow-sm">
          <span className="px-2 text-slate-400">Steps:</span>
          {['ALL', '1', '2', '3'].map((len) => (
            <button
              key={len}
              onClick={() => setFilterTouchpoints(len)}
              className={`px-3 py-1 rounded-lg transition-colors ${
                filterTouchpoints === len
                  ? 'bg-slate-900 text-white'
                  : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              {len === 'ALL' ? 'All Steps' : `${len} Touch`}
            </button>
          ))}
        </div>
      </div>

      {/* Main Flow Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filtered.map((item, idx) => {
          const steps = item.full_journey_path.split(' -> ');
          const freq = Number(item.journey_frequency);
          const maxFreq = 30; // normalized scale
          const barWidth = Math.min(100, Math.round((freq / maxFreq) * 100));

          return (
            <div 
              key={idx} 
              className="paper-card p-5 hover:border-[#0D5C3A] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Left: Journey Path Step Flow */}
              <div className="flex-1">
                <div className="flex items-center space-x-2 flex-wrap gap-y-2">
                  {steps.map((step, sIdx) => {
                    const isConversion = step.toLowerCase().includes('conversion');
                    let badgeColor = 'bg-slate-100 text-slate-800 border-slate-300';
                    if (step === 'Meta') badgeColor = 'bg-red-50 text-red-700 border-red-200';
                    if (step === 'TikTok') badgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-200';
                    if (step === 'Google') badgeColor = 'bg-blue-50 text-blue-800 border-blue-200';
                    if (step === 'Email') badgeColor = 'bg-amber-50 text-amber-800 border-amber-200';
                    if (isConversion) badgeColor = 'bg-[#E8F5EE] text-[#0D5C3A] border-[#A3D9B1] font-bold';

                    return (
                      <React.Fragment key={sIdx}>
                        <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center space-x-1.5 shadow-sm ${badgeColor}`}>
                          {isConversion ? <CheckCircle2 className="w-3.5 h-3.5 text-[#0D5C3A]" /> : <MapPin className="w-3 h-3 text-slate-400" />}
                          <span>{step}</span>
                        </div>
                        {sIdx < steps.length - 1 && (
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>

                <div className="mt-3 text-xs text-slate-500 font-medium">
                  Average path duration across touchpoints: <span className="font-bold text-slate-800">{item.avg_touchpoints} steps</span>
                </div>
              </div>

              {/* Right: Path Frequency Metric */}
              <div className="shrink-0 md:text-right min-w-[140px]">
                <div className="text-2xl font-extrabold text-slate-900">
                  {freq} <span className="text-xs font-bold text-slate-500 uppercase">orders</span>
                </div>
                <div className="w-32 bg-slate-100 h-2 rounded-full overflow-hidden mt-1.5 ml-auto">
                  <div className="bg-[#0D5C3A] h-full rounded-full" style={{ width: `${barWidth}%` }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
