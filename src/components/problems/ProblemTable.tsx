"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, CheckCircle2, Minus, ChevronRight, Shuffle, Tag, CircleDot } from "lucide-react";
import { Problem, Difficulty } from "@/types";
import { DifficultyBadge } from "./DifficultyBadge";
import { cn } from "@/lib/utils";

const TOPICS = ["Array", "String", "Hash Table", "Math", "Dynamic Programming", "Greedy", "Sorting", "Binary Search", "Tree", "Graph", "DFS/BFS", "Stack", "Recursion"];
const DIFFICULTIES: Difficulty[] = ["EASY", "MEDIUM", "HARD"];
const DIFF_LABELS: Record<Difficulty, string> = { EASY: "Easy", MEDIUM: "Medium", HARD: "Hard" };

export function ProblemTable({ problems }: { problems: Problem[] }) {
  const [search, setSearch] = useState("");
  const [activeDiffs, setActiveDiffs] = useState<Set<Difficulty>>(new Set());
  const [activeTopics, setActiveTopics] = useState<Set<string>>(new Set());

  const toggleDiff = (d: Difficulty) => setActiveDiffs(prev => {
    const n = new Set(prev);
    if (n.has(d)) { n.delete(d); } else { n.add(d); }
    return n;
  });

  const toggleTopic = (t: string) => setActiveTopics(prev => {
    const n = new Set(prev);
    if (n.has(t)) { n.delete(t); } else { n.add(t); }
    return n;
  });

  const filtered = useMemo(() => problems.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchDiff = activeDiffs.size === 0 || activeDiffs.has(p.difficulty);
    return matchSearch && matchDiff;
  }), [problems, search, activeDiffs]);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    DIFFICULTIES.forEach(d => { c[d] = problems.filter(p => p.difficulty === d).length; });
    return c;
  }, [problems]);

  const random = () => {
    const p = filtered[Math.floor(Math.random() * filtered.length)];
    if (p) window.location.href = `/problems/${p.slug}`;
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* ── Sidebar ── */}
      <aside className="col-span-12 lg:col-span-3 space-y-6">
        {/* Difficulty */}
        <div>
          <h3 className="text-[10px] uppercase tracking-widest text-[#86948a] font-mono mb-3">Difficulty</h3>
          <div className="space-y-1">
            {DIFFICULTIES.map(d => (
              <label key={d} className="flex items-center justify-between p-2 rounded-lg hover:bg-[#201f22] transition-colors cursor-pointer group">
                <div className="flex items-center gap-2.5">
                  <div
                    className={cn(
                      "w-4 h-4 rounded border-2 flex items-center justify-center transition-all",
                      activeDiffs.has(d)
                        ? "bg-[#4edea3] border-[#4edea3]"
                        : "border-[#3c4a42] group-hover:border-[#86948a]"
                    )}
                    onClick={() => toggleDiff(d)}
                  >
                    {activeDiffs.has(d) && <CheckCircle2 className="h-3 w-3 text-[#003824]" />}
                  </div>
                  <span className="text-sm text-[#bbcabf] group-hover:text-[#e5e1e4] transition-colors">{DIFF_LABELS[d]}</span>
                </div>
                <span className="text-xs font-mono text-[#3c4a42]">{counts[d] ?? 0}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Topics */}
        <div>
          <h3 className="text-[10px] uppercase tracking-widest text-[#86948a] font-mono mb-3">Topics</h3>
          <div className="flex flex-wrap gap-1.5">
            {TOPICS.map(t => (
              <button
                key={t}
                onClick={() => toggleTopic(t)}
                className={cn(
                  "px-2.5 py-1 rounded-full text-xs font-mono border transition-all",
                  activeTopics.has(t)
                    ? "bg-[#4edea3]/15 border-[#4edea3]/30 text-[#4edea3]"
                    : "bg-[#201f22] border-[#3c4a42] text-[#86948a] hover:border-[#86948a] hover:text-[#e5e1e4]"
                )}
              >
                {t}
              </button>
            ))}
          </div>
          {activeTopics.size > 0 && (
            <button onClick={() => setActiveTopics(new Set())} className="mt-2 text-xs text-[#86948a] hover:text-[#4edea3] transition-colors">
              Clear topics
            </button>
          )}
        </div>

        {/* Active filters pill */}
        {(activeDiffs.size > 0 || activeTopics.size > 0) && (
          <div className="pt-2 border-t border-[#3c4a42]">
            <div className="flex items-center gap-2 text-xs text-[#86948a] mb-2">
              <Tag className="h-3 w-3" />
              Active filters
            </div>
            <div className="flex flex-wrap gap-1">
              {[...activeDiffs].map(d => (
                <span key={d} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#4edea3]/10 border border-[#4edea3]/20 text-[#4edea3] text-xs">
                  {DIFF_LABELS[d]}
                  <button onClick={() => toggleDiff(d)} className="hover:text-white">×</button>
                </span>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* ── Main ── */}
      <div className="col-span-12 lg:col-span-9">
        {/* Search + controls */}
        <div className="flex gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#86948a]" />
            <input
              type="text"
              placeholder="Search problems…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#201f22] border border-[#3c4a42] text-sm text-[#e5e1e4] placeholder:text-[#3c4a42] focus:outline-none focus:border-[#4edea3]/50 focus:ring-1 focus:ring-[#4edea3]/20 transition"
            />
          </div>
          <button
            onClick={random}
            disabled={filtered.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#201f22] border border-[#3c4a42] hover:border-[#86948a] text-sm text-[#bbcabf] font-mono transition disabled:opacity-40"
            title="Pick random problem"
          >
            <Shuffle className="h-4 w-4" />
            Random
          </button>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-[#3c4a42] bg-[#201f22] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#3c4a42] bg-[#131315]">
                <th className="px-5 py-3 text-left text-[10px] font-mono uppercase tracking-widest text-[#86948a] w-10">Status</th>
                <th className="px-5 py-3 text-left text-[10px] font-mono uppercase tracking-widest text-[#86948a]">Title</th>
                <th className="px-5 py-3 text-left text-[10px] font-mono uppercase tracking-widest text-[#86948a]">Difficulty</th>
                <th className="px-5 py-3 text-left text-[10px] font-mono uppercase tracking-widest text-[#86948a] hidden md:table-cell">Acceptance</th>
                <th className="px-5 py-3 text-left text-[10px] font-mono uppercase tracking-widest text-[#86948a] hidden lg:table-cell">Frequency</th>
                <th className="px-2 py-3 w-8" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1c1b1d]">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-[#86948a] text-sm">
                    No problems match your filters.
                  </td>
                </tr>
              )}
              {filtered.map((p, i) => {
                const acceptance = (40 + ((i * 17) % 40)).toFixed(1);
                const freq = Math.min(100, 30 + ((i * 23) % 70));
                return (
                  <tr key={p.id} className="group hover:bg-[#2a2a2c] transition-colors cursor-pointer">
                    <td className="px-5 py-4">
                      {p.userStatus === 'SOLVED' ? (
                        <CheckCircle2 className="h-4 w-4 text-[#4edea3]" />
                      ) : p.userStatus === 'ATTEMPTED' ? (
                        <CircleDot className="h-4 w-4 text-[#ffb95f]" />
                      ) : (
                        <Minus className="h-4 w-4 text-[#3c4a42]" />
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <Link href={`/problems/${p.slug}`} className="flex flex-col gap-1">
                        <span className="font-medium text-[#e5e1e4] group-hover:text-[#4edea3] transition-colors">{p.title}</span>
                        <div className="flex gap-1.5">
                          {["Array", "Hash Table"].slice(0, i % 2 + 1).map(tag => (
                            <span key={tag} className="text-[10px] font-mono px-1.5 py-0.5 bg-[#131315] rounded text-[#86948a]">{tag}</span>
                          ))}
                        </div>
                      </Link>
                    </td>
                    <td className="px-5 py-4">
                      <DifficultyBadge difficulty={p.difficulty} />
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-[#86948a] hidden md:table-cell">{acceptance}%</td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <div className="w-20 h-1 bg-[#131315] rounded-full overflow-hidden">
                        <div className="h-full bg-[#4edea3] rounded-full" style={{ width: `${freq}%` }} />
                      </div>
                    </td>
                    <td className="px-2 py-4">
                      <Link href={`/problems/${p.slug}`}>
                        <ChevronRight className="h-4 w-4 text-[#3c4a42] group-hover:text-[#4edea3] transition-colors" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="text-xs font-mono text-[#3c4a42] mt-3 text-right">
          Showing {filtered.length} of {problems.length} problems
        </p>
      </div>
    </div>
  );
}
