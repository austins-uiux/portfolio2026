# A+studio · AI Agentic Portfolio

Austin의 Figma 디자인을 구현한 React + TypeScript 포트폴리오 초안입니다. 공통 App Shell, 홈, 8개 카테고리 목록, 66개 항목의 컴포넌트 갤러리, 73개 항목의 인터랙션 갤러리, 11개 항목의 디자인 시스템 문서, 공통 상세 템플릿과 AI Chat UI를 갖추고 있습니다. 대표 프로젝트와 디자인 생각은 기존 포트폴리오에서 이관했고, 나머지 일반 카테고리의 콘텐츠는 초안 상태입니다.

## 반영된 디자인 수정

- 전체 텍스트를 기본 디자인보다 2px 크게 표시합니다. 모바일 전용 글자 크기도 동일하게 2px 증가하며, `src/styles/tokens.css`의 `--font-size-offset`으로 관리합니다.
- 커진 글자에 맞춰 줄간격과 홈 카드 높이, 채팅 추천 질문 줄바꿈을 조정했습니다.
- 다크모드 사이드바·접힌 사이드바·프로필·히어로 로고는 글자만 흰색으로 전환하고, +의 Primary 색상 `#148DDF`를 유지합니다. 원본 SVG의 경로와 로고 크기는 그대로 사용합니다.

- 홈과 8개 카테고리 컨텐츠는 최대 840px로 중앙 정렬하며, 데스크톱 카드 그리드 간격은 24px를 유지합니다. 상세 템플릿은 기존 783px를 유지합니다.
- 헤더 54px, 검색창 36px이며 라이트·다크 테마에 반투명 배경과 20px 블러를 적용합니다. 블러 미지원 브라우저에서는 불투명 배경을 사용합니다.
- 펼친 사이드바는 220px, 좌우 내부 여백은 12px입니다. 접힌 사이드바는 61px이며 모바일 메뉴는 260px입니다. 메뉴 항목 높이는 데스크톱 38px, 모바일 44px입니다.

- 좌측 패널의 기본·접힌·프로필 로고를 라이트/다크 모두 원래 크기의 105%로 표시합니다.
- AI Chat은 같은 출처의 `/api/chat` 서버를 통해 Gemini 3.5 Flash-Lite (`gemini-3.5-flash-lite`)를 호출합니다. 실제 모델 응답을 받은 후에만 `사용중`으로 표시하며 단일 파일 검토본은 명시적인 데모입니다.

## 빠르게 확인하기

`preview.html`을 웹브라우저로 열면 별도 설치 없이 동일한 앱을 확인할 수 있습니다. 이 파일은 React를 번들하고 로고·아이콘·썸네일을 포함한 검토용 사본입니다. 페이지 이동에는 해시 주소를 사용합니다. Pretendard 글꼴은 CDN에서 불러오며, 네트워크 연결이 없으면 시스템 글꼴로 표시됩니다.

개발과 Vercel 배포에는 아래의 소스를 사용하세요. `index.html`만 파일로 직접 열면 TypeScript 앱이 실행되지 않으므로 개발 서버를 켜야 합니다.

```bash
npm ci
npm run dev
```

터미널에 출력되는 로컬 주소를 엽니다. Node.js 22.12 이상을 사용하세요.

```bash
npm run check          # TypeScript 검사
npm run build          # TypeScript 검사 + 프로덕션 빌드 → dist/
npm run preview        # 빌드 결과 확인
npm run build:preview  # 단일 파일 preview.html 다시 생성
```

## 구조

| 경로 | 역할 |
| --- | --- |
| `src/App.tsx` | App Shell 조합, 테마, 페이지 선택 |
| `src/components/Sidebar.tsx` | 공통 메뉴, 접기·펼치기, 모바일 메뉴 |
| `src/components/Topbar.tsx` | 프로젝트 검색, 테마, GitHub, 채팅 열기 |
| `src/components/ChatPanel.tsx` | 입력·전송·대기·응답·추천 프로젝트·오류 상태 |
| `src/components/ProjectCard.tsx` | 카드·텍스트·Foundation 목록 항목 |
| `src/data/portfolio.ts` | 카테고리, 프로젝트, 메타 정보, 상세 섹션, 사이트 기본 정보 |
| `src/pages/` | 홈·카테고리·공통 상세·검색 페이지 |
| `src/styles/tokens.css` | Figma 기반 색상·타이포·간격·모서리·너비·모션 토큰 |
| `src/lib/chat.ts` | 같은 출처 서버 호출 / 단일 검토본 데모 어댑터 |
| `api/chat.ts`, `server/` | Gemini 서버, 공개 콘텐츠 검색, 입력 검증·오류 처리 |
| `src/lib/router.tsx` | URL 라우팅과 검토용 해시 라우팅 |
| `public/assets/` | Figma에서 내보낸 원본 로고·아이콘·채팅 썸네일 |
| `vercel.json` | Vite 빌드와 상세 URL 새로고침을 위한 SPA rewrite |

