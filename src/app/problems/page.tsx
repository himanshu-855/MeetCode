import { ProblemTable } from "@/components/problems/ProblemTable";
import { Difficulty, Problem } from "@/types";
import { auth } from "@clerk/nextjs/server";
import { BookOpen } from "lucide-react";
import { prisma } from "@/lib/prisma";

async function getProblems(): Promise<Problem[]> {
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
    orderBy: { createdAt: "asc" },
  });

  const { userId } = await auth();
  const statuses: Record<string, Problem["userStatus"]> = {};

  if (userId) {
    const userStatuses = await prisma.userProblemStatus.findMany({
      where: { userId },
      select: { problemId: true, status: true },
    });

    userStatuses.forEach((status) => {
      statuses[status.problemId] = status.status;
    });
  }

  return problems.map((problem) => ({
    ...problem,
    difficulty: problem.difficulty as Difficulty,
    createdAt: problem.createdAt.toISOString(),
    userStatus: statuses[problem.id] ?? null,
  }));
}

export default async function ProblemsPage() {
  const problems = await getProblems();

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="mx-auto max-w-screen-xl px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium mb-2">
            <BookOpen className="h-4 w-4" />
            Problem Set
          </div>
          <h1 className="text-3xl font-black text-white mb-2">All Problems</h1>
          <p className="text-zinc-400">
            Solve problems, get instant feedback, and track your progress.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total", value: problems.length, color: "text-white" },
            {
              label: "Easy",
              value: problems.filter((p) => p.difficulty === "EASY").length,
              color: "text-emerald-400",
            },
            {
              label: "Medium",
              value: problems.filter((p) => p.difficulty === "MEDIUM").length,
              color: "text-yellow-400",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-white/8 bg-white/3 px-4 py-3 text-center"
            >
              <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
              <div className="text-xs text-zinc-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        <ProblemTable problems={problems} />
      </div>
    </div>
  );
}
