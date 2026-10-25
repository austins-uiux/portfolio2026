import type { ChatAttachment, ChatMessage } from '../types';
import { getEntry } from '../data/portfolio';
import { chatModel, CHAT_MAX_MESSAGES, CHAT_MAX_REPLY, type ChatStatus, type ChatTurn } from './chat-contract';

export interface ChatReply { text: string; attachments?: ChatAttachment[]; model?: typeof chatModel }
export { chatModel };
export const chatMode = import.meta.env.VITE_STANDALONE_PREVIEW === 'true' ? 'demo' : 'live';
export class ChatRequestError extends Error {
  constructor(message: string, public code: string) { super(message); }
}

const recommendations: ChatAttachment[] = [
  { entryId: 'soma-ai', title: 'SoMa AI', description: 'AI 기반 비즈니스 운영 플랫폼', thumbnail: getEntry('soma-ai')?.thumbnail?.src },
  { entryId: 'tada-rider', title: 'TADA Rider / Driver', description: '동남아 모빌리티 슈퍼앱', thumbnail: '/assets/chat-tada.png' },
  // 보관: { entryId: 'opgg-desktop', title: 'OP.GG Desktop App', description: '게이머를 위한 데스크탑 앱', thumbnail: '/assets/chat-opgg.png' },
  // 보관: { entryId: 'retail-insight', title: 'Retail & Insight', description: '리테일 데이터 기반 인사이트', thumbnail: '/assets/chat-retail.png' },
];

function demoReply(question: string): ChatReply {
  if (/디자인\s*시스템|토큰|컴포넌트/i.test(question)) return { text: '디자인 시스템에서는 컬러, 타이포그래피, 간격, 라운드와 공통 UI 규칙을 살펴볼 수 있어요. 라이트·다크 테마와 컴포넌트 랩에서 쓰는 토큰도 함께 정리했습니다. 이 답변은 미리보기용 데모입니다.', attachments: [{ entryId: 'foundation-1', title: '디자인 시스템', description: 'Color · Typography · Shape · Icons · Components' }] };
  if (/ux|사용성|voc|개선/i.test(question)) return { text: 'UX 개선 사례에서는 문제 정의, 개선 가설, 검증 방법을 정리할 예정이에요. AI 페르소나 시뮬레이션 결과는 가상 데이터로 구분하며, 실제 사용자 테스트나 성과 수치로 제시하지 않습니다.', /* UX 개선 사례 카드 복원 시 첨부도 복원: attachments: [{ entryId: 'soma-ux', title: 'SOMA AI · UX 개선', description: '문제 정의와 가설 검증 방법' }] */ };
  if (/ai|인공지능|워크플로우|기획|배포|개발/i.test(question)) return { text: '아이디어 → 화면 설계, 피그마 디자인 → UX 개선안, 디자인 → 코드의 세 가지 작업 방식을 정리했어요. 각 Chip에서 AI와 협업하는 구체적인 네 단계를 살펴볼 수 있습니다.', attachments: [{ entryId: 'workflow-idea-to-screen', title: '아이디어 → 화면 설계', description: 'PRD부터 Figma 디자인 시스템까지' }, { entryId: 'workflow-design-to-code', title: '디자인 → 코드', description: 'Figma MCP부터 GitHub·Vercel 배포까지' }] };
  if (/프로젝트|경험|tada|op.gg|리테일|대표|자신/i.test(question)) return { text: '대표 프로젝트에서 SoMa AI, TADA Rider, TADA Driver, Monthly Kitchen을 살펴볼 수 있어요. 프로젝트별 화면과 문제 해결 과정을 확인해 보세요.', attachments: recommendations };
  return { text: 'Austin의 프로젝트, UX 개선, AI 워크플로우와 디자인 시스템을 둘러볼 수 있어요. 어떤 작업이 궁금하신가요? 현재 채팅은 화면과 탐색 동작을 확인하는 데모 응답 모드입니다.', attachments: [recommendations[0]] };
}

