export type ExperienceItem = {
  title: string
  org: string
  period: string
  description: string
  tags?: string[]
}

// TODO: replace with your real experience — these are scaffolding entries
// inferred from your bio and contact details. Edit freely.
export const experience: ExperienceItem[] = [
  {
    title: "Software Developer",
    org: "Intechive",
    period: "2025 — Present",
    description:
      "Building full-stack web applications and shipping features across the stack.",
    tags: ["Java", "Spring Boot", "React", "Next.js"],
  },
  {
    title: "B.E. Computer Science",
    org: "K Ramakrishnan College of Technology",
    period: "2021 — 2025",
    description:
      "Computer Science undergrad, active in the campus tech community — brainstorming ideas and hyping up fellow devs.",
    tags: ["Java", "JavaScript", "Django", "Selenium"],
  },
]
