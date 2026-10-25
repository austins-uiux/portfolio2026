import { useState, type ReactNode } from 'react';
import { ArrowUpRight, Check, Copy } from 'lucide-react';
import { AppLink } from '../lib/router';
import { SectionMark } from '../components/ui';
import { BrandSpecs, ColorPalette, SystemPreview } from '../components/system/SystemPreviews';
import { systemDocs, systemDocForEntry, systemEntryId, tokensFor, tokenCssFor, resolveToken, ruleValues, typeRoles, cssValue, layoutSpecs, breakpoints, type SystemDoc, type SystemId, type RuleValue } from '../data/design-system';

async function copyText(text: string) {
  if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
  const active = document.activeElement as HTMLElement | null;
  const area=document.createElement('textarea'); area.value=text; area.setAttribute('readonly',''); area.style.cssText='position:fixed;left:-9999px;top:0;';
  document.body.append(area); area.select();
  try { if (!document.execCommand('copy')) throw new Error('Copy unavailable'); }
  finally { area.remove(); active?.focus(); }
}
function CopyButton({text,label='복사'}:{text:string;label?:string}) {
  const [state,setState]=useState<'idle'|'copied'|'error'>('idle');
  return <span className="ds-copy-wrap"><button type="button" className="ds-copy" aria-label={label} onClick={async()=>{try{await copyText(text);setState('copied');setTimeout(()=>setState('idle'),1600);}catch{setState('error');}}}>{state==='copied'?<Check size={14}/>:<Copy size={14}/>}<span>{state==='copied'?'복사됨':label}</span></button>{state==='error'&&<span className="ds-copy-error" role="status">복사를 지원하지 않는 환경입니다. 코드를 직접 선택해 주세요.</span>}</span>;
}
function Section({id,title,description,children}:{id:string;title:string;description?:string;children:ReactNode}) {
  return <section id={id} className="ds-section" aria-labelledby={`${id}-title`}><div className="ds-section-heading"><h2 id={`${id}-title`}>{title}</h2>{description&&<p>{description}</p>}</div>{children}</section>;
}
function RulesTable({rows}:{rows:RuleValue[]}) {
  return <div className="ds-table-wrap"><table className="ds-table"><thead><tr><th>속성</th><th>값</th><th>사용 위치</th></tr></thead><tbody>{rows.map((row,index)=><tr key={`${row.name}-${index}`}><td><code>{row.name}</code></td><td><code>{row.value}</code></td><td><span>{row.usage}</span><small>{row.source}</small></td></tr>)}</tbody></table></div>;
}
const fixedProps: Partial<Record<SystemId,string[]>> = {
  color:['color','background','background-color','background-image','border-color'],
  typography:['font-size','font-weight','line-height','letter-spacing'],
  spacing:['padding','padding-inline','padding-block','padding-top','padding-bottom','padding-left','padding-right','margin','margin-top','margin-left','margin-right','margin-bottom','margin-inline','gap','column-gap','row-gap'],
  radius:['border-radius'], surface:['border','border-top','border-right','border-bottom','box-shadow','backdrop-filter','-webkit-backdrop-filter','z-index','opacity'],
  motion:['transition','animation','animation-delay','animation-duration','transition-duration','scroll-behavior'],
};
function DocExtra({id}:{id:SystemId}) {
  if (id==='color') return <Section id="ds-palette" title="라이트·다크 팔레트" description="같은 역할의 두 테마 값을 나란히 비교하세요."><ColorPalette/></Section>;
  if (id==='typography') return <Section id="ds-type-rules" title="타입 적용 규칙" description="아래 미리보기는 실제 CSS의 크기·굵기·행간을 사용합니다."><div className="ds-note">원본 8·10·12·14·16·18·24·30px → 보정 후 10·12·14·16·18·20·26·32px. 11px·13px 등 일부 세부 스타일은 고정값에 보정값을 더합니다. Tailwind의 xs·sm·base는 12·14·16px입니다.</div><RulesTable rows={typeRoles.map(role=>({name:role.label,value:`${cssValue(role.file,role.selector,'font-size')}`,usage:role.selector,source:role.file}))}/></Section>;
  if (id==='layout') return <Section id="ds-layout-rules" title="규격과 반응형"><RulesTable rows={layoutSpecs.map(([name,value,usage])=>({name,value,usage,source:'layout.css / pages.css / lab.css'}))}/><div className="ds-breakpoints">{breakpoints.map(([value,usage])=><div key={value}><strong>≤ {value}</strong><span>{usage}</span></div>)}</div></Section>;
  if (id==='icons') return <Section id="ds-brand-specs" title="브랜드와 아이콘 규격"><BrandSpecs/><div className="ds-note">Figma SVG 자산을 사용합니다. 일반 아이콘은 다크 모드에서 밝게 전환하고, 기본 로고는 전용 다크 SVG로 바꿔 파란 +를 보존합니다. 홈 히어로 로고는 원본 SVG 형태에 Aurora 그라데이션을 적용합니다. Send 아이콘은 흰색 선이 보이도록 전송 버튼의 파란 배경과 함께 표시합니다. 장식 아이콘은 읽기 목록에서 숨기고, 아이콘 버튼에는 이름을 제공합니다.</div></Section>;
  if (id==='avatar') return <Section id="ds-avatar-specs" title="크기와 대체 표시"><RulesTable rows={[
    {name:'사이드바 프로필',value:'32 × 32px / radius 100px',usage:'.avatar · 브랜드 배경 + A+ 로고 18.9 × 12.6px',source:'layout.css / Brand.tsx'},
    {name:'sm / default / lg',value:'24 / 32 / 40px',usage:'갤러리 아바타 · rounded-full · 이니셜 fallback',source:'components/lab-ui/avatar.tsx'},
    {name:'Avatar badge',value:'8 / 10 / 12px',usage:'sm / default / lg에 대응 · 2px 표면 링',source:'components/lab-ui/avatar.tsx'},
    {name:'Avatar group',value:'−8px overlap / 2px ring',usage:'그룹 겹침과 항목 구분',source:'components/lab-ui/avatar.tsx'},
  ]}/><AppLink href="/project/component-avatar" className="ds-inline-link">아바타 전체 예시 보기 <ArrowUpRight size={14}/></AppLink></Section>;
  if (id==='components') return <Section id="ds-patterns" title="조합 규칙"><RulesTable rows={[
    {name:'내비게이션',value:'38px / radius 6px',usage:'선택·호버에 surface-muted / 모바일 min-height 44px',source:'layout.css'},
    {name:'검색',value:'36px / radius 10px',usage:'기본 테두리 → 포커스 시 브랜드 테두리',source:'layout.css'},
    {name:'갤러리 필터',value:'34px / radius 100px',usage:'선택 시 브랜드 배경 + 흰색 텍스트',source:'lab.css'},
    {name:'카드',value:'1px border / radius 14px',usage:'목록 간격 24px / 호버 시 브랜드 테두리',source:'pages.css / lab.css'},
    {name:'메시지',value:'radius 12px / padding 11px',usage:'사용자 chat-prompt / AI surface-muted',source:'chat.css'},
    {name:'키보드 포커스',value:'2px outline / 4px offset',usage:':focus-visible / 입력은 테두리 상태로 표시',source:'global.css'},
    {name:'UT Lab CTA',value:'14px / 1px border / radius 4px',usage:'UX 개선 사례 우측 / hover 브랜드 표면 / native dialog',source:'ut-lab.css'},
    {name:'비활성',value:'opacity .5 / .65',usage:'추천 질문 / 전송 버튼',source:'chat.css'},
  ]}/></Section>;
  if (id==='surface') return <Section id="ds-surface-rules" title="표면 규칙"><div className="ds-spec-grid"><div><span>기본 경계</span><strong>1px · border</strong></div><div><span>헤더 블러</span><strong>20px · saturate(180%)</strong></div><div><span>헤더 불투명도 · Light / Dark</span><strong>78% / 76%</strong></div><div><span>블러 미지원 환경</span><strong>불투명 표면으로 전환</strong></div></div><p className="ds-note">겹침 순서는 헤더 30 → 사이드바 40 → 모바일 메뉴 52 → AI 패널 60 → 갤러리 오버레이 80~85 → 토스트 90 → 영상 95입니다.</p></Section>;
  if (id==='motion') return <Section id="ds-motion-rules" title="움직임의 기준"><RulesTable rows={[
    {name:'패널 이동',value:'420ms / cubic-bezier(.22, 1, .36, 1)',usage:'사이드바 너비·본문 여백·헤더 위치·AI 패널',source:'tokens.css / layout.css / chat.css'},
    {name:'빠른 피드백',value:'160ms',usage:'카드 테두리·그림자·홈 카드 translateY(−3px)',source:'tokens.css / pages.css'},
    {name:'응답 대기',value:'1s / ease-in-out / infinite',usage:'3개 점 · 지연 0 / 120 / 240ms',source:'chat.css'},
    {name:'모션 줄이기',value:'0.01ms',usage:'prefers-reduced-motion: reduce · CSS 전환·애니메이션',source:'global.css'},
  ]}/></Section>;
  if (id==='theming') return <Section id="ds-theme-rules" title="하나의 토큰, 두 개의 테마"><div className="ds-pipeline"><code>--color-surface</code><span>→</span><code>--background</code><span>→</span><code>bg-background</code></div><p className="ds-note">첫 방문에는 다크 모드를 사용합니다. 헤더의 테마 버튼으로 사이트 전체를 전환할 수 있으며, 선택은 이 브라우저에 저장됩니다. <code>data-theme</code>와 <code>dark</code> 클래스를 함께 갱신해 두 갤러리도 같은 상태를 유지합니다. 별도의 시스템 자동 테마는 현재 제공하지 않습니다.</p><p className="ds-note">주의: App Shell의 <code>--color-accent</code>는 브랜드 블루입니다. shadcn/ui의 <code>--accent</code>는 옅은 강조 표면이며, 주요 액션은 <code>--primary</code>로 연결합니다. 오류·차트 색상은 갤러리용 추가 토큰입니다.</p></Section>;
  return null;
}
function TokenTable({doc}:{doc:SystemDoc}) {
  const tokens=tokensFor(doc.id);
  if (!tokens.length) return null;
  return <Section id="ds-tokens" title={doc.id==='theming'?'갤러리·유틸리티 매핑':'토큰 레퍼런스'} description="이 표는 현재 스타일 파일의 CSS 변수에서 직접 읽어옵니다."><div className="ds-table-wrap"><table className="ds-table ds-token-table"><thead><tr><th>토큰</th><th>값</th><th>사용</th><th><span className="sr-only">복사</span></th></tr></thead><tbody>{tokens.map(token=><tr key={`${token.source}-${token.name}`}><td><code>{token.name}</code><small>{token.source}</small></td><td><code>{token.value}</code>{token.dark!==token.value&&<small>Dark: {token.dark}</small>}{token.value.includes('var(')&&<small>Light: {resolveToken(token.value,'light')}<br/>Dark: {resolveToken(token.value,'dark')}</small>}</td><td>{token.usage}</td><td><CopyButton text={`var(${token.name})`} label={`${token.name} 복사`}/></td></tr>)}</tbody></table></div></Section>;
}
export default function DesignSystemPage({documentId}:{documentId?:string}) {
  const [group,setGroup]=useState('전체');
  const doc=documentId?systemDocForEntry(documentId):undefined;
  const docs=systemDocs.filter(item=>group==='전체'||item.group===group);
  if (!doc) return <div className="listing-page content-container design-system"><header className="page-heading"><SectionMark/><h1 tabIndex={-1}>디자인 시스템</h1><p>A+studio의 화면을 만드는 토큰과 공통 UI를 정리했습니다.<br/>실제 적용된 값과 사용 규칙, 라이트·다크 예시를 살펴보세요.</p></header><div className="ds-list-controls"><div className="ds-filter-buttons" role="group" aria-label="디자인 시스템 분류">{['전체','파운데이션','공통 UI','테마'].map(label=><button key={label} type="button" aria-pressed={group===label} onClick={()=>setGroup(label)}>{label}</button>)}</div><span>{docs.length}개 항목</span></div><div className="ds-doc-grid">{docs.map(item=><AppLink key={item.id} href={`/project/${systemEntryId(item.id)}`} className="ds-doc-card"><div className={`ds-card-preview ds-card-preview--${item.id}`}><SystemPreview id={item.id} compact/></div><div className="ds-card-copy"><div><h2>{item.title}</h2><ArrowUpRight size={16}/></div><p>{item.description}</p><span>{item.label===item.group?item.label:`${item.label} · ${item.group}`}</span></div></AppLink>)}</div></div>;
  const index=systemDocs.indexOf(doc), next=systemDocs[index+1], previous=systemDocs[index-1];
  const rules=fixedProps[doc.id]?ruleValues(fixedProps[doc.id]!,doc.id==='avatar'?['layout.css']:undefined):[];
  return <article className="detail-page content-container design-system ds-detail"><header className="detail-heading"><AppLink className="ds-back" href="/work/design-system">← 디자인 시스템</AppLink><div className="ds-detail-title"><h1 tabIndex={-1}>{doc.title}</h1><span>{doc.label}</span></div><p>{doc.description}</p></header><nav className="ds-section-nav" aria-label="문서 내 탐색">{[['ds-preview','미리보기'],['ds-guidelines','사용 규칙'],...(tokensFor(doc.id).length?[['ds-tokens','토큰']]:[]),['ds-code','코드']].map(([id,label])=><button key={id} type="button" onClick={()=>document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'})}>{label}</button>)}</nav><Section id="ds-preview" title="미리보기"><div className={`ds-preview-panel ds-preview-panel--${doc.id}`}><SystemPreview key={doc.id} id={doc.id}/></div></Section><Section id="ds-guidelines" title="사용 규칙"><p className="ds-prose">{doc.guide}</p></Section><DocExtra id={doc.id}/><TokenTable doc={doc}/>{rules.length>0&&<details className="ds-audit"><summary>실제 스타일 사용값 <span>{rules.length}개 정의</span></summary><p>공통 화면과 갤러리 래퍼의 CSS에서 추출했습니다. 반응형 재정의와 고정값을 포함하며, 개별 외부 컴포넌트의 내부 효과 값은 해당 랩의 소스에서 확인할 수 있습니다.</p><RulesTable rows={rules}/></details>}<Section id="ds-code" title={tokensFor(doc.id).length?'토큰 코드':'사용 예시'}><div className="ds-code-block"><div><span>{tokensFor(doc.id).length?'CSS':'React / CSS'}</span><CopyButton text={tokenCssFor(doc)} label="코드 복사"/></div><pre tabIndex={0}><code>{tokenCssFor(doc)}</code></pre></div></Section><footer className="ds-doc-footer"><div>{previous&&<AppLink href={`/project/${systemEntryId(previous.id)}`}><small>이전</small><span>← {previous.title}</span></AppLink>}</div><div>{next&&<AppLink href={`/project/${systemEntryId(next.id)}`}><small>다음</small><span>{next.title} →</span></AppLink>}</div></footer></article>;
}
