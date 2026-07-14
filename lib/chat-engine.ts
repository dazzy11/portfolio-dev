import { profile } from "@/data/profile"
import { projects } from "@/data/projects"
import { experience } from "@/data/experience"
import { skillGroups } from "@/data/skills"

/** Local retrieval engine — keyword-scored intents over the data layer.
 *  Used as the zero-config fallback when no LLM key is configured. */

type Intent = {
  keywords: string[]
  answer: () => string
}

const skillsSummary = () =>
  skillGroups.map((g) => `${g.title}: ${g.skills.join(", ")}`).join("\n")

const projectsSummary = () =>
  projects
    .map((p) => `• ${p.title} (${p.headline}) — ${p.description}`)
    .join("\n\n")

const intents: Intent[] = [
  {
    keywords: ["hi", "hello", "hey", "yo", "sup", "morning", "evening"],
    answer: () =>
      `Hey! I'm ${profile.firstName}'s portfolio assistant. Ask me about his skills, projects, experience, or how to get in touch.`,
  },
  {
    keywords: ["who", "about", "bio", "introduce", "yourself", "deepak", "background"],
    answer: () => profile.bio,
  },
  {
    keywords: ["skill", "stack", "tech", "technology", "language", "tool", "framework", "java", "react", "next"],
    answer: () => `Here's ${profile.firstName}'s stack:\n\n${skillsSummary()}`,
  },
  {
    keywords: ["project", "built", "build", "work", "portfolio", "app", "nextstep", "helios", "mockmate"],
    answer: () => `${profile.firstName} has built:\n\n${projectsSummary()}\n\nOpen any project card for the full story.`,
  },
  {
    keywords: ["experience", "job", "career", "company", "intechive", "college", "education", "study"],
    answer: () =>
      experience
        .map((e) => `• ${e.period}: ${e.title} at ${e.org} — ${e.description}`)
        .join("\n\n"),
  },
  {
    keywords: ["contact", "email", "reach", "hire", "hiring", "touch", "talk", "connect", "linkedin", "github", "social"],
    answer: () =>
      `You can reach ${profile.firstName} at ${profile.email}, or find him on GitHub (${profile.socials.github}) and LinkedIn (${profile.socials.linkedin}). The contact form below works too!`,
  },
  {
    keywords: ["resume", "cv", "download"],
    answer: () => `You can grab ${profile.firstName}'s resume here: ${profile.resumeUrl}`,
  },
  {
    keywords: ["where", "location", "based", "city", "live", "country"],
    answer: () => `${profile.firstName} is based in ${profile.location}.`,
  },
  {
    keywords: ["thank", "thanks", "cool", "nice", "awesome", "great"],
    answer: () => "Anytime! Anything else you'd like to know?",
  },
]

export function localAnswer(message: string): string {
  const words = message.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean)

  let best: Intent | null = null
  let bestScore = 0
  for (const intent of intents) {
    const score = intent.keywords.filter((k) =>
      words.some((w) => w === k || w.startsWith(k))
    ).length
    if (score > bestScore) {
      bestScore = score
      best = intent
    }
  }

  if (best) return best.answer()
  return `I'm a simple assistant, so that one's beyond me — but I can tell you about ${profile.firstName}'s skills, projects, experience, or how to contact him. Try one of those!`
}

export const suggestedQuestions = [
  "What has Deepak built?",
  "What's his tech stack?",
  "How can I contact him?",
]

/** Serialized knowledge for the LLM system prompt (server-side). */
export function knowledgeBase(): string {
  return [
    `Name: ${profile.name}`,
    `Role: ${profile.role}`,
    `Tagline: ${profile.tagline}`,
    `Bio: ${profile.bio}`,
    `Location: ${profile.location}`,
    `Email: ${profile.email}`,
    `Resume: ${profile.resumeUrl}`,
    `GitHub: ${profile.socials.github}`,
    `LinkedIn: ${profile.socials.linkedin}`,
    ``,
    `Skills:\n${skillsSummary()}`,
    ``,
    `Experience:\n${experience
      .map((e) => `- ${e.period}: ${e.title} at ${e.org}. ${e.description}`)
      .join("\n")}`,
    ``,
    `Projects:\n${projects
      .map(
        (p) =>
          `- ${p.title} (${p.headline}): ${p.description} Stack: ${p.stack.join(", ")}. ${
            p.links.live ? `Live: ${p.links.live}. ` : ""
          }${p.links.repo ? `Repo: ${p.links.repo}.` : ""}`
      )
      .join("\n")}`,
  ].join("\n")
}
