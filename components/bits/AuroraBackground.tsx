"use client"

import dynamic from "next/dynamic"
import { useReducedMotion } from "framer-motion"

const Aurora = dynamic(() => import("@/components/bits/Aurora"), {
  ssr: false,
})

const AURORA_COLORS = ["#7c5cff", "#4f46e5", "#a78bfa"]

/**
 * Site-wide ambient motif. Renders the WebGL aurora lazily; falls back to a
 * static gradient when the user prefers reduced motion.
 */
export function AuroraBackground({ className = "" }: { className?: string }) {
  const reducedMotion = useReducedMotion()

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden opacity-60 dark:opacity-100 ${className}`}
    >
      {reducedMotion ? (
        <div
          className="absolute inset-x-0 top-0 h-2/3"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 0%, color-mix(in oklab, var(--primary) 25%, transparent), transparent)",
          }}
        />
      ) : (
        <Aurora colorStops={AURORA_COLORS} amplitude={1.0} blend={0.5} speed={0.6} />
      )}
    </div>
  )
}
