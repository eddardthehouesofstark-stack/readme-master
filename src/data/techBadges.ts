import { TechBadge } from '../types';

export const TECH_BADGES: TechBadge[] = [
  // Languages
  { id: 'typescript', name: 'TypeScript', category: 'languages', logo: 'typescript', color: '3178C6', badgeUrl: 'https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white' },
  { id: 'javascript', name: 'JavaScript', category: 'languages', logo: 'javascript', color: 'F7DF1E', badgeUrl: 'https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black' },
  { id: 'python', name: 'Python', category: 'languages', logo: 'python', color: '3776AB', badgeUrl: 'https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white' },
  { id: 'go', name: 'Go', category: 'languages', logo: 'go', color: '00ADD8', badgeUrl: 'https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white' },
  { id: 'rust', name: 'Rust', category: 'languages', logo: 'rust', color: '000000', badgeUrl: 'https://img.shields.io/badge/Rust-000000?style=for-the-badge&logo=rust&logoColor=white' },
  { id: 'cpp', name: 'C++', category: 'languages', logo: 'cplusplus', color: '00599C', badgeUrl: 'https://img.shields.io/badge/C%2B%2B-00599C?style=for-the-badge&logo=c%2B%2B&logoColor=white' },
  { id: 'java', name: 'Java', category: 'languages', logo: 'openjdk', color: 'ED8B00', badgeUrl: 'https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white' },
  { id: 'html5', name: 'HTML5', category: 'languages', logo: 'html5', color: 'E34F26', badgeUrl: 'https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white' },
  { id: 'css3', name: 'CSS3', category: 'languages', logo: 'css3', color: '1572B6', badgeUrl: 'https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white' },

  // Frontend
  { id: 'react', name: 'React', category: 'frontend', logo: 'react', color: '20232A', badgeUrl: 'https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB' },
  { id: 'nextjs', name: 'Next.js', category: 'frontend', logo: 'nextdotjs', color: '000000', badgeUrl: 'https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white' },
  { id: 'tailwindcss', name: 'Tailwind CSS', category: 'frontend', logo: 'tailwindcss', color: '06B6D4', badgeUrl: 'https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white' },
  { id: 'vuejs', name: 'Vue.js', category: 'frontend', logo: 'vuedotjs', color: '4FC08D', badgeUrl: 'https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vuedotjs&logoColor=white' },
  { id: 'svelte', name: 'Svelte', category: 'frontend', logo: 'svelte', color: 'FF3E00', badgeUrl: 'https://img.shields.io/badge/Svelte-FF3E00?style=for-the-badge&logo=svelte&logoColor=white' },
  { id: 'redux', name: 'Redux Toolkit', category: 'frontend', logo: 'redux', color: '593D88', badgeUrl: 'https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white' },
  { id: 'vite', name: 'Vite', category: 'frontend', logo: 'vite', color: '646CFF', badgeUrl: 'https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white' },

  // Backend
  { id: 'nodejs', name: 'Node.js', category: 'backend', logo: 'nodedotjs', color: '339933', badgeUrl: 'https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white' },
  { id: 'express', name: 'Express', category: 'backend', logo: 'express', color: '000000', badgeUrl: 'https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white' },
  { id: 'fastapi', name: 'FastAPI', category: 'backend', logo: 'fastapi', color: '009688', badgeUrl: 'https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white' },
  { id: 'django', name: 'Django', category: 'backend', logo: 'django', color: '092E20', badgeUrl: 'https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white' },
  { id: 'graphql', name: 'GraphQL', category: 'backend', logo: 'graphql', color: 'E10098', badgeUrl: 'https://img.shields.io/badge/GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white' },
  { id: 'nest', name: 'NestJS', category: 'backend', logo: 'nestjs', color: 'E0234E', badgeUrl: 'https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white' },

  // AI & ML
  { id: 'gemini', name: 'Google Gemini', category: 'ai_ml', logo: 'google', color: '8E75C4', badgeUrl: 'https://img.shields.io/badge/Google_Gemini-8E75C4?style=for-the-badge&logo=google&logoColor=white' },
  { id: 'pytorch', name: 'PyTorch', category: 'ai_ml', logo: 'pytorch', color: 'EE4C2C', badgeUrl: 'https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white' },
  { id: 'tensorflow', name: 'TensorFlow', category: 'ai_ml', logo: 'tensorflow', color: 'FF6F00', badgeUrl: 'https://img.shields.io/badge/TensorFlow-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white' },
  { id: 'langchain', name: 'LangChain', category: 'ai_ml', logo: 'chainlink', color: '1C3C3C', badgeUrl: 'https://img.shields.io/badge/LangChain-1C3C3C?style=for-the-badge&logo=chainlink&logoColor=white' },
  { id: 'huggingface', name: 'Hugging Face', category: 'ai_ml', logo: 'huggingface', color: 'FFD21E', badgeUrl: 'https://img.shields.io/badge/Hugging_Face-FFD21E?style=for-the-badge&logo=huggingface&logoColor=black' },
  { id: 'openai', name: 'OpenAI API', category: 'ai_ml', logo: 'openai', color: '412991', badgeUrl: 'https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white' },

  // Cloud & DevOps
  { id: 'docker', name: 'Docker', category: 'cloud_devops', logo: 'docker', color: '2496ED', badgeUrl: 'https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white' },
  { id: 'kubernetes', name: 'Kubernetes', category: 'cloud_devops', logo: 'kubernetes', color: '326CE5', badgeUrl: 'https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white' },
  { id: 'githubactions', name: 'GitHub Actions', category: 'cloud_devops', logo: 'githubactions', color: '2088FF', badgeUrl: 'https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white' },
  { id: 'aws', name: 'AWS', category: 'cloud_devops', logo: 'amazonwebservices', color: '232F3E', badgeUrl: 'https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazonwebservices&logoColor=white' },
  { id: 'gcp', name: 'Google Cloud', category: 'cloud_devops', logo: 'googlecloud', color: '4285F4', badgeUrl: 'https://img.shields.io/badge/Google_Cloud-4285F4?style=for-the-badge&logo=googlecloud&logoColor=white' },
  { id: 'vercel', name: 'Vercel', category: 'cloud_devops', logo: 'vercel', color: '000000', badgeUrl: 'https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white' },

  // Databases
  { id: 'postgresql', name: 'PostgreSQL', category: 'databases', logo: 'postgresql', color: '4169E1', badgeUrl: 'https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white' },
  { id: 'mongodb', name: 'MongoDB', category: 'databases', logo: 'mongodb', color: '47A248', badgeUrl: 'https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white' },
  { id: 'redis', name: 'Redis', category: 'databases', logo: 'redis', color: 'DC382D', badgeUrl: 'https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white' },
  { id: 'firebase', name: 'Firebase', category: 'databases', logo: 'firebase', color: 'FFCA28', badgeUrl: 'https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black' },
  { id: 'prisma', name: 'Prisma ORM', category: 'databases', logo: 'prisma', color: '2D3748', badgeUrl: 'https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white' },

  // Tools
  { id: 'git', name: 'Git', category: 'tools', logo: 'git', color: 'F05032', badgeUrl: 'https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white' },
  { id: 'linux', name: 'Linux', category: 'tools', logo: 'linux', color: 'FCC624', badgeUrl: 'https://img.shields.io/badge/Linux-FCC624?style=for-the-badge&logo=linux&logoColor=black' },
  { id: 'postman', name: 'Postman', category: 'tools', logo: 'postman', color: 'FF6C37', badgeUrl: 'https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white' },
  { id: 'figma', name: 'Figma', category: 'tools', logo: 'figma', color: 'F24E1E', badgeUrl: 'https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white' }
];
