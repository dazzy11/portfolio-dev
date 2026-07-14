export type Project = {
  slug: string
  title: string
  headline: string
  description: string
  problem: string
  stack: string[]
  links: {
    live?: string
    repo?: string
  }
  accent?: string
}

export const projects: Project[] = [
  {
    slug: "nextstep",
    title: "NextStep",
    headline: "AI Career Navigator",
    description:
      "NextStep is a career-driven navigator platform. It offers features like AI-powered resume analysis and a virtual career assistant to guide users through their journey to success.",
    problem:
      "Job seekers struggle to understand how their resume reads to recruiters and where to go next — NextStep turns that guesswork into guided, AI-assisted steps.",
    stack: ["React", "Next.js", "TypeScript", "PostgreSQL"],
    links: {
      repo: "https://github.com/dazzy11/NextStep-AI-Career-Navigator",
    },
  },
  {
    slug: "helios",
    title: "Helios",
    headline: "All-in-one solar platform",
    description:
      "Helios is an all-in-one solar platform designed to optimize your solar investment experience. It provides comprehensive data, interactive maps, the latest news, and savings calculations.",
    problem:
      "Evaluating a solar investment means juggling scattered data — Helios brings maps, pricing data, and ROI calculations into one place.",
    stack: ["React", "Next.js", "TypeScript", "PostgreSQL"],
    links: {
      repo: "https://github.com/dazzy11/HelioROI",
    },
  },
  {
    slug: "mockmate",
    title: "MockMate",
    headline: "AI interview simulator",
    description:
      "MockMate is an AI-powered interview preparation platform. It offers personalized feedback and real-time performance insights, empowering users to confidently tackle any technical interview with ease.",
    problem:
      "Practicing interviews alone gives you zero feedback — MockMate simulates the real thing and tells you exactly how you did.",
    stack: ["React", "Next.js", "TypeScript"],
    links: {
      live: "https://mock-mate-ai-interview-simulator.vercel.app/",
      repo: "https://github.com/dazzy11/mockmate1",
    },
  },
]

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug)
}
