"use client"

import { useRef } from "react"
import dynamic from "next/dynamic"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { ArrowDown, ArrowRight, FileDown } from "lucide-react"
import { AuroraBackground } from "@/components/bits/AuroraBackground"
import Magnet from "@/components/bits/Magnet"
import ShinyText from "@/components/bits/ShinyText"
import { Button } from "@/components/ui/button"
import { introPlaying } from "@/components/ultra/preloader"
import { profile } from "@/data/profile"

// Other hero cube variants live in components/bits/ — glass
// (InteractiveCube.tsx) and Rubik's (RubiksCube.tsx). Swap the import to
// switch versions.
const MetallicCube = dynamic(() => import("@/components/bits/MetallicCube"), {
  ssr: false,
})

gsap.registerPlugin(useGSAP)

export function Hero() {
  const scope = useRef<HTMLElement>(null)

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
        .from(
          "[data-hero-line]",
          { yPercent: 110, opacity: 0, duration: 0.9, stagger: 0.12 },
          0.25
        )
        .from("[data-hero-tagline]", { y: 20, opacity: 0, duration: 0.7 }, 0.7)
        .from(
          "[data-hero-cta]",
          { y: 16, opacity: 0, duration: 0.6, stagger: 0.08 },
          0.9
        )
        .from("[data-hero-cube]", { opacity: 0, scale: 0.92, duration: 1.1 }, 0.6)
        .from("[data-hero-scroll]", { opacity: 0, duration: 0.8 }, 1.3)
    },
    { scope }
  )

  return (
    <section
      ref={scope}
      id="home"
      className="relative flex min-h-svh flex-col justify-center overflow-hidden px-6 sm:px-10"
    >
      <AuroraBackground />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-8 pt-24 pb-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-4 lg:pt-16">
        {/* Copy */}
        <div className="text-center lg:text-left">
          <p
            data-hero-eyebrow
            className="mb-6 font-mono text-sm tracking-widest text-primary uppercase"
          >
            {profile.role}
          </p>

          <h1 className="font-display text-fluid-hero font-semibold tracking-tight text-balance">
            <span className="block overflow-hidden">
              <span data-hero-line className="block">
                Hey, I&apos;m
              </span>
            </span>
            <span className="block overflow-hidden">
              <span data-hero-line className="block text-primary">
                {profile.firstName}.
              </span>
            </span>
          </h1>

          <div data-hero-tagline className="mx-auto mt-6 max-w-xl lg:mx-0">
            <ShinyText
              text={profile.tagline}
              speed={3}
              className="text-lg sm:text-xl"
              color="var(--muted-foreground)"
              shineColor="var(--foreground)"
            />
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
            <span data-hero-cta>
              <Magnet padding={60} magnetStrength={8}>
                <Button asChild size="lg">
                  <a href="#projects">
                    View my work
                    <ArrowRight className="size-4" />
                  </a>
                </Button>
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
        </div>

        {/* Interactive metallic cube — drag to rotate */}
        <div
          data-hero-cube
          className="mx-auto h-64 w-full max-w-sm sm:h-80 sm:max-w-md lg:h-[30rem] lg:max-w-none"
        >
          <MetallicCube />
        </div>
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
