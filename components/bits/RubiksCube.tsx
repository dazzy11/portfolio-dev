"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js"
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js"

// Classic face colors — rendered as metallic lacquer stickers.
const FACE_COLORS = {
  right: "#c41e3a", // R — red
  left: "#ff5800", // L — orange
  up: "#f4f4f6", // U — white
  down: "#ffd500", // D — yellow
  front: "#009e60", // F — green
  back: "#0051ba", // B — blue
} as const

const CUBELET = 0.96
const SPACING = 1.0
const STICKER = 0.8
const STICKER_DEPTH = 0.06

/** Realistic metallic Rubik's cube: auto-spins, drag (mouse/touch) to rotate
 *  on all axes with inertia — same interaction model as the glass cube. */
export default function RubiksCube({ className = "" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.1
    container.appendChild(renderer.domElement)
    renderer.domElement.style.width = "100%"
    renderer.domElement.style.height = "100%"
    renderer.domElement.style.touchAction = "none"
    renderer.domElement.style.cursor = "grab"

    const scene = new THREE.Scene()

    // Studio reflections — this is what sells the metallic look. Generated
    // procedurally (RoomEnvironment), so no network fetch is involved.
    const pmrem = new THREE.PMREMGenerator(renderer)
    const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = envTexture

    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 50)
    camera.position.set(0, 0, 8)

    const keyLight = new THREE.DirectionalLight(0xffffff, 0.6)
    keyLight.position.set(4, 6, 6)
    scene.add(keyLight)
    const rimLight = new THREE.DirectionalLight(0x9a86ff, 0.35)
    rimLight.position.set(-5, -3, -4)
    scene.add(rimLight)

    // Shared geometries/materials across all 27 cubelets
    const bodyGeometry = new RoundedBoxGeometry(CUBELET, CUBELET, CUBELET, 4, 0.09)
    const stickerGeometry = new RoundedBoxGeometry(STICKER, STICKER, STICKER_DEPTH, 3, 0.03)
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x0a0a0e,
      metalness: 0.9,
      roughness: 0.35,
    })
    const stickerMaterials = Object.fromEntries(
      Object.entries(FACE_COLORS).map(([face, color]) => [
        face,
        new THREE.MeshPhysicalMaterial({
          color,
          metalness: 0.85,
          roughness: 0.16,
          clearcoat: 1,
          clearcoatRoughness: 0.12,
        }),
      ])
    ) as Record<keyof typeof FACE_COLORS, THREE.MeshPhysicalMaterial>

    // Sticker placement per outward face: [face, axis, sign, rotation]
    const faceDefs: Array<{
      face: keyof typeof FACE_COLORS
      position: [number, number, number]
      rotation: [number, number, number]
      show: (x: number, y: number, z: number) => boolean
    }> = [
      { face: "right", position: [CUBELET / 2, 0, 0], rotation: [0, Math.PI / 2, 0], show: (x) => x === 1 },
      { face: "left", position: [-CUBELET / 2, 0, 0], rotation: [0, -Math.PI / 2, 0], show: (x) => x === -1 },
      { face: "up", position: [0, CUBELET / 2, 0], rotation: [-Math.PI / 2, 0, 0], show: (_x, y) => y === 1 },
      { face: "down", position: [0, -CUBELET / 2, 0], rotation: [Math.PI / 2, 0, 0], show: (_x, y) => y === -1 },
      { face: "front", position: [0, 0, CUBELET / 2], rotation: [0, 0, 0], show: (_x, _y, z) => z === 1 },
      { face: "back", position: [0, 0, -CUBELET / 2], rotation: [0, Math.PI, 0], show: (_x, _y, z) => z === -1 },
    ]

    const cube = new THREE.Group()
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          const cubelet = new THREE.Mesh(bodyGeometry, bodyMaterial)
          cubelet.position.set(x * SPACING, y * SPACING, z * SPACING)

          for (const def of faceDefs) {
            if (!def.show(x, y, z)) continue
            const sticker = new THREE.Mesh(stickerGeometry, stickerMaterials[def.face])
            sticker.position.set(...def.position)
            sticker.rotation.set(...def.rotation)
            cubelet.add(sticker)
          }
          cube.add(cubelet)
        }
      }
    }
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
    const AUTO = reduced ? { x: 0, y: 0 } : { x: 0.0014, y: 0.003 }
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
      bodyGeometry.dispose()
      stickerGeometry.dispose()
      bodyMaterial.dispose()
      Object.values(stickerMaterials).forEach((m) => m.dispose())
      envTexture.dispose()
      pmrem.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      data-cursor
      aria-label="Interactive 3D Rubik's cube — drag to rotate"
      role="img"
      className={`h-full w-full ${className}`}
    />
  )
}
