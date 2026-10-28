# A+studio · AI Agentic Portfolio

## 소개

AI 네이티브 프로덕트 디자이너 Austin의 포트폴리오입니다. 실무 프로젝트, UX 개선 사례, AI 활용 과정, 디자인 시스템과 디자인에 대한 생각을 소개합니다.

[사이트 바로가기](https://portfolio2026-six-orcin.vercel.app/)

## 주요 기능

- **한·영 전환:** 페이지와 검색을 한국어·영어로 전환
- **테마:** 라이트·다크 모드 지원
- **검색:** 프로젝트, 글, 디자인 자료 통합 검색
- **AI Chat:** 공개된 포트폴리오 콘텐츠를 바탕으로 질문에 답변
- **갤러리:** 직접 조작할 수 있는 컴포넌트·인터랙션 예제와 소스 코드
- **UT Lab:** 합성 페르소나를 활용해 UX 개선 가설 탐색. 실제 사용자 조사 결과가 아닌 가상 데이터 사용

## 기술 스택과 로컬 실행

React 19 · TypeScript · Vite · Tailwind CSS · Gemini API · Vercel

Node.js 22.12 이상이 필요합니다.

```bash
npm ci
npm run dev
```

AI Chat을 로컬에서 사용하려면 `.env.example`을 `.env.local`로 복사하고 `GEMINI_API_KEY`를 설정합니다.

```bash
npm run build    # 프로덕션 빌드
npm run preview  # 빌드 결과 확인
```

## 외부 라이브러리 출처·라이선스

| 라이브러리 | 사용 영역 | 라이선스 |
| --- | --- | --- |
| [shadcn/ui](https://ui.shadcn.com/) | 컴포넌트 갤러리 | [MIT](vendor/shadcn/LICENSE.md) |
| [Magic UI](https://magicui.design/) | 인터랙션 갤러리 | [MIT](vendor/magicui/LICENSE.md) |
| [Lobe Icons](https://github.com/lobehub/lobe-icons) | AI 워크플로우 브랜드 아이콘 | [MIT](vendor/workflow-brands/LOBE-ICONS-LICENSE.txt) |
| [SVGL](https://svgl.app/) | AI 워크플로우 브랜드 아이콘 | [MIT](vendor/workflow-brands/SVGL-LICENSE.txt) |

그 외 의존성은 [package.json](package.json)에 정리되어 있으며, 각 패키지의 라이선스가 적용됩니다.
