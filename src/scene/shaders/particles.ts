import { paletteGlsl } from '../colors'

// Vertex shader: every particle has a spot in six shapes, one per deck stop:
// 0 cube, 1 wave, 2 store bag, 3 CMS window, 4 phone, 5 sphere.
// The deck morphs straight from shape `uFrom` to shape `uTo` as `uMix` runs 0 → 1,
// so a jump from the cube to the sphere never passes through the shapes between.
// Then the cursor pushes particles away. All motion is computed here, on the GPU.
//
// Each shape has a placement, vec3(x offset, y offset, scale), and an opacity.
export const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uIntro;
  uniform float uFrom;
  uniform float uTo;
  uniform float uMix;
  uniform float uBurst;
  uniform vec3 uPlace[6];
  uniform float uAlpha[6];
  uniform vec2 uTilt;
  uniform vec2 uPointer;
  uniform float uPointerActive;
  uniform float uPointSize;

  attribute vec3 aStart;
  attribute vec3 aWave;
  attribute vec3 aStore;
  attribute vec3 aCms;
  attribute vec3 aApp;
  attribute vec3 aSphere;
  attribute vec3 aTonesA; // cube, wave, store
  attribute vec3 aTonesB; // cms, app, sphere
  attribute float aSeed;

  varying vec3 vColor;
  varying float vAlpha;

  ${paletteGlsl}

  mat3 rotateY(float a) {
    float c = cos(a), s = sin(a);
    return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c);
  }

  mat3 rotateX(float a) {
    float c = cos(a), s = sin(a);
    return mat3(1.0, 0.0, 0.0, 0.0, c, s, 0.0, -s, c);
  }

  vec3 place(vec3 p, int i) {
    return p * uPlace[i].z + vec3(uPlace[i].xy, 0.0);
  }

  // 0..1 progress of one morph step for this particle. Higher seeds leave later,
  // so a morph reads as a flock moving rather than one solid jump.
  float stage(float m) {
    float t = clamp((m - aSeed * 0.35) / 0.65, 0.0, 1.0);
    return t * t * (3.0 - 2.0 * t);
  }

  void main() {
    // Isometric-ish cube that turns slowly and leans toward the pointer.
    vec3 cube = rotateX(0.62 + uTilt.y * 0.4) * rotateY(uTime * 0.35 + 0.785 + uTilt.x * 0.6) * position;

    // Rolling waves: a flat grid lifted by two sine waves, tipped back like a landscape.
    vec3 w = aWave;
    w.y = sin(w.x * 0.55 + uTime * 0.9) * 0.45 + sin(w.z * 0.9 - uTime * 0.7 + w.x * 0.2) * 0.3;
    vec3 wave = rotateX(0.45 + uTilt.y * 0.15) * rotateY(-0.2 + uTilt.x * 0.2) * w;

    // The bag turns slowly like the cube, seen a little from above. The CMS window and the
    // phone only sway, so their fronts keep facing the viewer and their layers show depth.
    mat3 turn = rotateX(0.42 + uTilt.y * 0.3) * rotateY(uTime * 0.3 + 0.6 + uTilt.x * 0.5);
    mat3 sway = rotateX(0.15 + uTilt.y * 0.3) * rotateY(-0.4 + sin(uTime * 0.45) * 0.3 + uTilt.x * 0.5);
    vec3 store = turn * aStore;
    vec3 cms = sway * aCms;
    vec3 app = sway * aApp;

    // Breathing sphere that turns slowly; a sent message blows it outward for a moment.
    float breath = 1.0 + 0.03 * sin(uTime * 1.5 + aSeed * 6.283);
    float burst = uBurst * (0.2 + aSeed * 0.6);
    vec3 sphere = rotateX(0.3 + uTilt.y * 0.3) * rotateY(uTime * 0.2 + uTilt.x * 0.5) * aSphere * (breath + burst);

    vec3 shapes[6] = vec3[6](place(cube, 0), place(wave, 1), place(store, 2), place(cms, 3), place(app, 4), place(sphere, 5));
    float tones[6] = float[6](aTonesA.x, aTonesA.y, aTonesA.z, aTonesB.x, aTonesB.y, aTonesB.z);
    int a = int(uFrom + 0.5);
    int b = int(uTo + 0.5);

    // Blend from one shape to the other. Mid-morph, particles swing off their straight path.
    float m = stage(uMix);
    vec3 shape = mix(shapes[a], shapes[b], m);
    float flight = a == b ? 0.0 : sin(3.14159 * m);
    shape += flight * 0.8 * vec3(sin(aSeed * 91.0), cos(aSeed * 53.0), sin(aSeed * 27.0));
    shape += 0.02 * sin(uTime * 2.0 + aSeed * 40.0);

    // Staggered gather on load, from the scatter into the first shape.
    float t = clamp(uIntro * 1.4 - aSeed * 0.4, 0.0, 1.0);
    t = t * t * (3.0 - 2.0 * t);
    vec3 p = mix(aStart, shape, t);

    // Cursor pushes particles away within a soft radius.
    vec2 away = p.xy - uPointer;
    float push = uPointerActive * (1.0 - smoothstep(0.0, 1.6, dot(away, away))) * 0.9;
    p.xy += normalize(away + 1e-5) * push;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uPointSize / -mv.z;

    vColor = toneColor(m < 0.5 ? tones[a] : tones[b]);
    float alpha = mix(uAlpha[a], uAlpha[b], m);
    vAlpha = alpha;
  }
`

// Fragment shader: a soft round dot.
export const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = 1.0 - smoothstep(0.2, 0.5, d);
    if (a * vAlpha < 0.01) discard;
    gl_FragColor = vec4(vColor, a * vAlpha);
  }
`
