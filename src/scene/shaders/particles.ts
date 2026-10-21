// Vertex shader: every particle has a spot in three shapes (cube, wave, sphere).
// `uMorph` runs 0 → 1 → 2 with the scroll and blends between them, then the cursor
// pushes particles away. All motion is computed here, on the GPU.
//
// Each shape has a placement uniform: vec3(x offset, y offset, scale).
export const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uIntro;
  uniform float uMorph;
  uniform float uBurst;
  uniform vec3 uCube;
  uniform vec3 uWave;
  uniform vec3 uSphere;
  uniform vec3 uAlpha;
  uniform vec2 uTilt;
  uniform vec2 uPointer;
  uniform float uPointerActive;
  uniform float uPointSize;

  attribute vec3 aStart;
  attribute vec3 aWave;
  attribute vec3 aSphere;
  attribute vec3 aColor;
  attribute vec3 aColorWave;
  attribute vec3 aColorSphere;
  attribute float aSeed;

  varying vec3 vColor;
  varying float vAlpha;

  mat3 rotateY(float a) {
    float c = cos(a), s = sin(a);
    return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c);
  }

  mat3 rotateX(float a) {
    float c = cos(a), s = sin(a);
    return mat3(1.0, 0.0, 0.0, 0.0, c, s, 0.0, -s, c);
  }

  vec3 place(vec3 p, vec3 at) {
    return p * at.z + vec3(at.xy, 0.0);
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

    // Breathing sphere that turns slowly; a sent message blows it outward for a moment.
    float breath = 1.0 + 0.03 * sin(uTime * 1.5 + aSeed * 6.283);
    float burst = uBurst * (0.2 + aSeed * 0.6);
    vec3 sphere = rotateX(0.3 + uTilt.y * 0.3) * rotateY(uTime * 0.2 + uTilt.x * 0.5) * aSphere * (breath + burst);

    float toWave = stage(uMorph);
    float toSphere = stage(uMorph - 1.0);
    vec3 shape = mix(mix(place(cube, uCube), place(wave, uWave), toWave), place(sphere, uSphere), toSphere);

    // Mid-morph, particles swing off their straight path a little.
    float flight = sin(3.14159 * toWave) + sin(3.14159 * toSphere);
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

    vColor = mix(mix(aColor, aColorWave, toWave), aColorSphere, toSphere);
    vAlpha = mix(mix(uAlpha.x, uAlpha.y, toWave), uAlpha.z, toSphere);
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