디자인 시스템은 Figma의 시맨틱 토큰을 CSS 변수로 옮기고 공통 React 컴포넌트로 구성했습니다. Astryx 런타임 패키지 의존성은 추가하지 않았습니다. 푸터의 제작 도구 문구는 Figma 원문을 유지했습니다.

## 컴포넌트 랩 (shadcn/ui)

2026-10-25 공식 `/docs/components` 목록의 **66개 항목**을 전부 수집했습니다. 문서 HTML에서 목록을 추출하고, 공식 Radix/Nova 레지스트리 JSON으로 원본 소스를 가져와 프로젝트 내부에 보관합니다. 방문자 브라우저에서는 크롤링이나 외부 소스 실행을 하지 않습니다.

- `/work/component-lab`: 전체 목록, 한국어 기능 설명, 6개 분류, 직접 조작하는 예시. 분류 칩 우측에 현재 항목 수를 표시하고 카드 하단에 분류를 표시합니다. 목록 상단 메타 정보와 전용 검색창은 제거했으며, 공통 헤더 검색으로는 계속 컴포넌트를 찾을 수 있습니다.
- `/project/component-button` 등: 기존 상세 화면 레이아웃에 큰 프리뷰·초기화·코드 보기/복사·토큰 정보·공식 문서 링크를 적용했습니다.
- 목록은 840px, 3열/2열/1열 반응형 그리드이며 카드 간격 24px를 사용합니다. 갤러리 코드와 의존성은 해당 메뉴에서 지연 로딩하고, 아래쪽 예시는 화면에 접근할 때 마운트합니다.
- A+studio의 Primary `#148DDF`, Pretendard, 라이트/다크 시맨틱 색상과 라운드를 적용했습니다. Tailwind의 전역 Preflight는 사용하지 않으며 CSS 레이어로 기존 App Shell과 스타일 우선순위를 관리합니다.
- Data Table, Date Picker, Typography는 문서의 조합 패턴에 따라 구성한 예시입니다. Toast는 공식 권장 Sonner 컴포넌트를 사용합니다.
- 컴포넌트별 대표 예시를 제공합니다. 상세 Button의 variant/size/disabled 및 Input의 disabled/error 예시를 포함하며, 공식 문서에 있는 모든 variant 조합을 복제한 것은 아닙니다. 실제 개인정보·데이터 저장·파일 전송은 하지 않습니다.
- MIT 라이선스 및 저작권 고지는 `vendor/shadcn/LICENSE.md`, 출처와 수집 시각은 `vendor/shadcn/manifest.json`, 원본 레지스트리 JSON은 `vendor/shadcn/registry/`에 보관합니다. UI 하단에도 오픈소스 기반임을 표시합니다. Accordion 예시는 헤더와 펼쳐지는 본문에 좌우 10px 패딩을 적용합니다.

```bash
npm run sync:components                    # 공식 목록/레지스트리를 명시적으로 새로 수집
python3 scripts/sync-shadcn.py --offline  # 보관한 원본으로 동일한 소스 재생성
npm run build
npm run build:preview
```

업스트림에서 새 항목이 추가되면 수집 후 `src/data/component-lab.ts`의 설명/분류와 `src/components/lab/ComponentDemo.tsx`의 예시를 추가하고 검토하세요. 동기화는 vendored 소스를 다시 생성하므로 직접 수정한 해당 파일은 먼저 별도로 보관하세요. 새로운 의존성이 생기면 출력된 목록과 `package.json`을 대조해야 합니다. `components.json`은 추가 CLI 작업을 위한 alias와 스타일 설정입니다. 상태 선택자와 스크롤 유틸리티는 `shadcn@4.22.1`의 공식 `tailwind.css`를 `src/styles/shadcn-variants.css`에 보관해 사용합니다.

| 경로 | 역할 |
| --- | --- |
| `src/data/shadcn-catalog.json` | 공식 목록 스냅샷 |
| `src/data/component-lab.ts` | 한국어 설명과 분류 |
| `src/components/lab-ui/` | 프로젝트에 복사한 실제 컴포넌트 소스 |
| `src/components/lab/ComponentDemo.tsx` | 66개 컴포넌트의 대표 동작 예시 |
| `src/components/lab/ComponentSource.tsx` | 실제 JSX/구현 소스 표시 및 복사 |
| `src/pages/ComponentLabPage.tsx` | 갤러리와 상세 화면 |
| `src/styles/index.css`, `src/styles/lab.css` | Tailwind 토큰 연결, CSS 레이어, 갤러리 스타일 |
| `scripts/sync-shadcn.py` | 공식 데이터/소스 수집·정규화 |

