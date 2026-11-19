'use client';

import React, { useEffect, useState } from 'react';
import { useRole } from '@/components/AppShell';
import { 
  Sparkles, 
  Search, 
  Tag, 
  CheckCircle, 
  Layers, 
  ExternalLink,
  Target,
  X,
  Database,
  BarChart2,
  Cpu
} from 'lucide-react';

interface Creative {
  creative_id: string;
  headline: string;
  body_text: string;
  call_to_action: string;
  campaign_name: string;
  channel: string;
  similarity_score: string | null;
}

export default function CreativesPage() {
  const { role } = useRole();
  const [queryText, setQueryText] = useState('Attribution');
  const [channelFilter, setChannelFilter] = useState('ALL');
  const [creatives, setCreatives] = useState<Creative[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalCreative, setModalCreative] = useState<Creative | null>(null);

  const fetchCreatives = (searchQ: string, channel: string) => {
    setLoading(true);
    const url = `/api/creatives/search?q=${encodeURIComponent(searchQ)}&channel=${channel}&role=${role}`;
    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setCreatives(json.data || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCreatives(queryText, channelFilter);
  }, [role, channelFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCreatives(queryText, channelFilter);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E8DEC8] pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#0D5C3A] mb-1">
            <span>✦ pgvector 384-Dimensional Embedding Search</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#181E24] tracking-tight font-editorial italic">
            Ad Library & Creative Vector Search
          </h1>
          <p className="text-sm md:text-base text-slate-600 font-medium mt-1">
            Semantic similarity engine powered by PostgreSQL cosine distance operator: <code className="bg-white px-2 py-0.5 rounded border border-[#EADBCE] text-xs font-mono">&lt;=&gt;</code>
          </p>
        </div>

        <div className="stamp-green transform -rotate-1 shadow-sm text-xs font-bold">
          COSINE SIMILARITY ACTIVE
        </div>
      </div>

      {/* Semantic Search Box styled in collage fashion */}
      <form onSubmit={handleSearch} className="paper-card p-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            placeholder="Try searching semantic concepts: 'Black Friday sneakers discount', 'b2b analytics', 'growth DTC'..."
            className="w-full pl-11 pr-4 py-3 bg-[#FAF7F2] border border-[#EADBCE] rounded-xl text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0D5C3A]/20 focus:border-[#0D5C3A]"
          />
        </div>

        {/* Channel Selector */}
        <select
          value={channelFilter}
          onChange={(e) => setChannelFilter(e.target.value)}
          className="px-4 py-3 bg-white border border-[#EADBCE] rounded-xl text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
        >
          <option value="ALL">All Channels</option>
          <option value="Meta">Meta</option>
          <option value="Google">Google</option>
          <option value="TikTok">TikTok</option>
          <option value="Email">Email</option>
        </select>

        <button
          type="submit"
          className="px-6 py-3 bg-[#0D5C3A] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#08422A] transition-all shadow-md flex items-center justify-center space-x-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Search Embeddings</span>
        </button>
      </form>

      {/* Creative Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {creatives.map((c) => {
          const score = c.similarity_score ? parseFloat(c.similarity_score) : 1.0;
          const scorePct = Math.round(score * 100);

          let channelBadge = 'bg-blue-50 text-blue-700 border-blue-200';
          if (c.channel === 'Meta') channelBadge = 'bg-red-50 text-red-700 border-red-200';
          if (c.channel === 'TikTok') channelBadge = 'bg-emerald-50 text-emerald-700 border-emerald-200';
          if (c.channel === 'Email') channelBadge = 'bg-amber-50 text-amber-700 border-amber-200';

          return (
            <div key={c.creative_id} className="paper-card p-6 flex flex-col justify-between hover:shadow-lg transition-all group border-t-4 border-t-[#0D5C3A]">
              <div>
                {/* Header row */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold ${channelBadge}`}>
                    {c.channel}
                  </span>
                  {/* Similarity Badge */}
                  <div className="flex items-center space-x-1 text-xs font-bold px-2.5 py-1 rounded-full bg-[#E8F5EE] text-[#0D5C3A] border border-[#A3D9B1]">
                    <Target className="w-3 h-3" />
                    <span>{scorePct}% Match</span>
                  </div>
                </div>

                {/* Campaign name */}
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  {c.campaign_name}
                </div>

                {/* Ad Headline */}
                <h3 className="text-xl font-bold font-editorial italic text-slate-900 mb-2 leading-snug">
                  "{c.headline}"
                </h3>

                {/* Ad Body Text */}
                <p className="text-xs text-slate-600 leading-relaxed font-medium mb-4">
                  {c.body_text}
                </p>
              </div>

              {/* Footer CTA Button */}
              <div className="pt-4 border-t border-[#E8DEC8] flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400 truncate max-w-[140px]">
                  ID: {c.creative_id.substring(0, 8)}...
                </span>
                
                {/* Interactive CTA Button */}
                <button
                  type="button"
                  onClick={() => setModalCreative(c)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold shadow-sm hover:bg-[#0D5C3A] active:scale-95 transition-all flex items-center space-x-1"
                >
                  <span>{c.call_to_action || 'Learn More'}</span>
                  <ExternalLink className="w-3 h-3 ml-1 opacity-70" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Ad Creative Detail Modal */}
      {modalCreative && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="paper-card max-w-lg w-full p-6 bg-white shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setModalCreative(null)}
              className="absolute right-4 top-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#0D5C3A] mb-1">
              <span>✦ Ad Creative Simulation & Telemetry</span>
            </div>
            <h3 className="text-2xl font-bold font-editorial italic text-slate-900 mb-2">
              "{modalCreative.headline}"
            </h3>

            {/* Creative Meta Badges */}
            <div className="flex items-center space-x-2 mb-4">
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-800">
                {modalCreative.channel} Network
              </span>
              <span className="stamp-green text-[10px] py-0.5">
                {modalCreative.similarity_score ? `${Math.round(parseFloat(modalCreative.similarity_score) * 100)}% Match` : '100% Match'}
              </span>
            </div>

            {/* Ad Body Preview */}
            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EADBCE] text-xs text-slate-700 leading-relaxed mb-4">
              <div className="font-bold text-slate-900 mb-1">Creative Copy:</div>
              {modalCreative.body_text}
            </div>

            {/* Database & Vector Intelligence Details */}
            <div className="space-y-2 text-xs mb-6">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 flex items-center space-x-1.5">
                  <Database className="w-3.5 h-3.5 text-slate-400" />
                  <span>Campaign Source:</span>
                </span>
                <span className="font-bold text-slate-900">{modalCreative.campaign_name}</span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 flex items-center space-x-1.5">
                  <Cpu className="w-3.5 h-3.5 text-slate-400" />
                  <span>pgvector Embedding:</span>
                </span>
                <span className="font-mono text-[11px] text-[#0D5C3A] font-bold">384-dim text-embedding vector</span>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-500 flex items-center space-x-1.5">
                  <BarChart2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Configured Call-to-Action:</span>
                </span>
                <span className="font-bold text-slate-900 px-2 py-0.5 bg-slate-100 rounded">
                  {modalCreative.call_to_action}
                </span>
              </div>
            </div>

            {/* Simulated Action */}
            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#E8DEC8]">
              <button
                type="button"
                onClick={() => setModalCreative(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Close Preview
              </button>
              <button
                type="button"
                onClick={() => {
                  alert(`[Ad Interaction Recorded]\nAction: "${modalCreative.call_to_action}" triggered.\nTelemetry event will route to MongoDB raw_clickstream with cost and session attribution.`);
                  setModalCreative(null);
                }}
                className="px-5 py-2 rounded-xl bg-[#0D5C3A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#08422A] shadow-md transition-all"
              >
                Simulate Click & Ingest Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
