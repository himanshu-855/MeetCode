import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { executeCode, executeMock } from '@/lib/executeCode';
import { normalizeOutput } from '@/lib/normalizeOutput';
import { prisma } from '@/lib/prisma';
import { Verdict } from '@/types';
import { StandardizedResult } from '@/lib/types/execution';

const toVerdict = (status: string, outputMatches: boolean): Verdict => {
  if (status === 'Accepted') {
    return outputMatches ? 'Accepted' : 'Wrong Answer';
  }

  if (status === 'Time Limit Exceeded') return 'Time Limit Exceeded';
  if (status === 'Compilation Error') return 'Compilation Error';
  if (status === 'Memory Limit Exceeded') return 'Memory Limit Exceeded';
  if (status.toLowerCase().includes('runtime')) return 'Runtime Error';

  return 'Error';
};

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { problemId, language, code } = await req.json();

    if (
      typeof problemId !== 'string' ||
      typeof language !== 'string' ||
      typeof code !== 'string' ||
      !problemId ||
      !language ||
      !code
    ) {
      return NextResponse.json(
        { error: 'Invalid request payload' },
        { status: 400 }
      );
    }

    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
      include: {
        testcases: {
          select: {
            isHidden: true,
            input: true,
            output: true,
          },
          orderBy: [{ isHidden: 'asc' }, { id: 'asc' }],
        },
      },
    });

    if (!problem) {
      return NextResponse.json(
        { error: 'Problem not found' },
        { status: 404 }
      );
    }

    if (problem.testcases.length === 0) {
      return NextResponse.json(
        { error: 'Problem has no testcases' },
        { status: 422 }
      );
    }

    const rapidApiKey = process.env.RAPIDAPI_KEY?.trim();
    const hasJudge0Key = Boolean(rapidApiKey && rapidApiKey !== 'your-rapidapi-key');
    const execute = hasJudge0Key ? executeCode : executeMock;
    const runTestcase = async (input: string, expectedOutput: string): Promise<StandardizedResult> => {
      if (!hasJudge0Key) {
        if (code.includes('error')) {
          return {
            output: 'Mock compilation error.',
            status: 'Compilation Error',
            executionTime: '0.01',
            memory: '0',
            isError: true,
          };
        }

        return {
          output: expectedOutput,
          status: 'Accepted',
          executionTime: '0.01',
          memory: '128',
          isError: false,
        };
      }

      try {
        return await execute(language, code, input);
      } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } }; message?: string };
        return {
          output: err.response?.data?.message || err.message || 'Execution provider failed.',
          status: 'Error',
          executionTime: '0',
          memory: '0',
          isError: true,
        };
      }
    };
    let verdict: Verdict = 'Accepted';
    let passedCount = 0;
    let executionTime = 0;
    let memory = 0;
    let failedTestcase:
      | {
          input: string;
          expectedOutput: string;
          actualOutput: string;
          verdict: Verdict;
        }
      | undefined;

    for (const testcase of problem.testcases) {
      const result = await runTestcase(testcase.input, testcase.output);
      const expected = normalizeOutput(testcase.output);
      const actual = normalizeOutput(result.output);
      const outputMatches = !result.isError && actual === expected;
      const testcaseVerdict = toVerdict(result.status, outputMatches);

      executionTime += Number(result.executionTime) || 0;
      memory = Math.max(memory, Number(result.memory) || 0);

      if (testcaseVerdict === 'Accepted') {
        passedCount += 1;
        continue;
      }

      verdict = testcaseVerdict;
      failedTestcase = {
        input: testcase.isHidden ? 'Hidden testcase' : testcase.input,
        expectedOutput: testcase.isHidden ? 'Hidden testcase' : testcase.output,
        actualOutput: result.output,
        verdict: testcaseVerdict,
      };
      break;
    }

    const existingUser = userId
      ? await prisma.user.findUnique({ where: { id: userId }, select: { id: true } })
      : null;

    const submission = await prisma.submission.create({
      data: {
        problemId,
        userId: existingUser?.id,
        language,
        code,
        status: verdict,
        executionTime,
        memory,
      },
      select: { id: true },
    });

    if (existingUser) {
      const currentStatus = await prisma.userProblemStatus.findUnique({
        where: {
          userId_problemId: {
            userId: existingUser.id,
            problemId,
          },
        },
        select: { status: true },
      });

      const nextStatus = verdict === 'Accepted' ? 'SOLVED' : 'ATTEMPTED';

      if (currentStatus?.status !== 'SOLVED' || nextStatus === 'SOLVED') {
        await prisma.userProblemStatus.upsert({
          where: {
            userId_problemId: {
              userId: existingUser.id,
              problemId,
            },
          },
          update: { status: nextStatus },
          create: {
            userId: existingUser.id,
            problemId,
            status: nextStatus,
          },
        });
      }
    }

    return NextResponse.json({
      verdict,
      passedCount,
      totalCount: problem.testcases.length,
      executionTime: executionTime.toFixed(2),
      memory: memory.toFixed(1),
      submissionId: submission.id,
      failedTestcase,
    });
  } catch (error: unknown) {
    console.error('POST /api/submit error:', error);
    return NextResponse.json(
      {
        verdict: 'Error',
        passedCount: 0,
        totalCount: 0,
        executionTime: '0',
        memory: '0',
      },
      { status: 500 }
    );
  }
}
