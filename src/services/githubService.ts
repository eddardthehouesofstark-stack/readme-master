import { ProfileData, AuditCategory, PinnedProject } from '../types';
import { TECH_BADGES } from '../data/techBadges';

export interface LiveGitHubProfile {
  login: string;
  id: number;
  avatar_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  hireable: boolean | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface LiveGitHubRepo {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  description: string | null;
  fork: boolean;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  homepage: string | null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  has_issues: boolean;
  has_projects: boolean;
  has_downloads: boolean;
  has_wiki: boolean;
  has_pages: boolean;
  forks_count: number;
  archived: boolean;
  disabled: boolean;
  open_issues_count: number;
  license: {
    key: string;
    name: string;
    spdx_id: string;
  } | null;
  topics?: string[];
  default_branch: string;
}

export interface LiveProfileAnalysis {
  profile: LiveGitHubProfile;
  repos: LiveGitHubRepo[];
  totalStars: number;
  totalForks: number;
  languages: { name: string; count: number; percentage: number; color: string }[];
  hygieneIssues: {
    critical: { title: string; desc: string; repo?: string }[];
    warnings: { title: string; desc: string; repo?: string }[];
    passes: { title: string; desc: string }[];
  };
  calculatedScore: number;
}

const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Python: '#3572A5',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  Go: '#00ADD8',
  Rust: '#dea584',
  PHP: '#4F5D95',
  Ruby: '#701516',
  Shell: '#89e051',
  Vue: '#41b883',
  Dart: '#00B4AB',
  Kotlin: '#A97BFF',
  Swift: '#F05138',
  Solidity: '#AA6746',
};

export async function fetchLiveGitHubAnalysis(username: string): Promise<LiveProfileAnalysis> {
  const cleanUser = username.trim().replace(/^@/, '');
  if (!cleanUser) {
    throw new Error('Please enter a valid GitHub username.');
  }

  const profileRes = await fetch(`https://api.github.com/users/${encodeURIComponent(cleanUser)}`, {
    headers: {
      Accept: 'application/vnd.github.v3+json',
    },
  });

  if (!profileRes.ok) {
    if (profileRes.status === 404) {
      throw new Error(`GitHub user "@${cleanUser}" not found. Please check spelling.`);
    }
    if (profileRes.status === 403) {
      throw new Error('GitHub API rate limit exceeded. Please wait a moment or try another username.');
    }
    throw new Error(`Failed to fetch GitHub profile (${profileRes.status})`);
  }

  const profile: LiveGitHubProfile = await profileRes.json();

  const reposRes = await fetch(`https://api.github.com/users/${encodeURIComponent(cleanUser)}/repos?per_page=100&sort=updated`, {
    headers: {
      Accept: 'application/vnd.github.v3+json',
    },
  });

  const repos: LiveGitHubRepo[] = reposRes.ok ? await reposRes.json() : [];

  // Compute stats
  let totalStars = 0;
  let totalForks = 0;
  const langCounts: Record<string, number> = {};

  repos.forEach((repo) => {
    totalStars += repo.stargazers_count || 0;
    totalForks += repo.forks_count || 0;
    if (repo.language) {
      langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
    }
  });

  const totalLangRepos = Object.values(langCounts).reduce((a, b) => a + b, 0);
  const languages = Object.entries(langCounts)
    .map(([name, count]) => ({
      name,
      count,
      percentage: totalLangRepos > 0 ? Math.round((count / totalLangRepos) * 100) : 0,
      color: LANGUAGE_COLORS[name] || '#8b949e',
    }))
    .sort((a, b) => b.count - a.count);

  // Hygiene Auditing
  const critical: { title: string; desc: string; repo?: string }[] = [];
  const warnings: { title: string; desc: string; repo?: string }[] = [];
  const passes: { title: string; desc: string }[] = [];

  // 1. Check Profile Bio & Name
  if (!profile.name || profile.name.trim() === '') {
    critical.push({
      title: 'Missing Display Name',
      desc: 'Your profile has no real display name set. Recruiters search by real names.',
    });
  } else {
    passes.push({
      title: 'Real Name Configured',
      desc: `Profile name is set to "${profile.name}".`,
    });
  }

  if (!profile.bio || profile.bio.trim() === '') {
    critical.push({
      title: 'Missing GitHub Bio',
      desc: 'Your 160-character profile bio is completely blank. Add a high-impact headline.',
    });
  } else {
    passes.push({
      title: 'Profile Bio Present',
      desc: profile.bio,
    });
  }

  // 2. Check Repository Naming & Descriptions
  let reposWithoutDesc = 0;
  let reposWithoutTopics = 0;
  let reposWithoutLicense = 0;

  repos.forEach((repo) => {
    // Check toxic / test repo naming
    if (
      repo.name.toLowerCase().includes('hitrel') ||
      repo.description?.toLowerCase().includes('hitrel') ||
      repo.description?.toLowerCase().includes('hail')
    ) {
      critical.push({
        title: `Toxic/Offensive Content in "${repo.name}"`,
        desc: `Repo contains offensive or flagged text in description ("${repo.description}"). Delete or sanitize immediately!`,
        repo: repo.name,
      });
    }

    if (repo.name.includes('-zip') || repo.name.includes('test-zip')) {
      warnings.push({
        title: `Uncurated Export Suffix in "${repo.name}"`,
        desc: 'Repository name ends with "-zip", signaling raw uncurated archive uploads.',
        repo: repo.name,
      });
    }

    if (!repo.description || repo.description.trim() === '') {
      reposWithoutDesc++;
    }

    if (!repo.topics || repo.topics.length === 0) {
      reposWithoutTopics++;
    }

    if (!repo.license) {
      reposWithoutLicense++;
    }
  });

  if (reposWithoutDesc > 0) {
    warnings.push({
      title: `${reposWithoutDesc} Repositories Missing Descriptions`,
      desc: `${reposWithoutDesc} out of ${repos.length} public repos have no tagline or description.`,
    });
  } else if (repos.length > 0) {
    passes.push({
      title: 'All Repositories Documented',
      desc: 'All public repositories have descriptions.',
    });
  }

  if (reposWithoutTopics > 3) {
    warnings.push({
      title: 'Missing Topic Tags on Repositories',
      desc: 'Add GitHub topic tags (e.g., #typescript, #ai, #react) to help repos rank in GitHub search.',
    });
  }

  // Calculate live health score (0-100)
  let score = 100;
  if (critical.length > 0) score -= critical.length * 20;
  if (warnings.length > 0) score -= warnings.length * 8;
  if (profile.followers === 0) score -= 5;
  if (!profile.blog && !profile.twitter_username) score -= 5;
  if (repos.length === 0) score -= 20;
  score = Math.max(20, Math.min(100, score));

  return {
    profile,
    repos,
    totalStars,
    totalForks,
    languages,
    hygieneIssues: {
      critical,
      warnings,
      passes,
    },
    calculatedScore: score,
  };
}

