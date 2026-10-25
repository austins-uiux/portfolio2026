import { lazy, Suspense, useCallback, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { categoryEntries } from '../data/portfolio';
import { ProjectCard } from '../components/ProjectCard';
import { EmptyState, SectionMark } from '../components/ui';
import type { Category } from '../types';

const filters = ['Color', 'Typography', 'Shape', 'Icons', 'Components'] as const;
const UtLabModal = lazy(() => import('../components/ut/UtLabModal'));
export function CategoryPage({ category }: { category: Category }) {
  // The Figma default shows the entire foundation index with Color highlighted.
  const [filter, setFilter] = useState<typeof filters[number] | null>(null);
  const [utOpen, setUtOpen] = useState(false), [utMounted, setUtMounted] = useState(false);
  const closeUt = useCallback(() => setUtOpen(false), []);
  const items = categoryEntries(category.id).filter(item => !filter || item.foundation === filter);
  return <div className={`listing-page content-container listing-page--${category.layout} category-${category.id}`} data-figma-node={category.figmaNode}>
    <header className={`page-heading${category.id === 'ux' ? ' page-heading--with-cta' : ''}`}><SectionMark /><h1 tabIndex={-1}>{category.title}</h1><p>{category.description}</p>{category.id === 'ux' && <button type="button" className="ut-lab-cta" aria-haspopup="dialog" onClick={() => { setUtMounted(true); setUtOpen(true); }}>UT Lab <ArrowUpRight size={14}/></button>}</header>
    {category.layout === 'foundation-list' && <div className="foundation-filters" role="group" aria-label="디자인 시스템 분류">{filters.map((label, index) => <button key={label} type="button" className={(filter === label || !filter && index === 0) ? 'is-selected' : ''} aria-pressed={filter === label || !filter && index === 0} onClick={() => setFilter(current => current === label ? null : label)}>{label}</button>)}</div>}
    {category.id === 'ux' && !items.length ? <div className="ux-coming-soon"><p>현재 UX 개선 사례 작업중입니다.<br />빠른 시일안에 업로드 예정입니다.</p></div> : <div className={`project-list ${category.layout}`}>
      {items.map(item => <ProjectCard key={item.id} entry={item} variant={category.layout === 'text-list' ? 'text' : category.layout === 'foundation-list' ? 'foundation' : 'card'} />)}
      {!items.length && <EmptyState title="아직 등록된 항목이 없습니다." />}
    </div>}
    {utMounted && <Suspense fallback={<div className="ut-loading" role="status">UT Lab을 불러오는 중…</div>}><UtLabModal open={utOpen} onClose={closeUt}/></Suspense>}
  </div>;
}
