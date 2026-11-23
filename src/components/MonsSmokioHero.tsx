import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ExternalLink, Play, X } from 'lucide-react';
import {
  ARTIST_PROFILE,
  CATALOG_LINKS,
  HERO_HOTSPOTS,
  HERO_MEDIA,
  type HeroHotspot,
} from '../data/smokio';
import { getContourSvgDataUri } from '../lib/contour';

interface MonsSmokioHeroProps {
  onPlayYoutube: (youtubeId: string, title: string, youtubeUrl: string) => void;
  onScrollToSection: (sectionId: string) => void;
}

type Tier = 'L' | 'S' | 'P';

interface ActiveSpecState {
  hotspot: HeroHotspot;
  clientX: number;
  clientY: number;
}

const LOADER_LETTERS = ['S', 'M', 'O', 'K', 'I', 'O'];
const WORDMARK_SLICES = [
  { offset: -118, delay: 60 },
  { offset: 96, delay: 95 },
  { offset: -74, delay: 130 },
  { offset: 124, delay: 165 },
  { offset: -88, delay: 200 },
  { offset: 62, delay: 235 },
];

const NAV_ITEMS = [
  { label: 'About', href: '#about' },
  { label: 'Music', href: '#music' },
  { label: 'Videos', href: '#videos' },
  { label: 'Shows', href: '#shows' },
  { label: 'Contact', href: '#contact' },
];

function loadCorsImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Image load failed'));
    img.src = url;
  });
}

