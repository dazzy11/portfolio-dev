import { Github, Linkedin, MapPin, Sparkles } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { Reveal } from "@/components/reveal"
import { profile } from "@/data/profile"

export function About() {
  return (
    <section id="about" className="section-padding mx-auto max-w-7xl scroll-mt-16">
      <SectionHeading number="01" eyebrow="About" title="A little about me" />

      <div className="grid gap-4 md:grid-cols-4 md:grid-rows-[auto_auto]">
        {/* Bio — the anchor tile */}
        <Reveal className="md:col-span-2 md:row-span-2">
          <div className="glass glow-border h-full rounded-xl border border-border/60 p-8">
            <p className="text-lg leading-relaxed text-muted-foreground">
              {profile.bio}
            </p>
          </div>
        </Reveal>

        {/* Monogram / portrait tile */}
        <Reveal delay={0.08}>
          <div
            className="glow-border relative flex h-full min-h-40 items-center justify-center overflow-hidden rounded-xl border border-border/60"
            style={{
              background:
                "linear-gradient(135deg, color-mix(in oklab, var(--primary) 30%, var(--card)), var(--card) 70%)",
            }}
          >
            <span className="font-display text-7xl font-semibold text-primary/90">
              {profile.firstName.charAt(0)}
            </span>
            <span className="absolute right-4 bottom-3 font-mono text-xs text-muted-foreground">
              {/* TODO: swap for a real portrait via next/image */}
              portrait soon
            </span>
          </div>
        </Reveal>

        {/* Location tile */}
        <Reveal delay={0.12}>
          <div className="glass glow-border flex h-full min-h-40 flex-col justify-between rounded-xl border border-border/60 p-6">
            <MapPin className="size-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Based in</p>
              <p className="font-display text-xl font-medium">{profile.location}</p>
            </div>
          </div>
        </Reveal>

        {/* Currently tile */}
        <Reveal delay={0.16}>
          <div className="glass glow-border flex h-full min-h-40 flex-col justify-between rounded-xl border border-border/60 p-6">
            <Sparkles className="size-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Currently</p>
              <p className="font-display text-xl font-medium">
                {profile.quickFacts.find((f) => f.label === "Currently")?.value}
              </p>
            </div>
          </div>
        </Reveal>

        {/* Socials tile */}
        <Reveal delay={0.2}>
          <div className="glass glow-border flex h-full min-h-40 items-center justify-center gap-6 rounded-xl border border-border/60 p-6">
            <a
              href={profile.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              <Github className="size-7" />
            </a>
            <a
              href={profile.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              <Linkedin className="size-7" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
