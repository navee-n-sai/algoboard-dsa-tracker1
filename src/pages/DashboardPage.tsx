import { Target, CheckCircle2, Flame, ListTodo, Plus } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Problem, DIFFICULTY_STYLES, topicColor } from '@/lib/types';
import { computeStats, timeAgo } from '@/lib/storage';
import StatCard from '@/components/StatCard';
import PageHeader from '@/components/PageHeader';
import { useToast } from '@/components/Toast';

interface DashboardPageProps {
  problems: Problem[];
  onNavigate: (page: 'problems') => void;
}

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { value?: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-line-bright bg-surface-850 px-3 py-2 shadow-elevated">
      <p className="text-xs font-medium text-slate-300">{label}</p>
      <p className="font-mono text-sm font-semibold text-white">{payload[0]?.value ?? 0} solved</p>
    </div>
  );
}

export default function DashboardPage({ problems, onNavigate }: DashboardPageProps) {
  const { toast } = useToast();
  const stats = computeStats(problems);

  const topicData = Object.entries(
    problems.reduce<Record<string, { solved: number; total: number }>>((acc, p) => {
      acc[p.topic] = acc[p.topic] || { solved: 0, total: 0 };
      acc[p.topic].total += 1;
      if (p.status === 'Solved') acc[p.topic].solved += 1;
      return acc;
    }, {}),
  )
    .map(([topic, d]) => ({ topic, solved: d.solved, total: d.total, fill: topicColor(topic) }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 8);

  const recent = [...problems]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 6);

  const difficultyBreakdown = [
    { name: 'Easy', ...stats.easy, fill: DIFFICULTY_STYLES.Easy.hex },
    { name: 'Medium', ...stats.medium, fill: DIFFICULTY_STYLES.Medium.hex },
    { name: 'Hard', ...stats.hard, fill: DIFFICULTY_STYLES.Hard.hex },
  ];

  return (
    <div className="animate-fade-up">
      <PageHeader
        title="Dashboard"
        subtitle="Your DSA preparation at a glance."
        action={
          <button
            onClick={() => {
              onNavigate('problems');
              toast('Use the Add Problem button on the Problems page.', 'info');
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
          >
            <Plus size={16} />
            Add Problem
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          icon={<CheckCircle2 size={17} className="text-emerald-400" />}
          label="Solved"
          value={stats.solved}
          accent="bg-emerald-500/10"
          sub={`of ${stats.total} total`}
        />
        <StatCard
          icon={<Flame size={17} className="text-amber-400" />}
          label="Attempted"
          value={stats.attempted}
          accent="bg-amber-500/10"
          sub="in progress"
        />
        <StatCard
          icon={<ListTodo size={17} className="text-slate-300" />}
          label="To Do"
          value={stats.todo}
          accent="bg-slate-500/10"
          sub="queued up"
        />
        <StatCard
          icon={<Target size={17} className="text-blue-400" />}
          label="Completion"
          value={`${stats.completion}%`}
          accent="bg-blue-500/10"
          sub="overall"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="rounded-xl border border-line bg-surface-850 p-5 lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Topic-wise progress</h2>
            <span className="text-xs text-slate-500">Top {topicData.length} topics</span>
          </div>
          {topicData.length === 0 ? (
            <p className="py-12 text-center text-sm text-slate-500">No topics tracked yet.</p>
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topicData} margin={{ top: 4, right: 4, bottom: 4, left: -24 }}>
                  <XAxis
                    dataKey="topic"
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    tickLine={false}
                    axisLine={{ stroke: '#232330' }}
                    interval={0}
                    angle={-30}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(59,130,246,0.06)' }} />
                  <Bar dataKey="solved" radius={[4, 4, 0, 0]} maxBarSize={36}>
                    {topicData.map((entry) => (
                      <Cell key={entry.topic} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-line bg-surface-850 p-5 lg:col-span-2">
          <h2 className="mb-4 text-sm font-semibold text-white">Difficulty breakdown</h2>
          <div className="space-y-4">
            {difficultyBreakdown.map((d) => {
              const pct = d.total === 0 ? 0 : Math.round((d.solved / d.total) * 100);
              return (
                <div key={d.name}>
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="font-medium" style={{ color: d.fill }}>{d.name}</span>
                    <span className="font-mono text-slate-400">{d.solved}/{d.total}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-surface-700">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: d.fill }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 border-t border-line pt-5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-300">Overall completion</span>
              <span className="font-mono text-white">{stats.completion}%</span>
            </div>
            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-surface-700">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-700"
                style={{ width: `${stats.completion}%` }}
              />
            </div>
            <p className="mt-2 text-[11px] text-slate-600">{stats.solved} of {stats.total} problems solved.</p>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-line bg-surface-850 p-5">
        <h2 className="mb-4 text-sm font-semibold text-white">Recent activity</h2>
        {recent.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-500">No activity yet — add your first problem.</p>
        ) : (
          <ul className="divide-y divide-line">
            {recent.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${p.status === 'Solved' ? 'bg-emerald-400' : p.status === 'Attempted' ? 'bg-amber-400' : 'bg-slate-500'}`}
                  />
                  <span className="truncate font-mono text-sm text-slate-200">{p.name}</span>
                  <span className="hidden shrink-0 rounded-full border border-slate-500/20 bg-slate-500/10 px-2 py-0.5 text-[11px] text-slate-400 sm:inline">
                    {p.status}
                  </span>
                </div>
                <span className="shrink-0 text-xs text-slate-600">{timeAgo(p.updatedAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