## 인터렉션 랩 (Magic UI)

2026-10-25 공식 `https://magicui.design/docs/components` 목록의 공개 목록에서 Bento Grid, Globe, Dotted Map, Cool Mode를 제외한 **73개 컴포넌트**를 수집했습니다. 원본 레지스트리 JSON과 MIT 라이선스를 `vendor/magicui/`에 보관하고 실제 React 소스를 `src/components/magic-ui/`에 포함합니다. Pro 템플릿은 수집 대상이 아닙니다.

- `/work/interaction-lab`: 컴포넌트 랩과 동일한 840px 컨테이너, 24px 그리드 간격, 분류 칩 우측 개수, 카드 하단 분류. 상단 메타·별도 검색창·카드 상단 레이블은 표시하지 않습니다.
- `/project/interaction-marquee` 등: 큰 미리보기, 초기화, 실제 예시와 소스 코드 표시/복사, 디자인 토큰, 공식 문서 링크.
- 전체 73개에 한국어 설명과 대표 동작 예시를 추가했습니다. 모든 옵션/variant를 복제한 문서는 아니며 전체 API는 공식 문서에서 확인합니다.
- 해당 메뉴에서 코드를 지연 로딩하고 화면에 보이는 카드만 예시를 마운트합니다. CSS 애니메이션은 `magic-` 이름으로 구분해 기존 shadcn/ui 효과와 충돌하지 않습니다.
- 모션 라이브러리는 사용자 모션 줄이기 설정을 전달받으며 공통 CSS도 해당 설정을 지원합니다. 일부 Canvas 효과는 별도 렌더링 루프를 사용하므로 화면 밖에서는 언마운트합니다.
- Tweet Card는 `MagicTweet`에 로컬 샘플 데이터를 전달합니다. 실제 X 게시글을 조회하지 않습니다. 목업·영상 예시는 직접 만든 SVG/MP4 데모 자산을 사용하며 단일 미리보기에도 포함합니다.
- 포인터/커서 효과는 예시 영역에서만 활성화합니다. Scroll Progress와 Text Reveal은 예시 안의 스크롤에 연결합니다. Theme Toggler는 사이트 테마 상태와 연결하며 영상 모달은 닫기·Esc·포커스 복원을 지원합니다.
- Code Comparison은 TypeScript/JavaScript/CSS/JSON과 두 GitHub 테마만 포함한 Shiki 하이라이터를 사용합니다. 별도 언어 파일을 외부에서 요청하지 않습니다.

```bash
npm run sync:interactions                  # 공식 목록/레지스트리 새로 수집
python3 scripts/sync-magicui.py --offline  # 보관한 레지스트리로 소스 재생성
npm run build
npm run build:preview
```

`src/data/magicui-catalog.json`은 제외 항목을 반영한 공식 목록 스냅샷, `src/data/interaction-lab.ts`는 한국어 설명/분류, `src/components/interaction/InteractionDemo.tsx`는 예시입니다. `scripts/magicui-adapters.py`는 Vite용 하이라이터, 스크롤 영역, 영상 포커스, 파티클 범위를 연결합니다. 원본은 `vendor/magicui/registry/`에 보존하며, 출처/수집 시각은 `manifest.json`에서 확인합니다. 제외한 네 항목은 갱신 시에도 다시 추가하지 않습니다. 동기화 후 새 항목·의존성·예시는 검토해야 하며 vendored 파일의 직접 수정은 재생성 때 덮어씁니다.

## 디자인 시스템 문서

Supabase Design System의 분류·미리보기·레퍼런스·사용 예시 구성을 참고하고, A+studio의 기존 App Shell과 디자인 토큰으로 구현했습니다. Supabase의 토큰·컴포넌트를 복사하지 않습니다.

