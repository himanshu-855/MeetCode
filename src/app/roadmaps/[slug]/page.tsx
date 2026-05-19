import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import RoadmapView from "@/components/roadmap/RoadmapView";

async function getRoadmap(slug: string) {
  const roadmap = await prisma.learningTrack.findUnique({
    where: { slug },
    include: {
      sections: {
        orderBy: { order: "asc" },
        include: {
          problems: {
            orderBy: { order: "asc" },
            include: {
              problem: {
                select: {
                  id: true,
                  slug: true,
                  title: true,
                  difficulty: true,
                  estimatedTime: true,
                }
              }
            }
          }
        }
      }
    }
  });

  if (!roadmap) return null;

  const { userId } = await auth();
  const problemStatuses = new Map<string, "SOLVED" | "ATTEMPTED">();

  if (userId) {
    const statuses = await prisma.userProblemStatus.findMany({
      where: { userId },
      select: { problemId: true, status: true }
    });
    statuses.forEach(s => problemStatuses.set(s.problemId, s.status as "SOLVED" | "ATTEMPTED"));
  }

  return {
    ...roadmap,
    sections: roadmap.sections.map(section => ({
      ...section,
      problems: section.problems.map(tp => ({
        ...tp.problem,
        status: problemStatuses.get(tp.problemId) || null
      }))
    }))
  };
}

export default async function RoadmapDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const roadmap = await getRoadmap(slug);

  if (!roadmap) notFound();

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Hero Section */}
      <div className="relative border-b border-white/5 bg-white/2 py-12">
        <div className="mx-auto max-w-screen-xl px-4">
          <Link
            href="/roadmaps"
            className="mb-8 flex items-center gap-2 text-sm text-zinc-500 hover:text-emerald-400 w-fit"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Roadmaps
          </Link>

          <div>
            <h1 className="text-4xl font-black text-white md:text-5xl">
              {roadmap.title}
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-zinc-400">
              {roadmap.description}
            </p>
          </div>
        </div>
      </div>

      {/* Roadmap Content */}
      <div className="mx-auto max-w-screen-xl px-4 py-12">
        <RoadmapView roadmap={roadmap} />
      </div>
    </div>
  );
}
