"use client";

import { useState, useEffect, useCallback } from "react";
import { SignInButton } from "@clerk/nextjs";
import { Group as PanelGroup, Panel, Separator } from "react-resizable-panels";
import dynamic from "next/dynamic";
import { LANGUAGE_MAP, getLanguageConfig } from "@/lib/languageMap";
import { useRunCode, useSubmit } from "@/hooks/useProblemExecution";
import { ProblemDetail, RunResult, SubmitResult, Verdict } from "@/types";
import { DifficultyBadge } from "@/components/problems/DifficultyBadge";
import {
  Play, Send, Loader2, CheckCircle2, XCircle,
  Clock, ChevronDown, Copy, RotateCcw,
  Code2, Terminal, AlignLeft, FlaskConical,
  MemoryStick, ChevronRight, Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

// ── Verdict config ──────────────────────────────────────────────
const VERDICT_CONFIG: Record<string, { color: string; bg: string; border: string; icon: React.ComponentType<{ className?: string }> }> = {
  "Accepted":             { color: "text-[#4edea3]", bg: "bg-[#4edea3]/10", border: "border-[#4edea3]/25", icon: CheckCircle2 },
  "Wrong Answer":         { color: "text-[#ffb4ab]", bg: "bg-[#ffb4ab]/10", border: "border-[#ffb4ab]/25", icon: XCircle },
  "Runtime Error":        { color: "text-[#ffb95f]", bg: "bg-[#ffb95f]/10", border: "border-[#ffb95f]/25", icon: XCircle },
  "Compilation Error":    { color: "text-[#ffb95f]", bg: "bg-[#ffb95f]/10", border: "border-[#ffb95f]/25", icon: XCircle },
  "Time Limit Exceeded":  { color: "text-[#adc6ff]", bg: "bg-[#adc6ff]/10", border: "border-[#adc6ff]/25", icon: Clock },
  "Memory Limit Exceeded":{ color: "text-[#adc6ff]", bg: "bg-[#adc6ff]/10", border: "border-[#adc6ff]/25", icon: MemoryStick },
  "Error":                { color: "text-[#ffb4ab]", bg: "bg-[#ffb4ab]/10", border: "border-[#ffb4ab]/25", icon: XCircle },
};

function VerdictChip({ verdict }: { verdict: Verdict }) {
  const cfg = VERDICT_CONFIG[verdict] ?? VERDICT_CONFIG["Error"];
  const Icon = cfg.icon;
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold border", cfg.color, cfg.bg, cfg.border)}>
      <Icon className="h-4 w-4" />
      {verdict}
    </span>
  );
}

function StatPill({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] uppercase tracking-widest text-[#86948a] font-mono">{label}</span>
      <span className="flex items-center gap-1 text-sm font-bold text-[#4edea3]">
        {icon}
        {value}
      </span>
    </div>
  );
}