- `/work/design-system`: 컬러, 타이포그래피, 스페이싱, 라운드, 레이아웃, 표면·깊이, 모션, 아이콘·브랜드, 아바타, 공통 UI, 테마 연결 — 11개 목록. 파운데이션/공통 UI/테마 필터를 제공합니다.
- 각 상세: 실제 예시 → 사용 규칙 → 값·사용 위치 → 복사 가능한 코드. 이전/다음 문서 이동과 문서 내 탐색을 지원합니다.
- `src/data/design-system.ts`는 원본 CSS를 raw import해 파운데이션 변수 49개, 갤러리 별칭 24개, Tailwind 매핑 39개를 직접 읽습니다. 총 112개는 변수의 **정의/매핑 수**이며 서로 다른 컬러 수가 아닙니다. 다크 모드의 재정의는 같은 변수의 값으로 표시합니다.
- 원본 CSS는 `tokens.css`, `index.css`; 실제 스타일 값은 `global.css`, `layout.css`, `pages.css`, `chat.css`, `lab.css`, `interaction.css`에서 추출합니다. 외부 컴포넌트 내부의 개별 효과 값은 각 랩의 소스에 보존합니다.
- 고정값·반응형 재정의를 CSS 변수와 구분해서 기록합니다. 기존 화면의 토큰 값이나 전역 스타일은 변경하지 않습니다.
- 컬러는 Light/Dark 쌍, 타이포그래피는 입력 가능한 문장과 실제 크기·굵기·행간, 모션은 420ms 슬라이드, 아바타는 실제 브랜드 및 Radix 컴포넌트로 확인할 수 있습니다.
- 원본 폰트 +2px 보정과 Tailwind 크기를 구분합니다. `--color-accent`(브랜드)와 shadcn `--accent`(옅은 표면)의 역할도 구분합니다.
- 이전 Color/Typography/Shape/Icons URL인 `/project/foundation-1`~`foundation-4`는 새 문서에 연결합니다. 새 항목은 `/project/system-spacing` 등으로 연결하고 헤더 검색에도 노출합니다.
- 페이지: `src/pages/DesignSystemPage.tsx`, 예시: `src/components/system/SystemPreviews.tsx`, 스타일: `src/styles/design-system.css`.

## 기존 포트폴리오 콘텐츠 이관

원본: https://portfolio2026-six-orcin.vercel.app/ (GitHub: austins-uiux/portfolio2026). 원본 사이트에 쓰기는 수행하지 않습니다.

- 대표 프로젝트 4개: SoMa AI, TADA Rider, TADA Driver, Monthly Kitchen. 프로젝트 소개, 기간·작업 범위·팀·역할·기여도, 모든 본문 및 이미지를 포함합니다. 원본 목록의 Monthly Kitchen과 원본 상세의 MONKi Kiosk 표기를 각각 유지합니다.
- 디자인 생각 6개: 원본 이미지, 카테고리, 작성자, 36개 본문 섹션과 강조를 유지합니다. 기존 임시 10개 항목을 실제 6개 글로 교체합니다.
- 총 73개 콘텐츠 섹션, 고유 이미지 자산 43개(움직이는 GIF 6개 포함). 정적 PNG는 WebP quality 93, 최대 너비 2732px로 최적화합니다. GIF/JPEG는 원본을 유지합니다. 정적 이미지를 자르지 않으며, 원본 URL·해시·규격과 변환 후 정보를 매니페스트에 기록합니다. 자산 총량은 약 17MiB입니다.
- 10개 상세 페이지는 같은 템플릿과 A+studio 토큰을 사용합니다. 첫 이미지, 프로젝트 소개·정보, 이미지와 본문, 이전/다음 글 순으로 표시합니다. 이미지에는 원본 비율과 크기를 지정하고 아래쪽 이미지는 지연 로딩합니다.
- 대표 프로젝트는 기존 2열, 디자인 생각은 이미지가 포함된 텍스트 리스트로 노출합니다. 검색은 전체 본문을 포함합니다.
- 편집: `src/data/portfolio-content.json`; 자산: `public/assets/portfolio/`; 출처: `vendor/portfolio-legacy/manifest.json`, `pages/*.html`, `index.html`.
- 선택적으로 `pip install lxml` 후 `python3 scripts/import-portfolio-content.py`를 실행하면 보관한 HTML에서 JSON을 재생성합니다. 본문·이미지 누락 검사를 포함합니다. 실행 시 방문자 네트워크 요청이나 외부 사이트 크롤링은 없습니다. JSON을 직접 편집한 경우 재생성하면 덮어쓰므로 주의합니다.
- 단일 파일 미리보기는 하위 폴더의 WebP/JPEG/GIF까지 포함하므로 외부 원본 사이트에 의존하지 않습니다.

## 내용 채우기

`src/data/portfolio.ts`의 `entries`를 수정하면 목록, 검색, 상세 페이지에 함께 반영됩니다. `id`는 공개 URL이므로 게시 후에는 가급적 유지하세요.

```ts
{
  id: 'soma-ai',
  category: 'featured',
  title: 'SOMA AI',
  meta: 'UI/UX · B2B SaaS · 2026',
  thumbnail: { src: '/assets/soma-cover.webp', alt: 'SOMA AI 프로젝트 화면' },
  sections: [
    {
      heading: '프로젝트 개요',
      body: '여기에 실제 프로젝트 내용을 입력하세요.',
      image: { src: '/assets/soma-overview.webp', alt: 'SOMA AI 주요 화면' },
    },
    { heading: '문제와 해결', body: '문제 정의와 설계 판단을 입력하세요.' },
  ],
}
```

