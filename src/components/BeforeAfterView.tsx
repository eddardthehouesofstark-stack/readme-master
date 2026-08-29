import React, { useState } from 'react';
import { 
  Columns, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Star, 
  GitFork, 
  ExternalLink,
  ShieldCheck,
  Flame,
  ArrowRight
} from 'lucide-react';
import { ProfileData } from '../types';

interface BeforeAfterViewProps {
  profileData: ProfileData;
  onNavigateTab: (tabId: string) => void;
}

export const BeforeAfterView: React.FC<BeforeAfterViewProps> = ({
  profileData,
  onNavigateTab,
}) => {
  const [activeMode, setActiveMode] = useState<'split' | 'before' | 'after'>('split');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <Columns className="w-5 h-5 text-[#58a6ff]" />
            <span>Interactive Profile Transformation: Before vs. After</span>
          </h2>
          <p className="text-xs text-[#8b949e] mt-1">
            See the exact visual difference between your current screenshot profile and the recruiter-ready 10/10 standard.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center space-x-1.5 bg-[#0d1117] p-1 rounded-lg border border-[#30363d] self-start sm:self-auto">
          <button
            onClick={() => setActiveMode('split')}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
              activeMode === 'split' ? 'bg-[#21262d] text-white shadow-sm' : 'text-[#8b949e] hover:text-white'
            }`}
          >
            Side-by-Side Split
          </button>
          <button
            onClick={() => setActiveMode('before')}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
              activeMode === 'before' ? 'bg-[#21262d] text-red-400 shadow-sm' : 'text-[#8b949e] hover:text-white'
            }`}
          >
            Original (Before)
          </button>
          <button
            onClick={() => setActiveMode('after')}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
              activeMode === 'after' ? 'bg-[#21262d] text-[#3fb950] shadow-sm' : 'text-[#8b949e] hover:text-white'
            }`}
          >
            Optimized (After)
          </button>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className={`grid gap-6 ${activeMode === 'split' ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1'}`}>
        {/* BEFORE: Current Profile State */}
        {(activeMode === 'split' || activeMode === 'before') && (
          <div className="bg-[#0d1117] border-2 border-red-500/40 rounded-2xl p-6 relative space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-red-500/30">
              <div className="flex items-center space-x-2">
                <span className="p-1.5 rounded-lg bg-red-500/20 text-red-400">
                  <AlertTriangle className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-white">Before: Initial Screenshot Profile</h3>
                  <p className="text-[11px] text-red-400">Score: 35/100 • Critical Red Flags Present</p>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded bg-red-500/20 text-red-400 border border-red-500/40">
                Unpolished
              </span>
            </div>

            {/* Mock GitHub Profile Header (Before) */}
            <div className="flex flex-col sm:flex-row gap-5">
              {/* Left Identicon */}
              <div className="space-y-3 flex-shrink-0">
                <div className="w-36 h-36 rounded-full bg-[#161b22] border-2 border-red-500/40 flex items-center justify-center p-3">
                  {/* Geometric block Identicon representation */}
                  <div className="w-full h-full bg-[#5bb0c4] grid grid-cols-3 gap-1 p-2 rounded-xl opacity-90">
                    <div className="bg-[#0d1117]" />
                    <div className="bg-[#5bb0c4]" />
                    <div className="bg-[#0d1117]" />
                    <div className="bg-[#5bb0c4]" />
                    <div className="bg-[#0d1117]" />
                    <div className="bg-[#5bb0c4]" />
                    <div className="bg-[#5bb0c4]" />
                    <div className="bg-[#5bb0c4]" />
                    <div className="bg-[#5bb0c4]" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold font-mono text-white">eddardthehouesofstark-stack</p>
                  <p className="text-xs text-red-400 mt-0.5">⚠️ Typo in handle ("houes"), no real name</p>
                </div>
                <button className="w-full py-1 text-xs bg-[#21262d] text-[#8b949e] border border-[#30363d] rounded-lg">
                  Edit profile
                </button>
              </div>

              {/* Repositories section (Before) */}
              <div className="space-y-3 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#8b949e]">Popular repositories</span>
                  <span className="text-[11px] text-[#58a6ff]">Customize your pins</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="p-3 bg-[#161b22] border border-[#30363d] rounded-lg">
                    <p className="text-xs font-mono font-bold text-[#58a6ff]">habitflow-v2</p>
                    <p className="text-[10px] text-[#8b949e] mt-1">No description provided</p>
                    <div className="flex items-center space-x-3 mt-3 text-[10px] text-[#8b949e]">
                      <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-[#e34c26] mr-1" /> HTML</span>
                      <span className="flex items-center"><Star className="w-3 h-3 mr-0.5 text-yellow-400" /> 1</span>
                    </div>
                  </div>

                  <div className="p-3 bg-red-950/20 border-2 border-red-500/50 rounded-lg relative">
                    <p className="text-xs font-mono font-bold text-red-300">ai-content-moderation-68</p>
                    <p className="text-[10px] text-red-400 font-bold mt-1 bg-red-900/40 px-1 py-0.5 rounded">
                      "all hail hitrel"
                    </p>
                    <span className="text-[9px] text-red-400 block mt-2 font-semibold">
                      🚨 Instant disqualifier for jobs
                    </span>
                  </div>

                  <div className="p-3 bg-yellow-950/20 border border-yellow-500/40 rounded-lg">
                    <p className="text-xs font-mono font-bold text-yellow-300">ai-content-moderation-zip</p>
                    <p className="text-[10px] text-[#8b949e] mt-1">No description</p>
                    <span className="text-[9px] text-yellow-400 block mt-2">
                      ⚠️ Suffix "-zip" looks like raw dump
                    </span>
                  </div>

                  <div className="p-3 bg-[#161b22] border border-[#30363d] rounded-lg">
                    <p className="text-xs font-mono font-bold text-[#58a6ff]">ai-cop</p>
                    <p className="text-[10px] text-[#8b949e] mt-1">No description provided</p>
                  </div>
                </div>

                {/* Missing Profile README warning */}
                <div className="p-3 bg-red-950/20 border border-red-500/30 rounded-lg text-xs text-red-300">
                  <p className="font-bold">❌ Missing Profile README</p>
                  <p className="text-[11px] text-[#8b949e] mt-0.5">Recruiters see a blank hero area with no pitch, no tech stack badges, and no live links.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AFTER: 10/10 Gold Standard Profile */}
        {(activeMode === 'split' || activeMode === 'after') && (
          <div className="bg-[#0d1117] border-2 border-[#238636] rounded-2xl p-6 relative space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#238636]/30">
              <div className="flex items-center space-x-2">
                <span className="p-1.5 rounded-lg bg-[#238636]/20 text-[#3fb950]">
                  <ShieldCheck className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-white">After: Recruiter-Approved 10/10 Profile</h3>
                  <p className="text-[11px] text-[#3fb950]">Score: 100/100 • High-Impact Developer Brand</p>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded bg-[#238636]/20 text-[#3fb950] border border-[#238636]/40">
                Gold Standard
              </span>
            </div>

            {/* Mock GitHub Profile Header (After) */}
            <div className="flex flex-col sm:flex-row gap-5">
              {/* Left Profile Sidebar */}
              <div className="space-y-3 flex-shrink-0 sm:w-44">
                <img
                  src={profileData.avatarUrl}
                  alt="Professional Avatar"
                  className="w-36 h-36 rounded-full border-2 border-[#3fb950] object-cover shadow-lg"
                />
                <div>
                  <p className="text-base font-bold text-white">{profileData.displayName || 'Eddard Stark'}</p>
                  <p className="text-xs font-mono text-[#8b949e]">{profileData.username}</p>
                </div>
                <p className="text-xs text-[#c9d1d9] leading-snug">
                  {profileData.bio}
                </p>
                <div className="space-y-1 text-[11px] text-[#8b949e]">
                  {profileData.location && <p className="text-white">📍 {profileData.location}</p>}
                  {profileData.linkedin && (
                    <p className="text-[#58a6ff] truncate">
                      🔗 <span className="underline">LinkedIn</span>
                    </p>
                  )}
                  {profileData.website && (
                    <p className="text-[#3fb950] truncate">
                      🌐 <span className="underline">{profileData.website.replace(/^https?:\/\//, '')}</span>
                    </p>
                  )}
                  {profileData.instagram && (
                    <p className="text-pink-400 truncate">
                      📸 <span className="underline">{profileData.instagram.replace(/^https?:\/\/(www\.)?instagram\.com\//, '@')}</span>
                    </p>
                  )}
                  {profileData.email && (
                    <p className="text-white/80 truncate">
                      ✉️ {profileData.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Right Content: Special README + Curated Showcase Pins */}
              <div className="space-y-4 flex-1">
                {/* Special Profile README Banner Box */}
                <div className="p-4 bg-[#161b22] border border-[#388bfd]/40 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#58a6ff]" />
                      <span>{profileData.username} / README.md</span>
                    </span>
                    <span className="text-[10px] bg-[#388bfd]/20 text-[#58a6ff] px-2 py-0.5 rounded font-bold">
                      Special Repo
                    </span>
                  </div>

                  <div className="text-center py-2 bg-[#0d1117] rounded-lg border border-[#21262d]">
                    <span className="text-sm font-bold font-mono text-[#58a6ff]">
                      Hi there, I'm {profileData.displayName} 👋
                    </span>
                    <p className="text-[11px] text-[#8b949e] mt-0.5">{profileData.headline}</p>
                  </div>

                  {/* Tech stack badge preview */}
                  <div className="flex flex-wrap gap-1">
                    {profileData.selectedTech.slice(0, 7).map((tech) => (
                      <span key={tech} className="px-2 py-0.5 bg-[#21262d] text-white text-[10px] font-mono rounded">
                        {tech}
                      </span>
                    ))}
                    <span className="text-[10px] text-[#8b949e] px-1">+4 more</span>
                  </div>
                </div>

                {/* Curated Pinned Repositories */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-white">Curated Showcase Projects</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {profileData.pinnedProjects.slice(0, 4).map((proj, i) => (
                      <div key={i} className="p-3 bg-[#161b22] border border-[#30363d] rounded-lg hover:border-[#58a6ff] transition-all">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-mono font-bold text-[#58a6ff]">{proj.name}</p>
                          {proj.demoUrl && (
                            <span className="text-[10px] text-[#3fb950] font-semibold flex items-center">
                              Live Demo <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-[#8b949e] mt-1 line-clamp-2 leading-relaxed">
                          {proj.description}
                        </p>
                        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-[#21262d] text-[10px]">
                          <span className="text-[#c9d1d9] font-mono">{proj.tech.split(',')[0]}</span>
                          <span className="flex items-center text-yellow-400"><Star className="w-3 h-3 mr-0.5" /> Starred</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CTA banner */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-white">Ready to deploy your new profile?</h4>
          <p className="text-xs text-[#8b949e]">Generate your README markdown and complete the 7-day checklist.</p>
        </div>
        <button
          onClick={() => onNavigateTab('readme')}
          className="px-4 py-2 bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-bold rounded-lg flex items-center space-x-2 transition-all self-start sm:self-auto"
        >
          <span>Open README Builder</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
