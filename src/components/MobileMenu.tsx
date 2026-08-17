'use client';

import Image from 'next/image';
import { CloseIcon, WhatsAppIcon, LinkedInIcon } from './icons';

const navLinks = [
  { label: 'About Me', href: '#about' },
  { label: 'Why Me', href: '#compare' },
  { label: 'Projects', href: '#works' },
  { label: 'Save Money', href: '#calc' },
  { label: 'Approach', href: '#compare' },
];

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        backgroundColor: 'var(--black)',
        display: 'flex',
        flexDirection: 'column',
        padding: '0 2rem',
        transition: 'transform 0.4s cubic-bezier(0.77,0,0.175,1), opacity 0.4s',
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? 'all' : 'none',
      }}
    >
      {/* Top bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '7rem',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          flexShrink: 0,
        }}
      >
        <a href="#home" onClick={onClose}>
          <Image
            src="/images/mobile_logo.svg"
            alt="logo"
            width={48}
            height={48}
            style={{ filter: 'invert(0)' }}
          />
        </a>
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            color: 'var(--gray)',
            fontSize: '1.4rem',
            fontFamily: 'inherit',
          }}
        >
          <span>Close</span>
          <CloseIcon style={{ color: 'var(--gray)' }} />
        </button>
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.5rem' }}>
        {navLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            onClick={onClose}
            style={{
              fontSize: 'clamp(3rem, 8vw, 6rem)',
              fontWeight: 700,
              color: 'var(--gray)',
              textDecoration: 'none',
              letterSpacing: '-0.04em',
              lineHeight: 1.1,
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--white)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--gray)')}
          >
            {link.label}
          </a>
        ))}
      </nav>

      {/* Bottom: socials + email */}
      <div
        style={{
          paddingBottom: '4rem',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          paddingTop: '3rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', gap: '2rem' }}>
          <a
            href="https://wa.me/0000000000"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--gray)', transition: 'color 0.2s' }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--white)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--gray)')}
          >
            <WhatsAppIcon />
          </a>
          <a
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--gray)', transition: 'color 0.2s' }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--white)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--gray)')}
          >
            <LinkedInIcon />
          </a>
        </div>
        <a
          href="mailto:shahd@frontend-w.com"
          style={{
            fontSize: '1.4rem',
            color: 'var(--gray)',
            textDecoration: 'none',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--white)')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--gray)')}
        >
          shahd@frontend-w.com
        </a>
      </div>
    </div>
  );
}