/**
 * Maps live GitHub API analysis into our comprehensive ProfileData model
 */
export function convertLiveAnalysisToProfile(
  analysis: LiveProfileAnalysis,
  current?: Partial<ProfileData>
): ProfileData {
  const { profile, repos, languages } = analysis;

  // Detect top technologies from repos and languages
  const detectedTech = new Set<string>();
  
  languages.forEach((l) => {
    const matched = TECH_BADGES.find(
      (b) => b.name.toLowerCase() === l.name.toLowerCase() || b.id.toLowerCase() === l.name.toLowerCase()
    );
    if (matched) detectedTech.add(matched.name);
  });

  repos.forEach((r) => {
    if (r.topics) {
      r.topics.forEach((t) => {
        const matched = TECH_BADGES.find(
          (b) => b.id.toLowerCase() === t.toLowerCase() || b.name.toLowerCase().includes(t.toLowerCase())
        );
        if (matched) detectedTech.add(matched.name);
      });
    }
  });

  // Default fallback stack if none detected
  const fallbackStack = ['TypeScript', 'React', 'Node.js', 'Tailwind CSS', 'Docker'];
  const finalTech = detectedTech.size > 0 ? Array.from(detectedTech).slice(0, 12) : fallbackStack;

  // Extract top showcase projects sorted by stars and recency
  const sortedRepos = [...repos].sort((a, b) => {
    if (b.stargazers_count !== a.stargazers_count) {
      return (b.stargazers_count || 0) - (a.stargazers_count || 0);
    }
    return new Date(b.pushed_at || b.updated_at).getTime() - new Date(a.pushed_at || a.updated_at).getTime();
  });

  const pinnedProjects: PinnedProject[] = sortedRepos.slice(0, 4).map((r, idx) => ({
    name: r.name,
    description: r.description || `⚡ Open-source project built with ${r.language || 'modern web standards'}.`,
    tech: [r.language, ...(r.topics || [])].filter(Boolean).slice(0, 3).join(', ') || 'TypeScript, React',
    demoUrl: r.homepage || '',
    repoUrl: r.html_url,
    stars: r.stargazers_count || 0,
    badge: (r.stargazers_count || 0) > 5 ? 'Popular' : idx === 0 ? 'Featured' : 'Open Source',
  }));

  // If no repos, supply high quality starter placeholders
  if (pinnedProjects.length === 0) {
    pinnedProjects.push(
      {
        name: 'portfolio-showcase',
        description: '⚡ Interactive developer portfolio featuring high-performance animations and dark mode.',
        tech: 'TypeScript, Next.js, Tailwind CSS',
        demoUrl: profile.blog || 'https://demo.example.com',
        repoUrl: `https://github.com/${profile.login}/portfolio-showcase`,
        stars: 12,
        badge: 'Featured',
      },
      {
        name: 'cloud-api-service',
        description: '🛡️ Scalable microservice architecture with automated CI/CD and Docker containers.',
        tech: 'Node.js, Express, PostgreSQL, Docker',
        demoUrl: '',
        repoUrl: `https://github.com/${profile.login}/cloud-api-service`,
        stars: 8,
        badge: 'Backend',
      }
    );
  }

  // Derive high impact headline
  const topLang = languages[0]?.name || 'Full-Stack';
  const headline = profile.company
    ? `Software Engineer @ ${profile.company} | ${topLang} & Cloud Systems`
    : `${topLang} Developer | Building Modern Web Apps & Open Source`;

  return {
    username: profile.login,
    displayName: profile.name || profile.login,
    headline: headline,
    bio: profile.bio || `🚀 Developer passionate about building robust applications with ${languages.slice(0, 2).map((l) => l.name).join(' and ') || 'TypeScript'}.`,
    avatarUrl: profile.avatar_url || 'https://avatars.githubusercontent.com/u/267705357?v=4',
    location: profile.location || 'Remote',
    company: profile.company || 'Open to Opportunities',
    website: profile.blog || '',
    linkedin: current?.linkedin || '',
    instagram: current?.instagram || '',
    email: profile.email || current?.email || '',
    twitter: profile.twitter_username ? `@${profile.twitter_username}` : (current?.twitter || ''),
    currentWork: `Building scalable web applications & exploring modern developer tools`,
    currentLearn: `Distributed systems, AI agents & cloud architectures`,
    askMeAbout: languages.map((l) => l.name).slice(0, 3).join(', ') || 'React, TypeScript, Web Development',
    funFact: 'I enjoy turning complex problems into elegant, maintainable code.',
    theme: current?.theme || 'dark',
    selectedTech: finalTech,
    showStats: true,
    showStreak: true,
    showTopLangs: true,
    showTrophies: true,
    statsTheme: current?.statsTheme || 'tokyonight',
    bannerStyle: current?.bannerStyle || 'modern',
    projectLayout: current?.projectLayout || 'table',
    pinnedProjects: pinnedProjects,
  };
}

