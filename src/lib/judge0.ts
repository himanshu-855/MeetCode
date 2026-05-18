import axios from 'axios';
import { Judge0SubmissionResponse, Judge0SubmissionResult } from './types/execution';

const JUDGE0_BASE_URL = 'https://judge0-ce.p.rapidapi.com';

export const getJudge0Headers = () => {
  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) {
    throw new Error('RAPIDAPI_KEY environment variable is missing.');
  }

  return {
    'content-type': 'application/json',
    'X-RapidAPI-Key': apiKey,
    'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
  };
};

export const submitCodeToJudge0 = async (
  languageId: number,
  sourceCode: string,
  stdin: string
): Promise<Judge0SubmissionResponse> => {
  const options = {
    method: 'POST',
    url: `${JUDGE0_BASE_URL}/submissions`,
    params: { base64_encoded: 'false', fields: '*' },
    headers: getJudge0Headers(),
    data: {
      language_id: languageId,
      source_code: sourceCode,
      stdin: stdin
    }
  };

  const response = await axios.request<Judge0SubmissionResponse>(options);
  return response.data;
};

export const getJudge0Submission = async (token: string): Promise<Judge0SubmissionResult> => {
  const options = {
    method: 'GET',
    url: `${JUDGE0_BASE_URL}/submissions/${token}`,
    params: { base64_encoded: 'false', fields: '*' },
    headers: getJudge0Headers(),
  };

  const response = await axios.request<Judge0SubmissionResult>(options);
  return response.data;
};
