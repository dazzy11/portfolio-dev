import { NextResponse } from "next/server"
import { profile } from "@/data/profile"

type ContactPayload = {
  name?: string
  email?: string
  message?: string
}

export async function POST(request: Request) {
  const { name, email, message }: ContactPayload = await request
    .json()
    .catch(() => ({}))

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 })
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    // Not configured — the client falls back to a mailto: link.
    return NextResponse.json({ error: "Email service not configured." }, { status: 501 })
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>",
      to: [profile.email],
      reply_to: email,
      subject: `Portfolio contact from ${name}`,
      text: `${message}\n\n— ${name} (${email})`,
    }),
  })

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to send email." }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
