'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SplitLetters from './SplitLetters';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const letters = footerRef.current?.querySelectorAll('.footer-title .split-letter');
    if (!letters?.length) return;
    gsap.fromTo(
      letters,
      { yPercent: 110 },
      {
        yPercent: 0,
        stagger: 0.03,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.footer-title',
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: 2,
        },
      }
    );
  }, { scope: footerRef });

  return (
    <footer
      ref={footerRef}
      id="footer"
      style={{
        backgroundColor: 'var(--black)',
        color: 'var(--gray)',
        paddingTop: '6rem',
        paddingBottom: '4rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <div className="center-wrap" style={{ width: '100%' }}>
        
        {/* Giant Footer Title */}
        <h2 
          className="simple-title footer-title" 
          style={{ 
            fontSize: 'clamp(5rem, 15.5vw, 21.5rem)', 
            lineHeight: 0.85, 
            textAlign: 'center',
            textTransform: 'uppercase',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: 'var(--white)',
            marginBottom: '4rem',
            display: 'block',
          }}
        >
          <span className="split-line">
            <SplitLetters text="FRONTEND WOMAN" />
          </span>
        </h2>

        {/* Footer Bottom Row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '1.4rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
            flexWrap: 'wrap',
            gap: '2.5rem',
            paddingTop: '2rem',
          }}
        >
          {/* Left: Email */}
          <a
            href="mailto:shahd@frontend-w.com"
            className="wave-link"
            style={{ color: 'var(--gray)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--gray)')}
          >
            <SplitLetters text="SHAHD@FRONTEND-W.COM" />
          </a>

          {/* Center: Nav links */}
          <nav style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
            {[
              { label: 'ABOUT ME', href: '#about' },
              { label: 'WHY ME', href: '#mission' },
              { label: 'PROJECTS', href: '#works' },
              { label: 'SAVE MONEY', href: '#calc' },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="wave-link"
                style={{ color: 'var(--gray)', transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--gray)')}
              >
                <SplitLetters text={link.label} />
              </a>
            ))}
          </nav>

          {/* Right: Credits */}
          <div style={{ display: 'flex', gap: '0.5rem', color: 'var(--gray)' }}>
            <span>DESIGNED BY</span>
            <a
              href="https://nadnova.com/"
              target="_blank"
              rel="noreferrer"
              className="wave-link"
              style={{ color: '#fff' }}
            >
              <SplitLetters text="NADNOVA" />
            </a>
            <span>x</span>
            <a
              href="https://www.behance.net/nowordstudio"
              target="_blank"
              rel="noreferrer"
              className="wave-link"
              style={{ color: '#fff' }}
            >
              <SplitLetters text="NOWORD" />
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1023px) {
          #footer .center-wrap > div {
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
            gap: 2rem !important;
          }
          #footer nav {
            justify-content: center !important;
            gap: 1.5rem !important;
          }
        }
      `}</style>
    </footer>
  );
}
