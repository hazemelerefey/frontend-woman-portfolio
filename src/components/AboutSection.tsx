'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import FeaturesBar from './FeaturesBar';
import TitleReveal from './TitleReveal';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
    if (!isDesktop) return;

    // 3D Tilt Effect on cards
    const cards = gsap.utils.toArray<HTMLElement>('.about__card');
    cards.forEach((card) => {
      card.addEventListener('mousemove', (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const xPercent = (x / rect.width - 0.5) * 14;
        const yPercent = (y / rect.height - 0.5) * -14;

        gsap.to(card, {
          rotationX: yPercent,
          rotationY: xPercent,
          ease: 'power2.out',
          duration: 0.4,
          transformPerspective: 1000,
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, { rotationX: 0, rotationY: 0, ease: 'power2.out', duration: 0.5 });
      });
    });

    // === Star-mask transition ===
    // The grid pins at center; the Mission section sits on top of it, masked by
    // a four-pointed star ("+") centered in the grid gap. Scrolling scrubs the
    // mask from 0% to 1000%, so the star opens and the next section is revealed
    // right through the middle of the cards. The cards fade in the last quarter.
    const section = sectionRef.current;
    gsap.timeline({
      scrollTrigger: {
        trigger: '.about__gsap',
        start: 'center center',
        end: '+=1000',
        scrub: true,
        pin: true,
        onEnter: () => { if (section) section.style.pointerEvents = 'none'; },
        onLeave: () => { if (section) section.style.pointerEvents = 'auto'; },
        onEnterBack: () => { if (section) section.style.pointerEvents = 'none'; },
        onLeaveBack: () => { if (section) section.style.pointerEvents = 'auto'; },
      },
    })
    .fromTo('.about .mission',
      { WebkitMaskSize: '0%', maskSize: '0%' },
      { WebkitMaskSize: '1000%', maskSize: '1000%', duration: 1, ease: 'power1.in' }, 0)
    .fromTo('.about__items',
      { opacity: 1 },
      { opacity: 0, delay: 0.75, duration: 0.25 }, 0)
    .fromTo('.about .mission__text',
      { y: '110%' },
      { y: '0%', delay: 0.25, duration: 0.5, stagger: { amount: 0.5 } }, 0)
    .to('.mission-slide-1', { yPercent: -100, opacity: 0, delay: 0.8, duration: 0.2 }, 0)
    .fromTo('.mission-slide-2',
      { yPercent: 100, opacity: 0 },
      { yPercent: 0, opacity: 1, delay: 0.8, duration: 0.2 }, 0);

  }, { scope: sectionRef });

  const cardBase: React.CSSProperties = {
    borderRadius: '0.8rem',
    padding: '6rem 5.7rem',
    minHeight: '44rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    color: '#000',
    textDecoration: 'none',
  };

  const missionRow: React.CSSProperties = {
    fontWeight: 400,
    lineHeight: 0.85,
    letterSpacing: '-0.03em',
    textTransform: 'uppercase',
    fontSize: 'clamp(3rem, 7vw, 10.5rem)',
    display: 'flex',
    overflow: 'hidden',
  };

  return (
    <section 
      ref={sectionRef} 
      className="about" 
      id="about" 
      style={{ 
        backgroundColor: 'var(--black)', 
        color: 'var(--white)',
        paddingTop: '12rem',
        paddingBottom: '10rem',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <div className="center-wrap" style={{ width: '100%' }}>
        
        {/* Title */}
        <TitleReveal
          text="SIMPLY ABOUT"
          style={{ 
            fontSize: 'clamp(5rem, 20vw, 30.8rem)',
            lineHeight: 0.82,
            letterSpacing: '-0.03em',
            textTransform: 'uppercase',
            fontWeight: 400,
            marginBottom: '4rem',
            color: 'var(--gray)'
          }}
        />

        {/* Subheader Feature Row */}
        <div style={{ marginBottom: '15rem' }}>
          <FeaturesBar 
            title="PIXEL-PERFECT" 
            items={['SUPPORT ∞', '/CODE-QUALITY', '//HASSLE-FREE']} 
          />
        </div>

        {/* Pinned wrapper: grid + star-masked mission overlay */}
        <div className="about__gsap" style={{ position: 'relative' }}>

          {/* 2x2 About Cards Grid */}
          <div 
            className="about__items about__grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1.6rem',
            }}
          >
            {/* Card 1: Top-Left */}
            <a
              href="https://artydevs.com"
              target="_blank"
              rel="noreferrer"
              className="about__card"
              style={{ ...cardBase, background: 'linear-gradient(180deg, #94bdf7 0%, #b4bdf7 100%)' }}
            >
              <div style={{ fontSize: '10rem', fontWeight: 400, letterSpacing: '-0.04em', lineHeight: 0.9 }}>
                LEAD
              </div>
              <div>
                <div style={{ fontSize: 'clamp(2.2rem, 3.2vw, 4.2rem)', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '2.5rem' }}>
                  Projects at ArtyDevs
                </div>
                <div className="btn btn--black" style={{ display: 'inline-flex' }}>
                  <div className="btn__text link-hover">artydevs.com</div>
                </div>
              </div>
            </a>

            {/* Card 2: Top-Right */}
            <div
              className="about__card"
              style={{ ...cardBase, background: 'linear-gradient(180deg, #94bdf7 0%, #b4bdf7 100%)' }}
            >
              <div style={{ fontSize: '10rem', fontWeight: 400, letterSpacing: '-0.04em', lineHeight: 0.9 }}>
                AWARDS 12+
              </div>
              <div>
                <div style={{ fontSize: 'clamp(2.2rem, 3.2vw, 4.2rem)', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '2.5rem' }}>
                  Won with Partners
                </div>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {['FWA', 'CSS DESIGN', 'AWWWARDS'].map((badge) => (
                    <div key={badge} className="btn btn--black btn--none" style={{ display: 'inline-flex' }}>
                      <div className="btn__text link-hover">{badge}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 3: Bottom-Left */}
            <div
              className="about__card"
              style={{ ...cardBase, background: 'linear-gradient(180deg, #b4bdf7 0%, #d4bdf8 100%)' }}
            >
              <div style={{ fontSize: '10rem', fontWeight: 400, letterSpacing: '-0.04em', lineHeight: 0.9 }}>
                98%
              </div>
              <div>
                <div style={{ fontSize: 'clamp(2.2rem, 3.2vw, 4.2rem)', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '2.5rem' }}>
                  Upwork Job Success
                </div>
                <div className="btn btn--black btn--none" style={{ display: 'inline-flex' }}>
                  <div className="btn__text link-hover">TOP RATED</div>
                </div>
              </div>
            </div>

            {/* Card 4: Bottom-Right */}
            <a
              href="https://clutch.co/profile/artydevs"
              target="_blank"
              rel="noreferrer"
              className="about__card"
              style={{ ...cardBase, background: 'linear-gradient(180deg, #b4bdf7 0%, #d4bdf8 100%)' }}
            >
              <div style={{ fontSize: '10rem', fontWeight: 400, letterSpacing: '-0.04em', lineHeight: 0.9 }}>
                I AM HUMAN ツ
              </div>
              <div>
                <div style={{ fontSize: 'clamp(2.2rem, 3.2vw, 4.2rem)', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '2.5rem' }}>
                  I ♡ Code, Humor & Designers
                </div>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {['10+ REVIEWS', 'SATISFIED CUSTOMERS'].map((badge) => (
                    <div key={badge} className="btn btn--black" style={{ display: 'inline-flex' }}>
                      <div className="btn__text link-hover">{badge}</div>
                    </div>
                  ))}
                </div>
              </div>
            </a>
          </div>

          {/* Mission — star-masked overlay revealed through the grid's "+" center */}
          <section 
            className="mission" 
            id="mission" 
          >
            <div className="mission__inner">
              <div style={{ marginBottom: '5rem' }}>
                <FeaturesBar 
                  title="2025" 
                  items={['MY', 'MISSION', 'IS']} 
                  reverse={true}
                />
              </div>

              {/* Giant Typography Lines */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', flex: 1, justifyContent: 'center' }}>
                
                <div style={{ ...missionRow, justifyContent: 'flex-end', color: 'var(--gray)' }}>
                  <span className="mission__text" style={{ display: 'inline-block' }}>Increase</span>
                </div>

                <div style={{ ...missionRow, justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span className="mission__text" style={{ display: 'inline-block', color: 'var(--gray)' }}>Your</span>
                  <div className="mission__text" style={{ position: 'relative', overflow: 'hidden', height: '1em', color: 'var(--pink)' }}>
                    <div className="mission-slide-1" style={{ display: 'block' }}>Design Value</div>
                    <div className="mission-slide-2" style={{ position: 'absolute', top: 0, right: 0, opacity: 0 }}>Design Profit</div>
                  </div>
                </div>

                <div style={{ ...missionRow, justifyContent: 'flex-end', color: 'var(--gray)' }}>
                  <span className="mission__text" style={{ display: 'inline-block' }}>With</span>
                </div>

                <div style={missionRow}>
                  <div className="mission__text" style={{ position: 'relative', overflow: 'hidden', height: '1em', color: 'var(--sky)' }}>
                    <div className="mission-slide-1" style={{ display: 'block' }}>High Standard</div>
                    <div className="mission-slide-2" style={{ position: 'absolute', top: 0, left: 0, opacity: 0 }}>Cost Effective</div>
                  </div>
                </div>

                <div style={{ ...missionRow, justifyContent: 'flex-end', color: 'var(--gray)' }}>
                  <span className="mission__text" style={{ display: 'inline-block' }}>Development</span>
                </div>
              </div>
            </div>
          </section>

        </div>

      </div>

      <style>{`
        .about .mission {
          background-color: var(--black);
        }
        .about .mission__inner {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        @media (min-width: 1024px) {
          .about .mission {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            z-index: 2;
            -webkit-mask-image: url(/images/svg/star.svg);
            mask-image: url(/images/svg/star.svg);
            -webkit-mask-repeat: no-repeat;
            mask-repeat: no-repeat;
            -webkit-mask-position: center;
            mask-position: center;
            -webkit-mask-size: 0%;
            mask-size: 0%;
          }
          .about .mission .mission__text {
            overflow: hidden;
          }
        }
        @media (max-width: 1023px) {
          .about .mission {
            margin-top: 8rem;
          }
          .about__grid {
            grid-template-columns: 1fr !important;
          }
          .about__card {
            min-height: 32rem !important;
            padding: 4rem 3rem !important;
          }
        }
      `}</style>
    </section>
  );
}
