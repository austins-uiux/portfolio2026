import { ArrowLeft, ArrowUpRight, Frame } from 'lucide-react';
import { AppLink } from '../lib/router';
import { categoryEntries } from '../data/portfolio';
import { getUxCase } from '../data/ux-cases';
import { uxEditorial } from '../data/ux-editorial';
import { getFigmaEmbedUrl, uxFigmaUrls } from '../data/ux-figma';
import { UxSimulationPanel } from '../components/ut/UxSimulationPanel';

const originalFlowSizes: Record<string, [number, number]> = {
  'naver-cart': [2047, 872],
  'tripstore-comparison': [2048, 714],
  'venti-delivery-map': [2048, 1434],
  'flitto-membership': [2047, 1074],
};

/** Minimal long-form template that follows the site's design tokens. */
export function UxCaseDetail({ id }: { id: string }) {
  const study = getUxCase(id);
  const article = uxEditorial[id];
  if (!study || !article) return null;

  const entries = categoryEntries('ux');
  const index = entries.findIndex(entry => entry.id === id);
  const previous = entries[index - 1];
  const next = entries[index + 1];
  const originalFlow = `/assets/ux-cases/${id.split('-')[0]}-original-flow.webp`;
  const [originalWidth, originalHeight] = originalFlowSizes[id];
  const figmaLink = uxFigmaUrls[id]?.trim() ?? '';
  const figmaEmbed = getFigmaEmbedUrl(figmaLink);

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

    <figure className="ux-article-source">
      <a href={originalFlow} target="_blank" rel="noopener noreferrer" aria-label={`${study.app}의 원본 UI Flow 이미지 새 창에서 보기`}>
        <img src={originalFlow} width={originalWidth} height={originalHeight} alt={`${study.app}에서 분석한 실제 UI Flow 화면들`} decoding="async" />
      </a>
      <figcaption>분석에 사용한 UI Flow 화면 · 이미지를 클릭하면 원본 크기로 볼 수 있어요.</figcaption>
    </figure>

    <div className="ux-article-body">
      {article.sections.map((section, sectionIndex) => <section className="ux-article-section" key={section.heading} aria-labelledby={`ux-article-section-${sectionIndex}`}>
        <h2 id={`ux-article-section-${sectionIndex}`}>{section.heading}</h2>
        {section.heading === '시뮬레이터로 먼저 찔러본 결과' && <UxSimulationPanel study={study} />}
        {section.paragraphs?.map((paragraph, i) => <p key={`p-${i}`}>{paragraph}</p>)}
        {section.bullets && <ul>{section.bullets.map((bullet, i) => <li key={i}>{bullet}</li>)}</ul>}
        {section.afterBullets?.map((paragraph, i) => <p key={`after-${i}`}>{paragraph}</p>)}
        {section.quote && <blockquote className="ux-article-hypothesis">{section.quote}</blockquote>}
        {section.steps?.map((step, i) => <p key={`step-${i}`}>{step}</p>)}
        {sectionIndex === 2 && <div className="ux-figma-embed" aria-label={`${study.app} Figma 디자인 작업물`}>
          <div className="ux-figma-embed-bar">
            <span className="ux-figma-embed-label"><Frame size={17} aria-hidden="true" /> Figma 작업물</span>
            {figmaEmbed ? <a href={figmaLink} target="_blank" rel="noopener noreferrer">Figma에서 열기 <ArrowUpRight size={16} aria-hidden="true" /></a> : <span className="ux-figma-embed-pending">링크 연결 예정</span>}
          </div>
          {figmaEmbed ? <iframe src={figmaEmbed} title={`${study.app} Figma 작업물 미리보기`} loading="lazy" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" /> : <div className="ux-figma-embed-placeholder">
            <span className="ux-figma-embed-symbol"><Frame size={28} strokeWidth={1.5} aria-hidden="true" /></span>
            <strong>디자인 작업물을 준비 중이에요.</strong>
            <p>Figma 링크가 연결되면 이곳에서 화면과 인터랙션을 직접 살펴볼 수 있어요.</p>
          </div>}
        </div>}
      </section>)}
    </div>

    <p className="ux-article-disclaimer">이 글은 공개된 UI 화면을 분석한 개인 UX 리디자인 탐색입니다. UT Lab의 수치는 규칙 기반 합성 시뮬레이션으로, 실제 사용자 조사나 전환 성과를 나타내지 않습니다.</p>

    <nav className="entry-pager" aria-label="다른 UX 개선 사례"><div>{previous && <AppLink href={`/project/${previous.id}`}><small>이전 사례</small><span>← {previous.title}</span></AppLink>}</div><div>{next && <AppLink href={`/project/${next.id}`}><small>다음 사례</small><span>{next.title} →</span></AppLink>}</div></nav>
  </article>;
}
