'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import gsap from 'gsap'
import { useEffect, useMemo, useRef } from 'react'
import type { ShaderMaterial } from 'three'
import { useAppStore } from '@/store/hooks'
import { fragmentShader, vertexShader } from './shaders/particles'
import { cubeShape } from './shapes/cube'
import { scatter } from './shapes/scatter'

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
  const store = useAppStore()
  const size = useThree(s => s.size)
  const count = size.width < NARROW ? 3200 : 7000

  // Built once per particle count: start positions, cube positions, colours and a random seed each.
  const geometry = useMemo(() => {
    const cube = cubeShape(count)
    return {
      start: scatter(count),
      target: cube.positions,
      color: cube.colors,
      seed: Float32Array.from({ length: count }, () => Math.random()),
    }
  }, [count])

  // Initial values only: R3F copies these into the material, so per-frame updates
  // go through `material.current.uniforms`, not this object.
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uIntro: { value: 0 },
    uScale: { value: 1 },
    uOffset: { value: [0, 0] },
    uTilt: { value: [0, 0] },
    uPointer: { value: [99, 99] },
    uPointerActive: { value: 0 },
    uPointSize: { value: 1 },
    uVisibility: { value: 1 },
  }), [])

  const pointer = usePointer()

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

    // Cube sits right of the text on wide screens. On phones it is smaller and
    // sits behind the top of the text, so it is dimmed to keep the copy readable.
    u.uScale.value = narrow ? 0.62 : 1.15
    u.uOffset.value = narrow ? [viewport.width * 0.18, (viewport.height / 2) * 0.5] : [(viewport.width / 2) * 0.48, 0]
    u.uPointSize.value = POINT_SIZE * (size.height / 2) * gl.getPixelRatio()

    // Ease the tilt toward the pointer, and the cursor push in and out.
    const p = pointer.current
    const tilt = u.uTilt.value as number[]
    tilt[0]! += (p.x - tilt[0]!) * 0.05
    tilt[1]! += (p.y - tilt[1]!) * 0.05
    u.uPointer.value = [(p.x * viewport.width) / 2, (p.y * viewport.height) / 2]
    u.uPointerActive.value += ((p.active ? 1 : 0) - u.uPointerActive.value) * 0.1

    // Read Redux without re-rendering: show the cube on the hero, fade it on other slides.
    // Task 6 replaces this fade with morphs into the other scenes.
    const onHero = store.getState().ui.slide === 0
    u.uVisibility.value += ((onHero ? (narrow ? 0.55 : 1) : 0) - u.uVisibility.value) * 0.06
  })

  return (
    <points frustumCulled={false}>
      <bufferGeometry key={count}>
        <bufferAttribute attach="attributes-position" args={[geometry.target, 3]} />
        <bufferAttribute attach="attributes-aStart" args={[geometry.start, 3]} />
        <bufferAttribute attach="attributes-aColor" args={[geometry.color, 3]} />
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
