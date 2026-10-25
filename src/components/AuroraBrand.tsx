import type { CSSProperties } from 'react';
import { Brand, heroLogoScale } from './Brand';

const heroMask = '/assets/home-Union.svg';

/** Magic UI Aurora Text motion, clipped to the original Figma logo outline. */
export function AuroraBrand() {
  const mask = {
    maskImage: `url("${heroMask}")`,
    WebkitMaskImage: `url("${heroMask}")`,
  } as CSSProperties;
  return <span className="hero-aurora-brand" role="img" aria-label="A+studio">
    <Brand variant="hero" className="hero-aurora-fallback" scale={heroLogoScale} />
    <span className="hero-aurora-mask" style={mask} aria-hidden="true">
      <span className="hero-aurora-fill animate-magic-aurora" style={{ animationDuration: '10s' }} />
    </span>
  </span>;
}
