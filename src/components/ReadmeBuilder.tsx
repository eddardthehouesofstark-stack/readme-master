import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Download, 
  Eye, 
  Code2, 
  Palette, 
  Layers, 
  Sparkles, 
  ExternalLink,
  Plus,
  Trash2,
  HelpCircle,
  BarChart3,
  Github,
  Linkedin,
  Globe,
  Mail,
  Instagram,
  Twitter,
  Share2,
  Link2,
  CheckCircle2,
  Send,
  Star,
  LayoutGrid,
  Table as TableIcon,
  CreditCard,
  Tag,
  ArrowUpRight,
  Monitor,
  FolderGit2,
  Sparkle,
  Zap,
  Play,
  FileCode2,
  Terminal,
  Activity,
  Rss,
  Clock,
  Settings2
} from 'lucide-react';
import { ProfileData, TechBadge } from '../types';
import { TECH_BADGES } from '../data/techBadges';
import { 
  generateProfileReadmeMarkdown,
  getSnakeWorkflowYaml,
  getMetricsWorkflowYaml,
  getBlogPostWorkflowYaml,
  getWakatimeWorkflowYaml
} from '../utils/markdownGenerator';

interface ReadmeBuilderProps {
  profileData: ProfileData;
  setProfileData: React.Dispatch<React.SetStateAction<ProfileData>>;
}

