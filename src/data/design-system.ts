import tokenCss from '../styles/tokens.css?raw';
import bridgeCss from '../styles/lab.css?raw';
import themeCss from '../styles/index.css?raw';
import globalCss from '../styles/global.css?raw';
import layoutCss from '../styles/layout.css?raw';
import pageCss from '../styles/pages.css?raw';
import chatCss from '../styles/chat.css?raw';
import interactionCss from '../styles/interaction.css?raw';
import utLabCss from '../styles/ut-lab.css?raw';
import homePreviewCss from '../styles/home-previews.css?raw';

export type SystemId = 'color' | 'typography' | 'spacing' | 'radius' | 'layout' | 'surface' | 'motion' | 'icons' | 'avatar' | 'components' | 'theming';
export type SystemTheme = 'light' | 'dark';
export interface SystemDoc { id: SystemId; title: string; label: string; group: '파운데이션' | '공통 UI' | '테마'; description: string; guide: string; }
export const systemDocs: SystemDoc[] = [
  { id: 'color', title: 'Color', label: '컬러', group: '파운데이션', description: '브랜드 블루와 화면의 역할을 구분하는 시맨틱 컬러.', guide: '색 이름보다 용도를 기준으로 선택합니다. 배경·텍스트·테두리는 같은 변수 이름으로 라이트와 다크에 대응하고, 브랜드 블루는 두 테마에서 유지합니다.' },
  { id: 'typography', title: 'Typography', label: '타이포그래피', group: '파운데이션', description: 'Pretendard를 중심으로 한 글자 크기, 굵기와 행간.', guide: '제목, 본문, 보조 정보의 위계를 크기와 굵기로 구분합니다. App Shell의 원본 글자 크기에는 2px 보정값이 적용되며, 갤러리의 Tailwind 글자 크기는 별도로 정의됩니다.' },
  { id: 'spacing', title: 'Spacing', label: '스페이싱', group: '파운데이션', description: '요소 사이 간격과 컨테이너 안쪽 여백의 기준.', guide: '8개의 공통 간격 변수를 기준으로 사용합니다. 실제 구현에는 10px, 16px, 32px 등 고정값도 있으므로, 아래에 변수와 사용 중인 값을 함께 기록합니다.' },
  { id: 'radius', title: 'Radius', label: '라운드', group: '파운데이션', description: '작은 썸네일부터 카드와 원형 요소까지의 모서리.', guide: '작은 요소에는 작은 라운드를, 콘텐츠 카드에는 14px을 사용합니다. 필터 칩과 아바타는 pill 또는 원형으로 처리합니다.' },
  { id: 'layout', title: 'Layout', label: '레이아웃', group: '파운데이션', description: '사이드바, 헤더, 콘텐츠 너비와 반응형 그리드.', guide: '목록 콘텐츠는 최대 840px로 가운데 정렬합니다. 상세는 783px, 카드 간격은 24px입니다. 모바일에서는 좌우 20px 여백을 확보하고 사이드바를 오프캔버스로 전환합니다.' },
  { id: 'surface', title: 'Surface & Elevation', label: '표면·깊이', group: '파운데이션', description: '테두리, 그림자, 글래스 헤더와 화면의 겹침 순서.', guide: '기본 표면은 1px 테두리로 구분합니다. 그림자는 검색 팝오버와 카드 호버에 제한해 사용하고, 헤더에는 반투명 배경과 20px 블러를 적용합니다.' },
  { id: 'motion', title: 'Motion', label: '모션', group: '파운데이션', description: '패널 전환, 호버 피드백과 모션 줄이기 설정.', guide: '패널은 420ms 슬라이드, 빠른 피드백은 160ms를 사용합니다. 시스템의 모션 줄이기 설정에서는 CSS 애니메이션과 전환 시간을 줄입니다. 실험실 개별 효과는 각 상세에서 다룹니다.' },
  { id: 'icons', title: 'Icons & Brand', label: '아이콘·브랜드', group: '공통 UI', description: 'Figma에서 내보낸 공통 아이콘과 테마별 로고.', guide: '공통 아이콘은 기본 16px, 섹션 심볼은 24px입니다. 아이콘만 있는 버튼에는 접근 가능한 이름을 제공합니다. 로고의 +는 두 테마 모두 #148DDF를 유지합니다.' },
  { id: 'avatar', title: 'Avatar', label: '아바타', group: '공통 UI', description: '사이드바 프로필과 갤러리의 크기·대체 표시.', guide: '사이드바의 32px 브랜드 아바타와 shadcn/ui 기반 아바타를 구분합니다. 갤러리 아바타는 24·32·40px을 제공하며, 이미지가 없을 때 이니셜을 표시합니다.' },
  { id: 'components', title: 'UI Patterns', label: '공통 UI', group: '공통 UI', description: '내비게이션, 검색, 필터 칩과 카드의 조합 규칙.', guide: '같은 토큰을 공통 UI에 조합합니다. 선택 상태는 배경 또는 브랜드 컬러로, 입력 포커스는 테두리로 드러냅니다. 전체 shadcn/ui 예시는 컴포넌트 랩에서 확인할 수 있습니다.' },
  { id: 'theming', title: 'Theming', label: '테마 연결', group: '테마', description: 'A+studio 토큰과 shadcn/ui·Tailwind 사이의 연결.', guide: 'App Shell과 두 갤러리는 A+studio의 배경·텍스트·브랜드 변수를 공유합니다. 시맨틱 변수 → 갤러리 별칭 → Tailwind 유틸리티 순서로 연결됩니다.' },
];
export const getSystemDoc = (id: string) => systemDocs.find(doc => doc.id === id);
const legacyIds: Partial<Record<SystemId,string>> = { color:'foundation-1', typography:'foundation-2', radius:'foundation-3', icons:'foundation-4' };
export const systemEntryId = (id: SystemId) => legacyIds[id] ?? `system-${id}`;
export const systemDocForEntry = (entryId: string) => systemDocs.find(doc=>systemEntryId(doc.id)===entryId);

