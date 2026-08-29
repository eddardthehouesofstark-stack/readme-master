import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  ArrowRight, 
  ShieldAlert, 
  User, 
  FileText, 
  Pin, 
  GitCommit,
  ExternalLink,
  Flame,
  Info,
  RefreshCw,
  Search,
  Code2,
  GitBranch,
  Star,
  CheckCircle,
  Clock,
  Share2,
  Copy,
  Check
} from 'lucide-react';
import { AuditCategory } from '../types';
import { fetchLiveGitHubAnalysis, LiveProfileAnalysis } from '../services/githubService';

interface ProfileAuditViewProps {
  categories: AuditCategory[];
  onToggleIssue: (categoryId: string, issueId: string) => void;
  onNavigateTab: (tabId: string) => void;
  overallScore: number;
  currentUsername: string;
  liveData: LiveProfileAnalysis | null;
  isLoading: boolean;
  liveError: string | null;
  onSearchUser: (username: string) => void;
}

export const ProfileAuditView: React.FC<ProfileAuditViewProps> = ({
  categories,
  onToggleIssue,
  onNavigateTab,
  overallScore,
  currentUsername,
  liveData,
  isLoading,
  liveError,
  onSearchUser,
}) => {
  const [usernameInput, setUsernameInput] = useState(currentUsername);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    setUsernameInput(currentUsername);
  }, [currentUsername]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput.trim()) {
      onSearchUser(usernameInput.trim());
    }
  };

  const handleCopyShareLink = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('user', currentUsername);
    navigator.clipboard.writeText(url.toString());
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const popularDemoHandles = [
    { handle: 'torvalds', label: 'Linus Torvalds' },
    { handle: 'shadcn', label: 'Shadcn' },
    { handle: 'gaearon', label: 'Dan Abramov' },
    { handle: 'antfu', label: 'Anthony Fu' },
    { handle: 'yyx990803', label: 'Evan You' },
  ];

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'AlertTriangle': return AlertTriangle;
      case 'UserCheck': return User;
      case 'FileText': return FileText;
      case 'Pin': return Pin;
      case 'GitCommit': return GitCommit;
      default: return Info;
    }
  };

  return (
    <div className="space-y-6">
      {/* Live GitHub Real-Time Analysis Bar & ID Search */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="relative">
              <img
                src={liveData?.profile.avatar_url || 'https://avatars.githubusercontent.com/u/267705357?v=4'}
                alt="GitHub Avatar"
                className="w-12 h-12 rounded-full border border-[#30363d] object-cover shadow"
              />
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#3fb950] border-2 border-[#161b22] rounded-full" />
            </div>
            <div>
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <span className="text-base font-bold text-white">
                  {liveData?.profile.name || liveData?.profile.login || currentUsername}
                </span>
                <span className="text-xs text-[#8b949e] font-mono">@{liveData?.profile.login || currentUsername}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#238636]/20 text-[#3fb950] border border-[#238636]/30">
                  LIVE GITHUB SYNC
                </span>
              </div>
              <p className="text-xs text-[#8b949e] mt-1">
                {liveData
                  ? `${liveData.profile.public_repos} Public Repos • ${liveData.totalStars} Stars • Joined ${new Date(liveData.profile.created_at).toLocaleDateString()}`
                  : 'Connecting to GitHub REST API...'}
              </p>
            </div>
          </div>

          {/* Search ID Form & Share Link */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <form onSubmit={handleSearch} className="flex items-center space-x-2 flex-1">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-3.5 h-3.5 text-[#8b949e] absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="Enter any GitHub username..."
                  className="w-full pl-8.5 pr-3 py-1.5 bg-[#0d1117] border border-[#30363d] rounded-lg text-xs text-white focus:outline-none focus:border-[#58a6ff]"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !usernameInput.trim()}
                className="px-3.5 py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-bold rounded-lg border border-[#238636] flex items-center space-x-1.5 transition-all disabled:opacity-50 flex-shrink-0"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>{isLoading ? 'Auditing...' : 'Audit ID'}</span>
              </button>
            </form>

            <button
              onClick={handleCopyShareLink}
              title="Copy shareable audit link with ?user= parameter"
              className="px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] text-xs font-semibold rounded-lg border border-[#30363d] flex items-center justify-center space-x-1.5 transition-all flex-shrink-0"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#3fb950]" />
                  <span className="text-[#3fb950] font-bold">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-[#58a6ff]" />
                  <span>Share Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Demo Chips */}
        <div className="pt-3 border-t border-[#21262d] flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-semibold text-[#8b949e]">Audit Any Profile:</span>
          {popularDemoHandles.map((item) => (
            <button
              key={item.handle}
              onClick={() => onSearchUser(item.handle)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                currentUsername.toLowerCase() === item.handle.toLowerCase()
                  ? 'bg-[#1f6feb] text-white font-bold shadow-sm'
                  : 'bg-[#0d1117] hover:bg-[#21262d] text-[#8b949e] hover:text-white border border-[#30363d]'
              }`}
            >
              @{item.handle}
            </button>
          ))}
        </div>
      </div>

      {liveError && (
        <div className="p-3.5 bg-red-950/40 border border-red-500/40 rounded-xl text-xs text-red-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span>⚠️ {liveError}</span>
          <button onClick={() => onSearchUser('eddardthehouesofstark-stack')} className="underline font-bold text-white hover:text-red-300">
            Load Default User (@eddardthehouesofstark-stack)
          </button>
        </div>
      )}

      {/* Real-time GitHub Analytics Cards */}
      {liveData && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-3.5 space-y-1">
            <p className="text-[11px] text-[#8b949e] flex items-center space-x-1">
              <Code2 className="w-3.5 h-3.5 text-[#58a6ff]" />
              <span>Public Repos</span>
            </p>
            <p className="text-xl font-bold text-white">{liveData.profile.public_repos}</p>
            <p className="text-[10px] text-[#8b949e]">Analyzed in real-time</p>
          </div>

          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-3.5 space-y-1">
            <p className="text-[11px] text-[#8b949e] flex items-center space-x-1">
              <Star className="w-3.5 h-3.5 text-[#e3b341]" />
              <span>Total Stars</span>
            </p>
            <p className="text-xl font-bold text-white">{liveData.totalStars}</p>
            <p className="text-[10px] text-[#8b949e]">Across all public repositories</p>
          </div>

          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-3.5 space-y-1">
            <p className="text-[11px] text-[#8b949e] flex items-center space-x-1">
              <GitBranch className="w-3.5 h-3.5 text-[#a371f7]" />
              <span>Top Language</span>
            </p>
            <p className="text-xl font-bold text-white">
              {liveData.languages[0]?.name || 'HTML / JS'}
            </p>
            <p className="text-[10px] text-[#8b949e]">
              {liveData.languages[0] ? `${liveData.languages[0].percentage}% of total code` : 'No language data'}
            </p>
          </div>

          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-3.5 space-y-1">
            <p className="text-[11px] text-[#8b949e] flex items-center space-x-1">
              <Flame className="w-3.5 h-3.5 text-[#f85149]" />
              <span>Recruiter Score</span>
            </p>
            <p className={`text-xl font-bold ${
              liveData.calculatedScore < 50 ? 'text-red-400' : liveData.calculatedScore < 75 ? 'text-yellow-400' : 'text-[#3fb950]'
            }`}>
              {liveData.calculatedScore}/100
            </p>
            <p className="text-[10px] text-[#8b949e]">Calculated from live flags</p>
          </div>
        </div>
      )}

      {/* Hero Breakdown Box */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-[#238636]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
              <Flame className="w-3.5 h-3.5" />
              <span>Live Diagnostic: @{liveData?.profile.login || 'eddardthehouesofstark-stack'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Profile Diagnostic & Recruiter Scorecard
            </h1>
            <p className="text-sm text-[#8b949e] leading-relaxed">
              We audited your GitHub profile in real-time against tech recruiter hiring standards. Fix the critical red flags below to transform your profile into a 10/10 portfolio.
            </p>
          </div>

          <div className="flex items-center space-x-6 bg-[#0d1117] p-5 rounded-xl border border-[#30363d] self-start lg:self-auto min-w-[260px] justify-between">
            <div>
              <p className="text-xs font-medium text-[#8b949e]">Current Profile Health</p>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className={`text-4xl font-extrabold ${
                  overallScore < 50 ? 'text-red-400' : overallScore < 75 ? 'text-yellow-400' : 'text-[#3fb950]'
                }`}>
                  {overallScore}
                </span>
                <span className="text-sm text-[#8b949e]">/ 100</span>
              </div>
              <p className="text-[11px] text-[#8b949e] mt-1">
                {overallScore < 50 ? '⚠️ High Risk - Fix Flags First' : overallScore < 80 ? '⚡ Good Foundation - Needs Polish' : '🌟 Recruiter Approved (10/10)'}
              </p>
            </div>

            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-[#21262d]"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={`transition-all duration-700 ${
                    overallScore < 50 ? 'text-red-500' : overallScore < 75 ? 'text-yellow-500' : 'text-[#2ea043]'
                  }`}
                  strokeDasharray={`${overallScore}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-xs font-bold text-white">{overallScore}%</span>
            </div>
          </div>
        </div>

        {/* Priority Action Shortcuts */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-[#21262d]">
          <button
            onClick={() => onNavigateTab('hygiene')}
            className="flex items-center justify-between p-3 rounded-lg bg-[#21262d]/70 hover:bg-[#21262d] border border-red-500/30 text-left transition-all group"
          >
            <div>
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-red-400">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Urgent: Clean Toxic Repo</span>
              </div>
              <p className="text-[11px] text-[#8b949e] mt-0.5">Delete "ai-content-moderation-68"</p>
            </div>
            <ArrowRight className="w-4 h-4 text-[#8b949e] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
          </button>

          <button
            onClick={() => onNavigateTab('readme')}
            className="flex items-center justify-between p-3 rounded-lg bg-[#21262d]/70 hover:bg-[#21262d] border border-[#30363d] hover:border-[#58a6ff]/40 text-left transition-all group"
          >
            <div>
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-[#58a6ff]">
                <FileText className="w-3.5 h-3.5" />
                <span>Build Special Profile README</span>
              </div>
              <p className="text-[11px] text-[#8b949e] mt-0.5">Add badges, live stats & pitch</p>
            </div>
            <ArrowRight className="w-4 h-4 text-[#8b949e] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
          </button>

          <button
            onClick={() => onNavigateTab('bio')}
            className="flex items-center justify-between p-3 rounded-lg bg-[#21262d]/70 hover:bg-[#21262d] border border-[#30363d] hover:border-[#3fb950]/40 text-left transition-all group"
          >
            <div>
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-[#3fb950]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Craft 160-Char Bio & Tagline</span>
              </div>
              <p className="text-[11px] text-[#8b949e] mt-0.5">Generate high-impact headline</p>
            </div>
            <ArrowRight className="w-4 h-4 text-[#8b949e] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
          </button>
        </div>
      </div>

      {/* Real-time Language Breakdown */}
      {liveData && liveData.languages.length > 0 && (
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Code2 className="w-4 h-4 text-[#58a6ff]" />
              <span>Real-Time Language Analysis across {liveData.profile.public_repos} Repositories</span>
            </h3>
            <span className="text-xs text-[#8b949e]">Calculated from GitHub API</span>
          </div>

          <div className="h-3 w-full bg-[#0d1117] rounded-full overflow-hidden flex">
            {liveData.languages.map((l, idx) => (
              <div
                key={idx}
                style={{ width: `${l.percentage}%`, backgroundColor: l.color }}
                title={`${l.name}: ${l.percentage}% (${l.count} repos)`}
                className="h-full transition-all duration-500"
              />
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            {liveData.languages.map((l, idx) => (
              <div key={idx} className="flex items-center space-x-1.5 text-xs">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: l.color }} />
                <span className="text-white font-medium">{l.name}</span>
                <span className="text-[#8b949e]">({l.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Audit Pillars List */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white flex items-center space-x-2">
          <span>Audit Breakdown by Category</span>
          <span className="text-xs font-normal text-[#8b949e]">(Click checkmarks as you complete fixes)</span>
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {categories.map((category) => {
            const Icon = getIconComponent(category.icon);
            const fixedCount = category.issues.filter((i) => i.fixed).length;
            const isCompleted = fixedCount === category.issues.length;

            return (
              <div
                key={category.id}
                className={`bg-[#161b22] border rounded-xl p-5 transition-all ${
                  category.status === 'critical' && !isCompleted
                    ? 'border-red-500/40 bg-red-950/10'
                    : isCompleted
                    ? 'border-[#238636]/40 bg-[#0d1117]'
                    : 'border-[#30363d]'
                }`}
              >
                {/* Category Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#21262d]">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      category.status === 'critical'
                        ? 'bg-red-500/15 text-red-400'
                        : category.status === 'warning'
                        ? 'bg-yellow-500/15 text-yellow-400'
                        : 'bg-[#238636]/15 text-[#3fb950]'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                        <span>{category.title}</span>
                        {category.status === 'critical' && !isCompleted && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 uppercase font-bold">
                            High Priority
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-[#8b949e] mt-0.5">{category.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 self-end sm:self-auto">
                    <div className="text-right">
                      <span className="text-xs font-semibold text-[#8b949e]">
                        {fixedCount}/{category.issues.length} Fixed
                      </span>
                    </div>
                    <div className="w-20 h-2 bg-[#21262d] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#2ea043] transition-all duration-300 rounded-full"
                        style={{ width: `${(fixedCount / category.issues.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Issues checklist */}
                <div className="mt-4 space-y-3">
                  {category.issues.map((issue) => (
                    <div
                      key={issue.id}
                      className={`p-3.5 rounded-lg border transition-all ${
                        issue.fixed
                          ? 'bg-[#0d1117]/80 border-[#30363d]/60 opacity-75'
                          : issue.severity === 'critical'
                          ? 'bg-red-950/20 border-red-500/30'
                          : 'bg-[#21262d]/50 border-[#30363d]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start space-x-3">
                          <button
                            onClick={() => onToggleIssue(category.id, issue.id)}
                            className="mt-0.5 flex-shrink-0 text-left focus:outline-none"
                            title={issue.fixed ? 'Mark as pending' : 'Mark as completed'}
                          >
                            {issue.fixed ? (
                              <CheckCircle2 className="w-5 h-5 text-[#3fb950] transition-transform hover:scale-110" />
                            ) : (
                              <div className="w-5 h-5 rounded-full border-2 border-[#8b949e] hover:border-white transition-colors" />
                            )}
                          </button>

                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className={`text-xs font-bold ${issue.fixed ? 'line-through text-[#8b949e]' : 'text-white'}`}>
                                {issue.title}
                              </span>
                              <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold uppercase ${
                                issue.severity === 'critical'
                                  ? 'bg-red-500/20 text-red-400'
                                  : issue.severity === 'high'
                                  ? 'bg-yellow-500/20 text-yellow-400'
                                  : 'bg-blue-500/20 text-blue-400'
                              }`}>
                                {issue.severity}
                              </span>
                            </div>

                            <div className="text-xs text-[#8b949e]">
                              <span className="font-semibold text-[#c9d1d9]">Currently: </span>
                              <span className="font-mono bg-[#0d1117] px-1.5 py-0.5 rounded text-red-300 text-[11px]">
                                {issue.current}
                              </span>
                            </div>

                            <p className="text-xs text-[#8b949e] leading-relaxed pt-0.5">
                              <span className="font-semibold text-[#3fb950]">Fix: </span>
                              {issue.recommendation}
                            </p>
                          </div>
                        </div>

                        {/* Action shortcut button */}
                        {!issue.fixed && (
                          <button
                            onClick={() => {
                              if (issue.actionType === 'delete' || issue.actionType === 'rename') onNavigateTab('hygiene');
                              else if (issue.actionType === 'readme') onNavigateTab('readme');
                              else if (issue.actionType === 'bio' || issue.actionType === 'avatar') onNavigateTab('bio');
                              else onNavigateTab('hygiene');
                            }}
                            className="flex-shrink-0 px-2.5 py-1 text-xs font-semibold rounded bg-[#21262d] hover:bg-[#30363d] text-[#58a6ff] border border-[#30363d] flex items-center space-x-1 transition-all"
                          >
                            <span>Resolve</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
