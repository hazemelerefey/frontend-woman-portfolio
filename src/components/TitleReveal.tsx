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
