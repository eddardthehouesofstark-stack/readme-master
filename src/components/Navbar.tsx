import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FileCode, 
  Sparkles, 
  Trash2, 
  Columns, 
  CalendarCheck, 
  Github, 
  AlertTriangle,
  Search,
  RefreshCw,
  User,
  Check
} from 'lucide-react';
import { ProfileData } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  overallScore: number;
  criticalIssueCount: number;
  currentUsername: string;
  profileData: ProfileData;
  isLoadingUser: boolean;
  onSearchUser: (username: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  overallScore,
  criticalIssueCount,
  currentUsername,
  profileData,
  isLoadingUser,
  onSearchUser,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const tabs = [
    { id: 'audit', label: 'Profile Audit', icon: ShieldCheck, badge: criticalIssueCount > 0 ? `${criticalIssueCount} Alerts` : null, badgeColor: 'bg-red-500/20 text-red-400 border border-red-500/30' },
    { id: 'readme', label: 'Profile README Architect', icon: FileCode },
    { id: 'hygiene', label: 'Repo Hygiene Cleaner', icon: Trash2 },
    { id: 'bio', label: 'Bio & Headline AI Studio', icon: Sparkles },
    { id: 'comparison', label: 'Before vs. After', icon: Columns },
    { id: 'roadmap', label: '7-Day Playbook', icon: CalendarCheck },
  ];

  const popularUsers = [
    { name: 'Linus Torvalds', handle: 'torvalds' },
    { name: 'Shadcn', handle: 'shadcn' },
    { name: 'Dan Abramov', handle: 'gaearon' },
    { name: 'Anthony Fu', handle: 'antfu' },
    { name: 'Evan You', handle: 'yyx990803' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearchUser(searchInput.trim());
      setSearchInput('');
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#161b22]/95 backdrop-blur-md border-b border-[#30363d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <div className="p-2 bg-[#238636]/10 border border-[#238636]/30 rounded-lg text-[#2ea043]">
              <Github className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-white text-sm sm:text-base tracking-tight">GitHub Profile Architect</span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-[#388bfd]/15 text-[#58a6ff] border border-[#388bfd]/30">
                  Universal Auditor
                </span>
              </div>
              <p className="text-[11px] text-[#8b949e] hidden sm:block">Audit, generate README & polish any GitHub ID</p>
            </div>
          </div>

          {/* Center / Right: Global User Input & Switcher */}
          <div className="flex items-center space-x-2 sm:space-x-3 flex-1 justify-end">
            <form onSubmit={handleSearchSubmit} className="relative max-w-xs w-full hidden md:block">
              <Search className="w-3.5 h-3.5 text-[#8b949e] absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={`Search any handle (e.g. ${currentUsername})...`}
                className="w-full pl-8.5 pr-20 py-1.5 bg-[#0d1117] border border-[#30363d] rounded-lg text-xs text-white placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff] transition-all"
              />
              <button
                type="submit"
                disabled={isLoadingUser || !searchInput.trim()}
                className="absolute right-1 top-1 px-2.5 py-1 bg-[#238636] hover:bg-[#2ea043] disabled:opacity-40 text-white text-[10px] font-bold rounded flex items-center space-x-1 transition-all"
              >
                {isLoadingUser ? <RefreshCw className="w-2.5 h-2.5 animate-spin" /> : <span>Audit</span>}
              </button>
            </form>

            {/* Active User Badge & Quick Switcher Popover Trigger */}
            <div className="relative">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg bg-[#0d1117] hover:bg-[#21262d] border border-[#30363d] text-xs transition-all"
                title="Click to switch or enter another GitHub ID"
              >
                <img
                  src={profileData.avatarUrl}
                  alt={currentUsername}
                  className="w-5 h-5 rounded-full object-cover border border-[#30363d]"
                />
                <span className="font-mono font-bold text-white max-w-[120px] truncate">
                  @{currentUsername}
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#21262d] text-[#58a6ff] font-semibold hidden sm:inline">
                  Change
                </span>
              </button>

              {/* Quick Switch Dropdown */}
              {isSearchOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-[#161b22] border border-[#30363d] rounded-xl shadow-2xl p-3 z-50 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#21262d]">
                    <span className="text-xs font-bold text-white">Enter Any GitHub Username</span>
                    <button
                      onClick={() => setIsSearchOpen(false)}
                      className="text-[#8b949e] hover:text-white text-xs"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleSearchSubmit} className="space-y-2">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-[#8b949e] absolute left-2.5 top-2.5" />
                      <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="GitHub handle (e.g. torvalds)..."
                        autoFocus
                        className="w-full pl-8 pr-3 py-1.5 bg-[#0d1117] border border-[#30363d] rounded-lg text-xs text-white placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff]"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isLoadingUser || !searchInput.trim()}
                      className="w-full py-1.5 bg-[#238636] hover:bg-[#2ea043] disabled:opacity-40 text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center space-x-1.5"
                    >
                      {isLoadingUser ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                      <span>{isLoadingUser ? 'Auditing Profile...' : 'Analyze & Generate Suite'}</span>
                    </button>
                  </form>

                  <div className="pt-2 border-t border-[#21262d] space-y-1.5">
                    <span className="text-[10px] text-[#8b949e] uppercase font-bold tracking-wider block">
                      Quick Demo Profiles
                    </span>
                    <div className="space-y-1 max-h-36 overflow-y-auto">
                      {popularUsers.map((u) => (
                        <button
                          key={u.handle}
                          onClick={() => {
                            onSearchUser(u.handle);
                            setIsSearchOpen(false);
                          }}
                          className={`w-full text-left px-2 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                            currentUsername.toLowerCase() === u.handle.toLowerCase()
                              ? 'bg-[#238636]/20 text-[#3fb950] font-bold'
                              : 'text-[#8b949e] hover:bg-[#21262d] hover:text-white'
                          }`}
                        >
                          <div>
                            <span className="font-semibold text-white">{u.name}</span>
                            <span className="text-[11px] text-[#8b949e] ml-1.5 font-mono">@{u.handle}</span>
                          </div>
                          {currentUsername.toLowerCase() === u.handle.toLowerCase() && (
                            <Check className="w-3.5 h-3.5 text-[#3fb950]" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Health Score Indicator */}
            <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-[#0d1117] border border-[#30363d]">
              <span className="text-xs text-[#8b949e]">Score:</span>
              <div className="flex items-center space-x-1.5">
                <div className="w-12 h-2 bg-[#21262d] rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 rounded-full ${
                      overallScore < 50 ? 'bg-red-500' : overallScore < 75 ? 'bg-yellow-500' : 'bg-[#2ea043]'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(10, overallScore))}%` }}
                  />
                </div>
                <span className={`text-xs font-bold ${
                  overallScore < 50 ? 'text-red-400' : overallScore < 75 ? 'text-yellow-400' : 'text-[#3fb950]'
                }`}>
                  {overallScore}
                </span>
              </div>
            </div>

            {criticalIssueCount > 0 && (
              <div className="hidden xl:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-red-950/40 border border-red-500/40 text-red-400 text-xs">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span className="font-semibold">{criticalIssueCount} Alerts</span>
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 overflow-x-auto no-scrollbar border-t border-[#21262d] py-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-nav-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-2 text-xs font-medium rounded-md whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#21262d] text-white shadow-sm border border-[#30363d]'
                    : 'text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#21262d]/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#58a6ff]' : 'text-[#8b949e]'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${tab.badgeColor}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

