'use client';

import { useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { RESUME_URL } from '@/lib/resume';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function CalcSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [rate, setRate] = useState(45);
  const [hours, setHours] = useState(80);

  // Shahd's fixed MENA full-stack rate (USD/hour)
  const SHAHD_RATE = 20;

  useGSAP(() => {
    // Giant headline words rise out of their masks, scrubbed by scroll
    gsap.fromTo(
      '.calc__word',
      { yPercent: 110 },
      {
        yPercent: 0,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'center center',
          scrub: true,
        },
      }
    );

    // Cards fade-slide in
    gsap.fromTo(
      '.calc-grid > div',
      { y: 90, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.calc-grid',
          start: 'top 92%',
          end: 'top 55%',
          scrub: 1,
        },
      }
    );
  }, { scope: sectionRef });

  // Real savings math: (what you pay now − Shahd's MENA rate) × hours × 12
  const calculatedSavings = Math.round(
    Math.max(0, (rate - SHAHD_RATE) * hours * 12)
  );

  const wordMask: React.CSSProperties = { display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' };
  const word: React.CSSProperties = { display: 'inline-block' };

  return (
    <section 
      ref={sectionRef}
      id="calc" 
      style={{ 
        backgroundColor: 'var(--black)',
        color: 'var(--white)',
        paddingTop: '10rem',
        paddingBottom: '12rem',
      }}
    >
      <div className="center-wrap" style={{ width: '100%' }}>
        
        {/* Transitional Giant Headline — scattered word collage */}
        <div style={{ marginBottom: '8rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Row 1: Let's ... Turn ... 10,560 */}
          <div 
            className="calc__hrow"
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'baseline',
              fontSize: 'clamp(4.5rem, 12vw, 17rem)', 
              fontWeight: 400, 
              lineHeight: 0.85, 
              letterSpacing: '-0.03em',
            }}
          >
            <span style={{ ...wordMask, color: 'var(--gray)' }}><span className="calc__word" style={word}>Let&apos;s</span></span>
            <span style={{ ...wordMask, color: 'var(--gray)' }}><span className="calc__word" style={word}>Turn</span></span>
            <span style={{ ...wordMask, color: 'var(--pink)' }}><span className="calc__word" style={word}>{calculatedSavings.toLocaleString()}</span></span>
          </div>

          {/* Row 2: USD ... Loss ... Into */}
          <div 
            className="calc__hrow"
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'baseline',
              paddingLeft: '6vw',
              paddingRight: '14vw',
              fontSize: 'clamp(4.5rem, 12vw, 17rem)', 
              fontWeight: 400, 
              lineHeight: 0.85, 
              letterSpacing: '-0.03em',
            }}
          >
            <span style={{ ...wordMask, color: 'var(--pink)' }}><span className="calc__word" style={word}>USD</span></span>
            <span style={{ ...wordMask, color: 'var(--pink)' }}><span className="calc__word" style={word}>Loss</span></span>
            <span style={{ ...wordMask, color: 'var(--gray)' }}><span className="calc__word" style={word}>Into</span></span>
          </div>

          {/* Row 3: Profit ... With */}
          <div 
            className="calc__hrow"
            style={{ 
              display: 'flex', 
              gap: '6vw',
              alignItems: 'baseline',
              fontSize: 'clamp(4.5rem, 12vw, 17rem)', 
              fontWeight: 400, 
              lineHeight: 0.85, 
              letterSpacing: '-0.03em',
            }}
          >
            <span style={{ ...wordMask, color: 'var(--sky)' }}><span className="calc__word" style={word}>Profit</span></span>
            <span style={{ ...wordMask, color: 'var(--gray)' }}><span className="calc__word" style={word}>With</span></span>
          </div>

          {/* Row 4: Cost-effective Collab */}
          <div 
            className="calc__hrow"
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'baseline',
              fontSize: 'clamp(4.5rem, 12vw, 17rem)', 
              fontWeight: 400, 
              lineHeight: 0.85, 
              letterSpacing: '-0.03em',
              color: 'var(--sky)',
            }}
          >
            <span style={wordMask}><span className="calc__word" style={word}>Cost-effective</span></span>
            <span style={wordMask}><span className="calc__word" style={word}>Collab</span></span>
          </div>
        </div>

        {/* 3 Calc Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '2rem',
            marginBottom: '4rem',
          }}
          className="calc-grid"
        >
          {/* Card 1: Rate */}
          <div
            style={{
              backgroundColor: '#121214',
              borderRadius: '2rem',
              padding: '4.5rem 4rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '38rem',
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--gray)', marginBottom: '1.5rem' }}>
                RATE IN USD
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 500, lineHeight: 1.25, color: '#e0e0e0' }}>
                The hourly rate you currently pay for full-stack development
              </div>
            </div>

            <div>
              {/* Range Slider */}
              <input
                type="range"
                className="calc-range"
                min="15"
                max="100"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                style={{
                  width: '100%',
                  accentColor: 'var(--sky)',
                  cursor: 'pointer',
                  marginBottom: '2.5rem',
                }}
              />
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.8rem' }}>
                <span style={{ fontSize: 'clamp(4.5rem, 5.5vw, 7.5rem)', fontWeight: 800, lineHeight: 1, letterSpacing: '-0.03em', color: 'var(--white)' }}>
                  {rate}
                </span>
                <span style={{ fontSize: '1.8rem', fontWeight: 600, color: 'var(--gray)', textTransform: 'uppercase' }}>
                  USD/HR
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Time */}
          <div
            style={{
              backgroundColor: '#121214',
              borderRadius: '2rem',
              padding: '4.5rem 4rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '38rem',
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--gray)', marginBottom: '1.5rem' }}>
                TIME
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 500, lineHeight: 1.25, color: '#e0e0e0' }}>
                Your average required development hours per month
              </div>
            </div>

            <div>
              {/* Range Slider */}
              <input
                type="range"
                className="calc-range"
                min="20"
                max="240"
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                style={{
                  width: '100%',
                  accentColor: 'var(--sky)',
                  cursor: 'pointer',
                  marginBottom: '2.5rem',
                }}
              />
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.8rem' }}>
                <span style={{ fontSize: 'clamp(4.5rem, 5.5vw, 7.5rem)', fontWeight: 800, lineHeight: 1, letterSpacing: '-0.03em', color: 'var(--white)' }}>
                  {hours}
                </span>
                <span style={{ fontSize: '1.8rem', fontWeight: 600, color: 'var(--gray)', textTransform: 'uppercase' }}>
                  HOURS
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Missed Opportunities */}
          <div
            style={{
              backgroundColor: '#121214',
              borderRadius: '2rem',
              padding: '4.5rem 4rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '38rem',
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--gray)', marginBottom: '1.5rem' }}>
                YOUR YEARLY SAVINGS
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 500, lineHeight: 1.25, color: '#e0e0e0', marginBottom: '1.5rem' }}>
                What you keep every year by switching to my MENA rate
              </div>
              <span
                style={{
                  display: 'inline-block',
                  padding: '0.8rem 1.8rem',
                  borderRadius: '10rem',
                  border: '1px solid rgba(148, 189, 247, 0.4)',
                  fontSize: '1.3rem',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  color: 'var(--sky)',
                }}
              >
                MY RATE — ${SHAHD_RATE}/HR FIXED
              </span>
            </div>

            <div>
              <div style={{ fontSize: '1.4rem', color: 'var(--gray)', marginBottom: '1rem', fontWeight: 500 }}>
                (${rate} − ${SHAHD_RATE}) × {hours}h × 12 months =
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: 'clamp(4rem, 5vw, 6.8rem)', fontWeight: 800, lineHeight: 1, letterSpacing: '-0.03em', color: 'var(--white)' }}>
                  ${calculatedSavings.toLocaleString()}
                </span>
                <span style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--gray)', textTransform: 'uppercase' }}>
                  ANNUALLY
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom résumé download */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <a
            href={RESUME_URL}
            download
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.8rem 6rem',
              borderRadius: '10rem',
              border: '1.5px solid rgba(255, 255, 255, 0.3)',
              backgroundColor: 'transparent',
              color: 'var(--white)',
              fontSize: '1.8rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
              cursor: 'pointer',
              textDecoration: 'none',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.color = '#000000';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--white)';
            }}
          >
            Download CV ↗
          </a>
        </div>

      </div>

      <style>{`
        @media (max-width: 1023px) {
          .calc-grid {
            grid-template-columns: 1fr !important;
          }
          .calc-grid > div {
            min-height: 28rem !important;
            padding: 3rem 2.5rem !important;
          }
          .calc__hrow {
            font-size: clamp(2.6rem, 9vw, 4.5rem) !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
            flex-wrap: wrap;
            gap: 1.5rem !important;
            justify-content: flex-start !important;
          }
        }
      `}</style>
    </section>
  );
}
