"use client"

import { useRef } from "react"
import { useReducedMotion } from "framer-motion"

/** Subtle 3D tilt toward the pointer. Fine-pointer devices only. */
export function Tilt({
  children,
  max = 7,
  className,
}: {
  children: React.ReactNode
  max?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el || reducedMotion || e.pointerType !== "mouse") return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    el.style.transform = `perspective(900px) rotateX(${-py * max}deg) rotateY(${px * max}deg)`
  }

  function onLeave() {
    const el = ref.current
    if (el) el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)"
  }

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={className}
      style={{ transition: "transform 0.25s ease-out", willChange: "transform" }}
    >
      {children}
    </div>
  )
}
