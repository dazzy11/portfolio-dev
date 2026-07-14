"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { profile } from "@/data/profile"

export const INTRO_KEY = "intro-seen"

// Memoized so the hero (which delays its timeline) and the preloader agree
// on whether the intro plays, regardless of effect ordering.
let introDecision: boolean | null = null
export function introPlaying(): boolean {
  if (typeof window === "undefined") return false
  if (introDecision === null) {
    introDecision =
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      !sessionStorage.getItem(INTRO_KEY)
  }
  return introDecision
}

/** One-time page-load intro: name mask reveal, then the veil lifts.
 *  Plays once per session; skipped entirely under reduced motion. */
export function Preloader() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!introPlaying()) return
    sessionStorage.setItem(INTRO_KEY, "1")
    setShow(true)
    document.documentElement.style.overflow = "hidden"
    const t = setTimeout(() => {
      setShow(false)
      document.documentElement.style.overflow = ""
      introDecision = false // later mounts (client-side nav) must not replay
    }, 1900)
    return () => {
      clearTimeout(t)
      document.documentElement.style.overflow = ""
      introDecision = false
    }
  }, [])

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          aria-hidden
          className="fixed inset-0 z-[90] flex items-center justify-center bg-background"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="overflow-hidden px-6">
            <motion.p
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98], delay: 0.15 }}
              className="font-display text-center text-4xl font-semibold tracking-tight sm:text-6xl"
            >
              {profile.name.split(" ").slice(0, 2).join(" ")}
              <span className="text-primary">.</span>
            </motion.p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
