'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import FeaturesBar from './FeaturesBar';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const projects = [
  {
    id: 1,
    title: "JOIN.MYSTIC",
    link: 'https://joinmystic.com',
    video: '/videos/work-video2.mp4',
    bg: '#150c21',
    tags: ['MYSTIC', 'READINGS'],
    year: '©2025',
  },
  {
    id: 2,
    title: 'ailit.rail',
    link: 'https://ailit-rail.webflow.io/',
    video: '/videos/trains.mp4',
    bg: '#e18066',
    tags: ['SPEED', 'COMFORT'],
    year: '©2025',
  },
  {
    id: 3,
    title: 'toggle.studio',
    link: 'https://www.toggle-studio.com/',
    video: '/videos/toggle.mp4',
    bg: '#ffffff',
    tags: ['THINK', 'DIFFERENT'],
    year: '©2025',
  },
];

export default function WorksSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
    if (!isDesktop) return;

    const items = gsap.utils.toArray('.works__item');
    const container = containerRef.current;
    if (!container || !sectionRef.current) return;

    // Pinned Horizontal Scroll
    const horizontalTween = gsap.to(items, {
      xPercent: -100 * (items.length - 1),
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        pin: true,
        scrub: 0.7,
        end: () => `+=${window.innerWidth * 2.5}`,
        invalidateOnRefresh: true,
      },
    });

    // Per-item card scale/parallax driven by the horizontal container animation
    items.forEach((item) => {
      const card = (item as HTMLElement).querySelector('.works__card');
      if (!card) return;
      gsap.fromTo(
        card,
        { scale: 0.82, rotate: 2 },
        {
          scale: 1,
          rotate: 0,
          ease: 'none',
          scrollTrigger: {
            containerAnimation: horizontalTween,
            trigger: item as HTMLElement,
            start: 'left 90%',
            end: 'left 20%',
            scrub: true,
          },
        }
      );
    });

    // Scrub-driven marquee strip after the works list
    gsap.fromTo(
      '.works__marquee-inner',
      { x: '6%' },
      {
        x: '-6%',
        ease: 'none',
        scrollTrigger: {
          trigger: '.works__marquee',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      }
    );

    // Mouse movement title float
    const titles = gsap.utils.toArray('.works__title-link');
    const handleMouseMove = (e: MouseEvent) => {
      const progress = (e.clientX / window.innerWidth - 0.5) * 40;
      titles.forEach((title: any) => {
        gsap.to(title, {
          x: progress,
          ease: 'power2.out',
          duration: 0.6,
          overwrite: 'auto',
        });
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);

  }, { scope: sectionRef });

  return (
    <section 
      ref={sectionRef} 
      id="works" 
      style={{ 
        position: 'relative', 
        zIndex: 1, 
        overflow: 'hidden',
        backgroundColor: 'var(--black)'
      }}
    >
      <div 
        ref={containerRef}
        className="works__list" 
        style={{ 
          display: 'flex', 
          width: '300vw',
          height: '100vh',
          flexWrap: 'nowrap',
        }}
      >
        {projects.map((p) => (
          <div 
            key={p.id} 
            className="works__item"
            style={{
              height: '100vh',
              width: '100vw',
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
              backgroundColor: p.bg,
              padding: '6rem 8rem 4rem',
            }}
          >
            {/* Top Project Link Header */}
            <div style={{ textAlign: 'center', width: '100%', zIndex: 3 }}>
              <a
                href={p.link}
                target="_blank"
                rel="noreferrer"
                className="works__title-link"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  color: p.id === 3 ? 'var(--black)' : 'var(--white)',
                  fontSize: 'clamp(5rem, 10vw, 33.5rem)',
                  fontWeight: 400,
                  textTransform: 'uppercase',
                  letterSpacing: '-0.03em',
                  textDecoration: 'none',
                  transition: 'opacity 0.25s ease',
                  lineHeight: 0.8,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                <span>{p.title}</span>
                <span style={{ fontSize: '1.2em' }}>↗</span>
              </a>
            </div>

            {/* Full-bleed project media covering the whole slide */}
            <div
              className="works__card"
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 1,
                overflow: 'hidden',
              }}
            >
              <video 
                src={p.video} 
                autoPlay 
                muted 
                loop 
                playsInline 
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              {/* Soft vignette so titles/tags stay legible */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.35) 100%)',
                }}
              />
            </div>

            {/* Bottom Metadata Tags Bar */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                color: p.id === 3 ? 'var(--black)' : 'var(--white)',
                fontSize: '1.6rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                zIndex: 3,
              }}
            >
              <div style={{ display: 'flex', gap: '5rem' }}>
                {p.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              <div>{p.year}</div>
            </div>

          </div>
        ))}
      </div>

      <div className="works__marquee center-wrap" style={{ position: 'relative', zIndex: 10, backgroundColor: 'var(--black)', padding: '5rem 0', overflow: 'hidden' }}>
        <div className="works__marquee-inner">
          <FeaturesBar 
            title="©2025" 
            items={['THINK', 'DIFFERENT', 'STAY HUNGRY']} 
            reverse={true}
          />
        </div>
      </div>
      
      <style>{`
        @media (max-width: 1023px) {
          .works__list {
            width: 100% !important;
            height: auto !important;
            flex-direction: column !important;
          }
          .works__item {
            width: 100vw !important;
            height: auto !important;
            min-height: 85vh !important;
            padding: 4rem 2rem !important;
          }
        }
      `}</style>
    </section>
  );
}
