"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js"
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js"

interface MetallicCubeProps {
  /** Base metal color */
  color?: string
  /** 0 = mirror polish, 1 = brushed/matte */
  roughness?: number
  className?: string
}

/** A single realistic metallic cube: polished PBR metal with studio
 *  reflections. Auto-spins; drag (mouse/touch) to rotate on all axes with
 *  inertia. */
export default function MetallicCube({
  color = "#b8b8c4",
  roughness = 0.18,
  className = "",
}: MetallicCubeProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    container.appendChild(renderer.domElement)
    renderer.domElement.style.width = "100%"
    renderer.domElement.style.height = "100%"
    renderer.domElement.style.touchAction = "none"
    renderer.domElement.style.cursor = "grab"

    const scene = new THREE.Scene()

    // Procedural studio environment — reflections are what make metal read
    // as metal. No network fetch involved.
    const pmrem = new THREE.PMREMGenerator(renderer)
    const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = envTexture

    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50)
    camera.position.set(0, 0, 5.4)

    // Accent lighting to tie the metal into the site's violet theme
    const keyLight = new THREE.DirectionalLight(0xffffff, 0.8)
    keyLight.position.set(4, 6, 6)
    scene.add(keyLight)
    const rimLight = new THREE.DirectionalLight(0x7c5cff, 1.4)
    rimLight.position.set(-6, -2, -5)
    scene.add(rimLight)
    const fillLight = new THREE.DirectionalLight(0x7c5cff, 0.4)
    fillLight.position.set(2, -4, 3)
    scene.add(fillLight)

    const geometry = new RoundedBoxGeometry(1.9, 1.9, 1.9, 6, 0.14)
    const material = new THREE.MeshPhysicalMaterial({
      color,
      metalness: 1,
      roughness,
      clearcoat: 0.6,
      clearcoatRoughness: 0.2,
      envMapIntensity: 1.2,
    })
    const cube = new THREE.Mesh(geometry, material)
    cube.rotation.set(0.45, -0.65, 0)
    scene.add(cube)

    function resize() {
      if (!container) return
      const { clientWidth: w, clientHeight: h } = container
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    const observer = new ResizeObserver(resize)
    observer.observe(container)
    resize()

    // Drag to rotate, with inertia; drifts back to a lazy auto-spin when idle.
    const AUTO = reduced ? { x: 0, y: 0 } : { x: 0.0016, y: 0.0034 }
    const velocity = { x: AUTO.x, y: AUTO.y }
    let dragging = false
    let last = { x: 0, y: 0 }

    const el = renderer.domElement
    const onPointerDown = (e: PointerEvent) => {
      dragging = true
      last = { x: e.clientX, y: e.clientY }
      el.setPointerCapture(e.pointerId)
      el.style.cursor = "grabbing"
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
      el.releasePointerCapture(e.pointerId)
      el.style.cursor = "grab"
    }
    el.addEventListener("pointerdown", onPointerDown)
    el.addEventListener("pointermove", onPointerMove)
    el.addEventListener("pointerup", onPointerUp)
    el.addEventListener("pointercancel", onPointerUp)

    let raf = 0
    const loop = () => {
      raf = requestAnimationFrame(loop)
      if (!dragging) {
        velocity.x += (AUTO.x - velocity.x) * 0.02
        velocity.y += (AUTO.y - velocity.y) * 0.02
        cube.rotation.x += velocity.x
        cube.rotation.y += velocity.y
      }
      renderer.render(scene, camera)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      el.removeEventListener("pointerdown", onPointerDown)
      el.removeEventListener("pointermove", onPointerMove)
      el.removeEventListener("pointerup", onPointerUp)
      el.removeEventListener("pointercancel", onPointerUp)
      container.removeChild(el)
      geometry.dispose()
      material.dispose()
      envTexture.dispose()
      pmrem.dispose()
      renderer.dispose()
    }
  }, [color, roughness])

  return (
    <div
      ref={containerRef}
      data-cursor
      aria-label="Interactive metallic 3D cube — drag to rotate"
      role="img"
      className={`h-full w-full ${className}`}
    />
  )
}
