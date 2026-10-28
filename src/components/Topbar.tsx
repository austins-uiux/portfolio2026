import { translate, translateText, localize } from '../i18n';
import { useLocale } from '../i18n';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { entryHref, getCategory, searchEntries, site } from '../data/portfolio';
import { AppLink, navigate } from '../lib/router';
import { Icon, IconButton } from './ui';
import { PageScrollProgress } from './PageScrollProgress';

export function Topbar({ onChatOpen, onMenuOpen, theme, onThemeToggle, locationKey }: { onChatOpen: () => void; onMenuOpen: () => void; theme: 'light' | 'dark'; onThemeToggle: () => void; locationKey: string }) {
  const { locale, toggleLocale } = useLocale();
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const search = useRef<HTMLDivElement>(null);
  const results = searchEntries(query);
  useEffect(() => { setSearchOpen(false); setQuery(''); }, [locationKey]);
  useEffect(() => {
    function keydown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k' && !document.querySelector('[aria-modal="true"]')) { event.preventDefault(); input.current?.focus(); }
      if (event.key === 'Escape') setSearchOpen(false);
    }
    function outside(event: PointerEvent) { if (!search.current?.contains(event.target as Node)) setSearchOpen(false); }
    document.addEventListener('keydown', keydown);
    document.addEventListener('pointerdown', outside);
    return () => { document.removeEventListener('keydown', keydown); document.removeEventListener('pointerdown', outside); };
  }, []);
  function submit(event: FormEvent) { event.preventDefault(); if (query.trim()) { navigate(`/search?q=${encodeURIComponent(query.trim())}`); setSearchOpen(false); input.current?.blur(); } }
  return <header className="topbar">
    <div className="topbar-balance"><IconButton className="mobile-menu" label={translate("메뉴 열기")} onClick={onMenuOpen} aria-controls="portfolio-sidebar"><Icon name="expand" /></IconButton></div>
    <div className="search-wrap" ref={search} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setSearchOpen(false); }}>
      <form className="search-field" onSubmit={submit} role="search">
        <Icon name="search" />
        <input ref={input} type="search" value={query} onChange={event => { setQuery(event.target.value); setSearchOpen(true); }} onFocus={() => setSearchOpen(true)} placeholder={translate("프로젝트 검색...")} aria-label={translate("프로젝트 검색")} autoComplete="off" aria-controls={searchOpen && query.trim() ? 'search-results' : undefined} aria-expanded={searchOpen && !!query.trim()} />
      </form>
      {localize(searchOpen && query.trim() && <div className="search-popover" id="search-results" aria-label={translate("검색 결과")}>
        {localize(results.length ? <>{localize(results.slice(0, 6).map(item => <AppLink key={item.id} href={entryHref(item.id)} className="search-result"><div><strong>{localize(item.title)}</strong><small>{localize(getCategory(item.category)?.title)}</small></div><Icon name="arrow" /></AppLink>))}<button type="button" className="search-all" onClick={() => { navigate(`/search?q=${encodeURIComponent(query.trim())}`); setSearchOpen(false); }}>{translate("검색 결과 ")}{localize(results.length)}{translate("개 모두 보기 ")}<Icon name="arrow" /></button></> : <p className="search-no-results">{translate("검색 결과가 없습니다.")}</p>)}
      </div>)}
    </div>
    <div className="topbar-utilities">
      <IconButton label={translateText(theme === 'light' ? '다크 모드로 전환' : '라이트 모드로 전환')} onClick={onThemeToggle} aria-pressed={theme === 'dark'}><Icon name="sun" /></IconButton>
      <IconButton className="language-toggle" label={translateText(locale === 'ko' ? 'Switch to English' : '한국어로 전환')} onClick={toggleLocale} data-locale={locale}><span className="language-toggle-glyph" aria-hidden="true">{localize(locale === 'ko' ? 'Aa' : '한')}</span></IconButton>
      <a className="icon-button" href={site.github} target="_blank" rel="noreferrer" aria-label={translate("Austin의 GitHub 새 창에서 열기")} title="GitHub"><Icon name="github" /></a>
      <IconButton className="chat-open-button" label={translate("AI Chat 열기")} onClick={onChatOpen} aria-haspopup="dialog" aria-controls="ai-chat"><Icon name="spark" /></IconButton>
    </div>
    <PageScrollProgress key={locationKey} />
  </header>;
}
