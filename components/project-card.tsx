import Link from "next/link"
import { ArrowUpRight, Github } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tilt } from "@/components/ultra/tilt"
import type { Project } from "@/data/projects"

/** Stylized preview art — gradient mesh + oversized initial, until real
 *  screenshots are added via next/image. */
function PreviewArt({ project }: { project: Project }) {
  return (
    <div
      aria-hidden
      className="relative flex h-44 items-end overflow-hidden rounded-t-[inherit] sm:h-52"
      style={{
        background:
          "radial-gradient(120% 140% at 10% 0%, color-mix(in oklab, var(--primary) 45%, var(--card)) 0%, var(--card) 55%), radial-gradient(80% 100% at 90% 100%, color-mix(in oklab, var(--primary) 25%, var(--card)) 0%, transparent 60%)",
      }}
    >
      <span className="absolute -top-8 -right-4 font-display text-[10rem] leading-none font-semibold text-primary/15 transition-transform duration-500 group-hover:scale-110">
        {project.title.charAt(0)}
      </span>
      <span className="p-5 font-mono text-xs tracking-widest text-foreground/70 uppercase">
        {project.headline}
      </span>
    </div>
  )
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Tilt className="h-full">
      <div className="group glass glow-border relative flex h-full flex-col overflow-hidden rounded-xl border border-border/60 transition-colors hover:border-primary/40">
        <PreviewArt project={project} />

        <div className="flex flex-1 flex-col gap-4 p-6">
          <div>
            <h3 className="font-display text-2xl font-semibold">
              <Link
                href={`/projects/${project.slug}`}
                className="after:absolute after:inset-0 focus-visible:outline-none"
              >
                {project.title}
              </Link>
            </h3>
            <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
              {project.description}
            </p>
          </div>

          <div className="mt-auto flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <Badge key={tech} variant="secondary">
                {tech}
              </Badge>
            ))}
          </div>

          <div className="relative z-10 flex items-center gap-2">
            {project.links.live ? (
              <Button asChild size="sm" variant="outline">
                <a href={project.links.live} target="_blank" rel="noopener noreferrer">
                  <ArrowUpRight className="size-4" />
                  Live
                </a>
              </Button>
            ) : null}
            {project.links.repo ? (
              <Button asChild size="sm" variant="ghost">
                <a href={project.links.repo} target="_blank" rel="noopener noreferrer">
                  <Github className="size-4" />
                  Code
                </a>
              </Button>
            ) : null}
            <span className="ml-auto text-sm text-muted-foreground transition-transform duration-300 group-hover:translate-x-1">
              Details →
            </span>
          </div>
        </div>
      </div>
    </Tilt>
  )
}
