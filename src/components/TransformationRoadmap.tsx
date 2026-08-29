import React, { useState } from 'react';
import { 
  CalendarCheck, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Copy, 
  Check, 
  ShieldAlert, 
  UserCheck, 
  FileCode, 
  Pin, 
  GitBranch, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface TransformationRoadmapProps {
  onNavigateTab: (tabId: string) => void;
}

export const TransformationRoadmap: React.FC<TransformationRoadmapProps> = ({
  onNavigateTab,
}) => {
  const [completedDays, setCompletedDays] = useState<number[]>([1]);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const toggleDay = (dayNum: number) => {
    setCompletedDays((prev) =>
      prev.includes(dayNum) ? prev.filter((d) => d !== dayNum) : [...prev, dayNum]
    );
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const days = [
    {
      day: 1,
      title: 'Day 1: Emergency Red Flag Sanitize & Delete',
      tag: 'Critical • 15 Mins',
      tagColor: 'bg-red-500/20 text-red-400 border border-red-500/30',
      icon: ShieldAlert,
      goal: 'Remove any offensive or amateur repositories that instantly disqualify you from job screenings.',
      actionItems: [
        {
          text: 'Delete repository "ai-content-moderation-68" containing the offensive description "all hail hitrel".',
          detail: 'Go to GitHub Repo > Settings > Danger Zone > Delete.',
        },
        {
          text: 'Privatize or delete duplicate zip scratchpad repos like "ai-content-moderation-zip".',
          detail: 'Never keep raw .zip dumps or numbered copies public.',
        },
        {
          text: 'Review remaining 31 repositories and set test/tutorial code to Private.',
          detail: 'Keep only your best 6-10 repositories public.',
        },
      ],
      tabTarget: 'hygiene',
    },
    {
      day: 2,
      title: 'Day 2: Professional Identity & 160-Char Bio',
      tag: 'High • 10 Mins',
      tagColor: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
      icon: UserCheck,
      goal: 'Replace the default blocky identicon and empty bio with real developer credentials.',
      actionItems: [
        {
          text: 'Upload a high-resolution professional headshot or clean stylized avatar.',
          detail: 'Profiles with human avatars get 4x more outreach.',
        },
        {
          text: 'Set your Display Name (e.g. "Eddard Stark") and location.',
          detail: 'Keep your username or fix spelling in profile settings.',
        },
        {
          text: 'Add your 160-character bio generated in Bio Studio.',
          detail: 'Example: "Full-Stack & AI Engineer | React • TypeScript • Python • Cloud"',
        },
        {
          text: 'Add your LinkedIn profile URL and active contact email.',
          detail: 'Crucial for hiring managers who want to reach out directly.',
        },
      ],
      tabTarget: 'bio',
    },
    {
      day: 3,
      title: 'Day 3: Launch Special Profile README.md',
      tag: 'High • 20 Mins',
      tagColor: 'bg-[#58a6ff]/20 text-[#58a6ff] border border-[#388bfd]/30',
      icon: FileCode,
      goal: 'Create your GitHub front-page resume using our interactive builder.',
      actionItems: [
        {
          text: 'Create a new public repository matching your exact username.',
          detail: 'Example: https://github.com/new with repo name = your-username.',
        },
        {
          text: 'Check "Add a README file" during creation.',
          detail: 'GitHub will show the secret ✨ special repository banner.',
        },
        {
          text: 'Copy the Markdown from our Profile README Architect and commit it.',
          detail: 'Includes dynamic stats, tech badges, and typing banner.',
        },
      ],
      tabTarget: 'readme',
    },
    {
      day: 4,
      title: 'Day 4: Polish Showcase Project #1 (HabitFlow-v2)',
      tag: 'Medium • 30 Mins',
      tagColor: 'bg-[#3fb950]/20 text-[#3fb950] border border-[#238636]/30',
      icon: Sparkles,
      goal: 'Turn HabitFlow into an irresistible centerpiece project with a live URL and clean README.',
      actionItems: [
        {
          text: 'Deploy the frontend to Vercel, Netlify, or GitHub Pages (Free).',
          detail: 'A working live demo URL increases project inspection by 80%.',
        },
        {
          text: 'Add a 1-sentence description & demo URL in the GitHub repo "About" sidebar.',
          detail: 'Description: "⚡ Gamified habit tracker with real-time streak analytics"',
        },
        {
          text: 'Add topic tags: #react #typescript #tailwindcss #productivity #habit-tracker.',
          detail: 'Helps search discoverability on GitHub explore.',
        },
        {
          text: 'Paste the generated Repo README with installation guide and key features.',
          detail: 'Use our Repo Hygiene generator for the markdown.',
        },
      ],
      tabTarget: 'hygiene',
    },
    {
      day: 5,
      title: 'Day 5: Polish Showcase Project #2 (AI Content Moderation)',
      tag: 'Medium • 30 Mins',
      tagColor: 'bg-[#3fb950]/20 text-[#3fb950] border border-[#238636]/30',
      icon: GitBranch,
      goal: 'Position your AI/ML expertise with a production-grade backend engine.',
      actionItems: [
        {
          text: 'Sanitize codebase and ensure clean modular files (no dumped zip code).',
          detail: 'Add a clear requirements.txt or package.json.',
        },
        {
          text: 'Add an architecture overview explaining how text & images are filtered.',
          detail: 'Recruiters love seeing system design thinking.',
        },
        {
          text: 'Add automated tests or CI workflow badge via GitHub Actions.',
          detail: 'Demonstrates professional software engineering standards.',
        },
      ],
      tabTarget: 'hygiene',
    },
    {
      day: 6,
      title: 'Day 6: Hand-Pick 4-6 Curated Pinned Repositories',
      tag: 'Quick • 10 Mins',
      tagColor: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
      icon: Pin,
      goal: 'Control exactly what recruiters see first instead of default unorganized uploads.',
      actionItems: [
        {
          text: 'Click "Customize your pins" on your GitHub overview page.',
          detail: 'Select your 4-6 best polished repositories.',
        },
        {
          text: 'Ensure all 4 pins have distinct tech stacks (e.g. 1 Full-Stack, 1 AI/ML, 1 Tool, 1 Mobile/UI).',
          detail: 'Demonstrates versatility and technical range.',
        },
        {
          text: 'Verify each pinned repo has at least 1-2 stars (ask dev friends to star!).',
          detail: 'Social proof significantly boosts credibility.',
        },
      ],
      tabTarget: 'comparison',
    },
    {
      day: 7,
      title: 'Day 7: Establish Green Streak & Contribution Strategy',
      tag: 'Ongoing Habit',
      tagColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
      icon: CalendarCheck,
      goal: 'Maintain an active, consistent contribution heatmap to signal high momentum.',
      actionItems: [
        {
          text: 'Commit 3-5 times per week with descriptive commit messages.',
          detail: 'Avoid commit messages like "fix" or "update" - use "feat: add user auth" or "refactor: optimize query".',
        },
        {
          text: 'Enable "Include private contributions in my profile" in GitHub Contribution settings.',
          detail: 'Counts your work on private repos toward your green graph.',
        },
        {
          text: 'Contribute a small documentation fix or bug patch to a popular open-source repo.',
          detail: 'Earns you the "Pull Shark" and "Open Sourcerer" GitHub profile badges!',
        },
      ],
      tabTarget: 'audit',
    },
  ];

  const completedCount = completedDays.length;
  const progressPercent = Math.round((completedCount / days.length) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <CalendarCheck className="w-5 h-5 text-[#3fb950]" />
              <span>7-Day Profile Transformation Roadmap</span>
            </h2>
            <p className="text-xs text-[#8b949e] leading-relaxed">
              Follow this step-by-step master checklist to fix all red flags, polish your repository hygiene, and transform your profile into a top 1% recruiter showcase.
            </p>
          </div>

          <div className="flex items-center space-x-4 bg-[#0d1117] px-4 py-3 rounded-xl border border-[#30363d] self-start sm:self-auto">
            <div>
              <p className="text-[11px] text-[#8b949e]">Progress</p>
              <p className="text-lg font-bold text-[#3fb950]">{completedCount} of 7 Days</p>
            </div>
            <div className="w-16 h-2 bg-[#21262d] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#2ea043] transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Days Timeline */}
      <div className="space-y-4">
        {days.map((item) => {
          const isDone = completedDays.includes(item.day);
          const Icon = item.icon;

          return (
            <div
              key={item.day}
              className={`bg-[#161b22] border rounded-xl p-5 transition-all ${
                isDone ? 'border-[#238636]/40 bg-[#0d1117]/90' : 'border-[#30363d]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#21262d]">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => toggleDay(item.day)}
                    className="focus:outline-none"
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-6 h-6 text-[#3fb950] transition-transform hover:scale-110" />
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-[#8b949e] hover:border-white transition-colors" />
                    )}
                  </button>

                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className={`text-sm font-bold ${isDone ? 'line-through text-[#8b949e]' : 'text-white'}`}>
                        {item.title}
                      </h3>
                      <span className={`text-[10px] px-2 py-0.2 rounded-full font-semibold ${item.tagColor}`}>
                        {item.tag}
                      </span>
                    </div>
                    <p className="text-xs text-[#8b949e] mt-0.5">{item.goal}</p>
                  </div>
                </div>

                <button
                  onClick={() => onNavigateTab(item.tabTarget)}
                  className="px-3 py-1 text-xs font-semibold rounded-lg bg-[#21262d] hover:bg-[#30363d] text-[#58a6ff] border border-[#30363d] flex items-center space-x-1.5 self-end sm:self-auto transition-all"
                >
                  <span>Use Tool</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Action items list */}
              <div className="mt-4 space-y-2.5">
                {item.actionItems.map((action, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#0d1117] rounded-lg border border-[#21262d] flex items-start space-x-3 text-xs"
                  >
                    <span className="w-5 h-5 rounded-full bg-[#161b22] text-[#8b949e] flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div className="space-y-0.5">
                      <p className="font-semibold text-[#c9d1d9]">{action.text}</p>
                      <p className="text-[11px] text-[#8b949e] leading-relaxed">{action.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
