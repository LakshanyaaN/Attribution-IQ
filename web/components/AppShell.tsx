'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Compass, 
  Sparkles, 
  Layers, 
  GitMerge, 
  MapPin, 
  ShieldCheck, 
  Database,
  Search,
  Cpu,
  BarChart3,
  HardDrive,
  LogIn,
  LogOut
} from 'lucide-react';

interface RoleContextType {
  role: 'analyst' | 'manager';
  setRole: (r: 'analyst' | 'manager') => void;
}

const RoleContext = createContext<RoleContextType>({
  role: 'analyst',
  setRole: () => {},
});

export const useRole = () => useContext(RoleContext);

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [role, setRoleState] = useState<'analyst' | 'manager'>('analyst');

  useEffect(() => {
    const saved = localStorage.getItem('attribution_role') as 'analyst' | 'manager';
    if (saved) setRoleState(saved);
  }, []);

  const handleRoleChange = (newRole: 'analyst' | 'manager') => {
    setRoleState(newRole);
    localStorage.setItem('attribution_role', newRole);
  };

  // If on /login page, don't show the dashboard shell sidebar and header
  if (pathname === '/login') {
    return (
      <RoleContext.Provider value={{ role, setRole: handleRoleChange }}>
        {children}
      </RoleContext.Provider>
    );
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth', { method: 'DELETE' });
      window.location.href = '/login';
    } catch {
      window.location.href = '/login';
    }
  };

  const workspaceNav = [
    { label: 'Overview', href: '/', icon: Compass },
    { label: 'Ad Library', href: '/creatives', icon: Sparkles },
    { label: 'Channels', href: '/channels', icon: Layers },
    { label: 'Attribution', href: '/attribution', icon: GitMerge },
    { label: 'Customer Journeys', href: '/journeys', icon: MapPin },
    { label: 'Campaigns & RBAC', href: '/campaigns', icon: ShieldCheck },
  ];

  const dataSystemsNav = [
    { label: 'Vector Ad Search', href: '/vector-search', icon: Cpu },
    { label: 'Raw MongoDB Events', href: '/raw-events', icon: Database },
    { label: 'SQL Audit & RBAC', href: '/sql-audit', icon: HardDrive },
  ];

  return (
    <RoleContext.Provider value={{ role, setRole: handleRoleChange }}>
      <div className="flex min-h-screen">
        {/* Left Dark Matte Sidebar */}
        <aside className="w-64 bg-[#121820] text-slate-300 flex flex-col justify-between shrink-0 shadow-2xl z-30 relative overflow-hidden">
          <div>
            {/* Logo */}
            <div className="p-6 pb-6 border-b border-slate-800/60">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E89E28] to-[#D9483B] flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-amber-500/20 transform group-hover:rotate-6 transition-transform">
                  ✦
                </div>
                <div>
                  <div className="font-extrabold tracking-tight text-xl text-white font-editorial italic">
                    AttributionIQ
                  </div>
                  <div className="text-[10px] tracking-widest text-[#0D5C3A] bg-[#E8F5EE] px-1.5 py-0.5 rounded font-bold uppercase inline-block">
                    Omnichannel Suite
                  </div>
                </div>
              </Link>
            </div>

            {/* Navigation Section 1: Workspace */}
            <nav className="p-4 space-y-1">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2 font-mono">
                Workspace
              </div>
              {workspaceNav.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#212B36] text-white shadow-inner border border-slate-700/60'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#35B782]' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Navigation Section 2: Data & Systems */}
            <nav className="p-4 pt-0 space-y-1">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2 font-mono">
                Data & Systems
              </div>
              {dataSystemsNav.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href + item.label}
                    href={item.href}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#212B36] text-white shadow-inner border border-slate-700/60'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#35B782]' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Left Sidebar Collage Elements (Yellow Sticker & Statue) */}
          <div className="p-4 relative">
            <div className="mb-2 transform -rotate-2 hover:rotate-0 transition-transform">
              <img 
                src="/collage/yellow-sticker.png" 
                alt="Measure Smarter Advertise Better"
                className="w-32 rounded-lg shadow-md border border-amber-200/40"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
              <button 
                onClick={handleLogout}
                className="text-xs text-slate-400 hover:text-rose-400 flex items-center space-x-1.5 py-1 px-2 rounded-lg hover:bg-slate-800/60 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out / Switch</span>
              </button>
              <div className="w-12 opacity-80 hover:opacity-100 transition-opacity">
                <img 
                  src="/collage/classical-statue.png" 
                  alt="Classical Statue"
                  className="w-full object-contain filter drop-shadow-md"
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-18 px-8 py-4 flex items-center justify-between border-b border-[#E8DEC8] bg-[#F5EFEB]/90 backdrop-blur sticky top-0 z-20">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-white px-3.5 py-2 rounded-xl border border-[#EADBCE] text-xs font-bold text-slate-800 shadow-sm cursor-pointer hover:border-slate-400 transition-colors">
                <span className="w-2 h-2 rounded-full bg-[#0D5C3A]" />
                <span>Acme Omnichannel Brands</span>
              </div>
              <div className="flex items-center space-x-2 bg-white px-3.5 py-2 rounded-xl border border-[#EADBCE] text-xs font-bold text-slate-700 shadow-sm">
                <span>📅 Last 30 days lookback</span>
              </div>
            </div>

            <div className="w-80 relative hidden md:block">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search campaigns, channels, models..."
                className="w-full pl-9 pr-4 py-2 bg-white/80 border border-[#EADBCE] rounded-xl text-xs font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0D5C3A]/30 focus:border-[#0D5C3A]"
              />
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-xl border border-[#EADBCE] shadow-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase">DB Role:</span>
                <select
                  value={role}
                  onChange={(e) => handleRoleChange(e.target.value as 'analyst' | 'manager')}
                  className="bg-transparent font-bold text-xs text-[#0D5C3A] focus:outline-none cursor-pointer"
                >
                  <option value="analyst">Analyst (app_analyst - Read Only)</option>
                  <option value="manager">Manager (app_manager - Read/Write)</option>
                </select>
              </div>

              <Link 
                href="/login"
                className="w-9 h-9 rounded-full bg-[#181E24] text-white flex items-center justify-center font-bold text-xs shadow-md hover:ring-2 hover:ring-[#0D5C3A] transition-all"
                title="Account / Login"
              >
                AIQ
              </Link>
            </div>
          </header>

          <main className="p-8 max-w-[1440px] w-full mx-auto flex-1">
            {children}
          </main>
        </div>
      </div>
    </RoleContext.Provider>
  );
}
