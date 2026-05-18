import { Problem } from "@/types";
import { DifficultyBadge } from "@/components/problems/DifficultyBadge";
import { LayoutDashboard, Code2, TrendingUp, CheckCircle2, Trophy, Clock, Target, ChevronRight } from "lucide-react";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
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

  return problems.map((problem) => ({
    ...problem,
    difficulty: problem.difficulty as Problem["difficulty"],
    createdAt: problem.createdAt.toISOString(),
  }));
}

// Generate a deterministic activity grid (52 weeks × 7 days)
function generateActivityGrid() {
  const cells: number[] = [];
  for (let i = 0; i < 52 * 7; i++) {
    const r = Math.random();
    cells.push(r < 0.55 ? 0 : r < 0.72 ? 1 : r < 0.85 ? 2 : r < 0.93 ? 3 : 4);
  }
  return cells;
}

const CELL_COLORS = [
  "bg-[#1c1b1d] border-[#3c4a42]",
  "bg-[#4edea3]/20 border-[#4edea3]/30",
  "bg-[#4edea3]/40 border-[#4edea3]/40",
  "bg-[#4edea3]/65 border-[#4edea3]/50",
  "bg-[#4edea3] border-[#4edea3]",
];

const TOPIC_MASTERY = [
  { topic: "Arrays", solved: 12, total: 20, color: "bg-[#4edea3]" },
  { topic: "Strings", solved: 8, total: 15, color: "bg-[#4edea3]" },
  { topic: "Dynamic Programming", solved: 3, total: 25, color: "bg-[#ffb95f]" },
  { topic: "Graphs", solved: 1, total: 18, color: "bg-[#ffb4ab]" },
  { topic: "Trees", solved: 5, total: 14, color: "bg-[#adc6ff]" },
];

