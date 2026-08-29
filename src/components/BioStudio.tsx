import React, { useState } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  User, 
  Image as ImageIcon, 
  Briefcase, 
  MapPin, 
  Link, 
  Mail, 
  RefreshCw,
  Award,
  Zap,
  Globe,
  Instagram,
  Twitter,
  ExternalLink,
  Send
} from 'lucide-react';
import { ProfileData } from '../types';

interface BioStudioProps {
  profileData: ProfileData;
  setProfileData: React.Dispatch<React.SetStateAction<ProfileData>>;
}

export const BioStudio: React.FC<BioStudioProps> = ({
  profileData,
  setProfileData,
}) => {
  const [rolePreset, setRolePreset] = useState('fullstack');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  // Helper for formatting URLs
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

  const [aiBios, setAiBios] = useState<string[]>([
    '🚀 Full-Stack & AI Engineer building scalable web apps and intelligent moderation systems. React • TypeScript • Python.',
    '💻 Software Engineer passionate about developer tooling, clean architectures & open source. Currently exploring LLMs.',
    '✨ Building modern, responsive web experiences with TypeScript, React & Node.js. Always shipping & learning.',
    '🎯 Crafting robust web applications and AI workflows. Open for software engineering opportunities.'
  ]);
  const [aiHeadlines, setAiHeadlines] = useState<string[]>([
    'Full-Stack Software Engineer | React • TypeScript • Python • Cloud',
    'AI Systems & Web Developer | Building Intelligent Applications',
    'Software Engineer | Passionate about Clean Code & Open Source'
  ]);

  const presets = [
    {
      id: 'fullstack',
      label: 'Full-Stack Developer',
      bio: 'Full-Stack Engineer building modern web apps & microservices. Focused on React, TypeScript, Node.js & PostgreSQL.',
      headline: 'Full-Stack Software Engineer | React • TypeScript • Node.js',
      skills: 'TypeScript, React, Node.js, Express, PostgreSQL, Tailwind CSS',
    },
    {
      id: 'ai_ml',
      label: 'AI / ML Engineer',
      bio: 'AI Engineer crafting intelligent systems, LLM agents, and real-time inference pipelines. Python • PyTorch • Gemini.',
      headline: 'AI & Machine Learning Engineer | LLMs • Python • Cloud',
      skills: 'Python, PyTorch, Gemini API, FastAPI, Docker, Vector DBs',
    },
    {
      id: 'frontend',
      label: 'Frontend Specialist',
      bio: 'Frontend Architect crafting high-performance, accessible web applications and design systems. React • Next.js • Tailwind.',
      headline: 'Senior Frontend Engineer | UI/UX & Web Performance',
      skills: 'React, Next.js, TypeScript, Tailwind CSS, Vite, Motion',
    },
    {
      id: 'student',
      label: 'Student / Junior Dev',
      bio: 'Aspiring Software Engineer building real-world projects. Passionate about algorithms, web development & open source.',
      headline: 'Software Engineering Student | Open for Internships & Roles',
      skills: 'JavaScript, Python, React, Git, Data Structures & Algorithms',
    },
  ];

  const handleApplyPreset = (preset: typeof presets[0]) => {
    setRolePreset(preset.id);
    setProfileData((prev) => ({
      ...prev,
      bio: preset.bio,
      headline: preset.headline,
    }));
  };

  const handleGenerateWithAi = async () => {
    setIsLoadingAi(true);
    try {
      const res = await fetch('/api/ai/optimize-bio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: profileData.headline || 'Full-Stack & AI Engineer',
          focus: profileData.currentWork || 'Web development and AI apps',
          currentBio: profileData.bio,
          techStack: profileData.selectedTech.join(', '),
          targetAudience: 'Tech Recruiters & Engineering Hiring Managers',
        }),
      });

      const data = await res.json();
      if (data.bios && data.bios.length > 0) {
        setAiBios(data.bios);
      }
      if (data.headlines && data.headlines.length > 0) {
        setAiHeadlines(data.headlines);
      }
    } catch (e) {
      console.error('Failed to generate with AI:', e);
    } finally {
      setIsLoadingAi(false);
    }
  };

  const copyText = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-[#3fb950]" />
            <span>Bio, Headline & Identity Studio</span>
          </h2>
          <p className="text-xs text-[#8b949e] mt-1">
            Recruiters scan your bio and sidebar in 3 seconds. Craft a punchy 160-character bio, professional headline, and complete credentials.
          </p>
        </div>

        <button
          onClick={handleGenerateWithAi}
          disabled={isLoadingAi}
          className="px-4 py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-[#238636] to-[#1f6feb] text-white flex items-center space-x-2 shadow-md hover:opacity-90 transition-all disabled:opacity-50 self-start md:self-auto"
        >
          {isLoadingAi ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          <span>{isLoadingAi ? 'Generating Suggestions...' : 'AI Bio Polish (Gemini)'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Editor & Presets (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Quick Presets */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 space-y-3">
            <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span>1-Click Career Track Presets</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {presets.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleApplyPreset(p)}
                  className={`p-2.5 rounded-lg text-xs font-medium border text-center transition-all ${
                    rolePreset === p.id
                      ? 'bg-[#238636]/20 border-[#2ea043] text-[#3fb950]'
                      : 'bg-[#0d1117] border-[#30363d] text-[#8b949e] hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bio Form */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white">GitHub Profile Sidebar Settings</h3>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center text-[11px] text-[#8b949e]">
                  <label>Bio (Maximum 160 Characters)</label>
                  <span className={profileData.bio.length > 160 ? 'text-red-400 font-bold' : 'text-[#8b949e]'}>
                    {profileData.bio.length}/160
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={profileData.bio}
                  onChange={(e) => setProfileData((p) => ({ ...p, bio: e.target.value }))}
                  className={`w-full mt-1 p-3 text-xs bg-[#0d1117] border rounded-lg text-white focus:outline-none ${
                    profileData.bio.length > 160 ? 'border-red-500' : 'border-[#30363d] focus:border-[#58a6ff]'
                  }`}
                  placeholder="e.g. Full-Stack Developer passionate about building performant web apps & AI systems."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-[#8b949e] flex items-center space-x-1">
                    <User className="w-3 h-3 text-[#58a6ff]" />
                    <span>Display Name</span>
                  </label>
                  <input
                    type="text"
                    value={profileData.displayName}
                    onChange={(e) => setProfileData((p) => ({ ...p, displayName: e.target.value }))}
                    className="w-full mt-1 px-3 py-1.5 text-xs bg-[#0d1117] border border-[#30363d] rounded-lg text-white focus:outline-none focus:border-[#58a6ff]"
                    placeholder="e.g. Eddard Stark"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-[#8b949e] flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-red-400" />
                    <span>Location</span>
                  </label>
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => setProfileData((p) => ({ ...p, location: e.target.value }))}
                    className="w-full mt-1 px-3 py-1.5 text-xs bg-[#0d1117] border border-[#30363d] rounded-lg text-white focus:outline-none focus:border-[#58a6ff]"
                    placeholder="e.g. San Francisco, CA / Remote"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-[#8b949e] flex items-center space-x-1">
                    <Briefcase className="w-3 h-3 text-[#f0883e]" />
                    <span>Company / Status</span>
                  </label>
                  <input
                    type="text"
                    value={profileData.company}
                    onChange={(e) => setProfileData((p) => ({ ...p, company: e.target.value }))}
                    className="w-full mt-1 px-3 py-1.5 text-xs bg-[#0d1117] border border-[#30363d] rounded-lg text-white focus:outline-none focus:border-[#58a6ff]"
                    placeholder="e.g. Open to New Roles"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-[#8b949e] flex items-center space-x-1">
                    <Mail className="w-3 h-3 text-red-400" />
                    <span>Email Address (Email Me)</span>
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData((p) => ({ ...p, email: e.target.value }))}
                    className="w-full mt-1 px-3 py-1.5 text-xs bg-[#0d1117] border border-[#30363d] rounded-lg text-white focus:outline-none focus:border-red-400"
                    placeholder="eddardthehouesofstark@gmail.com"
                  />
                </div>
              </div>

              {/* Social & Contact Links */}
              <div className="pt-2 border-t border-[#21262d] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-white uppercase tracking-wider">Social Profiles & Portfolios</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-[#8b949e] flex items-center space-x-1">
                      <Link className="w-3 h-3 text-[#58a6ff]" />
                      <span>LinkedIn Profile</span>
                    </label>
                    <input
                      type="text"
                      value={profileData.linkedin}
                      onChange={(e) => setProfileData((p) => ({ ...p, linkedin: e.target.value }))}
                      className="w-full mt-1 px-3 py-1.5 text-xs bg-[#0d1117] border border-[#30363d] rounded-lg text-white focus:outline-none focus:border-[#58a6ff]"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-[#8b949e] flex items-center space-x-1">
                      <Globe className="w-3 h-3 text-[#3fb950]" />
                      <span>Portfolio / Website</span>
                    </label>
                    <input
                      type="text"
                      value={profileData.website}
                      onChange={(e) => setProfileData((p) => ({ ...p, website: e.target.value }))}
                      className="w-full mt-1 px-3 py-1.5 text-xs bg-[#0d1117] border border-[#30363d] rounded-lg text-white focus:outline-none focus:border-[#3fb950]"
                      placeholder="https://yourportfolio.dev"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-[#8b949e] flex items-center space-x-1">
                      <Instagram className="w-3 h-3 text-pink-400" />
                      <span>Instagram Profile</span>
                    </label>
                    <input
                      type="text"
                      value={profileData.instagram}
                      onChange={(e) => setProfileData((p) => ({ ...p, instagram: e.target.value }))}
                      className="w-full mt-1 px-3 py-1.5 text-xs bg-[#0d1117] border border-[#30363d] rounded-lg text-white focus:outline-none focus:border-pink-400"
                      placeholder="https://instagram.com/username or @username"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-[#8b949e] flex items-center space-x-1">
                      <Twitter className="w-3 h-3 text-[#8b949e]" />
                      <span>X (Twitter) Profile</span>
                    </label>
                    <input
                      type="text"
                      value={profileData.twitter}
                      onChange={(e) => setProfileData((p) => ({ ...p, twitter: e.target.value }))}
                      className="w-full mt-1 px-3 py-1.5 text-xs bg-[#0d1117] border border-[#30363d] rounded-lg text-white focus:outline-none focus:border-white"
                      placeholder="@handle"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Generated Bio Options */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#58a6ff]" />
              <span>Curated High-Impact Bio Variations</span>
            </h3>

            <div className="space-y-2.5">
              {aiBios.map((bio, index) => (
                <div
                  key={index}
                  className="p-3 bg-[#0d1117] border border-[#21262d] rounded-lg flex items-start justify-between gap-3 hover:border-[#30363d] transition-all group"
                >
                  <p className="text-xs text-[#c9d1d9] leading-relaxed">{bio}</p>
                  <div className="flex items-center space-x-1.5 flex-shrink-0">
                    <button
                      onClick={() => setProfileData((p) => ({ ...p, bio }))}
                      className="px-2 py-1 text-[10px] font-semibold bg-[#21262d] hover:bg-[#30363d] text-[#58a6ff] rounded border border-[#30363d]"
                    >
                      Use
                    </button>
                    <button
                      onClick={() => copyText(bio, index)}
                      className="p-1 text-[#8b949e] hover:text-white"
                      title="Copy"
                    >
                      {copiedIndex === index ? <Check className="w-3.5 h-3.5 text-[#3fb950]" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Profile Card Mockup (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 sticky top-20 shadow-xl space-y-5">
            <h3 className="text-xs font-bold text-[#8b949e] uppercase tracking-wider">
              Live GitHub Sidebar Preview
            </h3>

            {/* Avatar & Names */}
            <div className="flex flex-col items-start space-y-3">
              <div className="relative group">
                <img
                  src={profileData.avatarUrl}
                  alt="Avatar Preview"
                  className="w-44 h-44 rounded-full border-2 border-[#30363d] object-cover shadow-inner"
                />
                <span className="absolute bottom-2 right-2 p-1.5 bg-[#21262d] border border-[#30363d] rounded-full text-xs text-white shadow">
                  😊
                </span>
              </div>

              <div className="space-y-0.5">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {profileData.displayName || 'Your Full Name'}
                </h2>
                <p className="text-sm text-[#8b949e] font-mono">
                  {profileData.username || 'username'}
                </p>
              </div>
            </div>

            {/* Edit Profile Button (Mock) */}
            <button className="w-full py-1.5 text-xs font-semibold text-[#c9d1d9] bg-[#21262d] border border-[#30363d] rounded-lg">
              Edit profile
            </button>

            {/* Bio Text */}
            <div className="text-xs text-[#c9d1d9] leading-relaxed">
              {profileData.bio || 'Your 160-character elevator pitch goes here.'}
            </div>

            {/* Meta Items */}
            <div className="space-y-2 text-xs text-[#8b949e] border-t border-[#21262d] pt-4">
              {profileData.company && (
                <div className="flex items-center space-x-2">
                  <Briefcase className="w-4 h-4 text-[#8b949e] flex-shrink-0" />
                  <span className="text-white">{profileData.company}</span>
                </div>
              )}
              {profileData.location && (
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-[#8b949e] flex-shrink-0" />
                  <span className="text-white">{profileData.location}</span>
                </div>
              )}
              {profileData.website && (
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-[#3fb950] flex-shrink-0" />
                  <a
                    href={formatUrl(profileData.website, 'web')}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#3fb950] hover:underline truncate flex items-center space-x-1"
                  >
                    <span>{profileData.website.replace(/^https?:\/\//, '')}</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                  </a>
                </div>
              )}
              {profileData.linkedin && (
                <div className="flex items-center space-x-2">
                  <Link className="w-4 h-4 text-[#58a6ff] flex-shrink-0" />
                  <a
                    href={formatUrl(profileData.linkedin, 'linkedin')}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#58a6ff] hover:underline truncate flex items-center space-x-1"
                  >
                    <span>LinkedIn</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                  </a>
                </div>
              )}
              {profileData.instagram && (
                <div className="flex items-center space-x-2">
                  <Instagram className="w-4 h-4 text-pink-400 flex-shrink-0" />
                  <a
                    href={formatUrl(profileData.instagram, 'instagram')}
                    target="_blank"
                    rel="noreferrer"
                    className="text-pink-400 hover:underline truncate flex items-center space-x-1"
                  >
                    <span>Instagram</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                  </a>
                </div>
              )}
              {profileData.email && (
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <a
                    href={`mailto:${profileData.email}`}
                    className="text-white hover:text-red-400 hover:underline truncate"
                  >
                    {profileData.email}
                  </a>
                </div>
              )}
              {profileData.twitter && (
                <div className="flex items-center space-x-2">
                  <Twitter className="w-4 h-4 text-[#8b949e] flex-shrink-0" />
                  <a
                    href={formatUrl(profileData.twitter, 'twitter')}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#8b949e] hover:text-white hover:underline truncate flex items-center space-x-1"
                  >
                    <span>{profileData.twitter}</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                  </a>
                </div>
              )}
            </div>

            {/* Pro Tip Box */}
            <div className="p-3 bg-[#0d1117] border border-[#30363d] rounded-lg text-xs space-y-1 text-[#8b949e]">
              <span className="font-bold text-[#3fb950] flex items-center space-x-1">
                <Award className="w-3.5 h-3.5" />
                <span>Avatar Best Practice</span>
              </span>
              <p>
                Use a real front-facing photo with good lighting or a clean high-res 3D avatar. Avoid geometric identicons or low-res crops.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