function declarations(body: string): Record<string, string> {
  return Object.fromEntries([...body.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map(m => [m[1], m[2].trim()]));
}
function block(css: string, selector: string) {
  const start = css.indexOf(selector);
  return start < 0 ? '' : css.slice(css.indexOf('{', start) + 1, css.indexOf('}', start));
}
export const baseTokens = declarations(block(tokenCss, ':root {'));
export const darkTokens = { ...baseTokens, ...declarations(block(tokenCss, ":root[data-theme='dark']")) };
export const bridgeTokens = declarations(block(themeCss, ':root {'));
export const utilityTokens = declarations(block(themeCss, '@theme inline'));
export function resolveToken(value: string, theme: SystemTheme, seen: string[] = []): string {
  const variables = { ...(theme === 'dark' ? darkTokens : baseTokens), ...bridgeTokens };
  return value.replace(/var\((--[\w-]+)\)/g, (_, name: string) => seen.includes(name) ? name : resolveToken(variables[name] ?? name, theme, [...seen, name]));
}
const usage: Record<string, string> = {
  '--color-surface': '화면·사이드바·카드의 기본 배경', '--color-hero-bg': '히어로 배경 · Light #0A304B / Dark #000000', '--color-hero-text': '두 테마에서 공통으로 사용하는 히어로 설명 텍스트', '--color-header-glass': '글래스 헤더의 반투명 배경',
  '--color-surface-muted': '선택 메뉴·AI 응답·비활성 표면', '--color-brand-subtle': '히어로·카드·브랜드 아바타', '--color-chat-prompt': '사용자가 보낸 채팅 말풍선',
  '--color-placeholder': '아직 채우지 않은 이미지 영역', '--color-text': '기본 텍스트', '--color-text-secondary': '메타·설명·보조 텍스트',
  '--color-text-supporting': '갤러리 설명·추천 질문', '--color-text-placeholder': '입력 안내 텍스트', '--color-border': '기본 구분선·카드 테두리',
  '--color-border-strong': '강조 테두리·입력 영역', '--color-accent': '브랜드 +·링크·주요 액션·포커스', '--color-icon': '기본 아이콘 색 기준',
  '--font-family': '사이트 기본 글꼴과 시스템 대체 글꼴', '--font-size-offset': 'App Shell의 원본 글자 크기 보정',
  '--radius-small': '작은 썸네일', '--radius-nav': '내비게이션·아이콘 버튼', '--radius-input': '검색·팝오버', '--radius-bubble': '채팅 말풍선·메시지 입력', '--radius-card': '카드·상세 미디어', '--radius-pill': '필터 칩·아바타·전송 버튼',
  '--sidebar-width': '펼쳐진 데스크톱 사이드바', '--sidebar-collapsed-width': '접힌 데스크톱 사이드바', '--topbar-height': '고정 헤더', '--content-width': '목록·홈 콘텐츠 최대 너비', '--chat-width': '데스크톱 AI 패널',
  '--ease-slide': '사이드바·AI 패널의 전환 곡선', '--duration-slide': '패널 전환 시간', '--duration-fast': '카드 호버 피드백', '--shadow-popover': '헤더 검색 결과의 그림자',
};
export interface SystemToken { name: string; value: string; dark: string; usage: string; source: string; }
function record(name: string, value: string, source: string): SystemToken {
  return { name, value, dark: source === 'tokens.css' ? darkTokens[name] ?? value : value, usage: usage[name] ?? (name.startsWith('--space-') ? '공통 간격 스케일' : name.startsWith('--font-') ? '원본 글자 크기 · 적용 시 +2px' : '갤러리 시맨틱 토큰'), source };
}
export function tokensFor(id: SystemId): SystemToken[] {
  const prefixes: Partial<Record<SystemId, string[]>> = { color: ['--color-'], typography: ['--font-'], spacing: ['--space-'], radius: ['--radius-'], layout: ['--sidebar-', '--topbar-', '--content-', '--chat-'], surface: ['--shadow-'], motion: ['--ease-', '--duration-'] };
  if (id === 'theming') return [...Object.entries(bridgeTokens).map(([k,v]) => record(k,v,'index.css · :root')), ...Object.entries(utilityTokens).map(([k,v]) => record(k,v,'index.css · @theme'))];
  return Object.entries(baseTokens).filter(([key]) => prefixes[id]?.some(prefix => key.startsWith(prefix))).map(([k,v]) => record(k,v,'tokens.css'));
}
export const sources = { 'global.css': globalCss, 'layout.css': layoutCss, 'pages.css': pageCss, 'chat.css': chatCss, 'lab.css': bridgeCss, 'interaction.css': interactionCss, 'ut-lab.css': utLabCss, 'home-previews.css': homePreviewCss };
export interface RuleValue { name: string; value: string; usage: string; source: string; }
export function ruleValues(properties: string[], files: (keyof typeof sources)[] = Object.keys(sources) as (keyof typeof sources)[]): RuleValue[] {
  const rows = new Map<string, RuleValue>();
  for (const file of files) {
    const css = sources[file].replace(/\/\*[\s\S]*?\*\//g, '');
    for (const rule of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      const selector = rule[1].trim();
      if (selector.startsWith('@') || selector.startsWith(':root')) continue;
      for (const declaration of rule[2].split(';')) {
        const colon = declaration.indexOf(':'); if (colon < 0) continue;
        const name = declaration.slice(0,colon).trim(), value = declaration.slice(colon+1).trim();
        if (!properties.includes(name)) continue;
        const key = name + ':' + value;
        const old = rows.get(key);
        if (old) { if (!old.usage.includes(selector)) old.usage += ', ' + selector; }
        else rows.set(key,{name,value,usage:selector,source:file});
      }
    }
  }
  return [...rows.values()];
}
export function cssValue(file: keyof typeof sources, selector: string, property: string) {
  for (const rule of sources[file].replace(/\/\*[\s\S]*?\*\//g,'').matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    if (!rule[1].trim().split(/,\s*/).includes(selector)) continue;
    const match = rule[2].match(new RegExp('(?:^|;)\\s*'+property+'\\s*:\\s*([^;]+)'));
    if (match) return match[1].trim();
  }
  return '-';
}
export const typeRoles = [
  { label:'페이지 제목',selector:'.page-heading h1',file:'pages.css' },
  { label:'홈 섹션 제목',selector:'.home-intro h2',file:'pages.css' },
  { label:'상세 섹션 제목',selector:'.detail-copy h2',file:'pages.css' },
  { label:'카드 제목',selector:'.project-label h2',file:'pages.css' },
  { label:'상세 본문',selector:'.detail-copy p',file:'pages.css' },
  { label:'기본 본문',selector:'body',file:'global.css' },
  { label:'검색·채팅 본문',selector:'.message-bubble > p',file:'chat.css' },
  { label:'프로필 이름',selector:'.profile-details strong',file:'layout.css' },
  { label:'보조 레이블',selector:'.profile-details span',file:'layout.css' },
  { label:'UT Lab CTA',selector:'.ut-lab-cta',file:'ut-lab.css' },
] as const;
export function finalFontSize(value: string) {
  const resolved = resolveToken(value,'light');
  const calc = resolved.match(/^calc\(([\d.]+)px\s*\+\s*([\d.]+)px\)$/);
  return calc ? `${Number(calc[1])+Number(calc[2])}px` : resolved;
}
export const layoutSpecs = [
  ['콘텐츠 최대 너비', 'var(--content-width)', '홈·카테고리 목록'],
  ['상세 최대 너비', cssValue('pages.css','.detail-page','--content-width'), '모든 상세 템플릿'],
  ['데스크톱 좌우 여백', '40px', '콘텐츠 너비 = min(840px, 100% − 80px)'],
  ['모바일 좌우 여백', '20px', '760px 이하 · 콘텐츠 너비 = 100% − 40px'],
  ['사이드바 내부 패딩', cssValue('layout.css','.sidebar','padding'), '좌우 12px'],
  ['메뉴 높이', cssValue('layout.css','.nav-item','height'), '모바일 최소 44px'],
  ['검색 필드', '292px × 36px', '모바일은 가용 너비에 맞춰 축소'],
  ['목록 카드 간격', cssValue('pages.css','.project-list','gap'), '모바일 일반 목록은 16px · 갤러리는 24px'],
  ['모바일 사이드바', '260px', '760px 이하에서 오프캔버스'],
  ['갤러리 그리드', '3 → 2 → 1열', '1100px 이하 2열 / 580px 이하 1열'],
  ['일반 프로젝트 그리드', '2·3 → 1열', '3열은 1100px 이하 2열 / 480px 이하 1열'],
  ['UT Lab 모달', '최대 1280px / 헤더 54px', '900px 이하 본문 1열 / 600px 이하 전체 화면'],
];
export const breakpoints = [ ['1100px','홈·3열 목록·갤러리 2열'], ['760px','모바일 App Shell·좌우 20px'], ['580px','컴포넌트·인터렉션 갤러리 1열'], ['480px','홈·프로젝트 목록 1열·AI 패널 전체 너비'] ];
export function tokenCssFor(doc: SystemDoc) {
  const tokens=tokensFor(doc.id);
  if (!tokens.length) return examples[doc.id] ?? '';
  if (doc.id === 'theming') return ':root {\n'+Object.entries(bridgeTokens).map(([k,v])=>`  ${k}: ${v};`).join('\n')+'\n}\n\n@theme inline {\n'+Object.entries(utilityTokens).map(([k,v])=>`  ${k}: ${v};`).join('\n')+'\n}';
  const light=':root {\n'+tokens.map(t=>`  ${t.name}: ${t.value};`).join('\n')+'\n}';
  const dark=tokens.filter(t=>t.dark!==t.value);
  return light+(dark.length?`\n\n:root[data-theme='dark'] {\n${dark.map(t=>`  ${t.name}: ${t.dark};`).join('\n')}\n}`:'');
}
export const examples: Partial<Record<SystemId,string>> = {
  icons: `<Icon name="search" />\n<IconButton label="검색 열기"><Icon name="search" /></IconButton>\n<Brand variant="sidebar" scale={1.05} />`,
  avatar: `<span className="avatar"><Brand variant="avatar" scale={1.05} /></span>\n\n<Avatar size="sm"><AvatarFallback>AL</AvatarFallback></Avatar>\n<Avatar><AvatarFallback>AL</AvatarFallback></Avatar>\n<Avatar size="lg"><AvatarFallback>AL</AvatarFallback></Avatar>`,
  components: `.nav-item { height: 38px; border-radius: var(--radius-nav); }\n.search-field { height: 36px; border-radius: var(--radius-input); }\n.project-card { border: 1px solid var(--color-border); border-radius: var(--radius-card); }\n\n/* 전체 동작과 구현 코드는 컴포넌트 랩에서 확인 */`,
};