async function apiRequest(init: RequestInit, signal: AbortSignal, timeout = 30000) {
  const controller = new AbortController();
  const abort = () => controller.abort();
  signal.addEventListener('abort', abort, { once: true });
  if (signal.aborted) controller.abort();
  const timer = setTimeout(abort, timeout);
  try {
    const response = await fetch('/api/chat', { ...init, signal: controller.signal });
    const data: unknown = await response.json().catch(() => null);
    if (!response.ok) {
      const error = data as { error?: unknown; code?: unknown } | null;
      throw new ChatRequestError(typeof error?.error === 'string' ? error.error : 'AI에 연결하지 못했어요. 잠시 후 다시 시도해 주세요.', typeof error?.code === 'string' ? error.code : 'CONNECTION_FAILED');
    }
    return data;
  } catch (error) {
    if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
    if (controller.signal.aborted) throw new ChatRequestError('응답 시간이 길어지고 있어요. 다시 시도해 주세요.', 'TIMEOUT');
    if (error instanceof ChatRequestError) throw error;
    throw new ChatRequestError('AI에 연결하지 못했어요. 인터넷 연결을 확인하고 다시 시도해 주세요.', 'CONNECTION_FAILED');
  } finally { clearTimeout(timer); signal.removeEventListener('abort', abort); }
}

export async function getChatStatus(signal: AbortSignal): Promise<ChatStatus> {
  const data = await apiRequest({ method: 'GET', cache: 'no-store' }, signal, 8000) as Partial<ChatStatus> | null;
  if (typeof data?.configured !== 'boolean' || data.model?.id !== chatModel.id) throw new ChatRequestError('AI 연결 상태를 확인하지 못했어요.', 'INVALID_RESPONSE');
  return { configured: data.configured, model: chatModel };
}

/** Send only recent conversation text to the same-origin server, never credentials. */
export async function requestChat(messages: ChatMessage[], signal: AbortSignal): Promise<ChatReply> {
  if (chatMode === 'demo') {
    await new Promise<void>((resolve, reject) => {
      if (signal.aborted) { reject(new DOMException('Aborted', 'AbortError')); return; }
      const abort = () => { clearTimeout(timer); reject(new DOMException('Aborted', 'AbortError')); };
      const timer = setTimeout(() => { signal.removeEventListener('abort', abort); resolve(); }, 650);
      signal.addEventListener('abort', abort, { once: true });
    });
    return demoReply(messages.at(-1)?.text ?? '');
  }
  const history: ChatTurn[] = messages.slice(-CHAT_MAX_MESSAGES).map(({ role, text }) => ({ role, content: text.slice(0, role === 'assistant' ? CHAT_MAX_REPLY : 2000) }));
  while (history[0]?.role === 'assistant' || (history.length > 1 && history.reduce((n,m)=>n+m.content.length,0)>16000)) history.shift();
  const data = await apiRequest({ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: history }) }, signal);
  if (!data || typeof data !== 'object' || !('text' in data) || typeof data.text !== 'string' || !data.text.trim()) throw new Error('응답 형식을 확인할 수 없어요. 다시 시도해 주세요.');
  const reply = data as { text: string; attachments?: unknown[]; model?: { id?: string } };
  if (reply.text.length > CHAT_MAX_REPLY || reply.model?.id !== chatModel.id) throw new ChatRequestError('AI 응답 형식을 확인할 수 없어요. 다시 시도해 주세요.', 'INVALID_RESPONSE');
  const attachments = Array.isArray(reply.attachments) ? reply.attachments.flatMap(item => {
    if (!item || typeof item !== 'object' || !('entryId' in item) || typeof item.entryId !== 'string') return [];
    const entry = getEntry(item.entryId);
    return entry && entry.category !== 'archive' ? [{ entryId: entry.id, title: entry.title, description: entry.meta, thumbnail: entry.thumbnail?.src }] : [];
  }).filter((item,index,items)=>items.findIndex(other=>other.entryId===item.entryId)===index).slice(0,3) : undefined;
  return { text: reply.text, attachments, model: chatModel };
}
