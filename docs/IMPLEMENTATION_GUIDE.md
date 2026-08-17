# Frontend Woman Clone — Full Implementation Guide

Everything changed on top of the base template (`ai-website-clone-template`) to reach the current result:
the animated clone of frontend-w.com's motion system with Shahd's identity, plus the Alloy Docker setup.

## Commit history

```
e62a2b3 chore: drop validation screenshot and ignore future ones
f6dc59e feat: star-mask about-to-mission transition and hero-driven about entrance
43a97db chore: remove stray validation screenshot
040e5d8 feat: add scroll-driven motion system and swap identity to Shahd
82809a5 chore: configure Alloy development environment
```

## Prerequisites

- Base template with Next.js 16 + React 19 + GSAP (`gsap`, `@gsap/react`) already installed
- Assets in `public/`: `images/woman2.webp`, `images/logo.svg`, `images/mobile_logo.svg`,
  `videos/work-video2.mp4`, `videos/trains.mp4`, `videos/toggle.mp4`, Inter Tight fonts
- Docker (for the Alloy dev environment)

## Motion architecture (how the key transitions work)

1. **Hero exit** — the hero section pins (`start: 'bottom bottom', end: '+=700', scrub: 1, pin: true, pinSpacing: false`).
   While pinned, the *incoming* About section animates: its `clip-path` opens from
   `polygon(0 5%, ...)` to `polygon(0 0%, ...)`, the title/features fade in, and the four cards
   rise from `y: 80px` with odd/even stagger.
