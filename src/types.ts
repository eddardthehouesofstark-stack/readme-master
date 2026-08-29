export interface TechBadge {
  id: string;
  name: string;
  category: 'languages' | 'frontend' | 'backend' | 'ai_ml' | 'cloud_devops' | 'databases' | 'tools';
  logo: string;
  color: string;
  badgeUrl: string;
}

export interface PinnedRepo {
  id: string;
  name: string;
  description: string;
  tech: string[];
  stars: number;
  forks: number;
  language: string;
  languageColor: string;
  isPublic: boolean;
  liveDemoUrl?: string;
  githubUrl?: string;
  status: 'keep' | 'clean' | 'delete' | 'privatize';
  flagNote?: string;
}

export interface PinnedProject {
  name: string;
  description: string;
  tech: string;
  demoUrl: string;
  repoUrl: string;
  stars?: number;
  badge?: string; // e.g. "Featured", "AI Engine", "Open Source"
}

export interface ProfileData {
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  headline: string;
  location: string;
  company: string;
  website: string;
  twitter: string;
  linkedin: string;
  instagram: string;
  email: string;
  currentWork: string;
  currentLearn: string;
  askMeAbout: string;
  funFact: string;
  theme: string;
  selectedTech: string[];
  showStats: boolean;
  showStreak: boolean;
  showTopLangs: boolean;
  showTrophies: boolean;
  showSnakeGame?: boolean;
  showMetrics?: boolean;
  showBlogPosts?: boolean;
  blogRssUrl?: string;
  showWakatime?: boolean;
  statsTheme: string;
  bannerStyle: 'minimal' | 'modern' | 'typing' | 'terminal' | 'capsule';
  projectLayout?: 'table' | 'grid' | 'cards';
  pinnedProjects: PinnedProject[];
}

export interface AuditCategory {
  id: string;
  title: string;
  score: number; // 0-100
  weight: number;
  status: 'critical' | 'warning' | 'good';
  icon: string;
  description: string;
  issues: {
    id: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    title: string;
    current: string;
    recommendation: string;
    actionType: 'rename' | 'delete' | 'readme' | 'bio' | 'avatar' | 'pin';
    fixed?: boolean;
  }[];
}
