'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  GitFork,
  Sparkles,
  Database,
  ShieldCheck,
  Settings,
  LayoutPanelTop,
  Users,
  Folder,
  FileStack,
  CreditCard,
} from 'lucide-react';

const sections = [
  {
    title: 'WORKSPACE',
    items: [
      { label: 'Overview', href: '/', icon: BarChart3 },
      { label: 'Attribution Models', href: '/attribution', icon: BarChart3 },
      { label: 'Customer Journeys', href: '/journeys', icon: GitFork },
      { label: 'Channel Analytics', href: '/channels', icon: LayoutPanelTop },
      { label: 'Campaign Explorer', href: '/campaigns', icon: ShieldCheck },
      { label: 'Insights', href: '/insights', icon: Users },
    ],
  },
  {
    title: 'DATA & ENGINEERING',
    items: [
      { label: 'Data Explorer', href: '/data-explorer', icon: Folder },
      { label: 'SQL Workspace', href: '/sql-workspace', icon: FileStack },
      { label: 'Vector Search', href: '/creatives', icon: Sparkles },
      { label: 'Raw Event Store', href: '/raw-events', icon: Database },
    ],
  },
  {
    title: 'SYSTEM',
    items: [
      { label: 'Transactions & Audit', href: '/transactions', icon: CreditCard },
      { label: 'Settings', href: '/settings', icon: Settings },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-background border-r border-border p-4">
      {/* Branding */}
      <div className="flex items-center space-x-2 mb-8">
        <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center font-bold text-white shadow-lg">
          AIQ
        </div>
        <div className="text-xl font-semibold text-primary">AttributionIQ</div>
      </div>
      {/* Sections */}
      {sections.map((sec) => (
        <div key={sec.title} className="mb-6">
          <p className="text-xs font-medium text-secondary uppercase mb-2">{sec.title}</p>
          {sec.items.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 px-2 py-1.5 rounded-md text-sm transition-colors ${
                  active ? 'bg-surface text-primary' : 'text-secondary hover:bg-surface/50 hover:text-primary'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      ))}
    </aside>
  );
}
