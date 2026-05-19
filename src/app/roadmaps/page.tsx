import { prisma } from "@/lib/prisma";
import { RoadmapCard } from "@/components/roadmap/RoadmapCard";
import { auth } from "@clerk/nextjs/server";
import { Map } from "lucide-react";

async function getRoadmaps() {
  const { userId } = await auth();

  const roadmaps = await prisma.learningTrack.findMany({
    include: {
      sections: {
        include: {
          problems: {
            select: { problemId: true }
          }
        }
      }
    }
  });

  const userSolved = new Set<string>();
  if (userId) {
    const solved = await prisma.userProblemStatus.findMany({
      where: { userId, status: 'SOLVED' },
      select: { problemId: true }
    });
    solved.forEach(s => userSolved.add(s.problemId));
  }

  return roadmaps.map(r => {
    const allProblemIds = r.sections.flatMap(s => s.problems.map(p => p.problemId));
    const solvedCount = allProblemIds.filter(id => userSolved.has(id)).length;
    
    return {
      ...r,
      problemCount: allProblemIds.length,
      solvedCount,
      progress: allProblemIds.length > 0 ? Math.round((solvedCount / allProblemIds.length) * 100) : 0
    };
  });
}

export default async function RoadmapsPage() {
  const roadmaps = await getRoadmaps();

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="mx-auto max-w-screen-xl px-4 py-10">
        <div className="mb-12">
          <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium mb-2">
            <Map className="h-4 w-4" />
            Learning Paths
          </div>
          <h1 className="text-4xl font-black text-white mb-4">Skill Roadmaps</h1>
          <p className="max-w-2xl text-lg text-zinc-400">
            Structured learning paths to help you master Data Structures, Algorithms, and System Design.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {roadmaps.map((roadmap) => (
            <RoadmapCard
              key={roadmap.id}
              title={roadmap.title}
              description={roadmap.description}
              slug={roadmap.slug}
              problemCount={roadmap.problemCount}
              progress={roadmap.progress}
            />
          ))}
        </div>

        {roadmaps.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center">
            <p className="text-zinc-500 font-medium">No roadmaps available yet. Stay tuned!</p>
          </div>
        )}
      </div>
    </div>
  );
}
