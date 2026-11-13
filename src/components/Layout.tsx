import { ReactNode, useEffect, useState } from 'react';
import { LayoutDashboard, ListChecks, BarChart3, Settings, Code2, Menu, X } from 'lucide-react';

export type PageId = 'dashboard' | 'problems' | 'analytics' | 'settings';

const NAV: { id: PageId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'problems', label: 'Problems', icon: ListChecks },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

interface LayoutProps {
  page: PageId;
  onNavigate: (page: PageId) => void;
  solvedCount: number;
  children: ReactNode;
}

export default function Layout({ page, onNavigate, solvedCount, children }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [page]);

  const nav = (
    <nav className="flex flex-col gap-1">
      {NAV.map(({ id, label, icon: Icon }) => {
        const active = page === id;
        return (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
              active
                ? 'bg-accent-soft text-blue-400'
                : 'text-slate-400 hover:bg-surface-800 hover:text-slate-200'
            }`}
          >
            <Icon size={17} className={active ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300 transition-colors'} />
            {label}
            {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-400" />}
          </button>
        );
      })}
    </nav>
  );

  const sidebarInner = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 px-4 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/20">
          <Code2 size={18} className="text-white" />
        </div>
        <div>
          <p className="text-[15px] font-bold tracking-tight text-white">AlgoBoard</p>
          <p className="text-[11px] font-medium text-slate-500">DSA Progress Tracker</p>
        </div>
      </div>

      <div className="px-3">{nav}</div>

      <div className="mt-auto p-4">
        <div className="rounded-xl border border-line bg-surface-850 p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-400">Problems solved</p>
            <p className="font-mono text-sm font-semibold text-emerald-400">{solvedCount}</p>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-700">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-500"
              style={{ width: `${Math.min(100, solvedCount * 2)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 border-r border-line bg-surface-900/80 backdrop-blur lg:block">
        {sidebarInner}
      </aside>

      {/* Mobile top bar */}
      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-line bg-surface-900/90 backdrop-blur px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
            <Code2 size={16} className="text-white" />
          </div>
          <span className="font-bold tracking-tight text-white">AlgoBoard</span>
        </div>
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="rounded-lg border border-line-bright bg-surface-800 p-2 text-slate-300 transition-colors hover:bg-surface-700"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 border-r border-line bg-surface-900 shadow-elevated animate-slide-in-right">
            {sidebarInner}
          </aside>
        </div>
      )}

      <main className="flex-1 px-4 pb-16 pt-20 sm:px-6 lg:ml-60 lg:px-8 lg:pt-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
