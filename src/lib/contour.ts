// Deterministic 3-octave value-noise marching-squares topographic contour SVG
// Matches MONS spec: viewBox 0 0 1440 900, scales 260/120/55 px, weights .65/.25/.10,
// 12 px grid, iso levels 0.30..0.80 step 0.03, edge weight clamp((max(|dx|*1.05, |dy|*0.6) - .35)/.5) > .05,
// 4 opacity groups (.18, .36, .55, .75), 1 px round-capped strokes in #9AA0A6.

function hash2(ix: number, iy: number): number {
  const n = Math.sin(ix * 127.1 + iy * 311.7) * 43758.5453123;
  return n - Math.floor(n);
}

function vnoise(x: number, y: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);

  const a = hash2(ix, iy);
  const b = hash2(ix + 1, iy);
  const c = hash2(ix, iy + 1);
  const d = hash2(ix + 1, iy + 1);

  return (a + (b - a) * ux) + ((c + (d - c) * ux) - (a + (b - a) * ux)) * uy;
}

function sampleField(x: number, y: number): number {
  return (
    vnoise(x / 260, y / 260) * 0.65 +
    vnoise(x / 120 + 17.3, y / 120 + 9.1) * 0.25 +
    vnoise(x / 55 + 41.7, y / 55 + 23.4) * 0.1
  );
}

function edgeWeight(x: number, y: number, w: number, h: number): number {
  const dx = Math.abs((x - w * 0.5) / (w * 0.5));
  const dy = Math.abs((y - h * 0.5) / (h * 0.5));
  const raw = (Math.max(dx * 1.05, dy * 0.6) - 0.35) / 0.5;
  return Math.max(0, Math.min(1, raw));
}

function interp(v1: number, v2: number, iso: number): number {
  const denom = v2 - v1;
  if (Math.abs(denom) < 1e-6) return 0.5;
  return Math.max(0, Math.min(1, (iso - v1) / denom));
}

let cachedDataUri: string | null = null;

export function getContourSvgDataUri(): string {
  if (cachedDataUri) return cachedDataUri;

  const W = 1440;
  const H = 900;
  const STEP = 12;
  const cols = Math.floor(W / STEP);
  const rows = Math.floor(H / STEP);

  // Precompute noise grid
  const grid = new Float32Array((cols + 1) * (rows + 1));
  for (let r = 0; r <= rows; r++) {
    const y = r * STEP;
    for (let c = 0; c <= cols; c++) {
      grid[r * (cols + 1) + c] = sampleField(c * STEP, y);
    }
  }

  // 4 opacity buckets: .18, .36, .55, .75
  const groups: string[][] = [[], [], [], []];

  // Marching squares lookup table for edge pairs:
  // Edges: 0=top (tl-tr), 1=right (tr-br), 2=bottom (bl-br), 3=left (tl-bl)
  const cases: number[][][] = [
    [],
    [[3, 2]],
    [[2, 1]],
    [[3, 1]],
    [[0, 1]],
    [[3, 0], [2, 1]],
    [[0, 2]],
    [[3, 0]],
    [[3, 0]],
    [[0, 2]],
    [[3, 2], [0, 1]],
    [[0, 1]],
    [[3, 1]],
    [[2, 1]],
    [[3, 2]],
    [],
  ];

  const isos: number[] = [];
  for (let v = 0.3; v <= 0.8001; v += 0.03) {
    isos.push(Number(v.toFixed(2)));
  }

  const f = (n: number) => Math.round(n * 10) / 10;

  for (let r = 0; r < rows; r++) {
    const y0 = r * STEP;
    const y1 = y0 + STEP;
    const rowOff = r * (cols + 1);
    const nextOff = (r + 1) * (cols + 1);

    for (let c = 0; c < cols; c++) {
      const x0 = c * STEP;
      const x1 = x0 + STEP;

      const ew = edgeWeight(x0 + STEP * 0.5, y0 + STEP * 0.5, W, H);
      if (ew <= 0.05) continue;

      const tl = grid[rowOff + c];
      const tr = grid[rowOff + c + 1];
      const br = grid[nextOff + c + 1];
      const bl = grid[nextOff + c];

      const minV = Math.min(tl, tr, br, bl);
      const maxV = Math.max(tl, tr, br, bl);

      const bucket = ew < 0.3 ? 0 : ew < 0.55 ? 1 : ew < 0.8 ? 2 : 3;

      for (let i = 0; i < isos.length; i++) {
        const iso = isos[i];
        if (iso < minV || iso > maxV) continue;

        let idx = 0;
        if (tl >= iso) idx |= 8;
        if (tr >= iso) idx |= 4;
        if (br >= iso) idx |= 2;
        if (bl >= iso) idx |= 1;

        const segs = cases[idx];
        if (!segs.length) continue;

        const pt = (edge: number): [number, number] => {
          switch (edge) {
            case 0:
              return [x0 + interp(tl, tr, iso) * STEP, y0];
            case 1:
              return [x1, y0 + interp(tr, br, iso) * STEP];
            case 2:
              return [x0 + interp(bl, br, iso) * STEP, y1];
            default:
              return [x0, y0 + interp(tl, bl, iso) * STEP];
          }
        };

        for (let s = 0; s < segs.length; s++) {
          const [e1, e2] = segs[s];
          const [ax, ay] = pt(e1);
          const [bx, by] = pt(e2);
          groups[bucket].push(`M${f(ax)} ${f(ay)}L${f(bx)} ${f(by)}`);
        }
      }
    }
  }

  const opacities = [0.18, 0.36, 0.55, 0.75];
  const paths = groups
    .map((dList, i) =>
      dList.length
        ? `<path d="${dList.join('')}" stroke-opacity="${opacities[i]}"/>`
        : ''
    )
    .join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><g fill="none" stroke="#9AA0A6" stroke-width="1" stroke-linecap="round">${paths}</g></svg>`;
  cachedDataUri = `data:image/svg+xml;base64,${btoa(svg)}`;
  return cachedDataUri;
}
