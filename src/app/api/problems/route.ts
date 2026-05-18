import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const problems = await prisma.problem.findMany({
      select: {
        id: true,
        slug: true,
        title: true,
        difficulty: true,
        createdAt: true,
        _count: {
          select: { submissions: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    const { userId } = await auth();
    const statuses: Record<string, string> = {};

    if (userId) {
      const userStatuses = await prisma.userProblemStatus.findMany({
        where: { userId }
      });
      userStatuses.forEach(s => {
        statuses[s.problemId] = s.status;
      });
    }

    const problemsWithStatus = problems.map(p => ({
      ...p,
      userStatus: statuses[p.id] || null
    }));

    return NextResponse.json({ problems: problemsWithStatus });
  } catch (error) {
    console.error('GET /api/problems error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch problems' },
      { status: 500 }
    );
  }
}
