import Link from "next/link";
import { ChevronRight, CheckCircle2, Layout } from "lucide-react";
import { clsx } from "clsx";

interface RoadmapCardProps {
  title: string;
  description: string | null;
  slug: string;
  problemCount: number;
  progress?: number;
}

export function RoadmapCard({ title, description, slug, problemCount, progress = 0 }: RoadmapCardProps) {
  const isCompleted = progress === 100 && problemCount > 0;

  return (
    <Link
      href={`/roadmaps/${slug}`}
      className={clsx(
        "group relative flex flex-col justify-between rounded-3xl border p-6 transition-all duration-300",
        isCompleted
          ? "border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/40"
          : "border-white/8 bg-white/3 hover:border-white/20 hover:bg-white/5"
      )}
    >
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div className={clsx(
            "flex h-12 w-12 items-center justify-center rounded-2xl transition-colors",
            isCompleted ? "bg-emerald-500/20 text-emerald-400" : "bg-white/5 text-zinc-500 group-hover:bg-emerald-500/10 group-hover:text-emerald-400"
          )}>
            {isCompleted ? <CheckCircle2 className="h-6 w-6" /> : <Layout className="h-6 w-6" />}
          </div>
          {progress > 0 && (
            <div className={clsx(
              "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
              isCompleted ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400" : "bg-white/5 border-white/10 text-zinc-400"
            )}>
              {progress}% Complete
            </div>
          )}
        </div>

        <h3 className="mb-2 text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
          {title}
        </h3>
        <p className="mb-6 line-clamp-2 text-sm text-zinc-400 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="space-y-4">
        {progress > 0 && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
            {problemCount} Problems
          </span>
          <div className="flex items-center gap-1 text-xs font-bold text-emerald-400 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
            View Roadmap
            <ChevronRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}
