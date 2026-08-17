'use client';

import { useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import TitleReveal from './TitleReveal';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const shahdItems = [
  'Bugless',
  'PixelPerfect',
  'On-time deadlines',
  'Fixed Price Only',
  'Free Light Animations',
  'Better than Figma',
  'Weekly Updates',
  'Stable Support',
  'Fast Replies',
  'Creativity',
  'hassle-free',
];

const freelancerItems = [
  'Full of bugs',
  'Near Layout',
  'Deadline shame',
  'Post-launch costs',
  'Hovers Not Always',
  'Worse than Figma',
  'Strage Silence',
  'Dev Rotation',
  'Hours of Silence',
  'Passivity',
  'Headaches',
];

const swapLabels = ['BAGS', 'IDEAS'];

export default function CompareSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [swapIdx, setSwapIdx] = useState(0);
  const [activeRow, setActiveRow] = useState<number | null>(null);
  const [hoverRow, setHoverRow] = useState<number | null>(null);

  useGSAP(() => {
    // Scroll-driven row activation: the row pair crossing viewport center
    // becomes the highlighted one.
    const rows = gsap.utils.toArray<HTMLElement>('.compare__row--left');
    rows.forEach((row, idx) => {
      ScrollTrigger.create({
        trigger: row,
        start: 'center-=80 center',
        end: 'center+=170 center',
        onEnter: () => setActiveRow(idx),
        onEnterBack: () => setActiveRow(idx),
      });
    });

    // Badge counter counts 28 -> 99 while scrolling through the lists
    // (same range as the original), and the label flips BAGS -> IDEAS.
    const counterState = { value: 28 };
    gsap.to(counterState, {
      value: 99,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 70%',
        end: 'bottom bottom',
        scrub: 1,
        onUpdate: (self) => {
          setSwapIdx(self.progress > 0.5 ? 1 : 0);
        },
      },
      onUpdate: () => {
        if (counterRef.current) {
          counterRef.current.textContent = String(Math.round(counterState.value));
        }
      },
    });
  }, { scope: sectionRef });

  const highlight = hoverRow ?? activeRow;

  const rowStyle = (idx: number, side: 'left' | 'right'): React.CSSProperties => ({
    fontSize: highlight === idx ? 'clamp(2.4rem, 2.8vw, 3.6rem)' : 'clamp(1.9rem, 2.1vw, 2.6rem)',
    fontWeight: 500,
    letterSpacing: '-0.02em',
    lineHeight: 1.15,
    borderBottom: '1px solid rgba(0,0,0,0.12)',
    padding: '1.8rem 0',
    textAlign: side === 'left' ? 'right' : 'left',
    cursor: 'pointer',
    opacity: highlight === null || highlight === idx ? 1 : 0.45,
    transition: 'all 0.25s ease',
  });

  return (
    <section
      ref={sectionRef}
      id="compare"
      style={{
        backgroundColor: 'var(--black)',
        paddingTop: '10rem',
        paddingBottom: '12rem',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <div className="center-wrap" style={{ width: '100%' }}>
        
        {/* Section Title */}
        <TitleReveal
          text="Approach"
          style={{ 
            fontSize: 'clamp(5rem, 16vw, 24rem)',
            lineHeight: 0.82,
            letterSpacing: '-0.03em',
            textTransform: 'uppercase',
            fontWeight: 800,
            color: 'var(--white)',
            marginBottom: '4rem',
          }}
        />

        {/* One split card: blue half (SHAHD) / lavender half (FREELANCER),
            rows anchored toward the center seam, side labels at the edges,
            dark circular counter badge riding the seam. */}
        <div className="compare-grid" style={{ position: 'relative' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.6rem',
            }}
            className="compare-grid__inner"
          >
            {/* Left half: SHAHD */}
            <div
              className="compare__half"
              style={{
                background: 'linear-gradient(180deg, #94bdf7 0%, #a8c4f8 100%)',
                borderRadius: '1.2rem 0 0 1.2rem',
                padding: '6rem 0 6rem 3rem',
                color: '#000',
                display: 'grid',
                gridTemplateColumns: '10rem 1fr',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '1.4rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                SHAHD
              </div>
              <div style={{ paddingRight: '10rem' }}>
                {shahdItems.map((item, idx) => (
                  <div
                    key={item}
                    className="compare__row--left"
                    onMouseEnter={() => setHoverRow(idx)}
                    onMouseLeave={() => setHoverRow(null)}
                    style={rowStyle(idx, 'left')}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Right half: FREELANCER */}
            <div
              className="compare__half"
              style={{
                background: 'linear-gradient(180deg, #d4bdf8 0%, #cdb2f6 100%)',
                borderRadius: '0 1.2rem 1.2rem 0',
                padding: '6rem 3rem 6rem 0',
                color: '#000',
                display: 'grid',
                gridTemplateColumns: '1fr 10rem',
                alignItems: 'center',
              }}
            >
              <div style={{ paddingLeft: '10rem' }}>
                {freelancerItems.map((item, idx) => (
                  <div
                    key={item}
                    onMouseEnter={() => setHoverRow(idx)}
                    onMouseLeave={() => setHoverRow(null)}
                    style={rowStyle(idx, 'right')}
                  >
                    {item}
                  </div>
                ))}
              </div>
              <div
                style={{
                  fontSize: '1.4rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  textAlign: 'right',
                }}
              >
                FREELANCER
              </div>
            </div>
          </div>

          {/* Center counter badge — sticky, riding the seam */}
          <div
            className="compare__badge-col"
            style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              height: '100%',
              transform: 'translateX(-50%)',
              zIndex: 10,
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                position: 'sticky',
                top: 'calc(50vh - 9.5rem)',
                width: '19rem',
                height: '19rem',
                borderRadius: '50%',
                backgroundColor: '#141416',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 1.5rem 4rem rgba(0, 0, 0, 0.5)',
              }}
            >
              <span 
                style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: 700, 
                  letterSpacing: '0.08em', 
                  color: 'var(--gray)',
                  textTransform: 'uppercase',
                  marginBottom: '0.2rem',
                  transition: 'opacity 0.2s ease',
                }}
              >
                {swapLabels[swapIdx]}
              </span>
              <span 
                ref={counterRef}
                style={{ 
                  fontSize: '6.8rem', 
                  fontWeight: 500, 
                  lineHeight: 1, 
                  color: 'var(--gray)',
                  letterSpacing: '-0.03em',
                }}
              >
                28
              </span>
            </div>
          </div>

        </div>

      </div>

      <style>{`
        @media (max-width: 1023px) {
          .compare-grid__inner {
            grid-template-columns: 1fr !important;
          }
          .compare__half {
            grid-template-columns: 1fr !important;
            border-radius: 1.2rem !important;
            padding: 4rem 2.5rem !important;
          }
          .compare__half > div {
            padding: 0 !important;
          }
          .compare__badge-col {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}
