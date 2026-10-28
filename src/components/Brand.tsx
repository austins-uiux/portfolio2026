import { translateText } from '../i18n';
/** Preserve the original blue plus; switch only the letter colors by theme. */
const variants = {
  sidebar: { light: '/assets/home-Brand.svg', dark: '/assets/home-Brand-dark.svg', width: 82.5, height: 15.16, alt: 'A+studio' },
  compact: { light: '/assets/collapsed-Brand.svg', dark: '/assets/collapsed-Brand-dark.svg', width: 22.5, height: 14.8, alt: 'A+' },
  hero: { light: '/assets/home-Union.svg', dark: '/assets/home-Union-dark.svg', width: 245, height: 45, alt: 'A+studio' },
  avatar: { light: '/assets/home-Brand1.svg', dark: '/assets/home-Brand1-dark.svg', width: 18, height: 12, alt: '' },
};

export const sidebarLogoScale = 1.05 * 1.05;
export const heroLogoScale = 1.2;

export function Brand({ variant, className = '', scale = 1 }: { variant: keyof typeof variants; className?: string; scale?: number }) {
  const { light, dark, width, height, alt } = variants[variant];
  return <span className={`brand-image ${className}`}>
    <img className="brand-light" src={light} width={width * scale} height={height * scale} alt={translateText(alt)} draggable="false" />
    <img className="brand-dark" src={dark} width={width * scale} height={height * scale} alt={translateText(alt)} draggable="false" />
  </span>;
}
