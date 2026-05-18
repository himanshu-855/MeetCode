export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface Problem {
  id: string;
  slug: string;
  title: string;
  difficulty: Difficulty;
  createdAt: string;
  userStatus?: 'SOLVED' | 'ATTEMPTED' | null;
  _count?: { submissions: number };
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
