'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import gsap from 'gsap'
import { useEffect, useMemo, useRef } from 'react'
import type { ShaderMaterial } from 'three'
import { useAppStore } from '@/store/hooks'
import { morphProgress } from './morph'
import { fragmentShader, vertexShader } from './shaders/particles'
import { cubeShape } from './shapes/cube'
import { scatter } from './shapes/scatter'
import { sphereShape } from './shapes/sphere'
import { waveShape } from './shapes/wave'

const NARROW = 720
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

  // Built once per particle count: a start position, a spot in each shape, colours and a random seed.
  const geometry = useMemo(() => ({
    start: scatter(count),
    cube: cubeShape(count),
    wave: waveShape(count),
    sphere: sphereShape(count),
    seed: Float32Array.from({ length: count }, () => Math.random()),
  }), [count])

  // Initial values only: R3F copies these into the material, so per-frame updates
  // go through `material.current.uniforms`, not this object.
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uIntro: { value: 0 },
    uMorph: { value: 0 },
    uBurst: { value: 0 },
    uCube: { value: [0, 0, 1] },
    uWave: { value: [0, 0, 1] },
    uSphere: { value: [0, 0, 1] },
    uAlpha: { value: [1, 1, 1] },
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

    // Where each shape sits. Wide screens: cube right of the hero text, a wave
    // across the lower half of services, the sphere behind the contact form.
    // Phones: everything smaller and higher, and dimmer where it sits behind text.
    const w = viewport.width / 2
    const h = viewport.height / 2
    u.uCube.value = narrow ? [w * 0.36, h * 0.5, 0.62] : [w * 0.48, 0, 1.15]
    u.uWave.value = narrow ? [0, -h * 0.45, 0.6] : [0, -h * 0.4, 1]
    u.uSphere.value = narrow ? [w * 0.3, h * 0.55, 0.6] : [w * 0.45, 0, 1.3]
    u.uAlpha.value = narrow ? [0.55, 0.4, 0.35] : [1, 0.45, 0.6]
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
        <bufferAttribute attach="attributes-position" args={[geometry.cube.positions, 3]} />
        <bufferAttribute attach="attributes-aStart" args={[geometry.start, 3]} />
        <bufferAttribute attach="attributes-aWave" args={[geometry.wave.positions, 3]} />
        <bufferAttribute attach="attributes-aSphere" args={[geometry.sphere.positions, 3]} />
        <bufferAttribute attach="attributes-aColor" args={[geometry.cube.colors, 3]} />
        <bufferAttribute attach="attributes-aColorWave" args={[geometry.wave.colors, 3]} />
        <bufferAttribute attach="attributes-aColorSphere" args={[geometry.sphere.colors, 3]} />
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

// Reads the scroll position from the slides themselves, so it follows Lenis,
// the pinned services strip and native scrolling alike.
function useMorph() {
  const slides = useRef<{ services: HTMLElement | null, contact: HTMLElement | null } | null>(null)

  return () => {
    slides.current ??= { services: document.getElementById('services'), contact: document.getElementById('contact') }
    const { services, contact } = slides.current
    if (!services || !contact) return 0
    return morphProgress(services.getBoundingClientRect().top, contact.getBoundingClientRect().top, window.innerHeight)
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
