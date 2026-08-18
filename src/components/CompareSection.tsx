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

export default function CompareSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const counterWrapRef = useRef<HTMLDivElement>(null);
  const counterNumRef = useRef<HTMLSpanElement>(null);
  const leftListRef = useRef<HTMLDivElement>(null);
  const rightListRef = useRef<HTMLDivElement>(null);
  const [negativeHover, setNegativeHover] = useState(false);

  useGSAP(() => {
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
    if (!isDesktop) return;

    const counterWrap = counterWrapRef.current;
    const content = contentRef.current;
    const inner = innerRef.current;
    if (!counterWrap || !content || !inner) return;

    // === Pinned counter (reference mechanic) ===
    // offset of the wrap inside the content, pin for the remaining list height
    const e = counterWrap.getBoundingClientRect().top - content.getBoundingClientRect().top;
    const n = inner.clientHeight - 2 * e - counterWrap.clientHeight;

    const counterState = { val: 28 };
    gsap.timeline({
      scrollTrigger: {
        trigger: counterWrap,
        pin: true,
        start: 'center center',
        end: '+=' + n + 'px',
        scrub: 1,
        pinSpacing: false,
      },
    }).to(counterState, {
      val: 99,
      duration: 1,
      onUpdate: () => {
        if (counterNumRef.current) {
          counterNumRef.current.textContent = String(Math.round(counterState.val));
        }
      },
    });

    // === Rows grow as they cross viewport center, then shrink back ===
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
          .fromTo(row, { scale: 1, transformOrigin: origin }, { scale: 1.28, duration: 0.5 })
          .to(row, { scale: 1, duration: 0.5 });
      });
    };
    growRows('.compare__item--left', 'right center');
    growRows('.compare__item--right', 'left center');

    // === Tilt on the two lists (like the reference's vanilla-tilt) ===
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
    };
    setupTilt(leftListRef.current);
    setupTilt(rightListRef.current);
  }, { scope: sectionRef });

  const itemBase: React.CSSProperties = {
    display: 'flex',
    padding: '2.6rem 0 1.3rem 0',
    width: '100%',
    borderBottom: '1px solid rgba(0, 0, 0, 0.2)',
    fontWeight: 500,
    fontSize: '3rem',
    letterSpacing: '-0.03em',
    lineHeight: 0.91,
    willChange: 'transform',
  };

  return (
    <section
      ref={sectionRef}
      id="compare"
      className="compare"
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
            marginBottom: '1.5rem',
          }}
        />

        {/* Compare content: two lists + pinned counter wrap */}
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
          <div ref={innerRef} className="compare__inner" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: '0' }}>

            {/* Left list: positive */}
            <div
              ref={leftListRef}
              className="compare__list"
              style={{
                width: 'calc(50% - 1.5rem)',
                padding: '10rem 0',
                borderRadius: '2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                background: 'linear-gradient(180deg, #94bdf7 0%, #a8c4f8 100%)',
                color: '#000',
                willChange: 'transform',
              }}
            >
              {shahdItems.map((item) => (
                <div
                  key={item}
                  className="compare__item compare__item--left"
                  style={{
                    ...itemBase,
                    justifyContent: 'flex-end',
                    paddingRight: '17.5rem',
                  }}
                >
                  {item}
                </div>
              ))}
            </div>

            {/* Right list: negative */}
            <div
              ref={rightListRef}
              className="compare__list compare__list--negative"
              onMouseEnter={() => setNegativeHover(true)}
              onMouseLeave={() => setNegativeHover(false)}
              style={{
                width: 'calc(50% - 1.5rem)',
                padding: '10rem 0',
                paddingLeft: '20rem',
                borderRadius: '2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                background: 'linear-gradient(180deg, #d4bdf8 0%, #cdb2f6 100%)',
                color: '#000',
                willChange: 'transform',
              }}
            >
              {freelancerItems.map((item) => (
                <div
                  key={item}
                  className="compare__item compare__item--right"
                  style={{
                    ...itemBase,
                    justifyContent: 'flex-start',
                    paddingLeft: '17.5rem',
                    paddingRight: 0,
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Pinned wrap: side labels + center counter circle */}
          <div
            ref={counterWrapRef}
            className="compare__counter-wrap"
            style={{
              display: 'flex',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'center',
              zIndex: 2,
              pointerEvents: 'none',
              fontWeight: 700,
              fontSize: '2rem',
              textTransform: 'uppercase',
              color: 'var(--white)',
            }}
          >
            <span style={{ paddingLeft: '3rem', color: '#000' }}>Shahd</span>

            <div
              className="compare__counter"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#121212',
                borderRadius: '50%',
                width: '25rem',
                height: '25rem',
                color: 'var(--gray)',
                boxShadow: '0 0.5rem 2rem rgba(0, 0, 0, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                fontSize: '2.5rem',
              }}
            >
              <span
                className="compare__counter-swap"
                style={{
                  opacity: 0.4,
                  position: 'relative',
                  transition: 'all 0.5s',
                }}
              >
                {negativeHover ? 'BAGS' : 'IDEAS'}
              </span>
              <span
                ref={counterNumRef}
                id="counter"
                style={{
                  color: negativeHover ? 'var(--pink)' : 'var(--sky)',
                  fontSize: '8rem',
                  letterSpacing: '-0.03em',
                  fontWeight: 500,
                  transition: 'color 0.2s',
                  lineHeight: 1,
                }}
              >
                28
              </span>
            </div>

            <span style={{ paddingRight: '3rem', color: '#000' }}>Freelancer</span>
          </div>

        </div>

      </div>

      <style>{`
        @media (max-width: 1023px) {
          .compare__inner {
            flex-direction: column !important;
            gap: 0.5rem !important;
          }
          .compare__list {
            width: 100% !important;
            border-radius: 0.8rem !important;
            padding: 3rem 2rem !important;
            gap: 2.5rem !important;
          }
          .compare__item {
            font-size: 1.9rem !important;
            padding: 0 0 1rem 0 !important;
            justify-content: flex-start !important;
          }
          .compare__counter-wrap {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}
