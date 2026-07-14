"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, [data-cursor]'

/** Custom cursor: a dot that sticks to the pointer + a trailing ring that
 *  grows over interactive elements. Desktop fine-pointers only. */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (!fine || reduced) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    document.documentElement.classList.add("custom-cursor")
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50 })

    // Snappy: dot is glued to the pointer (no easing), ring follows tight.
    const dotX = gsap.quickSetter(dot, "x", "px")
    const dotY = gsap.quickSetter(dot, "y", "px")
    const ringX = gsap.quickTo(ring, "x", { duration: 0.1, ease: "power3.out" })
    const ringY = gsap.quickTo(ring, "y", { duration: 0.1, ease: "power3.out" })

    const onMove = (e: MouseEvent) => {
      dotX(e.clientX)
      dotY(e.clientY)
      ringX(e.clientX)
      ringY(e.clientY)

      const interactive = (e.target as HTMLElement).closest?.(INTERACTIVE)
      gsap.to(ring, {
        scale: interactive ? 1.9 : 1,
        opacity: interactive ? 0.9 : 0.5,
        duration: 0.15,
        overwrite: "auto",
      })
    }
    const onDown = () => gsap.to(ring, { scale: 0.75, duration: 0.1 })
    const onUp = () => gsap.to(ring, { scale: 1, duration: 0.15 })
    const onLeave = () => gsap.to([dot, ring], { opacity: 0, duration: 0.2 })
    const onEnter = () => {
      gsap.to(dot, { opacity: 1, duration: 0.2 })
      gsap.to(ring, { opacity: 0.5, duration: 0.2 })
    }

    window.addEventListener("mousemove", onMove, { passive: true })
    window.addEventListener("mousedown", onDown)
    window.addEventListener("mouseup", onUp)
    document.documentElement.addEventListener("mouseleave", onLeave)
    document.documentElement.addEventListener("mouseenter", onEnter)

    return () => {
      document.documentElement.classList.remove("custom-cursor")
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mousedown", onDown)
      window.removeEventListener("mouseup", onUp)
      document.documentElement.removeEventListener("mouseleave", onLeave)
      document.documentElement.removeEventListener("mouseenter", onEnter)
    }
  }, [])

  return (
    <div aria-hidden className="hidden md:block">
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[100] size-1.5 rounded-full bg-primary"
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 z-[100] size-8 rounded-full border border-primary/70 opacity-50"
      />
    </div>
  )
}
