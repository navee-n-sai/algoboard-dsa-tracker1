import { ExternalLink, MoreHorizontal, Pencil, Trash2, StickyNote } from 'lucide-react';
import { DIFFICULTY_STYLES, STATUS_STYLES, Problem } from '@/lib/types';
import { timeAgo } from '@/lib/storage';

interface ProblemCardProps {
  problem: Problem;
  onEdit: (problem: Problem) => void;
  onDelete: (problem: Problem) => void;
}

const STATUS_DOT: Record<string, string> = {
  Solved: 'bg-emerald-400',
  Attempted: 'bg-amber-400',
  'To Do': 'bg-slate-500',
};

export default function ProblemCard({ problem, onEdit, onDelete }: ProblemCardProps) {
  const diff = DIFFICULTY_STYLES[problem.difficulty];
  const status = STATUS_STYLES[problem.status];

  return (
    <div className="group relative rounded-xl border border-line bg-surface-850 p-4 transition-all duration-200 hover:border-line-bright hover:bg-surface-800 hover:shadow-card sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium ${diff.badge}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[problem.status]}`} />
              {problem.difficulty}
            </span>
            <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${status.badge}`}>
              {problem.status}
            </span>
            <span className="rounded-full border border-slate-500/20 bg-slate-500/10 px-2 py-0.5 text-[11px] font-medium text-slate-400">
              {problem.topic}
            </span>
          </div>

          <h3 className="mt-2.5 truncate font-mono text-sm font-semibold text-slate-100 transition-colors group-hover:text-white">
            {problem.name}
          </h3>

          {problem.notes && (
            <p className="mt-1.5 flex items-start gap-1.5 text-xs leading-relaxed text-slate-500 line-clamp-2">
              <StickyNote size={12} className="mt-0.5 shrink-0" />
              {problem.notes}
            </p>
          )}

          <div className="mt-3 flex items-center gap-3">
            {problem.link && (
              <a
                href={problem.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-blue-400 transition-colors hover:text-blue-300"
              >
                <ExternalLink size={12} />
                Open problem
              </a>
            )}
            <span className="text-[11px] text-slate-600">{timeAgo(problem.updatedAt)}</span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100 focus-within:opacity-100 max-lg:opacity-100">
          <button
            onClick={() => onEdit(problem)}
            className="rounded-lg border border-line-bright bg-surface-700 p-2 text-slate-400 transition-colors hover:text-blue-400"
            aria-label={`Edit ${problem.name}`}
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => onDelete(problem)}
            className="rounded-lg border border-line-bright bg-surface-700 p-2 text-slate-400 transition-colors hover:text-rose-400"
            aria-label={`Delete ${problem.name}`}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
