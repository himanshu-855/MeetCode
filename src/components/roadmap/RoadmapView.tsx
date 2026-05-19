'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle2, Circle, Clock3, Trophy, ChevronDown, ChevronRight, BarChart3, PlayCircle } from 'lucide-react';
import { clsx } from 'clsx';
import confetti from 'canvas-confetti';

interface Problem {
  id: string;
  slug: string;
  title: string;
  difficulty: string;
  status: 'SOLVED' | 'ATTEMPTED' | null;
  estimatedTime?: number | null;
}

interface Section {
  id: string;
  title: string;
  order: number;
  problems: Problem[];
}

interface RoadmapViewProps {
  roadmap: {
    id: string;
    title: string;
    description: string | null;
    sections: Section[];
  };
}

export default function RoadmapView({ roadmap }: RoadmapViewProps) {
  const [activeSection, setActiveSection] = useState<string>(roadmap.sections[0]?.id || '');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(
    Object.fromEntries(roadmap.sections.map(s => [s.id, true]))
  );

  const totalProblems = roadmap.sections.reduce((acc, s) => acc + s.problems.length, 0);
  const solvedProblems = roadmap.sections.reduce((acc, s) => acc + s.problems.filter(p => p.status === 'SOLVED').length, 0);
  const progress = totalProblems > 0 ? Math.round((solvedProblems / totalProblems) * 100) : 0;

  const totalEstimatedTime = roadmap.sections.reduce((acc, s) => 
    acc + s.problems.reduce((sum, p) => sum + (p.estimatedTime || 15), 0), 0
  );

  const remainingTime = roadmap.sections.reduce((acc, s) => 
    acc + s.problems.filter(p => p.status !== 'SOLVED').reduce((sum, p) => sum + (p.estimatedTime || 15), 0), 0
  );

  const nextSection = roadmap.sections.find(s => 
    s.problems.some(p => p.status !== 'SOLVED')
  );

  const firstUnsolvedProblem = roadmap.sections.flatMap(s => s.problems).find(p => p.status !== 'SOLVED');

  const difficultyDist = roadmap.sections.flatMap(s => s.problems).reduce((acc, p) => {
    acc[p.difficulty] = (acc[p.difficulty] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  useEffect(() => {
    if (progress === 100 && totalProblems > 0) {
      const duration = 5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [progress, totalProblems]);

  const toggleSection = (id: string) => {
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.2, rootMargin: '-10% 0% -70% 0%' }
    );

    roadmap.sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [roadmap.sections]);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar Navigation */}
      <aside className="hidden lg:block w-72 shrink-0">
        <div className="sticky top-24 space-y-6">
          <div className="rounded-2xl border border-white/8 bg-white/3 p-5">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2">
              <BarChart3 className="h-3.5 w-3.5" />
              Progress Stats
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-zinc-400">Completion</span>
                  <span className="text-emerald-400 font-bold">{progress}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-1000" 
                    style={{ width: `${progress}%` }} 
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2">
                {['EASY', 'MEDIUM', 'HARD'].map(d => (
                  <div key={d} className="text-center">
                    <div className={clsx(
                      "text-[10px] font-black mb-1",
                      d === 'EASY' ? 'text-emerald-500/70' : d === 'MEDIUM' ? 'text-yellow-500/70' : 'text-red-500/70'
                    )}>{d[0]}</div>
                    <div className="text-sm font-bold text-white">{difficultyDist[d] || 0}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/8 bg-white/3 p-5">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2">
              <Clock3 className="h-3.5 w-3.5" />
              Time Estimate
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-zinc-400 text-xs">
                  Remaining
                </div>
                <div className="text-sm font-bold text-white">
                  {Math.floor(remainingTime / 60)}h {remainingTime % 60}m
                </div>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-1000" 
                  style={{ width: `${progress}%` }} 
                />
              </div>
              <div className="text-[10px] text-zinc-500 text-center">
                Total Track: {Math.floor(totalEstimatedTime / 60)}h {totalEstimatedTime % 60}m
              </div>
            </div>
          </div>

          {nextSection && (
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-emerald-500/70 mb-3">Up Next</h3>
              <div className="text-sm font-bold text-white mb-3 line-clamp-1">{nextSection.title}</div>
              <a 
                href={`#${nextSection.id}`}
                className="flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-emerald-500 text-[#003824] text-xs font-bold hover:bg-[#6ffbbe] transition-colors"
              >
                Jump to Section
                <ChevronRight className="h-3.5 w-3.5" />
              </a>
            </div>
          )}

          <nav className="rounded-2xl border border-white/8 bg-white/3 p-2">
            <h3 className="px-3 pt-3 pb-2 text-xs font-black uppercase tracking-widest text-zinc-500">Sections</h3>
            <div className="space-y-1">
              {roadmap.sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className={clsx(
                    "flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition-all group",
                    activeSection === section.id
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
                  )}
                >
                  <span className="truncate">{section.title}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] opacity-50">
                      {section.problems.filter(p => p.status === 'SOLVED').length}/{section.problems.length}
                    </span>
                    {activeSection === section.id && (
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    )}
                  </div>
                </a>
              ))}
            </div>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 space-y-12">
        {firstUnsolvedProblem && progress > 0 && progress < 100 && (
          <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400">
                <PlayCircle className="h-7 w-7" />
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-emerald-500/70 mb-1">Pick up where you left off</div>
                <div className="text-xl font-bold text-white">{firstUnsolvedProblem.title}</div>
              </div>
            </div>
            <Link 
              href={`/problems/${firstUnsolvedProblem.slug}`}
              className="flex items-center justify-center gap-2 px-8 py-3 rounded-2xl bg-emerald-500 text-[#003824] font-black hover:bg-[#6ffbbe] transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Continue Solving
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        {roadmap.sections.map((section) => {
          const sectionTotalTime = section.problems.reduce((sum, p) => sum + (p.estimatedTime || 15), 0);
          const isSectionSolved = section.problems.length > 0 && section.problems.every(p => p.status === 'SOLVED');

          return (
            <section key={section.id} id={section.id} className="scroll-mt-24">
              <div 
                className="mb-6 flex items-center gap-4 cursor-pointer group"
                onClick={() => toggleSection(section.id)}
              >
                <div className={clsx(
                  "flex h-10 w-10 items-center justify-center rounded-xl font-bold transition-colors",
                  isSectionSolved ? "bg-emerald-500/20 text-emerald-400" : "bg-white/5 text-zinc-500 group-hover:bg-emerald-500/10 group-hover:text-emerald-400"
                )}>
                  {isSectionSolved ? <CheckCircle2 className="h-5 w-5" /> : section.order}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors">{section.title}</h2>
                  <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Clock3 className="h-3 w-3" />
                      {sectionTotalTime} mins
                    </span>
                    <span>•</span>
                    <span>{section.problems.length} Problems</span>
                  </div>
                </div>
                {expandedSections[section.id] ? (
                  <ChevronDown className="h-5 w-5 text-zinc-600 ml-2" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-zinc-600 ml-2" />
                )}
                <div className="h-px flex-1 bg-white/5 mx-2" />
                <div className="text-sm font-medium text-zinc-500">
                  {section.problems.filter(p => p.status === 'SOLVED').length} / {section.problems.length}
                </div>
              </div>

              {expandedSections[section.id] && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  {section.problems.map((problem) => {
                    const isSolved = problem.status === 'SOLVED';
                    const isAttempted = problem.status === 'ATTEMPTED';

                    return (
                      <Link
                        key={problem.id}
                        href={`/problems/${problem.slug}`}
                        className={clsx(
                          "group flex items-center justify-between rounded-2xl border p-4 transition-all",
                          isSolved
                            ? "border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/40"
                            : isAttempted
                            ? "border-yellow-500/20 bg-yellow-500/5 hover:border-yellow-500/40"
                            : "border-white/8 bg-white/3 hover:border-white/20 hover:bg-white/5"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          {isSolved ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                          ) : isAttempted ? (
                            <Clock3 className="h-5 w-5 text-yellow-500" />
                          ) : (
                            <Circle className="h-5 w-5 text-zinc-600 group-hover:text-zinc-400" />
                          )}
                          <div>
                            <div className={clsx(
                              "font-bold transition-colors",
                              isSolved ? "text-emerald-400" : isAttempted ? "text-yellow-400" : "text-zinc-300 group-hover:text-white"
                            )}>
                              {problem.title}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <div className={clsx(
                                "text-[10px] font-black uppercase tracking-widest",
                                problem.difficulty === "EASY" ? "text-emerald-500/70" :
                                problem.difficulty === "MEDIUM" ? "text-yellow-500/70" : "text-red-500/70"
                              )}>
                                {problem.difficulty}
                              </div>
                              <span className="text-[10px] text-zinc-600">•</span>
                              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                                <Clock3 className="h-2.5 w-2.5" />
                                {problem.estimatedTime || 15}m
                              </div>
                            </div>
                          </div>
                        </div>
                        {isAttempted && (
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-500/10 text-yellow-500 group-hover:scale-110 transition-transform">
                            <PlayCircle className="h-4 w-4" />
                          </div>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </section>
          );
        })}

        {progress === 100 && totalProblems > 0 && (
          <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-12 text-center animate-in zoom-in duration-500">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <Trophy className="h-10 w-10" />
            </div>
            <h2 className="text-3xl font-black text-white mb-2">Roadmap Completed!</h2>
            <p className="text-zinc-400">You&apos;ve mastered all the problems in this track. Amazing job!</p>
          </div>
        )}
      </div>
    </div>
  );
}
