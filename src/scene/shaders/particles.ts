// Vertex shader: each particle flies from its scattered start to its spot on the rotating cube,
// then gets pushed away from the cursor. All motion is computed here, on the GPU.
export const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uIntro;
  uniform float uScale;
  uniform vec2 uOffset;
  uniform vec2 uTilt;
  uniform vec2 uPointer;
  uniform float uPointerActive;
  uniform float uPointSize;
  uniform float uVisibility;

  attribute vec3 aStart;
  attribute vec3 aColor;
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

  void main() {
    // Isometric-ish cube that turns slowly and leans toward the pointer.
    vec3 cube = rotateX(0.62 + uTilt.y * 0.4) * rotateY(uTime * 0.35 + 0.785 + uTilt.x * 0.6) * position;
    cube = cube * uScale + vec3(uOffset, 0.0);
    cube += 0.02 * sin(uTime * 2.0 + aSeed * 40.0);

    // Staggered gather: particles with a higher seed arrive later, so it reads as a flock.
    float t = clamp(uIntro * 1.4 - aSeed * 0.4, 0.0, 1.0);
    t = t * t * (3.0 - 2.0 * t);
    vec3 p = mix(aStart, cube, t);

    // Cursor pushes particles away within a soft radius.
    vec2 away = p.xy - uPointer;
    float push = uPointerActive * (1.0 - smoothstep(0.0, 1.6, dot(away, away))) * 0.9;
    p.xy += normalize(away + 1e-5) * push;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uPointSize / -mv.z;

    vColor = aColor;
    vAlpha = uVisibility;
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
