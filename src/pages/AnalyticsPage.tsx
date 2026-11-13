import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Problem, DIFFICULTY_STYLES, STATUS_STYLES, topicColor } from '@/lib/types';
import { computeStats } from '@/lib/storage';
import PageHeader from '@/components/PageHeader';

const tooltipStyle = {
  backgroundColor: '#14141a',
  border: '1px solid #2e2e3d',
  borderRadius: 10,
  fontSize: 12,
  color: '#e2e8f0',
};

export default function AnalyticsPage({ problems }: { problems: Problem[] }) {
  const stats = computeStats(problems);

  const topicData = Object.entries(
    problems.reduce<Record<string, { solved: number; total: number }>>((acc, p) => {
      acc[p.topic] = acc[p.topic] || { solved: 0, total: 0 };
      acc[p.topic].total += 1;
      if (p.status === 'Solved') acc[p.topic].solved += 1;
      return acc;
    }, {}),
  )
    .map(([topic, d]) => ({ topic, short: topic.length > 12 ? topic.slice(0, 11) + '…' : topic, solved: d.solved, total: d.total }))
    .sort((a, b) => b.solved - a.solved)
    .slice(0, 8);

  const difficultyData = [
    { name: 'Easy', ...stats.easy, fill: DIFFICULTY_STYLES.Easy.hex },
    { name: 'Medium', ...stats.medium, fill: DIFFICULTY_STYLES.Medium.hex },
    { name: 'Hard', ...stats.hard, fill: DIFFICULTY_STYLES.Hard.hex },
  ];

  const statusData = [
    { name: 'Solved', value: stats.solved, fill: STATUS_STYLES.Solved.hex },
    { name: 'Attempted', value: stats.attempted, fill: STATUS_STYLES.Attempted.hex },
    { name: 'To Do', value: stats.todo, fill: STATUS_STYLES['To Do'].hex },
  ].filter((s) => s.value > 0);

  const totalSolved = topicData.reduce((s, t) => s + t.solved, 0);
  const strongest = topicData[0];
  const weakest = [...topicData].reverse().find((t) => t.solved < t.total) ?? topicData[topicData.length - 1];

  if (problems.length === 0) {
    return (
      <div className="animate-fade-up">
        <PageHeader title="Analytics" subtitle="Deep-dive into your preparation patterns." />
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-line-bright bg-surface-850/50 py-24">
          <p className="text-sm font-medium text-slate-300">Nothing to analyze yet</p>
          <p className="mt-1 text-xs text-slate-500">Add problems to unlock charts and insights.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      <PageHeader title="Analytics" subtitle="Deep-dive into your preparation patterns." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-line bg-surface-850 p-5">
          <h2 className="text-sm font-semibold text-white">Solved vs. tracked by topic</h2>
          <p className="mb-4 text-xs text-slate-500">Top {topicData.length} topics by volume</p>
          {topicData.length === 0 ? (
            <p className="py-16 text-center text-sm text-slate-500">No topics to display.</p>
          ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topicData} layout="vertical" margin={{ top: 0, right: 12, bottom: 0, left: 8 }}>
                  <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
                  <YAxis
                    type="category"
                    dataKey="short"
                    tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                    tickLine={false}
                    axisLine={{ stroke: '#232330' }}
                    width={110}
                  />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(59,130,246,0.06)' }} />
                  <Bar dataKey="total" name="Tracked" fill="#232330" radius={[0, 4, 4, 0]} maxBarSize={16} />
                  <Bar dataKey="solved" name="Solved" radius={[0, 4, 4, 0]} maxBarSize={16}>
                    {topicData.map((entry) => (
                      <Cell key={entry.topic} fill={topicColor(entry.topic)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-line bg-surface-850 p-5">
          <h2 className="text-sm font-semibold text-white">Difficulty distribution</h2>
          <p className="mb-4 text-xs text-slate-500">Solved counts by difficulty</p>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={difficultyData} outerRadius="72%">
                <PolarGrid stroke="#232330" />
                <PolarAngleAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Radar dataKey="solved" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.25} />
                <Radar dataKey="total" stroke="#a78bfa" fill="#a78bfa" fillOpacity={0.1} />
                <Tooltip contentStyle={tooltipStyle} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-line bg-surface-850 p-5">
          <h2 className="text-sm font-semibold text-white">Status mix</h2>
          <p className="mb-4 text-xs text-slate-500">Where your problems stand right now</p>
          {statusData.length === 0 ? (
            <p className="py-16 text-center text-sm text-slate-500">No data.</p>
          ) : (
            <div className="flex h-64 items-center">
              <div className="h-full w-1/2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusData} dataKey="value" innerRadius="58%" outerRadius="90%" paddingAngle={3} stroke="none">
                      {statusData.map((s) => (
                        <Cell key={s.name} fill={s.fill} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="w-1/2 space-y-3 pl-2">
                {statusData.map((s) => (
                  <li key={s.name} className="flex items-center justify-between gap-3 text-sm">
                    <span className="flex items-center gap-2 text-slate-300">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.fill }} />
                      {s.name}
                    </span>
                    <span className="font-mono text-slate-400">{s.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-line bg-surface-850 p-5">
          <h2 className="text-sm font-semibold text-white">Insights</h2>
          <p className="mb-4 text-xs text-slate-500">Automatic takeaways from your data</p>
          <div className="space-y-3">
            <div className="rounded-lg border border-line bg-surface-800 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Overall completion</p>
              <p className="mt-1 text-sm text-slate-300">
                You have solved <span className="font-mono font-semibold text-emerald-400">{stats.solved}</span> of{' '}
                <span className="font-mono text-white">{stats.total}</span> problems ({totalSolved} solved across top topics) —{' '}
                <span className="font-semibold text-white">{stats.completion}%</span> complete.
              </p>
            </div>
            {strongest && (
              <div className="rounded-lg border border-line bg-surface-800 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Strongest topic</p>
                <p className="mt-1 text-sm text-slate-300">
                  <span className="font-semibold" style={{ color: topicColor(strongest.topic) }}>{strongest.topic}</span> —{' '}
                  {strongest.solved} of {strongest.total} solved.
                </p>
              </div>
            )}
            {weakest && weakest !== strongest && (
              <div className="rounded-lg border border-line bg-surface-800 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Focus next</p>
                <p className="mt-1 text-sm text-slate-300">
                  <span className="font-semibold text-amber-400">{weakest.topic}</span> — only {weakest.solved} of {weakest.total} solved.
                  Worth drilling before interviews.
                </p>
              </div>
            )}
            {stats.hard.solved > 0 && (
              <div className="rounded-lg border border-line bg-surface-800 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Milestone</p>
                <p className="mt-1 text-sm text-slate-300">
                  <span className="font-mono font-semibold text-rose-400">{stats.hard.solved}</span> hard problem
                  {stats.hard.solved === 1 ? '' : 's'} conquered. Keep pushing.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
