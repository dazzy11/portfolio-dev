"use client"

import { useEffect, useRef } from "react"
import { Renderer, Camera, Program, Mesh, Box } from "ogl"

const VERT = /* glsl */ `
attribute vec3 position;
attribute vec2 uv;
attribute vec3 normal;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPos;
void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vPos = mv.xyz;
  gl_Position = projectionMatrix * mv;
}
`

const FRAG = /* glsl */ `
precision highp float;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPos;
uniform vec3 uColor;
uniform vec3 uEdgeColor;

void main() {
  // Distance to the nearest face border -> glowing cube edges
  float edgeDist = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y));
  float edge = 1.0 - smoothstep(0.0, 0.045, edgeDist);

  // Fresnel for the glassy look
  vec3 viewDir = normalize(-vPos);
  float fresnel = pow(1.0 - abs(dot(viewDir, normalize(vNormal))), 2.2);

  vec3 color = uColor * (0.35 + 0.85 * fresnel) + uEdgeColor * edge;
  float alpha = 0.10 + fresnel * 0.30 + edge * 0.85;
  gl_FragColor = vec4(color, alpha);
}
`

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "")
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ]
}

interface InteractiveCubeProps {
  color?: string
  edgeColor?: string
  className?: string
}

/** Glassy wireframe cube: auto-spins, and can be grabbed and rotated on all
 *  axes by dragging (mouse or touch). */
export default function InteractiveCube({
  color = "#7c5cff",
  edgeColor = "#e9e6ff",
  className = "",
}: InteractiveCubeProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const renderer = new Renderer({
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio, 2),
    })
    const gl = renderer.gl
    gl.clearColor(0, 0, 0, 0)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    container.appendChild(gl.canvas)
    gl.canvas.style.width = "100%"
    gl.canvas.style.height = "100%"
    gl.canvas.style.touchAction = "none"
    gl.canvas.style.cursor = "grab"

    const camera = new Camera(gl, { fov: 32 })
    camera.position.set(0, 0, 5.2)

    const geometry = new Box(gl, { width: 1.7, height: 1.7, depth: 1.7 })
    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uColor: { value: hexToRgb(color) },
        uEdgeColor: { value: hexToRgb(edgeColor) },
      },
      transparent: true,
      cullFace: false,
      depthWrite: false,
    })
    const cube = new Mesh(gl, { geometry, program })
    cube.rotation.set(0.5, -0.6, 0)

    function resize() {
      if (!container) return
      const { clientWidth: w, clientHeight: h } = container
      renderer.setSize(w, h)
      camera.perspective({ aspect: w / h })
    }
    const observer = new ResizeObserver(resize)
    observer.observe(container)
    resize()

    // Drag to rotate, with inertia; drifts back to a lazy auto-spin when idle.
    const AUTO = reduced ? { x: 0, y: 0 } : { x: 0.0016, y: 0.0034 }
    const velocity = { x: AUTO.x, y: AUTO.y }
    let dragging = false
    let last = { x: 0, y: 0 }

    const onPointerDown = (e: PointerEvent) => {
      dragging = true
      last = { x: e.clientX, y: e.clientY }
      gl.canvas.setPointerCapture(e.pointerId)
      gl.canvas.style.cursor = "grabbing"
    }
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return
      const dx = e.clientX - last.x
      const dy = e.clientY - last.y
      last = { x: e.clientX, y: e.clientY }
      cube.rotation.y += dx * 0.008
      cube.rotation.x += dy * 0.008
      velocity.x = dy * 0.0035
      velocity.y = dx * 0.0035
    }
    const onPointerUp = (e: PointerEvent) => {
      dragging = false
      gl.canvas.releasePointerCapture(e.pointerId)
      gl.canvas.style.cursor = "grab"
    }
    gl.canvas.addEventListener("pointerdown", onPointerDown)
    gl.canvas.addEventListener("pointermove", onPointerMove)
    gl.canvas.addEventListener("pointerup", onPointerUp)
    gl.canvas.addEventListener("pointercancel", onPointerUp)

    let raf = 0
    const loop = () => {
      raf = requestAnimationFrame(loop)
      if (!dragging) {
        // Ease inertia back toward the ambient spin
        velocity.x += (AUTO.x - velocity.x) * 0.02
        velocity.y += (AUTO.y - velocity.y) * 0.02
        cube.rotation.x += velocity.x
        cube.rotation.y += velocity.y
      }
      renderer.render({ scene: cube, camera })
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      gl.canvas.removeEventListener("pointerdown", onPointerDown)
      gl.canvas.removeEventListener("pointermove", onPointerMove)
      gl.canvas.removeEventListener("pointerup", onPointerUp)
      gl.canvas.removeEventListener("pointercancel", onPointerUp)
      container.removeChild(gl.canvas)
      gl.getExtension("WEBGL_lose_context")?.loseContext()
    }
  }, [color, edgeColor])

  return (
    <div
      ref={containerRef}
      data-cursor
      aria-label="Interactive 3D cube — drag to rotate"
      role="img"
      className={`h-full w-full ${className}`}
    />
  )
}
