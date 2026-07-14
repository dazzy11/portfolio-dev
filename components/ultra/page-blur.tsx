"use client"

import GradualBlur from "@/components/bits/GradualBlur"

/** Fixed gradual blur along the bottom of the viewport — content melts out
 *  of view instead of hard-clipping at the screen edge. */
export function PageBlur() {
  return (
    <GradualBlur
      target="page"
      position="bottom"
      height="5rem"
      strength={2}
      divCount={5}
      curve="bezier"
      exponential
      opacity={1}
      zIndex={40}
    />
  )
}
