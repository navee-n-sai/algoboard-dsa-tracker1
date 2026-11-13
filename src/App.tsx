import { useCallback, useEffect, useState } from 'react';
import Layout, { PageId } from '@/components/Layout';
import { ToastProvider, useToast } from '@/components/Toast';
import DashboardPage from '@/pages/DashboardPage';
import ProblemsPage from '@/pages/ProblemsPage';
import AnalyticsPage from '@/pages/AnalyticsPage';
import SettingsPage from '@/pages/SettingsPage';
import { Problem } from '@/lib/types';
import { loadProblems, saveProblems, makeId, sampleProblems } from '@/lib/storage';
import { ProblemFormValues } from '@/components/ProblemFormModal';

function AlgoBoard() {
  const { toast } = useToast();
  const [page, setPage] = useState<PageId>('dashboard');
  const [problems, setProblems] = useState<Problem[]>(() => loadProblems());

  useEffect(() => {
    saveProblems(problems);
  }, [problems]);

  const addProblem = useCallback(
    (values: ProblemFormValues) => {
      const now = new Date().toISOString();
      const problem: Problem = { id: makeId(), ...values, createdAt: now, updatedAt: now };
      setProblems((prev) => [problem, ...prev]);
      toast(`"${values.name}" added to your tracker.`, 'success');
    },
    [toast],
  );

  const editProblem = useCallback(
    (id: string, values: ProblemFormValues) => {
      setProblems((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...values, updatedAt: new Date().toISOString() } : p)),
      );
      toast(`"${values.name}" updated.`, 'success');
    },
    [toast],
  );

  const deleteProblem = useCallback(
    (id: string) => {
      setProblems((prev) => prev.filter((p) => p.id !== id));
      toast('Problem deleted.', 'info');
    },
    [toast],
  );

  const resetSamples = useCallback(() => {
    setProblems((prev) => {
      const existing = new Set(prev.map((p) => p.id));
      const samples = sampleProblems().filter((s) => !existing.has(s.id));
      return [...samples, ...prev];
    });
  }, []);

  const clearAll = useCallback(() => {
    setProblems([]);
  }, []);

  const solvedCount = problems.filter((p) => p.status === 'Solved').length;

  return (
    <Layout page={page} onNavigate={setPage} solvedCount={solvedCount}>
      {page === 'dashboard' && <DashboardPage problems={problems} onNavigate={setPage} />}
      {page === 'problems' && (
        <ProblemsPage problems={problems} onAdd={addProblem} onEdit={editProblem} onDelete={deleteProblem} />
      )}
      {page === 'analytics' && <AnalyticsPage problems={problems} />}
      {page === 'settings' && (
        <SettingsPage problems={problems} onResetSamples={resetSamples} onClearAll={clearAll} />
      )}
    </Layout>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AlgoBoard />
    </ToastProvider>
  );
}
