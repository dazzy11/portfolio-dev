import { SectionHeading } from "@/components/section-heading"
import { Reveal } from "@/components/reveal"
import { Badge } from "@/components/ui/badge"
import { skillGroups } from "@/data/skills"

const allSkills = skillGroups.flatMap((group) => group.skills)

function MarqueeRow({
  items,
  direction = "left",
  duration = 30,
}: {
  items: string[]
  direction?: "left" | "right"
  duration?: number
}) {
  // Content is duplicated so the loop is seamless; second copy is decorative.
  return (
    <div className="overflow-hidden py-3 select-none" aria-hidden={direction === "right"}>
      <div
        className="marquee-track gap-0"
        data-direction={direction}
        style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0" aria-hidden={copy === 1}>
            {items.map((skill) => (
              <span
                key={`${copy}-${skill}`}
                className="flex items-center gap-6 pr-6 font-display text-2xl font-medium whitespace-nowrap text-muted-foreground/80 sm:text-3xl"
              >
                {skill}
                <span className="text-primary/60">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function Skills() {
  return (
    <section id="skills" className="scroll-mt-16">
      <div className="section-padding mx-auto max-w-7xl pb-12 md:pb-12">
        <SectionHeading
          number="02"
          eyebrow="Skills"
          title="Tools I reach for"
          description="The stack I use to take an idea from a napkin sketch to production."
        />
      </div>

      {/* Full-bleed marquee */}
      <div className="border-y border-border/40">
        <MarqueeRow items={allSkills} duration={34} />
        <MarqueeRow items={[...allSkills].reverse()} direction="right" duration={44} />
      </div>

      <div className="section-padding mx-auto max-w-7xl pt-12 md:pt-12">
        <div className="grid gap-4 md:grid-cols-3">
          {skillGroups.map((group, i) => (
            <Reveal key={group.title} delay={i * 0.1}>
              <div className="glass glow-border h-full rounded-xl border border-border/60 p-6">
                <p className="mb-1 font-mono text-xs text-primary">0{i + 1}</p>
                <h3 className="mb-4 font-display text-xl font-semibold">{group.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="px-3 py-1">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
