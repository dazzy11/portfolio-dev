"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { ArrowDown, ArrowRight, FileDown } from "lucide-react"
import { HyperspeedBackground } from "@/components/bits/HyperspeedBackground"
import GlassSurface from "@/components/bits/GlassSurface"
import Magnet from "@/components/bits/Magnet"
import ShinyText from "@/components/bits/ShinyText"
import Shuffle from "@/components/bits/Shuffle"
import { Button } from "@/components/ui/button"
import { introPlaying } from "@/components/ultra/preloader"
import { profile } from "@/data/profile"

gsap.registerPlugin(useGSAP)

export function Hero() {
  const scope = useRef<HTMLElement>(null)
  // Mount the shuffle headline only after the preloader veil lifts, so the
  // scramble isn't wasted behind it on first visit.
  const [titleReady, setTitleReady] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setTitleReady(true), introPlaying() ? 1800 : 150)
    return () => clearTimeout(t)
  }, [])

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

      gsap
        .timeline({
          // Hold until the preloader veil lifts on first visit.
          delay: introPlaying() ? 1.75 : 0,
          defaults: { ease: "power3.out" },
        })
        .from("[data-hero-eyebrow]", { y: 24, opacity: 0, duration: 0.7 }, 0.1)
        .from("[data-hero-tagline]", { y: 20, opacity: 0, duration: 0.7 }, 0.7)
        .from(
          "[data-hero-cta]",
          { y: 16, opacity: 0, duration: 0.6, stagger: 0.08 },
          0.9
        )
        .from("[data-hero-scroll]", { opacity: 0, duration: 0.8 }, 1.3)
    },
    { scope }
  )

  return (
    <section
      ref={scope}
      id="home"
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 text-center"
    >
      <HyperspeedBackground />

      <div className="pointer-events-none relative z-10 mx-auto max-w-4xl">
        <p
          data-hero-eyebrow
          className="mb-6 font-mono text-sm tracking-widest text-primary uppercase"
        >
          {profile.role}
        </p>

        <h1 className="font-display text-fluid-hero font-semibold tracking-tight text-balance">
          {titleReady ? (
            <>
              <Shuffle
                text="Hey, I'm"
                tag="span"
                className="block"
                duration={0.4}
                shuffleTimes={2}
                stagger={0.02}
                triggerOnce
                respectReducedMotion
              />
              <Shuffle
                text={`${profile.firstName}.`}
                tag="span"
                className="block text-primary"
                duration={0.45}
                shuffleTimes={3}
                stagger={0.04}
                triggerOnce
                respectReducedMotion
              />
            </>
          ) : (
            // Invisible placeholder reserves the exact space (no layout shift)
            <>
              <span className="block opacity-0">Hey, I&apos;m</span>
              <span className="block opacity-0">{profile.firstName}.</span>
            </>
          )}
        </h1>

        <div data-hero-tagline className="mx-auto mt-6 max-w-xl">
          <ShinyText
            text={profile.tagline}
            speed={3}
            className="text-lg sm:text-xl"
            color="var(--muted-foreground)"
            shineColor="var(--foreground)"
          />
        </div>

        <div className="pointer-events-auto mt-10 flex flex-wrap items-center justify-center gap-4">
          <span data-hero-cta>
            <Magnet padding={60} magnetStrength={8}>
              <GlassSurface
                width="fit-content"
                height={52}
                borderRadius={26}
                brightness={60}
                opacity={0.9}
              >
                <a
                  href="#projects"
                  className="flex items-center gap-2 px-5 text-sm font-medium whitespace-nowrap"
                >
                  View my work
                  <ArrowRight className="size-4" />
                </a>
              </GlassSurface>
            </Magnet>
          </span>
          <span data-hero-cta>
            <Button asChild size="lg" variant="outline">
              <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
                <FileDown className="size-4" />
                Download resume
              </a>
            </Button>
          </span>
        </div>

        <p className="pointer-events-none mt-6 font-mono text-xs text-muted-foreground/60">
          psst — click &amp; hold the road to speed up
        </p>
      </div>

      <a
        data-hero-scroll
        href="#about"
        aria-label="Scroll to about section"
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowDown className="size-5 animate-bounce" />
      </a>
    </section>
  )
}
