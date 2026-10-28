import { getLocale, translate } from '../i18n';
import { getCategory, getEntry } from '../data/portfolio';
import { getWorkflow, workflowFromEntryId } from '../data/ai-workflow';

export const siteOrigin = 'https://portfolio2026-six-orcin.vercel.app';
const defaultDescription = 'AI 네이티브 프로덕트 디자이너 Austin의 프로젝트, AI 활용 능력, 디자인 철학을 담은 포트폴리오 A+studio.';

export function getPageMetadata(href: string) {
  const url = new URL(href, siteOrigin);
  const parts = url.pathname.split('/').filter(Boolean);
  const entry = parts[0] === 'project' && parts.length === 2 ? getEntry(parts[1]) : undefined;
  const category = parts[0] === 'work' && parts.length === 2 ? getCategory(parts[1]) : undefined;
  const flow = entry ? workflowFromEntryId(entry.id) : category?.id === 'ai-workflow' ? getWorkflow(url.searchParams.get('flow')) : undefined;
  const home = url.pathname === '/';
  const search = url.pathname === '/search';
  const title = flow ? `${translate('AI 워크플로우')} · ${translate(flow.label)}` : entry?.detailTitle ?? entry?.title ?? category?.title ?? (home ? 'Austin의 AI Agentic 포트폴리오' : search ? '검색 결과' : '페이지를 찾을 수 없습니다');
  const description = translate((flow?.description ?? entry?.summary ?? (entry ? `${entry.title}. ${entry.meta}. ${entry.sections[0]?.body || getCategory(entry.category)?.description || defaultDescription}` : category?.description ?? defaultDescription))).replace(/\s+/g, ' ').trim().slice(0, 180);
  const canonical = new URL(url.pathname, siteOrigin);
  if (category?.id === 'ai-workflow' && url.searchParams.has('flow')) canonical.searchParams.set('flow', getWorkflow(url.searchParams.get('flow')).id);
  return {
    title: `${translate(title)}${getLocale() === 'ko' ? ': ' : ' '}A+studio`, description, canonical: canonical.href,
    image: entry?.category === 'ux' && entry.thumbnail ? `${siteOrigin}${entry.thumbnail.src}` : `${siteOrigin}/assets/social/${entry?.kind ? `${entry.id}.jpg` : 'cover.png'}`,
    imageAlt: entry?.kind ? `${entry.title}: Austin의 A+studio 포트폴리오` : 'A+studio Austin, AI Native Product Designer',
    type: entry?.kind === 'article' ? 'article' : 'website',
    indexable: home || !!entry || !!category,
  };
}
