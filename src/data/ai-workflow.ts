export const workflowTools: { name: string; src: string; dark?: string }[] = [
  { name: 'Figma', src: '/assets/workflow-tools/figma.png' },
  { name: 'ChatGPT', src: '/assets/workflow-tools/chatgpt.png', dark: '/assets/workflow-tools/chatgpt-dark.png' },
  { name: 'Codex', src: '/assets/workflow-tools/codex.png', dark: '/assets/workflow-tools/codex-dark.png' },
  { name: 'React', src: '/assets/workflow-tools/react.png' },
  { name: 'Astryx', src: '/assets/workflow-tools/astryx.png' },
  { name: 'shadcn/ui', src: '/assets/workflow-tools/shadcn.png', dark: '/assets/workflow-tools/shadcn-dark.png' },
  { name: 'TypeScript', src: '/assets/workflow-tools/typescript.png' },
  { name: 'GitHub', src: '/assets/workflow-tools/github.png', dark: '/assets/workflow-tools/github-dark.png' },
  { name: 'Vercel', src: '/assets/workflow-tools/vercel.png', dark: '/assets/workflow-tools/vercel-dark.png' },
];

/** Edit workflow copy here. Each chip has a shareable URL on the same document. */
export const workflows = [
  {
    id: 'idea-to-screen',
    label: '아이디어 → 화면 설계',
    title: '자연어로 시작한 아이디어를 구체적인 화면으로',
    description: 'ChatGPT와 기획·개발·디자인 관점의 논의를 거쳐 요구사항을 정리합니다. 확정한 PRD를 바탕으로 와이어프레임을 반복해서 개선하고, Figma에서 UI 디자인과 디자인 시스템을 구체화합니다.',
    steps: [
      { title: '아이디어 구체화', body: '자연어로 아이디어와 문제 상황을 설명하고, 구현 가능성·사용자 흐름·기능 범위를 논의하며 PRD를 확정합니다.' },
      { title: '와이어프레임 설계', body: 'PRD를 바탕으로 HTML·CSS 형태의 와이어프레임 초안을 생성합니다. 화면 구성과 흐름을 확인하며 여러 차례 수정합니다.' },
      { title: 'Figma UI 디자인', body: '확정한 와이어프레임을 바탕으로 Figma에서 UI를 디자인합니다. 디자인 시스템을 고려해 컴포넌트와 시각적 규칙을 적용합니다.' },
      { title: '디자인 시스템 정리', body: 'Figma AI에 프레임 전반의 디자인 토큰을 Variables로 정리하도록 요청하고, 디자인 시스템 문서화에도 활용합니다.' },
    ],
  },
  {
    id: 'design-to-ux',
    label: '피그마 디자인 → UX 개선안',
    title: '팀의 논의에 AI의 검토를 더해 디자인 개선하기',
    description: 'Figma에서 여러 디자인 대안을 만들고 팀원들과 논의하며 개선합니다. 이후 Figma MCP로 연결한 ChatGPT의 UX 피드백을 참고해 최종안을 다듬습니다.',
    steps: [
      { title: '디자인 대안 탐색', body: '화면 구성과 인터랙션에 대한 여러 디자인 대안을 제작합니다.' },
      { title: '팀 피드백 반영', body: '팀원들과 사용자 흐름과 사용성을 논의하고, 피드백을 반영해 디자인을 개선합니다.' },
      { title: 'AI를 통한 UX 검토', body: 'Figma MCP로 디자인을 연결하고, ChatGPT에 화면의 맥락과 검토할 쟁점을 전달해 추가적인 개선 의견을 받습니다.' },
      { title: '최종안 확정', body: '팀의 논의와 AI의 제안을 비교하고, 제품의 목적과 제약에 맞는 개선안을 선택해 최종 디자인에 반영합니다.' },
    ],
  },
  {
    id: 'design-to-code',
    label: '디자인 → 코드',
    title: '디자인을 브라우저에서 동작하는 결과물로',
    description: 'Figma MCP로 연결한 ChatGPT를 활용해 디자인을 코드로 구현합니다. 자연어로 수정 사항을 전달하며 결과물을 다듬고, GitHub와 Vercel을 통해 배포합니다.',
    steps: [
      { title: '디자인 맥락 전달', body: 'Figma MCP를 통해 화면과 컴포넌트 정보를 전달하고, 구현할 범위와 동작을 설명합니다.' },
      { title: '코드 생성', body: '작업 목적에 따라 React·TypeScript 또는 HTML·CSS·JavaScript로 구현합니다.' },
      { title: '반복 수정', body: '구현 화면을 확인하고, 디자인과의 차이와 동작 개선 사항을 자연어로 전달하며 코드를 수정합니다.' },
      { title: '코드 관리와 배포', body: '완성한 코드를 GitHub에서 관리하고 Vercel로 배포합니다. 필요에 따라 디자인 시스템을 별도의 웹 문서로 확장할 수 있습니다.' },
    ],
  },
] as const;

export const getWorkflow = (id: string | null) => workflows.find(item => item.id === id) ?? workflows[0];
export const workflowHref = (id: string) => `/work/ai-workflow?flow=${id}`;
const legacyWorkflowIds: Record<string, string> = {
  'service-planning': 'idea-to-screen',
  'uiux-design': 'design-to-ux',
  'ai-development': 'design-to-code',
  deployment: 'design-to-code',
};
export function workflowFromEntryId(id: string) {
  return workflows.find(item => `workflow-${item.id}` === id || item.id === legacyWorkflowIds[id]);
}
