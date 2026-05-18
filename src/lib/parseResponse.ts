import { Judge0SubmissionResult, StandardizedResult } from './types/execution';

export const parseJudge0Response = (result: Judge0SubmissionResult): StandardizedResult => {
  // Judge0 status IDs:
  // 3: Accepted
  // 4: Wrong Answer (we handle it same as accepted output format)
  // 5: Time Limit Exceeded
  // 6: Compilation Error
  // 7-12: Runtime Errors / Memory limits
  // 13: Internal Error
  // 14: Exec Format Error

  const statusId = result.status?.id;
  const isError = statusId !== 3;

  let output = result.stdout || result.compile_output || result.stderr || result.message || '';
  
  if (!output && statusId === 5) {
      output = 'Time Limit Exceeded';
  }

  return {
    output,
    status: result.status?.description || 'Unknown',
    executionTime: result.time || '0.0',
    memory: result.memory ? (result.memory).toString() : '0.0',
    isError,
  };
};
