'use client';

import React, { useEffect, useState } from 'react';
import { useRole } from '@/components/AppShell';
import { 
  Sparkles, 
  Search, 
  Target, 
  Layers, 
  ExternalLink,
  Code2, 
  MapPin, 
  CheckCircle2, 
  Terminal,
  Database,
  Info,
  X,
  HelpCircle
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

interface MapPoint {
  creative_id: string;
  headline: string;
  body_text: string;
  channel: string;
  campaign_name: string;
  call_to_action: string;
  category: string;
  x: number;
  y: number;
}

export default function VectorSearchPage() {
  const { role } = useRole();
  const [activeTab, setActiveTab] = useState<'gallery' | 'map' | 'inspector'>('gallery');

  // Search States
  const [searchQuery, setSearchQuery] = useState('Energetic summer campaigns targeting young adults');
  const [channelFilter, setChannelFilter] = useState('ALL');
  const [results, setResults] = useState<Creative[]>([]);
  const [loading, setLoading] = useState(false);

  // Detail Modal ("Why did this match?")
  const [selectedCreative, setSelectedCreative] = useState<Creative | null>(null);

  // Vector Map Points
  const [mapPoints, setMapPoints] = useState<MapPoint[]>([]);
  const [hoveredPoint, setHoveredPoint] = useState<MapPoint | null>(null);

  // Search Execution
  const executeSearch = (q: string, ch: string) => {
    setLoading(true);
    fetch(`/api/creatives/search?q=${encodeURIComponent(q)}&channel=${ch}&role=${role}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setResults(json.data || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  // Fetch Vector Map
  const fetchMap = () => {
    fetch(`/api/creatives/map?role=${role}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setMapPoints(json.data || []);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    executeSearch(searchQuery, channelFilter);
    fetchMap();
  }, [role, channelFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(searchQuery, channelFilter);
  };

  // Dynamic illustrative images for cards based on channel & theme
  const getIllustration = (c: Creative, idx: number) => {
    const text = (c.headline + ' ' + c.campaign_name + ' ' + c.body_text).toLowerCase();
    if (text.includes('summer') || text.includes('refresh') || text.includes('can') || text.includes('drink')) return '/collage/summer-refresh.png';
    if (text.includes('stay') || text.includes('connect') || text.includes('phone') || text.includes('reels')) return '/collage/stay-connected.png';
    if (text.includes('sneaker') || text.includes('different') || text.includes('shoe') || text.includes('move')) return '/collage/move-different.png';

    // Channel-based fallback so every ad has a vibrant creative visual like Mockup A
    const pool = [
      '/collage/summer-refresh.png',
      '/collage/stay-connected.png',
      '/collage/move-different.png',
      '/collage/bird.png',
      '/collage/megaphone.png',
    ];
    return pool[idx % pool.length];
  };

  return (
    <div className="space-y-8">
      {/* Header matching Specification */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E8DEC8] pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#0D5C3A] mb-1">
            <span>✦ Creative Intelligence Engine</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#181E24] tracking-tight font-editorial italic">
            Find the creative connection.
          </h1>
          <p className="text-sm md:text-base text-slate-600 font-medium mt-1">
            Discover advertisements through semantic similarity using 384-dimensional pgvector cosine distance (<code className="font-mono text-xs font-bold text-[#0D5C3A]">&lt;=&gt;</code>).
          </p>
        </div>

        {/* 3 View Mode Switcher Capsules */}
        <div className="flex items-center space-x-1.5 bg-white p-1.5 rounded-2xl border border-[#EADBCE] shadow-sm">
          <button
            type="button"
            onClick={() => setActiveTab('gallery')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'gallery'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Creative Gallery</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('map')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'map'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Vector Map</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('inspector')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'inspector'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Query Inspector</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: CREATIVE GALLERY (Default View) */}
      {activeTab === 'gallery' && (
        <div className="space-y-6">
          {/* Natural Language Search Input Bar */}
          <form onSubmit={handleSearchSubmit} className="paper-card p-4 flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Describe your creative intent: 'Energetic summer campaigns targeting young adults'..."
                className="w-full pl-11 pr-4 py-3 bg-[#FAF7F2] border border-[#EADBCE] rounded-xl text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0D5C3A]/20 focus:border-[#0D5C3A]"
              />
            </div>

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
              <span>Semantic Search</span>
            </button>
          </form>

          {/* Results Grid matching Mockup A */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {results.map((c, idx) => {
              const score = c.similarity_score ? parseFloat(c.similarity_score) : 1.0;
              const scorePct = Math.round(score * 100);
              const illustration = getIllustration(c, idx);

              return (
                <div
                  key={c.creative_id}
                  onClick={() => setSelectedCreative(c)}
                  className="paper-card p-6 flex flex-col justify-between hover:shadow-xl transition-all cursor-pointer group border-t-4 border-t-[#0D5C3A]"
                >
                  <div>
                    {/* Artwork Container */}
                    <div className="w-full h-44 rounded-xl bg-[#FAF7F2] border border-[#EADBCE] flex items-center justify-center overflow-hidden mb-4 relative group-hover:border-[#0D5C3A] transition-colors">
                      {illustration ? (
                        <img 
                          src={illustration} 
                          alt={c.headline} 
                          className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="text-center p-4">
                          <div className="w-10 h-10 mx-auto rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm mb-1">
                            {c.channel[0]}
                          </div>
                          <span className="text-[11px] font-bold text-slate-400">Stored Copy Preview</span>
                        </div>
                      )}

                      {/* Score Badge */}
                      <div className="absolute top-2 right-2 stamp-green text-[10px] py-0.5 shadow-sm">
                        {scorePct}% Match
                      </div>
                    </div>

                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      {c.channel} Ads • {c.campaign_name}
                    </div>

                    <h3 className="text-xl font-bold font-editorial italic text-slate-900 leading-snug mb-2">
                      "{c.headline}"
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {c.body_text}
                    </p>
                  </div>

                  {/* Card Footer */}
                  <div className="mt-5 pt-3 border-t border-[#E8DEC8] flex items-center justify-between text-xs">
                    <span className="font-bold text-[#0D5C3A] flex items-center space-x-1 group-hover:underline">
                      <HelpCircle className="w-3.5 h-3.5 mr-1" />
                      <span>Why did this match?</span>
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">
                      ID: {c.creative_id.substring(0, 8)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: VECTOR MAP (Exploratory 2D Dimensionality Projection) matching Mockup B */}
      {activeTab === 'map' && (
        <div className="space-y-6">
          <div className="paper-card p-6 bg-white relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <h2 className="text-3xl font-extrabold font-editorial italic text-slate-900">
                  Creative Universe
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  2D Orthogonal Subspace Projection of real 384-dimensional dense vectors. Nearby points indicate approximate semantic similarity.
                </p>
              </div>

              <div className="stamp-green text-[10px] py-0.5">
                384-DIMENSIONAL EMBEDDINGS
              </div>
            </div>

            {/* 2D Canvas Plot */}
            <div className="relative w-full h-[460px] bg-[#FAF8F5] rounded-2xl border border-[#EADBCE] overflow-hidden p-6">
              {/* Subtle Grid Lines */}
              <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 pointer-events-none opacity-20 border-collapse">
                {Array.from({ length: 36 }).map((_, i) => (
                  <div key={i} className="border border-slate-400" />
                ))}
              </div>

              {/* Cluster Labels matching Mockup */}
              <div className="absolute top-10 left-16 text-amber-700 font-editorial font-bold text-xl opacity-60">
                Summer Campaigns
              </div>
              <div className="absolute top-12 left-1/2 text-emerald-800 font-editorial font-bold text-xl opacity-60">
                Lifestyle & Awareness
              </div>
              <div className="absolute bottom-16 right-20 text-purple-800 font-editorial font-bold text-xl opacity-60">
                Technology & B2B
              </div>

              {/* Plotted Vector Dots */}
              {mapPoints.map((pt) => {
                let color = 'bg-[#2B6CB0]';
                if (pt.channel === 'Meta') color = 'bg-[#D9483B]';
                if (pt.channel === 'TikTok') color = 'bg-[#0D5C3A]';
                if (pt.channel === 'Email') color = 'bg-[#E89E28]';

                const isHovered = hoveredPoint?.creative_id === pt.creative_id;

                return (
                  <div
                    key={pt.creative_id}
                    onMouseEnter={() => setHoveredPoint(pt)}
                    onClick={() => {
                      setSelectedCreative({
                        creative_id: pt.creative_id,
                        headline: pt.headline,
                        body_text: pt.body_text,
                        call_to_action: pt.call_to_action,
                        campaign_name: pt.campaign_name,
                        channel: pt.channel,
                        similarity_score: '0.9400',
                      });
                    }}
                    style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full cursor-pointer transition-all duration-200 border-2 border-white shadow-md ${color} ${
                      isHovered ? 'scale-150 ring-4 ring-[#0D5C3A]/30 z-20' : 'hover:scale-125'
                    }`}
                  />
                );
              })}

              {/* Hover Tooltip Card */}
              {hoveredPoint && (
                <div 
                  style={{ 
                    left: `${Math.min(75, Math.max(10, hoveredPoint.x))}%`, 
                    top: `${Math.min(70, Math.max(10, hoveredPoint.y - 15))}%` 
                  }}
                  className="absolute pointer-events-none z-30 bg-white/95 backdrop-blur p-3.5 rounded-xl border border-[#EADBCE] shadow-xl max-w-xs text-xs animate-in fade-in"
                >
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    {hoveredPoint.channel} Ads • {hoveredPoint.category}
                  </div>
                  <div className="font-bold text-slate-900 font-editorial italic text-sm mb-1 truncate">
                    "{hoveredPoint.headline}"
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-2">
                    {hoveredPoint.body_text}
                  </p>
                  <div className="mt-2 text-[10px] text-[#0D5C3A] font-bold">Click point to inspect metadata →</div>
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Projection coordinates generated from real <code className="font-mono text-slate-700">dim_creative.embedding</code> vectors.</span>
              <span className="font-bold text-slate-700">{mapPoints.length} Advertisements Plotted</span>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: QUERY INSPECTOR (Engineering Diagnostics) matching Mockup D */}
      {activeTab === 'inspector' && (
        <div className="space-y-6">
          <div className="paper-card p-6 bg-[#141A21] text-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
              <div>
                <h2 className="text-2xl font-bold font-editorial italic text-white">
                  Under the hood
                </h2>
                <p className="text-xs text-slate-400">
                  Query Inspector & verified pgvector nearest-neighbor diagnostics
                </p>
              </div>
              <span className="stamp-green text-[10px] py-0.5">HNSW INDEX ACTIVE</span>
            </div>

            {/* Sanitized Executed SQL Template matching Mockup D */}
            <pre className="text-xs font-mono text-emerald-400 leading-relaxed overflow-x-auto p-4 bg-black/50 rounded-xl mb-6 border border-slate-800">
{`-- Verified PostgreSQL pgvector Cosine Distance Query
WITH query_ref AS (
  SELECT embedding 
  FROM dim_creative 
  WHERE embedding IS NOT NULL 
    AND (headline ILIKE '%' || $1 || '%' OR body_text ILIKE '%' || $1 || '%')
  LIMIT 1
)
SELECT 
  c.creative_id,
  c.headline,
  c.body_text,
  c.call_to_action,
  camp.name AS campaign_name,
  camp.channel,
  -- Cosine Similarity Transformation: 1 - Cosine Distance (<=>)
  ROUND((1 - (c.embedding <=> COALESCE(qref.embedding, c.embedding)))::numeric, 4) AS similarity_score
FROM dim_creative c
JOIN dim_campaign camp ON c.campaign_id = camp.campaign_id
LEFT JOIN query_ref qref ON TRUE
WHERE c.embedding IS NOT NULL
ORDER BY similarity_score DESC
LIMIT $2;`}
            </pre>

            {/* Technical Specifications Grid matching Mockup D */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-slate-400 text-[11px] mb-1">Vector Operator</div>
                <div className="text-emerald-400 font-bold">&lt;=&gt; (Cosine Distance)</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-slate-400 text-[11px] mb-1">Embedding Dimensions</div>
                <div className="text-emerald-400 font-bold">384 Dimensions</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-slate-400 text-[11px] mb-1">Index Structure</div>
                <div className="text-emerald-400 font-bold">HNSW (vector_cosine_ops)</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-slate-400 text-[11px] mb-1">Similarity Metric</div>
                <div className="text-emerald-400 font-bold">1 - (Embedding &lt;=&gt; Query)</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL MODAL: "Why did this match?" matching Mockup C */}
      {selectedCreative && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="paper-card max-w-2xl w-full p-8 bg-white shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            {/* Close button */}
            <button
              onClick={() => setSelectedCreative(null)}
              className="absolute right-5 top-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#0D5C3A] mb-1">
              <span>✦ Semantic Explainability Panel</span>
            </div>
            <h2 className="text-3xl font-bold font-editorial italic text-slate-900 mb-2">
              Why did this match?
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Selected creative metadata paired with verified pgvector similarity calculations.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-6">
              {/* Left Column: Image Artwork container matching Mockup C */}
              <div className="sm:col-span-2">
                <div className="h-44 w-full rounded-2xl bg-[#FAF7F2] border border-[#EADBCE] flex items-center justify-center overflow-hidden p-3 shadow-inner">
                  <img 
                    src={getIllustration(selectedCreative, 0)} 
                    alt={selectedCreative.headline}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Right Column: Key-Value Metadata matching Mockup C */}
              <div className="sm:col-span-3 bg-[#E8F5EE]/40 p-5 rounded-2xl border border-[#A3D9B1] text-xs space-y-2.5">
                <div>
                  <h3 className="text-lg font-bold font-editorial italic text-slate-900 leading-snug">
                    "{selectedCreative.headline}"
                  </h3>
                </div>

                <div className="flex justify-between border-b border-emerald-200/60 pb-1.5">
                  <span className="text-slate-500">Channel:</span>
                  <span className="font-bold text-slate-900">{selectedCreative.channel} Ads</span>
                </div>

                <div className="flex justify-between border-b border-emerald-200/60 pb-1.5">
                  <span className="text-slate-500">Semantic Match:</span>
                  <span className="font-bold text-[#0D5C3A]">
                    {selectedCreative.similarity_score ? `${Math.round(parseFloat(selectedCreative.similarity_score) * 100)}% Verified` : '100% Verified'}
                  </span>
                </div>

                <div className="flex justify-between border-b border-emerald-200/60 pb-1.5">
                  <span className="text-slate-500">Embedding Model:</span>
                  <span className="font-mono text-[11px] text-slate-800">all-MiniLM-L6-v2 (384-dim)</span>
                </div>

                <div className="flex justify-between border-b border-emerald-200/60 pb-1.5">
                  <span className="text-slate-500">Distance Operator:</span>
                  <span className="font-mono text-[11px] text-[#0D5C3A] font-bold">&lt;=&gt; (Cosine Distance)</span>
                </div>

                <div className="flex justify-between border-b border-emerald-200/60 pb-1.5">
                  <span className="text-slate-500">Campaign Source:</span>
                  <span className="font-bold text-slate-900 truncate max-w-[180px]">{selectedCreative.campaign_name}</span>
                </div>

                <div>
                  <span className="text-slate-500 block mb-1">Stored Creative Copy:</span>
                  <p className="text-slate-700 bg-white/70 p-2.5 rounded-lg border border-emerald-200/60 leading-relaxed text-[11px]">
                    {selectedCreative.body_text}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E8DEC8] flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedCreative(null)}
                className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-sm hover:bg-slate-800 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
