export interface ExecutionRequest {
  language: string;
  code: string;
  input: string;
}

export interface StandardizedResult {
  output: string;
  status: string;
  executionTime: string;
  memory: string;
  isError: boolean;
}

export interface Judge0SubmissionResponse {
  token: string;
}

export interface Judge0Status {
  id: number;
  description: string;
}

export interface Judge0SubmissionResult {
  stdout: string | null;
  time: string | null;
  memory: number | null;
  stderr: string | null;
  token: string;
  compile_output: string | null;
  message: string | null;
  status: Judge0Status;
}
