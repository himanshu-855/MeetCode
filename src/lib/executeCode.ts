import { submitCodeToJudge0, getJudge0Submission } from './judge0';
import { parseJudge0Response } from './parseResponse';
import { getLanguageConfig } from './languageMap';
import { StandardizedResult } from './types/execution';

const MAX_POLLING_ATTEMPTS = 10;
const POLLING_INTERVAL_MS = 1500;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const executeCode = async (
  language: string,
  code: string,
  input: string
): Promise<StandardizedResult> => {
  const langConfig = getLanguageConfig(language);
  if (!langConfig) {
    throw new Error('Unsupported language');
  }

  // 1. Submit Code
  const submission = await submitCodeToJudge0(langConfig.id, code, input);
  const token = submission.token;

  if (!token) {
    throw new Error('Failed to get submission token from Judge0');
  }

  // 2. Poll for Result
  for (let attempt = 0; attempt < MAX_POLLING_ATTEMPTS; attempt++) {
    await sleep(POLLING_INTERVAL_MS);

    const result = await getJudge0Submission(token);

    // Status 1: In Queue, Status 2: Processing
    if (result.status?.id !== 1 && result.status?.id !== 2) {
      // Completed or errored
      return parseJudge0Response(result);
    }
  }

  // If we reach here, it timed out waiting for the result
  return {
    output: 'Execution timed out waiting for Judge0',
    status: 'Timeout',
    executionTime: '0.0',
    memory: '0.0',
    isError: true
  };
};

export const executeMock = async (
  language: string,
  code: string,
  input: string
): Promise<StandardizedResult> => {
  console.warn('No RAPIDAPI_KEY found. Mocking code execution using new architecture.');
  await sleep(1500);

  let mockOutput = '';
  let mockStatus = 'Accepted';
  
  if (code.includes('error')) {
    mockStatus = 'Compilation Error';
    mockOutput = 'SyntaxError: unexpected token';
  } else {
    // Simple mock logic for the specific problem
    if (input.trim().startsWith('5')) {
       mockOutput = '9\\n';
    } else {
       mockOutput = 'Mock output generated.\\nInput received:\\n' + input;
    }
  }

  return {
    output: mockOutput,
    status: mockStatus,
    executionTime: '0.04',
    memory: '3124.0',
    isError: mockStatus !== 'Accepted'
  };
};
