'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { INK } from './LogoMark';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const MONO = "'IBM Plex Mono', monospace";

/** The standard, line by line. Each pair is one beat of the sequence. */
const ROWS: { claim: string; instead: string }[] = [
  { claim: 'Ships without bugs', instead: 'Ships and then patches' },
  { claim: 'Pixel-exact build', instead: '“Close enough” layout' },
  { claim: 'Deadlines held', instead: 'Deadlines explained' },
  { claim: 'Fixed price, quoted upfront', instead: 'Invoices after launch' },
  { claim: 'Motion built in', instead: 'Static handoff' },
  { claim: 'Written weekly updates', instead: 'Radio silence' },
  { claim: 'One developer, start to finish', instead: 'Rotating hands' },
  { claim: 'Answers within hours', instead: 'Answers within days' },
  { claim: 'Clean, documented code', instead: 'Code nobody can inherit' },
  { claim: 'Supported after launch', instead: 'Gone at handoff' },
];

/** scroll distance given to each beat of the sequence */
const PX_PER_UNIT = 300;

export default function CompareSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLDivElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const root = sectionRef.current;
    const stage = stageRef.current;
    if (!root || !stage) return;

    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ── Mobile / reduced motion: the plain ledger, gently revealed ── */
    if (!isDesktop || reduced) {
      gsap.utils.toArray<HTMLElement>('.ap-mrow').forEach((row) => {
        gsap.fromTo(row,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: { trigger: row, start: 'top 88%', once: true },
          });
      });
      return;
    }

    /* ═══════ THE PINNED SEQUENCE ═══════
       One master timeline, scrubbed. The title compresses away, then every
       standard is driven through the frame: the claim assembles word by word,
       a rule strikes through what it replaces, the ghost numeral counts, the
       ticks stack up, and a sweep cuts between each beat.                    */
    const BEAT = 1.15;         // timeline units per standard
    const START = 0.55;        // first beat begins while the title is leaving
    const TOTAL = START + ROWS.length * BEAT + 1.0;

    const tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      scrollTrigger: {
        trigger: root,
        start: 'top top',
        end: '+=' + Math.round(TOTAL * PX_PER_UNIT),
        pin: stage,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // the ghost numeral and readout are driven by the master progress,
          // so they are correct scrubbing in either direction
          const raw = (self.progress * TOTAL - START) / BEAT;
          const i = Math.min(ROWS.length, Math.max(1, Math.floor(raw) + 1));
          const label = String(i).padStart(2, '0');
          if (numRef.current && numRef.current.textContent !== label) {
            numRef.current.textContent = label;
          }
          if (readoutRef.current && readoutRef.current.textContent !== label) {
            readoutRef.current.textContent = label;
          }
        },
      },
    });

    /* the title hands the frame over to the sequence */
    tl.to('.ap-title', {
      scale: 0.86,
      yPercent: -14,
      opacity: 0,
      filter: 'blur(16px)',
      duration: 0.75,
      ease: 'power2.inOut',
    }, 0)
      .fromTo('.ap-ghost', { opacity: 0 }, { opacity: 1, duration: 0.7 }, 0.25)
      .fromTo('.ap-progress-fill', { scaleX: 0 }, { scaleX: 1, ease: 'none', duration: TOTAL - 0.6 }, 0.4);

    ROWS.forEach((_, i) => {
      const at = START + i * BEAT;
      const beat = `.ap-beat--${i}`;

      tl
        /* claim assembles, word by word, out of a soft blur */
        .fromTo(`${beat} .ap-word`,
          { yPercent: 115, opacity: 0, filter: 'blur(12px)' },
          { yPercent: 0, opacity: 1, filter: 'blur(0px)', duration: 0.38, stagger: 0.035 }, at)
        /* what it replaces arrives just behind it */
        .fromTo(`${beat} .ap-instead`,
          { opacity: 0, x: 26 },
          { opacity: 0.5, x: 0, duration: 0.36 }, at + 0.1)
        /* …and gets struck through */
        .fromTo(`${beat} .ap-strike`,
          { scaleX: 0, transformOrigin: '0% 50%' },
          { scaleX: 1, duration: 0.32, ease: 'power2.inOut' }, at + 0.3)
        /* the tick for this standard locks into the stack */
        .to(`.ap-tick--${i}`, { scaleX: 1, opacity: 1, duration: 0.3 }, at + 0.1)
        /* a cut sweeps the frame and the line is gone on the cut, so the next
           one is already arriving — the frame is never left empty */
        .fromTo('.ap-sweep',
          { scaleX: 0, opacity: 1, transformOrigin: i % 2 ? '100% 50%' : '0% 50%' },
          { scaleX: 1, duration: 0.2, ease: 'power3.inOut' }, at + BEAT - 0.26)
        .to('.ap-sweep', { opacity: 0, duration: 0.14 }, at + BEAT - 0.08)
        .to(`${beat} .ap-word`,
          { yPercent: -110, opacity: 0, filter: 'blur(10px)', duration: 0.22, stagger: 0.02 }, at + BEAT - 0.22)
        .to(`${beat} .ap-instead, ${beat} .ap-strike`,
          { opacity: 0, x: -22, duration: 0.2 }, at + BEAT - 0.22);
    });

    /* the sequence resolves into the commitment */
    const outAt = START + ROWS.length * BEAT - 0.1;
    tl.to('.ap-ghost', { opacity: 0, scale: 1.08, duration: 0.6 }, outAt)
      .to('.ap-ticks', { opacity: 0.25, duration: 0.5 }, outAt)
      .fromTo('.ap-final',
        { opacity: 0, y: 40, filter: 'blur(14px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7 }, outAt + 0.15)
      .fromTo('.ap-final-rule',
        { scaleX: 0 },
        { scaleX: 1, duration: 0.6, ease: 'power2.inOut' }, outAt + 0.2)
      .fromTo('.ap-proof',
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.045 }, outAt + 0.4);
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id="compare"
      className="compare"
      style={{ backgroundColor: 'var(--black)', position: 'relative', zIndex: 2 }}
    >
      {/* ══════════ DESKTOP: the pinned motion sequence ══════════ */}
      <div
        ref={stageRef}
        className="ap-stage"
        style={{
          height: '100vh',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* ghost numeral, counting the standards */}
        <div
          ref={numRef}
          className="ap-ghost"
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'clamp(20rem, 38vw, 52rem)',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            lineHeight: 1,
            color: 'transparent',
            WebkitTextStroke: '1px rgba(244, 241, 234, 0.07)',
            fontVariantNumeric: 'tabular-nums',
            pointerEvents: 'none',
            opacity: 0,
          }}
        >
          01
        </div>

        {/* frame furniture */}
        <div
          style={{
            position: 'absolute',
            top: '3rem',
            left: 0,
            width: '100%',
            padding: '0 4rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            fontFamily: MONO,
            fontSize: '1.05rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(244, 241, 234, 0.42)',
            pointerEvents: 'none',
          }}
        >
          <span>How I work — the standard</span>
          <span style={{ color: INK, opacity: 0.8 }}>
            <span ref={readoutRef}>01</span>
            <span style={{ opacity: 0.45 }}>/{String(ROWS.length).padStart(2, '0')}</span>
          </span>
        </div>

        {/* the title, which hands the frame to the sequence */}
        <h2
          className="ap-title"
          style={{
            position: 'absolute',
            margin: 0,
            fontSize: 'clamp(5rem, 15vw, 22rem)',
            lineHeight: 0.82,
            letterSpacing: '-0.03em',
            textTransform: 'uppercase',
            fontWeight: 800,
            color: INK,
            pointerEvents: 'none',
          }}
        >
          Approach
        </h2>

        {/* the beats */}
        {ROWS.map((row, i) => (
          <div
            key={row.claim}
            className={`ap-beat ap-beat--${i}`}
            style={{
              position: 'absolute',
              width: '100%',
              padding: '0 6rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2.2rem',
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '0 1.5rem',
                fontSize: 'clamp(3rem, 6.6vw, 8.4rem)',
                fontWeight: 800,
                letterSpacing: '-0.035em',
                lineHeight: 0.98,
                textTransform: 'uppercase',
                color: INK,
                textAlign: 'center',
              }}
            >
              {row.claim.split(' ').map((word, w) => (
                <span key={w} style={{ display: 'inline-block', overflow: 'hidden', paddingBottom: '0.08em' }}>
                  <span className="ap-word" style={{ display: 'inline-block', opacity: 0 }}>
                    {word}
                  </span>
                </span>
              ))}
            </div>

            <div style={{ position: 'relative', display: 'inline-flex' }}>
              <span
                className="ap-instead"
                style={{
                  fontFamily: MONO,
                  fontSize: 'clamp(1.2rem, 1.7vw, 1.9rem)',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: INK,
                  opacity: 0,
                  whiteSpace: 'nowrap',
                }}
              >
                Instead of — {row.instead}
              </span>
              <span
                className="ap-strike"
                style={{
                  position: 'absolute',
                  top: '52%',
                  left: 0,
                  width: '100%',
                  height: '1px',
                  backgroundColor: INK,
                  opacity: 0.55,
                  transform: 'scaleX(0)',
                  transformOrigin: '0% 50%',
                }}
              />
            </div>
          </div>
        ))}

        {/* the cut that sweeps between beats */}
        <div
          className="ap-sweep"
          style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            width: '100%',
            height: '1px',
            backgroundColor: INK,
            opacity: 0,
            transform: 'scaleX(0)',
            pointerEvents: 'none',
          }}
        />

        {/* the standards stacking up, one tick each */}
        <div
          className="ap-ticks"
          style={{
            position: 'absolute',
            right: '4rem',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.9rem',
            pointerEvents: 'none',
          }}
        >
          {ROWS.map((row, i) => (
            <span
              key={row.claim}
              className={`ap-tick ap-tick--${i}`}
              style={{
                display: 'block',
                width: '3.4rem',
                height: '1px',
                backgroundColor: INK,
                opacity: 0.14,
                transform: 'scaleX(0.28)',
                transformOrigin: '100% 50%',
              }}
            />
          ))}
        </div>

        {/* the commitment the sequence resolves into */}
        <div
          className="ap-final"
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2.4rem',
            padding: '0 6rem',
            opacity: 0,
            pointerEvents: 'none',
          }}
        >
          <span
            className="ap-final-rule"
            style={{
              display: 'block',
              width: 'min(46rem, 60%)',
              height: '1px',
              backgroundColor: 'rgba(244, 241, 234, 0.22)',
              transform: 'scaleX(0)',
            }}
          />

          <span
            style={{
              fontSize: 'clamp(2.4rem, 4.6vw, 5.4rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              textTransform: 'uppercase',
              color: INK,
              lineHeight: 1.02,
              textAlign: 'center',
            }}
          >
            All ten are in the agreement.
          </span>

          {/* the standards themselves, assembled as proof */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              columnGap: '4rem',
              rowGap: '0.55rem',
              maxWidth: '78rem',
              width: '100%',
            }}
          >
            {ROWS.map((row, i) => (
              <span
                key={row.claim}
                className="ap-proof"
                style={{
                  display: 'flex',
                  gap: '1.1rem',
                  fontFamily: MONO,
                  fontSize: '1.15rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: INK,
                  opacity: 0,
                }}
              >
                <span style={{ opacity: 0.4 }}>{String(i + 1).padStart(2, '0')}</span>
                <span style={{ opacity: 0.72 }}>{row.claim}</span>
              </span>
            ))}
          </div>

          <span
            style={{
              fontFamily: MONO,
              fontSize: '1.05rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(244, 241, 234, 0.42)',
            }}
          >
            Not a pitch
          </span>
        </div>

        {/* progress of the whole sequence */}
        <div
          style={{
            position: 'absolute',
            bottom: '3rem',
            left: '4rem',
            right: '4rem',
            height: '1px',
            backgroundColor: 'rgba(244, 241, 234, 0.1)',
            pointerEvents: 'none',
          }}
        >
          <span
            className="ap-progress-fill"
            style={{
              display: 'block',
              width: '100%',
              height: '100%',
              backgroundColor: INK,
              opacity: 0.5,
              transform: 'scaleX(0)',
              transformOrigin: '0% 50%',
            }}
          />
        </div>
      </div>

      {/* ══════════ MOBILE / REDUCED MOTION: the plain ledger ══════════ */}
      <div className="ap-mobile" style={{ display: 'none' }}>
        <div className="center-wrap" style={{ width: '100%', paddingTop: '7rem', paddingBottom: '8rem' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem',
              fontFamily: MONO,
              fontSize: '1.05rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(244, 241, 234, 0.42)',
              paddingBottom: '1.4rem',
              borderBottom: '1px solid rgba(244, 241, 234, 0.1)',
            }}
          >
            <span>How I work</span>
            <span>The standard — {String(ROWS.length).padStart(2, '0')} lines</span>
          </div>

          <h2
            style={{
              margin: '2.2rem 0 2.8rem 0',
              fontSize: 'clamp(4rem, 17vw, 9rem)',
              lineHeight: 0.85,
              letterSpacing: '-0.03em',
              textTransform: 'uppercase',
              fontWeight: 800,
              color: INK,
            }}
          >
            Approach
          </h2>

          {ROWS.map((row, i) => (
            <div
              key={row.claim}
              className="ap-mrow"
              style={{
                display: 'grid',
                gridTemplateColumns: '3rem minmax(0, 1fr)',
                rowGap: '0.4rem',
                padding: '1.7rem 0 1.5rem 0',
                borderBottom: '1px solid rgba(244, 241, 234, 0.1)',
              }}
            >
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: '1.05rem',
                  letterSpacing: '0.16em',
                  color: INK,
                  opacity: 0.4,
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span
                style={{
                  fontSize: 'clamp(1.7rem, 6vw, 2.4rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.05,
                  textTransform: 'uppercase',
                  color: INK,
                }}
              >
                {row.claim}
              </span>
              <span />
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: '1.15rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: INK,
                  opacity: 0.32,
                }}
              >
                {row.instead}
              </span>
            </div>
          ))}

          <div style={{ marginTop: '3rem' }}>
            <span
              style={{
                fontSize: 'clamp(1.6rem, 5.5vw, 2.2rem)',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                color: INK,
                lineHeight: 1.1,
              }}
            >
              All ten are in the agreement.
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1023px) {
          .ap-stage { display: none !important; }
          .ap-mobile { display: block !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ap-stage { display: none !important; }
          .ap-mobile { display: block !important; }
        }
      `}</style>
    </section>
  );
}
