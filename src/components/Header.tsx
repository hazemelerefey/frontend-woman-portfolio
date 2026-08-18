'use client';

import { useState, useEffect } from 'react';
import LogoMark from './LogoMark';
import { RESUME_URL } from '@/lib/resume';

interface HeaderProps {
  onMenuOpen: () => void;
}

export default function Header({ onMenuOpen }: HeaderProps) {
  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsFixed(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`header ${isFixed ? 'header--fixed header--black' : ''}`}
      style={{
        paddingTop: isFixed ? '2rem' : '3rem',
        position: isFixed ? 'fixed' : 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 98,
        mixBlendMode: isFixed ? 'normal' : 'difference',
        transition: 'all 0.5s',
        backgroundColor: isFixed ? '#000' : 'transparent',
        boxShadow: isFixed ? '0px 1px 36px 13px rgba(0,0,0,0.03)' : 'none',
      }}
    >
      <div
        className="center-wrap"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
        }}
      >
        <a href="#home" style={{ marginRight: 'auto', textDecoration: 'none' }} aria-label="Shahd Khairy — home">
          <LogoMark />
        </a>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* Desktop buttons */}
          <a
            href={RESUME_URL}
            download
            className="btn btn--outline cursor-hover"
            style={{
              padding: '0.8rem 2.4rem',
              borderRadius: '10rem',
              border: '1.5px solid rgba(255, 255, 255, 0.4)',
              color: 'var(--white)',
              fontSize: '1.4rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
              background: 'transparent',
              cursor: 'pointer',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              transition: 'all 0.25s ease',
            }}
          >
            Resume
          </a>
          <a
            href="#contact"
            className="btn btn--white header__btn mobile--hide"
            style={{
              height: '4.2rem',
              padding: '0 1.8rem',
              fontSize: '1.6rem',
              fontWeight: 500,
              borderRadius: '0.8rem',
              opacity: isFixed ? 1 : 0,
              pointerEvents: isFixed ? 'all' : 'none',
            }}
          >
            Book a Call
          </a>

          {/* Hamburger */}
          <div
            onClick={onMenuOpen}
            className="header__burger"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              width: '5.2rem',
              padding: '0.5rem',
              cursor: 'pointer',
              gap: '0.6rem',
              marginLeft: 'calc(var(--p-page) / 10 * 1rem)',
              opacity: 1,
            }}
          >
            <div style={{ width: '100%', borderBottom: '0.5rem solid #fff', transition: 'all 0.5s' }} />
            <div style={{ width: '100%', borderBottom: '0.5rem solid #fff', transition: 'all 0.5s' }} />
            <div style={{ width: '100%', borderBottom: '0.5rem solid #fff', transition: 'all 0.5s' }} />
          </div>
        </div>
      </div>
      <style>{`
        .header__burger:hover div:nth-child(2) {
          width: 75% !important;
        }
        @media (max-width: 1023px) {
          .header__burger {
            width: 3.8rem !important;
            gap: 0.4rem !important;
          }
          .header__burger div {
            border-bottom: 0.35rem solid #fff !important;
          }
        }
      `}</style>
    </header>
  );
}
