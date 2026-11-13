export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type Status = 'Solved' | 'Attempted' | 'To Do';

export interface Problem {
  id: string;
  name: string;
  link: string;
  difficulty: Difficulty;
  topic: string;
  status: Status;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Stats {
  total: number;
  solved: number;
  attempted: number;
  todo: number;
  completion: number;
  easy: { solved: number; total: number };
  medium: { solved: number; total: number };
  hard: { solved: number; total: number };
}

export const DIFFICULTIES: Difficulty[] = ['Easy', 'Medium', 'Hard'];
export const STATUSES: Status[] = ['Solved', 'Attempted', 'To Do'];

export const TOPICS = [
  'Arrays',
  'Strings',
  'Hash Table',
  'Two Pointers',
  'Sliding Window',
  'Stack',
  'Queue',
  'Linked List',
  'Binary Search',
  'Recursion',
  'Trees',
  'Graphs',
  'Dynamic Programming',
  'Greedy',
  'Backtracking',
  'Heap / Priority Queue',
  'Trie',
  'Bit Manipulation',
  'Math',
  'Other',
] as const;

export const DIFFICULTY_STYLES: Record<Difficulty, { badge: string; dot: string; hex: string }> = {
  Easy: { badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', dot: '#34d399', hex: '#34d399' },
  Medium: { badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20', dot: '#fbbf24', hex: '#fbbf24' },
  Hard: { badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20', dot: '#fb7185', hex: '#fb7185' },
};

export const STATUS_STYLES: Record<Status, { badge: string; hex: string }> = {
  Solved: { badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', hex: '#34d399' },
  Attempted: { badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20', hex: '#fbbf24' },
  'To Do': { badge: 'bg-slate-500/10 text-slate-400 border-slate-500/20', hex: '#94a3b8' },
};

export const TOPIC_COLORS = [
  '#3b82f6', '#a78bfa', '#22d3ee', '#34d399', '#fbbf24',
  '#fb7185', '#f472b6', '#60a5fa', '#818cf8', '#2dd4bf',
];

export function topicColor(topic: string): string {
  const idx = TOPICS.indexOf(topic as (typeof TOPICS)[number]);
  return TOPIC_COLORS[(idx >= 0 ? idx : topic.length) % TOPIC_COLORS.length];
}
