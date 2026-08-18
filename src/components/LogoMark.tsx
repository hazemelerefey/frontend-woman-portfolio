/**
 * SHAHD KHAIRY identity — engineered logotype.
 *
 * Both words set in the site's own display face (Inter Tight 800) and shipped
 * as raw vector paths, tracked tight so the letters interlock. Two justified
 * lines, SHAHD over KHAIRY, width-matched into one solid block.
 *
 * Monochrome by design: no accent colour, no devices, no marks. The
 * letterforms carry the brand on their own.
 */

import {
  SHAHD_LETTERS,
  SHAHD_WIDTH,
  LOGO_HEIGHT,
} from './logo-paths';

export const INK = '#F4F1EA'; // warm ivory

/** SHAHD */
export function Wordmark({
  color = INK,
  drawable = false,
}: {
  color?: string;
  drawable?: boolean;
}) {
  return (
    <svg
      viewBox={`0 -4 ${SHAHD_WIDTH} ${LOGO_HEIGHT + 8}`}
      width="100%"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', overflow: 'visible' }}
      aria-label="SHAHD"
      role="img"
    >
      {SHAHD_LETTERS.map((l, i) => (
        <path
          key={i}
          className={drawable ? `wm-letter wm-letter--${i}` : undefined}
          d={l.d}
          transform={`translate(0, ${LOGO_HEIGHT})`}
          fill={color}
        />
      ))}
    </svg>
  );
}

/** Header / menu lockup — bold SHAHD over a light, tracked KHAIRY */
export default function LogoMark() {
  return (
    <span
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: '0.28rem',
        width: '10rem',
      }}
    >
      <Wordmark />
      <span
        style={{
          fontFamily: "'Inter Tight', sans-serif",
          fontSize: '1.05rem',
          fontWeight: 400,
          lineHeight: 1,
          letterSpacing: '0.62em',
          paddingLeft: '0.22em',
          color: INK,
          textAlign: 'center',
          whiteSpace: 'nowrap',
        }}
      >
        KHAIRY
      </span>
    </span>
  );
}
