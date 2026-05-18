import { useState } from 'react';
import axios from 'axios';
import { StandardizedResult } from '@/lib/types/execution';

export function useCodeExecution() {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<StandardizedResult | null>(null);

  const runCode = async (language: string, code: string, input: string) => {
    setIsRunning(true);
    setResult(null);

    try {
      const response = await axios.post('/api/run', {
        language,
        code,
        input,
      });
      
      setResult(response.data);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { output?: string } }, message?: string };
      setResult({
        output: err.response?.data?.output || err.message || 'An unknown error occurred.',
        status: 'Error',
        executionTime: '0.0',
        memory: '0.0',
        isError: true,
      });
    } finally {
      setIsRunning(false);
    }
  };

  const clearConsole = () => {
    setResult(null);
  };

  return {
    runCode,
    isRunning,
    result,
    clearConsole,
  };
}
