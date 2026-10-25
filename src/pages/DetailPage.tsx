import type { ContentImage, ContentSection, PortfolioEntry } from '../types';
import { categoryEntries, getCategory } from '../data/portfolio';
import { AppLink } from '../lib/router';

const factLabels: Record<string, string> = { Duration: '기간', Scope: '작업 범위', Team: '팀 구성', Role: '역할', Contribution: '기여도' };

function EntryImage({ image, eager = false }: { image: ContentImage; eager?: boolean }) {
  return <div className="detail-media detail-media--natural"><img src={image.src} alt={image.alt} width={image.width} height={image.height} loading={eager ? 'eager' : 'lazy'} decoding="async" /></div>;
}

function SectionCopy({ section, index }: { section: ContentSection; index: number }) {
  if (!section.heading && !section.body) return null;
  return <div className="detail-copy">
    {section.heading && <h2 id={`detail-section-${index}`}>{section.heading}</h2>}
    {section.paragraphs ? section.paragraphs.map((paragraph, p) => <p key={p}>{paragraph.map((part, i) => part.strong ? <strong key={i}>{part.text}</strong> : <span key={i}>{part.text}</span>)}</p>) : section.body && <p>{section.body}</p>}
  </div>;
}

/** One shared detail template for case studies and essays. */
export function DetailPage({ entry }: { entry: PortfolioEntry }) {
  const ready = !!entry.kind;
  const category = getCategory(entry.category)!;
  const siblings = categoryEntries(entry.category);
  const index = siblings.findIndex(item => item.id === entry.id);
  const previous = siblings[index - 1];
  const next = siblings[index + 1];
  const firstImage = entry.cover ?? (entry.kind === 'project' ? entry.sections[0]?.image : undefined);
  return <article className={`detail-page content-container${ready ? ` entry-detail entry-detail--${entry.kind}` : ''}`} data-figma-node="30:2288">
    <header className="detail-heading">
      {ready && <AppLink className="entry-back" href={`/work/${category.id}`}>← {category.title}</AppLink>}
      <h1 tabIndex={-1}>{entry.detailTitle ?? entry.title}</h1>
      <p>{entry.meta}</p>
      {entry.author && <p className="entry-author">{entry.author.name}<span>{entry.author.role}</span></p>}
    </header>
    {firstImage && <EntryImage image={firstImage} eager />}
    {entry.summary && <section className="entry-intro" aria-label="프로젝트 소개"><p>{entry.summary}</p></section>}
    {entry.facts && <dl className="entry-facts">{entry.facts.map(fact => <div key={fact.label}><dt>{factLabels[fact.label] ?? fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>}
    {entry.sections.map((section, sectionIndex) => firstImage && entry.kind === 'project' && sectionIndex === 0 && !section.heading && !section.body ? null : <section key={sectionIndex} className="detail-section" aria-labelledby={section.heading ? `detail-section-${sectionIndex}` : undefined}>
      {section.image && !(firstImage && entry.kind === 'project' && sectionIndex === 0) ? <EntryImage image={section.image} eager={sectionIndex === 0 && !firstImage} /> : !ready && <div className="detail-media" />}
      <SectionCopy section={section} index={sectionIndex} />
    </section>)}
    {ready && <nav className="entry-pager" aria-label={`${category.title} 다른 글`}><div>{previous && <AppLink href={`/project/${previous.id}`}><small>이전</small><span>← {previous.title}</span></AppLink>}</div><div>{next && <AppLink href={`/project/${next.id}`}><small>다음</small><span>{next.title} →</span></AppLink>}</div></nav>}
  </article>;
}
