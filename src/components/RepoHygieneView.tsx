import React, { useState, useEffect } from 'react';
import { 
  Trash2, 
  Lock, 
  CheckCircle, 
  Sparkles, 
  FileCode, 
  ExternalLink, 
  AlertTriangle, 
  Copy, 
  Check, 
  Layers, 
  BookOpen, 
  Tag, 
  RefreshCw,
  GitFork,
  Star
} from 'lucide-react';
import { SCREENSHOT_REPOSITORIES } from '../data/profileAuditData';
import { PinnedRepo } from '../types';
import { generateRepoReadmeMarkdown } from '../utils/markdownGenerator';
import { LiveGitHubRepo } from '../services/githubService';

interface RepoHygieneViewProps {
  currentUsername?: string;
  liveRepos?: LiveGitHubRepo[];
}

export const RepoHygieneView: React.FC<RepoHygieneViewProps> = ({
  currentUsername = 'eddardthehouesofstark-stack',
  liveRepos,
}) => {
  const [repos, setRepos] = useState<PinnedRepo[]>(SCREENSHOT_REPOSITORIES);
  const [selectedRepo, setSelectedRepo] = useState<PinnedRepo>(SCREENSHOT_REPOSITORIES[0]);
  const [activeTab, setActiveTab] = useState<'cleaner' | 'generator'>('cleaner');
  const [isLiveSyncing, setIsLiveSyncing] = useState(false);
  const [isLiveMode, setIsLiveMode] = useState(false);
  
  // Repo README Generator form state
  const [genRepoName, setGenRepoName] = useState('ai-content-moderation');
  const [genTagline, setGenTagline] = useState('🛡️ High-performance multimodal content moderation and toxicity detection pipeline');
  const [genTech, setGenTech] = useState('TypeScript, Python, FastAPI, Gemini API, Docker');
  const [genFeatures, setGenFeatures] = useState([
    'Real-Time Text Toxicity: Detect hate speech, harassment, and NSFW prompts in <80ms',
    'Multimodal Image Inspection: Automated classification of unsafe image uploads',
    'Customizable Moderation Rules: Configurable confidence thresholds and webhook alerts',
    'Audit Trail & Analytics: Complete compliance event logging and review dashboards'
  ]);
  const [copiedReadme, setCopiedReadme] = useState(false);
  const [isAiRefining, setIsAiRefining] = useState(false);

  // Sync when liveRepos prop is passed from App.tsx
  useEffect(() => {
    if (liveRepos && liveRepos.length > 0) {
      const mapped: PinnedRepo[] = liveRepos.map((r) => {
        let recAction: 'delete' | 'archive' | 'keep' | 'feature' = 'keep';
        let reason = 'Active repository on your GitHub account.';
        
        if (r.name.toLowerCase().includes('hitrel') || r.description?.toLowerCase().includes('hitrel') || r.description?.toLowerCase().includes('hail')) {
          recAction = 'delete';
          reason = 'CRITICAL: Contains offensive / toxic description. Delete immediately!';
        } else if (r.name.includes('-zip') || r.name.includes('test') || r.name.includes('demo')) {
          recAction = 'delete';
          reason = 'Appears to be a temporary or uncurated export repository.';
        } else if (!r.description) {
          recAction = 'keep';
          reason = 'Missing repository description and README.';
        } else if ((r.stargazers_count || 0) > 0 || r.language === 'TypeScript' || r.language === 'Python') {
          recAction = 'feature';
          reason = 'Strong candidate to feature as a showcase repository.';
        }

        return {
          id: String(r.id),
          name: r.name,
          description: r.description || 'No description provided.',
          language: r.language || 'Code',
          stars: r.stargazers_count || 0,
          forks: r.forks_count || 0,
          status: recAction === 'delete' ? 'delete' : 'keep',
          recommendedAction: recAction,
          reason: reason,
        };
      });

      setRepos(mapped);
      setSelectedRepo(mapped[0]);
      setIsLiveMode(true);
    } else if (currentUsername !== 'eddardthehouesofstark-stack') {
      // Empty repos for this user
      setRepos([]);
      setIsLiveMode(true);
    } else {
      setRepos(SCREENSHOT_REPOSITORIES);
      setSelectedRepo(SCREENSHOT_REPOSITORIES[0]);
      setIsLiveMode(false);
    }
  }, [liveRepos, currentUsername]);

  const fetchLiveRepos = async () => {
    setIsLiveSyncing(true);
    try {
      const res = await fetch(`https://api.github.com/users/${encodeURIComponent(currentUsername)}/repos?per_page=100&sort=updated`);
      if (res.ok) {
        const liveData = await res.json();
        const mapped: PinnedRepo[] = liveData.map((r: any) => {
          let recAction: 'delete' | 'archive' | 'keep' | 'feature' = 'keep';
          let reason = 'Active repository on your GitHub account.';
          
          if (r.name.toLowerCase().includes('hitrel') || r.description?.toLowerCase().includes('hitrel') || r.description?.toLowerCase().includes('hail')) {
            recAction = 'delete';
            reason = 'CRITICAL: Contains offensive / toxic description. Delete immediately!';
          } else if (r.name.includes('-zip') || r.name.includes('test') || r.name.includes('demo')) {
            recAction = 'delete';
            reason = 'Appears to be a temporary or uncurated export repository.';
          } else if (!r.description) {
            recAction = 'keep';
            reason = 'Missing repository description and README.';
          } else if (r.stargazers_count > 0 || r.language === 'TypeScript' || r.language === 'Python') {
            recAction = 'feature';
            reason = 'Strong candidate to feature as a showcase repository.';
          }

          return {
            id: String(r.id),
            name: r.name,
            description: r.description || 'No description provided.',
            language: r.language || 'Code',
            stars: r.stargazers_count || 0,
            forks: r.forks_count || 0,
            status: recAction === 'delete' ? 'delete' : 'keep',
            recommendedAction: recAction,
            reason: reason,
          };
        });

        if (mapped.length > 0) {
          setRepos(mapped);
          setSelectedRepo(mapped[0]);
          setIsLiveMode(true);
        }
      }
    } catch (err) {
      console.error('Failed to sync live repos', err);
    } finally {
      setIsLiveSyncing(false);
    }
  };

  const handleUpdateStatus = (id: string, status: PinnedRepo['status']) => {
    setRepos((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  const handleCopyGeneratedReadme = () => {
    const markdown = generateRepoReadmeMarkdown(
      genRepoName,
      genTagline,
      genTech.split(',').map((s) => s.trim()),
      genFeatures
    );
    navigator.clipboard.writeText(markdown);
    setCopiedReadme(true);
    setTimeout(() => setCopiedReadme(false), 2000);
  };

  const handleAiRefineRepo = async () => {
    setIsAiRefining(true);
    try {
      const res = await fetch('/api/ai/optimize-repo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repoName: genRepoName,
          currentDescription: genTagline,
          tech: genTech,
          projectGoal: 'AI Content Moderation API',
        }),
      });
      const data = await res.json();
      if (data.recommendedName) setGenRepoName(data.recommendedName);
      if (data.cleanDescription) setGenTagline(data.cleanDescription);
      if (data.featureHighlights && Array.isArray(data.featureHighlights)) {
        setGenFeatures(data.featureHighlights);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiRefining(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Selector Navigation */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <Trash2 className="w-5 h-5 text-red-400" />
            <span>Repository Hygiene & Showcase Curation</span>
          </h2>
          <p className="text-xs text-[#8b949e] mt-1">
            Recruiters judge your code quality by your top repositories. Clean up clutter, delete junk repos, and generate showcase documentation.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-[#0d1117] p-1 rounded-lg border border-[#30363d] self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('cleaner')}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
              activeTab === 'cleaner' ? 'bg-[#21262d] text-white shadow-sm' : 'text-[#8b949e] hover:text-white'
            }`}
          >
            Repo Action List
          </button>
          <button
            onClick={() => setActiveTab('generator')}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
              activeTab === 'generator' ? 'bg-[#21262d] text-white shadow-sm' : 'text-[#8b949e] hover:text-white'
            }`}
          >
            Repo README Generator
          </button>
        </div>
      </div>

      {activeTab === 'cleaner' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Repositories List from Screenshot */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <span>Public Repositories</span>
                  {isLiveMode && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#238636]/20 text-[#3fb950] border border-[#238636]/30">
                      LIVE FROM GITHUB
                    </span>
                  )}
                </h3>
                <span className="text-xs text-[#8b949e]">{repos.length} repositories loaded</span>
              </div>
              <button
                onClick={fetchLiveRepos}
                disabled={isLiveSyncing}
                className="px-2.5 py-1 bg-[#21262d] hover:bg-[#30363d] text-white text-xs font-semibold rounded-lg border border-[#30363d] flex items-center space-x-1.5 transition-all self-start sm:self-auto disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLiveSyncing ? 'animate-spin text-[#58a6ff]' : ''}`} />
                <span>{isLiveSyncing ? 'Fetching...' : 'Sync Live GitHub Repos'}</span>
              </button>
            </div>

            <div className="space-y-3">
              {repos.map((repo) => {
                const isSelected = selectedRepo.id === repo.id;
                const isCritical = repo.name === 'ai-content-moderation-68' || repo.name.includes('-zip');

                return (
                  <div
                    key={repo.id}
                    onClick={() => setSelectedRepo(repo)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#58a6ff] bg-[#161b22] shadow-lg'
                        : 'border-[#30363d] bg-[#161b22]/70 hover:border-[#8b949e]'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-sm font-bold text-white">{repo.name}</span>
                          {isCritical && (
                            <span className="text-[10px] px-2 py-0.2 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 uppercase font-bold flex items-center space-x-1">
                              <AlertTriangle className="w-3 h-3 mr-0.5" />
                              <span>Action Required</span>
                            </span>
                          )}
                          <span className="text-[10px] px-2 py-0.2 rounded bg-[#21262d] text-[#8b949e]">
                            Public
                          </span>
                        </div>

                        <p className={`text-xs ${repo.description === 'all hail hitrel' ? 'text-red-400 font-bold bg-red-950/40 px-2 py-0.5 rounded inline-block' : 'text-[#8b949e]'}`}>
                          Description: <span className="text-[#c9d1d9]">{repo.description}</span>
                        </p>
                      </div>

                      {/* Status Badges / Actions */}
                      <div className="flex items-center space-x-1.5 self-end sm:self-auto">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateStatus(repo.id, 'delete');
                          }}
                          className={`px-2 py-1 text-[11px] font-semibold rounded border transition-all ${
                            repo.status === 'delete'
                              ? 'bg-red-500/20 text-red-400 border-red-500/40'
                              : 'bg-[#21262d] text-[#8b949e] border-[#30363d] hover:text-red-400'
                          }`}
                        >
                          Delete
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateStatus(repo.id, 'privatize');
                          }}
                          className={`px-2 py-1 text-[11px] font-semibold rounded border transition-all ${
                            repo.status === 'privatize'
                              ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40'
                              : 'bg-[#21262d] text-[#8b949e] border-[#30363d] hover:text-yellow-400'
                          }`}
                        >
                          Make Private
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateStatus(repo.id, 'clean');
                          }}
                          className={`px-2 py-1 text-[11px] font-semibold rounded border transition-all ${
                            repo.status === 'clean'
                              ? 'bg-[#238636]/20 text-[#3fb950] border-[#2ea043]'
                              : 'bg-[#21262d] text-[#8b949e] border-[#30363d] hover:text-[#3fb950]'
                          }`}
                        >
                          Polish & Showcase
                        </button>
                      </div>
                    </div>

                    {repo.flagNote && (
                      <div className="mt-3 pt-3 border-t border-[#21262d] text-xs leading-relaxed text-[#8b949e]">
                        <span className="font-semibold text-white">Analysis: </span>
                        {repo.flagNote}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Repo Detail & Quick Fix Card */}
          <div className="space-y-4">
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 space-y-4 sticky top-20">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-[#58a6ff]" />
                <span>Selected Repository Diagnostic</span>
              </h3>

              <div className="p-3 bg-[#0d1117] rounded-lg border border-[#21262d] space-y-2">
                <p className="text-xs font-mono font-bold text-white">{selectedRepo.name}</p>
                <p className="text-[11px] text-[#8b949e]">Language: <span className="text-white">{selectedRepo.language}</span></p>
                <div className="flex items-center space-x-2 text-[11px]">
                  <span className="text-[#8b949e]">Action Plan:</span>
                  <span className={`font-bold uppercase ${
                    selectedRepo.status === 'delete' ? 'text-red-400' : selectedRepo.status === 'privatize' ? 'text-yellow-400' : 'text-[#3fb950]'
                  }`}>
                    {selectedRepo.status}
                  </span>
                </div>
              </div>

              {selectedRepo.name === 'ai-content-moderation-68' && (
                <div className="p-3.5 bg-red-950/30 border border-red-500/40 rounded-lg text-xs space-y-2 text-red-300">
                  <p className="font-bold flex items-center space-x-1">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span>Immediate Recruiter Warning</span>
                  </p>
                  <p className="leading-relaxed">
                    This repo's description contains a hate/offensive phrase. Any tech recruiter searching your GitHub will disqualify your application on the spot.
                  </p>
                  <p className="font-semibold text-white">How to fix in 10 seconds:</p>
                  <ol className="list-decimal list-inside space-y-1 text-[#8b949e]">
                    <li>Open repository on GitHub</li>
                    <li>Click <strong className="text-white">Settings</strong> &gt; Scroll to bottom <strong className="text-red-400">Danger Zone</strong></li>
                    <li>Click <strong className="text-white">"Delete this repository"</strong></li>
                  </ol>
                </div>
              )}

              {selectedRepo.name === 'ai-content-moderation-zip' && (
                <div className="p-3.5 bg-yellow-950/30 border border-yellow-500/40 rounded-lg text-xs space-y-2 text-yellow-300">
                  <p className="font-bold">Why "-zip" Repos Hurt Your Portfolio</p>
                  <p className="text-[#8b949e] leading-relaxed">
                    Repos ending in "-zip" or containing uploaded uncompressed archives signal amateur git habits. Delete it or replace it with a clean repository created via <code className="text-white bg-[#0d1117] px-1 py-0.5 rounded">git init</code>.
                  </p>
                </div>
              )}

              {/* Dynamic Generator Action for any selected repo */}
              <button
                onClick={() => {
                  setGenRepoName(selectedRepo.name);
                  setGenTagline(
                    selectedRepo.description !== 'No description provided.'
                      ? `⚡ ${selectedRepo.description}`
                      : `⚡ High-performance developer project built with ${selectedRepo.language}`
                  );
                  setGenTech(`${selectedRepo.language}, TypeScript, Vite, Tailwind CSS`);
                  setGenFeatures([
                    `Core Functionality: Built with clean ${selectedRepo.language} architecture and modular components`,
                    `High Performance: Optimized bundle size, responsive styling, and fast load times`,
                    `Developer-Ready: Comprehensive documentation, type safety, and automated build pipeline`,
                    `Modern UI/UX: Polished design system with dark mode and smooth animations`,
                  ]);
                  setActiveTab('generator');
                }}
                className="w-full py-2 bg-[#1f6feb] hover:bg-[#388bfd] text-white text-xs font-bold rounded-lg flex items-center justify-center space-x-1.5 transition-all shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate README for "{selectedRepo.name}"</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Repo README Generator */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-[#161b22] border border-[#30363d] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <FileCode className="w-4 h-4 text-[#58a6ff]" />
                <span>Showcase Repo README Blueprint</span>
              </h3>
              <button
                onClick={handleAiRefineRepo}
                disabled={isAiRefining}
                className="px-2.5 py-1 text-xs font-semibold rounded bg-[#388bfd]/20 text-[#58a6ff] border border-[#388bfd]/30 hover:bg-[#388bfd]/30 flex items-center space-x-1 transition-all disabled:opacity-50"
              >
                {isAiRefining ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                <span>{isAiRefining ? 'Polishing...' : 'AI Refine'}</span>
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] text-[#8b949e]">Repository Name</label>
                <input
                  type="text"
                  value={genRepoName}
                  onChange={(e) => setGenRepoName(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 text-xs bg-[#0d1117] border border-[#30363d] rounded-lg text-white font-mono focus:outline-none focus:border-[#58a6ff]"
                />
              </div>

              <div>
                <label className="text-[11px] text-[#8b949e]">1-Sentence Tagline / Hook</label>
                <textarea
                  rows={2}
                  value={genTagline}
                  onChange={(e) => setGenTagline(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 text-xs bg-[#0d1117] border border-[#30363d] rounded-lg text-white focus:outline-none focus:border-[#58a6ff]"
                />
              </div>

              <div>
                <label className="text-[11px] text-[#8b949e]">Tech Stack (Comma-separated)</label>
                <input
                  type="text"
                  value={genTech}
                  onChange={(e) => setGenTech(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 text-xs bg-[#0d1117] border border-[#30363d] rounded-lg text-white focus:outline-none focus:border-[#58a6ff]"
                />
              </div>

              <div>
                <label className="text-[11px] text-[#8b949e]">Key Features</label>
                <div className="space-y-2 mt-1">
                  {genFeatures.map((feat, idx) => (
                    <input
                      key={idx}
                      type="text"
                      value={feat}
                      onChange={(e) => {
                        const updated = [...genFeatures];
                        updated[idx] = e.target.value;
                        setGenFeatures(updated);
                      }}
                      className="w-full px-3 py-1.5 text-xs bg-[#0d1117] border border-[#30363d] rounded-lg text-white focus:outline-none focus:border-[#58a6ff]"
                    />
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleCopyGeneratedReadme}
              className="w-full py-2 bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-bold rounded-lg flex items-center justify-center space-x-2 transition-all"
            >
              {copiedReadme ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedReadme ? 'Copied to Clipboard!' : 'Copy Repo README.md'}</span>
            </button>
          </div>

          {/* Live Preview of the Project README */}
          <div className="lg:col-span-7 bg-[#0d1117] border border-[#30363d] rounded-xl p-6 overflow-y-auto max-h-[750px]">
            <pre className="font-mono text-xs text-[#c9d1d9] whitespace-pre-wrap leading-relaxed selection:bg-[#388bfd]/30">
              {generateRepoReadmeMarkdown(
                genRepoName,
                genTagline,
                genTech.split(',').map((s) => s.trim()),
                genFeatures
              )}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