2. **Star transition (About -> Mission)** — the Mission section is absolutely positioned over the
   2x2 card grid and masked by `public/images/svg/star.svg` (a four-pointed star centered exactly in
   the grid's "+" gap). The wrapper `.about__gsap` pins at viewport center for 1000px of scroll while
   the timeline scrubs `mask-size: 0% -> 1000%` with `power1.in` — the plus "opens like a star" and
   the next section is revealed through the middle. The grid fades only in the last quarter
   (`delay: 0.75, duration: 0.25`), mission lines slide up `y: 110% -> 0` staggered, and the word
   flips (Design Value -> Design Profit / High Standard -> Cost Effective) fire at the end.
3. **Works** — horizontal pinned scroll (`xPercent: -100 * (n-1)`); each project card scales
   0.82 -> 1 and un-rotates as it enters, driven by `containerAnimation` triggers.
4. **Approach** — rows activate as they cross viewport center (ScrollTrigger per row); the center
   badge is CSS `position: sticky` and its number counts 0 -> 89 while the label flips.
5. **Titles** — every giant title reveals letter-by-letter out of an overflow mask, scrubbed
   (`start: 'top bottom', end: 'top 60%'`).

## Files


---

### `.alloy/environment.json`

Alloy environment config — points Alloy at the compose file and the frontend port.

```json
{
  "dockerComposePath": "docker-compose.alloy.yaml",
  "frontendPort": 3000,
  "homeUrl": "/"
}

```

---

### `docker-compose.alloy.yaml`

Host-networked dev service (Node 24, hot reload, isolated node_modules/.next volumes).

```yaml
services:
  site:
    build:
      context: .
      dockerfile: Dockerfile.dev
      network: host
    network_mode: host
    working_dir: /app
    environment:
      IS_ALLOY: ${IS_ALLOY:-true}
      NEXT_TELEMETRY_DISABLED: "1"
    volumes:
      - .:/app
      - alloy_node_modules:/app/node_modules
      - alloy_next:/app/.next
    command: npm run dev -- --hostname 0.0.0.0 --port 3000

volumes:
  alloy_node_modules:
  alloy_next:

```

---

### `public/images/svg/star.svg`

Four-pointed star used as the CSS mask for the About-to-Mission reveal.

```xml
<svg width="974" height="974" viewBox="0 0 974 974" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M487 0L516.266 420.607C517.651 440.51 533.49 456.349 553.393 457.734L974 487L553.393 516.266C533.49 517.651 517.651 533.49 516.266 553.393L487 974L457.734 553.393C456.349 533.49 440.51 517.651 420.607 516.266L0 487L420.607 457.734C440.51 456.349 456.349 440.51 457.734 420.607L487 0Z" fill="#0C0C0C"/>
</svg>
```

---

### `src/app/globals.css`

Design tokens + motion utilities (marquee, split-letter masks, letter-wave hover, range slider skin).

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@font-face {
  font-family: 'Inter Tight';
  src: url('/fonts/inter-tight-latin-400-normal.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
}
@font-face {
  font-family: 'Inter Tight';
  src: url('/fonts/inter-tight-latin-500-normal.woff2') format('woff2');
  font-weight: 500;
  font-style: normal;
}
@font-face {
  font-family: 'Inter Tight';
  src: url('/fonts/inter-tight-latin-600-normal.woff2') format('woff2');
  font-weight: 600;
  font-style: normal;
}
@font-face {
  font-family: 'Inter Tight';
  src: url('/fonts/inter-tight-latin-700-normal.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
}
@font-face {
  font-family: 'Inter Tight';
  src: url('/fonts/inter-tight-latin-800-normal.woff2') format('woff2');
  font-weight: 800;
  font-style: normal;
}

@font-face {
  font-family: 'IBM Plex Sans Medium';
  src: url('/fonts/ibm-plex-sans-medium.ttf') format('truetype');
  font-weight: 500;
  font-style: normal;
}

@font-face {
  font-family: 'IBM Plex Mono';
  src: url('/fonts/IBMPlexMono-Regular.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
}

:root {
  --primary-f: "Inter Tight", sans-serif;
  --black: #0C0C0C;
  --white: #ffffff;
  --blue: #5822EF;
  --pink: #D2BDF8;
  --sky: #94BDF7;
  --gray: #B4C3D9;
  --primary-c: #000;
  --secondary-c: #ccc;
  --danger-c: #ff0000;
  --footer-height: 13rem;
  --wrap: 1860;
  --p-page: 30;
  --p-margin: 25rem;
  --header-height: 10rem;
  --max-width: 186rem;
}

@keyframes vibrant-soft-gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

:root, .dark {
  --background: 0 0% 5%;
  --foreground: 0 0% 100%;
  --card: 0 0% 5%;
  --card-foreground: 0 0% 100%;
  --popover: 0 0% 5%;
  --popover-foreground: 0 0% 100%;
  --primary: 256 86% 54%;
  --primary-foreground: 0 0% 100%;
  --secondary: 214 32% 91%;
  --secondary-foreground: 0 0% 5%;
  --muted: 214 32% 91%;
  --muted-foreground: 215 16% 47%;
  --accent: 214 32% 91%;
  --accent-foreground: 0 0% 5%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 0 0% 100%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 256 86% 54%;
  --radius: 0.5rem;
}

html {
  font-size: calc(100vw / ((var(--wrap) + var(--p-page) * 2) / 10));
  scroll-behavior: smooth;
}

@media screen and (max-width: 1023px) {
  :root {
    --wrap: 340;
    --p-page: 15;
    --p-margin: 15rem;
    --header-height: 7rem;
    --max-width: 100%;
  }
  html {
    font-size: 81%;
  }
}

@media screen and (max-width: 480px) {
  :root {
    --p-margin: 10rem;
  }
}

body {
  background-color: var(--black);
  color: var(--white);
  font-family: var(--primary-f);
  line-height: 1.07;
  user-select: none;
  -webkit-font-smoothing: antialiased;
}

.center-wrap {
  width: 100%;
  max-width: calc(100% - var(--p-page) * 2 / 10 * 1rem);
  margin: 0 auto;
}

.simple-title {
  font-weight: 400;
  text-transform: uppercase;
  white-space: nowrap;
  color: var(--gray);
  letter-spacing: -0.06em;
  font-size: clamp(5rem, 15vw, 20rem);
  line-height: 0.8;
  overflow: hidden;
  display: inline-block;
  margin-bottom: -0.175em;
  margin-left: -0.05em;
  position: relative;
}

.simple-title::before {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 1px;
  background-color: currentColor;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.5s ease;
}

.simple-title:hover::before {
  transform: scaleX(1);
}

.link-hover {
  position: relative;
  display: inline-block;
  text-decoration: none;
}

.link-hover::after {
  content: '';
  position: absolute;
  width: 100%;
  transform: scaleX(0);
  height: 1px;
  bottom: 0;
  left: 0;
  background-color: currentColor;
  transform-origin: bottom right;
  transition: transform 0.25s ease-out;
}

.link-hover:hover::after {
  transform: scaleX(1);
  transform-origin: bottom left;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1.2rem 2.4rem;
  border-radius: 4rem;
  font-size: 1.6rem;
  font-weight: 500;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid transparent;
  gap: 1rem;
}

.btn--white {
  background-color: var(--white);
  color: var(--black);
}

.btn--black {
  background-color: transparent;
  border: 1px solid var(--black);
  color: var(--black);
}

.btn--black:hover {
  background-color: var(--black);
  color: var(--white);
}

.btn--none {
  pointer-events: none;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* ============ Motion utilities ============ */

@keyframes marquee-loop {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

.marquee {
  overflow: hidden;
  white-space: nowrap;
  width: 100%;
}

.marquee__track {
  display: inline-flex;
  align-items: baseline;
  animation: marquee-loop 22s linear infinite;
  will-change: transform;
}

.marquee__item {
  display: inline-flex;
  align-items: baseline;
  gap: 0.35em;
  padding-right: 0.7em;
}

/* Letter-split reveal: each letter slides up from a masked line */
.split-line {
  display: inline-block;
  overflow: hidden;
  vertical-align: bottom;
}

.split-line .split-letter {
  display: inline-block;
  will-change: transform;
}

/* Letter wave on hover (footer / nav links) */
.wave-link {
  text-decoration: none;
  display: inline-block;
}

.wave-link .split-letter {
  display: inline-block;
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.wave-link:hover .split-letter {
  transform: translateY(-0.18em);
}

.wave-link .split-letter:nth-child(2n) { transition-delay: 0.02s; }
.wave-link .split-letter:nth-child(3n) { transition-delay: 0.045s; }
.wave-link .split-letter:nth-child(4n) { transition-delay: 0.065s; }
.wave-link .split-letter:nth-child(5n) { transition-delay: 0.085s; }

/* Range slider skin to match dark cards */
input[type='range'].calc-range {
  -webkit-appearance: none;
  appearance: none;
  height: 2px;
  background: rgba(255, 255, 255, 0.18);
  border-radius: 2px;
  outline: none;
}

input[type='range'].calc-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 50%;
  background: var(--white);
  border: none;
  cursor: grab;
  transition: transform 0.2s ease;
}

input[type='range'].calc-range::-webkit-slider-thumb:hover {
  transform: scale(1.15);
}

input[type='range'].calc-range::-moz-range-thumb {
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 50%;
  background: var(--white);
  border: none;
  cursor: grab;
}

@media (min-width: 1024px) {
  .desktop--hide {
    display: none !important;
  }
}

@media (max-width: 1023px) {
  .mobile--hide {
    display: none !important;
  }
}
```

---

### `src/components/SplitLetters.tsx`

NEW — splits a string into per-letter spans for letter-level animation.

```tsx
export default function SplitLetters({ text }: { text: string }) {
  return (
    <>
      {text.split('').map((char, i) =>
        char === ' ' ? (
          <span key={i} className="split-letter" style={{ whiteSpace: 'pre' }}>
            {' '}
          </span>
        ) : (
          <span key={i} className="split-letter">
            {char}
          </span>
        )
      )}
    </>
  );
}

```

---

### `src/components/TitleReveal.tsx`

NEW — giant section title whose letters slide out of a mask, scrubbed by scroll.

```tsx
'use client';

import { useRef, CSSProperties } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SplitLetters from './SplitLetters';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface TitleRevealProps {
  text: string;
  style?: CSSProperties;
  className?: string;
  scrub?: number;
  endTrigger?: string;
}

/**
 * Giant section title whose letters slide up out of a mask,
 * scrubbed by scroll (start "top bottom" -> end "top 60%").
 */
export default function TitleReveal({ text, style, className, scrub = 2.5 }: TitleRevealProps) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      const letters = ref.current.querySelectorAll('.split-letter');
      gsap.fromTo(
        letters,
        { yPercent: 110 },
        {
          yPercent: 0,
          stagger: 0.035,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top bottom',
            end: 'top 60%',
            scrub,
          },
        }
      );
    },
    { scope: ref }
  );

  return (
    <h2 ref={ref} className={`simple-title ${className ?? ''}`} style={style}>
      <span className="split-line">
        <SplitLetters text={text} />
      </span>
    </h2>
  );
}

```

---

### `src/components/HeroSection.tsx`

Hero pins at exit (pinSpacing:false); during the pin the INCOMING About section animates (clip-path top reveal, title/features fade, cards rise staggered). Bottom bar has an infinite marquee.

```tsx
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
    gsap.to('.main-screen__image', { x: -6, duration: 6 }, );

    // Pin the hero at its end (no spacing) — the About section slides over it.
    // During the pin, it is the INCOMING About content that animates:
    // clip-path opens at the top, title/features fade in, cards rise staggered.
    gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'bottom bottom',
        end: '+=700',
        scrub: 1,
        pin: true,
        pinSpacing: false,
      }
    })
    .fromTo('.about',
      { clipPath: 'polygon(0 5%, 100% 5%, 100% 100%, 0 100%)' },
      { clipPath: 'polygon(0 0%, 100% 0%, 100% 100%, 0 100%)', delay: 0.3, duration: 0.7 }, 0)
    .fromTo('.about .simple-title, .about .features',
      { opacity: 0 },
      { opacity: 1, delay: 0.4, duration: 0.6 }, 0)
    .fromTo('.about__card:nth-child(2n-1)',
      { opacity: 0, y: 80 },
      { opacity: 1, y: 0, delay: 0.4, duration: 0.6 }, 0)
    .fromTo('.about__card:nth-child(2n)',
      { opacity: 0, y: 80 },
      { opacity: 1, y: 0, delay: 0.5, duration: 0.55 }, 0);

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

      {/* Centered Woman Cutout Model */}
      <div 
        className="main-screen__image" 
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          height: '86vh',
          width: 'auto',
          zIndex: 2,
          pointerEvents: 'none'
        }}
      >
        <Image 
          src="/images/woman2.webp" 
          alt="Frontend Woman" 
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
        {/* Main Title Group (FRONTEND + Subnav + WOMAN) */}
        <div style={{ marginTop: '4vh', textAlign: 'center' }}>
          {/* Line 1: FRONTEND */}
          <h1 
            className="main-screen__title-line-1" 
            style={{
              fontSize: 'clamp(5rem, 17.5vw, 24rem)',
              lineHeight: 0.78,
              letterSpacing: '-0.03em',
              color: 'var(--black)',
              fontWeight: 800,
              textTransform: 'uppercase',
              margin: 0,
            }}
          >
            FRONTEND
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
                  color: 'var(--black)',
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
                color: 'var(--black)',
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
              fontSize: 'clamp(5rem, 17.5vw, 24rem)',
              lineHeight: 0.78,
              letterSpacing: '-0.03em',
              color: 'var(--black)',
              fontWeight: 800,
              textTransform: 'uppercase',
              margin: 0,
            }}
          >
            WOMAN
          </h1>
        </div>

        {/* Bottom Metadata Bar */}
        <div 
          className="main-screen__bottom" 
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            color: 'var(--black)',
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
            <span>UKRAINE — ORIGIN</span>
          </div>

          {/* Center: Position (marquee) */}
          <div className="main-screen__marquee marquee" style={{ maxWidth: '34rem', textTransform: 'none' }}>
            <div className="marquee__track" style={{ fontSize: '1.8rem', lineHeight: 1.1 }}>
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className="marquee__item">
                  <span style={{ fontWeight: 600 }}>Webflow &amp; Wordpress</span>
                  <span style={{ fontWeight: 400, opacity: 0.85 }}>for Designers</span>
                  <span style={{ opacity: 0.4 }}>—</span>
                </span>
              ))}
            </div>
          </div>

          {/* Right: Tech stack */}
          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
            <span>WEBFLOW & WORDPRESS</span>
            <span style={{ opacity: 0.6 }}>GSAP ANIMATIONS</span>
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