// ── Output Panel ────────────────────────────────────────────────
function OutputPanel({ isRunning, result }: { isRunning: boolean; result: RunResult | null }) {
  if (isRunning) return (
    <div className="flex items-center justify-center h-full gap-2 text-[#86948a]">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span className="text-sm">Executing…</span>
    </div>
  );
  if (!result) return (
    <div className="flex flex-col items-center justify-center h-full gap-2 text-[#3c4a42]">
      <Terminal className="h-6 w-6" />
      <span className="text-xs">Run code to see output</span>
    </div>
  );

  const cfg = VERDICT_CONFIG[result.status];
  return (
    <div className="p-4 space-y-3 h-full overflow-y-auto">
      <div className="flex items-center gap-3 flex-wrap">
        {cfg ? (
          <VerdictChip verdict={result.status as Verdict} />
        ) : (
          <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-[#201f22] text-[#bbcabf] border border-[#3c4a42]">{result.status}</span>
        )}
        <div className="flex items-center gap-4 ml-auto">
          <StatPill icon={<Clock className="h-3 w-3" />} label="Time" value={`${result.executionTime}s`} />
          <StatPill icon={<MemoryStick className="h-3 w-3" />} label="Memory" value={`${result.memory}KB`} />
          <button onClick={() => navigator.clipboard.writeText(result.output)} className="p-1 text-[#3c4a42] hover:text-[#bbcabf] transition-colors">
            <Copy className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <div className="rounded-lg border border-[#3c4a42] bg-[#0e0e10] p-3 font-mono text-xs">
        <pre className={cn("whitespace-pre-wrap break-all", result.isError ? "text-[#ffb4ab]" : "text-[#e5e1e4]")}>
          {result.output || <span className="text-[#3c4a42] italic">No output</span>}
        </pre>
      </div>
    </div>
  );
}

// ── Verdict Panel ───────────────────────────────────────────────
function VerdictPanel({ isSubmitting, result }: { isSubmitting: boolean; result: SubmitResult | null }) {
  if (isSubmitting) return (
    <div className="flex items-center justify-center h-full gap-2 text-[#86948a]">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span className="text-sm">Judging your solution…</span>
    </div>
  );
  if (!result) return (
    <div className="flex flex-col items-center justify-center h-full gap-2 text-[#3c4a42]">
      <Send className="h-6 w-6" />
      <span className="text-xs">Submit to see verdict</span>
    </div>
  );

  const isAC = result.verdict === "Accepted";
  return (
    <div className="p-4 space-y-4 h-full overflow-y-auto">
      {/* Main verdict */}
      <div className={cn("rounded-xl border p-4 flex items-center gap-3",
        isAC ? "bg-[#4edea3]/8 border-[#4edea3]/20" : "bg-[#ffb4ab]/8 border-[#ffb4ab]/20"
      )}>
        <VerdictChip verdict={result.verdict} />
        <span className="ml-auto text-xs font-mono text-[#86948a]">
          {result.passedCount}/{result.totalCount} testcases passed
        </span>
      </div>

      {/* Testcase progress dots */}
      {result.totalCount > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap">
          {Array.from({ length: result.totalCount }).map((_, i) => (
            <span
              key={i}
              className={cn(
                "w-5 h-5 rounded-sm text-[9px] font-mono flex items-center justify-center border",
                i < result.passedCount
                  ? "bg-[#4edea3]/15 border-[#4edea3]/30 text-[#4edea3]"
                  : i === result.passedCount
                  ? "bg-[#ffb4ab]/15 border-[#ffb4ab]/30 text-[#ffb4ab]"
                  : "bg-[#201f22] border-[#3c4a42] text-[#86948a]"
              )}
            >
              {i + 1}
            </span>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="flex gap-6">
        <StatPill icon={<Clock className="h-3 w-3" />} label="Runtime" value={`${result.executionTime}s`} />
        <StatPill icon={<MemoryStick className="h-3 w-3" />} label="Memory" value={`${result.memory}KB`} />
      </div>

      {/* Failed testcase detail */}
      {!isAC && result.failedTestcase && (
        <div className="rounded-xl border border-[#3c4a42] bg-[#0e0e10] overflow-hidden">
          <div className="px-3 py-2 border-b border-[#3c4a42] text-[10px] uppercase tracking-widest text-[#86948a] font-mono">
            Failed Testcase
          </div>
          <div className="p-3 space-y-2 font-mono text-xs">
            <div className="flex gap-2">
              <span className="text-[#86948a] w-20 shrink-0">Input</span>
              <span className="text-[#bbcabf]">{result.failedTestcase.input}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-[#86948a] w-20 shrink-0">Expected</span>
              <span className="text-[#4edea3]">{result.failedTestcase.expectedOutput}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-[#86948a] w-20 shrink-0">Got</span>
              <span className="text-[#ffb4ab]">{result.failedTestcase.actualOutput}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────
function AuthGateOverlay() {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#0e0e10]/55 px-4 backdrop-blur-[3px]">
      <div className="w-full max-w-md rounded-2xl border border-[#4edea3]/25 bg-[#131315]/95 p-6 text-center shadow-2xl shadow-black/40">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-[#4edea3]/25 bg-[#4edea3]/10">
          <Lock className="h-5 w-5 text-[#4edea3]" />
        </div>
        <h2 className="mb-2 text-lg font-bold text-[#e5e1e4]">
          Sign in to start solving problems and track your progress.
        </h2>
        <p className="mb-5 text-sm leading-relaxed text-[#86948a]">
          Preview the statement now. Sign in when you are ready to run code, submit solutions, and save progress.
        </p>
        <div className="grid gap-2">
          <SignInButton mode="modal">
            <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#4edea3] px-4 py-2.5 text-sm font-bold text-[#003824] transition-colors hover:bg-[#6ffbbe]">
              <Code2 className="h-4 w-4" />
              Continue with Google
            </button>
          </SignInButton>
          <SignInButton mode="modal">
            <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#3c4a42] bg-[#201f22] px-4 py-2.5 text-sm font-semibold text-[#e5e1e4] transition-colors hover:border-[#86948a] hover:bg-[#2a2a2c]">
              <Terminal className="h-4 w-4" />
              Continue with GitHub
            </button>
          </SignInButton>
        </div>
      </div>
    </div>
  );
}

export function ProblemSolver({
  problem,
  isAuthenticated,
}: {
  problem: ProblemDetail;
  isAuthenticated: boolean;
}) {
  const [language, setLanguage] = useState<string>("c++");
  const [code, setCode] = useState<string>("");
  const [customInput, setCustomInput] = useState<string>(problem.testcases[0]?.input ?? "");
  const [leftTab, setLeftTab] = useState<"description" | "testcases">("description");
  const [consoleTab, setConsoleTab] = useState<"input" | "output" | "verdict">("input");

  const { run, isRunning, runResult, clearRun } = useRunCode();
  const { submit, isSubmitting, submitResult, clearSubmit } = useSubmit();

  useEffect(() => {
    const cfg = getLanguageConfig(language);
    if (problem.starterCode && (problem.starterCode as Record<string, string>)[language]) {
      setCode((problem.starterCode as Record<string, string>)[language]);
    } else if (cfg) {
      setCode(cfg.template);
    }
    clearRun();
    clearSubmit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, problem.starterCode]);

  const handleRun = useCallback(() => {
    if (!isAuthenticated) return;
    clearSubmit();
    setConsoleTab("output");
    run(language, code, customInput);
  }, [isAuthenticated, language, code, customInput, run, clearSubmit]);

  const handleSubmit = useCallback(() => {
    if (!isAuthenticated) return;
    clearRun();
    setConsoleTab("verdict");
    submit(problem.id, language, code);
  }, [isAuthenticated, problem.id, language, code, submit, clearRun]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.ctrlKey && e.key === "Enter") handleRun(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleRun]);

  const isLoading = isRunning || isSubmitting;

  return (
    <div className="flex h-[calc(100dvh-56px)] min-h-[560px] flex-col overflow-hidden bg-[#131315]">
      <PanelGroup orientation="horizontal" className="min-h-0 min-w-0 flex-1 overflow-hidden">

        {/* ════ LEFT PANEL ════ */}
        <Panel defaultSize={38} minSize={28} className="flex min-h-0 min-w-0 flex-col bg-[#0e0e10]">
          {/* Tab bar */}
          <div className="flex items-center border-b border-[#3c4a42] bg-[#131315] shrink-0 px-1">
            {[
              { id: "description" as const, label: "Description", icon: AlignLeft },
              { id: "testcases" as const, label: `Testcases`, icon: FlaskConical },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setLeftTab(id)}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-3 text-xs font-medium transition-all border-b-2 -mb-px",
                  leftTab === id
                    ? "border-[#4edea3] text-[#4edea3]"
                    : "border-transparent text-[#86948a] hover:text-[#e5e1e4]"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
                {id === "testcases" && (
                  <span className="ml-1 px-1.5 py-0.5 rounded text-[9px] font-mono bg-[#201f22] text-[#86948a]">
                    {problem.testcases.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="min-h-0 flex-1 overflow-y-auto">
            {leftTab === "description" && (
              <div className="p-6 space-y-6">
                {/* Header */}
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <h1 className="text-lg font-bold text-[#e5e1e4] leading-tight">{problem.title}</h1>
                    <DifficultyBadge difficulty={problem.difficulty} />
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2">
                    {problem.topics?.map(({ topic }) => (
                      <span key={topic.slug} className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#201f22] text-[#86948a] border border-[#3c4a42]">
                        {topic.name}
                      </span>
                    ))}
                    {problem.estimatedTime && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <Clock className="h-3 w-3" />
                        {problem.estimatedTime} mins
                      </span>
                    )}
                    {problem.companyRelevance?.map((company) => (
                      <span key={company} className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {company}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div
                  className="text-sm text-[#bbcabf] leading-relaxed space-y-3"
                  dangerouslySetInnerHTML={{
                    __html: problem.description
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#e5e1e4] font-semibold">$1</strong>')
                      .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-[#201f22] border border-[#3c4a42] text-[#4edea3] font-mono text-xs">$1</code>')
                      .replace(/\n/g, "<br/>"),
                  }}
                />

                {/* Examples */}
                {problem.testcases.slice(0, 2).map((tc, i) => (
                  <div key={tc.id} className="rounded-xl border border-[#3c4a42] bg-[#201f22] overflow-hidden">
                    <div className="px-4 py-2.5 border-b border-[#3c4a42] flex items-center gap-2">
                      <span className="text-[#4edea3] text-xs font-mono">⬡</span>
                      <span className="text-xs font-semibold text-[#e5e1e4]">Example {i + 1}</span>
                    </div>
                    <div className="p-4 font-mono text-xs space-y-2">
                      <div className="flex gap-3">
                        <span className="text-[#86948a] w-16 shrink-0">Input:</span>
                        <span className="text-[#e5e1e4] whitespace-pre">{tc.input}</span>
                      </div>
                      <div className="flex gap-3">
                        <span className="text-[#86948a] w-16 shrink-0">Output:</span>
                        <span className="text-[#4edea3] font-semibold">{tc.output}</span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Constraints */}
                {problem.constraints.length > 0 && (
                  <div className="rounded-xl border border-[#3c4a42] bg-[#201f22] overflow-hidden">
                    <div className="px-4 py-2.5 border-b border-[#3c4a42]">
                      <span className="text-xs font-semibold text-[#e5e1e4]">Constraints</span>
                    </div>
                    <ul className="p-4 space-y-2">
                      {problem.constraints.map((c, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs font-mono text-[#bbcabf]">
                          <ChevronRight className="h-3 w-3 text-[#4edea3] mt-0.5 shrink-0" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {leftTab === "testcases" && (
              <div className="p-4 space-y-3">
                {problem.testcases.map((tc, i) => (
                  <div key={tc.id} className="rounded-xl border border-[#3c4a42] bg-[#201f22] overflow-hidden">
                    <div className="px-3 py-2 border-b border-[#3c4a42] flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#e5e1e4]">Testcase {i + 1}</span>
                      <button
                        onClick={() => setCustomInput(tc.input)}
                        className="text-[10px] text-[#4edea3] hover:underline font-mono"
                      >
                        Use as input
                      </button>
                    </div>
                    <div className="p-3 font-mono text-xs space-y-2">
                      <div>
                        <div className="text-[#86948a] mb-1">Input</div>
                        <pre className="text-[#e5e1e4] bg-[#0e0e10] rounded-lg p-2 overflow-x-auto">{tc.input}</pre>
                      </div>
                      <div>
                        <div className="text-[#86948a] mb-1">Expected Output</div>
                        <pre className="text-[#4edea3] bg-[#0e0e10] rounded-lg p-2 overflow-x-auto">{tc.output}</pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Panel>

        <Separator className="w-[3px] bg-[#1c1b1d] hover:bg-[#4edea3]/40 transition-colors cursor-col-resize" />

        {/* ════ RIGHT PANEL ════ */}
        <Panel defaultSize={62} minSize={40} className="relative flex min-h-0 min-w-0 flex-col overflow-hidden">
          <PanelGroup
            orientation="vertical"
            className={cn(
              "min-h-0 flex-1 transition duration-200",
              !isAuthenticated && "pointer-events-none select-none blur-[2px]"
            )}
          >

            {/* ── EDITOR ── */}
            <Panel defaultSize={62} minSize={35} className="flex min-h-0 flex-col overflow-hidden">
              {/* Toolbar */}
              <div className="flex h-11 shrink-0 items-center justify-between gap-3 border-b border-[#3c4a42] bg-[#201f22] px-3">
                {/* Left: Language + actions */}
                <div className="flex min-w-0 items-center gap-2">
                  <div className="relative">
                    <Code2 className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#4edea3] pointer-events-none" />
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="appearance-none pl-7 pr-7 py-1.5 rounded-lg bg-[#131315] border border-[#3c4a42] text-xs text-[#e5e1e4] font-mono focus:outline-none focus:border-[#4edea3]/50 hover:border-[#86948a] transition-colors cursor-pointer"
                    >
                      {Object.entries(LANGUAGE_MAP).map(([key, cfg]) => (
                        <option key={key} value={key} className="bg-[#131315]">
                          {cfg.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-[#86948a] pointer-events-none" />
                  </div>

                  <div className="w-px h-4 bg-[#3c4a42]" />

                  <button
                    onClick={() => {
                      const cfg = getLanguageConfig(language);
                      if (cfg) setCode(cfg.template);
                    }}
                    title="Reset to template"
                    className="p-1.5 rounded-md text-[#86948a] hover:text-[#e5e1e4] hover:bg-[#131315] transition-colors"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>

                  <button
                    onClick={() => navigator.clipboard.writeText(code)}
                    title="Copy code"
                    className="p-1.5 rounded-md text-[#86948a] hover:text-[#e5e1e4] hover:bg-[#131315] transition-colors"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Right: Run + Submit */}
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    onClick={handleRun}
                    disabled={isLoading || !isAuthenticated}
                    title="Run (Ctrl+Enter)"
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#131315] border border-[#3c4a42] hover:border-[#86948a] text-xs text-[#e5e1e4] font-medium transition-all disabled:opacity-40"
                  >
                    {isRunning
                      ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      : <Play className="h-3.5 w-3.5 text-[#4edea3] fill-[#4edea3]" />
                    }
                    Run
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading || !isAuthenticated}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#4edea3] hover:bg-[#6ffbbe] text-[#003824] text-xs font-bold transition-all disabled:opacity-40"
                  >
                    {isSubmitting
                      ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      : <Send className="h-3.5 w-3.5" />
                    }
                    Submit
                  </button>
                </div>
              </div>

              {/* Monaco Editor */}
              <div className="flex-1 overflow-hidden bg-[#131315]">
                <MonacoEditor
                  height="100%"
                  language={language === "c++" ? "cpp" : language}
                  value={code}
                  theme="vs-dark"
                  onChange={(v) => setCode(v ?? "")}
                  options={{
                    readOnly: !isAuthenticated,
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineHeight: 22,
                    padding: { top: 12, bottom: 12 },
                    scrollBeyondLastLine: false,
                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    fontLigatures: true,
                    smoothScrolling: true,
                    cursorBlinking: "smooth",
                    cursorSmoothCaretAnimation: "on",
                    renderLineHighlight: "line",
                    bracketPairColorization: { enabled: true },
                    guides: { bracketPairs: true },
                  }}
                />
              </div>
            </Panel>

            <Separator className="h-[3px] bg-[#1c1b1d] hover:bg-[#4edea3]/40 transition-colors cursor-row-resize" />

            {/* ── CONSOLE ── */}
            <Panel defaultSize={38} minSize={24} className="flex min-h-0 flex-col bg-[#0e0e10]">
              {/* Console header */}
              <div className="flex items-center border-b border-[#3c4a42] bg-[#131315] shrink-0 px-2">
                {[
                  { id: "input" as const, label: "Input" },
                  { id: "output" as const, label: "Output" },
                  { id: "verdict" as const, label: "Verdict" },
                ].map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => setConsoleTab(id)}
                    className={cn(
                      "px-3 py-2.5 text-xs font-medium border-b-2 -mb-px transition-all",
                      consoleTab === id
                        ? "border-[#4edea3] text-[#4edea3]"
                        : "border-transparent text-[#86948a] hover:text-[#e5e1e4]"
                    )}
                  >
                    {label}
                    {id === "output" && isRunning && (
                      <span className="ml-1.5 inline-flex h-1.5 w-1.5 rounded-full bg-[#4edea3] animate-pulse" />
                    )}
                    {id === "verdict" && isSubmitting && (
                      <span className="ml-1.5 inline-flex h-1.5 w-1.5 rounded-full bg-[#4edea3] animate-pulse" />
                    )}
                  </button>
                ))}
              </div>

              {/* Console body */}
              <div className="min-h-0 flex-1 overflow-hidden">
                {consoleTab === "input" && (
                  <div className="h-full flex flex-col p-3 gap-2">
                    <label className="text-[10px] uppercase tracking-widest text-[#86948a] font-mono">Standard Input</label>
                    <textarea
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      disabled={!isAuthenticated}
                      className="flex-1 bg-[#201f22] border border-[#3c4a42] rounded-lg p-3 resize-none font-mono text-xs text-[#e5e1e4] placeholder:text-[#3c4a42] focus:outline-none focus:border-[#4edea3]/40 transition-colors"
                      placeholder="Enter custom input here…"
                    />
                  </div>
                )}
                {consoleTab === "output" && <OutputPanel isRunning={isRunning} result={runResult} />}
                {consoleTab === "verdict" && <VerdictPanel isSubmitting={isSubmitting} result={submitResult} />}
              </div>
            </Panel>
          </PanelGroup>
          {!isAuthenticated && <AuthGateOverlay />}
        </Panel>
      </PanelGroup>
    </div>
  );
}
