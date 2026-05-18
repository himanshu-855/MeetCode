"use client";

import { useState } from "react";
import axios from "axios";
import { RunResult, SubmitResult } from "@/types";

export function useSubmit() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);

  const submit = async (problemId: string, language: string, code: string) => {
    setIsSubmitting(true);
    setSubmitResult(null);
    try {
      const res = await axios.post<SubmitResult>("/api/submit", {
        problemId,
        language,
        code,
      });
      setSubmitResult(res.data);
    } catch {
      setSubmitResult({
        verdict: "Error",
        passedCount: 0,
        totalCount: 0,
        executionTime: "0",
        memory: "0",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearSubmit = () => setSubmitResult(null);

  return { submit, isSubmitting, submitResult, clearSubmit };
}

export function useRunCode() {
  const [isRunning, setIsRunning] = useState(false);
  const [runResult, setRunResult] = useState<RunResult | null>(null);

  const run = async (language: string, code: string, input: string) => {
    setIsRunning(true);
    setRunResult(null);
    try {
      const res = await axios.post<RunResult>("/api/run", {
        language,
        code,
        input,
      });
      setRunResult(res.data);
    } catch {
      setRunResult({
        output: "Execution failed.",
        status: "Error",
        executionTime: "0",
        memory: "0",
        isError: true,
      });
    } finally {
      setIsRunning(false);
    }
  };

  const clearRun = () => setRunResult(null);

  return { run, isRunning, runResult, clearRun };
}
