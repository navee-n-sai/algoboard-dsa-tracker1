import { ReactNode } from 'react';

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  accent: string;
  sub?: string;
}

export default function StatCard({ icon, label, value, accent, sub }: StatCardProps) {
  return (
    <div className="group rounded-xl border border-line bg-surface-850 p-5 transition-all duration-200 hover:border-line-bright hover:shadow-card">
      <div className="flex items-center justify-between">
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${accent} transition-transform duration-200 group-hover:scale-105`}>
          {icon}
        </div>
      </div>
      <p className="mt-4 font-mono text-3xl font-bold tracking-tight text-white">{value}</p>
      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      {sub && <p className="mt-0.5 text-xs text-slate-600">{sub}</p>}
    </div>
  );
}
