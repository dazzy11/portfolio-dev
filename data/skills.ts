export type SkillGroup = {
  title: string
  skills: string[]
}

// TODO: adjust to your real skill set — derived from your current portfolio bio.
export const skillGroups: SkillGroup[] = [
  {
    title: "Frontend",
    skills: ["React", "Next.js", "TypeScript", "JavaScript", "HTML & CSS", "Tailwind CSS"],
  },
  {
    title: "Backend",
    skills: ["Java", "Python", "Django", "Node.js", "PostgreSQL", "REST APIs"],
  },
  {
    title: "Tools & Testing",
    skills: ["Git & GitHub", "Selenium", "Vercel", "VS Code", "Figma"],
  },
]
