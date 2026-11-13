import { useMemo, useState } from 'react';
import { Plus, Search, FilterX } from 'lucide-react';
import { DIFFICULTIES, STATUSES, TOPICS, Problem } from '@/lib/types';
import PageHeader from '@/components/PageHeader';
import ProblemCard from '@/components/ProblemCard';
import ProblemFormModal, { ProblemFormValues } from '@/components/ProblemFormModal';
import ConfirmDialog from '@/components/ConfirmDialog';

interface ProblemsPageProps {
  problems: Problem[];
  onAdd: (values: ProblemFormValues) => void;
  onEdit: (id: string, values: ProblemFormValues) => void;
  onDelete: (id: string) => void;
}

const selectClass =
  'w-full appearance-none rounded-lg border border-line-bright bg-surface-800 px-3 py-2 text-sm text-slate-300 outline-none transition-colors focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20';

export default function ProblemsPage({ problems, onAdd, onEdit, onDelete }: ProblemsPageProps) {
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('All');
  const [topic, setTopic] = useState('All');
  const [status, setStatus] = useState('All');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Problem | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Problem | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return problems
      .filter((p) => (q ? p.name.toLowerCase().includes(q) : true))
      .filter((p) => (difficulty === 'All' ? true : p.difficulty === difficulty))
      .filter((p) => (topic === 'All' ? true : p.topic === topic))
      .filter((p) => (status === 'All' ? true : p.status === status))
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [problems, search, difficulty, topic, status]);

  const hasFilters = search !== '' || difficulty !== 'All' || topic !== 'All' || status !== 'All';

  const clearFilters = () => {
    setSearch('');
    setDifficulty('All');
    setTopic('All');
    setStatus('All');
  };

  const handleSubmit = (values: ProblemFormValues) => {
    if (editing) onEdit(editing.id, values);
    else onAdd(values);
    setFormOpen(false);
    setEditing(null);
  };

  return (
    <div className="animate-fade-up">
      <PageHeader
        title="Problems"
        subtitle={`${problems.length} problem${problems.length === 1 ? '' : 's'} tracked · ${filtered.length} shown`}
        action={
          <button
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
          >
            <Plus size={16} />
            Add Problem
          </button>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div className="relative sm:col-span-2">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search problems..."
            className={`${selectClass} pl-9`}
            aria-label="Search by problem name"
          />
        </div>
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className={selectClass} aria-label="Filter by difficulty">
          <option value="All">All difficulties</option>
          {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={topic} onChange={(e) => setTopic(e.target.value)} className={selectClass} aria-label="Filter by topic">
          <option value="All">All topics</option>
          {TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <div className="flex gap-2">
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectClass} aria-label="Filter by status">
            <option value="All">All statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="shrink-0 rounded-lg border border-line-bright bg-surface-800 px-2.5 text-slate-400 transition-colors hover:text-white"
              aria-label="Clear filters"
              title="Clear filters"
            >
              <FilterX size={16} />
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-line-bright bg-surface-850/50 py-20">
          <div className="rounded-xl bg-surface-800 p-4">
            <Search size={24} className="text-slate-500" />
          </div>
          <p className="mt-4 text-sm font-medium text-slate-300">
            {problems.length === 0 ? 'No problems yet' : 'No problems match your filters'}
          </p>
          <p className="mt-1 max-w-xs text-center text-xs text-slate-500">
            {problems.length === 0
              ? 'Start building your tracker by adding your first problem.'
              : 'Try a different search term or clear the filters.'}
          </p>
          {problems.length === 0 ? (
            <button
              onClick={() => {
                setEditing(null);
                setFormOpen(true);
              }}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
            >
              <Plus size={15} />
              Add your first problem
            </button>
          ) : (
            <button
              onClick={clearFilters}
              className="mt-5 rounded-lg border border-line-bright bg-surface-800 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-surface-700"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {filtered.map((p) => (
            <ProblemCard
              key={p.id}
              problem={p}
              onEdit={(problem) => {
                setEditing(problem);
                setFormOpen(true);
              }}
              onDelete={setPendingDelete}
            />
          ))}
        </div>
      )}

      <ProblemFormModal
        open={formOpen}
        editing={editing}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete problem"
        message={`Are you sure you want to delete "${pendingDelete?.name ?? ''}"? This cannot be undone.`}
        onConfirm={() => {
          if (pendingDelete) onDelete(pendingDelete.id);
        }}
        onClose={() => setPendingDelete(null)}
      />
    </div>
  );
}
