import { Difficulty, Problem, Status } from './types';

const STORAGE_KEY = 'algoboard:problems';
const SEED_KEY = 'algoboard:seeded';

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

export function sampleProblems(): Problem[] {
  const seed = (name: string, link: string, difficulty: Difficulty, topic: string, status: Status, notes: string, age: number): Problem => ({
    id: `sample-${name.toLowerCase().replace(/[^a-z]+/g, '-')}`,
    name,
    link,
    difficulty,
    topic,
    status,
    notes,
    createdAt: daysAgo(age + 2),
    updatedAt: daysAgo(age),
  });

  return [
    seed('Two Sum', 'https://leetcode.com/problems/two-sum/', 'Easy', 'Arrays', 'Solved', 'Classic hash map one-pass solution.', 12),
    seed('Valid Anagram', 'https://leetcode.com/problems/valid-anagram/', 'Easy', 'Hash Table', 'Solved', 'Count character frequencies in one array.', 11),
    seed('Longest Substring Without Repeating Characters', 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', 'Medium', 'Sliding Window', 'Solved', 'Expand right, shrink left on duplicates.', 10),
    seed('Merge Two Sorted Lists', 'https://leetcode.com/problems/merge-two-sorted-lists/', 'Easy', 'Linked List', 'Solved', 'Dummy node makes it clean.', 9),
    seed('Binary Search', 'https://leetcode.com/problems/binary-search/', 'Easy', 'Binary Search', 'Solved', 'Watch the off-by-one on mid.', 8),
    seed('Course Schedule', 'https://leetcode.com/problems/course-schedule/', 'Medium', 'Graphs', 'Attempted', 'Topological sort via Kahn\'s — need to review cycle detection.', 7),
    seed('Coin Change', 'https://leetcode.com/problems/coin-change/', 'Medium', 'Dynamic Programming', 'Attempted', 'Bottom-up DP: dp[i] = min coins for amount i.', 5),
    seed('Validate Binary Search Tree', 'https://leetcode.com/problems/validate-binary-search-tree/', 'Medium', 'Trees', 'Attempted', 'Pass down min/max bounds in recursion.', 4),
    seed('Daily Temperatures', 'https://leetcode.com/problems/daily-temperatures/', 'Medium', 'Stack', 'To Do', 'Monotonic decreasing stack.', 3),
    seed('Word Search II', 'https://leetcode.com/problems/word-search-ii/', 'Hard', 'Trie', 'To Do', 'Trie + backtracking on the board.', 2),
    seed('Median of Two Sorted Arrays', 'https://leetcode.com/problems/median-of-two-sorted-arrays/', 'Hard', 'Binary Search', 'To Do', 'Partition-based binary search on the smaller array.', 1),
  ];
}

export function loadProblems(): Problem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as Problem[];
    }
    if (localStorage.getItem(SEED_KEY) === null) {
      const samples = sampleProblems();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(samples));
      localStorage.setItem(SEED_KEY, 'true');
      return samples;
    }
    return [];
  } catch {
    return [];
  }
}

export function saveProblems(problems: Problem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(problems));
  } catch {
    // storage full or unavailable; keep app functional in-memory
  }
}

export function makeId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `p-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function computeStats(problems: Problem[]) {
  const total = problems.length;
  const solved = problems.filter((p) => p.status === 'Solved').length;
  const attempted = problems.filter((p) => p.status === 'Attempted').length;
  const todo = problems.filter((p) => p.status === 'To Do').length;
  const byDiff = (d: Difficulty) => {
    const all = problems.filter((p) => p.difficulty === d);
    return { solved: all.filter((p) => p.status === 'Solved').length, total: all.length };
  };
  return {
    total,
    solved,
    attempted,
    todo,
    completion: total === 0 ? 0 : Math.round((solved / total) * 100),
    easy: byDiff('Easy'),
    medium: byDiff('Medium'),
    hard: byDiff('Hard'),
  };
}

export function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const secs = Math.max(0, Math.floor((Date.now() - then) / 1000));
  if (secs < 60) return 'just now';
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}
