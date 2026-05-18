import { Building2, Clock, ChevronRight, Star, Zap, Target, BookOpen } from "lucide-react";
import Link from "next/link";

const TRACKS = [
  {
    name: "FAANG Roadmap",
    subtitle: "Premium Track",
    description: "Google, Amazon, Meta, Apple, Netflix. Advanced DSA, System Design, and behavioral prep for top-tier product companies.",
    tags: ["Advanced DSA", "System Design", "HLD/LLD"],
    solved: 45, total: 180, hours: 120,
    difficulty: "Hard",
    diffColor: "text-[#ffb4ab] bg-[#ffb4ab]/10 border-[#ffb4ab]/25",
    featured: true,
    icon: "🚀",
  },
  {
    name: "TCS NQT Preparation",
    subtitle: "TCS • National Qualifier",
    description: "Complete prep for TCS National Qualifier Test. Strings, Quantitative, and Coding sections covered.",
    tags: ["Strings", "Quantitative", "Coding"],
    solved: 12, total: 45, hours: 18,
    difficulty: "Easy",
    diffColor: "text-[#4edea3] bg-[#4edea3]/10 border-[#4edea3]/25",
    featured: false,
    icon: "T",
  },
  {
    name: "Infosys Power Programmer",
    subtitle: "Infosys • SP / PP Role",
    description: "Target the Infosys Specialist Programmer role. Focus on Trees, Graphs, and DBMS concepts.",
    tags: ["Trees", "Graphs", "DBMS"],
    solved: 0, total: 32, hours: 40,
    difficulty: "Medium",
    diffColor: "text-[#ffb95f] bg-[#ffb95f]/10 border-[#ffb95f]/25",
    featured: false,
    icon: "I",
  },
  {
    name: "Wipro Elite NLTH",
    subtitle: "Wipro • Next Level Talent Hunt",
    description: "Structured prep for Wipro NLTH. Strong aptitude, logical reasoning, and 2 coding challenges.",
    tags: ["Aptitude", "Logical", "Coding"],
    solved: 28, total: 30, hours: 12,
    difficulty: "Easy",
    diffColor: "text-[#4edea3] bg-[#4edea3]/10 border-[#4edea3]/25",
    featured: false,
    icon: "W",
  },
  {
    name: "Capgemini Excellence",
    subtitle: "Capgemini • Exceller Program",
    description: "Pseudo-code analysis, game-based tech assessments, and 3-problem coding rounds.",
    tags: ["Pseudo Code", "Game Based", "Aptitude"],
    solved: 5, total: 25, hours: 22,
    difficulty: "Medium",
    diffColor: "text-[#ffb95f] bg-[#ffb95f]/10 border-[#ffb95f]/25",
    featured: false,
    icon: "C",
  },
  {
    name: "Cognizant GenC Pro",
    subtitle: "Cognizant • GenC / GenC Pro",
    description: "GenC Next and GenC Pro specific prep. Verbal ability, reasoning, and 2-3 coding problems.",
    tags: ["Verbal", "Reasoning", "Coding"],
    solved: 9, total: 38, hours: 35,
    difficulty: "Easy",
    diffColor: "text-[#4edea3] bg-[#4edea3]/10 border-[#4edea3]/25",
    featured: false,
    icon: "G",
  },
];

const STATS = [
  { value: "2.4k+", label: "Students Prepared", icon: Star },
  { value: "500+", label: "Company Problems", icon: BookOpen },
  { value: "6", label: "Company Tracks", icon: Target },
  { value: "95%", label: "Placement Rate", icon: Zap },
];