```

---

### `src/components/AboutSection.tsx`

THE STAR TRANSITION — grid pins at center; Mission overlays it masked by star.svg; mask-size scrubs 0% -> 1000% (power1.in); grid fades in the last quarter; mission lines slide up; word flips at the end of the same timeline. Card 3D tilt on hover.

```tsx
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

```

---

### `src/components/WorksSection.tsx`

Pinned horizontal projects scroll; per-item card scale/rotate via containerAnimation; scrub-driven marquee strip.

```tsx
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

            {/* Center Project Mockup Card */}
            <div 
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
                width: '100%',
                zIndex: 2,
              }}
            >
              <div
                className="works__card"
                style={{
                  width: '100%',
                  maxWidth: '72rem',
                  aspectRatio: '16/10',
                  backgroundColor: '#ffffff',
                  borderRadius: '0.5rem',
                  padding: '18rem 6rem',
                  boxShadow: '0 2.5rem 6rem rgba(0,0,0,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div 
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '0.8rem',
                    overflow: 'hidden',
                    backgroundColor: '#000',
                    position: 'relative',
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
                </div>
              </div>
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

```

---

### `src/components/CompareSection.tsx`

Scroll-driven row activation (viewport-center triggers), sticky center badge, 0->89 count-up with label flip, card tilt.

```tsx
'use client';

import { useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import TitleReveal from './TitleReveal';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const shahdItems = [
  'Bugless',
  'PixelPerfect',
  'On-time deadlines',
  'Fixed Price Only',
  'Free Light Animations',
  'Better than Figma',
  'Weekly Updates',
  'Stable Support',
  'Fast Replies',
  'Creativity',
  'hassle-free',
];

const freelancerItems = [
  'Full of bugs',
  'Near Layout',
  'Deadline shame',
  'Post-launch costs',
  'Hovers Not Always',
  'Worse than Figma',
  'Strage Silence',
  'Dev Rotation',
  'Hours of Silence',
  'Passivity',
  'Headaches',
];

const swapLabels = ['IDEAS', 'HOURS', 'BUGS'];

export default function CompareSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftCardRef = useRef<HTMLDivElement>(null);
  const rightCardRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [swapIdx, setSwapIdx] = useState(0);
  const [activeRow, setActiveRow] = useState<number | null>(null);
  const [hoverRow, setHoverRow] = useState<number | null>(null);

  useGSAP(() => {
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;

    // Scroll-driven row activation: as each row pair crosses the center of
    // the viewport it becomes the highlighted row (not click/hover-driven).
    const rows = gsap.utils.toArray<HTMLElement>('.compare__row--left');
    rows.forEach((row, idx) => {
      ScrollTrigger.create({
        trigger: row,
        start: 'center-=80 center',
        end: 'center+=170 center',
        onEnter: () => setActiveRow(idx),
        onEnterBack: () => setActiveRow(idx),
      });
    });

    // Badge counter counts up to 89 while scrolling through the lists,
    // and the label flips between words as progress advances.
    const counterState = { value: 0 };
    gsap.to(counterState, {
      value: 89,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 70%',
        end: 'bottom bottom',
        scrub: 1,
        onUpdate: (self) => {
          setSwapIdx(Math.min(swapLabels.length - 1, Math.floor(self.progress * swapLabels.length)));
        },
      },
      onUpdate: () => {
        if (counterRef.current) {
          counterRef.current.textContent = String(Math.round(counterState.value));
        }
      },
    });

    if (!isDesktop) return;

    // 3D tilt effect on mousemove across each card
    const setupTilt = (element: HTMLElement | null) => {
      if (!element) return;
      const handleMove = (e: MouseEvent) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotY = (x / rect.width - 0.5) * 8;
        const rotX = (y / rect.height - 0.5) * -8;

        gsap.to(element, {
          rotationX: rotX,
          rotationY: rotY,
          ease: 'power2.out',
          duration: 0.4,
          transformPerspective: 1400,
        });
      };

      const handleLeave = () => {
        gsap.to(element, { rotationX: 0, rotationY: 0, ease: 'power2.out', duration: 0.5 });
      };

      element.addEventListener('mousemove', handleMove);
      element.addEventListener('mouseleave', handleLeave);
    };

    setupTilt(leftCardRef.current);
    setupTilt(rightCardRef.current);

  }, { scope: sectionRef });

  const highlight = hoverRow ?? activeRow;

  const rowStyle = (idx: number): React.CSSProperties => ({
    fontSize: highlight === idx ? 'clamp(2.2rem, 2.6vw, 3.4rem)' : 'clamp(1.8rem, 2vw, 2.4rem)',
    fontWeight: highlight === idx ? 800 : 500,
    letterSpacing: '-0.02em',
    lineHeight: 1.15,
    borderBottom: '1px solid rgba(0,0,0,0.1)',
    paddingBottom: '1.2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    opacity: highlight === null || highlight === idx ? 1 : 0.45,
    transition: 'all 0.25s ease',
  });

  return (
    <section
      ref={sectionRef}
      id="compare"
      style={{
        backgroundColor: 'var(--black)',
        paddingTop: '10rem',
        paddingBottom: '12rem',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <div className="center-wrap" style={{ width: '100%' }}>
        
        {/* Section Title */}
        <TitleReveal
          text="Approach"
          style={{ 
            fontSize: 'clamp(5rem, 16vw, 24rem)',
            lineHeight: 0.82,
            letterSpacing: '-0.03em',
            textTransform: 'uppercase',
            fontWeight: 800,
            color: 'var(--white)',
            marginBottom: '4rem',
          }}
        />

        {/* Compare Content (Side-by-Side 2 Cards with Center Sticky Badge) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1.6rem',
            position: 'relative',
          }}
          className="compare-grid"
        >
          {/* Left Column: SHAHD (Sky Blue) */}
          <div
            ref={leftCardRef}
            style={{
              background: 'linear-gradient(180deg, #94bdf7 0%, #a4cdf8 100%)',
              borderRadius: '2.4rem',
              padding: '6rem 5rem 6rem 6rem',
              color: '#000',
              position: 'relative',
              boxShadow: '0 2rem 5rem rgba(0,0,0,0.3)',
              transformStyle: 'preserve-3d',
              transition: 'box-shadow 0.3s ease',
            }}
          >
            {/* Header: SHAHD */}
            <div
              style={{
                fontSize: 'clamp(2.4rem, 3.5vw, 4.2rem)',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '-0.02em',
                marginBottom: '4rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span>SHAHD</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 700, opacity: 0.5, letterSpacing: '0.04em' }}>POSITIVE</span>
            </div>

            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
              {shahdItems.map((item, idx) => (
                <div
                  key={item}
                  className="compare__row--left"
                  onMouseEnter={() => setHoverRow(idx)}
                  onMouseLeave={() => setHoverRow(null)}
                  style={rowStyle(idx)}
                >
                  <span>{item}</span>
                  <span style={{ fontSize: '1.4rem', opacity: highlight === idx ? 1 : 0.3 }}>✓</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: FREELANCER (Lavender) */}
          <div
            ref={rightCardRef}
            style={{
              background: 'linear-gradient(180deg, #d4bdf8 0%, #c4adf5 100%)',
              borderRadius: '2.4rem',
              padding: '6rem 6rem 6rem 5rem',
              color: '#000',
              position: 'relative',
              boxShadow: '0 2rem 5rem rgba(0,0,0,0.3)',
              transformStyle: 'preserve-3d',
              transition: 'box-shadow 0.3s ease',
            }}
          >
            {/* Header: FREELANCER */}
            <div
              style={{
                fontSize: 'clamp(2.4rem, 3.5vw, 4.2rem)',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '-0.02em',
                marginBottom: '4rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span>FREELANCER</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 700, opacity: 0.5, letterSpacing: '0.04em' }}>NEGATIVE</span>
            </div>

            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
              {freelancerItems.map((item, idx) => (
                <div
                  key={item}
                  onMouseEnter={() => setHoverRow(idx)}
                  onMouseLeave={() => setHoverRow(null)}
                  style={rowStyle(idx)}
                >
                  <span>{item}</span>
                  <span style={{ fontSize: '1.4rem', opacity: highlight === idx ? 1 : 0.3 }}>✕</span>
                </div>
              ))}
            </div>
          </div>

          {/* Center Sticky Counter Badge — stays pinned while lists scroll */}
          <div
            className="compare__badge-col"
            style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              height: '100%',
              transform: 'translateX(-50%)',
              zIndex: 10,
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                position: 'sticky',
                top: 'calc(50vh - 9rem)',
                width: '18rem',
                height: '18rem',
                borderRadius: '50%',
                backgroundColor: '#121214',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 1.5rem 4rem rgba(0, 0, 0, 0.45)',
                border: '2px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <span 
                style={{ 
                  fontSize: '1.4rem', 
                  fontWeight: 700, 
                  letterSpacing: '0.06em', 
                  color: 'var(--gray)',
                  textTransform: 'uppercase',
                  marginBottom: '0.2rem',
                  transition: 'opacity 0.2s ease',
                }}
              >
                {swapLabels[swapIdx]}
              </span>
              <span 
                ref={counterRef}
                style={{ 
                  fontSize: '6.2rem', 
                  fontWeight: 800, 
                  lineHeight: 1, 
                  color: 'var(--sky)',
                  letterSpacing: '-0.03em',
                }}
              >
                0
              </span>
            </div>
          </div>

        </div>

      </div>

      <style>{`
        @media (max-width: 1023px) {
          .compare-grid {
            grid-template-columns: 1fr !important;
          }
          .compare__badge-col {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}

```

---

### `src/components/CalcSection.tsx`

Word-mask scrubbed headline, staggered card entrances, live sliders with custom skin.

```tsx
'use client';

import { useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function CalcSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [rate, setRate] = useState(30);
  const [hours, setHours] = useState(80);

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

  // Exact formula matching scraped frontend-w.com script
  const calculatedSavings = Math.round(
    Math.max(0, ((1.23 - 0.006 * (rate - 25)) * rate - 25) * hours * 12)
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
        
        {/* Transitional Giant Headline */}
        <div style={{ marginBottom: '8rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {/* Row 1: Turn Loss Into */}
          <div 
            style={{ 
              display: 'flex', 
              gap: '2.5rem', 
              fontSize: 'clamp(4.5rem, 11vw, 15rem)', 
              fontWeight: 700, 
              lineHeight: 0.85, 
              letterSpacing: '-0.03em',
              textTransform: 'uppercase',
              flexWrap: 'wrap',
            }}
          >
            <span style={{ ...wordMask, color: 'var(--white)' }}><span className="calc__word" style={word}>Turn</span></span>
            <span style={{ ...wordMask, color: 'var(--pink)' }}><span className="calc__word" style={word}>Loss</span></span>
            <span style={{ ...wordMask, color: 'var(--gray)' }}><span className="calc__word" style={word}>Into</span></span>
          </div>

          {/* Row 2: Profit With */}
          <div 
            style={{ 
              display: 'flex', 
              gap: '2.5rem', 
              fontSize: 'clamp(4.5rem, 11vw, 15rem)', 
              fontWeight: 700, 
              lineHeight: 0.85, 
              letterSpacing: '-0.03em',
              textTransform: 'uppercase',
              color: 'var(--sky)',
            }}
          >
            <span style={wordMask}><span className="calc__word" style={word}>Profit</span></span>
            <span style={wordMask}><span className="calc__word" style={word}>With</span></span>
          </div>

          {/* Row 3: Cost-effective Collab */}
          <div 
            style={{ 
              display: 'flex', 
              fontSize: 'clamp(4.5rem, 11vw, 15rem)', 
              fontWeight: 700, 
              lineHeight: 0.85, 
              letterSpacing: '-0.03em',
              textTransform: 'uppercase',
              color: 'var(--sky)',
            }}
          >
            <span style={wordMask}><span className="calc__word" style={word}>Cost-effective Collab</span></span>
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
                Enter the current rate you’re paying for development
              </div>
            </div>

            <div>
              {/* Range Slider */}
              <input
                type="range"
                className="calc-range"
                min="0"
                max="60"
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
                  USD
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
                min="0"
                max="320"
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
                MISSED OPPORTUNITIES
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 500, lineHeight: 1.25, color: '#e0e0e0' }}>
                Your potential yearly loss compared to my rates
              </div>
            </div>

            <div>
              <div style={{ fontSize: '1.4rem', color: 'var(--gray)', marginBottom: '1rem', fontWeight: 500 }}>
                ${rate} × {hours} × 12 months =
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: 'clamp(4rem, 5vw, 6.8rem)', fontWeight: 800, lineHeight: 1, letterSpacing: '-0.03em', color: 'var(--white)' }}>
                  ${calculatedSavings.toLocaleString()}
                </span>
                <span style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--gray)', textTransform: 'uppercase' }}>
                  ANNUALY
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom PDF Prices Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={() => window.dispatchEvent(new Event('open-pdf-modal'))}
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
            PDF Prices ↗
          </button>
        </div>

      </div>

      <style>{`
        @media (max-width: 1023px) {
          .calc-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

```

---

### `src/components/LinksBar.tsx`

Giant contact links rise out of masks, scrubbed; hover color.

```tsx
'use client';

import { useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const links = [
  { label: 'WhatsApp', href: 'https://wa.me/0000000000' },
  { label: 'LinkedIn Account', href: 'https://www.linkedin.com/' },
  { label: 'shahd@frontend-w.com', href: 'mailto:shahd@frontend-w.com' },
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
          <span key={link.label} style={{ display: 'block', overflow: 'hidden' }}>
            <a
              className="links-bar__item"
              href={link.href}
              target="_blank"
              rel="noreferrer"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{
                display: 'block',
                fontSize: 'clamp(4rem, 9.5vw, 13.5rem)',
                lineHeight: 1.05,
                fontWeight: 800,
                letterSpacing: '-0.03em',
                color: hoveredIdx === idx ? 'var(--sky)' : 'var(--white)',
                textDecoration: 'none',
                transition: 'color 0.3s ease',
                fontFamily: 'inherit',
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

```

---

### `src/components/ContactForm.tsx`

Conversational form rows scrub-reveal; greeting addressed to Shahd.

```tsx
'use client';

import { useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function ContactForm() {
  const sectionRef = useRef<HTMLElement>(null);
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [topic, setTopic] = useState('Potential Project');
  const [contactInfo, setContactInfo] = useState('');
  const [contactMethod, setContactMethod] = useState('Email');
  const [message, setMessage] = useState('');

  useGSAP(() => {
    gsap.fromTo(
      '.contact__row',
      { y: 70, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          end: 'top 40%',
          scrub: 1,
        },
      }
    );
  }, { scope: sectionRef });

  return (
    <section 
      ref={sectionRef}
      id="contact" 
      style={{ 
        backgroundColor: 'var(--black)',
        paddingTop: '8rem',
        paddingBottom: '12rem',
      }}
    >
      <div className="center-wrap" style={{ width: '100%', maxWidth: '120rem', margin: '0 auto' }}>
        
        {/* Dark Conversational Form Card */}
        <div
          style={{
            backgroundColor: '#121217',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '2.4rem',
            padding: '7rem 6rem',
            color: 'var(--white)',
          }}
        >
          {/* Conversational Line 1 */}
          <div 
            className="contact__row"
            style={{ 
              fontSize: 'clamp(2rem, 3vw, 3.6rem)', 
              fontWeight: 500, 
              lineHeight: 1.6, 
              marginBottom: '4rem',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'baseline',
              gap: '1.2rem',
              color: '#d0d0d8',
            }}
          >
            <span>Hey, Shahd! My name is</span>
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                borderBottom: '1.5px solid rgba(255, 255, 255, 0.3)',
                color: 'var(--white)',
                fontSize: 'inherit',
                fontFamily: 'inherit',
                outline: 'none',
                padding: '0.2rem 0.8rem',
                minWidth: '22rem',
              }}
            />
            <span>and I am from</span>
            <input
              type="text"
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                borderBottom: '1.5px solid rgba(255, 255, 255, 0.3)',
                color: 'var(--white)',
                fontSize: 'inherit',
                fontFamily: 'inherit',
                outline: 'none',
                padding: '0.2rem 0.8rem',
                minWidth: '18rem',
              }}
            />
          </div>

          {/* Line 2: Connect about options */}
          <div 
            className="contact__row"
            style={{ 
              fontSize: 'clamp(2rem, 3vw, 3.6rem)', 
              fontWeight: 500, 
              lineHeight: 1.6, 
              marginBottom: '4rem',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '1.5rem',
              color: '#d0d0d8',
            }}
          >
            <span>Let’s connect about</span>
            {['Collaboration', 'Potential Project', 'Networking'].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setTopic(opt)}
                style={{
                  padding: '1rem 2.4rem',
                  borderRadius: '10rem',
                  border: topic === opt ? '1.5px solid #fff' : '1.5px solid rgba(255, 255, 255, 0.15)',
                  backgroundColor: topic === opt ? '#fff' : 'rgba(255, 255, 255, 0.04)',
                  color: topic === opt ? '#000' : 'var(--white)',
                  fontSize: 'clamp(1.4rem, 1.8vw, 2rem)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                }}
              >
                {opt}
              </button>
            ))}
          </div>

          {/* Line 3: Contact info & Method */}
          <div 
            className="contact__row"
            style={{ 
              fontSize: 'clamp(2rem, 3vw, 3.6rem)', 
              fontWeight: 500, 
              lineHeight: 1.6, 
              marginBottom: '4rem',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '1.2rem',
              color: '#d0d0d8',
            }}
          >
            <span>We can talk in more detail at</span>
            <input
              type="text"
              placeholder="name@website.com"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                borderBottom: '1.5px solid rgba(255, 255, 255, 0.3)',
                color: 'var(--white)',
                fontSize: 'inherit',
                fontFamily: 'inherit',
                outline: 'none',
                padding: '0.2rem 0.8rem',
                minWidth: '26rem',
              }}
            />
            <div style={{ display: 'inline-flex', gap: '1rem' }}>
              {['WhatsApp / LinkedIn', 'Email'].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setContactMethod(m)}
                  style={{
                    padding: '0.8rem 2rem',
                    borderRadius: '10rem',
                    border: contactMethod === m ? '1.5px solid #fff' : '1.5px solid rgba(255, 255, 255, 0.15)',
                    backgroundColor: contactMethod === m ? '#fff' : 'rgba(255, 255, 255, 0.04)',
                    color: contactMethod === m ? '#000' : 'var(--white)',
                    fontSize: 'clamp(1.3rem, 1.6vw, 1.8rem)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                  }}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Line 4: In short message */}
          <div 
            className="contact__row"
            style={{ 
              fontSize: 'clamp(2rem, 3vw, 3.6rem)', 
              fontWeight: 500, 
              lineHeight: 1.6, 
              marginBottom: '6rem',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'baseline',
              gap: '1.2rem',
              color: '#d0d0d8',
            }}
          >
            <span>In short,</span>
            <input
              type="text"
              placeholder="Type your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                borderBottom: '1.5px solid rgba(255, 255, 255, 0.3)',
                color: 'var(--white)',
                fontSize: 'inherit',
                fontFamily: 'inherit',
                outline: 'none',
                padding: '0.2rem 0.8rem',
                flex: 1,
                minWidth: '24rem',
              }}
            />
          </div>

          {/* Submit Button */}
          <div className="contact__row" style={{ textAlign: 'center' }}>
            <button
              type="submit"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--white)',
                fontSize: 'clamp(3rem, 5.5vw, 6rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                cursor: 'pointer',
                transition: 'opacity 0.25s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              Send a form ↗
            </button>
          </div>

        </div>

      </div>

      <style>{`
        @media (max-width: 1023px) {
          #contact .center-wrap > div {
            padding: 4rem 2.5rem !important;
          }
        }
      `}</style>
    </section>
  );
}

```

---

### `src/components/Footer.tsx`

Footer title letter-reveal scrub; per-letter wave hover on all footer links.

```tsx
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

```

---

### `src/components/MobileMenu.tsx`

Mobile menu with Shahd contact placeholders.

```tsx
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

```

---

### `.gitignore` (addition)

```gitignore
# Playwright validation artifacts
screenshot.png
```

## Running it

```bash
npm install
npm run dev        # local dev at :3000
# or with Docker (Alloy):
docker compose -f docker-compose.alloy.yaml up --build -d
```

## Pending personalization

Placeholders still in use until real details are provided:
- `shahd@frontend-w.com`, `https://wa.me/0000000000`, `https://www.linkedin.com/`
- Career cards (ArtyDevs / Clutch / Upwork) and the three portfolio projects are inherited content.
