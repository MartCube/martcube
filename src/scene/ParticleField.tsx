'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import gsap from 'gsap'
import { useEffect, useMemo, useRef } from 'react'
import type { ShaderMaterial } from 'three'
import { useAppStore } from '@/store/hooks'
import { morphProgress, SCENES } from './morph'
import { fragmentShader, vertexShader } from './shaders/particles'
import { cubeShape } from './shapes/cube'
import { scatter } from './shapes/scatter'
import { pageShape, phoneShape, storeShape } from './shapes/services'
import { sphereShape } from './shapes/sphere'
import { waveShape } from './shapes/wave'

const NARROW = 720
// Shader attribute for each shape, in scroll order. The cube is `position`, three.js's built-in.
const SHAPE_ATTRIBUTES = ['position', 'aWave', 'aStore', 'aPage', 'aPhone', 'aSphere']
const POINT_SIZE = 0.055

// The one WebGL canvas behind the whole page.
export default function ParticleField() {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ fov: 45, position: [0, 0, 10] }}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      flat
      linear
    >
      <Particles />
    </Canvas>
  )
}

function Particles() {
  const material = useRef<ShaderMaterial>(null)
  const intro = useRef({ value: 0 })
  const size = useThree(s => s.size)
  const count = size.width < NARROW ? 3200 : 7000

  // Built once per particle count: a start position, a spot in each shape, tones and a random seed.
  const geometry = useMemo(() => {
    const shapes = [cubeShape, waveShape, storeShape, pageShape, phoneShape, sphereShape].map(build => build(count))
    return {
      start: scatter(count),
      positions: shapes.map(s => s.positions),
      tonesA: interleave(shapes.slice(0, 3).map(s => s.tones)),
      tonesB: interleave(shapes.slice(3).map(s => s.tones)),
      seed: Float32Array.from({ length: count }, () => Math.random()),
    }
  }, [count])

  // Initial values only: R3F copies these into the material, so per-frame updates
  // go through `material.current.uniforms`, not this object.
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uIntro: { value: 0 },
    uMorph: { value: 0 },
    uBurst: { value: 0 },
    uPlace: { value: new Float32Array(SCENES * 3) },
    uAlpha: { value: new Float32Array(SCENES) },
    uTilt: { value: [0, 0] },
    uPointer: { value: [99, 99] },
    uPointerActive: { value: 0 },
    uPointSize: { value: 1 },
  }), [])

  const pointer = usePointer()
  const morph = useMorph()
  const burst = useBurst()

  // Particles gather into the cube once, on load. Reduced motion skips straight to the cube.
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      intro.current.value = 1
      return
    }
    const tween = gsap.to(intro.current, { value: 1, duration: 2.4, ease: 'power2.out', delay: 0.2 })
    return () => {
      tween.kill()
    }
  }, [])

  useFrame((state, delta) => {
    if (!material.current) return
    const u = material.current.uniforms as typeof uniforms
    const { viewport, size, gl } = state
    const narrow = size.width < NARROW
    const reduced = pointer.current.reduced

    u.uTime.value += delta * (reduced ? 0.25 : 1)
    u.uIntro.value = intro.current.value

    u.uMorph.value += (morph() - u.uMorph.value) * 0.08
    u.uBurst.value = burst.current.value

    // Where each shape sits, as [x, y, scale] and opacity. Wide screens: shapes right of
    // the text, the wave across the lower half. Phones: smaller and above the text,
    // dimmer where they sit behind it.
    const w = viewport.width / 2
    const h = viewport.height / 2
    const scenes = narrow
      ? [
          [w * 0.36, h * 0.5, 0.62, 0.55], // cube
          [0, -h * 0.45, 0.6, 0.4], // wave
          [0, h * 0.42, 0.5, 0.6], // store cards
          [0, h * 0.42, 0.5, 0.6], // page
          [0, h * 0.4, 0.55, 0.6], // phone
          [w * 0.3, h * 0.55, 0.6, 0.35], // sphere
        ]
      : [
          [w * 0.48, 0, 1.15, 1],
          [0, -h * 0.4, 1, 0.45],
          [w * 0.5, -h * 0.02, 0.95, 0.9],
          [w * 0.5, 0, 0.95, 0.9],
          [w * 0.5, 0, 1, 0.9],
          [w * 0.45, 0, 1.3, 0.6],
        ]
    scenes.forEach(([x, y, scale, alpha], i) => {
      u.uPlace.value.set([x!, y!, scale!], i * 3)
      u.uAlpha.value[i] = alpha!
    })
    u.uPointSize.value = POINT_SIZE * (size.height / 2) * gl.getPixelRatio()

    // Ease the tilt toward the pointer, and the cursor push in and out.
    const p = pointer.current
    const tilt = u.uTilt.value as number[]
    tilt[0]! += (p.x - tilt[0]!) * 0.05
    tilt[1]! += (p.y - tilt[1]!) * 0.05
    u.uPointer.value = [(p.x * viewport.width) / 2, (p.y * viewport.height) / 2]
    u.uPointerActive.value += ((p.active ? 1 : 0) - u.uPointerActive.value) * 0.1
  })

  return (
    <points frustumCulled={false}>
      <bufferGeometry key={count}>
        <bufferAttribute attach="attributes-aStart" args={[geometry.start, 3]} />
        {SHAPE_ATTRIBUTES.map((name, i) => (
          <bufferAttribute key={name} attach={`attributes-${name}`} args={[geometry.positions[i]!, 3]} />
        ))}
        <bufferAttribute attach="attributes-aTonesA" args={[geometry.tonesA, 3]} />
        <bufferAttribute attach="attributes-aTonesB" args={[geometry.tonesB, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[geometry.seed, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </points>
  )
}

// Three per-particle arrays into one, as [a0, b0, c0, a1, b1, c1, ...].
function interleave(arrays: Float32Array[]): Float32Array {
  const count = arrays[0]?.length ?? 0
  const out = new Float32Array(count * arrays.length)
  arrays.forEach((array, k) => array.forEach((v, i) => (out[i * arrays.length + k] = v)))
  return out
}

// Reads the scroll position from the slides themselves, so it follows Lenis,
// the pinned services strip and native scrolling alike.
function useMorph() {
  const slides = useRef<{ services: HTMLElement | null, panel: HTMLElement | null, contact: HTMLElement | null } | null>(null)

  return () => {
    if (!slides.current) {
      const services = document.getElementById('services')
      slides.current = { services, panel: services?.querySelector('article') ?? null, contact: document.getElementById('contact') }
    }
    const { services, panel, contact } = slides.current
    if (!services || !panel || !contact) return 0
    const section = services.getBoundingClientRect()
    const first = panel.getBoundingClientRect()
    return morphProgress({
      servicesTop: section.top,
      contactTop: contact.getBoundingClientRect().top,
      // The strip slides left (transform on desktop, native scroll on touch), so the
      // first panel's offset says how many panels along it is.
      panel: (section.left - first.left) / Math.max(1, first.width),
      viewportHeight: window.innerHeight,
    })
  }
}

// Watches Redux for sent messages and plays a short outward burst for each one.
function useBurst() {
  const store = useAppStore()
  const burst = useRef({ value: 0 })

  useEffect(() => {
    let seen = store.getState().ui.sent
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    return store.subscribe(() => {
      const { sent } = store.getState().ui
      if (sent === seen) return
      seen = sent
      if (reduced) return
      gsap.timeline()
        .to(burst.current, { value: 1, duration: 0.45, ease: 'power3.out' })
        .to(burst.current, { value: 0, duration: 1.6, ease: 'elastic.out(1, 0.5)' })
    })
  }, [store])

  return burst
}

// Pointer position in -1..1 (y up), tracked on the window because the canvas sits behind the page.
function usePointer() {
  const pointer = useRef({ x: 0, y: 0, active: false, reduced: false })

  useEffect(() => {
    const p = pointer.current
    p.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const move = (e: PointerEvent) => {
      p.x = (e.clientX / window.innerWidth) * 2 - 1
      p.y = -((e.clientY / window.innerHeight) * 2 - 1)
      p.active = true
    }
    const leave = () => {
      p.active = false
    }
    // A finger lifting means the "cursor" is gone; a mouse button lifting doesn't.
    const up = (e: PointerEvent) => {
      if (e.pointerType === 'touch') leave()
    }
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerup', up)
    document.documentElement.addEventListener('pointerleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      document.documentElement.removeEventListener('pointerleave', leave)
    }
  }, [])

  return pointer
}
