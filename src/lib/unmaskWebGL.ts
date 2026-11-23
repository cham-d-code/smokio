// WebGL Unmask Trail Engine matching MONS spec, adapted for Kevin Smokio's studio portrait:
// - Offscreen 2D trail canvas: 360 x 239 (mapped to the portrait container in 1440x900 frame)
// - Stamping soft radial blobs (white .9 -> .55 -> 0, composite 'lighter')
// - Radius r = 24 + 10 * min(1, d / 18), step r * 0.25, jump > 70 starts new segment
// - Decay per frame: fill black at alpha 1 - 0.05^(dt / 850)
// - Energy multiplied by 0.05^(dt / 900), stops loop when <= 0.004
// - Fragment shader:
//     Layer A (masked): smoked steel-graphite monochrome veil with subtle visor micro-scanlines
//     Layer B (unmasked): Kevin Smokio's full-color portrait (vivid red cap, amber shades, skin tones)
//     2-octave animated value noise, smoothstep(.40, .47, tr), gradient edge detector +-1.6px,
//     cherry red (.878, .192, .247) glow + pink-white contour line.

export const TRAIL_W = 240;
export const TRAIL_H = 372;

export interface PortraitBox {
  left: number;
  top: number;
  width: number;
  height: number;
}

const VERT_SRC = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  v_uv.y = 1.0 - v_uv.y;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FRAG_SRC = `
precision mediump float;
varying vec2 v_uv;

uniform sampler2D u_portrait;
uniform sampler2D u_trail;
uniform float u_time;
uniform vec2 u_trailTexel;
uniform vec2 u_uvScale;
uniform vec2 u_uvOffset;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

void main() {
  vec2 imgUv = v_uv * u_uvScale + u_uvOffset;
  vec4 src = texture2D(u_portrait, imgUv);

  // Layer B: Full vibrant color Smokio portrait with clean editorial pop
  vec3 colB = src.rgb;

  // Layer A: Smoked visor monochrome veil (cool graphite-silver + subtle scanlines)
  float lum = dot(src.rgb, vec3(0.299, 0.587, 0.114));
  float scan = 0.96 + 0.04 * sin(v_uv.y * 320.0);
  vec3 colA = vec3(0.84, 0.87, 0.91) * pow(clamp(lum, 0.0, 1.0), 1.06) * 0.94 * scan;

  float rawT = texture2D(u_trail, v_uv).r;
  float t = u_time;

  float nz = vnoise(v_uv * vec2(9.5, 14.5) + t * vec2(0.35, -0.2)) * 0.55
           + vnoise(v_uv * vec2(22.0, 34.0) - t * 0.5) * 0.45;

  float tr = rawT + (nz - 0.5) * 0.16;
  float m = smoothstep(0.40, 0.47, tr);

  vec3 rgb = mix(colA, colB, m);

  // Spatial gradient edge detector (+- 1.6 trail px)
  vec2 dx = vec2(u_trailTexel.x * 1.6, 0.0);
  vec2 dy = vec2(0.0, u_trailTexel.y * 1.6);
  float gx = texture2D(u_trail, v_uv + dx).r - texture2D(u_trail, v_uv - dx).r;
  float gy = texture2D(u_trail, v_uv + dy).r - texture2D(u_trail, v_uv - dy).r;
  float grad = length(vec2(gx, gy));
  float edge = smoothstep(0.012, 0.07, grad);

  float glow = edge * (1.0 - smoothstep(0.0, 0.2, abs(tr - 0.43)));
  float line = edge * smoothstep(0.405, 0.43, tr) * (1.0 - smoothstep(0.43, 0.455, tr));

  vec3 cherry = vec3(0.878, 0.192, 0.247);
  rgb = mix(rgb, cherry, glow * 0.78);
  rgb = mix(rgb, vec3(1.0, 0.86, 0.87), line * 0.9);
  rgb += cherry * glow * glow * 0.25;

  gl_FragColor = vec4(rgb * src.a, src.a);
}
`;

export interface UnmaskController {
  resize: (frameScale: number) => void;
  stampFramePoint: (fx: number, fy: number) => void;
  breakTrail: () => void;
  setActive: (active: boolean) => void;
  destroy: () => void;
}

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  src: string
): WebGLShader | null {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

function createTexture(
  gl: WebGLRenderingContext,
  unit: number,
  source: HTMLImageElement | HTMLCanvasElement
): WebGLTexture | null {
  const tex = gl.createTexture();
  if (!tex) return null;
  gl.activeTexture(gl.TEXTURE0 + unit);
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 0);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
  return tex;
}

