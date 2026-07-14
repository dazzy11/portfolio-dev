"use client"

import { useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { SectionHeading } from "@/components/section-heading"
import { ProjectCard } from "@/components/project-card"
import { projects } from "@/data/projects"

gsap.registerPlugin(useGSAP, ScrollTrigger)

/**
 * Desktop (lg+, motion allowed): pinned section, cards scroll horizontally.
 * Mobile / reduced motion: plain vertical stack.
 */
export function Projects() {
  const scope = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          const track = scope.current?.querySelector<HTMLElement>("[data-track]")
          if (!track) return

          const getDistance = () => track.scrollWidth - track.clientWidth

          gsap.to(track, {
            x: () => -getDistance(),
            ease: "none",
            scrollTrigger: {
              trigger: "[data-pin]",
              start: "top top",
              end: () => `+=${getDistance()}`,
              pin: true,
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          })
        }
      )

      return () => mm.revert()
    },
    { scope }
  )

  return (
    <section ref={scope} id="projects" className="scroll-mt-16">
      <div data-pin className="section-padding mx-auto flex min-h-svh max-w-7xl flex-col justify-center">
        <SectionHeading
          number="04"
          eyebrow="Projects"
          title="Things I've built"
          description="Selected work — each one solves a real problem. Scroll through and open any project for the full story."
        />

        <div className="-mx-6 overflow-hidden px-6 sm:-mx-10 sm:px-10">
          <div
            data-track
            className="flex flex-col gap-6 lg:w-max lg:flex-row lg:pr-24"
          >
            {projects.map((project) => (
              <div
                key={project.slug}
                className="lg:w-[clamp(380px,34vw,540px)] lg:shrink-0"
              >
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
