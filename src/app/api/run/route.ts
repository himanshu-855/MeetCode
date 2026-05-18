import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { executeCode, executeMock } from '@/lib/executeCode';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { language, code, input } = await req.json();

    if (!language || typeof code !== 'string' || typeof input !== 'string') {
      return NextResponse.json(
        { error: 'Invalid request payload' },
        { status: 400 }
      );
    }

    const rapidApiKey = process.env.RAPIDAPI_KEY?.trim();
    const hasJudge0Key = Boolean(rapidApiKey && rapidApiKey !== 'your-rapidapi-key');

    let result;
    if (hasJudge0Key) {
      result = await executeCode(language, code, input);
    } else {
      result = await executeMock(language, code, input);
    }

    // Prepare rate limiting headers (preparation for future step)
    const headers = new Headers();
    headers.set('X-RateLimit-Limit', '100');
    headers.set('X-RateLimit-Remaining', '99'); // Mocking remaining

    return NextResponse.json(result, { headers });

  } catch (error: unknown) {
    console.error('Code execution error:', error);
    const err = error as { response?: { data?: { message?: string } }, message?: string };
    return NextResponse.json(
      { 
        output: err.response?.data?.message || err.message || 'Failed to execute code.',
        status: 'Error',
        executionTime: '0.0',
        memory: '0.0',
        isError: true
      },
      { status: 500 }
    );
  }
}
