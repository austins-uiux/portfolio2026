import { translateText, localize } from '../i18n';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { IconName } from '../types';

const assetFiles: Record<IconName, string> = {
  home: '/assets/home-IconHouse.svg', featured: '/assets/home-IconThumbsUp.svg', ux: '/assets/home-IconChartLine.svg', ai: '/assets/home-IconSparkles.svg',
  component: '/assets/home-IconComponent.svg', interaction: '/assets/home-IconSquareMousePointer.svg', system: '/assets/home-IconLayoutPanelLeft.svg',
  flame: '/assets/icon-flame.svg', archive: '/assets/home-IconArchive.svg', thinking: '/assets/home-IconLightbulb.svg', collapse: '/assets/home-IconPanelRightOpen.svg', expand: '/assets/hover-IconPanelRightClose.svg',
  search: '/assets/home-IconSearch.svg', sun: '/assets/home-Sun.svg', github: '/assets/home-Github.svg', spark: '/assets/home-Frame4.svg', arrow: '/assets/home-IconArrowRight.svg',
  close: '/assets/chat-IconX.svg', send: '/assets/chat-IconArrowUp.svg', external: '/assets/answer-IconExternalLink.svg',
};

export const iconNames = Object.keys(assetFiles) as IconName[];

export function Icon({ name, className = '' }: { name: IconName; className?: string }) {
  return <img className={`icon icon--${name} ${className}`} src={assetFiles[name]} width="16" height="16" alt="" aria-hidden="true" draggable="false" />;
}

export function IconButton({ label, children, className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { label: string; children: ReactNode }) {
  return <button type="button" {...props} className={`icon-button ${className}`} aria-label={translateText(label)} title={translateText(label)}>{localize(children)}</button>;
}

export function SectionMark() { return <img className="section-mark" src="/assets/home-Frame3.svg" width="24" height="24" alt="" aria-hidden="true" />; }

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return <div className="empty-state"><SectionMark /><h2>{localize(title)}</h2>{localize(children)}</div>;
}
