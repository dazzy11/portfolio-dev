"use client"

import { useState } from "react"
import { Github, Linkedin, Mail, Send } from "lucide-react"
import { toast } from "sonner"
import { SectionHeading } from "@/components/section-heading"
import { Reveal } from "@/components/reveal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { profile } from "@/data/profile"

export function Contact() {
  const [sending, setSending] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const payload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      message: String(data.get("message") ?? ""),
    }

    setSending(true)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        toast.success("Message sent — I'll get back to you soon!")
        form.reset()
      } else if (res.status === 501) {
        // Email service not configured — fall back to the user's mail client.
        const subject = encodeURIComponent(`Portfolio contact from ${payload.name}`)
        const body = encodeURIComponent(`${payload.message}\n\n— ${payload.name} (${payload.email})`)
        window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
        toast.info("Opening your mail client instead.")
      } else {
        throw new Error(await res.text())
      }
    } catch {
      toast.error("Couldn't send the message. Email me directly instead?")
    } finally {
      setSending(false)
    }
  }

  return (
    <section id="contact" className="section-padding mx-auto max-w-7xl scroll-mt-16">
      <SectionHeading
        number="05"
        eyebrow="Contact"
        title="Let's build something"
        description="Have a project in mind, a role to fill, or just want to say hi? My inbox is open."
      />

      <div className="grid gap-12 md:grid-cols-2">
        <Reveal>
          <form onSubmit={handleSubmit} className="grid gap-5">
            <div className="grid gap-2">
              <Label htmlFor="contact-name">Name</Label>
              <Input
                id="contact-name"
                name="name"
                required
                autoComplete="name"
                placeholder="Your name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contact-email">Email</Label>
              <Input
                id="contact-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contact-message">Message</Label>
              <Textarea
                id="contact-message"
                name="message"
                required
                rows={5}
                placeholder="Tell me about it…"
              />
            </div>
            <Button type="submit" disabled={sending} className="justify-self-start">
              <Send className="size-4" />
              {sending ? "Sending…" : "Send message"}
            </Button>
          </form>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="space-y-4">
            <a
              href={`mailto:${profile.email}`}
              className="group flex items-center gap-4 rounded-lg border border-border/60 bg-card/50 p-4 transition-colors hover:border-primary/40"
            >
              <Mail className="size-5 text-primary" />
              <span className="text-sm break-all group-hover:text-foreground">
                {profile.email}
              </span>
            </a>
            <a
              href={profile.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-lg border border-border/60 bg-card/50 p-4 transition-colors hover:border-primary/40"
            >
              <Linkedin className="size-5 text-primary" />
              <span className="text-sm">LinkedIn Profile</span>
            </a>
            <a
              href={profile.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-lg border border-border/60 bg-card/50 p-4 transition-colors hover:border-primary/40"
            >
              <Github className="size-5 text-primary" />
              <span className="text-sm">GitHub Profile</span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
