import { translate } from '../i18n';
import { labComponents } from './component-lab';
import { interactionComponents } from './interaction-lab';
import { systemDocs, systemEntryId, tokensFor } from './design-system';
import importedContent from './portfolio-content.json';
import { workflows, workflowFromEntryId, workflowHref } from './ai-workflow';
import { uxEntries } from './ux-cases';
import type { Category, CategoryId, PortfolioEntry } from '../types';

/** Content lives here; the page templates never need to change to add work. */
export const site = {
  name: 'A+studio',
  owner: 'Austin',
  role: 'AI 네이티브 프로덕트 디자이너',
  github: 'https://github.com/austins-uiux',
  credits: 'Built with ChatGPT + Codex + Figma AI + shadcn/ui + Astryx + React + Typescript + Gemini(API) + GitHub + Vercel',
};

export const categories: Category[] = [
  { id: 'featured', title: '대표 프로젝트', description: '실제 제품의 문제를 해결한 과정과 그 안에서의 역할·판단을 소개합니다.', icon: 'featured', layout: 'grid-2', figmaNode: '29:802' },
  { id: 'ux', title: 'UX 개선 사례', description: '사용성 테스트 AI도구로 측정한 가상의 데이터로 문제를 정의하고, 개선 가설과 검증 방법을 탐색합니다.', homeDescription: '데이터로 문제를 정의하고, 개선 가설과 검증 방법을 탐색합니다.', icon: 'ux', layout: 'grid-2', figmaNode: '29:1018' },
  { id: 'ai-workflow', title: 'AI 워크플로우', description: '기획부터 구현까지, AI와 협업하고 결과를 검토하는 과정을 공유합니다.', icon: 'ai', layout: 'grid-2', figmaNode: '29:1148' },
  { id: 'component-lab', title: '컴포넌트 랩', description: 'UI의 구조와 상태를 설계하고, 제품에 맞게 조합·확장합니다.', icon: 'component', layout: 'grid-3', figmaNode: '29:1278' },
  { id: 'interaction-lab', title: '인터렉션 랩', description: '움직임과 반응을 실험하고, 사용 목적에 맞는 인터랙션을 설계합니다.', icon: 'interaction', layout: 'grid-3', figmaNode: '29:1408' },
  { id: 'design-system', title: '디자인 시스템', description: '토큰과 컴포넌트, 일관된 경험을 만드는 설계 규칙을 정리합니다.', icon: 'system', layout: 'foundation-list', figmaNode: '29:1532' },
  // 프로젝트 아카이브 임시 숨김: 카테고리·entries의 보관 주석을 해제하고 Sidebar 그룹에 archive를 추가하면 복원됩니다.
  // { id: 'archive', title: '프로젝트 아카이브', description: '다양한 분야와 플랫폼에서 진행한 프로젝트를 한곳에 모았습니다.', icon: 'archive', layout: 'grid-3', figmaNode: '29:1668' },
  { id: 'thinking', title: '디자인 생각', description: '제품과 AI, 디자인을 바라보는 관점과 선택의 이유를 기록합니다.', icon: 'thinking', layout: 'text-list', figmaNode: '29:1798' },
];

const sections = () => [
  { heading: '본문 타이틀', body: '본문글 텍스트' },
  { heading: '본문 타이틀', body: '본문글 텍스트' },
];

function entry(id: string, category: CategoryId, title: string, meta = 'UI/UX · B2B SaaS · 2026'): PortfolioEntry {
  return { id, category, title, meta, sections: sections() };
}

/** Migrated content shares the same routes and templates as the original draft. */
export const entries: PortfolioEntry[] = [
  ...(importedContent as PortfolioEntry[]).filter(item => item.category === 'featured'),
  // 기존에 보관했던 UX 카드 디자인을 재사용해, 실서비스 UI 관찰 기반의 3개 가상 UT 사례를 노출합니다.
  ...uxEntries,
  ...workflows.map(flow => ({ ...entry(`workflow-${flow.id}`, 'ai-workflow', flow.label, flow.title), summary: flow.description, sections: flow.steps.map(step => ({ heading: step.title, body: step.body })) })),
  ...labComponents.map(item => ({ ...entry(`component-${item.id}`, 'component-lab', item.name, `shadcn/ui · ${item.group}`), sections: [{ heading: item.name, body: item.description }] })),
  ...interactionComponents.map(item => ({ ...entry(`interaction-${item.id}`, 'interaction-lab', item.name, `Magic UI · ${item.group}`), sections: [{ heading: item.name, body: item.description }] })),
  ...systemDocs.map(doc => ({ ...entry(systemEntryId(doc.id), 'design-system', doc.title, `${doc.label} · ${doc.group}`), sections: [{ heading: doc.label, body: `${doc.description} ${doc.guide} ${tokensFor(doc.id).map(token=>`${token.name} ${token.value} ${token.dark}`).join(' ')}` }] })),
  // 프로젝트 아카이브 콘텐츠 보관 — 메뉴·홈·검색·직접 URL에서 비노출.
  // ...Array.from({ length: 9 }, (_, i) => entry(`archive-${i + 1}`, 'archive', i % 3 === 2 ? 'TADA Rider' : 'SOMA AI', i % 3 === 2 ? 'UI/UX · B2C Mobility · 2025' : undefined)),
  ...(importedContent as PortfolioEntry[]).filter(item => item.category === 'thinking'),
  // { ...entry('opgg-desktop', 'archive', 'OP.GG Desktop App', 'UI/UX · Desktop App'), listed: false },
  // { ...entry('retail-insight', 'archive', 'Retail & Insight', 'UI/UX · Retail'), listed: false },
];

export const getCategory = (id: string) => categories.find(category => category.id === id);
export const getEntry = (id: string) => entries.find(item => item.id === id);
export const entryHref = (id: string) => {
  const flow = workflowFromEntryId(id);
  return flow ? workflowHref(flow.id) : `/project/${id}`;
};
export const categoryEntries = (id: CategoryId) => entries.filter(item => item.category === id && item.listed !== false);
export function searchEntries(query: string): PortfolioEntry[] {
  const words = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  return entries.filter(item => words.every(word => { const original = `${item.title} ${item.detailTitle ?? ''} ${item.meta} ${item.summary ?? ''} ${getCategory(item.category)?.title} ${item.facts?.map(fact=>fact.value).join(' ') ?? ''} ${item.sections.map(section=>`${section.heading} ${section.body}`).join(' ')}`; return `${original} ${translate(original, 'en')} ${translate(item.title, 'en')} ${translate(item.summary ?? '', 'en')} ${translate(getCategory(item.category)?.title ?? '', 'en')}`.toLocaleLowerCase().includes(word); }));
}
