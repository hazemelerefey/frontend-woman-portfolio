'use client';

import { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { INK } from './LogoMark';
import { SHAHD_LETTERS, SHAHD_WIDTH, LOGO_HEIGHT } from './logo-paths';

gsap.registerPlugin(useGSAP);

const MONO = "'IBM Plex Mono', monospace";
const GRID = Array.from({ length: 12 }, (_, i) => i);
const CANVAS = '#0C0C0C';

/**
 * Marquee bands — mixed filled / outlined type, monochrome ivory.
 * Alternating scroll direction builds the kinetic poster.
 */
const BANDS = [
  { text: 'REACT · NODE · MONGO', style: 'outline' as const, dir: -1 },
  { text: 'FULLSTACK', style: 'fill' as const, dir: 1 },
  { text: 'DESIGN · CODE · SHIP', style: 'soft' as const, dir: -1 },
  { text: 'GSAP · THREE · R3F', style: 'hairline' as const, dir: 1 },
  { text: 'CAIRO — 2026', style: 'faint' as const, dir: -1 },
];

/**
 * One continuous cinematic take.
 *
 * The whole scene is staged on a single opaque panel that never fades — it is
 * the canvas from the first frame. SHAHD is not drawn on top of it; the word is
 * cut *out* of it, so there is only ever one SHAHD and it is a window from the
 * instant it exists. It materialises as the marquee dissolves, the hero
 * develops inside it, and then one master motion opens it all the way out.
 * Nothing is layered in or swapped, so no phase begins with a cut.
 */
export default function Preloader() {
  const [visible, setVisible] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const root = rootRef.current;
    if (!root) return;

    const progress = { v: 0 };
    const setCount = () => {
      const n = Math.round(progress.v);
      if (ghostRef.current) ghostRef.current.textContent = String(n);
      if (pctRef.current) pctRef.current.textContent = `${String(n).padStart(3, '0')}%`;
    };
    setCount();

    /* ── Size the panel and place the one-and-only SHAHD ──
       Geometry is computed, never measured, so no second wordmark needs to
       exist anywhere in the scene just to be sized against.                  */
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let markW = Math.min(vw * 0.86, 1150);
    let s = markW / SHAHD_WIDTH;
    const maxH = vh * 0.4;
    if (LOGO_HEIGHT * s > maxH) {
      s = maxH / LOGO_HEIGHT;
      markW = SHAHD_WIDTH * s;
    }
    const tx = (vw - markW) / 2;
    const ty = (vh - LOGO_HEIGHT * s) / 2;
    const placement = `translate(${tx}, ${ty + LOGO_HEIGHT * s}) scale(${s})`;

    // pin the mask + panel to exact pixel dimensions (no percentage ambiguity)
    root.querySelectorAll<SVGElement>('.pl-sized').forEach((el) => {
      el.setAttribute('x', '0');
      el.setAttribute('y', '0');
      el.setAttribute('width', String(vw));
      el.setAttribute('height', String(vh));
    });
    // the mask copy and the visible outline copy share one placement
    root.querySelectorAll<SVGGElement>('.pl-place').forEach((el) => {
      el.setAttribute('transform', placement);
    });

    const scrim = root.querySelector<HTMLDivElement>('.pl-scrim');
    const outline = root.querySelector<SVGGElement>('.pl-outline');
    const zooms = gsap.utils.toArray<SVGGElement>('.pl-zoom');

    const tl = gsap.timeline({ onComplete: () => setVisible(false) });

    /* ═══════ THE SET IS BUILT — and immediately starts giving birth ═══════ */
    tl.fromTo('.pl-grid-line',
      { scaleY: 0, transformOrigin: '50% 0%' },
      { scaleY: 1, duration: 0.6, stagger: 0.02, ease: 'power2.inOut' }, 0)
      .fromTo('.pl-cross',
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.55, stagger: 0.07, ease: 'power3.out' }, 0.25)
      .fromTo('.pl-label',
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.45, stagger: 0.06, ease: 'power2.out' }, 0.3);

    /* ═══════ THE BANDS RISE UP THROUGH THE GRID ═══════
       They grow out of the rhythm the grid just drew, so the second beat is
       carried by the first instead of replacing it.                          */
    BANDS.forEach((b, i) => {
      const at = 0.55 + i * 0.1;
      tl.fromTo(`.pl-band--${i}`,
        { opacity: 0, yPercent: 22, scaleY: 0.6, filter: 'blur(18px)', transformOrigin: '50% 100%' },
        { opacity: 1, yPercent: 0, scaleY: 1, filter: 'blur(0px)', duration: 1.25, ease: 'power3.out' }, at)
        .fromTo(`.pl-band--${i} .pl-band__inner`,
          { xPercent: b.dir * 52 },
          { xPercent: b.dir * -6, duration: 1.5, ease: 'power3.out' }, at);
    });
    // the marquee never stops breathing while it is on screen
    tl.to('.pl-band__inner', { xPercent: (i) => BANDS[i].dir * -13, duration: 1.4, ease: 'none' }, 1.85);

    /* ═══════ COUNTER — runs underneath the whole first movement ═══════ */
    tl.fromTo('.pl-ghost', { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'sine.out' }, 0.8)
      .to(progress, { v: 100, duration: 3.4, ease: 'power2.inOut', onUpdate: setCount }, 0.8);

    /* ═══════ EVERYTHING GATHERS — AND THE GATHERING IS THE WORD ═══════
       The bands swell and blur away, the grid pulls inward, the counter lifts
       off, and in exactly the same window the letterforms settle and the hero
       fades up inside them. The panel underneath never changes, so the word
       arrives without anything being layered on top of anything.             */
    tl.to('.pl-band', {
      y: (i) => (2 - i) * -5 + 'vh',
      scaleY: 1.32,
      scaleX: 1.05,
      filter: 'blur(30px)',
      opacity: 0,
      duration: 1.35,
      ease: 'power2.inOut',
      stagger: { each: 0.05, from: 'edges' },
    }, 2.45)
      .to('.pl-grid-line', {
        x: (i) => (5.5 - i) * 14,
        opacity: 0,
        duration: 1.25,
        ease: 'power2.inOut',
      }, 2.45)
      .to('.pl-bloom', { opacity: 0.46, duration: 0.8, ease: 'sine.inOut' }, 2.5)
      .to('.pl-bloom', { opacity: 0, duration: 1.05, ease: 'sine.inOut' }, 3.3)
      // the counter lifts away as the word takes its place
      .to('.pl-ghost', { scale: 1.09, opacity: 0, duration: 1.15, ease: 'power2.inOut' }, 2.8)
      // the letterforms settle…
      .fromTo('.pl-breathe',
        { scale: 1.14, svgOrigin: `${vw / 2} ${vh / 2}` },
        { scale: 1, svgOrigin: `${vw / 2} ${vh / 2}`, duration: 1.7, ease: 'power3.out' }, 2.7)
      // …and the hero develops up inside them (scrim starts as pure canvas)
      .to(scrim, { opacity: 0.72, duration: 1.5, ease: 'power2.out' }, 2.7)
      .fromTo(outline,
        { opacity: 0 },
        { opacity: 0.4, duration: 1.2, ease: 'power2.out' }, 2.7)
      // it keeps living while it holds
      .to('.pl-breathe', {
        scale: 1.028,
        svgOrigin: `${vw / 2} ${vh / 2}`,
        duration: 1.5,
        ease: 'sine.inOut',
      }, 4.4)
      // the frame furniture clears, leaving only the word
      .to('.pl-label, .pl-cross', { opacity: 0, duration: 0.85, ease: 'power2.inOut' }, 4.2);

    /* ═══════ THE RELEASE — ONE master motion ═══════
       A single tween drives the opening, the outline and the scrim together on
       a curve that is almost still while the name reads, then accelerates
       hard. The hold and the rush are the same gesture, not two moves.       */
    const release = { v: 0 };
    tl.to(release, {
      v: 1,
      duration: 2.4,
      ease: 'power4.in',
      onUpdate: () => {
        const v = release.v;
        const scale = 1 + v * 33;
        zooms.forEach((el) => {
          gsap.set(el, { scale, svgOrigin: `${vw / 2} ${vh / 2}` });
        });
        if (outline) gsap.set(outline, { opacity: 0.4 * Math.max(0, 1 - v * 5.5) });
        if (scrim) gsap.set(scrim, { opacity: 0.72 * Math.max(0, 1 - v * 3.4) });
      },
    }, 4.55);

  }, { scope: rootRef });

  if (!visible) return null;

  const bandStyle = (s: 'fill' | 'outline' | 'soft' | 'hairline' | 'faint') => {
    if (s === 'fill') return { color: INK };
    if (s === 'soft') return { color: 'rgba(244, 241, 234, 0.72)' };
    if (s === 'faint') return { color: 'rgba(244, 241, 234, 0.13)' };
    if (s === 'hairline') {
      return { color: 'transparent', WebkitTextStroke: '1.5px rgba(244, 241, 234, 0.28)' };
    }
    return { color: 'transparent', WebkitTextStroke: '1.5px rgba(244, 241, 234, 0.45)' };
  };

  return (
    <div
      ref={rootRef}
      className="preloader"
      style={{ position: 'fixed', inset: 0, zIndex: 9999, overflow: 'hidden' }}
    >
      {/* ── Scrim: sits under the panel, so it only ever tints what the
             letter-windows reveal. Starts as pure canvas colour. ── */}
      <div
        className="pl-scrim"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: CANVAS,
          opacity: 1,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* ── THE PANEL: the canvas for the entire scene, with the one SHAHD cut
             out of it. Always fully opaque — never fades, never swaps. ── */}
      <svg
        className="pl-portal"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          pointerEvents: 'none',
        }}
        aria-hidden
      >
        <defs>
          <mask id="pl-window" maskUnits="userSpaceOnUse">
            <rect className="pl-sized" fill="#ffffff" />
            <g className="pl-zoom">
              <g className="pl-breathe">
                <g className="pl-place">
                  {SHAHD_LETTERS.map((l, i) => (
                    <path key={i} d={l.d} fill="#000000" />
                  ))}
                </g>
              </g>
            </g>
          </mask>
        </defs>
        <rect className="pl-sized" fill={CANVAS} mask="url(#pl-window)" />
      </svg>

      {/* ── The word's own hairline, kept in perfect sync with the window ── */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 2,
          pointerEvents: 'none',
        }}
        aria-hidden
      >
        <g className="pl-zoom">
          <g className="pl-breathe">
            <g className="pl-place">
              <g className="pl-outline" fill="none" stroke={INK} strokeWidth="0.72" opacity="0">
                {SHAHD_LETTERS.map((l, i) => (
                  <path key={i} d={l.d} />
                ))}
              </g>
            </g>
          </g>
        </g>
      </svg>

      {/* ── Hero-derived ambient light, so the loader shares the hero's air ── */}
      <div
        className="pl-glow"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 3,
          pointerEvents: 'none',
          background: `
            radial-gradient(ellipse 60% 55% at 50% -15%, hsla(265, 100%, 78%, 0.22) 0%, hsla(265, 100%, 78%, 0.09) 45%, rgba(12,12,12,0) 100%),
            radial-gradient(ellipse 60% 55% at 50% 115%, hsla(210, 100%, 62%, 0.18) 0%, hsla(210, 100%, 62%, 0.07) 45%, rgba(12,12,12,0) 100%)
          `,
        }}
      />

      {/* ── Registration frame ── */}
      <div className="pl-frame" style={{ position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none' }}>
        {GRID.map((i) => (
          <div
            key={i}
            className="pl-grid-line"
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: `${(i + 1) * (100 / 13)}%`,
              width: '1px',
              backgroundColor: 'rgba(244, 241, 234, 0.06)',
            }}
          />
        ))}

        {[
          { top: '2.4rem', left: '2.4rem' },
          { top: '2.4rem', right: '2.4rem' },
          { bottom: '2.4rem', left: '2.4rem' },
          { bottom: '2.4rem', right: '2.4rem' },
        ].map((pos, i) => (
          <div key={i} className="pl-cross" style={{ position: 'absolute', width: '1.4rem', height: '1.4rem', ...pos }}>
            <span style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '1px', backgroundColor: 'rgba(244,241,234,0.55)' }} />
            <span style={{ position: 'absolute', left: '50%', top: 0, height: '100%', width: '1px', backgroundColor: 'rgba(244,241,234,0.55)' }} />
          </div>
        ))}
      </div>

      {/* ── Ghost counter ── */}
      <div
        ref={ghostRef}
        className="pl-ghost"
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 'clamp(24rem, 48vw, 66rem)',
          fontWeight: 800,
          letterSpacing: '-0.04em',
          color: 'transparent',
          WebkitTextStroke: '1px rgba(244, 241, 234, 0.08)',
          lineHeight: 1,
          zIndex: 4,
          pointerEvents: 'none',
          fontVariantNumeric: 'tabular-nums',
          opacity: 0,
        }}
      >
        0
      </div>

      {/* ── Kinetic marquee bands ── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none' }}>
        {BANDS.map((b, i) => (
          <div
            key={i}
            className={`pl-band pl-band--${i}`}
            style={{
              position: 'absolute',
              left: '-10%',
              width: '120%',
              top: `${13.5 + i * 15}%`,
              height: '13%',
              display: 'flex',
              alignItems: 'center',
              overflow: 'hidden',
              opacity: 0,
            }}
          >
            <div
              className="pl-band__inner"
              style={{
                display: 'flex',
                gap: '3ch',
                whiteSpace: 'nowrap',
                fontSize: 'clamp(3.6rem, 8.4vw, 10rem)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 1,
                textTransform: 'uppercase',
                ...bandStyle(b.style),
              }}
            >
              <span>{b.text}</span>
              <span>{b.text}</span>
              <span>{b.text}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Soft bloom that breathes through the gather ── */}
      <div
        className="pl-bloom"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 6,
          pointerEvents: 'none',
          opacity: 0,
          background:
            'radial-gradient(ellipse 78% 42% at 50% 50%, rgba(244,241,234,0.16) 0%, rgba(244,241,234,0.05) 45%, rgba(12,12,12,0) 100%)',
        }}
      />

      {/* ── Corner labels ── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 7, pointerEvents: 'none', fontFamily: MONO, fontSize: '1.05rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(244, 241, 234, 0.42)' }}>
        <div className="pl-label" style={{ position: 'absolute', top: '2.2rem', left: '5.2rem' }}>Shahd Khairy</div>
        <div className="pl-label" style={{ position: 'absolute', top: '2.2rem', right: '5.2rem' }}>Portfolio / 2026</div>
        <div className="pl-label" style={{ position: 'absolute', bottom: '2.2rem', left: '5.2rem' }}>Cairo — EG</div>
        <div ref={pctRef} className="pl-label" style={{ position: 'absolute', bottom: '2.2rem', right: '5.2rem', color: 'rgba(244,241,234,0.7)', fontVariantNumeric: 'tabular-nums' }}>000%</div>
      </div>
    </div>
  );
}
