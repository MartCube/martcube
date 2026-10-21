'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import gsap from 'gsap'
import { useEffect, useMemo, useRef } from 'react'
import type { ShaderMaterial } from 'three'
import { useAppStore } from '@/store/hooks'
import { sceneMotion } from '@/motion/controller'
import { fragmentShader, vertexShader } from './shaders/particles'
import { cubeShape } from './shapes/cube'
import { scatter } from './shapes/scatter'
import { cmsShape, phoneShape, storeShape } from './shapes/services'
import { sphereShape } from './shapes/sphere'
import { waveShape } from './shapes/wave'
import { particleBudget } from './support'

const NARROW = 720
// One shape per deck stop: hero cube, the four services, contact sphere.
const SCENES = 6
// Shader attribute for each shape, in stop order. The cube is `position`, three.js's built-in.
const SHAPE_ATTRIBUTES = ['position', 'aWave', 'aStore', 'aCms', 'aPhone', 'aSphere']
const POINT_SIZE = 0.055

// The one WebGL canvas behind the whole page. Pixel ratio is capped: past 1.75 the
// dots look the same but cost far more on high-density phones.
export default function ParticleField({ onLost }: { onLost: () => void }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      onCreated={({ gl }) => {
        // The GPU can drop the context (driver reset, too many tabs). Switch to the poster.
        gl.domElement.addEventListener('webglcontextlost', (e) => {
          e.preventDefault()
          onLost()
        })
      }}
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
  const count = particleBudget(size.width, navigator.hardwareConcurrency)

  // Built once per particle count: a start position, a spot in each shape, tones and a random seed.
  const geometry = useMemo(() => {
    const shapes = [cubeShape, waveShape, storeShape, cmsShape, phoneShape, sphereShape].map(build => build(count))
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
    uFrom: { value: 0 },
    uTo: { value: 0 },
    uMix: { value: 1 },
    uBurst: { value: 0 },
    uPlace: { value: new Float32Array(SCENES * 3) },
    uAlpha: { value: new Float32Array(SCENES) },
    uTilt: { value: [0, 0] },
    uPointer: { value: [99, 99] },
    uPointerActive: { value: 0 },
    uPointSize: { value: 1 },
  }), [])

  const pointer = usePointer()
  const formSpot = useFormSpot()
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

    // Reduced motion: no idle movement at all, shapes only change with the slides.
    if (!reduced) u.uTime.value += delta
    u.uIntro.value = intro.current.value

    // The deck engine tweens this between stops.
    u.uFrom.value = sceneMotion.from
    u.uTo.value = sceneMotion.to
    u.uMix.value = sceneMotion.mix
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
          [0, h * 0.42, 0.5, 0.6], // CMS layers
          [0, h * 0.4, 0.55, 0.6], // phone
          [w * 0.3, h * 0.55, 0.6, 0.35], // sphere
        ]
      : [
          [w * 0.48, 0, 1.15, 1],
          [0, -h * 0.4, 1, 0.45],
          [w * 0.5, -h * 0.02, 0.95, 0.9],
          [w * 0.5, 0, 0.95, 0.9],
          [w * 0.5, 0, 1, 0.9],
          formSpot(viewport.width, viewport.height) ?? [w * 0.45, 0, 1.3, 0.6],
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

// Where the contact form's column sits on its slide (it stays when the form swaps to "Message sent"), in scene units, so the sphere can wrap around it:
// [x, y, scale, opacity]. Measured against the contact slide's top, so it doesn't move as the slide slides in.
const SPHERE_RADIUS = 2.3

function useFormSpot() {
  const els = useRef<{ slide: HTMLElement | null, form: HTMLElement | null } | null>(null)

  return (worldWidth: number, worldHeight: number) => {
    els.current ??= { slide: document.getElementById('contact'), form: document.querySelector<HTMLElement>('#contact form')?.parentElement ?? null }
    const { slide, form } = els.current
    if (!slide || !form?.isConnected) {
      els.current = null
      return null
    }
    const rect = form.getBoundingClientRect()
    const top = slide.getBoundingClientRect().top
    const toX = worldWidth / window.innerWidth
    const toY = worldHeight / window.innerHeight
    const x = (rect.left + rect.width / 2 - window.innerWidth / 2) * toX
    const y = (window.innerHeight / 2 - (rect.top - top + rect.height / 2)) * toY
    const radius = Math.max(rect.width * toX, rect.height * toY) * 0.62
    return [x, y, radius / SPHERE_RADIUS, 0.6]
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