실제 성과·지표는 임의로 채우지 않았습니다. 컴포넌트/인터렉션 랩을 제외한 반복된 SOMA AI 항목과 연도·분류는 Figma의 초안 콘텐츠입니다. 대표 프로젝트와 디자인 생각은 이관한 실제 콘텐츠를 사용합니다. UX 개선·아카이브의 미입력 항목에는 `본문 타이틀` / `본문글 텍스트`가 남아 있습니다. AI 워크플로우는 세 개의 Chip 문서를 사용합니다. OP.GG와 Retail & Insight는 채팅 추천 연결용 항목이며 목록에는 노출하지 않습니다. UX 시뮬레이션은 가상 데이터로 구분해 두었습니다.

## 인터랙션

- 좌측 접기 버튼 → 220px 사이드바가 61px로 접힙니다. 접힌 로고에 호버하거나 키보드 포커스를 주면 펼침 아이콘이 표시됩니다. 상태는 해당 브라우저에 저장됩니다.
- 우측 파란 아이콘 → 334px 채팅 패널이 본문 위로 슬라이드됩니다. 닫기·외부 클릭·Esc로 닫힙니다. 본문 폭을 채팅 너비만큼 줄이지 않습니다.
- 채팅은 Enter 전송, Shift+Enter 줄바꿈, 한글 조합 중 Enter 오작동 방지, 빈 메시지 방지, 중복 전송 방지, 추천 질문, 추천 항목 이동을 지원합니다.
- 검색은 이름·메타 정보·카테고리를 대상으로 동작합니다. Cmd/Ctrl+K로 검색창에 포커스를 주고 Enter로 전체 결과를 봅니다.
- 디자인 시스템의 필터는 다시 클릭하면 전체 색인으로 돌아갑니다. 원본 프레임을 따르기 위해 초기 색인에는 Color가 강조됩니다.
- 태양 아이콘으로 테마를 전환합니다. 다크 테마와 모바일·태블릿 레이아웃은 제공된 데스크톱 화면을 바탕으로 보완했습니다.
- 모바일 메뉴와 채팅은 키보드 포커스를 관리하며, 배경 클릭·탭 이동을 막고 닫으면 열었던 버튼으로 포커스를 돌려줍니다. 모션 줄이기 설정도 지원합니다.

## Gemini AI Chat 연결

- 모델 ID: `gemini-3.5-flash-lite`. `api/chat.ts`는 Vercel Node.js Web Standard Function입니다. 브라우저는 `/api/chat`만 호출하며 Gemini API 키는 서버에서만 읽습니다. 별도의 유료 DB·벡터 검색·LLM SDK를 추가하지 않았습니다.
- Vercel 프로젝트의 Settings → Environment Variables에 **`GEMINI_API_KEY`**를 등록한 뒤 재배포하세요. 실제 값은 GitHub·채팅·`VITE_*` 변수에 넣지 않습니다. `.env.example`은 비어 있는 예시입니다.
- 로컬에서는 `.env.example`을 `.env.local`로 복사해 키를 넣고 `npm run dev`를 실행합니다. Vite 미들웨어가 배포용과 동일한 서버 핸들러를 실행합니다. `vite preview`는 정적 빌드 확인 전용이므로 서버 API를 실행하지 않습니다.
- `GET /api/chat`은 키 존재 여부와 모델명만 반환합니다. 키 존재 여부가 모델 인증 성공을 뜻하지는 않습니다. UI는 실제 Gemini 응답 이후 `사용중`으로 전환합니다. 키 미설정·인증 실패·할당량 소진·네트워크 오류·25초 서버 타임아웃·콘텐츠 차단을 구분하고 재시도 및 응답 중지를 지원합니다. 오류를 데모 답변으로 대체하지 않습니다.
- `POST /api/chat`은 `{ "messages": [{ "role": "user", "content": "질문" }] }`를 받고 `{ "text": "답변", "attachments": [{ "entryId": "tada-rider" }], "model": { "id": "gemini-3.5-flash-lite", "name": "Gemini 3.5 Flash-Lite" } }`를 반환합니다.
- `scripts/build-chat-context.mjs`가 사이트에 쓰는 공개 콘텐츠 모듈을 그대로 읽어 `server/chat-knowledge.json`을 만듭니다. dev·build·build:preview 전에 자동 갱신합니다. 자료의 제목·본문·메타데이터를 검색해 관련 문서 최대 4개, 본문 최대 16,000자를 전달합니다. 공개 본문을 수정하면 재빌드하세요.
- 숨긴 아카이브·자리표시자 본문은 제외합니다. SoMa AI처럼 이미지 위주의 페이지는 이미지 속 수치·역할을 분석하지 않습니다. UX 초안과 UT Lab의 합성 시뮬레이션을 실제 조사 성과로 표현하지 않도록 지침에 명시합니다. 모델이 선택한 관련 항목 ID는 서버와 브라우저에서 실제 공개 항목 목록으로 검증합니다.
- 방문자의 질문과 최근 최대 12개 대화가 Google Gemini로 전송됩니다. 서버 코드에는 대화 저장·대화 내용 로깅이 없습니다. Google의 데이터 처리 정책은 사용하는 요금제에 따릅니다. 답변 길이는 2,048 출력 토큰, 입력은 질문당 2,000자·전체 16,000자·64KB 본문으로 제한합니다. 자동 재호출이나 다른 유료 모델로의 전환은 하지 않습니다.
- 분당 IP별 6회, 서버 인스턴스 전체 30회의 메모리 제한과 같은 출처 검사를 적용합니다. 이 제한은 인스턴스 재시작·다중 인스턴스에 걸친 통합 한도나 과금 상한이 아닙니다. 무료 운영은 AI Studio의 Free Tier·프로젝트 할당량으로 관리하며, 필요하면 Vercel Firewall에 통합 요청 제한을 추가하세요.
- `npm run check:chat`은 실제 API를 호출하지 않고 모의 전송으로 요청 형식·공개 자료·연속 대화·보안 검증·오류·중지·요청 제한을 검사합니다. 실제 키가 없는 상태에서는 Gemini 인증·실제 답변 품질을 검증했다고 간주하지 않습니다.
- `npm run build:preview`로 만드는 단일 HTML/ZIP은 서버가 없으므로 항상 **미리보기 · 데모 응답**을 표시합니다. 실제 AI는 Vercel 배포본 또는 키가 설정된 `npm run dev`에서 사용합니다.

