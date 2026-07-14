"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js"
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js"

// Anodized-metal face palette (classic Rubik's colors, metal finishes)
const FACE_COLORS = {
  right: "#b8202e", // R — anodized red
  left: "#cf6a28", // L — copper orange
  up: "#e8e8ec", // U — chrome silver
  down: "#e6b830", // D — gold
  front: "#0e8a4d", // F — anodized green
  back: "#1257c4", // B — anodized blue
} as const

const CUBELET = 0.94
const SPACING = 1.0
const STICKER = 0.78
const STICKER_DEPTH = 0.07

/** Fine grayscale noise → roughness map. Gives the metal micro-variation so
 *  reflections shimmer like real machined metal instead of perfect CG. */
function makeNoiseTexture(size = 256, base = 185, range = 70): THREE.CanvasTexture {
  const canvas = document.createElement("canvas")
  canvas.width = canvas.height = size
  const ctx = canvas.getContext("2d")!
  const image = ctx.createImageData(size, size)
  for (let i = 0; i < image.data.length; i += 4) {
    const v = base + Math.random() * range
    image.data[i] = image.data[i + 1] = image.data[i + 2] = v
    image.data[i + 3] = 255
  }
  ctx.putImageData(image, 0, 0)
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(2, 2)
  return texture
}

/** Hyperrealistic metallic Rubik's cube: 27 machined cubelets, anodized
 *  metal tiles, studio reflections, soft cast shadow. Auto-spins; drag to
 *  rotate on all axes with inertia. */
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
    renderer.toneMappingExposure = 1.15
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    container.appendChild(renderer.domElement)
    renderer.domElement.style.width = "100%"
    renderer.domElement.style.height = "100%"
    renderer.domElement.style.touchAction = "none"
    renderer.domElement.style.cursor = "grab"

    const scene = new THREE.Scene()

    // Studio reflections (procedural, no network) — the core of the metal look
    const pmrem = new THREE.PMREMGenerator(renderer)
    const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = envTexture

    // Camera sits slightly above so the ground shadow reads
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 50)
    camera.position.set(0, 1.4, 8.2)
    camera.lookAt(0, -0.2, 0)

    // Key light casts the shadow; violet rim ties into the site accent
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.1)
    keyLight.position.set(4, 7, 5)
    keyLight.castShadow = true
    keyLight.shadow.mapSize.set(2048, 2048)
    keyLight.shadow.camera.near = 1
    keyLight.shadow.camera.far = 25
    keyLight.shadow.camera.left = -6
    keyLight.shadow.camera.right = 6
    keyLight.shadow.camera.top = 6
    keyLight.shadow.camera.bottom = -6
    keyLight.shadow.radius = 6
    keyLight.shadow.bias = -0.0004
    scene.add(keyLight)

    const rimLight = new THREE.DirectionalLight(0x7c5cff, 1.1)
    rimLight.position.set(-6, -1, -5)
    scene.add(rimLight)

    const noise = makeNoiseTexture()

    // Machined gunmetal body
    const bodyGeometry = new RoundedBoxGeometry(CUBELET, CUBELET, CUBELET, 5, 0.1)
    const bodyMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x15151b,
      metalness: 1,
      roughness: 0.32,
      roughnessMap: noise,
      clearcoat: 0.3,
      clearcoatRoughness: 0.25,
      envMapIntensity: 1.1,
    })

    // Anodized metal tiles
    const stickerGeometry = new RoundedBoxGeometry(STICKER, STICKER, STICKER_DEPTH, 4, 0.035)
    const stickerMaterials = Object.fromEntries(
      Object.entries(FACE_COLORS).map(([face, color]) => [
        face,
        new THREE.MeshPhysicalMaterial({
          color,
          metalness: 1,
          roughness: 0.2,
          roughnessMap: noise,
          clearcoat: 0.9,
          clearcoatRoughness: 0.12,
          envMapIntensity: 1.25,
        }),
      ])
    ) as Record<keyof typeof FACE_COLORS, THREE.MeshPhysicalMaterial>

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
          cubelet.castShadow = true

          for (const def of faceDefs) {
            if (!def.show(x, y, z)) continue
            const sticker = new THREE.Mesh(stickerGeometry, stickerMaterials[def.face])
            sticker.position.set(...def.position)
            sticker.rotation.set(...def.rotation)
            sticker.castShadow = true
            cubelet.add(sticker)
          }
          cube.add(cubelet)
        }
      }
    }
    cube.rotation.set(0.42, -0.65, 0)
    scene.add(cube)

    // Invisible ground that only renders the cube's soft shadow
    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(30, 30),
      new THREE.ShadowMaterial({ opacity: 0.38 })
    )
    shadowPlane.rotation.x = -Math.PI / 2
    shadowPlane.position.y = -3.1
    shadowPlane.receiveShadow = true
    scene.add(shadowPlane)

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
    const AUTO = reduced ? { x: 0, y: 0 } : { x: 0.0013, y: 0.0028 }
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
    const clock = new THREE.Clock()
    const loop = () => {
      raf = requestAnimationFrame(loop)
      const t = clock.getElapsedTime()

      if (!dragging) {
        velocity.x += (AUTO.x - velocity.x) * 0.02
        velocity.y += (AUTO.y - velocity.y) * 0.02
        cube.rotation.x += velocity.x
        cube.rotation.y += velocity.y
      }
      // Gentle hover — makes the cast shadow breathe
      if (!reduced) cube.position.y = Math.sin(t * 0.8) * 0.12

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
      shadowPlane.geometry.dispose()
      ;(shadowPlane.material as THREE.Material).dispose()
      noise.dispose()
      envTexture.dispose()
      pmrem.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      data-cursor
      aria-label="Interactive metallic Rubik's cube — drag to rotate"
      role="img"
      className={`h-full w-full ${className}`}
    />
  )
}
