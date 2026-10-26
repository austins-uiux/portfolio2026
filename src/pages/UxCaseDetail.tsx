import { ArrowLeft } from 'lucide-react';
import { AppLink } from '../lib/router';
import { categoryEntries } from '../data/portfolio';
import { getUxCase } from '../data/ux-cases';
import { uxEditorial } from '../data/ux-editorial';

/** Minimal long-form template that follows the site's design tokens. */
export function UxCaseDetail({ id }: { id: string }) {
  const study = getUxCase(id);
  const article = uxEditorial[id];
  if (!study || !article) return null;

  const entries = categoryEntries('ux');
  const index = entries.findIndex(entry => entry.id === id);
  const previous = entries[index - 1];
  const next = entries[index + 1];
  const image = `/assets/ux-cases/${id.split('-')[0]}-concept.svg`;

  return <article className="detail-page entry-detail ux-article content-container">
    <header className="detail-heading ux-article-header">
      <AppLink className="entry-back" href="/work/ux"><ArrowLeft size={15} aria-hidden="true"/> UX 개선 사례</AppLink>
      <h1 tabIndex={-1}>{study.title}</h1>
      <div className="ux-article-meta">
        <img src={study.icon} width="24" height="24" alt="" />
        <span>{study.app}</span><span className="ux-article-tag">{study.category}</span>
        <span className="ux-article-dot" aria-hidden="true" />
        <span>Austin · Product Designer</span>
      </div>
    </header>

    <p className="ux-article-introduction">{article.introduction}</p>

    <div className="ux-article-body">
      {article.sections.map((section, sectionIndex) => <section className="ux-article-section" key={section.heading} aria-labelledby={`ux-article-section-${sectionIndex}`}>
        <h2 id={`ux-article-section-${sectionIndex}`}>{section.heading}</h2>
        {section.paragraphs?.map((paragraph, i) => <p key={`p-${i}`}>{paragraph}</p>)}
        {section.bullets && <ul>{section.bullets.map((bullet, i) => <li key={i}>{bullet}</li>)}</ul>}
        {section.afterBullets?.map((paragraph, i) => <p key={`after-${i}`}>{paragraph}</p>)}
        {section.quote && <blockquote className="ux-article-hypothesis">{section.quote}</blockquote>}
        {section.steps?.map((step, i) => <p key={`step-${i}`}>{step}</p>)}
        {sectionIndex === 2 && <figure className="ux-article-visual">
          <img src={image} width="1672" height="941" loading="lazy" decoding="async" alt={`${study.app}의 Before/After 화면설계 콘셉트`} />
          <figcaption>화면설계 방향을 보여주는 1차 콘셉트 이미지입니다. 실제 앱 화면 및 검증된 개선 결과가 아닙니다.</figcaption>
        </figure>}
      </section>)}
    </div>

    <p className="ux-article-disclaimer">이 글은 공개된 UI 화면을 분석한 개인 UX 리디자인 탐색입니다. UT Lab의 수치는 규칙 기반 합성 시뮬레이션으로, 실제 사용자 조사나 전환 성과를 나타내지 않습니다.</p>

    <nav className="entry-pager" aria-label="다른 UX 개선 사례"><div>{previous && <AppLink href={`/project/${previous.id}`}><small>이전 사례</small><span>← {previous.title}</span></AppLink>}</div><div>{next && <AppLink href={`/project/${next.id}`}><small>다음 사례</small><span>{next.title} →</span></AppLink>}</div></nav>
  </article>;
}
