"use client"

import { useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { SectionHeading } from "@/components/section-heading"
import { Badge } from "@/components/ui/badge"
import { experience } from "@/data/experience"

gsap.registerPlugin(useGSAP, ScrollTrigger)

export function Experience() {
  const scope = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

      gsap.from("[data-timeline-line]", {
        scaleY: 0,
        transformOrigin: "top",
        ease: "none",
        scrollTrigger: {
          trigger: "[data-timeline]",
          start: "top 75%",
          end: "bottom 60%",
          scrub: 0.5,
        },
      })

      gsap.utils.toArray<HTMLElement>("[data-timeline-item]").forEach((item) => {
        gsap.from(item, {
          y: 32,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 80%",
          },
        })
      })
    },
    { scope }
  )

  return (
    <section
      ref={scope}
      id="experience"
      className="section-padding mx-auto max-w-7xl scroll-mt-16"
    >
      <SectionHeading number="03" eyebrow="Experience" title="Where I've been" />

      <div data-timeline className="relative ml-3 md:ml-6">
        <div
          data-timeline-line
          className="absolute top-1 bottom-1 left-0 w-px bg-gradient-to-b from-primary via-primary/50 to-border"
        />

        <ol className="space-y-12">
          {experience.map((item) => (
            <li key={`${item.org}-${item.title}`} data-timeline-item className="relative pl-8 md:pl-12">
              <span
                aria-hidden
                className="absolute top-1.5 -left-[5px] size-[11px] rounded-full border-2 border-primary bg-background"
              />
              <p className="font-mono text-sm text-muted-foreground">{item.period}</p>
              <h3 className="mt-1 font-display text-xl font-semibold tracking-tight sm:text-2xl">
                {item.title}
                <span className="text-muted-foreground"> · {item.org}</span>
              </h3>
              <p className="mt-2 max-w-2xl text-muted-foreground">{item.description}</p>
              {item.tags?.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
