'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import TitleReveal from './TitleReveal';
import { INK } from './LogoMark';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const MONO = "'IBM Plex Mono', monospace";

/**
 * The standard, line by line. Left column is the commitment, right column is
 * what it replaces. The contrast is carried entirely by typographic weight and
 * value — no colour is used to make the point.
 */
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

export default function CompareSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const root = sectionRef.current;
    const list = listRef.current;
    if (!root || !list) return;

    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;

    /* The centre spine draws itself in as the section arrives */
    gsap.fromTo('.ap-spine',
      { scaleY: 0, transformOrigin: '50% 0%' },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: { trigger: list, start: 'top 85%', end: 'top 35%', scrub: true },
      });

    /* Each line activates as it reaches the reading line: the commitment
       sharpens and leans toward the spine, what it replaces recedes. */
    gsap.utils.toArray<HTMLElement>('.ap-row').forEach((row) => {
      const claim = row.querySelector('.ap-claim');
      const instead = row.querySelector('.ap-instead');
      const rule = row.querySelector('.ap-rule');
      const idx = row.querySelector('.ap-idx');

      gsap.timeline({
        scrollTrigger: {
          trigger: row,
          start: 'center bottom-=25%',
          end: 'center top+=25%',
          scrub: true,
        },
      })
        .fromTo(claim,
          { opacity: 0.38, x: 0 },
          { opacity: 1, x: isDesktop ? 12 : 0, duration: 0.5, ease: 'power2.out' })
        .to(claim, { opacity: 0.38, x: 0, duration: 0.5, ease: 'power2.in' })
        .fromTo(instead,
          { opacity: 0.42, x: 0 },
          { opacity: 0.24, x: isDesktop ? 14 : 0, duration: 0.5, ease: 'power2.out' }, 0)
        .to(instead, { opacity: 0.42, x: 0, duration: 0.5, ease: 'power2.in' }, 0.5)
        .fromTo(rule,
          { opacity: 0.08 },
          { opacity: 0.34, duration: 0.5, ease: 'power2.out' }, 0)
        .to(rule, { opacity: 0.08, duration: 0.5, ease: 'power2.in' }, 0.5)
        .fromTo(idx, { opacity: 0.3 }, { opacity: 0.85, duration: 0.5 }, 0)
        .to(idx, { opacity: 0.3, duration: 0.5 }, 0.5);
    });

    if (!isDesktop) return;

    /* A registration mark rides the spine, and the readout counts the
       standards actually passed — it is only ever counting these rows. */
    const marker = markerRef.current;
    ScrollTrigger.create({
      trigger: list,
      start: 'top center',
      end: 'bottom center',
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        if (marker) {
          gsap.set(marker, { y: p * (list.clientHeight - marker.clientHeight) });
        }
        if (readoutRef.current) {
          const n = Math.min(ROWS.length, Math.max(1, Math.ceil(p * ROWS.length)));
          readoutRef.current.textContent = String(n).padStart(2, '0');
        }
      },
    });
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id="compare"
      className="compare"
      style={{
        backgroundColor: 'var(--black)',
        paddingTop: '9rem',
        paddingBottom: '11rem',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <div className="center-wrap" style={{ width: '100%' }}>

        {/* Kicker — same registration voice as the loader */}
        <div
          className="ap-kicker"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
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

        <TitleReveal
          text="Approach"
          style={{
            fontSize: 'clamp(5rem, 16vw, 24rem)',
            lineHeight: 0.82,
            letterSpacing: '-0.03em',
            textTransform: 'uppercase',
            fontWeight: 800,
            color: INK,
            marginTop: '2.5rem',
            marginBottom: '3.5rem',
          }}
        />

        {/* Column headings */}
        <div
          className="ap-heads"
          style={{
            display: 'grid',
            gridTemplateColumns: '4.5rem minmax(0, 1fr) 7.5rem minmax(0, 1fr)',
            alignItems: 'baseline',
            fontFamily: MONO,
            fontSize: '1.05rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(244, 241, 234, 0.5)',
            paddingBottom: '1.2rem',
          }}
        >
          <span className="ap-readout-wrap" style={{ color: INK, opacity: 0.75 }}>
            <span ref={readoutRef}>01</span>
            <span style={{ opacity: 0.45 }}>/{String(ROWS.length).padStart(2, '0')}</span>
          </span>
          <span style={{ textAlign: 'right', color: INK, opacity: 0.85 }}>With me</span>
          <span />
          <span>Instead of</span>
        </div>

        {/* The ledger */}
        <div ref={listRef} className="ap-list" style={{ position: 'relative' }}>

          {/* Centre spine + travelling registration mark */}
          <div
            className="ap-spine"
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 'calc(4.5rem + ((100% - 12rem) / 2) + 3.75rem)',
              width: '1px',
              backgroundColor: 'rgba(244, 241, 234, 0.2)',
              pointerEvents: 'none',
            }}
          />
          <div
            ref={markerRef}
            className="ap-marker"
            style={{
              position: 'absolute',
              top: 0,
              left: 'calc(4.5rem + ((100% - 12rem) / 2) + 3.75rem)',
              width: '1.4rem',
              height: '1.4rem',
              transform: 'translateX(-50%)',
              pointerEvents: 'none',
            }}
          >
            <span style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '1px', backgroundColor: 'rgba(244,241,234,0.75)' }} />
            <span style={{ position: 'absolute', left: '50%', top: 0, height: '100%', width: '1px', backgroundColor: 'rgba(244,241,234,0.75)' }} />
          </div>

          {ROWS.map((row, i) => (
            <div
              key={row.claim}
              className="ap-row"
              style={{
                position: 'relative',
                display: 'grid',
                gridTemplateColumns: '4.5rem minmax(0, 1fr) 7.5rem minmax(0, 1fr)',
                alignItems: 'baseline',
                padding: '2.1rem 0 1.7rem 0',
              }}
            >
              <span
                className="ap-idx"
                style={{
                  fontFamily: MONO,
                  fontSize: '1.05rem',
                  letterSpacing: '0.16em',
                  color: INK,
                  opacity: 0.3,
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>

              <span
                className="ap-claim"
                style={{
                  textAlign: 'right',
                  fontSize: 'clamp(1.8rem, 2.9vw, 3.2rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.02,
                  textTransform: 'uppercase',
                  color: INK,
                  opacity: 0.38,
                  willChange: 'transform, opacity',
                }}
              >
                {row.claim}
              </span>

              <span />

              <span
                className="ap-instead"
                style={{
                  fontSize: 'clamp(1.5rem, 2.1vw, 2.2rem)',
                  fontWeight: 400,
                  letterSpacing: '-0.01em',
                  lineHeight: 1.15,
                  textTransform: 'uppercase',
                  color: INK,
                  opacity: 0.42,
                  willChange: 'transform, opacity',
                }}
              >
                {row.instead}
              </span>

              {/* the rule grows in from the spine as the line activates */}
              <span
                className="ap-rule"
                style={{
                  position: 'absolute',
                  left: '4.5rem',
                  right: 0,
                  bottom: 0,
                  height: '1px',
                  backgroundColor: INK,
                  opacity: 0.08,
                  pointerEvents: 'none',
                }}
              />
            </div>
          ))}
        </div>

        {/* The section lands on a statement instead of trailing off */}
        <div
          className="ap-close"
          style={{
            marginTop: '5rem',
            paddingTop: '1.6rem',
            borderTop: '1px solid rgba(244, 241, 234, 0.12)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            gap: '2rem',
          }}
        >
          <span
            style={{
              fontSize: 'clamp(1.5rem, 2.1vw, 2.3rem)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              color: INK,
              lineHeight: 1.05,
            }}
          >
            Every line above is in the agreement.
          </span>
          <span
            style={{
              fontFamily: MONO,
              fontSize: '1.05rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(244, 241, 234, 0.42)',
              whiteSpace: 'nowrap',
            }}
          >
            Not a pitch
          </span>
        </div>
      </div>

      <style>{`
        @media (max-width: 1023px) {
          /* the numeric readout and column labels are desktop affordances tied
             to the spine — on mobile the kicker already frames the list */
          .ap-heads {
            display: none !important;
          }
          .ap-kicker {
            flex-direction: column !important;
            gap: 0.35rem !important;
          }
          .ap-row {
            grid-template-columns: 3rem minmax(0, 1fr) !important;
            row-gap: 0.4rem !important;
          }
          .ap-row > .ap-claim {
            text-align: left !important;
            grid-column: 2 !important;
          }
          .ap-row > span:nth-child(3) {
            display: none !important;
          }
          .ap-row > .ap-instead {
            grid-column: 2 !important;
            opacity: 0.3 !important;
          }
          .ap-rule {
            left: 3rem !important;
          }
          .ap-spine,
          .ap-marker {
            display: none !important;
          }
          .ap-close {
            flex-direction: column !important;
            gap: 0.8rem !important;
            margin-top: 3.5rem !important;
          }
        }
      `}</style>
    </section>
  );
}