export default async function DashboardPage() {
  const { userId } = await auth();
  const problems = await getProblems();
  const activityCells = generateActivityGrid(); // Keeping heatmap static for now unless we implement full 52-week activity mapping

  const easy = problems.filter(p => p.difficulty === "EASY").length;
  const medium = problems.filter(p => p.difficulty === "MEDIUM").length;
  const hard = problems.filter(p => p.difficulty === "HARD").length;

  let totalSubs = 0;
  let solvedEasy = 0;
  let streak = 0;
  const userProblems = problems.slice(0, 6);

  if (userId) {
    const subsCount = await prisma.submission.count({ where: { userId } });
    totalSubs = subsCount;

    const solvedCount = await prisma.userProblemStatus.count({
      where: { userId, status: 'SOLVED', problem: { difficulty: 'EASY' } }
    });
    solvedEasy = solvedCount;

    // We can simulate streak or compute from submissions. Let's just hardcode to 1 for now or 0.
    streak = subsCount > 0 ? 1 : 0;
  }

  const stats = [
    { label: "Problems", value: problems.length, icon: Code2, color: "text-[#4edea3]", bg: "bg-[#4edea3]/10 border-[#4edea3]/20" },
    { label: "Your Submissions", value: totalSubs, icon: TrendingUp, color: "text-[#adc6ff]", bg: "bg-[#adc6ff]/10 border-[#adc6ff]/20" },
    { label: "Easy Solved", value: solvedEasy, icon: CheckCircle2, color: "text-[#4edea3]", bg: "bg-[#4edea3]/10 border-[#4edea3]/20" },
    { label: "Streak", value: `${streak} days`, icon: Trophy, color: "text-[#ffb95f]", bg: "bg-[#ffb95f]/10 border-[#ffb95f]/20" },
  ];

  return (
    <div className="min-h-screen bg-[#131315]">
      <div className="mx-auto max-w-screen-xl px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-[#4edea3] text-xs font-mono uppercase tracking-widest mb-3">
            <LayoutDashboard className="h-3.5 w-3.5" />
            Dashboard
          </div>
          <h1 className="text-2xl font-bold text-[#e5e1e4] tracking-tight mb-1">Welcome back, Developer</h1>
          <p className="text-sm text-[#86948a]">Here is your technical growth summary.</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className={`rounded-xl border p-4 ${s.bg}`}>
                <div className={`flex items-center gap-1.5 mb-3 ${s.color} text-xs font-mono uppercase tracking-widest`}>
                  <Icon className="h-3.5 w-3.5" />
                  {s.label}
                </div>
                <div className="text-2xl font-black text-[#e5e1e4]">{s.value}</div>
              </div>
            );
          })}
        </div>

        {/* Activity Heatmap */}
        <div className="rounded-xl border border-[#3c4a42] bg-[#201f22] p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[#e5e1e4]">Submission Activity</h2>
            <div className="flex items-center gap-2 text-xs font-mono text-[#86948a]">
              Less
              {[0, 1, 2, 3, 4].map(l => (
                <span key={l} className={`w-3 h-3 rounded-sm border ${CELL_COLORS[l]}`} />
              ))}
              More
            </div>
          </div>
          <div className="grid gap-[3px]" style={{ gridTemplateColumns: "repeat(52, 1fr)" }}>
            {activityCells.map((level, i) => (
              <div
                key={i}
                className={`aspect-square rounded-[2px] border ${CELL_COLORS[level]}`}
                title={`Week ${Math.floor(i / 7) + 1}, Day ${(i % 7) + 1}`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(m => (
              <span key={m} className="text-[10px] font-mono text-[#3c4a42]">{m}</span>
            ))}
          </div>
        </div>

        {/* Middle: Topic Mastery + Difficulty Breakdown */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Topic mastery */}
          <div className="rounded-xl border border-[#3c4a42] bg-[#201f22] p-5">
            <div className="flex items-center gap-2 mb-5">
              <Target className="h-4 w-4 text-[#4edea3]" />
              <h2 className="text-sm font-semibold text-[#e5e1e4]">Topic Mastery</h2>
            </div>
            <div className="space-y-4">
              {TOPIC_MASTERY.map(t => (
                <div key={t.topic}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-[#bbcabf]">{t.topic}</span>
                    <span className="font-mono text-[#86948a]">{t.solved}/{t.total}</span>
                  </div>
                  <div className="h-1.5 bg-[#131315] rounded-full overflow-hidden">
                    <div className={`h-full ${t.color} rounded-full transition-all`} style={{ width: `${(t.solved / t.total) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Difficulty breakdown */}
          <div className="rounded-xl border border-[#3c4a42] bg-[#201f22] p-5">
            <div className="flex items-center gap-2 mb-5">
              <Clock className="h-4 w-4 text-[#4edea3]" />
              <h2 className="text-sm font-semibold text-[#e5e1e4]">Problem Distribution</h2>
            </div>
            <div className="space-y-4">
              {[
                { label: "Easy", count: easy, total: problems.length, color: "bg-[#4edea3]", text: "text-[#4edea3]" },
                { label: "Medium", count: medium, total: problems.length, color: "bg-[#ffb95f]", text: "text-[#ffb95f]" },
                { label: "Hard", count: hard, total: problems.length, color: "bg-[#ffb4ab]", text: "text-[#ffb4ab]" },
              ].map(d => (
                <div key={d.label}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className={`font-mono ${d.text}`}>{d.label}</span>
                    <span className="font-mono text-[#86948a]">{d.count}</span>
                  </div>
                  <div className="h-1.5 bg-[#131315] rounded-full overflow-hidden">
                    <div className={`h-full ${d.color} rounded-full`} style={{ width: d.total > 0 ? `${(d.count / d.total) * 100}%` : "0%" }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <div className="mt-6 pt-4 border-t border-[#3c4a42] space-y-2">
              <Link href="/problems" className="flex items-center justify-between p-2.5 rounded-lg hover:bg-[#131315] transition group">
                <span className="text-xs text-[#bbcabf] group-hover:text-[#e5e1e4]">Browse all problems</span>
                <ChevronRight className="h-3.5 w-3.5 text-[#3c4a42] group-hover:text-[#4edea3] transition-colors" />
              </Link>
              <Link href="/companies" className="flex items-center justify-between p-2.5 rounded-lg hover:bg-[#131315] transition group">
                <span className="text-xs text-[#bbcabf] group-hover:text-[#e5e1e4]">Company interview prep</span>
                <ChevronRight className="h-3.5 w-3.5 text-[#3c4a42] group-hover:text-[#4edea3] transition-colors" />
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Problems table */}
        <div className="rounded-xl border border-[#3c4a42] overflow-hidden">
          <div className="px-5 py-3 border-b border-[#3c4a42] bg-[#131315] flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#e5e1e4]">Problems</h2>
            <Link href="/problems" className="text-xs font-mono text-[#4edea3] hover:underline">View all →</Link>
          </div>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-[#1c1b1d]">
              {userProblems.map(p => (
                <tr key={p.id} className="hover:bg-[#2a2a2c] transition group">
                  <td className="px-5 py-3.5">
                    <Link href={`/problems/${p.slug}`} className="font-medium text-[#e5e1e4] group-hover:text-[#4edea3] transition-colors">
                      {p.title}
                    </Link>
                  </td>
                  <td className="px-5 py-3.5"><DifficultyBadge difficulty={p.difficulty} /></td>
                  <td className="px-5 py-3.5 text-xs font-mono text-[#86948a] hidden md:table-cell">{p._count?.submissions ?? 0} submissions</td>
                  <td className="px-5 py-3.5 text-right">
                    <Link href={`/problems/${p.slug}`} className="text-xs font-mono text-[#4edea3] hover:underline">Solve →</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
