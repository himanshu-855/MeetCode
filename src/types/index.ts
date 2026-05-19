export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface Problem {
  id: string;
  slug: string;
  title: string;
  difficulty: Difficulty;
  createdAt: string;
  userStatus?: 'SOLVED' | 'ATTEMPTED' | null;
  _count?: { submissions: number };
  topics?: { topic: { name: string, slug: string } }[];
  estimatedTime?: number | null;
  frequencyScore?: number | null;
  companyRelevance?: string[];
}

export interface Testcase {
  id: string;
  input: string;
  output: string;
}

export interface ProblemDetail extends Problem {
  description: string;
  constraints: string[];
  testcases: Testcase[];
  starterCode?: Record<string, string> | null;
}

export type Verdict =
  | 'Accepted'
  | 'Wrong Answer'
  | 'Runtime Error'
  | 'Compilation Error'
  | 'Time Limit Exceeded'
  | 'Memory Limit Exceeded'
  | 'Error';

export interface RunResult {
  output: string;
  status: string;
  executionTime: string;
  memory: string;
  isError: boolean;
}

export interface SubmitResult {
  verdict: Verdict;
  passedCount: number;
  totalCount: number;
  executionTime: string;
  memory: string;
  submissionId?: string;
  failedTestcase?: {
    input: string;
    expectedOutput: string;
    actualOutput: string;
    verdict: Verdict;
  };
}

export interface LearningTrack {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  sections: TrackSection[];
}

export interface TrackSection {
  id: string;
  title: string;
  order: number;
  problems: (Problem & { isSolved: boolean })[];
}
