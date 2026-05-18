import { cn } from "@/lib/utils";
import { Difficulty } from "@/types";

const config: Record<Difficulty, { label: string; className: string }> = {
  EASY: {
    label: "Easy",
    className: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  },
  MEDIUM: {
    label: "Medium",
    className: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  },
  HARD: {
    label: "Hard",
    className: "bg-red-500/10 text-red-400 border border-red-500/20",
  },
};

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const { label, className } = config[difficulty];
  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-semibold", className)}>
      {label}
    </span>
  );
}
