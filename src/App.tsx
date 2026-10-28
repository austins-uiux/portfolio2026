import { translate, localize } from './i18n';
import { restoreLocale, useLocale } from './i18n';
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
import { UxCaseDetail } from './pages/UxCaseDetail';
import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { AiWorkflowPage } from './pages/AiWorkflowPage';
import { workflowFromEntryId, workflowHref } from './data/ai-workflow';
import { getPageMetadata } from './lib/page-metadata';

const ComponentLabPage = lazy(() => import('./pages/ComponentLabPage'));
const InteractionLabPage = lazy(() => import('./pages/InteractionLabPage'));
const DesignSystemPage = lazy(() => import('./pages/DesignSystemPage'));

export function App({ initialLocation = '/' }: { initialLocation?: string }) {
  const { locale } = useLocale();
  useEffect(restoreLocale, []);
  const location = useLocation(initialLocation);
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
  useEffect(() => { document.title = `${translate(title)}${locale === 'ko' ? ': ' : ' '}A+studio`; setMobileOpen(false); }, [location.href, title, locale]);
  useEffect(() => {
    const metadata = getPageMetadata(location.pathname + location.search);
    document.title = translate(metadata.title);
    const values = { description: metadata.description, 'og:title': metadata.title, 'og:description': metadata.description, 'og:url': metadata.canonical, 'og:image': metadata.image, 'og:image:alt': metadata.imageAlt, 'og:type': metadata.type, robots: 'noindex,nofollow,noarchive' };
    for (const [name, content] of Object.entries(values)) {
      const meta = document.querySelector<HTMLMetaElement>(`meta[name="${name}"],meta[property="${name}"]`);
      if (meta) meta.content = translate(content);
    }
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical) canonical.href = metadata.canonical;
  }, [location.href, locale]);
  useEffect(() => {
    const media = window.matchMedia('(min-width: 761px)');
    const resize = () => { if (media.matches) setMobileOpen(false); };
    media.addEventListener('change', resize); return () => media.removeEventListener('change', resize);
  }, []);

  return <div className={`app-shell ${collapsed ? 'sidebar-collapsed' : ''}`}>
    <a href="#main-content" className="skip-link" onClick={event => { event.preventDefault(); document.getElementById('main-content')?.focus(); window.scrollTo({ top: 0, behavior: 'instant' }); }}>{translate("본문으로 건너뛰기")}</a>
    <Sidebar active={isWorkflow ? 'ai-workflow' : entry?.category ?? category?.id ?? (isHome ? 'home' : undefined)} collapsed={collapsed} onToggle={() => setCollapsed(value => !value)} mobileOpen={mobileOpen} onMobileClose={closeMenu} chatOpen={chatOpen} />
    <div className="workspace" inert={chatOpen || mobileOpen}>
      <Topbar onChatOpen={() => { setMobileOpen(false); setChatOpen(true); }} onMenuOpen={() => setMobileOpen(true)} theme={theme} onThemeToggle={() => setTheme(value => value === 'light' ? 'dark' : 'light')} locationKey={location.href} />
      <main id="main-content" tabIndex={-1}>
        {localize(isHome ? <HomePage /> : isWorkflow ? <AiWorkflowPage flowId={legacyFlow?.id ?? location.searchParams.get('flow')} /> : category?.id === 'component-lab' || entry?.category === 'component-lab' ? <Suspense fallback={null}><ComponentLabPage key={location.pathname} componentId={entry?.id.replace('component-', '')} theme={theme} /></Suspense> : category?.id === 'interaction-lab' || entry?.category === 'interaction-lab' ? <Suspense fallback={null}><InteractionLabPage key={location.pathname} interactionId={entry?.id.replace('interaction-', '')} theme={theme} onThemeChange={setTheme} /></Suspense> : category?.id === 'design-system' || entry?.category === 'design-system' ? <Suspense fallback={null}><DesignSystemPage key={location.pathname} documentId={entry?.id} /></Suspense> : category ? <CategoryPage key={category.id} category={category} /> : entry?.category === 'ux' ? <UxCaseDetail key={entry.id} id={entry.id} /> : entry ? <DetailPage entry={entry} /> : isSearch ? <SearchPage query={location.searchParams.get('q') ?? ''} /> : <div className="listing-page content-container"><EmptyState title={translate("페이지를 찾을 수 없습니다.")}><p>{translate("주소를 확인하거나 홈에서 다시 시작해 주세요.")}</p><AppLink href="/" className="text-link">{translate("홈으로 돌아가기 →")}</AppLink></EmptyState></div>)}
      </main>
      <Footer />
    </div>
    <ChatPanel open={chatOpen} onClose={closeChat} />
  </div>;
}
