'use client';

import { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const PORTRAIT_SRC = '/images/shahd-portrait.webp';

/** Distance from her alpha bounding-box centre to her centre of mass. */
const OPTICAL_SHIFT = '-7.9%';

/**
 * Grade layers are clipped to the portrait's own alpha channel, so the light
 * and the falloff land on her and never on the background behind her.
 */
const GRADE_LAYER: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  maskImage: `url(${PORTRAIT_SRC})`,
  WebkitMaskImage: `url(${PORTRAIT_SRC})`,
  maskSize: '100% 100%',
  WebkitMaskSize: '100% 100%',
  maskRepeat: 'no-repeat',
  WebkitMaskRepeat: 'no-repeat',
};

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;

    // Subtle idle float. It has to be symmetric around 0: a one-way tween
    // would park the portrait permanently off-centre (the old `x: -6` did
    // exactly that). Slow and small, just enough to stop her reading as a
    // flat sticker pasted on the gradient.
    gsap.fromTo('.main-screen__image',
      { x: -4 },
      { x: 4, duration: 9, ease: 'sine.inOut', repeat: -1, yoyo: true });

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

      {/* Portrait — layered IN FRONT of the titles, graded into the scene.

          Centring: her alpha bounding box is centred in the asset, but the
          alpha-weighted centroid sits 40px (7.9% of the frame) to the RIGHT
          of it — the robe flares left while the body mass is right — so
          box-centring made her read as offset. OPTICAL_SHIFT corrects to the
          centre of mass. It is a percentage, not px, so it holds at every
          viewport height as the image scales.

          Structure: the outer element is full-width and centres its child
          with flex instead of `left: 50% / translateX(-50%)`. That matters
          because GSAP animates x/scale on this element — with a -50% base
          transform the two fight over the same property. */}
      <div
        className="main-screen__image"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '86vh',
          display: 'flex',
          justifyContent: 'center',
          zIndex: 4,
          pointerEvents: 'none',
        }}
      >
        <div
          className="hero-portrait"
          style={{
            position: 'relative',
            height: '100%',
            transform: `translateX(${OPTICAL_SHIFT})`,
            // Keeps the blend layers below acting on the portrait only,
            // instead of reaching through to the hero gradient.
            isolation: 'isolate',
          }}
        >
          <Image
            src={PORTRAIT_SRC}
            alt="Shahd Khairy — Full Stack Developer"
            width={509}
            height={839}
            style={{
              height: '100%',
              width: 'auto',
              objectFit: 'contain',
              display: 'block',
              // Studio-lit cutout pulled toward the scene's cooler, darker
              // key, plus a real cast shadow (drop-shadow follows the alpha
              // channel, so it traces her silhouette rather than a box).
              filter:
                'saturate(0.86) contrast(1.05) brightness(0.9) drop-shadow(0 1.6rem 3rem rgba(0, 0, 0, 0.5))',
            }}
            priority
          />

          {/* Scene light: violet from above, blue bouncing from below —
              the same two hues as the hero gradient. soft-light keeps her
              skin tones intact instead of staining them. */}
          <div aria-hidden style={{ ...GRADE_LAYER, mixBlendMode: 'soft-light', opacity: 0.42,
            background:
              'linear-gradient(180deg, hsla(265, 95%, 70%, 0.9) 0%, hsla(265, 70%, 62%, 0.3) 14%, rgba(12, 12, 12, 0) 30%, rgba(12, 12, 12, 0) 68%, hsla(212, 95%, 60%, 0.35) 88%, hsla(212, 95%, 60%, 0.7) 100%)',
          }} />

          {/* Rim light down the lit edge, matching the glow above her. */}
          <div aria-hidden style={{ ...GRADE_LAYER, mixBlendMode: 'screen', opacity: 0.2,
            background:
              'radial-gradient(ellipse 60% 30% at 62% 1%, hsla(275, 100%, 84%, 0.5) 0%, rgba(0, 0, 0, 0) 70%)',
          }} />

          {/* Atmospheric falloff: she dissolves into the base of the frame
              instead of ending on the hard cut of the cutout. */}
          <div aria-hidden style={{ ...GRADE_LAYER, opacity: 1,
            background:
              'linear-gradient(to top, #0c0c0c 0%, rgba(12, 12, 12, 0.88) 8%, rgba(12, 12, 12, 0.55) 20%, rgba(12, 12, 12, 0.22) 34%, rgba(12, 12, 12, 0) 50%)',
          }} />
        </div>
      </div>

      {/* Titles — deliberately BEHIND the portrait (zIndex 3 < 4) */}
      <div 
        className="center-wrap" 
        style={{ 
          position: 'relative', 
          zIndex: 3, 
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

      </div>

      {/* Bottom Metadata Bar — a direct child of the section, and stacked
          ABOVE the portrait (zIndex 5 > 4) so the ticker stays readable
          instead of being buried behind her shoulder. A nested z-index
          could not do this: the titles wrapper sets zIndex 3, which opens a
          stacking context its children can never escape. */}
      <div 
        className="center-wrap main-screen__bottom" 
        style={{
          position: 'relative',
          zIndex: 5,
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
