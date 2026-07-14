"use client"

import dynamic from "next/dynamic"
import { useReducedMotion } from "framer-motion"

const Hyperspeed = dynamic(() => import("@/components/bits/Hyperspeed"), {
  ssr: false,
})

// Violet take on the reactbits "one" preset — matches the site accent.
// Module-level constant: Hyperspeed re-initializes when this reference changes.
const EFFECT_OPTIONS = {
  distortion: "turbulentDistortion",
  colors: {
    roadColor: 0x080810,
    islandColor: 0x0a0a12,
    background: 0x000000,
    shoulderLines: 0x1d1d2b,
    brokenLines: 0x1d1d2b,
    leftCars: [0x7c5cff, 0x5227ff, 0xa78bfa],
    rightCars: [0x4f46e5, 0x8b7bff, 0x38327a],
    sticks: 0x7c5cff,
  },
}

/**
 * Hero background: highway light-trails (WebGL, lazy). Click & hold anywhere
 * empty to speed up. Falls back to a static gradient under reduced motion.
 * Heavily faded in light theme so foreground text stays readable.
 */
export function HyperspeedBackground({ className = "" }: { className?: string }) {
  const reducedMotion = useReducedMotion()

  return (
    <div
      aria-hidden
      className={`absolute inset-0 overflow-hidden opacity-25 dark:opacity-100 ${className}`}
    >
      {reducedMotion ? (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 100%, color-mix(in oklab, var(--primary) 22%, transparent), transparent)",
          }}
        />
      ) : (
        <Hyperspeed effectOptions={EFFECT_OPTIONS} />
      )}
    </div>
  )
}
