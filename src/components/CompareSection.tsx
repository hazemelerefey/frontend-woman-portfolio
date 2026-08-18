'use client';

import { useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import TitleReveal from './TitleReveal';
import { INK } from './LogoMark';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const MONO = "'IBM Plex Mono', monospace";

/**
 * Eleven facing pairs. Same rhythm as the original, rewritten so every line is
 * parallel, correctly spelled and defensible.
 */
const PAIRS: { mine: string; theirs: string }[] = [
  { mine: 'Ships without bugs', theirs: 'Ships and then patches' },
  { mine: 'Pixel-exact build', theirs: '“Close enough” layout' },
  { mine: 'Deadlines held', theirs: 'Deadlines explained' },
  { mine: 'Fixed price, quoted upfront', theirs: 'Invoices after launch' },
  { mine: 'Motion included', theirs: 'Static handoff' },
  { mine: 'Faithful to the design', theirs: 'Approximated from the design' },
  { mine: 'Written weekly updates', theirs: 'Radio silence' },
  { mine: 'One developer throughout', theirs: 'Rotating hands' },
  { mine: 'Answers within hours', theirs: 'Answers within days' },
  { mine: 'Clean, documented code', theirs: 'Code nobody can inherit' },
  { mine: 'Supported after launch', theirs: 'Gone at handoff' },
];

export default function CompareSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const counterWrapRef = useRef<HTMLDivElement>(null);
  const counterNumRef = useRef<HTMLSpanElement>(null);
  const leftListRef = useRef<HTMLDivElement>(null);
  const rightListRef = useRef<HTMLDivElement>(null);
  const [side, setSide] = useState<'mine' | 'theirs' | null>(null);

  useGSAP(() => {
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isDesktop || reduced) return;

    const counterWrap = counterWrapRef.current;
    const content = contentRef.current;
    const inner = innerRef.current;
    if (!counterWrap || !content || !inner) return;

    /* ── Pinned centre counter (the original mechanic) ──
       It now counts the standards themselves, 01 → 11, instead of an
       arbitrary 28 → 99.                                                    */
    const offset = counterWrap.getBoundingClientRect().top - content.getBoundingClientRect().top;
    const distance = inner.clientHeight - 2 * offset - counterWrap.clientHeight;

    if (distance > 0) {
      const state = { val: 1 };
      gsap.timeline({
        scrollTrigger: {
          trigger: counterWrap,
          pin: true,
          start: 'center center',
          end: '+=' + distance + 'px',
          scrub: 1,
          pinSpacing: false,
          invalidateOnRefresh: true,
        },
      }).to(state, {
        val: PAIRS.length,
        duration: 1,
        ease: 'none',
        onUpdate: () => {
          if (counterNumRef.current) {
            counterNumRef.current.textContent = String(Math.round(state.val)).padStart(2, '0');
          }
        },
      });
    }

    /* ── Rows swell as they cross the reading line, then settle ── */
    const growRows = (selector: string, origin: string) => {
      gsap.utils.toArray<HTMLElement>(selector).forEach((row) => {
        gsap.timeline({
          scrollTrigger: {
            trigger: row,
            start: 'center-=80 center',
            end: 'center+=170 center',
            scrub: true,
          },
        })
          .fromTo(row, { scale: 1, transformOrigin: origin }, { scale: 1.22, duration: 0.5 })
          .to(row, { scale: 1, duration: 0.5 });
      });
    };
    growRows('.compare__item--left', 'right center');
    growRows('.compare__item--right', 'left center');

    /* ── Mouse tilt on each panel, with listeners cleaned up ── */
    const teardown: (() => void)[] = [];
    const setupTilt = (element: HTMLElement | null) => {
      if (!element) return;
      const handleMove = (ev: MouseEvent) => {
        const rect = element.getBoundingClientRect();
        const x = (ev.clientX - rect.left) / rect.width - 0.5;
        const y = (ev.clientY - rect.top) / rect.height - 0.5;
        gsap.to(element, {
          rotationX: -y * 4,
          rotationY: x * 4,
          transformPerspective: 1800,
          ease: 'power2.out',
          duration: 0.5,
        });
      };
      const handleLeave = () => {
        gsap.to(element, { rotationX: 0, rotationY: 0, duration: 0.7, ease: 'power2.out' });
      };
      element.addEventListener('mousemove', handleMove);
      element.addEventListener('mouseleave', handleLeave);
      teardown.push(() => {
        element.removeEventListener('mousemove', handleMove);
        element.removeEventListener('mouseleave', handleLeave);
      });
    };
    setupTilt(leftListRef.current);
    setupTilt(rightListRef.current);

    return () => teardown.forEach((fn) => fn());
  }, { scope: sectionRef });

  const itemBase: React.CSSProperties = {
    display: 'flex',
    padding: '2.4rem 0 1.3rem 0',
    width: '100%',
    fontWeight: 800,
    fontSize: 'clamp(1.7rem, 2.2vw, 2.7rem)',
    letterSpacing: '-0.03em',
    lineHeight: 1.02,
    textTransform: 'uppercase',
    willChange: 'transform',
  };

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

        {/* Kicker, in the same registration voice as the rest of the site */}
        <div
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
          <span>{String(PAIRS.length).padStart(2, '0')} standards</span>
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
            marginTop: '2.2rem',
            marginBottom: '1.5rem',
          }}
        />

        {/* Two facing panels + the pinned counter between them */}
        <div
          ref={contentRef}
          className="compare__content"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            position: 'relative',
            marginTop: '1.5rem',
          }}
        >
          <div
            ref={innerRef}
            className="compare__inner"
            style={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: '3rem' }}
          >
            {/* ── With me ── */}
            <div
              ref={leftListRef}
              className="compare__list"
              onMouseEnter={() => setSide('mine')}
              onMouseLeave={() => setSide(null)}
              style={{
                width: 'calc(50% - 1.5rem)',
                padding: '4rem 3rem 9rem 3rem',
                borderRadius: '2rem',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'rgba(244, 241, 234, 0.055)',
                border: '1px solid rgba(244, 241, 234, 0.14)',
                color: INK,
                willChange: 'transform',
              }}
            >
              {/* label sits in the panel, not over the rows */}
              <span
                className="compare__label"
                style={{
                  fontFamily: MONO,
                  fontSize: '1.1rem',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: INK,
                  opacity: 0.8,
                  textAlign: 'right',
                  paddingBottom: '2.6rem',
                }}
              >
                With me
              </span>
              {PAIRS.map((pair) => (
                <div
                  key={pair.mine}
                  className="compare__item compare__item--left"
                  style={{
                    ...itemBase,
                    justifyContent: 'flex-end',
                    textAlign: 'right',
                    paddingRight: '13rem',
                    borderBottom: '1px solid rgba(244, 241, 234, 0.12)',
                  }}
                >
                  {pair.mine}
                </div>
              ))}
            </div>

            {/* ── Elsewhere ── */}
            <div
              ref={rightListRef}
              className="compare__list compare__list--negative"
              onMouseEnter={() => setSide('theirs')}
              onMouseLeave={() => setSide(null)}
              style={{
                width: 'calc(50% - 1.5rem)',
                padding: '4rem 3rem 9rem 3rem',
                borderRadius: '2rem',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'rgba(244, 241, 234, 0.018)',
                border: '1px solid rgba(244, 241, 234, 0.07)',
                color: INK,
                willChange: 'transform',
              }}
            >
              {/* label sits in the panel, not over the rows */}
              <span
                className="compare__label"
                style={{
                  fontFamily: MONO,
                  fontSize: '1.1rem',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: INK,
                  opacity: 0.45,
                  textAlign: 'left',
                  paddingBottom: '2.6rem',
                }}
              >
                Elsewhere
              </span>
              {PAIRS.map((pair) => (
                <div
                  key={pair.theirs}
                  className="compare__item compare__item--right"
                  style={{
                    ...itemBase,
                    justifyContent: 'flex-start',
                    paddingLeft: '13rem',
                    fontWeight: 400,
                    opacity: 0.4,
                    borderBottom: '1px solid rgba(244, 241, 234, 0.07)',
                  }}
                >
                  {pair.theirs}
                </div>
              ))}
            </div>
          </div>

          {/* Side labels + the pinned counter */}
          <div
            ref={counterWrapRef}
            className="compare__counter-wrap"
            style={{
              display: 'flex',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 2,
              pointerEvents: 'none',
              fontFamily: MONO,
              fontSize: '1.15rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
            }}
          >
            <div
              className="compare__counter"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                backgroundColor: '#0C0C0C',
                borderRadius: '50%',
                width: '22rem',
                height: '22rem',
                border: '1px solid rgba(244, 241, 234, 0.12)',
                boxShadow: '0 0.5rem 3rem rgba(0, 0, 0, 0.5)',
              }}
            >
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: '1.05rem',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'rgba(244, 241, 234, 0.45)',
                  transition: 'color 0.3s',
                }}
              >
                {side === 'theirs' ? 'Elsewhere' : side === 'mine' ? 'With me' : 'Standards'}
              </span>
              <span
                ref={counterNumRef}
                style={{
                  color: INK,
                  fontSize: '7rem',
                  letterSpacing: '-0.04em',
                  fontWeight: 800,
                  lineHeight: 1,
                  fontVariantNumeric: 'tabular-nums',
                  opacity: side === 'theirs' ? 0.45 : 1,
                  transition: 'opacity 0.3s',
                }}
              >
                01
              </span>
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: '1.05rem',
                  letterSpacing: '0.22em',
                  color: 'rgba(244, 241, 234, 0.35)',
                }}
              >
                /{String(PAIRS.length).padStart(2, '0')}
              </span>
            </div>

          </div>
        </div>

        {/* Closing line, so the section lands */}
        <div
          className="compare__close"
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
            All {PAIRS.length} are in the agreement.
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
          .compare__inner {
            flex-direction: column !important;
            gap: 1rem !important;
          }
          .compare__list {
            width: 100% !important;
            border-radius: 1rem !important;
            padding: 2.6rem 1.8rem !important;
          }
          .compare__item {
            font-size: 1.8rem !important;
            padding: 1.4rem 0 1.2rem 0 !important;
            justify-content: flex-start !important;
            text-align: left !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
          }
          .compare__label {
            text-align: left !important;
            padding-bottom: 1.6rem !important;
          }
          .compare__counter-wrap {
            display: none !important;
          }
          .compare__close {
            flex-direction: column !important;
            gap: 0.8rem !important;
            margin-top: 3rem !important;
          }
        }
      `}</style>
    </section>
  );
}
