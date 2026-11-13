import { useState } from 'react';
import { Database, RotateCcw, Trash2, Download, ShieldCheck } from 'lucide-react';
import { Problem } from '@/lib/types';
import { computeStats } from '@/lib/storage';
import PageHeader from '@/components/PageHeader';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useToast } from '@/components/Toast';

interface SettingsPageProps {
  problems: Problem[];
  onResetSamples: () => void;
  onClearAll: () => void;
}

function Section({ icon, title, description, children }: { icon: React.ReactNode; title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-line bg-surface-850 p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-700 text-slate-300">{icon}</div>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold text-white">{title}</h2>
          <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{description}</p>
          <div className="mt-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage({ problems, onResetSamples, onClearAll }: SettingsPageProps) {
  const { toast } = useToast();
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const stats = computeStats(problems);

  const exportJson = () => {
    try {
      const blob = new Blob([JSON.stringify(problems, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `algoboard-export-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast('Backup downloaded.', 'success');
    } catch {
      toast('Could not create the backup file.', 'error');
    }
  };

  return (
    <div className="animate-fade-up max-w-3xl">
      <PageHeader title="Settings" subtitle="Manage your data and preferences." />

      <div className="space-y-4">
        <Section
          icon={<Database size={17} />}
          title="Data overview"
          description="All data lives in this browser's local storage — nothing is sent to a server."
        >
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Total', value: stats.total },
              { label: 'Solved', value: stats.solved },
              { label: 'Completion', value: `${stats.completion}%` },
            ].map((s) => (
              <div key={s.label} className="rounded-lg border border-line bg-surface-800 p-3 text-center">
                <p className="font-mono text-lg font-bold text-white">{s.value}</p>
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section
          icon={<Download size={17} />}
          title="Export backup"
          description="Download all problems as a JSON file so you can keep a copy or move to another browser."
        >
          <button
            onClick={exportJson}
            className="inline-flex items-center gap-2 rounded-lg border border-line-bright bg-surface-700 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-surface-600 hover:text-white"
          >
            <Download size={15} />
            Export JSON
          </button>
        </Section>

        <Section
          icon={<RotateCcw size={17} />}
          title="Restore sample problems"
          description="Adds the built-in sample set back on top of your current problems. Your existing entries are kept."
        >
          <button
            onClick={() => setConfirmReset(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-line-bright bg-surface-700 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-surface-600 hover:text-white"
          >
            <RotateCcw size={15} />
            Restore samples
          </button>
        </Section>

        <Section
          icon={<Trash2 size={17} />}
          title="Clear all data"
          description="Permanently removes every problem from this browser. Export a backup first if you might want it back."
        >
          <button
            onClick={() => setConfirmClear(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-sm font-medium text-rose-400 transition-colors hover:bg-rose-500/20"
          >
            <Trash2 size={15} />
            Clear all problems
          </button>
        </Section>

        <div className="flex items-start gap-3 rounded-xl border border-line bg-surface-850/60 p-5">
          <ShieldCheck size={17} className="mt-0.5 shrink-0 text-emerald-400" />
          <p className="text-xs leading-relaxed text-slate-500">
            <span className="font-medium text-slate-300">Privacy-first:</span> AlgoBoard has no accounts and no tracking. Your progress
            never leaves this device.
          </p>
        </div>
      </div>

      <ConfirmDialog
        open={confirmReset}
        title="Restore samples"
        message="The built-in sample problems will be added to your tracker. Your current problems will not be removed."
        confirmLabel="Restore"
        onConfirm={() => {
          onResetSamples();
          toast('Sample problems restored.', 'success');
        }}
        onClose={() => setConfirmReset(false)}
      />

      <ConfirmDialog
        open={confirmClear}
        title="Clear all data"
        message={`This will permanently delete all ${problems.length} problems from this browser. This action cannot be undone.`}
        confirmLabel="Delete everything"
        onConfirm={() => {
          onClearAll();
          toast('All problems cleared.', 'info');
        }}
        onClose={() => setConfirmClear(false)}
      />
    </div>
  );
}
