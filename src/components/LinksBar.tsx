'use client';

import { useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const links = [
  { label: 'WhatsApp', href: 'https://wa.me/201142657362' },
  { label: 'LinkedIn Account', href: 'https://www.linkedin.com/in/shahd-khairy/' },
  { label: 'shahdkhairy2026@gmail.com', href: 'mailto:shahdkhairy2026@gmail.com' },
];

export default function LinksBar() {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  useGSAP(() => {
    gsap.fromTo(
      '.links-bar__item',
      { yPercent: 110 },
      {
        yPercent: 0,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom 70%',
          scrub: true,
        },
      }
    );
  }, { scope: sectionRef });

  return (
    <section 
      ref={sectionRef}
      style={{ 
        backgroundColor: 'var(--black)',
        paddingTop: '6rem',
        paddingBottom: '6rem',
      }}
    >
      <div 
        className="center-wrap" 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: '1rem',
          width: '100%',
          textAlign: 'center',
        }}
      >
        {links.map((link, idx) => (
          <span key={link.label} style={{ display: 'block', overflow: 'hidden', maxWidth: '100%' }}>
            <a
              className="links-bar__item"
              href={link.href}
              target={link.href.startsWith('mailto:') ? undefined : '_blank'}
              rel={link.href.startsWith('mailto:') ? undefined : 'noreferrer'}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{
                display: 'block',
                fontSize: 'clamp(2.6rem, 9.5vw, 13.5rem)',
                lineHeight: 1.05,
                fontWeight: 500,
                letterSpacing: '-0.03em',
                color: hoveredIdx === idx ? 'var(--white)' : 'var(--gray)',
                textDecoration: 'none',
                transition: 'color 0.3s ease',
                fontFamily: 'inherit',
                wordBreak: 'break-word',
              }}
            >
              {link.label}
            </a>
          </span>
        ))}
      </div>
    </section>
  );
}
