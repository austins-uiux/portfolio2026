import { translateText, localize } from '../i18n';
import { AppLink } from '../lib/router';
import type { PortfolioEntry } from '../types';
import { Icon } from './ui';
import { entryHref } from '../data/portfolio';

export function ProjectCard({ entry, variant = 'card' }: { entry: PortfolioEntry; variant?: 'card' | 'text' | 'foundation' }) {
  return <AppLink href={entryHref(entry.id)} className={`project-card project-card--${variant}${variant === 'text' && entry.thumbnail ? ' project-card--text-with-image' : ''}`} aria-label={translateText(`${entry.title} ${entry.category === 'ai-workflow' ? '워크플로우 보기' : '상세 보기'}`)}>
    {localize((variant !== 'text' || entry.thumbnail) && <div className="project-thumbnail">{localize(entry.thumbnail && <img src={entry.thumbnail.src} alt={translateText(entry.thumbnail.alt)} width={entry.thumbnail.width} height={entry.thumbnail.height} loading="lazy" decoding="async" />)}</div>)}
    <div className="project-card-body"><div className="project-label"><h2>{localize(entry.title)}</h2>{localize(entry.uxApp ? <div className="ux-card-app"><img src={entry.uxApp.icon} alt="" width="24" height="24" loading="lazy" /><span>{localize(entry.uxApp.name)} · {localize(entry.uxApp.category)}</span></div> : entry.meta && <p>{localize(entry.meta)}</p>)}</div><span className="project-arrow"><Icon name="arrow" /></span></div>
  </AppLink>;
}
