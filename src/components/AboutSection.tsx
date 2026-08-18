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
    // Mission statement lines rise out of their masks, staggered
    .fromTo('.about .mission__text',
      { y: '110%' },
      { y: '0%', delay: 0.25, duration: 0.5, stagger: { amount: 0.5 } }, 0)
    // Supporting line fades up, proof chips pop in one by one
    .fromTo('.mission__support',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, delay: 0.65, duration: 0.25 }, 0)
    .fromTo('.mission__chip',
      { scale: 0.6, opacity: 0 },
      { scale: 1, opacity: 1, delay: 0.75, duration: 0.2, stagger: 0.08, ease: 'back.out(2)' }, 0);

    // Continuous word roller: VALUE -> PROFIT -> IMPACT -> (loop)
    const roller = gsap.timeline({ repeat: -1 });
    [-100, -200, -300].forEach((yp) => {
      roller.to('.mission__roller-track', { yPercent: yp, duration: 0.55, ease: 'power3.inOut', delay: 1.1 });
    });
    roller.set('.mission__roller-track', { yPercent: 0 });

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
            title="MERN STACK" 
            items={['REST APIS', '/JWT-AUTH', '//CLEAN CODE']} 
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
            {/* Card 1: Top-Left — MERN training */}
            <a
              href="https://www.linkedin.com/in/shahd-khairy/"
              target="_blank"
              rel="noreferrer"
              className="about__card"
              style={{ ...cardBase, background: 'linear-gradient(180deg, #94bdf7 0%, #b4bdf7 100%)' }}
            >
              <div style={{ fontSize: '10rem', fontWeight: 400, letterSpacing: '-0.04em', lineHeight: 0.9 }}>
                MERN
              </div>
              <div>
                <div style={{ fontSize: 'clamp(2.2rem, 3.2vw, 4.2rem)', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '2.5rem' }}>
                  Full Stack at Digilians · MCIT
                </div>
                <div className="btn btn--black" style={{ display: 'inline-flex' }}>
                  <div className="btn__text link-hover">AI-BASED DIPLOMA</div>
                </div>
              </div>
            </a>

            {/* Card 2: Top-Right — certificates */}
            <div
              className="about__card"
              style={{ ...cardBase, background: 'linear-gradient(180deg, #94bdf7 0%, #b4bdf7 100%)' }}
            >
              <div style={{ fontSize: '10rem', fontWeight: 400, letterSpacing: '-0.04em', lineHeight: 0.9 }}>
                CERTS 3+
              </div>
              <div>
                <div style={{ fontSize: 'clamp(2.2rem, 3.2vw, 4.2rem)', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '2.5rem' }}>
                  Certified & Cloud-Ready
                </div>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {['META FRONT-END', 'AWS CLOUD', 'DEVOPS CI/CD'].map((badge) => (
                    <div key={badge} className="btn btn--black btn--none" style={{ display: 'inline-flex' }}>
                      <div className="btn__text link-hover">{badge}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 3: Bottom-Left — shipped projects */}
            <div
              className="about__card"
              style={{ ...cardBase, background: 'linear-gradient(180deg, #b4bdf7 0%, #d4bdf8 100%)' }}
            >
              <div style={{ fontSize: '10rem', fontWeight: 400, letterSpacing: '-0.04em', lineHeight: 0.9 }}>
                6+
              </div>
              <div>
                <div style={{ fontSize: 'clamp(2.2rem, 3.2vw, 4.2rem)', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '2.5rem' }}>
                  Full-Stack Projects Built
                </div>
                <div className="btn btn--black btn--none" style={{ display: 'inline-flex' }}>
                  <div className="btn__text link-hover">REACT · NODE · MONGODB</div>
                </div>
              </div>
            </div>

            {/* Card 4: Bottom-Right — human card */}
            <a
              href="https://github.com/hazemelerefey/neuroscope"
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
                  I ♡ Clean APIs, 3D & Teamwork
                </div>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {['AYAIR 2026', 'NEUROSCOPE'].map((badge) => (
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
                  title="2026" 
                  items={['MY', 'MISSION', 'IS']} 
                  reverse={true}
                />
              </div>

              {/* Mission statement — one clear idea: Design in. Profit out. */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', flex: 1, justifyContent: 'center' }}>

                {/* Line 1: DESIGN IN. */}
                <div style={{ ...missionRow, color: 'var(--gray)' }}>
                  <span className="mission__text" style={{ display: 'inline-block' }}>Design in.</span>
                </div>

                {/* Line 2: [VALUE / PROFIT / IMPACT] OUT. — live roller */}
                <div style={{ ...missionRow, alignItems: 'baseline', gap: '0.35em' }}>
                  <span
                    className="mission__text"
                    style={{
                      display: 'inline-block',
                      overflow: 'hidden',
                      height: '1em',
                      color: 'var(--pink)',
                      verticalAlign: 'bottom',
                    }}
                  >
                    <span className="mission__roller-track" style={{ display: 'flex', flexDirection: 'column' }}>
                      {['Value', 'Profit', 'Impact', 'Value'].map((w, i) => (
                        <span key={i} style={{ height: '1em', lineHeight: 1, display: 'block' }}>{w}</span>
                      ))}
                    </span>
                  </span>
                  <span className="mission__text" style={{ display: 'inline-block', color: 'var(--pink)' }}>out.</span>
                </div>

                {/* Line 3: THAT'S MY MISSION. */}
                <div style={{ ...missionRow, color: 'var(--sky)' }}>
                  <span className="mission__text" style={{ display: 'inline-block' }}>That&apos;s my mission.</span>
                </div>

                {/* Supporting line + proof chips */}
                <div
                  className="mission__support"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    gap: '3rem',
                    marginTop: '3.5rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <p
                    style={{
                      maxWidth: '46rem',
                      fontSize: '1.8rem',
                      lineHeight: 1.45,
                      color: 'var(--gray)',
                      textTransform: 'none',
                      letterSpacing: 'normal',
                      fontWeight: 500,
                      margin: 0,
                    }}
                  >
                    Every pixel you design, engineered to perform — shipped clean,
                    on time, and built to earn its keep.
                  </p>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    {['HIGH STANDARD', 'COST-EFFECTIVE', 'HASSLE-FREE'].map((chip) => (
                      <span
                        key={chip}
                        className="mission__chip"
                        style={{
                          padding: '1rem 2rem',
                          borderRadius: '10rem',
                          border: '1px solid rgba(180, 195, 217, 0.5)',
                          fontSize: '1.3rem',
                          fontWeight: 700,
                          letterSpacing: '0.06em',
                          color: 'var(--gray)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
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
