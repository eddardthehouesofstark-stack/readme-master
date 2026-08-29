import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const PORT = 3000;
const app = express();

app.use(express.json({ limit: '10mb' }));

// Lazy initialize Gemini client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

// AI API: Optimize Bio & Headlines
app.post('/api/ai/optimize-bio', async (req, res) => {
  try {
    const { role, focus, currentBio, techStack, targetAudience } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Return smart programmatic suggestions if no API key
      return res.json({
        success: true,
        isAiGenerated: false,
        bios: [
          `🚀 ${role || 'Full-Stack Developer'} passionate about building performant web apps and AI systems. Focused on ${techStack || 'React, TypeScript & Node.js'}.`,
          `💻 Building resilient software & intelligent developer tooling. Constantly exploring ${focus || 'modern cloud architectures & open source'}.`,
          `✨ ${role || 'Software Engineer'} specializing in ${techStack || 'AI-driven products'}. Let's collaborate!`,
          `🎯 Crafting scalable solutions at the intersection of web tech & machine learning. Always shipping & learning.`
        ],
        headlines: [
          `${role || 'Full-Stack Software Engineer'} | ${techStack || 'React • TypeScript • Python • Cloud'}`,
          `Building Scalable AI & Web Applications | Open Source Enthusiast`,
          `Software Engineer & Problem Solver | Specialized in ${focus || 'Modern Web Architectures'}`
        ]
      });
    }

    const prompt = `You are an elite Tech Career Coach and Senior Staff Engineer reviewing a developer's GitHub profile.
Generate 4 distinct, high-impact, professional GitHub bio options (under 160 characters each) and 3 professional profile headline options.
Developer Details:
- Role/Aspiration: ${role || 'Software Developer'}
- Core Focus: ${focus || 'Full-stack development & AI applications'}
- Current Bio/Draft: ${currentBio || 'None'}
- Top Tech: ${techStack || 'TypeScript, React, Python, Node'}
- Target Audience: ${targetAudience || 'Tech Recruiters & Engineering Hiring Managers'}

Return JSON format with exact keys:
{
  "bios": ["bio 1 (max 160 chars)", "bio 2", "bio 3", "bio 4"],
  "headlines": ["headline 1", "headline 2", "headline 3"],
  "keyAdvice": "1-2 sentence pro-tip for this specific developer persona"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({
      success: true,
      isAiGenerated: true,
      ...parsed,
    });
  } catch (error: any) {
    console.error('Error optimizing bio:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate bio suggestions',
      bios: [
        '🚀 Full-Stack Engineer passionate about performant web systems and AI applications.',
        '💻 Crafting clean, scalable code with TypeScript, React, and Python.',
      ],
      headlines: [
        'Software Engineer | Full-Stack & AI Systems',
        'Building high-performance modern web applications',
      ],
    });
  }
});

// AI API: Optimize Repository Description & Tags
app.post('/api/ai/optimize-repo', async (req, res) => {
  try {
    const { repoName, currentDescription, tech, projectGoal } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        success: true,
        isAiGenerated: false,
        recommendedName: repoName.replace(/-(zip|\d+)$/gi, '').toLowerCase(),
        description: `Production-ready ${projectGoal || 'application'} built with ${tech || 'modern tech stack'}, featuring responsive UI, automated CI/CD, and robust error handling.`,
        topics: ['typescript', 'react', 'fullstack', 'open-source', 'clean-code'],
        visibilityAdvice: 'Make public with a polished README and live demo link.',
      });
    }

    const prompt = `You are a GitHub Portfolio Specialist. Transform this repository into a recruiter-ready showcase.
Repository Name: "${repoName}"
Current Description: "${currentDescription || 'None'}"
Tech / Languages: "${tech || 'JavaScript/TypeScript'}"
Project Goal / What it does: "${projectGoal || 'Application'}"

If the repo has bad patterns (like "-zip", random numbers at end like "-68", test names, or inappropriate descriptions like "all hail..."), flag it immediately and give a sanitized, professional repo name.

Return JSON:
{
  "recommendedName": "clean-kebab-case-name",
  "cleanDescription": "Punchy, action-oriented 1-sentence GitHub repo description (under 120 chars)",
  "topics": ["topic1", "topic2", "topic3", "topic4", "topic5"],
  "flags": ["warning if offensive or messy naming"],
  "featureHighlights": ["3 key bullet points for the repo README"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({
      success: true,
      isAiGenerated: true,
      ...parsed,
    });
  } catch (error: any) {
    console.error('Error optimizing repo:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// AI API: Custom Full Profile Audit & Action Plan
app.post('/api/ai/audit-profile', async (req, res) => {
  try {
    const { username, currentRepos, hasReadme, avatarType, contributionCount } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        success: true,
        score: 42,
        isAiGenerated: false,
        criticalFlags: [
          'Found duplicate and test repo suffixes (e.g. -zip, -68).',
          'Found placeholder/inappropriate repository descriptions that must be sanitized immediately.',
          'Missing custom GitHub Profile README (<username>/<username> repo).',
          'Default identicon avatar does not establish personal brand.',
        ],
        quickWins: [
          'Delete or privatize scratchpad and duplicate repos.',
          'Add a professional headshot or clean developer avatar.',
          'Create your special username repository with dynamic badges and stats.',
          'Pin your 4 best repositories with live demo links and descriptive summaries.',
        ],
      });
    }

    const prompt = `Review this GitHub developer profile details and provide an expert recruiter audit:
- Username: ${username}
- Repositories Sample: ${JSON.stringify(currentRepos)}
- Has Special Profile README: ${hasReadme}
- Avatar: ${avatarType}
- Yearly Contributions: ${contributionCount}

Evaluate on:
1. First Impressions & Brand
2. Repository Hygiene (flagging joke descriptions, duplicate zip files, dead repos)
3. Profile README Architecture
4. Pinned Repos Quality

Return JSON:
{
  "overallScore": 45, // number 0-100
  "grade": "C-",
  "summary": "Concise 2-sentence executive summary",
  "criticalFlags": ["flag 1", "flag 2"],
  "strengths": ["strength 1"],
  "stepByStepActionPlan": [
    { "phase": "Step 1: Emergency Cleanup", "action": "...", "priority": "CRITICAL" },
    { "phase": "Step 2: Profile Identity", "action": "...", "priority": "HIGH" },
    { "phase": "Step 3: Profile README", "action": "...", "priority": "HIGH" },
    { "phase": "Step 4: Pin Showcase Projects", "action": "...", "priority": "MEDIUM" },
    { "phase": "Step 5: Contribution Habit", "action": "...", "priority": "MEDIUM" }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({
      success: true,
      isAiGenerated: true,
      ...parsed,
    });
  } catch (error: any) {
    console.error('Error auditing profile:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
