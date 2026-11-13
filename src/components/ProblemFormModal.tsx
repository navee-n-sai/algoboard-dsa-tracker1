import { useEffect, useState } from 'react';
import { DIFFICULTIES, DIFFICULTY_STYLES, STATUSES, TOPICS } from '@/lib/types';
import { Problem } from '@/lib/types';
import Modal from './Modal';

export interface ProblemFormValues {
  name: string;
  link: string;
  difficulty: (typeof DIFFICULTIES)[number];
  topic: string;
  status: (typeof STATUSES)[number];
  notes: string;
}

const EMPTY: ProblemFormValues = {
  name: '',
  link: '',
  difficulty: 'Easy',
  topic: 'Arrays',
  status: 'To Do',
  notes: '',
};

interface ProblemFormModalProps {
  open: boolean;
  editing: Problem | null;
  onClose: () => void;
  onSubmit: (values: ProblemFormValues) => void;
}

const inputClass =
  'w-full rounded-lg border border-line-bright bg-surface-800 px-3.5 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 outline-none transition-colors focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20';

const labelClass = 'mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400';

export default function ProblemFormModal({ open, editing, onClose, onSubmit }: ProblemFormModalProps) {
  const [values, setValues] = useState<ProblemFormValues>(EMPTY);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setError('');
    setValues(
      editing
        ? {
            name: editing.name,
            link: editing.link,
            difficulty: editing.difficulty,
            topic: editing.topic,
            status: editing.status,
            notes: editing.notes,
          }
        : EMPTY,
    );
  }, [open, editing]);

  const set = <K extends keyof ProblemFormValues>(key: K, value: ProblemFormValues[K]) =>
    setValues((v) => ({ ...v, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!values.name.trim()) {
      setError('Give the problem a name.');
      return;
    }
    onSubmit({
      name: values.name.trim(),
      link: values.link.trim(),
      difficulty: values.difficulty,
      topic: values.topic,
      status: values.status,
      notes: values.notes.trim(),
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? 'Edit problem' : 'Add problem'}
      subtitle={editing ? 'Update the details of this problem.' : 'Log a new problem to your tracker.'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="pf-name" className={labelClass}>Problem name</label>
          <input
            id="pf-name"
            value={values.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="e.g. Two Sum"
            className={inputClass}
            autoFocus
          />
        </div>

        <div>
          <label htmlFor="pf-link" className={labelClass}>Link <span className="normal-case text-slate-500">(optional)</span></label>
          <input
            id="pf-link"
            value={values.link}
            onChange={(e) => set('link', e.target.value)}
            placeholder="https://leetcode.com/problems/..."
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="pf-difficulty" className={labelClass}>Difficulty</label>
            <select id="pf-difficulty" value={values.difficulty} onChange={(e) => set('difficulty', e.target.value as ProblemFormValues['difficulty'])} className={inputClass}>
              {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="pf-topic" className={labelClass}>Topic</label>
            <select id="pf-topic" value={values.topic} onChange={(e) => set('topic', e.target.value)} className={inputClass}>
              {TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="pf-status" className={labelClass}>Status</label>
            <select id="pf-status" value={values.status} onChange={(e) => set('status', e.target.value as ProblemFormValues['status'])} className={inputClass}>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="pf-notes" className={labelClass}>Notes <span className="normal-case text-slate-500">(optional)</span></label>
          <textarea
            id="pf-notes"
            value={values.notes}
            onChange={(e) => set('notes', e.target.value)}
            placeholder="Approach, gotchas, review reminders..."
            rows={3}
            className={`${inputClass} resize-none`}
          />
        </div>

        {error && <p className="text-sm text-rose-400">{error}</p>}

        <div className="flex justify-end gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-line-bright bg-surface-700 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-surface-600 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
          >
            {editing ? 'Save changes' : 'Add problem'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
