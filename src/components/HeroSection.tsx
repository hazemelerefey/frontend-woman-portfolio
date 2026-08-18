'use client';

import { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;

    // Subtle idle drift of the model
    gsap.to('.main-screen__image', { x: -6, duration: 6 });

    // === Layered exit ===
    // Phase 1: titles split apart and FADE, nav + bottom bar fade — the
    //          portrait is left alone on the gradient, gently zooming in.
    // Phase 2: the portrait itself fades out while still zooming.
    // Phase 3: the hero (now an empty dimmed gradient) stays pinned and the
    //          About section scrolls over it — clean layer over layer.
    gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'bottom bottom',
        end: '+=900',
        scrub: 1,
        pin: true,
        pinSpacing: false,
      }
    })
    // Phase 1 — texts fade (titles split softly while fading)
    .to('.main-screen__title-line-1', { xPercent: -10, opacity: 0, ease: 'power1.out', duration: 0.3 }, 0)
    .to('.main-screen__title-line-2', { xPercent: 10, opacity: 0, ease: 'power1.out', duration: 0.3 }, 0)
    .to('.main-screen__nav', { opacity: 0, duration: 0.2 }, 0)
    .to('.main-screen__bottom', { opacity: 0, duration: 0.25 }, 0)
    // Portrait solo moment — slow continuous zoom across the whole pin
    .to('.main-screen__image', { scale: 1.12, ease: 'none', duration: 1 }, 0)
    // Phase 2 — portrait fades out to hidden
    .to('.main-screen__image', { opacity: 0, ease: 'power1.inOut', duration: 0.35 }, 0.45)
    .to('.main-screen__gsap-bg', { opacity: 0.35, duration: 0.4 }, 0.5)
    // Phase 3 — About content settles in as its layer rises over the hero
    .fromTo('.about .simple-title, .about .features',
      { opacity: 0 },
      { opacity: 1, duration: 0.3 }, 0.6)
    .fromTo('.about__card:nth-child(2n-1)',
      { opacity: 0, y: 80 },
      { opacity: 1, y: 0, duration: 0.3 }, 0.6)
    .fromTo('.about__card:nth-child(2n)',
      { opacity: 0, y: 80 },
      { opacity: 1, y: 0, duration: 0.3 }, 0.7);

  });

  return (
    <section 
      ref={sectionRef} 
      className="main-screen" 
      id="home" 
      style={{ 
        position: 'relative', 
        minHeight: '100vh', 
        overflow: 'hidden', 
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingTop: '6rem',
        paddingBottom: '3rem'
      }}
    >
      {/* Background with user-loved pastel gradient */}
      <div 
        className="main-screen__gsap-bg" 
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          background: `
            radial-gradient(ellipse 65% 65% at 50% -20%, hsl(265, 100%, 78%) 0%, hsla(265, 100%, 78%, 0.8) 18%, hsla(265, 100%, 78%, 0.55) 36%, hsla(265, 100%, 78%, 0.35) 54%, hsla(265, 100%, 78%, 0.2) 72%, hsla(265, 100%, 78%, 0.1) 88%, rgba(12, 12, 12, 0) 100%), 
            radial-gradient(ellipse 65% 65% at 50% 120%, hsl(210, 100%, 62%) 0%, hsla(210, 100%, 62%, 0.8) 18%, hsla(210, 100%, 62%, 0.55) 36%, hsla(210, 100%, 62%, 0.35) 54%, hsla(210, 100%, 62%, 0.2) 72%, hsla(210, 100%, 62%, 0.1) 88%, rgba(12, 12, 12, 0) 100%), 
            #0c0c0c`
        }}
      />

      {/* Grain overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`,
          backgroundSize: '200px 200px',
          opacity: 0.18,
          mixBlendMode: 'overlay',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Centered Woman Cutout Model — layered IN FRONT of the title */}
      <div 
        className="main-screen__image" 
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          height: '86vh',
          width: 'auto',
          zIndex: 4,
          pointerEvents: 'none'
        }}
      >
        <Image 
          src="/images/woman2.webp" 
          alt="Shahd Khairy — Full Stack Developer" 
          width={800} 
          height={1200}
          style={{ height: '100%', width: 'auto', objectFit: 'contain' }}
          priority
        />
      </div>

      {/* Hero Content */}
      <div 
        className="center-wrap" 
        style={{ 
          position: 'relative', 
          zIndex: 3, 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between', 
          flex: 1,
          width: '100%',
        }}
      >
        {/* Main Title Group (FRONTEND + Subnav + WOMAN) — full-bleed backdrop */}
        <div style={{ marginTop: '4vh', width: '100%' }}>
          {/* Line 1: FRONTEND */}
          <h1 
            className="main-screen__title-line-1" 
            style={{
              fontSize: 'clamp(5rem, 18.5vw, 26rem)',
              lineHeight: 0.78,
              letterSpacing: '-0.03em',
              color: 'var(--white)',
              textShadow: '0 0.4rem 6rem rgba(0, 0, 0, 0.45)',
              fontWeight: 800,
              textTransform: 'uppercase',
              margin: 0,
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            {'FULLSTACK'.split('').map((c, i) => (
              <span key={i} style={{ display: 'inline-block' }}>{c}</span>
            ))}
          </h1>

          {/* Inline Navigation Bar between FRONTEND and WOMAN */}
          <nav 
            className="main-screen__nav"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              maxWidth: '120rem',
              margin: '1.2rem auto',
              padding: '0 2rem',
            }}
          >
            {[
              { label: 'ABOUT ME', href: '#about' },
              { label: 'WHY ME', href: '#mission' },
              { label: 'PROJECTS', href: '#works' },
              { label: 'APPROACH', href: '#compare' },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  color: 'var(--white)',
                  textDecoration: 'none',
                  letterSpacing: '0.02em',
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.6')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                {item.label}
              </a>
            ))}

            <a
              href="#calc"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '1.5rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                color: 'var(--white)',
                textDecoration: 'none',
                letterSpacing: '0.02em',
              }}
            >
              <span>SAVE MONEY</span>
              <span style={{ fontSize: '1.8rem', lineHeight: 1 }}>↗</span>
            </a>
          </nav>

          {/* Line 2: WOMAN */}
          <h1 
            className="main-screen__title-line-2" 
            style={{
              fontSize: 'clamp(5rem, 18.5vw, 26rem)',
              lineHeight: 0.78,
              letterSpacing: '-0.03em',
              color: 'var(--white)',
              textShadow: '0 0.4rem 6rem rgba(0, 0, 0, 0.45)',
              fontWeight: 800,
              textTransform: 'uppercase',
              margin: 0,
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            {'WOMAN'.split('').map((c, i) => (
              <span key={i} style={{ display: 'inline-block' }}>{c}</span>
            ))}
          </h1>
        </div>

        {/* Bottom Metadata Bar */}
        <div 
          className="main-screen__bottom" 
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            color: 'var(--white)',
            fontSize: '1.4rem',
            textTransform: 'uppercase',
            fontWeight: 600,
            letterSpacing: '0.02em',
            marginTop: 'auto',
            paddingTop: '3rem',
          }}
        >
          {/* Left: Origin */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span>CAIRO, EGYPT — ORIGIN</span>
          </div>

          {/* Center: Position (marquee) */}
          <div className="main-screen__marquee marquee" style={{ maxWidth: '34rem', textTransform: 'none' }}>
            <div className="marquee__track" style={{ fontSize: '1.8rem', lineHeight: 1.1 }}>
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className="marquee__item">
                  <span style={{ fontWeight: 600 }}>React &amp; Node.js</span>
                  <span style={{ fontWeight: 400, opacity: 0.85 }}>for modern products</span>
                  <span style={{ opacity: 0.4 }}>—</span>
                </span>
              ))}
            </div>
          </div>

          {/* Right: Tech stack */}
          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
            <span>MERN STACK</span>
            <span style={{ opacity: 0.6 }}>THREE.JS & GSAP</span>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1023px) {
          .main-screen__nav {
            display: none !important;
          }
          .main-screen__bottom {
            flex-direction: column !important;
            align-items: center !important;
            gap: 1.5rem !important;
            text-align: center !important;
          }
          .main-screen__image {
            height: 65vh !important;
          }
        }
      `}</style>
    </section>
  );
}
