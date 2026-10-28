import { translate, translateText, localize, getLocale } from '../i18n';
import type { ContentImage, ContentSection, PortfolioEntry } from '../types';
import { categoryEntries, getCategory } from '../data/portfolio';
import { AppLink } from '../lib/router';

const factLabels: Record<string, string> = { Duration: '기간', Scope: '작업 범위', Team: '팀 구성', Role: '역할', Contribution: '기여도' };

function EntryImage({ image, eager = false }: { image: ContentImage; eager?: boolean }) {
  return <div className="detail-media detail-media--natural"><img src={image.src} alt={translateText(image.alt)} width={image.width} height={image.height} loading={eager ? 'eager' : 'lazy'} decoding="async" /></div>;
}

function SectionCopy({ section, index }: { section: ContentSection; index: number }) {
  if (!section.heading && !section.body) return null;
  return <div className="detail-copy">
    {localize(section.heading && <h2 id={`detail-section-${index}`}>{localize(section.heading)}</h2>)}
    {localize(section.paragraphs ? section.paragraphs.map((paragraph, p) => <p key={p}>{localize(paragraph.map((part, i) => { const space = getLocale() === 'en' && i < paragraph.length - 1 && !/^[.,;:!?]/.test(translate(paragraph[i + 1].text)) ? ' ' : ''; return part.strong ? <strong key={i}>{localize(part.text)}{space}</strong> : <span key={i}>{localize(part.text)}{space}</span>; }))}</p>) : section.body && <p>{localize(section.body)}</p>)}
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
      {localize(ready && <AppLink className="entry-back" href={`/work/${category.id}`}>← {localize(category.title)}</AppLink>)}
      <h1 tabIndex={-1}>{localize(entry.detailTitle ?? entry.title)}</h1>
      <p>{localize(entry.meta)}</p>
      {localize(entry.author && <p className="entry-author">{localize(entry.author.name)}<span>{localize(entry.author.role)}</span></p>)}
    </header>
    {localize(firstImage && <EntryImage image={firstImage} eager />)}
    {localize(entry.summary && <section className="entry-intro" aria-label={translate("프로젝트 소개")}><p>{localize(entry.summary)}</p></section>)}
    {localize(entry.facts && <dl className="entry-facts">{localize(entry.facts.map(fact => <div key={fact.label}><dt>{localize(factLabels[fact.label] ?? fact.label)}</dt><dd>{localize(fact.value)}</dd></div>))}</dl>)}
    {localize(entry.sections.map((section, sectionIndex) => firstImage && entry.kind === 'project' && sectionIndex === 0 && !section.heading && !section.body ? null : <section key={sectionIndex} className="detail-section" aria-labelledby={section.heading ? `detail-section-${sectionIndex}` : undefined}>
      {localize(section.image && !(firstImage && entry.kind === 'project' && sectionIndex === 0) ? <EntryImage image={section.image} eager={sectionIndex === 0 && !firstImage} /> : !ready && <div className="detail-media" />)}
      <SectionCopy section={section} index={sectionIndex} />
    </section>))}
    {localize(ready && <nav className="entry-pager" aria-label={translateText(`${category.title} 다른 글`)}><div>{localize(previous && <AppLink href={`/project/${previous.id}`}><small>{translate("이전")}</small><span>← {localize(previous.title)}</span></AppLink>)}</div><div>{localize(next && <AppLink href={`/project/${next.id}`}><small>{translate("다음")}</small><span>{localize(next.title)} →</span></AppLink>)}</div></nav>)}
  </article>;
}
