'use client';

import { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

export default function Preloader() {
  const [visible, setVisible] = useState(true);
  const preloaderRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!preloaderRef.current) return;
    const ctx = gsap.context(() => {}); // create a context to allow easy cleanup

    const blicks = gsap.utils.toArray('.preloader__text-blick');
    
    // Recursive flicker timeline
    const runFlicker = () => {
      const n = blicks.map(() => 0.75 * Math.random());
      const o = Math.max(...n) + 1.5;
      const r = blicks.map(() => 0.75 * Math.random());
      const i = o + 3.5;
      
      const c = gsap.timeline({ onComplete: runFlicker });
      blicks.forEach((element: any, index: number) => {
        c.fromTo(
          element,
          { opacity: 0 },
          { opacity: 1, duration: 1.5, delay: n[index], ease: "power2.in" },
          0
        );
        c.to(
          element,
          { opacity: 0, duration: 1.5, delay: r[index], ease: "power2.out" },
          i
        );
      });
      ctx.add(() => c.kill()); // attach to ctx so it cleans up
    };
    
    runFlicker();

    // Main Timeline
    const preloaderTl = gsap.timeline();
    const numbersWrapInner = document.querySelector(".preloader__numbers-wrap > div");
    
    preloaderTl.to(numbersWrapInner, { y: "-25%", duration: 0.75, ease: "power1.inOut" }, 1.33)
               .to(numbersWrapInner, { y: "-50%", duration: 0.75, ease: "power1.inOut" }, 2.66)
               .to(numbersWrapInner, {
                 y: "-75%",
                 duration: 0.75,
                 ease: "power1.inOut",
                 onComplete: () => {
                   gsap.fromTo(
                     ".preloader__text, .preloader__numbers-wrap, .preloader__numbers-span",
                     { opacity: 1 },
                     { opacity: 0, duration: 0.5 }
                   );
                   gsap.fromTo(
                     preloaderRef.current,
                     { opacity: 1 },
                     { opacity: 0, duration: 0.8 }
                   );
                   setTimeout(() => {
                     setVisible(false);
                   }, 1000);
                 }
               }, 4);
               
    preloaderTl.fromTo(
      ".preloader__numbers",
      { opacity: 0 },
      { opacity: 1, duration: 0.75, ease: "power1.inOut", delay: 1 },
      0
    );

    return () => ctx.revert();
  }, { scope: preloaderRef });

  if (!visible) return null;

  return (
    <div
      ref={preloaderRef}
      className="preloader"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: '#0c0c0c',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'var(--gray)',
        pointerEvents: 'all',
        background: `radial-gradient(ellipse 60% 60% at 50% -20%, hsl(265deg, 100%, 78%) 0%, hsla(265deg, 100%, 78%, 0.8) 18%, hsla(265deg, 100%, 78%, 0.55) 36%, hsla(265deg, 100%, 78%, 0.35) 54%, hsla(265deg, 100%, 78%, 0.2) 72%, hsla(265deg, 100%, 78%, 0.1) 88%, rgba(12, 12, 12, 0) 100%),
                     radial-gradient(ellipse 60% 60% at 50% 120%, hsl(210deg, 100%, 62%) 0%, hsla(210deg, 100%, 62%, 0.8) 18%, hsla(210deg, 100%, 62%, 0.55) 36%, hsla(210deg, 100%, 62%, 0.35) 54%, hsla(210deg, 100%, 62%, 0.2) 72%, hsla(210deg, 100%, 62%, 0.1) 88%, rgba(12, 12, 12, 0) 100%),
                     #0c0c0c`,
      }}
    >
      <div
        className="preloader-overlay"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`,
          backgroundSize: '200px 200px',
          opacity: 0.25,
          mixBlendMode: 'overlay',
          pointerEvents: 'none',
        }}
      />

      <div className="preloader__text" style={{ 
        position: 'absolute', top: 'calc(50% - 6rem)', left: 0, width: '100%', 
        textAlign: 'center', fontSize: '2.5rem', letterSpacing: '-0.04em',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
        opacity: 0
      }}>
        <span className="preloader__text-blick">You Design</span>
        <div style={{ width: '3rem', height: '2px', background: 'var(--gray)', margin: '0 1rem' }} />
        <span className="preloader__text-blick">I Develop</span>
      </div>

      <div className="preloader__numbers" style={{
        fontSize: '8rem', letterSpacing: '-0.06em', margin: 'auto 2rem 2rem auto',
        lineHeight: 0.8, opacity: 0, color: 'var(--gray)', position: 'relative', textAlign: 'right'
      }}>
        <div className="preloader__numbers-wrap" style={{
          position: 'absolute', right: '0.7em', top: 0, height: '100%', overflow: 'hidden', padding: '0 0.1em'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span>00</span>
            <span>25</span>
            <span>75</span>
            <span>100</span>
          </div>
        </div>
        <span className="preloader__numbers-span" style={{ position: 'relative', left: '1em' }}>%</span>
      </div>
      
      <style>{`
        @media (min-width: 1024px) {
          .preloader__text {
            font-size: 6rem !important;
            gap: 1rem !important;
          }
          .preloader__text div {
            width: 5rem !important;
            height: 3px !important;
            margin: 0 2.5rem !important;
          }
          .preloader__numbers {
            font-size: 18rem !important;
            margin: auto 4rem 4rem auto !important;
          }
        }
      `}</style>
    </div>
  );
}