export const ReadmeBuilder: React.FC<ReadmeBuilderProps> = ({
  profileData,
  setProfileData,
}) => {
  const [activeView, setActiveView] = useState<'preview' | 'code'>('preview');
  const [copied, setCopied] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<TechBadge['category'] | 'all'>('all');
  const [showDeployGuide, setShowDeployGuide] = useState(false);
  const [showWorkflowModal, setShowWorkflowModal] = useState(false);
  const [activeWorkflowTab, setActiveWorkflowTab] = useState<'snake' | 'metrics' | 'blog' | 'wakatime'>('snake');
  const [workflowCopied, setWorkflowCopied] = useState(false);

  const markdownContent = generateProfileReadmeMarkdown(profileData);

  const getActiveWorkflowContent = () => {
    const uname = profileData.username || 'your-username';
    switch (activeWorkflowTab) {
      case 'snake':
        return getSnakeWorkflowYaml(uname);
      case 'metrics':
        return getMetricsWorkflowYaml(uname);
      case 'blog':
        return getBlogPostWorkflowYaml(profileData.blogRssUrl || `https://dev.to/feed/${uname}`);
      case 'wakatime':
        return getWakatimeWorkflowYaml();
    }
  };

  const handleCopyWorkflow = () => {
    navigator.clipboard.writeText(getActiveWorkflowContent());
    setWorkflowCopied(true);
    setTimeout(() => setWorkflowCopied(false), 2000);
  };

  const handleDownloadWorkflow = () => {
    const filenames: Record<string, string> = {
      snake: 'snake.yml',
      metrics: 'metrics.yml',
      blog: 'blog-posts.yml',
      wakatime: 'wakatime.yml',
    };
    const content = getActiveWorkflowContent();
    const blob = new Blob([content], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filenames[activeWorkflowTab];
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleTech = (badgeId: string) => {
    setProfileData((prev) => {
      const exists = prev.selectedTech.includes(badgeId);
      return {
        ...prev,
        selectedTech: exists
          ? prev.selectedTech.filter((id) => id !== badgeId)
          : [...prev.selectedTech, badgeId],
      };
    });
  };

  const addProject = () => {
    setProfileData((prev) => ({
      ...prev,
      pinnedProjects: [
        ...prev.pinnedProjects,
        {
          name: 'new-awesome-project',
          description: '⚡ High-performance web tool built with clean architecture and modern UX.',
          tech: 'TypeScript, React, Node.js',
          demoUrl: 'https://demo.example.com',
          repoUrl: `https://github.com/${prev.username || 'username'}/new-awesome-project`,
          stars: 10,
          badge: 'Featured',
        },
      ],
    }));
  };

  const updateProject = (index: number, field: string, value: string) => {
    setProfileData((prev) => {
      const updated = [...prev.pinnedProjects];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, pinnedProjects: updated };
    });
  };

  const deleteProject = (index: number) => {
    setProfileData((prev) => ({
      ...prev,
      pinnedProjects: prev.pinnedProjects.filter((_, i) => i !== index),
    }));
  };

  // Safe URL formatter for links
  const formatUrl = (input: string, type: 'linkedin' | 'instagram' | 'twitter' | 'web') => {
    if (!input) return '';
    const trimmed = input.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
    if (type === 'linkedin') {
      return trimmed.startsWith('in/') ? `https://linkedin.com/${trimmed}` : `https://linkedin.com/in/${trimmed.replace('@', '')}`;
    }
    if (type === 'instagram') {
      return `https://instagram.com/${trimmed.replace('@', '')}`;
    }
    if (type === 'twitter') {
      return `https://x.com/${trimmed.replace('@', '')}`;
    }
    return `https://${trimmed}`;
  };

  const formatMailto = (email: string) => {
    if (!email) return '';
    const trimmed = email.trim();
    return trimmed.startsWith('mailto:') ? trimmed : `mailto:${trimmed}`;
  };

  const themes = [
    { id: 'tokyonight', name: 'Tokyo Night' },
    { id: 'github_dark', name: 'GitHub Dark' },
    { id: 'dracula', name: 'Dracula' },
    { id: 'radical', name: 'Radical' },
    { id: 'nord', name: 'Nord' },
    { id: 'gruvbox', name: 'Gruvbox' },
    { id: 'onehalf-dark', name: 'One Half Dark' },
  ];

  const filteredBadges = selectedCategory === 'all'
    ? TECH_BADGES
    : TECH_BADGES.filter((b) => b.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <Github className="w-5 h-5 text-[#58a6ff]" />
            <span>Special Profile README Architect</span>
          </h2>
          <p className="text-xs text-[#8b949e] mt-1">
            Build your GitHub front-page resume. Customize badges, dynamic stats, widgets, and live preview.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowWorkflowModal(true)}
            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-[#388bfd]/10 hover:bg-[#388bfd]/20 text-[#58a6ff] border border-[#388bfd]/30 flex items-center space-x-1.5 transition-all shadow-sm"
          >
            <Zap className="w-4 h-4 text-[#58a6ff]" />
            <span>⚡ GitHub Actions Workflows</span>
          </button>

          <button
            onClick={() => setShowDeployGuide(!showDeployGuide)}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] border border-[#30363d] flex items-center space-x-1.5 transition-all"
          >
            <HelpCircle className="w-4 h-4 text-[#8b949e]" />
            <span>How to Deploy (30s Guide)</span>
          </button>

          <button
            onClick={handleCopy}
            className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-[#238636] hover:bg-[#2ea043] text-white flex items-center space-x-1.5 shadow-sm transition-all"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Markdown!' : 'Copy README.md'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#21262d] hover:bg-[#30363d] text-white border border-[#30363d] flex items-center space-x-1.5 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* GitHub Actions Workflows Hub Modal */}
      {showWorkflowModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#30363d] flex items-center justify-between bg-[#0d1117]">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-[#388bfd]/20 border border-[#388bfd]/40 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-[#58a6ff]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center space-x-2">
                    <span>GitHub Actions Workflow Generator</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#238636]/20 text-[#3fb950] border border-[#238636]/30 font-semibold">
                      Automated & Ready to Commit
                    </span>
                  </h3>
                  <p className="text-xs text-[#8b949e]">
                    Pre-configured CI/CD workflows for dynamic animated snakes, metrics, and automated updates.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowWorkflowModal(false)}
                className="w-8 h-8 rounded-lg bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] hover:text-white flex items-center justify-center transition-colors text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Workflow Tabs */}
            <div className="px-5 pt-3 bg-[#0d1117] border-b border-[#30363d] flex items-center space-x-2 overflow-x-auto no-scrollbar">
              {[
                { id: 'snake', label: '🐍 Contribution Snake Game', file: '.github/workflows/snake.yml' },
                { id: 'metrics', label: '📈 GitHub Metrics Engine', file: '.github/workflows/metrics.yml' },
                { id: 'blog', label: '📝 Blog & RSS Feed Sync', file: '.github/workflows/blog-posts.yml' },
                { id: 'wakatime', label: '⏱️ WakaTime Coding Stats', file: '.github/workflows/wakatime.yml' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveWorkflowTab(tab.id as any)}
                  className={`px-3.5 py-2 rounded-t-lg text-xs font-semibold transition-all border-b-2 whitespace-nowrap flex items-center space-x-1.5 ${
                    activeWorkflowTab === tab.id
                      ? 'border-[#58a6ff] text-white bg-[#161b22]'
                      : 'border-transparent text-[#8b949e] hover:text-white hover:bg-[#161b22]/50'
                  }`}
                >
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              {/* Step by step installation guide banner */}
              <div className="p-4 bg-[#0d1117] rounded-xl border border-[#30363d] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                    <Terminal className="w-4 h-4 text-[#3fb950]" />
                    <span>How to apply this workflow in your repository:</span>
                  </span>
                  <span className="text-[11px] font-mono text-[#58a6ff]">
                    Target: .github/workflows/{activeWorkflowTab === 'snake' ? 'snake.yml' : activeWorkflowTab === 'metrics' ? 'metrics.yml' : activeWorkflowTab === 'blog' ? 'blog-posts.yml' : 'wakatime.yml'}
                  </span>
                </div>
                <ol className="text-xs text-[#8b949e] space-y-1.5 list-decimal list-inside leading-relaxed">
                  <li>
                    In your special profile repository (<code className="text-white bg-[#161b22] px-1 py-0.5 rounded">{profileData.username || 'username'}/{profileData.username || 'username'}</code>), create folder: <code className="text-[#58a6ff] bg-[#161b22] px-1 py-0.5 rounded">.github/workflows/</code>
                  </li>
                  <li>
                    Create a file named <code className="text-white bg-[#161b22] px-1 py-0.5 rounded font-mono">{activeWorkflowTab === 'snake' ? 'snake.yml' : activeWorkflowTab === 'metrics' ? 'metrics.yml' : activeWorkflowTab === 'blog' ? 'blog-posts.yml' : 'wakatime.yml'}</code> and paste the YAML below.
                  </li>
                  <li>
                    <strong>Important GitHub Permission:</strong> Go to <span className="text-white">Settings &gt; Actions &gt; General &gt; Workflow permissions</span> and select <strong className="text-[#3fb950]">"Read and write permissions"</strong> so the action can save outputs.
                  </li>
                  <li>
                    Commit changes to <code className="text-white">main</code> and run the action manually from the <strong className="text-white">Actions</strong> tab or wait for the automatic daily cron trigger!
                  </li>
                </ol>
              </div>

              {/* Code Preview Box */}
              <div className="relative rounded-xl overflow-hidden border border-[#30363d] bg-[#0d1117]">
                <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-[#30363d]">
                  <span className="text-xs font-mono text-[#8b949e] flex items-center space-x-1.5">
                    <FileCode2 className="w-3.5 h-3.5 text-[#58a6ff]" />
                    <span>.github/workflows/{activeWorkflowTab === 'snake' ? 'snake.yml' : activeWorkflowTab === 'metrics' ? 'metrics.yml' : activeWorkflowTab === 'blog' ? 'blog-posts.yml' : 'wakatime.yml'}</span>
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleCopyWorkflow}
                      className="px-3 py-1 bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-bold rounded-md flex items-center space-x-1.5 transition-all"
                    >
                      {workflowCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{workflowCopied ? 'Copied YAML!' : 'Copy Workflow'}</span>
                    </button>
                    <button
                      onClick={handleDownloadWorkflow}
                      className="px-3 py-1 bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] text-xs font-semibold rounded-md border border-[#30363d] flex items-center space-x-1.5 transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download .yml</span>
                    </button>
                  </div>
                </div>
                <pre className="p-4 text-xs font-mono text-[#c9d1d9] overflow-x-auto max-h-80 leading-relaxed">
                  {getActiveWorkflowContent()}
                </pre>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#0d1117] border-t border-[#30363d] flex items-center justify-between">
              <span className="text-xs text-[#8b949e]">
                💡 Tip: Workflows run automatically on schedule and dynamically update your profile without manual edits.
              </span>
              <button
                onClick={() => setShowWorkflowModal(false)}
                className="px-4 py-2 bg-[#21262d] hover:bg-[#30363d] text-white text-xs font-bold rounded-lg border border-[#30363d]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deployment Explainer Modal/Card */}
      {showDeployGuide && (
        <div className="bg-[#0d1117] border border-[#388bfd]/40 rounded-xl p-5 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#58a6ff]" />
              <span>How to Activate Your GitHub Profile README</span>
            </h3>
            <button
              onClick={() => setShowDeployGuide(false)}
              className="text-xs text-[#8b949e] hover:text-white"
            >
              ✕ Close
            </button>
          </div>
          <ol className="text-xs text-[#8b949e] space-y-2 list-decimal list-inside leading-relaxed">
            <li>
              Go to <a href="https://github.com/new" target="_blank" rel="noreferrer" className="text-[#58a6ff] underline inline-flex items-center">github.com/new <ExternalLink className="w-3 h-3 ml-0.5" /></a>
            </li>
            <li>
              Set the <strong className="text-white">Repository name</strong> to your EXACT username: <code className="bg-[#161b22] px-1.5 py-0.5 rounded text-[#58a6ff] border border-[#30363d]">{profileData.username || 'your-username'}</code>
            </li>
            <li>
              GitHub will show a green banner: <em className="text-[#3fb950]">"You found a secret! ...is a ✨special✨ repository that you can use to add a README.md to your GitHub profile."</em>
            </li>
            <li>
              Make sure it is set to <strong className="text-white">Public</strong> and check <strong className="text-white">"Add a README file"</strong>.
            </li>
            <li>
              Click <strong className="text-white">Create repository</strong>, click the pencil icon to edit <code className="text-white">README.md</code>, paste the code below, and click <strong className="text-[#3fb950]">Commit changes</strong>!
            </li>
          </ol>
        </div>
      )}

      {/* Preset Quick Actions */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-[#e3b341]" />
          <span className="text-xs font-bold text-white">Quick Architecture Presets:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() =>
              setProfileData((p) => ({
                ...p,
                bannerStyle: 'typing',
                statsTheme: 'tokyonight',
                showStats: true,
                showTopLangs: true,
                showStreak: true,
                showTrophies: false,
              }))
            }
            className="px-2.5 py-1 text-xs rounded-lg bg-[#21262d] hover:bg-[#30363d] text-white border border-[#30363d] transition-all flex items-center space-x-1"
          >
            <span>💎 Modern Animated</span>
          </button>
          <button
            onClick={() =>
              setProfileData((p) => ({
                ...p,
                bannerStyle: 'minimal',
                statsTheme: 'github_dark',
                showStats: true,
                showTopLangs: false,
                showStreak: false,
                showTrophies: false,
              }))
            }
            className="px-2.5 py-1 text-xs rounded-lg bg-[#21262d] hover:bg-[#30363d] text-white border border-[#30363d] transition-all flex items-center space-x-1"
          >
            <span>⚡ Clean & Minimal</span>
          </button>
          <button
            onClick={() =>
              setProfileData((p) => ({
                ...p,
                bannerStyle: 'terminal',
                statsTheme: 'radical',
                showStats: true,
                showTopLangs: true,
                showStreak: true,
                showTrophies: false,
              }))
            }
            className="px-2.5 py-1 text-xs rounded-lg bg-[#21262d] hover:bg-[#30363d] text-white border border-[#30363d] transition-all flex items-center space-x-1"
          >
            <span>👾 Cyber Terminal</span>
          </button>
          <button
            onClick={() =>
              setProfileData((p) => ({
                ...p,
                bannerStyle: 'capsule',
                statsTheme: 'tokyonight',
                showStats: true,
                showTopLangs: true,
                showStreak: true,
                showTrophies: true,
              }))
            }
            className="px-2.5 py-1 text-xs rounded-lg bg-[#21262d] hover:bg-[#30363d] text-white border border-[#30363d] transition-all flex items-center space-x-1"
          >
            <span>🌊 Waving Banner</span>
          </button>
        </div>
      </div>

      {/* Main Builder Grid: Config on Left, Live Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Customization Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Header Banner Style */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 space-y-3">
            <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
              <Palette className="w-4 h-4 text-[#58a6ff]" />
              <span>Header Banner Style</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'typing', label: 'Animated Typing' },
                { id: 'capsule', label: 'Gradient Wave' },
                { id: 'terminal', label: 'Terminal CLI' },
                { id: 'minimal', label: 'Clean Title' },
              ].map((style) => (
                <button
                  key={style.id}
                  onClick={() => setProfileData((p) => ({ ...p, bannerStyle: style.id as any }))}
                  className={`p-2.5 rounded-lg text-xs font-medium border text-left transition-all ${
                    profileData.bannerStyle === style.id
                      ? 'bg-[#388bfd]/15 border-[#388bfd] text-[#58a6ff]'
                      : 'bg-[#0d1117] border-[#30363d] text-[#8b949e] hover:text-white'
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          {/* Profile Identity & Tagline */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 space-y-3">
            <label className="text-xs font-bold text-white uppercase tracking-wider">
              Profile Details
            </label>
            <div className="space-y-2.5">
              <div>
                <label className="text-[11px] text-[#8b949e]">GitHub Username (must match your account)</label>
                <input
                  type="text"
                  value={profileData.username}
                  onChange={(e) => setProfileData((p) => ({ ...p, username: e.target.value }))}
                  className="w-full mt-1 px-3 py-1.5 text-xs bg-[#0d1117] border border-[#30363d] rounded-lg text-white font-mono focus:border-[#58a6ff] focus:outline-none"
                  placeholder="e.g. your-username"
                />
              </div>

              <div>
                <label className="text-[11px] text-[#8b949e]">Display Name</label>
                <input
                  type="text"
                  value={profileData.displayName}
                  onChange={(e) => setProfileData((p) => ({ ...p, displayName: e.target.value }))}
                  className="w-full mt-1 px-3 py-1.5 text-xs bg-[#0d1117] border border-[#30363d] rounded-lg text-white focus:border-[#58a6ff] focus:outline-none"
                  placeholder="e.g. Jane Doe"
                />
              </div>

              <div>
                <label className="text-[11px] text-[#8b949e]">Professional Headline / Role</label>
                <input
                  type="text"
                  value={profileData.headline}
                  onChange={(e) => setProfileData((p) => ({ ...p, headline: e.target.value }))}
                  className="w-full mt-1 px-3 py-1.5 text-xs bg-[#0d1117] border border-[#30363d] rounded-lg text-white focus:border-[#58a6ff] focus:outline-none"
                  placeholder="e.g. Full-Stack & AI Engineer"
                />
              </div>

              <div>
                <label className="text-[11px] text-[#8b949e]">Currently Working On</label>
                <input
                  type="text"
                  value={profileData.currentWork}
                  onChange={(e) => setProfileData((p) => ({ ...p, currentWork: e.target.value }))}
                  className="w-full mt-1 px-3 py-1.5 text-xs bg-[#0d1117] border border-[#30363d] rounded-lg text-white focus:border-[#58a6ff] focus:outline-none"
                  placeholder="e.g. building real-time AI tools"
                />
              </div>

              <div>
                <label className="text-[11px] text-[#8b949e]">Currently Learning</label>
                <input
                  type="text"
                  value={profileData.currentLearn}
                  onChange={(e) => setProfileData((p) => ({ ...p, currentLearn: e.target.value }))}
                  className="w-full mt-1 px-3 py-1.5 text-xs bg-[#0d1117] border border-[#30363d] rounded-lg text-white focus:border-[#58a6ff] focus:outline-none"
                  placeholder="e.g. LLMs & Distributed Systems"
                />
              </div>
            </div>
          </div>

          {/* Connect & Social Links Section */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 space-y-3.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
                <Share2 className="w-4 h-4 text-[#58a6ff]" />
                <span>Connect & Social Badges</span>
              </label>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#238636]/20 text-[#3fb950] border border-[#238636]/40 font-mono font-medium">
                {[profileData.linkedin, profileData.website, profileData.email, profileData.instagram, profileData.twitter].filter(Boolean).length} Active
              </span>
            </div>
            <p className="text-[11px] text-[#8b949e] leading-snug">
              Add your profiles and contact info. These generate clickable Shields.io badge pills in your GitHub README.
            </p>

            <div className="space-y-3">
              {/* LinkedIn Input */}
              <div>
                <div className="flex items-center justify-between text-[11px] text-[#8b949e]">
                  <label className="flex items-center space-x-1 text-[#58a6ff] font-medium">
                    <Linkedin className="w-3.5 h-3.5" />
                    <span>LinkedIn Profile</span>
                  </label>
                  {profileData.linkedin && (
                    <a
                      href={formatUrl(profileData.linkedin, 'linkedin')}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] text-[#58a6ff] hover:underline flex items-center space-x-0.5"
                      title="Test link destination"
                    >
                      <span>Test Link</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
                <div className="relative mt-1">
                  <input
                    type="text"
                    value={profileData.linkedin}
                    onChange={(e) => setProfileData((p) => ({ ...p, linkedin: e.target.value }))}
                    className="w-full px-3 py-1.5 text-xs bg-[#0d1117] border border-[#30363d] rounded-lg text-white placeholder-[#484f58] focus:border-[#58a6ff] focus:outline-none"
                    placeholder="https://linkedin.com/in/username or username"
                  />
                </div>
              </div>

              {/* Portfolio / Website Input */}
              <div>
                <div className="flex items-center justify-between text-[11px] text-[#8b949e]">
                  <label className="flex items-center space-x-1 text-[#3fb950] font-medium">
                    <Globe className="w-3.5 h-3.5" />
                    <span>Portfolio / Website</span>
                  </label>
                  {profileData.website && (
                    <a
                      href={formatUrl(profileData.website, 'web')}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] text-[#3fb950] hover:underline flex items-center space-x-0.5"
                      title="Test link destination"
                    >
                      <span>Test Link</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
                <div className="relative mt-1">
                  <input
                    type="text"
                    value={profileData.website}
                    onChange={(e) => setProfileData((p) => ({ ...p, website: e.target.value }))}
                    className="w-full px-3 py-1.5 text-xs bg-[#0d1117] border border-[#30363d] rounded-lg text-white placeholder-[#484f58] focus:border-[#3fb950] focus:outline-none"
                    placeholder="https://yourportfolio.dev"
                  />
                </div>
              </div>

              {/* Email Address Input */}
              <div>
                <div className="flex items-center justify-between text-[11px] text-[#8b949e]">
                  <label className="flex items-center space-x-1 text-red-400 font-medium">
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email Address (Email Me)</span>
                  </label>
                  {profileData.email && (
                    <a
                      href={formatMailto(profileData.email)}
                      className="text-[10px] text-red-400 hover:underline flex items-center space-x-0.5"
                      title="Test mailto link"
                    >
                      <span>Test Mailto</span>
                      <Send className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
                <div className="relative mt-1">
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData((p) => ({ ...p, email: e.target.value }))}
                    className="w-full px-3 py-1.5 text-xs bg-[#0d1117] border border-[#30363d] rounded-lg text-white placeholder-[#484f58] focus:border-red-400 focus:outline-none"
                    placeholder="eddardthehouesofstark@gmail.com"
                  />
                </div>
              </div>

              {/* Instagram Input */}
              <div>
                <div className="flex items-center justify-between text-[11px] text-[#8b949e]">
                  <label className="flex items-center space-x-1 text-pink-400 font-medium">
                    <Instagram className="w-3.5 h-3.5" />
                    <span>Instagram Profile</span>
                  </label>
                  {profileData.instagram && (
                    <a
                      href={formatUrl(profileData.instagram, 'instagram')}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] text-pink-400 hover:underline flex items-center space-x-0.5"
                      title="Test link destination"
                    >
                      <span>Test Link</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
                <div className="relative mt-1">
                  <input
                    type="text"
                    value={profileData.instagram}
                    onChange={(e) => setProfileData((p) => ({ ...p, instagram: e.target.value }))}
                    className="w-full px-3 py-1.5 text-xs bg-[#0d1117] border border-[#30363d] rounded-lg text-white placeholder-[#484f58] focus:border-pink-400 focus:outline-none"
                    placeholder="https://instagram.com/username or @username"
                  />
                </div>
              </div>

              {/* Twitter / X Input */}
              <div>
                <div className="flex items-center justify-between text-[11px] text-[#8b949e]">
                  <label className="flex items-center space-x-1 text-[#8b949e] hover:text-white font-medium">
                    <Twitter className="w-3.5 h-3.5" />
                    <span>X (Twitter) Profile</span>
                  </label>
                  {profileData.twitter && (
                    <a
                      href={formatUrl(profileData.twitter, 'twitter')}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] text-[#8b949e] hover:underline flex items-center space-x-0.5"
                      title="Test link destination"
                    >
                      <span>Test Link</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
                <div className="relative mt-1">
                  <input
                    type="text"
                    value={profileData.twitter}
                    onChange={(e) => setProfileData((p) => ({ ...p, twitter: e.target.value }))}
                    className="w-full px-3 py-1.5 text-xs bg-[#0d1117] border border-[#30363d] rounded-lg text-white placeholder-[#484f58] focus:border-white focus:outline-none"
                    placeholder="@handle or https://x.com/handle"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tech Stack Selector */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
                <Layers className="w-4 h-4 text-[#3fb950]" />
                <span>Tech Stack Badges ({profileData.selectedTech.length} selected)</span>
              </label>
            </div>

            {/* Category filter tabs */}
            <div className="flex space-x-1 overflow-x-auto no-scrollbar py-1">
              {[
                { id: 'all', label: 'All' },
                { id: 'languages', label: 'Langs' },
                { id: 'frontend', label: 'Frontend' },
                { id: 'backend', label: 'Backend' },
                { id: 'ai_ml', label: 'AI/ML' },
                { id: 'cloud_devops', label: 'Cloud' },
                { id: 'databases', label: 'DBs' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as any)}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-[#388bfd] text-white'
                      : 'bg-[#21262d] text-[#8b949e] hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Badge pills grid */}
            <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-1 bg-[#0d1117] rounded-lg border border-[#21262d]">
              {filteredBadges.map((badge) => {
                const isSelected = profileData.selectedTech.includes(badge.id);
                return (
                  <button
                    key={badge.id}
                    onClick={() => toggleTech(badge.id)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all flex items-center space-x-1 border ${
                      isSelected
                        ? 'bg-[#238636]/20 border-[#2ea043] text-[#3fb950]'
                        : 'bg-[#161b22] border-[#30363d] text-[#8b949e] hover:text-white hover:border-[#8b949e]'
                    }`}
                  >
                    <span>{badge.name}</span>
                    {isSelected && <Check className="w-3 h-3 ml-0.5 text-[#3fb950]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic GitHub Widgets & Stats Card Theme */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 space-y-3">
            <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
              <BarChart3 className="w-4 h-4 text-[#f0883e]" />
              <span>Dynamic Stats Cards & Theme</span>
            </label>

            <div className="grid grid-cols-2 gap-2">
              {[
                { key: 'showStats', label: 'Overall Stats Card' },
                { key: 'showTopLangs', label: 'Top Languages' },
                { key: 'showStreak', label: 'Streak Stats' },
                { key: 'showTrophies', label: 'GitHub Trophies' },
              ].map((widget) => (
                <label
                  key={widget.key}
                  className="flex items-center space-x-2 p-2 rounded-lg bg-[#0d1117] border border-[#30363d] text-xs text-[#c9d1d9] cursor-pointer hover:border-[#8b949e]"
                >
                  <input
                    type="checkbox"
                    checked={(profileData as any)[widget.key]}
                    onChange={(e) =>
                      setProfileData((p) => ({ ...p, [widget.key]: e.target.checked }))
                    }
                    className="rounded border-[#30363d] text-[#238636] focus:ring-0"
                  />
                  <span>{widget.label}</span>
                </label>
              ))}
            </div>

            <div>
              <label className="text-[11px] text-[#8b949e]">Stats Color Theme</label>
              <select
                value={profileData.statsTheme}
                onChange={(e) => setProfileData((p) => ({ ...p, statsTheme: e.target.value }))}
                className="w-full mt-1 px-3 py-1.5 text-xs bg-[#0d1117] border border-[#30363d] rounded-lg text-white focus:border-[#58a6ff] focus:outline-none"
              >
                {themes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* GitHub Actions Automation Workflows */}
          <div className="bg-[#161b22] border border-[#388bfd]/30 rounded-xl p-4 space-y-3.5 shadow-sm">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
                <Zap className="w-4 h-4 text-[#58a6ff]" />
                <span>⚡ GitHub Actions Automation</span>
              </label>
              <button
                type="button"
                onClick={() => setShowWorkflowModal(true)}
                className="text-[10px] px-2 py-0.5 rounded bg-[#388bfd]/10 hover:bg-[#388bfd]/20 text-[#58a6ff] border border-[#388bfd]/30 font-semibold flex items-center space-x-1 transition-colors"
              >
                <span>View .yml</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>

            <p className="text-[11px] text-[#8b949e] leading-relaxed">
              Enable automated CI/CD jobs that dynamically update animations, metrics, and articles on your profile:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <label className="flex items-center space-x-2 p-2.5 rounded-lg bg-[#0d1117] border border-[#30363d] text-xs text-[#c9d1d9] cursor-pointer hover:border-[#58a6ff]/50 transition-colors">
                <input
                  type="checkbox"
                  checked={profileData.showSnakeGame ?? false}
                  onChange={(e) =>
                    setProfileData((p) => ({ ...p, showSnakeGame: e.target.checked }))
                  }
                  className="rounded border-[#30363d] text-[#238636] focus:ring-0"
                />
                <div className="flex flex-col">
                  <span className="font-semibold text-white">🐍 Snake Game</span>
                  <span className="text-[10px] text-[#8b949e]">Animated contribution grid</span>
                </div>
              </label>

              <label className="flex items-center space-x-2 p-2.5 rounded-lg bg-[#0d1117] border border-[#30363d] text-xs text-[#c9d1d9] cursor-pointer hover:border-[#58a6ff]/50 transition-colors">
                <input
                  type="checkbox"
                  checked={profileData.showMetrics ?? false}
                  onChange={(e) =>
                    setProfileData((p) => ({ ...p, showMetrics: e.target.checked }))
                  }
                  className="rounded border-[#30363d] text-[#238636] focus:ring-0"
                />
                <div className="flex flex-col">
                  <span className="font-semibold text-white">📈 Metrics Engine</span>
                  <span className="text-[10px] text-[#8b949e]">Lowlighter SVG infographics</span>
                </div>
              </label>

              <label className="flex items-center space-x-2 p-2.5 rounded-lg bg-[#0d1117] border border-[#30363d] text-xs text-[#c9d1d9] cursor-pointer hover:border-[#58a6ff]/50 transition-colors">
                <input
                  type="checkbox"
                  checked={profileData.showBlogPosts ?? false}
                  onChange={(e) =>
                    setProfileData((p) => ({ ...p, showBlogPosts: e.target.checked }))
                  }
                  className="rounded border-[#30363d] text-[#238636] focus:ring-0"
                />
                <div className="flex flex-col">
                  <span className="font-semibold text-white">📝 RSS / Blog Sync</span>
                  <span className="text-[10px] text-[#8b949e]">Dev.to / Medium latest posts</span>
                </div>
              </label>

              <label className="flex items-center space-x-2 p-2.5 rounded-lg bg-[#0d1117] border border-[#30363d] text-xs text-[#c9d1d9] cursor-pointer hover:border-[#58a6ff]/50 transition-colors">
                <input
                  type="checkbox"
                  checked={profileData.showWakatime ?? false}
                  onChange={(e) =>
                    setProfileData((p) => ({ ...p, showWakatime: e.target.checked }))
                  }
                  className="rounded border-[#30363d] text-[#238636] focus:ring-0"
                />
                <div className="flex flex-col">
                  <span className="font-semibold text-white">⏱️ WakaTime Stats</span>
                  <span className="text-[10px] text-[#8b949e]">Weekly code time chart</span>
                </div>
              </label>
            </div>

            {profileData.showBlogPosts && (
              <div className="p-2.5 bg-[#0d1117] rounded-lg border border-[#30363d] space-y-1">
                <label className="text-[11px] font-semibold text-white flex items-center space-x-1">
                  <Rss className="w-3 h-3 text-[#f0883e]" />
                  <span>Blog RSS Feed URL</span>
                </label>
                <input
                  type="text"
                  value={profileData.blogRssUrl || ''}
                  onChange={(e) =>
                    setProfileData((p) => ({ ...p, blogRssUrl: e.target.value }))
                  }
                  placeholder={`https://dev.to/feed/${profileData.username || 'username'} or Medium feed`}
                  className="w-full text-xs px-2.5 py-1.5 rounded bg-[#161b22] border border-[#30363d] text-white focus:outline-none focus:border-[#58a6ff] font-mono"
                />
                <span className="text-[10px] text-[#8b949e] block">
                  Defaults to Dev.to feed for your username if left blank.
                </span>
              </div>
            )}
          </div>

          {/* Featured Projects Configuration */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
                <FolderGit2 className="w-4 h-4 text-[#58a6ff]" />
                <span>Featured Projects ({profileData.pinnedProjects.length})</span>
              </label>
              <button
                onClick={addProject}
                className="px-2 py-1 text-[11px] font-semibold rounded bg-[#21262d] hover:bg-[#30363d] text-[#58a6ff] border border-[#30363d] flex items-center space-x-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add Project</span>
              </button>
            </div>

            {/* Layout Style Switcher */}
            <div>
              <label className="text-[11px] text-[#8b949e] mb-1.5 block">Display Layout Style</label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'table', label: 'Rich Table', icon: TableIcon },
                  { id: 'grid', label: '2-Col Bento', icon: LayoutGrid },
                  { id: 'cards', label: 'GitHub Pins', icon: CreditCard },
                ].map((l) => {
                  const Icon = l.icon;
                  const isSelected = (profileData.projectLayout || 'table') === l.id;
                  return (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => setProfileData((p) => ({ ...p, projectLayout: l.id as any }))}
                      className={`px-2 py-1.5 rounded-lg border text-xs font-medium flex items-center justify-center space-x-1.5 transition-all ${
                        isSelected
                          ? 'bg-[#238636]/20 border-[#3fb950] text-[#3fb950]'
                          : 'bg-[#0d1117] border-[#30363d] text-[#8b949e] hover:border-[#8b949e] hover:text-white'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{l.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-between text-[11px] text-[#8b949e] pt-1">
              <span>Edit project details below:</span>
              <button
                onClick={() => {
                  // Quick optimize descriptions
                  setProfileData((p) => ({
                    ...p,
                    pinnedProjects: p.pinnedProjects.map((proj) => ({
                      ...proj,
                      description: proj.description.startsWith('🛡️') || proj.description.startsWith('⚡') || proj.description.startsWith('🔒') || proj.description.startsWith('🔍')
                        ? proj.description
                        : `⚡ ${proj.description}`,
                    })),
                  }));
                }}
                className="text-[#58a6ff] hover:underline flex items-center space-x-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>Format Badges</span>
              </button>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {profileData.pinnedProjects.map((proj, idx) => (
                <div key={idx} className="p-3 bg-[#0d1117] rounded-lg border border-[#30363d] space-y-2 hover:border-[#58a6ff]/40 transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={proj.name}
                      onChange={(e) => updateProject(idx, 'name', e.target.value)}
                      className="font-mono text-xs font-bold bg-transparent text-white border-b border-[#30363d] focus:border-[#58a6ff] focus:outline-none flex-1"
                      placeholder="repo-name"
                    />
                    <input
                      type="text"
                      value={proj.badge || ''}
                      onChange={(e) => updateProject(idx, 'badge', e.target.value)}
                      className="text-[10px] bg-[#161b22] px-2 py-0.5 rounded text-[#e3b341] border border-[#30363d] focus:outline-none w-24 text-center placeholder-[#484f58]"
                      placeholder="Tag / Badge"
                    />
                    <button
                      onClick={() => deleteProject(idx)}
                      className="text-red-400 hover:text-red-300 p-1"
                      title="Remove project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={proj.description}
                    onChange={(e) => updateProject(idx, 'description', e.target.value)}
                    className="w-full text-[11px] bg-transparent text-[#8b949e] border-b border-[#21262d] focus:border-[#58a6ff] focus:outline-none"
                    placeholder="Short 1-sentence value proposition"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-[#8b949e] block mb-0.5">Tech Stack</span>
                      <input
                        type="text"
                        value={proj.tech}
                        onChange={(e) => updateProject(idx, 'tech', e.target.value)}
                        className="w-full text-[10px] bg-[#161b22] px-2 py-1 rounded border border-[#30363d] text-[#58a6ff] focus:outline-none"
                        placeholder="React, TypeScript, Tailwind"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-[#8b949e] block mb-0.5">Live Demo URL</span>
                      <input
                        type="text"
                        value={proj.demoUrl}
                        onChange={(e) => updateProject(idx, 'demoUrl', e.target.value)}
                        className="w-full text-[10px] bg-[#161b22] px-2 py-1 rounded border border-[#30363d] text-[#3fb950] focus:outline-none"
                        placeholder="https://demo.com"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-0.5">
                    <div>
                      <span className="text-[10px] text-[#8b949e] block mb-0.5">Repository URL</span>
                      <input
                        type="text"
                        value={proj.repoUrl}
                        onChange={(e) => updateProject(idx, 'repoUrl', e.target.value)}
                        className="w-full text-[10px] bg-[#161b22] px-2 py-1 rounded border border-[#30363d] text-[#8b949e] focus:outline-none font-mono"
                        placeholder="https://github.com/..."
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-[#8b949e] block mb-0.5">Stars / Metric</span>
                      <input
                        type="number"
                        value={proj.stars || 0}
                        onChange={(e) => updateProject(idx, 'stars', String(parseInt(e.target.value) || 0))}
                        className="w-full text-[10px] bg-[#161b22] px-2 py-1 rounded border border-[#30363d] text-[#e3b341] focus:outline-none"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Rendered Preview / Markdown Code Tab (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden shadow-xl">
            {/* Preview Toolbar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#0d1117] border-b border-[#30363d]">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-[#f85149]" />
                <span className="w-3 h-3 rounded-full bg-[#d29922]" />
                <span className="w-3 h-3 rounded-full bg-[#2ea043]" />
                <span className="text-xs font-mono text-[#8b949e] ml-2">
                  {profileData.username} / README.md
                </span>
              </div>

              <div className="flex items-center space-x-1 bg-[#161b22] p-1 rounded-lg border border-[#30363d]">
                <button
                  onClick={() => setActiveView('preview')}
                  className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${
                    activeView === 'preview'
                      ? 'bg-[#21262d] text-white shadow-sm'
                      : 'text-[#8b949e] hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5 text-[#58a6ff]" />
                  <span>Rendered View</span>
                </button>
                <button
                  onClick={() => setActiveView('code')}
                  className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${
                    activeView === 'code'
                      ? 'bg-[#21262d] text-white shadow-sm'
                      : 'text-[#8b949e] hover:text-white'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5 text-[#3fb950]" />
                  <span>Raw Markdown</span>
                </button>
              </div>
            </div>

            {/* Content Area */}
            {activeView === 'preview' ? (
              <div className="p-6 sm:p-8 bg-[#0d1117] text-[#e6edf3] space-y-6 max-h-[800px] overflow-y-auto font-sans leading-relaxed">
                {/* Banner Preview */}
                {profileData.bannerStyle === 'typing' && (
                  <div className="text-center py-4 border-b border-[#21262d]">
                    <div className="inline-block p-4 rounded-xl bg-[#161b22] border border-[#30363d]">
                      <span className="text-xl font-bold font-mono text-[#58a6ff]">
                        Hi there, I'm {profileData.displayName || profileData.username} 👋
                      </span>
                      <p className="text-xs font-mono text-[#8b949e] mt-1">{profileData.headline}</p>
                    </div>
                  </div>
                )}

                {profileData.bannerStyle === 'capsule' && (
                  <div className="w-full py-6 px-4 bg-gradient-to-r from-blue-900/40 via-purple-900/40 to-emerald-900/40 border border-[#30363d] rounded-xl text-center">
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">
                      {profileData.displayName || profileData.username}
                    </h1>
                    <p className="text-xs text-[#58a6ff] mt-1 font-medium">{profileData.headline}</p>
                  </div>
                )}

                {profileData.bannerStyle === 'terminal' && (
                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 font-mono text-xs text-emerald-400 space-y-1">
                    <p>$ whoami</p>
                    <p className="text-white">&gt; {profileData.displayName || profileData.username} ({profileData.headline})</p>
                    <p className="text-emerald-400">$ cat focus.txt</p>
                    <p className="text-[#8b949e]">&gt; {profileData.currentWork}</p>
                  </div>
                )}

                {profileData.bannerStyle === 'minimal' && (
                  <div>
                    <h1 className="text-2xl font-bold text-white">
                      Hey there, I'm {profileData.displayName || profileData.username} 👋
                    </h1>
                    <p className="text-sm text-[#8b949e] mt-1">{profileData.headline}</p>
                  </div>
                )}

                {/* Social Badges Preview (Interactive Clickable Shields.io Pills) */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  {profileData.linkedin && (
                    <a
                      href={formatUrl(profileData.linkedin, 'linkedin')}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-[#0077b5] hover:bg-[#005885] text-white text-xs font-bold rounded flex items-center space-x-1.5 shadow-sm transition-transform hover:scale-105 group"
                      title={`Open LinkedIn: ${formatUrl(profileData.linkedin, 'linkedin')}`}
                    >
                      <Linkedin className="w-3.5 h-3.5 fill-current" />
                      <span>LinkedIn</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100" />
                    </a>
                  )}

                  {profileData.website && (
                    <a
                      href={formatUrl(profileData.website, 'web')}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-bold rounded flex items-center space-x-1.5 shadow-sm transition-transform hover:scale-105 group"
                      title={`Open Portfolio: ${formatUrl(profileData.website, 'web')}`}
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Portfolio</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100" />
                    </a>
                  )}

                  {profileData.email && (
                    <a
                      href={formatMailto(profileData.email)}
                      className="px-3 py-1.5 bg-[#d14836] hover:bg-[#b03827] text-white text-xs font-bold rounded flex items-center space-x-1.5 shadow-sm transition-transform hover:scale-105 group"
                      title={`Send email to: ${profileData.email}`}
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email Me</span>
                      <Send className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100" />
                    </a>
                  )}

                  {profileData.instagram && (
                    <a
                      href={formatUrl(profileData.instagram, 'instagram')}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-90 text-white text-xs font-bold rounded flex items-center space-x-1.5 shadow-sm transition-transform hover:scale-105 group"
                      title={`Open Instagram: ${formatUrl(profileData.instagram, 'instagram')}`}
                    >
                      <Instagram className="w-3.5 h-3.5" />
                      <span>Instagram</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100" />
                    </a>
                  )}

                  {profileData.twitter && (
                    <a
                      href={formatUrl(profileData.twitter, 'twitter')}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-black hover:bg-[#161b22] border border-[#30363d] text-white text-xs font-bold rounded flex items-center space-x-1.5 shadow-sm transition-transform hover:scale-105 group"
                      title={`Open X: ${formatUrl(profileData.twitter, 'twitter')}`}
                    >
                      <Twitter className="w-3.5 h-3.5" />
                      <span>X</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100" />
                    </a>
                  )}

                  {![profileData.linkedin, profileData.website, profileData.email, profileData.instagram, profileData.twitter].some(Boolean) && (
                    <div className="px-3 py-1.5 border border-dashed border-[#30363d] rounded-lg text-xs text-[#8b949e] flex items-center space-x-2">
                      <Share2 className="w-3.5 h-3.5 text-[#58a6ff]" />
                      <span>Configure your LinkedIn, Portfolio, Email, or Instagram in the sidebar</span>
                    </div>
                  )}
                </div>

                {/* About Me */}
                <div className="space-y-2 border-t border-[#21262d] pt-4">
                  <h3 className="text-base font-bold text-white">💫 About Me</h3>
                  <p className="text-xs text-[#8b949e] leading-relaxed">{profileData.bio}</p>
                  <ul className="text-xs text-[#c9d1d9] space-y-1.5 pt-1">
                    {profileData.currentWork && (
                      <li>🔭 I’m currently working on <strong className="text-white">{profileData.currentWork}</strong></li>
                    )}
                    {profileData.currentLearn && (
                      <li>🌱 I’m currently learning <strong className="text-white">{profileData.currentLearn}</strong></li>
                    )}
                    {profileData.askMeAbout && (
                      <li>💬 Ask me about <strong className="text-white">{profileData.askMeAbout}</strong></li>
                    )}
                  </ul>
                </div>

                {/* Tech Stack */}
                <div className="space-y-3 border-t border-[#21262d] pt-4">
                  <h3 className="text-base font-bold text-white">🛠️ Tech Stack & Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {profileData.selectedTech.map((id) => {
                      const badge = TECH_BADGES.find((b) => b.id === id);
                      if (!badge) return null;
                      return (
                        <div
                          key={id}
                          className="px-2.5 py-1 rounded text-xs font-bold text-white flex items-center space-x-1 shadow-sm"
                          style={{ backgroundColor: `#${badge.color}dd` }}
                        >
                          <span>{badge.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* GitHub Stats Live Cards */}
                {(profileData.showStats || profileData.showTopLangs || profileData.showStreak || profileData.showTrophies) && (
                  <div className="space-y-3 border-t border-[#21262d] pt-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-white">📊 GitHub Analytics & Activity</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#238636]/20 text-[#3fb950] border border-[#238636]/30 font-semibold">
                        Real-Time Live Cards
                      </span>
                    </div>

                    <div className="flex flex-col items-center space-y-4 pt-2">
                      {/* Top Row: Stats & Languages */}
                      <div className="flex flex-wrap items-center justify-center gap-3">
                        {profileData.showStats && (
                          <img
                            src={`https://github-readme-stats-eight-theta.vercel.app/api?username=${profileData.username || 'username'}&show_icons=true&theme=${profileData.statsTheme || 'tokyonight'}&hide_border=true&count_private=true&cache_seconds=1800`}
                            alt="GitHub Stats"
                            className="max-w-full rounded-lg"
                          />
                        )}
                        {profileData.showTopLangs && (
                          <img
                            src={`https://github-readme-stats-eight-theta.vercel.app/api/top-langs/?username=${profileData.username || 'username'}&layout=compact&theme=${profileData.statsTheme || 'tokyonight'}&hide_border=true&cache_seconds=1800`}
                            alt="Top Languages"
                            className="max-w-full rounded-lg"
                          />
                        )}
                      </div>

                      {/* Streak Card */}
                      {profileData.showStreak && (
                        <img
                          src={`https://streak-stats.demolab.com?user=${profileData.username || 'username'}&theme=${profileData.statsTheme || 'tokyonight'}&hide_border=true`}
                          alt="GitHub Streak"
                          className="max-w-full rounded-lg"
                        />
                      )}

                      {/* Trophies */}
                      {profileData.showTrophies && (
                        <img
                          src={`https://github-trophies.vercel.app/?username=${profileData.username || 'username'}&theme=${profileData.statsTheme || 'tokyonight'}&no-frame=true&column=4&margin_w=15`}
                          alt="GitHub Trophies"
                          className="max-w-full rounded-lg"
                        />
                      )}
                    </div>
                  </div>
                )}

                {/* GitHub Actions Automated Workflow Outputs Preview */}
                {(profileData.showSnakeGame || profileData.showMetrics || profileData.showBlogPosts || profileData.showWakatime) && (
                  <div className="space-y-4 border-t border-[#21262d] pt-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">⚡</span>
                        <h3 className="text-base font-bold text-white tracking-tight">Automated GitHub Actions</h3>
                      </div>
                      <button
                        onClick={() => setShowWorkflowModal(true)}
                        className="text-[10px] px-2 py-0.5 rounded bg-[#388bfd]/10 hover:bg-[#388bfd]/20 text-[#58a6ff] border border-[#388bfd]/30 font-semibold flex items-center space-x-1"
                      >
                        <Zap className="w-3 h-3" />
                        <span>Workflow Files (.yml)</span>
                      </button>
                    </div>

                    {/* Snake Game Preview */}
                    {profileData.showSnakeGame && (
                      <div className="p-4 bg-[#161b22] border border-[#30363d] rounded-xl space-y-2 text-center">
                        <div className="flex items-center justify-between text-xs pb-1 border-b border-[#21262d]">
                          <span className="font-semibold text-white flex items-center space-x-1">
                            <span>🐍 2026 Contribution Eating Snake</span>
                          </span>
                          <span className="text-[10px] font-mono text-[#3fb950] bg-[#238636]/10 px-1.5 py-0.5 rounded border border-[#238636]/20">
                            .github/workflows/snake.yml
                          </span>
                        </div>
                        <div className="py-2 flex items-center justify-center">
                          <img
                            src={`https://raw.githubusercontent.com/${profileData.username || 'username'}/${profileData.username || 'username'}/output/github-contribution-grid-snake-dark.svg`}
                            alt="Snake animation"
                            className="max-w-full rounded"
                            onError={(e) => {
                              // Fallback demo animation if workflow hasn't run yet in their new repo
                              (e.currentTarget as HTMLImageElement).src = 'https://raw.githubusercontent.com/Platane/snk/output/github-contribution-grid-snake-dark.svg';
                            }}
                          />
                        </div>
                        <p className="text-[10px] text-[#8b949e]">
                          Auto-generated every 24h via GitHub Actions CI and committed to your output branch.
                        </p>
                      </div>
                    )}

                    {/* GitHub Metrics Preview */}
                    {profileData.showMetrics && (
                      <div className="p-4 bg-[#161b22] border border-[#30363d] rounded-xl space-y-2 text-center">
                        <div className="flex items-center justify-between text-xs pb-1 border-b border-[#21262d]">
                          <span className="font-semibold text-white flex items-center space-x-1">
                            <span>📈 Detailed GitHub Metrics</span>
                          </span>
                          <span className="text-[10px] font-mono text-[#58a6ff] bg-[#388bfd]/10 px-1.5 py-0.5 rounded border border-[#388bfd]/20">
                            .github/workflows/metrics.yml
                          </span>
                        </div>
                        <div className="py-2 flex items-center justify-center">
                          <img
                            src={`https://raw.githubusercontent.com/${profileData.username || 'username'}/${profileData.username || 'username'}/main/github-metrics.svg`}
                            alt="GitHub Metrics"
                            className="max-w-full rounded"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = 'https://raw.githubusercontent.com/lowlighter/metrics/master/examples/metrics.classic.svg';
                            }}
                          />
                        </div>
                        <p className="text-[10px] text-[#8b949e]">
                          Generates rich SVG metrics including language breakdown, star timeline, and followings.
                        </p>
                      </div>
                    )}

                    {/* Blog RSS Sync Preview */}
                    {profileData.showBlogPosts && (
                      <div className="p-4 bg-[#161b22] border border-[#30363d] rounded-xl space-y-3">
                        <div className="flex items-center justify-between text-xs pb-1 border-b border-[#21262d]">
                          <span className="font-semibold text-white flex items-center space-x-1">
                            <Rss className="w-3.5 h-3.5 text-[#f0883e]" />
                            <span>📝 Recent Blog Posts (Auto-Synced)</span>
                          </span>
                          <span className="text-[10px] font-mono text-[#f0883e] bg-[#f0883e]/10 px-1.5 py-0.5 rounded border border-[#f0883e]/20">
                            .github/workflows/blog-posts.yml
                          </span>
                        </div>
                        <ul className="space-y-1.5 text-xs text-[#58a6ff] list-disc list-inside">
                          <li className="hover:underline cursor-pointer">
                            Building Resilient Distributed Microservices with TypeScript & Kafka
                          </li>
                          <li className="hover:underline cursor-pointer">
                            Architecting Multi-Tenant Cloud Engines on Kubernetes
                          </li>
                          <li className="hover:underline cursor-pointer">
                            10 Clean Architecture Habits for Modern Full-Stack Engineers
                          </li>
                          <li className="hover:underline cursor-pointer">
                            Optimizing React Rendering Loops for 60fps Web Performance
                          </li>
                        </ul>
                        <p className="text-[10px] text-[#8b949e]">
                          Synchronizes latest RSS articles from: <code className="text-white bg-[#0d1117] px-1 py-0.5 rounded">{profileData.blogRssUrl || `https://dev.to/feed/${profileData.username || 'username'}`}</code>
                        </p>
                      </div>
                    )}

                    {/* Wakatime Stats Preview */}
                    {profileData.showWakatime && (
                      <div className="p-4 bg-[#161b22] border border-[#30363d] rounded-xl space-y-2">
                        <div className="flex items-center justify-between text-xs pb-1 border-b border-[#21262d]">
                          <span className="font-semibold text-white flex items-center space-x-1">
                            <Clock className="w-3.5 h-3.5 text-[#a371f7]" />
                            <span>⏱️ Weekly Coding Activity</span>
                          </span>
                          <span className="text-[10px] font-mono text-[#a371f7] bg-[#a371f7]/10 px-1.5 py-0.5 rounded border border-[#a371f7]/20">
                            .github/workflows/wakatime.yml
                          </span>
                        </div>
                        <pre className="p-3 bg-[#0d1117] border border-[#21262d] rounded-lg text-xs font-mono text-[#c9d1d9] leading-relaxed overflow-x-auto">
{`TypeScript   14 hrs 32 mins   █████████████▒░░░░░░░░░░░   54.2 %
React        5 hrs 40 mins    █████▒░░░░░░░░░░░░░░░░░░░   21.1 %
Python       3 hrs 15 mins    ███▒░░░░░░░░░░░░░░░░░░░░░   12.1 %
Markdown     2 hrs 10 mins    ██▒░░░░░░░░░░░░░░░░░░░░░░    8.0 %`}
                        </pre>
                      </div>
                    )}
                  </div>
                )}

                {/* Featured Projects Dynamic Section */}
                <div className="space-y-4 border-t border-[#21262d] pt-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">🚀</span>
                      <h3 className="text-base font-bold text-white tracking-tight">Featured Projects</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#58a6ff]/10 text-[#58a6ff] border border-[#58a6ff]/20 font-mono">
                        {profileData.pinnedProjects.length} Repos
                      </span>
                    </div>

                    <div className="flex items-center space-x-1.5 self-start sm:self-auto bg-[#0d1117] p-1 rounded-lg border border-[#30363d]">
                      <button
                        type="button"
                        onClick={() => setProfileData((p) => ({ ...p, projectLayout: 'table' }))}
                        className={`px-2 py-1 rounded text-[11px] font-medium flex items-center space-x-1 transition-all ${
                          (profileData.projectLayout || 'table') === 'table'
                            ? 'bg-[#21262d] text-white shadow-sm border border-[#30363d]'
                            : 'text-[#8b949e] hover:text-white'
                        }`}
                      >
                        <TableIcon className="w-3 h-3" />
                        <span>Table</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setProfileData((p) => ({ ...p, projectLayout: 'grid' }))}
                        className={`px-2 py-1 rounded text-[11px] font-medium flex items-center space-x-1 transition-all ${
                          profileData.projectLayout === 'grid'
                            ? 'bg-[#21262d] text-white shadow-sm border border-[#30363d]'
                            : 'text-[#8b949e] hover:text-white'
                        }`}
                      >
                        <LayoutGrid className="w-3 h-3" />
                        <span>Bento Grid</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setProfileData((p) => ({ ...p, projectLayout: 'cards' }))}
                        className={`px-2 py-1 rounded text-[11px] font-medium flex items-center space-x-1 transition-all ${
                          profileData.projectLayout === 'cards'
                            ? 'bg-[#21262d] text-white shadow-sm border border-[#30363d]'
                            : 'text-[#8b949e] hover:text-white'
                        }`}
                      >
                        <CreditCard className="w-3 h-3" />
                        <span>Live Pins</span>
                      </button>
                    </div>
                  </div>

                  {/* Render based on layout style */}
                  {(profileData.projectLayout || 'table') === 'table' && (
                    <div className="border border-[#30363d] rounded-xl overflow-hidden shadow-lg bg-[#0d1117]">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead className="bg-[#161b22] text-[#8b949e] border-b border-[#30363d] font-semibold">
                            <tr>
                              <th className="py-3 px-4 w-[42%]">Project</th>
                              <th className="py-3 px-4 w-[28%]">Tech Stack</th>
                              <th className="py-3 px-4 text-center w-[15%]">Live Demo</th>
                              <th className="py-3 px-4 text-center w-[15%]">Repository</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#21262d]">
                            {profileData.pinnedProjects.map((p, i) => (
                              <tr key={i} className="hover:bg-[#161b22]/70 transition-colors group">
                                <td className="py-3.5 px-4 align-top">
                                  <div className="space-y-1">
                                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                                      <a
                                        href={p.repoUrl || '#'}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="font-bold text-white font-mono hover:text-[#58a6ff] hover:underline flex items-center space-x-1"
                                      >
                                        <span>{p.name}</span>
                                      </a>
                                      {p.badge && (
                                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#e3b341]/15 text-[#e3b341] border border-[#e3b341]/30">
                                          {p.badge}
                                        </span>
                                      )}
                                      {p.stars !== undefined && p.stars > 0 && (
                                        <span className="inline-flex items-center space-x-0.5 text-[10px] text-[#8b949e]">
                                          <Star className="w-2.5 h-2.5 text-[#e3b341] fill-[#e3b341]" />
                                          <span>{p.stars}</span>
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[11px] text-[#8b949e] leading-relaxed">
                                      {p.description}
                                    </p>
                                  </div>
                                </td>
                                <td className="py-3.5 px-4 align-top">
                                  <div className="flex flex-wrap gap-1.5">
                                    {p.tech.split(',').map((t, tidx) => (
                                      <span
                                        key={tidx}
                                        className="px-2 py-0.5 rounded bg-[#161b22] text-[#c9d1d9] border border-[#30363d] font-mono text-[10px] whitespace-nowrap"
                                      >
                                        {t.trim()}
                                      </span>
                                    ))}
                                  </div>
                                </td>
                                <td className="py-3.5 px-4 align-top text-center">
                                  {p.demoUrl ? (
                                    <a
                                      href={p.demoUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-[#238636]/15 hover:bg-[#238636]/25 text-[#3fb950] border border-[#238636]/30 text-[11px] font-semibold transition-colors"
                                    >
                                      <Globe className="w-3 h-3" />
                                      <span>Live Demo</span>
                                    </a>
                                  ) : (
                                    <span className="text-[11px] text-[#8b949e] italic">In Progress</span>
                                  )}
                                </td>
                                <td className="py-3.5 px-4 align-top text-center">
                                  {p.repoUrl ? (
                                    <a
                                      href={p.repoUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-[#388bfd]/15 hover:bg-[#388bfd]/25 text-[#58a6ff] border border-[#388bfd]/30 text-[11px] font-semibold transition-colors"
                                    >
                                      <Code2 className="w-3 h-3" />
                                      <span>Source</span>
                                    </a>
                                  ) : (
                                    <span className="text-[11px] text-[#8b949e] italic">Private</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {profileData.projectLayout === 'grid' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {profileData.pinnedProjects.map((p, i) => (
                        <div
                          key={i}
                          className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 space-y-3 hover:border-[#58a6ff]/50 transition-all shadow-md group relative"
                        >
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <h4 className="font-mono font-bold text-white text-sm group-hover:text-[#58a6ff] transition-colors">
                                  {p.name}
                                </h4>
                                {p.badge && (
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#e3b341]/15 text-[#e3b341] border border-[#e3b341]/30">
                                    {p.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-[#8b949e] leading-relaxed line-clamp-2">
                                {p.description}
                              </p>
                            </div>
                            {p.stars !== undefined && p.stars > 0 && (
                              <span className="flex items-center space-x-1 text-xs text-[#8b949e] bg-[#0d1117] px-2 py-0.5 rounded border border-[#30363d]">
                                <Star className="w-3 h-3 text-[#e3b341] fill-[#e3b341]" />
                                <span>{p.stars}</span>
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-1.5">
                            {p.tech.split(',').map((t, tidx) => (
                              <span
                                key={tidx}
                                className="px-2 py-0.5 rounded bg-[#0d1117] text-[#58a6ff] font-mono text-[10px] border border-[#21262d]"
                              >
                                {t.trim()}
                              </span>
                            ))}
                          </div>

                          <div className="pt-2 border-t border-[#21262d] flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-3">
                              {p.demoUrl && (
                                <a
                                  href={p.demoUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-[#3fb950] hover:underline font-semibold flex items-center space-x-1"
                                >
                                  <Globe className="w-3 h-3" />
                                  <span>Live Demo</span>
                                </a>
                              )}
                              {p.repoUrl && (
                                <a
                                  href={p.repoUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-[#58a6ff] hover:underline font-semibold flex items-center space-x-1"
                                >
                                  <Github className="w-3 h-3" />
                                  <span>Source Code</span>
                                </a>
                              )}
                            </div>
                            <ArrowUpRight className="w-3.5 h-3.5 text-[#8b949e] group-hover:text-white transition-colors" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {profileData.projectLayout === 'cards' && (
                    <div className="space-y-3">
                      <div className="p-3 bg-[#161b22] border border-[#30363d] rounded-xl flex flex-wrap items-center justify-center gap-3">
                        {profileData.pinnedProjects.map((p, i) => {
                          const repoName = p.name.includes('/') ? p.name.split('/')[1] : p.name;
                          return (
                            <img
                              key={i}
                              src={`https://github-readme-stats-eight-theta.vercel.app/api/pin/?username=${profileData.username || 'eddardthehouesofstark-stack'}&repo=${repoName}&theme=${profileData.statsTheme || 'tokyonight'}&hide_border=true`}
                              alt={p.name}
                              className="rounded-lg max-w-full"
                            />
                          );
                        })}
                      </div>
                      <p className="text-center text-[11px] text-[#8b949e]">
                        Rendered dynamically via live GitHub README Pin Card API
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="relative">
                <pre className="p-5 bg-[#0d1117] text-xs font-mono text-[#c9d1d9] overflow-x-auto max-h-[800px] leading-relaxed whitespace-pre-wrap selection:bg-[#388bfd]/30">
                  {markdownContent}
                </pre>
                <button
                  onClick={handleCopy}
                  className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-[#21262d] hover:bg-[#30363d] text-white text-xs font-semibold border border-[#30363d] flex items-center space-x-1.5 transition-all shadow-lg"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#3fb950]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