export const MonsSmokioHero: React.FC<MonsSmokioHeroProps> = ({
  onPlayYoutube,
  onScrollToSection,
}) => {
  const stageRef = useRef<HTMLElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const hintRef = useRef<HTMLDivElement | null>(null);
  const tipRef = useRef<HTMLDivElement | null>(null);

  // Parallax layer refs
  const texRef = useRef<HTMLDivElement | null>(null);
  const chevTRRef = useRef<SVGSVGElement | null>(null);
  const chevLRef = useRef<SVGSVGElement | null>(null);
  const wmRef = useRef<HTMLDivElement | null>(null);
  const g1Ref = useRef<HTMLDivElement | null>(null);
  const g2Ref = useRef<HTMLDivElement | null>(null);
  const decoRef = useRef<SVGSVGElement | null>(null);
  const tagsRef = useRef<HTMLDivElement | null>(null);

  // Runtime geometric metrics
  const metricsRef = useRef({
    s: 1,
    fx: 0,
    fy: 0,
    k: 1,
    tier: 'L' as Tier,
  });

  const touchDrawingRef = useRef(false);
  const inViewRef = useRef(true);

  const [tier, setTier] = useState<Tier>('L');
  const [hideTags, setHideTags] = useState(false);
  const [loaderPhase, setLoaderPhase] = useState<'loading' | 'wiping' | 'gone'>('loading');
  const [barProgress, setBarProgress] = useState<0 | 0.8 | 1>(0);
  const [showSlices, setShowSlices] = useState(false);
  const [showSolidWordmark, setShowSolidWordmark] = useState(false);
  const [revealStarted, setRevealStarted] = useState(false);
  const [hoveredHotspot, setHoveredHotspot] = useState<HeroHotspot | null>(null);
  const [activeSpec, setActiveSpec] = useState<ActiveSpecState | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Randomize 10 strip delays once per mount (0..170ms)
  const stripDelays = useMemo(
    () => [35, 110, 15, 145, 70, 0, 160, 50, 125, 85],
    []
  );

  // Procedural marching-squares contour SVG
  const contourUri = useMemo(() => getContourSvgDataUri(), []);

  // Detect reduced motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      setReducedMotion(mq.matches);
      if (mq.matches) {
        document.documentElement.classList.add('done');
        setLoaderPhase('gone');
        setShowSolidWordmark(true);
        setShowSlices(false);
        setRevealStarted(true);
      }
    };
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  // 3-Tier 1440x900 Responsive Scaling Engine (L / S / P)
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const computeLayout = () => {
      const vw = stage.clientWidth || window.innerWidth;
      const vh = stage.clientHeight || window.innerHeight;
      const ratio = vw / Math.max(1, vh);

      let nextTier: Tier = 'L';
      let s = 1;
      let fx = 0;
      let fy = 0;
      let k = 1;
      let colw = 240;
      let colR = 0;

      if (ratio >= 1.05 && vh >= 560) {
        nextTier = 'L';
        s = vw / 1440;
        fx = 0;
        fy = ratio > 1.6 ? 0 : vh - 900 * s;
        k = Math.min(vw / 1440, vh / 900);
      } else if (ratio >= 1.05 && vh < 560) {
        nextTier = 'S';
        s = vh / 900;
        fx = 0.64 * vw - 700 * s;
        fy = 0;
        k = s;
        colw = Math.max(190, Math.min(330, fx + 300 * s - 32));
        colR = 16 + colw;
      } else {
        nextTier = 'P';
        k = Math.min(1, vw / 900);
        const cardH = cardRef.current?.offsetHeight || 138;
        const hintH = hintRef.current?.offsetHeight || 66;
        stage.style.setProperty('--p-hint-top', `${64 + cardH + 10}px`);
        const stackBottom = 64 + cardH + 10 + hintH + 12;
        s = Math.min(vw / 420, Math.max(0.28, (vh - stackBottom) / 780), (vw / 900) * 1.9);
        fx = vw / 2 - 705 * s;
        fy = vh - 900 * s;
        colR = 0;
      }

      // Compute visible frame window & refit wordmark / chevrons / tags for S & P
      const winL = Math.max(0, (colR - fx) / s);
      const winR = (vw - fx) / s;

      if (nextTier === 'L') {
        stage.style.setProperty('--wm-size', '250px');
        stage.style.setProperty('--wm-left', '70px');
        stage.style.setProperty('--wm-top', '114px');
        stage.style.setProperty('--clx', '0px');
        stage.style.setProperty('--crx', '0px');
        stage.style.setProperty('--tagx', '0px');
      } else {
        const avail = Math.max(260, winR - winL - 40);
        const wmSize = 250 * Math.min(1, avail / 1280);
        const wmCenter = (winL + winR) * 0.5;
        const approxWordW = wmSize * 5.15;
        const wmLeft = wmCenter - approxWordW * 0.5;
        const wmTop = 131 - 0.08 * wmSize;
        stage.style.setProperty('--wm-size', `${wmSize.toFixed(1)}px`);
        stage.style.setProperty('--wm-left', `${wmLeft.toFixed(1)}px`);
        stage.style.setProperty('--wm-top', `${wmTop.toFixed(1)}px`);

        const clx = -fx / s;
        const crx = winR - 1440;
        const tagx = Math.max(0, (colR - fx) / s + 16 / s - 255);
        stage.style.setProperty('--clx', `${clx.toFixed(1)}px`);
        stage.style.setProperty('--crx', `${crx.toFixed(1)}px`);
        stage.style.setProperty('--tagx', `${tagx.toFixed(1)}px`);
      }

      stage.style.setProperty('--s', s.toFixed(5));
      stage.style.setProperty('--fx', `${fx.toFixed(2)}px`);
      stage.style.setProperty('--fy', `${fy.toFixed(2)}px`);
      stage.style.setProperty('--k', k.toFixed(5));
      stage.style.setProperty('--colw', `${colw.toFixed(1)}px`);

      metricsRef.current = { s, fx, fy, k, tier: nextTier };
      setTier(nextTier);
      setHideTags((nextTier === 'P' && vw < 640) || (nextTier === 'S' && vw < 700));
    };

    computeLayout();
    const ro = new ResizeObserver(computeLayout);
    ro.observe(stage);
    window.addEventListener('resize', computeLayout);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', computeLayout);
    };
  }, []);

  // Pause parallax when hero is scrolled out of viewport
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries[0]?.isIntersecting ?? true;
        inViewRef.current = visible;
      },
      { threshold: 0.05 }
    );
    io.observe(stage);
    return () => io.disconnect();
  }, []);

  // Opening Sequence + Image/Font Loading
  useEffect(() => {
    let cancelled = false;
    const timers: number[] = [];
    const schedule = (fn: () => void, ms: number) => {
      const id = window.setTimeout(fn, ms);
      timers.push(id);
      return id;
    };

    const rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (rm) {
      document.documentElement.classList.add('done');
      setLoaderPhase('gone');
      setShowSolidWordmark(true);
      setRevealStarted(true);
      return;
    }

    // Start progress bar 0 -> 0.8 immediately
    const barRaf = requestAnimationFrame(() => setBarProgress(0.8));

    // 5-second failsafe
    const failsafe = schedule(() => {
      if (cancelled) return;
      document.documentElement.classList.add('done');
      setShowSolidWordmark(true);
      setShowSlices(false);
      setRevealStarted(true);
      setLoaderPhase('gone');
    }, 5000);

    const minDelay = new Promise<void>((res) => schedule(res, 420));
    const fontsReady = document.fonts ? document.fonts.ready.catch(() => {}) : Promise.resolve();
    const imageReady = loadCorsImage(HERO_MEDIA.portraitUrl).catch(() => null);

    Promise.all([minDelay, fontsReady, imageReady]).then(() => {
      if (cancelled) return;
      clearTimeout(failsafe);

      // Bar 0.8 -> 1.0 in 90ms
      setBarProgress(1);

      // T = ready + 90ms -> slice-glitch wipe begins
      schedule(() => {
        if (cancelled) return;
        setLoaderPhase('wiping');
        setShowSlices(true);
        setRevealStarted(true);
        document.documentElement.classList.add('done');

        // Solid wordmark appears at T + 440ms
        schedule(() => {
          if (!cancelled) setShowSolidWordmark(true);
        }, 440);

        // Remove 6 wordmark slices at T + 520ms
        schedule(() => {
          if (!cancelled) setShowSlices(false);
        }, 520);

        // Remove loader at T + 700ms
        schedule(() => {
          if (!cancelled) setLoaderPhase('gone');
        }, 700);
      }, 90);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(barRaf);
      timers.forEach(clearTimeout);
    };
  }, []);

  // Magnetic Repel Parallax + Hit Testing
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let pRaf = 0;
    let pLast = 0;

    const applyParallax = () => {
      const k = metricsRef.current.k;
      const setT = (el: Element | null, dx: number, dy: number) => {
        if (el) (el as HTMLElement).style.translate = `${dx.toFixed(2)}px ${dy.toFixed(2)}px`;
      };

      setT(chevTRRef.current, -cx * 24, -cy * 24 * 0.7);
      setT(chevLRef.current, -cx * 24, -cy * 24 * 0.7);
      setT(tagsRef.current, -cx * 20, -cy * 20 * 0.7);
      setT(decoRef.current, -cx * 18, -cy * 18 * 0.7);
      setT(wmRef.current, -cx * 14, -cy * 14 * 0.7);
      setT(g1Ref.current, -cx * 9, -cy * 9 * 0.7);
      setT(g2Ref.current, -cx * 9, -cy * 9 * 0.7);
      setT(texRef.current, -cx * 8 * k, -cy * 8 * k * 0.7);
      setT(cardRef.current, -cx * 7 * k, -cy * 7 * k * 0.7);
      setT(hintRef.current, -cx * 7 * k, -cy * 7 * k * 0.7);
    };

    const tickParallax = (now: number) => {
      pRaf = 0;
      if (reducedMotion || !inViewRef.current) return;
      const dt = pLast ? Math.min(64, now - pLast) : 16.6;
      pLast = now;

      const alpha = 1 - Math.exp(-dt / 220);
      cx += (tx - cx) * alpha;
      cy += (ty - cy) * alpha;
      applyParallax();

      if (Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001) {
        pRaf = requestAnimationFrame(tickParallax);
      } else {
        cx = tx;
        cy = ty;
        applyParallax();
        pLast = 0;
      }
    };

    const kickParallax = () => {
      if (reducedMotion || !inViewRef.current) return;
      if (!pRaf) {
        pLast = performance.now();
        pRaf = requestAnimationFrame(tickParallax);
      }
    };

    const positionTip = (clientX: number, clientY: number) => {
      const tip = tipRef.current;
      if (!tip) return;
      const tipW = tip.offsetWidth || 175;
      const tipH = tip.offsetHeight || 50;
      let left = clientX + 18;
      let top = clientY + 16;
      if (left + tipW > window.innerWidth - 12) left = clientX - tipW - 18;
      if (top + tipH > window.innerHeight - 12) top = clientY - tipH - 16;
      tip.style.transform = `translate3d(${Math.max(8, left)}px, ${Math.max(8, top)}px, 0)`;
    };

    const getFrameCoords = (clientX: number, clientY: number) => {
      const rect = stage.getBoundingClientRect();
      const { fx, fy, s } = metricsRef.current;
      return {
        x: (clientX - rect.left - fx) / s,
        y: (clientY - rect.top - fy) / s,
        nx: ((clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1,
        ny: ((clientY - rect.top) / Math.max(1, rect.height)) * 2 - 1,
      };
    };

    const findHotspot = (x: number, y: number): HeroHotspot | null => {
      for (const h of HERO_HOTSPOTS) {
        if (h.hitTest(x, y)) return h;
      }
      return null;
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') {
        touchDrawingRef.current = true;
        const { nx, ny } = getFrameCoords(e.clientX, e.clientY);
        if (!reducedMotion) {
          tx = Math.max(-1, Math.min(1, nx));
          ty = Math.max(-1, Math.min(1, ny));
          kickParallax();
        }
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      const targetEl = e.target as HTMLElement | null;
      const overHud = !!targetEl?.closest(
        'header, nav, a, button, .hud-card, .hud-hint, #spec'
      );

      const { x, y, nx, ny } = getFrameCoords(e.clientX, e.clientY);

      if (!reducedMotion && (e.pointerType === 'mouse' || touchDrawingRef.current)) {
        tx = Math.max(-1, Math.min(1, nx));
        ty = Math.max(-1, Math.min(1, ny));
        kickParallax();
      }

      if (e.pointerType === 'mouse') {
        if (overHud) {
          setHoveredHotspot(null);
        } else {
          const hit = findHotspot(x, y);
          setHoveredHotspot(hit);
          if (hit) positionTip(e.clientX, e.clientY);
        }
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') {
        touchDrawingRef.current = false;
        tx = 0;
        ty = 0;
        kickParallax();
      }
    };

    const onPointerLeave = () => {
      touchDrawingRef.current = false;
      setHoveredHotspot(null);
      tx = 0;
      ty = 0;
      kickParallax();
    };

    const onClick = (e: MouseEvent) => {
      const targetEl = e.target as HTMLElement | null;
      if (targetEl?.closest('a, button, .hud-card, .hud-hint, #spec')) return;

      const { x, y } = getFrameCoords(e.clientX, e.clientY);
      const hit = findHotspot(x, y);
      if (hit) {
        setActiveSpec({
          hotspot: hit,
          clientX: e.clientX,
          clientY: e.clientY,
        });
      } else {
        setActiveSpec(null);
      }
    };

    stage.addEventListener('pointerdown', onPointerDown);
    stage.addEventListener('pointermove', onPointerMove);
    stage.addEventListener('pointerup', onPointerUp);
    stage.addEventListener('pointercancel', onPointerUp);
    stage.addEventListener('pointerleave', onPointerLeave);
    stage.addEventListener('click', onClick);

    return () => {
      if (pRaf) cancelAnimationFrame(pRaf);
      stage.removeEventListener('pointerdown', onPointerDown);
      stage.removeEventListener('pointermove', onPointerMove);
      stage.removeEventListener('pointerup', onPointerUp);
      stage.removeEventListener('pointercancel', onPointerUp);
      stage.removeEventListener('pointerleave', onPointerLeave);
      stage.removeEventListener('click', onClick);
    };
  }, [reducedMotion]);

  // Escape closes spec card
  useEffect(() => {
    if (!activeSpec) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveSpec(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeSpec]);

  // Compute clamped position for #spec card
  const specStyle = useMemo<React.CSSProperties>(() => {
    if (!activeSpec) return {};
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1440;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 900;
    if (vw < 640) {
      return {
        left: '50%',
        bottom: '20px',
        top: 'auto',
        transform: 'translateX(-50%)',
      };
    }
    const cardW = 268;
    const cardH = 235;
    let left = activeSpec.clientX + 20;
    if (left + cardW > vw - 16) {
      left = Math.max(16, activeSpec.clientX - cardW - 20);
    }
    const top = Math.max(16, Math.min(vh - cardH - 16, activeSpec.clientY - cardH * 0.5));
    return {
      left: `${Math.round(left)}px`,
      top: `${Math.round(top)}px`,
    };
  }, [activeSpec]);

  const openTagHotspot = (hotspotId: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const found = HERO_HOTSPOTS.find((h) => h.id === hotspotId);
    if (!found) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setActiveSpec({
      hotspot: found,
      clientX: rect.right,
      clientY: rect.top + rect.height / 2,
    });
  };

  const handleSpecAction = (hotspot: HeroHotspot) => {
    if (hotspot.youtubeId) {
      setActiveSpec(null);
      onPlayYoutube(hotspot.youtubeId, hotspot.title, hotspot.primaryActionUrl);
    }
  };

  return (
    <>
      {/* ── Opening 10-Strip Pixel Loader ── */}
      {loaderPhase !== 'gone' && !reducedMotion && (
        <div
          id="ld"
          className={loaderPhase === 'wiping' ? 'wiping' : ''}
          aria-hidden="true"
        >
          <div className="ld-strips">
            {stripDelays.map((delay, idx) => (
              <div
                key={idx}
                className="ld-strip"
                style={{
                  transitionDelay: loaderPhase === 'wiping' ? `${delay}ms` : '0ms',
                }}
              />
            ))}
          </div>

          <div className="ld-word">
            {LOADER_LETTERS.map((ch, i) => (
              <span
                key={`${ch}-${i}`}
                className={`ld-ch ${i === 0 ? 'ld-ch-first' : ''}`}
                style={{ animationDelay: `${40 + i * 70}ms` }}
              >
                {i === 0 && <span className="ld-ghost">{ch}</span>}
                {ch}
              </span>
            ))}
          </div>

          <div className="ld-bar-wrap">
            <div
              className="ld-bar"
              style={{
                transform: `scaleX(${barProgress})`,
                transition:
                  barProgress === 0.8
                    ? 'transform 420ms cubic-bezier(0.3, 0.6, 0.3, 1)'
                    : barProgress === 1
                    ? 'transform 90ms ease-out'
                    : 'none',
              }}
            />
          </div>
        </div>
      )}

      {/* ── Hero Stage (100svh, exact 1440x900 3-tier frame) ── */}
      <section
        id="stage"
        ref={stageRef}
        data-tier={tier}
        className={`${hoveredHotspot ? 'is-pointer' : ''} ${hideTags ? 'hide-tags' : ''}`}
        aria-label="SMOKIO interactive artist hero"
      >
        {/* 5.1 Procedural Marching-Squares Topographic Contour Texture */}
        <div
          ref={texRef}
          className="tex"
          style={{ backgroundImage: `url("${contourUri}")` }}
          aria-hidden="true"
        />

        {/* 1440x900 Design Frame */}
        <div id="frame">
          {/* 5.2 Chevrons (behind wordmark) */}
          <svg
            id="chevTR"
            ref={chevTRRef}
            viewBox="0 0 1440 900"
            className="rv rv-chev-r rv-chev"
            style={{ transitionDelay: revealStarted ? '240ms' : '0ms' }}
            aria-hidden="true"
          >
            <g className="chev-shift">
              <polygon
                points="560,-400 723,-400 1515,195 1352,195"
                fill="var(--red)"
              />
            </g>
          </svg>

          <svg
            id="chevL"
            ref={chevLRef}
            viewBox="0 0 1440 900"
            className="rv rv-chev-l rv-chev"
            style={{ transitionDelay: revealStarted ? '180ms' : '0ms' }}
            aria-hidden="true"
          >
            <g className="chev-shift">
              <polygon
                points="-54,462 101,462 281,642 281,660 -60,926 -60,792 134,636"
                fill="var(--red)"
              />
            </g>
          </svg>

          {/* 5.3 Giant SMOKIO Wordmark + 6 Intro Glitch Slices + Frosted Glass g1/g2 */}
          <div id="wm" ref={wmRef} role="img" aria-label="SMOKIO">
            <span
              className={showSolidWordmark && !reducedMotion ? 'band band-loop' : 'band'}
              style={{ opacity: showSolidWordmark || reducedMotion ? 1 : 0 }}
              aria-hidden="true"
            >
              <span className="band-name">SMOKIO</span>
              <span className="band-alias">Z30K10</span>
            </span>

            {showSlices &&
              !reducedMotion &&
              WORDMARK_SLICES.map((sl, j) => {
                const topPct = (j / 6) * 100;
                const bottomPct = (1 - (j + 1) / 6) * 100;
                return (
                  <span
                    key={j}
                    className="slice"
                    aria-hidden="true"
                    style={
                      {
                        clipPath: `inset(${topPct.toFixed(2)}% 0 ${bottomPct.toFixed(2)}% 0)`,
                        '--slx': `${sl.offset}px`,
                        animation: `wmSliceIn 360ms steps(5) ${sl.delay}ms both`,
                      } as React.CSSProperties
                    }
                  >
                    SMOKIO
                  </span>
                );
              })}

            {/* Glass panel g1 (lower strip over S-M) */}
            <div
              ref={g1Ref}
              className="glass g1 rv rv-y8 rv-hud"
              style={{ transitionDelay: revealStarted ? '525ms' : '0ms' }}
              aria-hidden="true"
            />

            {/* Glass panel g2 (chamfered panel over I-O with white chamfer edge + hatch strip) */}
            <div
              ref={g2Ref}
              className="glass g2 rv rv-y8 rv-hud"
              style={{ transitionDelay: revealStarted ? '580ms' : '0ms' }}
              aria-hidden="true"
            >
              <svg
                className="g2-edge"
                viewBox="0 0 112 62"
                preserveAspectRatio="none"
              >
                <polyline
                  points="0,62 0,14 14,0 112,0 112,62 0,62"
                  fill="none"
                  stroke="rgba(255,255,255,0.78)"
                  strokeWidth="1.2"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              <div className="g2-hatch" />
            </div>
          </div>

          {/* 5.4 Kevin Smokio portrait */}
          <div
            id="model"
            className="rv rv-model rv-model-tr"
            style={{ transitionDelay: revealStarted ? '120ms' : '0ms' }}
            onPointerMove={(event) => {
              const model = event.currentTarget;
              const bounds = model.getBoundingClientRect();
              model.style.setProperty('--portrait-x', `${((event.clientX - bounds.left) / bounds.width) * 100}%`);
              model.style.setProperty('--portrait-y', `${((event.clientY - bounds.top) / bounds.height) * 100}%`);
            }}
          >
            <img
              src={HERO_MEDIA.portraitUrl}
              alt={HERO_MEDIA.alt}
              draggable={false}
            />
            <img
              className="hero-portrait-color"
              src={HERO_MEDIA.portraitUrl}
              alt=""
              aria-hidden="true"
              draggable={false}
            />
          </div>

          {/* 5.5 Decorative SVG (Leader Lines, Hairline, 3 Crosshairs) */}
          <svg
            id="deco"
            ref={decoRef}
            viewBox="0 0 1440 900"
            className="rv rv-y8 rv-hud"
            style={{ transitionDelay: revealStarted ? '470ms' : '0ms' }}
            aria-hidden="true"
          >
            <g
              className="tag-leaders"
              fill="none"
              stroke="var(--mid)"
              strokeWidth="1"
              strokeOpacity="0.75"
              vectorEffect="non-scaling-stroke"
            >
              <path d="M403 411 H452 L612 246" vectorEffect="non-scaling-stroke" />
              <path d="M430 465 H482 L608 342" vectorEffect="non-scaling-stroke" />
            </g>

            <line
              x1="282"
              y1="626"
              x2="462"
              y2="497"
              stroke="var(--mid)"
              strokeWidth="1"
              strokeOpacity="0.55"
              vectorEffect="non-scaling-stroke"
            />

            {[
              [265, 83],
              [980, 433],
              [1188, 578],
            ].map(([cx, cy], idx) => (
              <g
                key={idx}
                stroke="var(--mid)"
                strokeWidth="1.2"
                strokeOpacity="0.8"
                fill="none"
              >
                <circle cx={cx} cy={cy} r="7" vectorEffect="non-scaling-stroke" />
                <line x1={cx - 13} y1={cy} x2={cx + 13} y2={cy} vectorEffect="non-scaling-stroke" />
                <line x1={cx} y1={cy - 13} x2={cx} y2={cy + 13} vectorEffect="non-scaling-stroke" />
              </g>
            ))}
          </svg>

          {/* 5.6 Interactive Track Tags + Slate Corner Brackets */}
          <div id="tags" ref={tagsRef}>
            <div className="tags-shift">
              <button
                type="button"
                className="hero-tag chamfer-5 rv rv-y8 rv-hud"
                style={{
                  left: '288px',
                  top: '401px',
                  transitionDelay: revealStarted ? '635ms' : '0ms',
                }}
                onClick={(e) => openTagHotspot('asawen', e)}
              >
                TRK 01 / ASAWEN
              </button>

              <button
                type="button"
                className="hero-tag chamfer-5 rv rv-y8 rv-hud"
                style={{
                  left: '262px',
                  top: '455px',
                  transitionDelay: revealStarted ? '690ms' : '0ms',
                }}
                onClick={(e) => openTagHotspot('kuddah', e)}
              >
                TRK 02 / KUDDAH + CATALOG
              </button>

              {/* Corner Brackets */}
              <div
                className="rv rv-y8 rv-hud"
                style={{ transitionDelay: revealStarted ? '745ms' : '0ms' }}
                aria-hidden="true"
              >
                <span className="tag-bracket tl" style={{ left: '281px', top: '393px' }} />
                <span className="tag-bracket br" style={{ left: '396px', top: '419px' }} />
                <span className="tag-bracket tl" style={{ left: '255px', top: '447px' }} />
                <span className="tag-bracket br" style={{ left: '423px', top: '473px' }} />
              </div>
            </div>
          </div>
        </div>

        {/* 5.7 Viewport HUD Header: Dark Logo Chip + Centred Frosted Nav Pill */}
        <a
          href="#stage"
          className="hud-logo chamfer-5 rv rv-y8 rv-hud"
          style={{ transitionDelay: revealStarted ? '360ms' : '0ms' }}
          aria-label="SMOKIO home"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
          }}
        >
          <span className="hud-logo-bar" />
          <span className="hud-logo-bar" />
          <span className="hud-logo-bar" />
        </a>

        <nav
          className="hud-nav rv rv-nav"
          style={{ transitionDelay: revealStarted ? '415ms' : '0ms' }}
          aria-label="Primary hero navigation"
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                onScrollToSection(item.href.slice(1));
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* 5.8 Copy Card (Bottom-Right) */}
        <div
          ref={cardRef}
          className="hud-card chamfer-14 rv rv-y14 rv-hud"
          style={{ transitionDelay: revealStarted ? '800ms' : '0ms' }}
        >
          <svg
            className="hud-card-crosshair"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--mid)"
            strokeWidth="1.2"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="2" x2="12" y2="22" />
            <line x1="2" y1="12" x2="22" y2="12" />
          </svg>

          <p className="hud-card-eyebrow">
            <strong className="hud-card-tagline">THE PEOPLE'S RAPPER</strong>
            {ARTIST_PROFILE.eyebrow}
          </p>
          <h1 className="hud-card-headline">
            {ARTIST_PROFILE.heroHeadlineLine1}
            <br />
            {ARTIST_PROFILE.heroHeadlineLine2}
          </h1>

          <div className="hud-card-actions">
            <button
              type="button"
              className="hud-card-cta primary chamfer-5 cursor-pointer border-0"
              onClick={() =>
                onPlayYoutube('80ncN1pHSR8', 'SMOKIO — ASAWEN (Official Video)', CATALOG_LINKS.latestVideo)
              }
            >
              <Play className="w-3 h-3 fill-current" aria-hidden="true" />
              Watch ASAWEN
            </button>
            <a
              href={CATALOG_LINKS.spotifyArtist}
              target="_blank"
              rel="noopener noreferrer"
              className="hud-card-cta secondary"
            >
              Spotify
              <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* 5.9 Hint Panel (Bottom-Left) */}
        <div
          ref={hintRef}
          className="hud-hint chamfer-12 rv rv-y14 rv-hud"
          style={{ transitionDelay: revealStarted ? '855ms' : '0ms' }}
        >
          <div className="hud-hint-hatch" aria-hidden="true" />
          <p className="hud-hint-line">Hover for color / click a piece to view</p>
          <button
            type="button"
            className="hud-hint-scroll"
            onClick={() => onScrollToSection('latest-drop')}
          >
            Scroll ↓ · Kevin Smokio Archive
          </button>
        </div>

        {/* Bottom Subtle Transition Seam into Dark Editorial Void */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-b from-transparent to-[#0A0A0A]/15"
          aria-hidden="true"
        />
      </section>

      {/* 5.10 Floating Hover Tip */}
      <div
        id="tip"
        ref={tipRef}
        className={hoveredHotspot && !activeSpec ? 'on' : ''}
        aria-hidden="true"
      >
        <div className="tip-top">{hoveredHotspot?.label || ''}</div>
        <div className="tip-sub">
          CLICK TO VIEW <span>[SPECS]</span>
        </div>
      </div>

      {/* 5.10 Click-to-View Dark Spec Card */}
      <div
        id="spec"
        role="dialog"
        aria-modal="false"
        aria-label={activeSpec ? `${activeSpec.hotspot.title} details` : 'Track specs'}
        className={`chamfer-12 ${activeSpec ? 'on' : ''}`}
        style={specStyle}
      >
        {activeSpec && (
          <>
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className="w-2 h-2 bg-[#E0313F] shrink-0"
                  aria-hidden="true"
                />
                <h2 className="font-mono-hud text-[12px] font-bold tracking-[0.12em] uppercase text-[#E9EAEC] leading-snug">
                  {activeSpec.hotspot.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveSpec(null)}
                aria-label="Close spec card"
                className="w-7 h-7 -mt-1 -mr-1 inline-flex items-center justify-center text-[#9B9B9B] hover:text-white transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="divide-y divide-white/12">
              {activeSpec.hotspot.specs.map((line, i) => (
                <p
                  key={i}
                  className="font-mono-hud text-[11px] uppercase tracking-[0.06em] text-[#E9EAEC]/90 py-2 leading-relaxed"
                >
                  {line}
                </p>
              ))}
            </div>

            <div className="mt-3 pt-2.5 border-t border-white/12 flex items-center gap-2">
              {activeSpec.hotspot.youtubeId ? (
                <button
                  type="button"
                  onClick={() => handleSpecAction(activeSpec.hotspot)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#E0313F] hover:bg-[#c62532] text-white font-mono-hud text-[11px] font-bold tracking-[0.08em] uppercase px-3 py-2 transition-colors cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-current" />
                  {activeSpec.hotspot.primaryActionLabel}
                </button>
              ) : (
                <a
                  href={activeSpec.hotspot.primaryActionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#E0313F] hover:bg-[#c62532] text-white font-mono-hud text-[11px] font-bold tracking-[0.08em] uppercase px-3 py-2 transition-colors"
                >
                  {activeSpec.hotspot.primaryActionLabel}
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}

              {activeSpec.hotspot.secondaryActionUrl && (
                activeSpec.hotspot.secondaryActionUrl.startsWith('#') ? (
                  <button
                    type="button"
                    onClick={() => {
                      const target = activeSpec.hotspot.secondaryActionUrl!.slice(1);
                      setActiveSpec(null);
                      onScrollToSection(target);
                    }}
                    className="inline-flex items-center justify-center border border-white/20 hover:border-white/50 text-[#E9EAEC] font-mono-hud text-[10px] font-medium tracking-[0.08em] uppercase px-2.5 py-2 transition-colors cursor-pointer"
                  >
                    {activeSpec.hotspot.secondaryActionLabel}
                  </button>
                ) : (
                  <a
                    href={activeSpec.hotspot.secondaryActionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center border border-white/20 hover:border-white/50 text-[#E9EAEC] font-mono-hud text-[10px] font-medium tracking-[0.08em] uppercase px-2.5 py-2 transition-colors"
                  >
                    {activeSpec.hotspot.secondaryActionLabel}
                  </a>
                )
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};
