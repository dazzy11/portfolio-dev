import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowUpRight, Github } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/sections/navbar"
import { Footer } from "@/components/sections/footer"
import { getProject, projects } from "@/data/projects"

type Params = { slug: string }

export function generateStaticParams(): Params[] {
  return projects.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const project = getProject((await params).slug)
  if (!project) return {}
  return {
    title: project.title,
    description: project.description,
  }
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<Params>
}) {
  const project = getProject((await params).slug)
  if (!project) notFound()

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 pt-32 pb-24 sm:px-10">
        <Button asChild variant="ghost" size="sm" className="-ml-3 mb-8">
          <Link href="/#projects">
            <ArrowLeft className="size-4" />
            All projects
          </Link>
        </Button>

        <p className="mb-3 font-mono text-sm tracking-widest text-primary uppercase">
          {project.headline}
        </p>
        <h1 className="font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          {project.title}
        </h1>

        <div className="mt-6 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <Badge key={tech} variant="secondary">
              {tech}
            </Badge>
          ))}
        </div>

        <section className="mt-10 space-y-8">
          <div>
            <h2 className="font-display text-xl font-semibold">The problem</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              {project.problem}
            </p>
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold">What it does</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              {project.description}
            </p>
          </div>
        </section>

        <div className="mt-12 flex flex-wrap gap-3">
          {project.links.live ? (
            <Button asChild>
              <a href={project.links.live} target="_blank" rel="noopener noreferrer">
                <ArrowUpRight className="size-4" />
                Visit live site
              </a>
            </Button>
          ) : null}
          {project.links.repo ? (
            <Button asChild variant="outline">
              <a href={project.links.repo} target="_blank" rel="noopener noreferrer">
                <Github className="size-4" />
                View source
              </a>
            </Button>
          ) : null}
        </div>
      </main>
      <Footer />
    </>
  )
}