/**
 * Generates tailored audit checklist based on live user data
 */
export function generateAuditCategoriesFromAnalysis(analysis: LiveProfileAnalysis): AuditCategory[] {
  const { profile, repos, languages, hygieneIssues } = analysis;

  const hasName = Boolean(profile.name && profile.name.trim().length > 0);
  const hasBio = Boolean(profile.bio && profile.bio.trim().length > 0 && profile.bio.length <= 160);
  const hasLinks = Boolean(profile.blog || profile.twitter_username);
  const hasCompanyOrLocation = Boolean(profile.location || profile.company);
  const reposWithoutDesc = repos.filter((r) => !r.description || r.description.trim() === '').length;
  const reposWithoutTopics = repos.filter((r) => !r.topics || r.topics.length === 0).length;
  const toxicRepos = repos.filter(
    (r) =>
      r.name.toLowerCase().includes('hitrel') ||
      r.description?.toLowerCase().includes('hitrel') ||
      r.description?.toLowerCase().includes('hail')
  );

  return [
    {
      id: 'profile_identity',
      title: 'Identity & Recruiter First Impressions',
      weight: 25,
      score: hasName && hasBio && hasLinks ? 100 : hasName || hasBio ? 60 : 30,
      status: hasName && hasBio ? 'good' : 'warning',
      icon: 'UserCheck',
      description: 'Profile avatar, display name, 160-char bio, and recruiter contact links.',
      issues: [
        {
          id: 'avatar_quality',
          title: 'Professional Profile Avatar',
          severity: 'high',
          current: profile.avatar_url ? 'GitHub Avatar Configured' : 'Default Gravatar/Identicon',
          recommendation: 'Use a high-resolution front-facing photo or clean 3D developer avatar with good lighting.',
          fixed: Boolean(profile.avatar_url),
          actionType: 'avatar',
        },
        {
          id: 'display_name',
          title: 'Real Name & Recruiter Discoverability',
          severity: 'critical',
          current: hasName ? `Configured as "${profile.name}"` : 'Missing (Only handle shown)',
          recommendation: 'Add your full real name in GitHub profile settings so recruiters can find you in searches.',
          fixed: hasName,
          actionType: 'bio',
        },
        {
          id: 'bio_tagline',
          title: 'High-Impact 160-Character Bio',
          severity: 'high',
          current: profile.bio ? `"${profile.bio.slice(0, 45)}..."` : 'Blank / No bio',
          recommendation: 'Craft a punchy 1-2 sentence pitch highlighting your primary stack and focus areas.',
          fixed: hasBio,
          actionType: 'bio',
        },
        {
          id: 'social_contact',
          title: 'Portfolio & External Links',
          severity: 'medium',
          current: hasLinks ? 'Portfolio / Socials Present' : 'No external links',
          recommendation: 'Link your personal portfolio, LinkedIn profile, or active tech blog.',
          fixed: hasLinks,
          actionType: 'bio',
        },
      ],
    },
    {
      id: 'repo_curation',
      title: 'Repository Hygiene & Curation',
      weight: 30,
      score: toxicRepos.length > 0 ? 25 : reposWithoutDesc > 0 ? 55 : 95,
      status: toxicRepos.length > 0 ? 'critical' : reposWithoutDesc > 2 ? 'warning' : 'good',
      icon: 'Pin',
      description: 'Curation of public repositories, tagging, descriptions, and removal of junk files.',
      issues: [
        {
          id: 'toxic_repos',
          title: 'Offensive or Test Junk Content Audit',
          severity: 'critical',
          current: toxicRepos.length > 0 ? `🚨 Flagged content in ${toxicRepos[0].name}` : 'No offensive content detected',
          recommendation: 'Permanently delete or sanitize any repository containing inappropriate descriptions or code.',
          fixed: toxicRepos.length === 0,
          actionType: 'delete',
        },
        {
          id: 'repo_descriptions',
          title: 'Repository Taglines & Descriptions',
          severity: 'high',
          current: reposWithoutDesc > 0 ? `${reposWithoutDesc} repositories missing descriptions` : 'All repositories have descriptions',
          recommendation: 'Add 1-sentence value proposition descriptions to all public repositories.',
          fixed: reposWithoutDesc === 0,
          actionType: 'rename',
        },
        {
          id: 'topic_tags',
          title: 'GitHub Search Topic Tags',
          severity: 'medium',
          current: reposWithoutTopics > 2 ? `${reposWithoutTopics} repos without topic tags` : 'Topic tags populated',
          recommendation: 'Add 3-5 tags (#typescript, #react, #api) per repo to increase discoverability.',
          fixed: reposWithoutTopics <= 2,
          actionType: 'rename',
        },
      ],
    },
    {
      id: 'profile_readme',
      title: 'Profile README.md Architecture',
      weight: 25,
      score: 40,
      status: 'warning',
      icon: 'FileText',
      description: 'Special repository (username/username) hero section with tech badges and live stats.',
      issues: [
        {
          id: 'special_readme_created',
          title: `Special ${profile.login}/${profile.login} Repository`,
          severity: 'high',
          current: 'Needs generated modern README.md',
          recommendation: `Create a public repository named "${profile.login}" and commit a README.md to display on your profile.`,
          fixed: false,
          actionType: 'readme',
        },
        {
          id: 'tech_badges',
          title: 'Visual Technology Stack Badges',
          severity: 'medium',
          current: `${languages.length} languages detected`,
          recommendation: 'Display consistent shields.io badges for your core frontend, backend, and DevOps tools.',
          fixed: true,
          actionType: 'readme',
        },
        {
          id: 'showcase_projects_table',
          title: 'Featured Projects Showcase Table',
          severity: 'high',
          current: `${Math.min(repos.length, 4)} showcase projects queued`,
          recommendation: 'Include a clean markdown table linking live demo URLs and source code for your top projects.',
          fixed: false,
          actionType: 'readme',
        },
      ],
    },
    {
      id: 'activity_authority',
      title: 'Contribution & Technical Authority',
      weight: 15,
      score: analysis.totalStars > 5 ? 90 : analysis.totalStars > 0 ? 70 : 50,
      status: analysis.totalStars > 0 ? 'good' : 'warning',
      icon: 'GitCommit',
      description: 'Public contributions, repository stars, forks, and open-source authority.',
      issues: [
        {
          id: 'pinned_repos',
          title: 'Custom Pinned Repositories',
          severity: 'medium',
          current: `${repos.length} public repos available`,
          recommendation: 'Pin your top 4-6 highest quality repositories to your GitHub homepage.',
          fixed: repos.length >= 3,
          actionType: 'pin',
        },
        {
          id: 'repo_licensing',
          title: 'Open Source Licenses (MIT / Apache)',
          severity: 'medium',
          current: `${repos.filter((r) => Boolean(r.license)).length}/${repos.length} repos licensed`,
          recommendation: 'Add standard MIT licenses to all open-source repositories to invite community stars and usage.',
          fixed: repos.filter((r) => !r.license).length === 0,
          actionType: 'readme',
        },
      ],
    },
  ];
}

