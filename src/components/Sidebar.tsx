import { translate, translateText, localize } from '../i18n';
import { useRef } from 'react';
import { categories, site } from '../data/portfolio';
import { useDialog } from '../hooks/useDialog';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { AppLink } from '../lib/router';
import type { CategoryId } from '../types';
import { Icon, IconButton } from './ui';
import { Brand, sidebarLogoScale } from './Brand';

interface Props {
  active: CategoryId | 'home' | undefined;
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
  chatOpen: boolean;
}

export function Sidebar({ active, collapsed, onToggle, mobileOpen, onMobileClose, chatOpen }: Props) {
  const panel = useRef<HTMLElement>(null);
  const mobile = useMediaQuery('(max-width: 760px)');
  useDialog(mobileOpen, panel, onMobileClose);
  const items = [{ id: 'home', title: '홈', icon: 'home', href: '/' }, ...categories.map(item => ({ ...item, href: `/work/${item.id}` }))] as const;
  const groups: { label: string; ids: (CategoryId | 'home')[] }[] = [
    { label: '주 메뉴', ids: ['home', 'featured', 'ux', 'ai-workflow'] },
    { label: '디자인 자료', ids: ['design-system', 'component-lab', 'interaction-lab'] },
    { label: '디자인 생각', ids: ['thinking'] },
    // 프로젝트 아카이브 복원 시 원하는 그룹에 'archive'를 추가하세요.
  ];
  return <>
    {localize(mobileOpen && <button type="button" className="mobile-scrim" aria-label={translate("메뉴 닫기")} tabIndex={-1} onClick={onMobileClose} />)}
    <aside ref={panel} id="portfolio-sidebar" className={`sidebar ${collapsed ? 'is-collapsed' : ''} ${mobileOpen ? 'is-mobile-open' : ''}`} aria-label={translate("포트폴리오 탐색")} role={mobileOpen ? 'dialog' : undefined} aria-modal={mobileOpen || undefined} inert={chatOpen || mobile && !mobileOpen}>
      <div className="sidebar-identity">
        <AppLink href="/" className="brand-full" aria-label={translate("A+studio 홈")} onClick={onMobileClose}><Brand variant="sidebar" scale={sidebarLogoScale} /></AppLink>
        <button className="brand-collapsed" type="button" onClick={onToggle} aria-label={translate("사이드바 펼치기")} aria-expanded="false" aria-controls="portfolio-sidebar" title={translate("사이드바 펼치기")}>
          <Brand className="compact-brand" variant="compact" scale={sidebarLogoScale} />
          <Icon className="expand-on-hover" name="expand" />
        </button>
        <IconButton className="collapse-button" label={translate("사이드바 접기")} onClick={onToggle} aria-expanded={!collapsed} aria-controls="portfolio-sidebar"><Icon name="collapse" /></IconButton>
        <IconButton className="mobile-close" label={translate("메뉴 닫기")} onClick={onMobileClose}><Icon name="close" /></IconButton>
      </div>
      {localize(groups.map((group, index) => <nav key={group.label} className={`sidebar-nav${index > 0 ? ' resources-nav' : ''}`} aria-label={translateText(group.label)}>
        {localize(group.ids.flatMap(id => {
          const item = items.find(item => item.id === id);
          return item ? [<AppLink key={item.id} href={item.href} onClick={onMobileClose} className={`nav-item ${active === item.id ? 'is-active' : ''}`} aria-current={active === item.id ? 'page' : undefined} aria-label={translateText(item.title)} title={translateText(collapsed ? item.title : undefined)}><Icon name={item.icon} /><span className="nav-label">{localize(item.title)}</span></AppLink>] : [];
        }))}
      </nav>))}
      <div className="sidebar-spacer" />
      <div className="profile" title={translateText(`${site.owner} · ${site.role}`)}>
        <span className="avatar"><Brand variant="avatar" scale={1.05} /></span>
        <div className="profile-details"><strong>{localize(site.owner)}</strong><span>{localize(site.role)}</span></div>
      </div>
    </aside>
  </>;
}
