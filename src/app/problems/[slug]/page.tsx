import { notFound } from "next/navigation";
import { Difficulty, ProblemDetail } from "@/types";
import { ProblemSolver } from "@/components/problem/ProblemSolver";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getProblem(slug: string): Promise<ProblemDetail | null> {
  const problem = await prisma.problem.findUnique({
    where: { slug },
    include: {
      testcases: {
        where: { isHidden: false },
        select: {
          id: true,
          input: true,
          output: true,
        },
      },
      topics: {
        include: {
          topic: true
        }
      },
      _count: {
        select: { submissions: true },
      },
    },
  });

  if (!problem) {
    return null;
  }

  const { userId } = await auth();
  const status = userId
    ? await prisma.userProblemStatus.findUnique({
        where: {
          userId_problemId: {
            userId,
            problemId: problem.id,
          },
        },
        select: { status: true },
      })
    : null;

  return {
    ...problem,
    difficulty: problem.difficulty as Difficulty,
    createdAt: problem.createdAt.toISOString(),
    userStatus: (status?.status as ProblemDetail['userStatus']) ?? null,
    starterCode: problem.starterCode as ProblemDetail['starterCode'],
  };
}

export default async function ProblemPage({ params }: Props) {
  const { slug } = await params;
  const { userId } = await auth();
  const problem = await getProblem(slug);

  if (!problem) return notFound();

  return <ProblemSolver problem={problem} isAuthenticated={Boolean(userId)} />;
}