export function createUnmaskWebGL(
  canvas: HTMLCanvasElement,
  portraitImg: HTMLImageElement,
  box: PortraitBox
): UnmaskController | null {
  const gl = canvas.getContext('webgl', {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    preserveDrawingBuffer: false,
  });
  if (!gl) return null;

  const vs = compileShader(gl, gl.VERTEX_SHADER, VERT_SRC);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAG_SRC);
  if (!vs || !fs) return null;

  const prog = gl.createProgram();
  if (!prog) return null;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    gl.deleteProgram(prog);
    return null;
  }

  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    gl.STATIC_DRAW
  );
  const aPos = gl.getAttribLocation(prog, 'a_pos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  // Offscreen trail buffer matching portrait aspect
  const trailCanvas = document.createElement('canvas');
  trailCanvas.width = TRAIL_W;
  trailCanvas.height = TRAIL_H;
  const tctx = trailCanvas.getContext('2d');
  if (!tctx) return null;

  tctx.fillStyle = '#000000';
  tctx.fillRect(0, 0, TRAIL_W, TRAIL_H);

  const texPortrait = createTexture(gl, 0, portraitImg);
  const texTrail = createTexture(gl, 1, trailCanvas);
  if (!texPortrait || !texTrail) return null;

  // Compute object-cover UV transform so portrait never stretches
  const imgAspect =
    (portraitImg.naturalWidth || 2) / Math.max(1, portraitImg.naturalHeight || 3);
  const boxAspect = box.width / Math.max(1, box.height);
  let uvScaleX = 1;
  let uvScaleY = 1;
  let uvOffX = 0;
  let uvOffY = 0;
  if (imgAspect > boxAspect) {
    uvScaleX = boxAspect / imgAspect;
    uvOffX = (1 - uvScaleX) * 0.5;
  } else {
    uvScaleY = imgAspect / boxAspect;
    uvOffY = (1 - uvScaleY) * 0.25; // favor top framing for red cap & face
  }

  gl.uniform1i(gl.getUniformLocation(prog, 'u_portrait'), 0);
  gl.uniform1i(gl.getUniformLocation(prog, 'u_trail'), 1);
  gl.uniform2f(
    gl.getUniformLocation(prog, 'u_trailTexel'),
    1 / TRAIL_W,
    1 / TRAIL_H
  );
  gl.uniform2f(gl.getUniformLocation(prog, 'u_uvScale'), uvScaleX, uvScaleY);
  gl.uniform2f(gl.getUniformLocation(prog, 'u_uvOffset'), uvOffX, uvOffY);
  const uTimeLoc = gl.getUniformLocation(prog, 'u_time');

  gl.clearColor(0, 0, 0, 0);

  let energy = 0;
  let rafId = 0;
  let lastTime = 0;
  let prevX: number | null = null;
  let prevY: number | null = null;
  let isActive = true;
  let destroyed = false;

  const uploadTrailAndDraw = (nowMs: number) => {
    if (destroyed) return;
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, texTrail);
    gl.texSubImage2D(
      gl.TEXTURE_2D,
      0,
      0,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      trailCanvas
    );

    gl.uniform1f(uTimeLoc, nowMs * 0.001);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };

  const stampBlob = (cx: number, cy: number, r: number) => {
    const grad = tctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    grad.addColorStop(0, 'rgba(255,255,255,0.9)');
    grad.addColorStop(0.6, 'rgba(255,255,255,0.55)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    tctx.globalCompositeOperation = 'lighter';
    tctx.fillStyle = grad;
    tctx.beginPath();
    tctx.arc(cx, cy, r, 0, Math.PI * 2);
    tctx.fill();
  };

  const tick = (now: number) => {
    rafId = 0;
    if (destroyed || !isActive) return;

    const dt = lastTime ? Math.min(64, now - lastTime) : 16.6;
    lastTime = now;

    // Exponential decay (~0.85s)
    const decayAlpha = 1 - Math.pow(0.05, dt / 850);
    tctx.globalCompositeOperation = 'source-over';
    tctx.fillStyle = `rgba(0,0,0,${decayAlpha.toFixed(4)})`;
    tctx.fillRect(0, 0, TRAIL_W, TRAIL_H);

    energy *= Math.pow(0.05, dt / 900);

    if (energy <= 0.004) {
      energy = 0;
      tctx.globalCompositeOperation = 'source-over';
      tctx.fillStyle = '#000000';
      tctx.fillRect(0, 0, TRAIL_W, TRAIL_H);
      uploadTrailAndDraw(now);
      lastTime = 0;
      return;
    }

    uploadTrailAndDraw(now);
    rafId = requestAnimationFrame(tick);
  };

  const ensureLoop = () => {
    if (!rafId && isActive && !destroyed) {
      lastTime = performance.now();
      rafId = requestAnimationFrame(tick);
    }
  };

  const resize = (frameScale: number) => {
    if (destroyed) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = Math.max(280, Math.round(Math.min(1600, box.width * frameScale * dpr)));
    const h = Math.round((w * box.height) / box.width);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      uploadTrailAndDraw(performance.now());
    }
  };

  const stampFramePoint = (fx: number, fy: number) => {
    if (destroyed || !isActive) return;
    const tx = ((fx - box.left) / box.width) * TRAIL_W;
    const ty = ((fy - box.top) / box.height) * TRAIL_H;

    if (tx < -40 || tx > TRAIL_W + 40 || ty < -40 || ty > TRAIL_H + 40) {
      prevX = null;
      prevY = null;
      return;
    }

    if (prevX === null || prevY === null) {
      stampBlob(tx, ty, 26);
    } else {
      const dx = tx - prevX;
      const dy = ty - prevY;
      const d = Math.hypot(dx, dy);
      if (d > 70) {
        stampBlob(tx, ty, 26);
      } else {
        const r = 26 + 10 * Math.min(1, d / 18);
        const step = Math.max(2, r * 0.25);
        const steps = Math.max(1, Math.ceil(d / step));
        for (let i = 1; i <= steps; i++) {
          const t = i / steps;
          stampBlob(prevX + dx * t, prevY + dy * t, r);
        }
      }
    }

    prevX = tx;
    prevY = ty;
    energy = 1;
    ensureLoop();
  };

  const breakTrail = () => {
    prevX = null;
    prevY = null;
  };

  const setActive = (active: boolean) => {
    isActive = active;
    if (!active && rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
      lastTime = 0;
    } else if (active && energy > 0.004) {
      ensureLoop();
    }
  };

  const destroy = () => {
    destroyed = true;
    if (rafId) cancelAnimationFrame(rafId);
    gl.deleteTexture(texPortrait);
    gl.deleteTexture(texTrail);
    gl.deleteBuffer(buf);
    gl.deleteProgram(prog);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
  };

  // Initial draw
  uploadTrailAndDraw(performance.now());

  return {
    resize,
    stampFramePoint,
    breakTrail,
    setActive,
    destroy,
  };
}
