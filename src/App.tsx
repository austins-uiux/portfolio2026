import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { ChatPanel } from './components/ChatPanel';
import { Footer } from './components/Footer';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { EmptyState } from './components/ui';
import { getCategory, getEntry } from './data/portfolio';
import { usePersistentState } from './hooks/usePersistentState';
import { AppLink, navigate, useLocation } from './lib/router';
import { CategoryPage } from './pages/CategoryPage';
import { DetailPage } from './pages/DetailPage';
import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { AiWorkflowPage } from './pages/AiWorkflowPage';
import { workflowFromEntryId, workflowHref } from './data/ai-workflow';

const ComponentLabPage = lazy(() => import('./pages/ComponentLabPage'));
const InteractionLabPage = lazy(() => import('./pages/InteractionLabPage'));
const DesignSystemPage = lazy(() => import('./pages/DesignSystemPage'));

export function App() {
  const location = useLocation();
  const [collapsed, setCollapsed] = usePersistentState('aplus:sidebar-collapsed', false);
  const [theme, setTheme] = usePersistentState<'light' | 'dark'>('aplus:theme', 'dark', value => value === 'light' || value === 'dark');
  const [chatOpen, setChatOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeChat = useCallback(() => setChatOpen(false), []);
  const closeMenu = useCallback(() => setMobileOpen(false), []);
  const segments = location.pathname.split('/').filter(Boolean);
  const category = segments.length === 2 && segments[0] === 'work' ? getCategory(segments[1]) : undefined;
  const entry = segments.length === 2 && segments[0] === 'project' ? getEntry(segments[1]) : undefined;
  const legacyFlow = segments.length === 2 && segments[0] === 'project' ? workflowFromEntryId(segments[1]) : undefined;
  const isWorkflow = category?.id === 'ai-workflow' || !!legacyFlow;
  const isHome = segments.length === 0;
  const isSearch = location.pathname === '/search';
  const title = isWorkflow ? 'AI 워크플로우' : entry?.detailTitle ?? entry?.title ?? category?.title ?? (isSearch ? '검색 결과' : isHome ? 'Austin의 AI Agentic 포트폴리오' : '페이지를 찾을 수 없습니다');
  useEffect(() => { document.documentElement.dataset.theme = theme; document.documentElement.classList.toggle('dark', theme === 'dark'); const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]'); if (meta) meta.content = theme === 'dark' ? '#11151b' : '#ffffff'; }, [theme]);
  useEffect(() => { if (legacyFlow) navigate(workflowHref(legacyFlow.id), { replace: true }); }, [legacyFlow]);
  useEffect(() => { document.title = `${title} — A+studio`; setMobileOpen(false); }, [location.href, title]);
  useEffect(() => {
    const media = window.matchMedia('(min-width: 761px)');
    const resize = () => { if (media.matches) setMobileOpen(false); };
    media.addEventListener('change', resize); return () => media.removeEventListener('change', resize);
  }, []);

  return <div className={`app-shell ${collapsed ? 'sidebar-collapsed' : ''}`}>
    <a href="#main-content" className="skip-link" onClick={event => { event.preventDefault(); document.getElementById('main-content')?.focus(); window.scrollTo({ top: 0, behavior: 'instant' }); }}>본문으로 건너뛰기</a>
    <Sidebar active={isWorkflow ? 'ai-workflow' : entry?.category ?? category?.id ?? (isHome ? 'home' : undefined)} collapsed={collapsed} onToggle={() => setCollapsed(value => !value)} mobileOpen={mobileOpen} onMobileClose={closeMenu} chatOpen={chatOpen} />
    <div className="workspace" inert={chatOpen || mobileOpen}>
      <Topbar onChatOpen={() => { setMobileOpen(false); setChatOpen(true); }} onMenuOpen={() => setMobileOpen(true)} theme={theme} onThemeToggle={() => setTheme(value => value === 'light' ? 'dark' : 'light')} locationKey={location.href} />
      <main id="main-content" tabIndex={-1}>
        {isHome ? <HomePage /> : isWorkflow ? <AiWorkflowPage flowId={legacyFlow?.id ?? location.searchParams.get('flow')} /> : category?.id === 'component-lab' || entry?.category === 'component-lab' ? <Suspense fallback={<div className="listing-page content-container" role="status">컴포넌트를 불러오는 중…</div>}><ComponentLabPage key={location.pathname} componentId={entry?.id.replace('component-', '')} theme={theme} /></Suspense> : category?.id === 'interaction-lab' || entry?.category === 'interaction-lab' ? <Suspense fallback={<div className="listing-page content-container" role="status">인터랙션을 불러오는 중…</div>}><InteractionLabPage key={location.pathname} interactionId={entry?.id.replace('interaction-', '')} theme={theme} onThemeChange={setTheme} /></Suspense> : category?.id === 'design-system' || entry?.category === 'design-system' ? <Suspense fallback={<div className="listing-page content-container" role="status">디자인 시스템을 불러오는 중…</div>}><DesignSystemPage key={location.pathname} documentId={entry?.id} /></Suspense> : category ? <CategoryPage key={category.id} category={category} /> : entry ? <DetailPage entry={entry} /> : isSearch ? <SearchPage query={location.searchParams.get('q') ?? ''} /> : <div className="listing-page content-container"><EmptyState title="페이지를 찾을 수 없습니다."><p>주소를 확인하거나 홈에서 다시 시작해 주세요.</p><AppLink href="/" className="text-link">홈으로 돌아가기 →</AppLink></EmptyState></div>}
      </main>
      <Footer />
    </div>
    <ChatPanel open={chatOpen} onClose={closeChat} />
  </div>;
}
