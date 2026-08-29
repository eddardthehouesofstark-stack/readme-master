import { ProfileData } from '../types';
import { TECH_BADGES } from '../data/techBadges';

export function generateProfileReadmeMarkdown(data: ProfileData): string {
  const selectedBadges = TECH_BADGES.filter((b) => data.selectedTech.includes(b.id));

  // Categorize selected badges
  const languages = selectedBadges.filter((b) => b.category === 'languages');
  const frontend = selectedBadges.filter((b) => b.category === 'frontend');
  const backend = selectedBadges.filter((b) => b.category === 'backend');
  const aiml = selectedBadges.filter((b) => b.category === 'ai_ml');
  const cloud = selectedBadges.filter((b) => b.category === 'cloud_devops');
  const databases = selectedBadges.filter((b) => b.category === 'databases');
  const tools = selectedBadges.filter((b) => b.category === 'tools');

  const name = data.displayName || data.username || 'Developer';
  const headline = data.headline || 'Full-Stack Developer and AI Systems Engineer';
  const username = data.username || 'your-username';

  // Helper to sanitize text destined for SVG generators (capsule-render, typing-svg)
  // Replaces XML-breaking characters like '&' which cause 'xmlParseEntityRef: no name' errors
  const cleanForSvg = (str: string) => {
    if (!str) return '';
    return str
      .replace(/&/g, 'and')
      .replace(/;/g, ',')
      .replace(/[<>"]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  // 1. Header Banner
  let bannerSection = '';
  if (data.bannerStyle === 'typing') {
    const line1 = cleanForSvg(`Hi there, I'm ${name} 👋`);
    const line2 = cleanForSvg(headline);
    const line3 = cleanForSvg(data.currentWork ? `Building: ${data.currentWork}` : 'Passionate about Open Source and Clean Code');
    bannerSection = `<div align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=24&pause=1000&color=58A6FF&center=true&vCenter=true&width=600&lines=${encodeURIComponent(line1)};${encodeURIComponent(line2)};${encodeURIComponent(line3)}" alt="Typing SVG" />
</div>\n\n`;
  } else if (data.bannerStyle === 'capsule') {
    const cleanName = cleanForSvg(name);
    const cleanHeadline = cleanForSvg(headline);
    bannerSection = `<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=auto&height=180&section=header&text=${encodeURIComponent(cleanName)}&fontSize=38&fontColor=ffffff&desc=${encodeURIComponent(cleanHeadline)}&descSize=16&descAlignY=68&descAlign=50" alt="${cleanName} Header Banner"/>
</div>\n\n`;
  } else if (data.bannerStyle === 'terminal') {
    bannerSection = `\`\`\`bash
$ whoami
> ${name} (${headline})
$ cat location.txt
> ${data.location || 'Earth'}
$ echo $STATUS
> "${data.company || 'Open to high-impact opportunities'}"
\`\`\`\n\n`;
  } else {
    bannerSection = `<div align="center">
  <h1>👋 Hey there, I'm <a href="https://github.com/${username}">${name}</a></h1>
  <p><strong>${headline}</strong></p>
</div>\n\n`;
  }

  // 2. Social Pills - Use pure HTML <a><img /></a> to prevent raw markdown leaks inside centered blocks on GitHub
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

  const socialLinks: string[] = [];

  if (data.linkedin) {
    const url = formatUrl(data.linkedin, 'linkedin');
    socialLinks.push(`  <a href="${url}" target="_blank">\n    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" />\n  </a>`);
  }
  if (data.website) {
    const url = formatUrl(data.website, 'web');
    socialLinks.push(`  <a href="${url}" target="_blank">\n    <img src="https://img.shields.io/badge/Portfolio-238636?style=for-the-badge&logo=google-chrome&logoColor=white" alt="Portfolio" />\n  </a>`);
  }
  if (data.email) {
    const email = data.email.trim();
    socialLinks.push(`  <a href="mailto:${email}">\n    <img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Email" />\n  </a>`);
  }
  if (data.instagram) {
    const url = formatUrl(data.instagram, 'instagram');
    socialLinks.push(`  <a href="${url}" target="_blank">\n    <img src="https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white" alt="Instagram" />\n  </a>`);
  }
  if (data.twitter) {
    const url = formatUrl(data.twitter, 'twitter');
    socialLinks.push(`  <a href="${url}" target="_blank">\n    <img src="https://img.shields.io/badge/X-000000?style=for-the-badge&logo=x&logoColor=white" alt="X" />\n  </a>`);
  }

  let socialPills = '';
  if (socialLinks.length > 0) {
    socialPills = `<p align="center">\n${socialLinks.join('\n')}\n</p>\n\n`;
  }

  // 3. About Me Section
  let aboutSection = `### 💫 About Me\n\n`;
  aboutSection += `${data.bio || 'Software engineer passionate about building high-performance web applications and intelligent systems.'}\n\n`;
  if (data.currentWork) aboutSection += `- 🔭 I’m currently working on **${data.currentWork}**\n`;
  if (data.currentLearn) aboutSection += `- 🌱 I’m currently learning **${data.currentLearn}**\n`;
  if (data.askMeAbout) aboutSection += `- 💬 Ask me about **${data.askMeAbout}**\n`;
  if (data.funFact) aboutSection += `- ⚡ Fun fact: **${data.funFact}**\n`;
  aboutSection += `\n---\n\n`;

  // 4. Tech Stack Section
  let techStackSection = `### 🛠️ Tech Stack & Skills\n\n`;
  
  const renderBadgeRow = (categoryTitle: string, badges: typeof selectedBadges) => {
    if (badges.length === 0) return '';
    const badgeImgs = badges.map((b) => `<img src="${b.badgeUrl}" alt="${b.name}" height="28" style="margin-right: 4px; margin-bottom: 4px;" />`).join(' ');
    return `**${categoryTitle}**\n<p align="left">\n  ${badgeImgs}\n</p>\n\n`;
  };

  techStackSection += renderBadgeRow('Languages', languages);
  techStackSection += renderBadgeRow('Frontend Development', frontend);
  techStackSection += renderBadgeRow('Backend & APIs', backend);
  techStackSection += renderBadgeRow('AI & Machine Learning', aiml);
  techStackSection += renderBadgeRow('Cloud & DevOps', cloud);
  techStackSection += renderBadgeRow('Databases & Storage', databases);
  techStackSection += renderBadgeRow('Tools & Workflows', tools);

  techStackSection += `---\n\n`;

  // 5. Dynamic GitHub Analytics & Activity Section
  let statsSection = '';
  const theme = data.statsTheme || 'tokyonight';
  const hasAnyStats = data.showStats || data.showTopLangs || data.showStreak || data.showTrophies;

  if (hasAnyStats) {
    statsSection = `### 📊 GitHub Analytics & Activity\n\n<div align="center">\n`;
    
    // Top Row: Stats Card & Top Languages (Using high-availability verified GitHub stats mirror)
    const topRowImages: string[] = [];
    if (data.showStats) {
      topRowImages.push(`  <a href="https://github.com/${username}">\n    <img src="https://github-readme-stats-eight-theta.vercel.app/api?username=${username}&show_icons=true&theme=${theme}&hide_border=true&count_private=true&cache_seconds=1800" alt="${username}'s GitHub stats" height="150"/>\n  </a>`);
    }
    if (data.showTopLangs) {
      topRowImages.push(`  <a href="https://github.com/${username}">\n    <img src="https://github-readme-stats-eight-theta.vercel.app/api/top-langs/?username=${username}&layout=compact&theme=${theme}&hide_border=true&cache_seconds=1800" alt="Top Languages" height="150"/>\n  </a>`);
    }

    if (topRowImages.length > 0) {
      statsSection += `${topRowImages.join('\n')}\n`;
    }

    // Streak Stats (Using active and reliable demolab service)
    if (data.showStreak) {
      statsSection += `  <br/><br/>\n  <a href="https://github.com/${username}">\n    <img src="https://streak-stats.demolab.com?user=${username}&theme=${theme}&hide_border=true" alt="${username}'s Streak" />\n  </a>\n`;
    }

    // GitHub Trophies (Using active github-trophies service)
    if (data.showTrophies) {
      statsSection += `  <br/><br/>\n  <a href="https://github.com/${username}">\n    <img src="https://github-trophies.vercel.app/?username=${username}&theme=${theme}&no-frame=true&column=4&margin_w=15" alt="${username}'s Trophies" />\n  </a>\n`;
    }

    statsSection += `</div>\n\n---\n\n`;
  }

  // 6. GitHub Actions Dynamic Automations (Snake Game, Metrics, Blog RSS, Wakatime)
  let actionsSection = '';
  if (data.showSnakeGame || data.showMetrics || data.showBlogPosts || data.showWakatime) {
    actionsSection += `### ⚡ Automated GitHub Workflows & Activity\n\n`;

    if (data.showSnakeGame) {
      actionsSection += `<!-- 🐍 Contribution Snake Game (Powered by GitHub Actions) -->\n`;
      actionsSection += `<picture>\n`;
      actionsSection += `  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/${username}/${username}/output/github-contribution-grid-snake-dark.svg" />\n`;
      actionsSection += `  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/${username}/${username}/output/github-contribution-grid-snake.svg" />\n`;
      actionsSection += `  <img alt="GitHub Contribution Snake Animation" src="https://raw.githubusercontent.com/${username}/${username}/output/github-contribution-grid-snake.svg" width="100%" />\n`;
      actionsSection += `</picture>\n\n`;
    }

    if (data.showMetrics) {
      actionsSection += `<!-- 📈 GitHub Metrics (Powered by GitHub Actions lowlighter/metrics) -->\n`;
      actionsSection += `<div align="center">\n`;
      actionsSection += `  <img src="https://raw.githubusercontent.com/${username}/${username}/main/github-metrics.svg" alt="GitHub Metrics" width="100%" />\n`;
      actionsSection += `</div>\n\n`;
    }

    if (data.showBlogPosts) {
      actionsSection += `#### 📝 Recent Blog Posts & Writing\n`;
      actionsSection += `<!-- BLOG-POST-LIST:START -->\n`;
      actionsSection += `- [Building Scalable Full-Stack Systems with Next.js & TypeScript](https://dev.to)\n`;
      actionsSection += `- [How I Automated My GitHub Profile with Custom GitHub Actions](https://medium.com)\n`;
      actionsSection += `- [Clean Architecture Patterns in Modern TypeScript](https://hashnode.com)\n`;
      actionsSection += `<!-- BLOG-POST-LIST:END -->\n\n`;
    }

    if (data.showWakatime) {
      actionsSection += `#### ⏱️ Weekly Coding Activity\n`;
      actionsSection += `<!--START_SECTION:waka-->\n`;
      actionsSection += `\`\`\`text\n`;
      actionsSection += `TypeScript   14 hrs 32 mins   █████████████▒░░░░░░░░░░░   54.2 %\n`;
      actionsSection += `React        5 hrs 40 mins    █████▒░░░░░░░░░░░░░░░░░░░   21.1 %\n`;
      actionsSection += `Python       3 hrs 15 mins    ███▒░░░░░░░░░░░░░░░░░░░░░   12.1 %\n`;
      actionsSection += `Markdown     2 hrs 10 mins    ██▒░░░░░░░░░░░░░░░░░░░░░░    8.0 %\n`;
      actionsSection += `\`\`\`\n`;
      actionsSection += `<!--END_SECTION:waka-->\n\n`;
    }

    actionsSection += `---\n\n`;
  }

  // 7. Featured Projects (Dynamic & Enhanced)
  let projectsSection = `### 🚀 Featured Projects\n\n`;
  const layout = data.projectLayout || 'table';

  if (layout === 'cards') {
    // Dynamic GitHub Pin Cards (using reliable pin card service)
    projectsSection += `<div align="center">\n`;
    (data.pinnedProjects || []).forEach((proj) => {
      const repoName = proj.name.includes('/') ? proj.name.split('/')[1] : proj.name;
      projectsSection += `  <a href="${proj.repoUrl || `https://github.com/${username}/${repoName}`}">\n    <img src="https://github-readme-stats-eight-theta.vercel.app/api/pin/?username=${username}&repo=${repoName}&theme=${theme}&hide_border=true" alt="${proj.name}" />\n  </a>\n`;
    });
    projectsSection += `</div>\n\n`;
  } else if (layout === 'grid') {
    // Modern Responsive 2-Column HTML Grid
    projectsSection += `<table>\n  <tr>\n`;
    (data.pinnedProjects || []).forEach((proj, idx) => {
      const techBadges = proj.tech
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
        .map((t) => `\`${t}\``)
        .join(' ');

      const demoLink = proj.demoUrl ? `<a href="${proj.demoUrl}" target="_blank"><b>🌐 Live Demo</b></a>` : `<i>In Progress</i>`;
      const repoLink = proj.repoUrl ? `<a href="${proj.repoUrl}" target="_blank"><b>💻 Source Code</b></a>` : `<i>Private</i>`;

      if (idx > 0 && idx % 2 === 0) {
        projectsSection += `  </tr>\n  <tr>\n`;
      }

      projectsSection += `    <td width="50%" valign="top">\n`;
      projectsSection += `      <h3 align="left"><b>${proj.name}</b></h3>\n`;
      projectsSection += `      <p>${proj.description}</p>\n`;
      projectsSection += `      <p><b>Tech:</b> ${techBadges}</p>\n`;
      projectsSection += `      <p>${demoLink} &nbsp;•&nbsp; ${repoLink}</p>\n`;
      projectsSection += `    </td>\n`;
    });
    // Fill empty cell if odd number of projects
    if ((data.pinnedProjects || []).length % 2 !== 0) {
      projectsSection += `    <td width="50%"></td>\n`;
    }
    projectsSection += `  </tr>\n</table>\n\n`;
  } else {
    // Enhanced Clean Markdown Table with tech badges & rich links
    projectsSection += `| Project | Tech Stack | Live Demo | Repository |\n`;
    projectsSection += `| :--- | :--- | :---: | :---: |\n`;
    (data.pinnedProjects || []).forEach((proj) => {
      const techBadges = proj.tech
        .split(',')
        .map((t) => `\`${t.trim()}\``)
        .join(' ');
      const demoCell = proj.demoUrl ? `[🌐 **Live Demo**](${proj.demoUrl})` : `_In Progress_`;
      const repoCell = proj.repoUrl ? `[💻 **Source**](${proj.repoUrl})` : `_Private_`;
      const badgeTag = proj.badge ? ` \`${proj.badge}\`` : '';
      projectsSection += `| **${proj.name}**${badgeTag}<br/>${proj.description} | ${techBadges} | ${demoCell} | ${repoCell} |\n`;
    });
    projectsSection += `\n`;
  }

  projectsSection += `---\n\n`;

  // 8. Footer Wave Banner
  let footerSection = `<p align="center">\n  <img src="https://capsule-render.vercel.app/api?type=waving&color=auto&height=80&section=footer" width="100%"/>\n</p>`;

  return `${bannerSection}${socialPills}${aboutSection}${techStackSection}${statsSection}${actionsSection}${projectsSection}${footerSection}`;
}

export function getSnakeWorkflowYaml(username: string = 'your-username'): string {
  return `name: Generate Contribution Snake

on:
  # Run automatically every 24 hours at midnight
  schedule:
    - cron: "0 0 * * *"
  
  # Allows you to manually trigger the workflow from the Actions tab
  workflow_dispatch:

  # Run on every push on the main branch
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest
    timeout-minutes: 10

    permissions:
      contents: write

    steps:
      # Generates a snake game from a github user (<github_user_name>) contributions graph
      - name: Generate github-contribution-grid-snake.svg
        uses: Platane/snk/svg-only@v3
        with:
          github_user_name: ${username}
          outputs: |
            dist/github-contribution-grid-snake.svg
            dist/github-contribution-grid-snake-dark.svg?palette=github-dark

      # Push the content of <build_dir> to a branch
      # The content will be available at https://raw.githubusercontent.com/<github_user>/<repository>/<target_branch>/<file>
      - name: Push github-contribution-grid-snake.svg to the output branch
        uses: crazy-max/ghaction-github-pages@v3.1.0
        with:
          target_branch: output
          build_dir: dist
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
`;
}

export function getMetricsWorkflowYaml(username: string = 'your-username'): string {
  return `name: GitHub Metrics

on:
  # Schedule updates (each 12 hours)
  schedule: [{cron: "0 */12 * * *"}]
  # Lines below let you run workflow manually and on each commit
  workflow_dispatch:
  push: {branches: ["main"]}

jobs:
  github-metrics:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: lowlighter/metrics@latest
        with:
          token: \${{ secrets.METRICS_TOKEN }}
          user: ${username}
          template: classic
          base: header, activity, community, repositories, metadata
          config_timezone: America/New_York
          plugin_languages: yes
          plugin_languages_colors: github
          plugin_languages_limit: 8
          plugin_languages_recent_load: 300
          plugin_languages_sections: most-used
          plugin_lines: yes
          plugin_isocalendar: yes
          plugin_isocalendar_duration: full-year
`;
}

export function getBlogPostWorkflowYaml(feedUrl: string = 'https://dev.to/feed/your-username'): string {
  return `name: Latest Blog Posts

on:
  schedule:
    # Runs every hour
    - cron: '0 * * * *'
  workflow_dispatch:

permissions:
  contents: write

jobs:
  update-readme-with-blog:
    name: Update this repo's README with latest blog posts
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Pull RSS Feed
        uses: gautamkrishnar/blog-post-workflow@v1
        with:
          feed_list: "${feedUrl}"
          max_post_count: 5
`;
}

export function getWakatimeWorkflowYaml(): string {
  return `name: WakaTime Stats Update

on:
  schedule:
    # Runs at 00:00 UTC every day
    - cron: '0 0 * * *'
  workflow_dispatch:

permissions:
  contents: write

jobs:
  update-readme:
    name: Update Readme with WakaTime Stats
    runs-on: ubuntu-latest
    steps:
      - uses: athul/waka-readme@master
        with:
          WAKATIME_API_KEY: \${{ secrets.WAKATIME_API_KEY }}
          SHOW_TITLE: true
          BLOCKS: ->
          TIME_RANGE: last_7_days
          SHOW_TIME: true
          SHOW_TOTAL: true
`;
}

export function generateRepoReadmeMarkdown(
  repoName: string,
  tagline: string,
  techStack: string[],
  features: string[],
  installCmd: string = 'npm install && npm run dev'
): string {
  const badges = techStack
    .map((t) => `![${t}](https://img.shields.io/badge/${encodeURIComponent(t)}-238636?style=flat-square)`)
    .join(' ');

  return `# ${repoName}

> ${tagline}

${badges} ![License](https://img.shields.io/badge/license-MIT-blue.svg) ![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

---

## 🌟 Highlights & Key Features

${features.map((f) => `- **${f.split(':')[0]}**: ${f.split(':')[1] || f}`).join('\n')}

---

## 🚀 Quickstart & Setup

Follow these steps to run the project locally:

\`\`\`bash
# 1. Clone the repository
git clone https://github.com/your-username/${repoName}.git

# 2. Navigate to project directory
cd ${repoName}

# 3. Install dependencies and start development server
${installCmd}
\`\`\`

---

## 🏗️ Architecture & Tech Stack

- **Frontend / UI**: Modern responsive design with clean component hierarchy
- **Backend / Engine**: Low-latency endpoints with robust input validation
- **Testing & CI**: Automated workflows for test passes & linting

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](../../issues).

## 📄 License

This project is [MIT](../../LICENSE) licensed.
`;
}
