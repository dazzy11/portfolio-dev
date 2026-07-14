import { NextResponse } from "next/server"
import { knowledgeBase } from "@/lib/chat-engine"
import { profile } from "@/data/profile"

type ChatMessage = { role: "user" | "assistant"; content: string }

const SYSTEM_PROMPT = `You are the friendly portfolio assistant on ${profile.name}'s personal website. Answer visitors' questions about ${profile.firstName} using ONLY the knowledge below. Be warm, concise (2-4 sentences unless listing things), and conversational. If asked something unrelated to ${profile.firstName} or his work, politely steer back. Never invent facts not in the knowledge base — if you don't know, say so and suggest emailing ${profile.email}.

KNOWLEDGE BASE:
${knowledgeBase()}`

export async function POST(request: Request) {
  const { messages }: { messages?: ChatMessage[] } = await request
    .json()
    .catch(() => ({}))

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "messages required" }, { status: 400 })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    // Client falls back to the local retrieval engine.
    return NextResponse.json({ error: "LLM not configured" }, { status: 501 })
  }

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages: messages.slice(-12).map(({ role, content }) => ({
        role,
        content: String(content).slice(0, 2000),
      })),
    }),
  })

  if (!res.ok) {
    return NextResponse.json({ error: "LLM request failed" }, { status: 502 })
  }

  const data = await res.json()
  const reply: string =
    data?.content?.find((b: { type: string }) => b.type === "text")?.text ??
    "Sorry, I had trouble answering that."

  return NextResponse.json({ reply })
}
