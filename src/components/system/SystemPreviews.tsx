import { useState, type CSSProperties } from 'react';
import { Brand, sidebarLogoScale } from '../Brand';
import { ColorArtwork } from './ColorArtwork';
import { Icon, IconButton, iconNames } from '../ui';
import { Avatar, AvatarFallback } from '../lab-ui/avatar';
import { baseTokens, darkTokens, tokensFor, cssValue, finalFontSize, typeRoles, type SystemId } from '../../data/design-system';

export function SystemPreview({ id, compact = false }: { id: SystemId; compact?: boolean }) {
  const [playing, setPlaying] = useState(false);
  const [choice, setChoice] = useState('전체');
  const [phrase, setPhrase] = useState('디테일이 모여, 하나의 경험으로.');
  if (id === 'color') return <ColorArtwork/>;
  if (id === 'typography') return compact ? <div className="ds-type-art"><strong>Aa</strong><span>가나다 · Pretendard</span></div> : <div className="ds-type-preview"><label>미리보기 문장<input value={phrase} onChange={e=>setPhrase(e.target.value)} maxLength={80} placeholder="문장을 입력해 보세요" /></label><div className="ds-type-roles">{typeRoles.map(role=>{
    const size=cssValue(role.file,role.selector,'font-size');
    const weight=cssValue(role.file,role.selector,'font-weight');
    const line=cssValue(role.file,role.selector,'line-height');
    return <div key={role.label}><div className="ds-type-meta"><span>{role.label}</span><code>{finalFontSize(size)} / {weight==='—'?'400':weight} / {line==='—'?'상속':line}</code></div><p style={{fontSize:size,fontWeight:weight==='—'?400:weight,lineHeight:line==='—'?1.5:line}}>{phrase || 'A+studio'}</p></div>;
  })}</div></div>;
  if (id === 'spacing') return <div className="ds-space-art">{tokensFor(id).filter(t=>!compact||Number.parseInt(t.value)<=40).map(t=><div key={t.name}><code>{t.value}</code><i style={{width:compact?`calc(${t.value} * 2)`: `min(100%, calc(${t.value} * 5))`}} /></div>)}</div>;
  if (id === 'radius') return <div className="ds-radius-art">{tokensFor(id).filter(t=>!compact||['--radius-small','--radius-input','--radius-card','--radius-pill'].includes(t.name)).map(t=><div key={t.name}><i style={{borderRadius:t.value}} /><code>{t.value}</code>{!compact&&<span>{t.name.replace('--radius-','')}</span>}</div>)}</div>;
  if (id === 'layout') return <div className="ds-shell-art"><div className="ds-shell-side"><span /><i /><i /><i /><i /></div><div className="ds-shell-work"><div className="ds-shell-top"><i /></div><div className="ds-shell-content"><span /><div><i /><i /><i /></div><div><i /><i /><i /></div></div></div>{!compact&&<span className="ds-shell-caption">220px · 54px · max 840px · gap 24px</span>}</div>;
  if (id === 'surface') return <div className="ds-surface-art"><div className="ds-surface-base">Surface</div><div className="ds-surface-card">Card</div><div className="ds-surface-glass">Glass</div><div className="ds-surface-popover">Popover</div></div>;
  if (id === 'motion') return <div className="ds-motion-art"><div className={`ds-motion-track ${playing?'is-playing':''}`}><i /></div>{compact?<span>420ms · ease out</span>:<button type="button" className="ds-action" onClick={()=>setPlaying(v=>!v)}>{playing?'되돌리기':'슬라이드 재생'}<Icon name="arrow" /></button>}</div>;
  if (id === 'icons') return compact?<div className="ds-icons-art">{['home','component','system','thinking','spark','arrow'].map(name=><Icon key={name} name={name as typeof iconNames[number]} />)}</div>:<div className="ds-brand-preview"><div className="ds-brand-main"><Brand variant="sidebar" scale={sidebarLogoScale}/><Brand variant="compact" scale={sidebarLogoScale}/><span className="avatar"><Brand variant="avatar" scale={1.05}/></span></div><div className="ds-icon-grid">{iconNames.map(name=><div key={name}><span className={`ds-icon-sample ds-icon-sample--${name}`}><Icon name={name}/></span><code>{name}</code></div>)}</div></div>;
  if (id === 'avatar') return <div className="ds-avatar-art"><div><span className="avatar" aria-label="A+studio 프로필"><Brand variant="avatar" scale={1.05}/></span>{!compact&&<code>브랜드 · 32px</code>}</div>{(['sm','default','lg'] as const).map((size,index)=><div key={size}><Avatar size={size}><AvatarFallback>AL</AvatarFallback></Avatar>{!compact&&<code>{[24,32,40][index]}px · {size}</code>}</div>)}</div>;
  if (id === 'components') return compact?<div className="ds-ui-art"><span className="ds-primary-chip">전체</span><div><Icon name="search"/><span>Search…</span></div><Icon name="arrow"/></div>:<div className="ds-pattern-preview"><div><small>Navigation</small><button type="button" className="nav-item is-active"><Icon name="system"/>디자인 시스템</button></div><div><small>Search</small><label className="search-field"><Icon name="search"/><input aria-label="검색 필드 예시" placeholder="프로젝트 검색…"/></label></div><div><small>Filter</small><div className="ds-filter-buttons">{['전체','파운데이션','공통 UI'].map(label=><button type="button" key={label} aria-pressed={choice===label} onClick={()=>setChoice(label)}>{label}</button>)}</div></div><div><small>Icon button</small><IconButton label="예시 아이콘 버튼" onClick={()=>setChoice(choice==='전체'?'파운데이션':'전체')}><Icon name="arrow"/></IconButton></div></div>;
  return <div className="ds-theme-art">{(['light','dark'] as const).map(theme=>{const palette=theme==='light'?baseTokens:darkTokens;return <div key={theme} className={`ds-theme-mini ds-theme-mini--${theme}`} style={{'--mini-bg':palette['--color-surface'],'--mini-text':palette['--color-text'],'--mini-subtle':palette['--color-brand-subtle']} as CSSProperties}><span>A<span>+</span></span><i/><div><i/><i/></div><small>{theme==='light'?'Light':'Dark'}</small></div>;})}</div>;
}

export function ColorPalette() {
  return <div className="ds-palette">{tokensFor('color').map(token=><article className="ds-swatch-card" key={token.name}><div className="ds-swatch-pair">{(['light','dark'] as const).map(theme=><div key={theme} style={{background:theme==='light'?'#f5f6f8':'#1d242d'}}><i style={{background:theme==='light'?token.value:token.dark}}/><span>{theme==='light'?'Light':'Dark'}</span><code>{theme==='light'?token.value:token.dark}</code></div>)}</div><div><strong>{token.name.replace('--color-','')}</strong><p>{token.usage}</p><code>{token.name}</code></div></article>)}</div>;
}

export function BrandSpecs() {
  return <div className="ds-spec-grid"><div><span>브랜드 컬러</span><strong>{baseTokens['--color-accent']}</strong></div><div><span>사이드바 로고</span><strong>91 × 17px</strong></div><div><span>접힌 로고</span><strong>25 × 16px</strong></div><div><span>히어로 로고</span><strong>294 × 54px</strong></div><div><span>기본 아이콘 / 섹션 심볼</span><strong>16px / 24px</strong></div><div><span>아이콘 버튼 · 데스크톱 / 모바일</span><strong>24px / 32px</strong></div></div>;
}