공식 참고: [모델](https://ai.google.dev/gemini-api/docs/models/gemini-3.5-flash-lite), [API 키 보관](https://ai.google.dev/gemini-api/docs/generate-content/api-key), [구조화된 응답](https://ai.google.dev/gemini-api/docs/generate-content/structured-output), [가격·Free Tier](https://ai.google.dev/gemini-api/docs/pricing), [Vercel Node.js Functions](https://vercel.com/docs/functions/runtimes/node-js).

## GitHub → Vercel

1. 새 GitHub 저장소 또는 기존 저장소의 새 브랜치에 프로젝트 폴더 내용을 올립니다. 기존 HTML 사이트에 덮어쓰기 전에 브랜치에서 확인하세요.
2. Vercel에서 해당 GitHub 저장소를 Import합니다.
3. Framework는 **Vite**, Build Command는 **npm run build**, Output Directory는 **dist**로 사용합니다. 프로젝트를 저장소 하위 폴더에 넣었다면 Root Directory도 그 폴더로 지정합니다.
4. Node.js 24.x(또는 22.18 이상)를 선택하고 `GEMINI_API_KEY` 서버 환경변수를 등록한 후 배포합니다. 키를 나중에 등록했다면 재배포해야 합니다.
5. 첫 배포 후 `/project/soma-ai` 같은 상세 주소를 직접 열고 새로고침해 확인합니다. `vercel.json`이 `/api/`와 `/assets/`를 제외한 SPA 경로를 처리합니다. `/api/chat`은 JSON을 반환해야 하며 HTML이면 API 라우팅과 Root Directory를 확인하세요.

현재 단계에서는 소스와 설정을 준비했습니다. GitHub 원격 저장소 수정이나 Vercel 실제 배포는 실행하지 않았습니다.

## Figma 기준

파일: https://www.figma.com/design/H8qpv8RXRBvI6eGPeEFRUw/AI-Agentic-PW

| 화면 | node-id |
| --- | --- |
| Home | 1:5 |
| Sidebar minimized / hover | 30:2637 / 30:2542 |
| AI Chat default / typing | 1:338 / 30:3349 |
| AI Chat sent / answer | 26:425 / 26:551 |
| 대표 프로젝트 | 29:802 |
| UX 개선 사례 | 29:1018 |
| AI 워크플로우 | 29:1148 |
| 컴포넌트 랩 | 29:1278 |
| 인터렉션 랩 | 29:1408 |
| 디자인 시스템 | 29:1532 |
| 프로젝트 아카이브 | 29:1668 |
| 디자인 생각 | 29:1798 |
| 상세 템플릿 | 30:2288 |

## 검증

TypeScript 검사와 프로덕션 빌드, 브라우저에서 홈·8개 목록·공통 상세·직접 URL 새로고침·검색·테마·사이드바·채팅을 확인했습니다. 썸네일과 본문은 의도적으로 초안 상태입니다. 최종 콘텐츠 추가 후에는 카드 줄바꿈, 이미지 비율, 검색 결과, AI 응답을 다시 확인하세요.

## 홈 모션·페이지 스크롤 진행률

- 홈 히어로의 원본 245×45 SVG를 마스크로 사용하고 Magic UI Aurora Text의 keyframes를 10초 주기로 적용합니다. 라이트·다크에 공통 적용하며, CSS mask 미지원 시 기존 로고를 보여줍니다. 모션 줄이기 설정도 기존 공통 CSS로 지원합니다.
- `PageScrollProgress`는 헤더 아래 3px, `#C0E4FD → #148DDF` 그라데이션입니다. 문서에 실제 세로 스크롤이 있을 때만 표시하고, 스크롤 끝에서는 100%가 됩니다. 경로 변경·창 크기·지연 콘텐츠·이미지·폰트 로딩에 맞춰 다시 측정합니다. 사이드바 너비와 모바일 헤더에 맞춰 정렬합니다.
- 브랜드 규격 문구는 추가 5% 확대를 반영해 사이드바 91×17px, 접힌 로고 25×16px로 표기합니다. 실제 사이드바 SVG의 110.25% 배율을 사용합니다.
- Icons & Brand의 흰색 Send는 파란 원형 배경으로 표시하며, UI Patterns 하단의 컴포넌트 랩 링크는 제거했습니다.

## 목록·홈 카드·Accordion 간격 보정

디자인 시스템 목록 하단의 변수 개수 안내와 구분선을 제거했습니다. 목록 필터, 카드 분류, 공통 UI 예시의 용어는 파운데이션으로 통일합니다. 홈 카드의 일반 썸네일은 1:1이며 대표 프로젝트 카드는 552:264 비율입니다. 카드 높이는 콘텐츠에 맞게 늘어납니다. 컴포넌트 랩 Accordion 예시는 각 항목에 위아래 10px 패딩을 추가하며 기존 좌우 10px 패딩은 유지합니다.

## 히어로·사이드바·프로젝트 이미지 보정

- 히어로 배경은 라이트 #0A304B, 다크 #000000이며, 설명은 두 테마 모두 #FFFFFF입니다. 전용 색상 변수로 문서에 반영합니다.
- 사이드바 상단 로고는 기존 105% 크기에서 다시 5% 확대(원본 기준 110.25%)합니다. 프로필 아바타는 유지합니다.
- 대표 프로젝트의 4개 썸네일은 모든 화면 크기에서 정사각형으로 표시합니다.
- AI 패널은 334px(기존보다 20px 증가), 좌우 패딩은 각각 12px입니다. 좁은 모바일에서는 기존 전체 너비 규칙을 유지합니다.
- 0바이트였던 SoMa 14/15, TADA Rider Pending 02, Design Thinking 06 이미지를 검증된 원본에서 복구했습니다.
- `npm run check:assets`는 모든 미디어의 크기·시그니처와 43개 이관 이미지의 SHA-256을 검사합니다. 일반 빌드와 미리보기 빌드에서도 자동 실행되어 빈 파일이나 손상이 있으면 중단합니다.

## 기본 테마와 AI 워크플로우 문서

- 첫 방문은 다크 모드이며 기존 방문자가 직접 선택한 라이트/다크 모드는 유지합니다. 초기 HTML에서 저장된 테마를 적용하므로 첫 화면의 밝은 깜박임을 방지합니다.
- AI 워크플로우는 별도 카드 목록이나 상세 템플릿 없이 `/work/ai-workflow`에서 읽습니다. 기존 + 심볼·제목·설명을 유지하고 세 개의 Chip으로 4단계 문서를 전환합니다.
- 공유 가능한 주소: `?flow=idea-to-screen`, `?flow=design-to-ux`, `?flow=design-to-code`. 선택은 새로고침·브라우저 뒤로/앞으로 이동에도 유지합니다.
- 콘텐츠는 `src/data/ai-workflow.ts`, 화면은 `src/pages/AiWorkflowPage.tsx`에서 수정합니다. 검색과 채팅 추천은 해당 Chip 문서로 바로 이동합니다.
- 예전 `/project/service-planning`, `/project/uiux-design`, `/project/ai-development`, `/project/deployment` 주소는 대응하는 통합 문서 주소로 교체합니다. 다른 카테고리의 상세 페이지는 기존 구조를 유지합니다.

## 도구 로고와 내비게이션 정리

- AI 워크플로우 Chip 아래 소개 문구를 제거하고 Figma, ChatGPT, Codex, React, Astryx, shadcn/ui, TypeScript, GitHub, Vercel 로고를 순서대로 표시합니다.
- 자산과 화면 표시 크기는 30×30 RGBA PNG입니다. 그림 비율을 유지한 투명 캔버스를 사용하며 좌측 정렬·간격 8px·모바일 줄바꿈을 적용합니다. 흑백 마크는 테마별 이미지로 표시합니다.
- `src/data/ai-workflow.ts`의 `workflowTools`에서 순서와 파일을 관리합니다. `public/assets/workflow-tools/`에 PNG, `vendor/workflow-brands/`에 출처·원본·라이선스를 보관합니다. 로고는 각 브랜드 소유이며 도구 소개 용도입니다.
- 프로젝트 아카이브 카테고리와 항목은 `src/data/portfolio.ts`에서 삭제하지 않고 주석으로 보관했습니다. 메뉴·홈 카드·검색·채팅 추천과 직접 URL에는 표시되지 않습니다.
- 복원하려면 해당 카테고리·entries의 주석을 해제하고 `Sidebar.tsx`의 원하는 그룹에 `archive`를 추가합니다. 채팅의 보관 추천 항목도 필요할 때 복구할 수 있습니다.
- 사이드바: 홈·대표 프로젝트·UX 개선 사례·AI 워크플로우 / 디자인 시스템·컴포넌트 랩·인터렉션 랩 / 디자인 생각. 그룹 사이에 구분선을 사용하며 접힌 상태와 모바일에서도 같은 순서를 유지합니다.

## 통합 UT Lab

- UX 개선 사례 헤더 우측의 UT Lab CTA는 14px, 1px 테두리, 4px 라운드와 호버 효과를 사용합니다.
- 버튼은 최대 1280px의 native dialog를 열며, 모바일에서는 전체 화면을 사용합니다. 헤더 좌측은 공통 A+studio SVG + 얇은 1px UT Lab 배지입니다. 내부 사이드바·히어로·개요 통계는 제거하고 테스트 설계부터 시작합니다.
- 원본 도구의 v0.2를 native React·TypeScript로 이관했습니다. 화면은 `src/components/ut/UtLabModal.tsx`, 데이터는 `src/data/ut-lab-data.ts`, 순수 계산 로직은 `src/lib/ut-lab-engine.ts`, 스타일은 `src/styles/ut-lab.css`입니다. 원본 스냅샷과 출처는 `vendor/ut-lab-original/`에 보관합니다.
- PNG/JPG/WEBP 최대 3장(각 10MB), 드래그·클릭 업로드, 실제 이미지 디코딩 검증, 삭제·교체, 문제 입력, 서비스 대·소분류, 로컬 샘플, 30개 합성 페르소나 상세, 지표·분포·마찰 요인·VOC·결과 필터·개선 가설·Before/After 개념 예시를 지원합니다.
- JSON 다운로드는 필터와 관계없이 30명의 전체 결과를 포함합니다. 인쇄용 스타일을 포함합니다. 입력 변경 시 이전 결과를 무효화합니다. 닫았다 열면 입력은 유지하고 테스트 설계부터 표시합니다. Esc·배경 클릭·닫기 버튼을 지원하고, 포커스와 배경 스크롤을 복원합니다. 이미지는 Object URL로만 처리하며 교체·페이지 이탈 시 해제합니다.
- 원본과 동일한 규칙 기반 합성 시뮬레이터입니다. 화면 픽셀을 해석하는 LLM·자동 클릭·실제 사용자 조사·GA·통계적 A/B 테스트는 연결하지 않았습니다. 이미지 내용 대신 문제 유형·서비스 유형·화면 수와 사전 정의된 성향으로 계산합니다. 원본 호스팅 사이트는 수정하지 않았습니다.
- `npm run check:utlab`은 원본 엔진과 120개 조건(8개 대분류 × 5개 문제 × 1~3장)의 결과 일치, 30명 합계, 잘못된 입력 거부를 검사합니다.

## 홈 카드와 히어로 최종 조정

- Figma `29:623` 기준: 840px 컨테이너, 3열·24px 간격, 첫 줄의 대표 프로젝트는 두 칸을 차지합니다. 썸네일 아래에 20px 여백의 제목·설명을 배치합니다. 기존 +2px 타이포 보정은 유지합니다.
- 히어로 로고만 20% 확대해 294×54px로 표시합니다. 콘텐츠 위아래 여백을 각각 50px 늘려 데스크톱 153px, 모바일 147.5px로 설정합니다. 배경은 콘텐츠 높이에 맞춰 확장되며 설명 글자 크기와 테마별 색상은 유지합니다.
- 홈 썸네일은 TADA Rider 첫 상세 이미지, UT Lab의 실제 Before/After 예시, 도구 로고 3×3, Card 예시, Dia Text Reveal 모션, Color 아트워크, ‘좋은 UX는 보이지 않는다’ 썸네일을 사용합니다.
- Card·Color·Dia 모션·UT After 예시는 각 페이지와 공유 컴포넌트로 관리합니다. 홈 Dia 모션은 화면 근처에서만 마운트하며 모션 줄이기 설정을 따릅니다. 홈 카드 전체 링크 안에는 중첩 버튼을 두지 않습니다.
- 도구 로고 14개 파일(테마별 대체 포함)은 실제 30×30 RGBA PNG이며 워크플로우 행의 간격은 8px입니다.