export default function CompaniesPage() {
  const featured = TRACKS.find(t => t.featured)!;
  const others = TRACKS.filter(t => !t.featured);

  return (
    <div className="min-h-screen bg-[#131315]">
      <div className="mx-auto max-w-screen-xl px-6 py-10">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-[#4edea3] text-xs font-mono uppercase tracking-widest mb-3">
            <Building2 className="h-3.5 w-3.5" />
            Company Tracks
          </div>
          <h1 className="text-2xl font-bold text-[#e5e1e4] tracking-tight mb-2">Interview Prep by Company</h1>
          <p className="text-sm text-[#86948a] max-w-xl leading-relaxed">
            Master technical interviews with curated preparation sheets for top product and service-based companies.
            Follow structured roadmaps designed to ace your next placement.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-10">

          {/* Featured — FAANG */}
          <div className="md:col-span-8 rounded-xl border border-[#3c4a42] bg-[#201f22] p-7 flex flex-col justify-between min-h-[360px] relative overflow-hidden group hover:border-[#86948a] transition-colors">
            {/* Background icon */}
            <div className="absolute top-6 right-6 text-7xl opacity-[0.06] group-hover:opacity-[0.1] transition-opacity select-none">
              {featured.icon}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-mono uppercase tracking-widest text-[#4edea3]">{featured.subtitle}</span>
              </div>
              <h2 className="text-xl font-bold text-[#e5e1e4] mb-3">{featured.name}</h2>
              <p className="text-sm text-[#86948a] leading-relaxed max-w-md mb-5">{featured.description}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {featured.tags.map(t => (
                  <span key={t} className="px-2.5 py-1 rounded-full bg-[#ffb95f]/10 border border-[#ffb95f]/20 text-xs font-mono text-[#ffb95f]">{t}</span>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-xs font-mono text-[#86948a]">
                <span>{featured.solved} / {featured.total} Problems Solved</span>
                <span className="text-[#4edea3]">{Math.round(featured.solved / featured.total * 100)}% Complete</span>
              </div>
              <div className="h-1.5 bg-[#131315] rounded-full overflow-hidden">
                <div className="h-full bg-[#4edea3] rounded-full" style={{ width: `${featured.solved / featured.total * 100}%` }} />
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono text-[#86948a]">
                <Clock className="h-3 w-3" />
                ~{featured.hours} hours remaining
              </div>
            </div>
          </div>

          {/* TCS — side card */}
          <div className="md:col-span-4 rounded-xl border border-[#3c4a42] bg-[#201f22] p-5 flex flex-col justify-between hover:border-[#86948a] transition-colors group">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-11 h-11 rounded-lg bg-[#131315] border border-[#3c4a42] flex items-center justify-center text-lg font-black text-[#4edea3]">
                  {others[0].icon}
                </div>
                <span className={`px-2 py-0.5 rounded-md text-xs font-mono border ${others[0].diffColor}`}>{others[0].difficulty}</span>
              </div>
              <div className="text-[10px] font-mono text-[#86948a] mb-1">{others[0].subtitle}</div>
              <h3 className="text-base font-bold text-[#e5e1e4] mb-2">{others[0].name}</h3>
              <div className="flex flex-wrap gap-1 mb-4">
                {others[0].tags.map(t => (
                  <span key={t} className="text-[10px] font-mono px-1.5 py-0.5 bg-[#131315] border border-[#3c4a42] rounded text-[#86948a]">{t}</span>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-mono text-[#86948a]">
                <span>{others[0].solved}/{others[0].total} solved</span>
                <span>{others[0].hours}h total</span>
              </div>
              <div className="h-1 bg-[#131315] rounded-full overflow-hidden">
                <div className="h-full bg-[#4edea3] rounded-full" style={{ width: `${others[0].solved / others[0].total * 100}%` }} />
              </div>
              <button className="w-full py-2 rounded-lg border border-[#3c4a42] hover:bg-[#2a2a2c] text-xs font-mono text-[#e5e1e4] transition-colors">
                Resume Track
              </button>
            </div>
          </div>

          {/* Remaining cards */}
          {others.slice(1).map(track => (
            <div key={track.name} className="md:col-span-4 rounded-xl border border-[#3c4a42] bg-[#201f22] p-5 flex flex-col justify-between hover:border-[#86948a] transition-colors group">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-11 h-11 rounded-lg bg-[#131315] border border-[#3c4a42] flex items-center justify-center text-lg font-black text-[#adc6ff]">
                    {track.icon}
                  </div>
                  <span className={`px-2 py-0.5 rounded-md text-xs font-mono border ${track.diffColor}`}>{track.difficulty}</span>
                </div>
                <div className="text-[10px] font-mono text-[#86948a] mb-1">{track.subtitle}</div>
                <h3 className="text-base font-bold text-[#e5e1e4] mb-2">{track.name}</h3>
                <div className="flex flex-wrap gap-1 mb-4">
                  {track.tags.map(t => (
                    <span key={t} className="text-[10px] font-mono px-1.5 py-0.5 bg-[#131315] border border-[#3c4a42] rounded text-[#86948a]">{t}</span>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-mono text-[#86948a]">
                  <span>{track.solved}/{track.total} solved</span>
                  <span>{track.hours}h total</span>
                </div>
                <div className="h-1 bg-[#131315] rounded-full overflow-hidden">
                  <div className="h-full bg-[#4edea3] rounded-full" style={{ width: `${(track.solved / track.total) * 100}%` }} />
                </div>
                <button className={`w-full py-2 rounded-lg text-xs font-mono transition-colors ${track.solved === 0 ? "bg-[#4edea3] text-[#003824] font-bold hover:bg-[#6ffbbe]" : "border border-[#3c4a42] hover:bg-[#2a2a2c] text-[#e5e1e4]"}`}>
                  {track.solved === 0 ? "Start Track" : track.solved >= track.total ? "Review Sheet" : "Resume Track"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Stats strip */}
        <div className="rounded-xl border border-[#3c4a42] bg-[#201f22] p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-8">
            <div className="flex-1">
              <h2 className="text-base font-bold text-[#e5e1e4] mb-2">Master Your Placement Prep</h2>
              <p className="text-sm text-[#86948a] leading-relaxed mb-4 max-w-lg">
                Our platform tracks your progress across sheets to identify weak areas.
                Start a company track today and gain a competitive edge in placements.
              </p>
              <Link href="/problems" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#4edea3] text-[#003824] text-sm font-bold hover:bg-[#6ffbbe] transition-colors">
                <BookOpen className="h-3.5 w-3.5" />
                Browse Problems
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {STATS.map(s => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="text-center">
                    <div className="flex justify-center mb-1">
                      <Icon className="h-4 w-4 text-[#4edea3]" />
                    </div>
                    <div className="text-xl font-black text-[#e5e1e4]">{s.value}</div>
                    <div className="text-[10px] font-mono text-[#86948a] uppercase tracking-wider mt-0.5">{s.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
