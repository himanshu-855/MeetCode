import Link from "next/link";
import {
  Code2, Zap, Trophy, Target, ArrowRight,
  CheckCircle2, Users, Star, ChevronRight
} from "lucide-react";

const features = [
  {
    icon: Code2,
    title: "Monaco-Powered Editor",
    desc: "Write code in a full-featured VS Code-like environment with syntax highlighting, auto-completion, and more.",
    color: "emerald",
  },
  {
    icon: Zap,
    title: "Real-time Execution",
    desc: "Run your code instantly against multiple testcases using the Judge0 execution engine. See results in milliseconds.",
    color: "yellow",
  },
  {
    icon: Trophy,
    title: "Verdict System",
    desc: "Get instant feedback — Accepted, Wrong Answer, TLE, Runtime Error — with detailed output comparison.",
    color: "purple",
  },
  {
    icon: Target,
    title: "Hidden Testcases",
    desc: "Test your edge-case thinking. Solutions are validated against hidden testcases you never see.",
    color: "blue",
  },
];

const stats = [
  { value: "500+", label: "Problems" },
  { value: "50K+", label: "Submissions" },
  { value: "10K+", label: "Developers" },
  { value: "99.9%", label: "Uptime" },
];

const colorMap: Record<string, string> = {
  emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  yellow: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] overflow-hidden">
      {/* Grid background */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center min-h-[90vh] px-4 text-center">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-8">
            <Star className="h-3.5 w-3.5 fill-current" />
            The modern coding interview prep platform
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-tight">
            Code smarter,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
              interview better
            </span>
          </h1>

          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Practice hundreds of curated problems, get instant Judge0-powered feedback,
            and build the skills that get you hired at top tech companies.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/problems"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-base transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5"
            >
              Start Practicing Free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-base transition-all"
            >
              View Dashboard
            </Link>
          </div>
        </div>

        {/* Floating code preview */}
        <div className="relative z-10 mt-16 w-full max-w-3xl mx-auto rounded-2xl border border-white/10 bg-[#111116] shadow-2xl overflow-hidden">
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/5 bg-[#0d0d12]">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
            <span className="ml-3 text-xs text-zinc-500 font-mono">solution.cpp</span>
          </div>
          <pre className="p-6 text-sm font-mono text-left overflow-x-auto">
            <code>
              <span className="text-blue-400">#include</span>
              <span className="text-orange-300"> &lt;bits/stdc++.h&gt;</span>{"\n"}
              <span className="text-blue-400">using namespace</span>
              <span className="text-white"> std;</span>{"\n\n"}
              <span className="text-purple-400">int</span>
              <span className="text-yellow-300"> main</span>
              <span className="text-white">() {"{"}</span>{"\n"}
              <span className="text-white">    </span>
              <span className="text-purple-400">int</span>
              <span className="text-white"> n; cin &gt;&gt; n;</span>{"\n"}
              <span className="text-white">    vector&lt;</span>
              <span className="text-purple-400">int</span>
              <span className="text-white">&gt; arr(n);</span>{"\n"}
              <span className="text-white">    </span>
              <span className="text-blue-400">for</span>
              <span className="text-white">(</span>
              <span className="text-purple-400">auto</span>
              <span className="text-white">&amp; x : arr) cin &gt;&gt; x;</span>{"\n"}
              <span className="text-white">    cout &lt;&lt; *</span>
              <span className="text-yellow-300">max_element</span>
              <span className="text-white">(arr.</span>
              <span className="text-yellow-300">begin</span>
              <span className="text-white">(), arr.</span>
              <span className="text-yellow-300">end</span>
              <span className="text-white">());</span>{"\n"}
              <span className="text-blue-400">    return </span>
              <span className="text-orange-300">0</span>
              <span className="text-white">;</span>{"\n"}
              <span className="text-white">{"}"}</span>
            </code>
          </pre>
          <div className="flex items-center gap-3 px-6 py-3 border-t border-white/5 bg-[#0d0d12]">
            <span className="flex items-center gap-1.5 text-emerald-400 text-sm font-medium">
              <CheckCircle2 className="h-4 w-4" /> Accepted
            </span>
            <span className="text-zinc-500 text-xs">0.04s · 3.1MB · 4/4 testcases passed</span>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative py-16 border-y border-white/5">
        <div className="mx-auto max-w-screen-xl px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-1 text-center">
                <span className="text-3xl font-black text-white">{s.value}</span>
                <span className="text-sm text-zinc-400">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4">
        <div className="mx-auto max-w-screen-xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black mb-4">
              Everything you need to{" "}
              <span className="text-emerald-400">ace interviews</span>
            </h2>
            <p className="text-zinc-400 text-lg max-w-xl mx-auto">
              A complete platform built for serious competitive programmers and job seekers.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="group rounded-2xl border border-white/8 bg-white/3 p-6 hover:border-white/15 hover:bg-white/5 transition-all"
                >
                  <div className={`inline-flex p-2.5 rounded-xl border mb-4 ${colorMap[f.color]}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="mx-auto max-w-screen-xl">
          <div className="relative rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 p-12 text-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.08),transparent_70%)] pointer-events-none" />
            <div className="relative z-10">
              <div className="flex justify-center mb-4">
                <Users className="h-8 w-8 text-emerald-400" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-black mb-4">
                Join thousands of developers
              </h2>
              <p className="text-zinc-400 text-lg mb-8 max-w-lg mx-auto">
                Start solving problems today and fast-track your path to your dream job.
              </p>
              <Link
                href="/problems"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-base transition-all shadow-lg shadow-emerald-500/25"
              >
                Browse Problems
                <ChevronRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="h-6 w-6 rounded bg-emerald-500 flex items-center justify-center">
            <Code2 className="h-3.5 w-3.5 text-black" />
          </div>
          <span className="font-bold">Meet<span className="text-emerald-400">Code</span></span>
        </div>
        <p className="text-xs text-zinc-600">© 2025 MeetCode. Built for developers, by developers.</p>
      </footer>
    </div>
  );
}
