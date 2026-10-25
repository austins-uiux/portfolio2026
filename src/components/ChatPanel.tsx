import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { useDialog } from '../hooks/useDialog';
import { ChatRequestError, chatMode, chatModel, getChatStatus, requestChat } from '../lib/chat';
import { AppLink } from '../lib/router';
import { entryHref } from '../data/portfolio';
import type { ChatMessage } from '../types';
import { Icon, IconButton } from './ui';

const initialTopics = ['신규 서비스 경험', 'UX 개선', 'VOC 개선', '디자인 시스템'];
const followupTopics = ['신규 서비스 경험', 'VOC 개선', 'AI 프로젝트', '디자인 시스템'];
let messageSequence = 0;
const messageId = () => `message-${Date.now()}-${++messageSequence}`;

export function ChatPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [connection, setConnection] = useState<'checking' | 'ready' | 'connected' | 'unconfigured' | 'error'>('checking');
  const panel = useRef<HTMLElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const thread = useRef<HTMLDivElement>(null);
  const controller = useRef<AbortController | null>(null);
  const busy = useRef(false);
  useDialog(open, panel, onClose);
  useEffect(() => () => controller.current?.abort(), []);
  useEffect(() => { if (open && thread.current) thread.current.scrollTop = thread.current.scrollHeight; }, [open, messages, pending]);
  useEffect(() => {
    if (!open || chatMode === 'demo') return;
    const request = new AbortController();
    void getChatStatus(request.signal).then(status => {
      if (!request.signal.aborted) setConnection(current => current === 'connected' ? current : status.configured ? 'ready' : 'unconfigured');
    }).catch(() => { if (!request.signal.aborted) setConnection(current => current === 'connected' ? current : 'error'); });
    return () => request.abort();
  }, [open]);

  async function reply(history: ChatMessage[]) {
    if (busy.current) return;
    if (controller.current && !controller.current.signal.aborted) controller.current.abort();
    const request = new AbortController();
    controller.current = request;
    busy.current = true;
    setPending(true); setError('');
    try {
      const response = await requestChat(history, request.signal);
      if (!request.signal.aborted) {
        setMessages(current => [...current, { id: messageId(), role: 'assistant', ...response }]);
        if (response.model) setConnection('connected');
      }
    } catch (cause) {
      if (!request.signal.aborted) {
        setError(cause instanceof Error ? cause.message : '연결을 확인하고 다시 시도해 주세요.');
        if (cause instanceof ChatRequestError && cause.code === 'NOT_CONFIGURED') setConnection('unconfigured');
        else if (cause instanceof ChatRequestError && cause.code === 'PROVIDER_CONFIGURATION') setConnection('error');
      }
    } finally { if (controller.current === request) { busy.current = false; setPending(false); } }
  }
  function stop() { controller.current?.abort(); busy.current = false; setPending(false); setError('응답을 중지했어요. 다시 시도하거나 새 질문을 보내세요.'); }

  function send(text = draft) {
    const value = text.trim();
    if (!value || busy.current || value.length > 2000) return;
    const history: ChatMessage[] = [...messages, { id: messageId(), role: 'user', text: value }];
    setMessages(history); setDraft(''); void reply(history); input.current?.focus();
  }
  function submit(event: FormEvent) { event.preventDefault(); send(); }
  function keydown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); send(); }
  }
  return <>
    {open && <button className="chat-backdrop" type="button" aria-label="AI Chat 닫기" tabIndex={-1} onClick={onClose} />}
    <aside id="ai-chat" ref={panel} className={`chat-panel ${open ? 'is-open' : ''}`} role="dialog" aria-modal={open || undefined} aria-labelledby="chat-title" aria-hidden={!open} inert={!open} tabIndex={-1}>
      <header className="chat-header"><h2 id="chat-title" className="sr-only">A+ AI Chat</h2><span className="chat-mode">{chatMode === 'demo' ? '미리보기 · 데모 응답' : connection === 'connected' ? `${chatModel.name} 사용중` : `${chatModel.name} · ${{ checking: '연결 확인 중', ready: '연결 준비', unconfigured: '연결 준비 중', error: '연결 확인 필요' }[connection]}`}</span><IconButton label="AI Chat 닫기" onClick={onClose}><Icon name="close" /></IconButton></header>
      {!messages.length ? <div className="chat-welcome"><img src="/assets/chat-Vector.svg" width="44" height="44" alt="" /><p>안녕하세요, AI 에이전트 A+입니다.<br />AI 네이티브 프로덕트 디자이너 Austin의 프로젝트,<br />AI 활용 능력, 디자인 철학 등 포트폴리오 내용에<br />대해 물어보세요.</p></div> : <div className="chat-thread" ref={thread} role="log" aria-label="A+와의 대화" aria-live="polite" aria-busy={pending}>
        {messages.map(message => <div key={message.id} className={`chat-message chat-message--${message.role}`}>{message.role === 'assistant' && <img className="agent-mark" src="/assets/chat-Agent.svg" width="20" height="20" alt="A+" />}<div className="message-bubble"><p>{message.text}</p>{message.attachments?.length ? <div className="chat-attachments">{message.attachments.map(attachment => <AppLink key={attachment.entryId} href={entryHref(attachment.entryId)} onClick={onClose} className="chat-attachment">{attachment.thumbnail && <img className="attachment-thumbnail" src={attachment.thumbnail} width="42" height="28" alt="" />}<div><strong>{attachment.title}</strong><span>{attachment.description}</span></div><Icon name="external" /></AppLink>)}</div> : null}</div></div>)}
        {pending && <div className="chat-message chat-message--assistant"><img className="agent-mark" src="/assets/chat-Agent.svg" width="20" height="20" alt="" /><div className="message-bubble typing-indicator" role="status" aria-label="응답 준비 중"><span /><span /><span /></div></div>}
        {error && <div className="chat-error" role="alert"><p>{error}</p><button type="button" onClick={() => void reply(messages)}>다시 시도</button></div>}
      </div>}
      <div className="chat-composer"><div className="suggested-topics" aria-label="추천 질문">{(messages.length ? followupTopics : initialTopics).map(topic => <button type="button" key={topic} disabled={pending} onClick={() => send(topic)}>{topic}</button>)}</div><form className="message-input" onSubmit={submit}><label htmlFor="chat-draft" className="sr-only">궁금한 점을 물어보세요</label><textarea ref={input} id="chat-draft" value={draft} onChange={event => setDraft(event.target.value)} onKeyDown={keydown} placeholder="궁금한 점을 물어보세요" rows={1} maxLength={2000} /><div className="message-input-actions">{pending ? <button type="button" className="send-button" onClick={stop} aria-label="응답 중지" title="응답 중지"><Icon name="close" /></button> : <button type="submit" className="send-button" disabled={!draft.trim()} aria-label="메시지 보내기" title="메시지 보내기"><Icon name="send" /></button>}</div></form>{chatMode === 'live' && <p className="chat-privacy">질문과 최근 대화가 Google Gemini로 전송됩니다.<br />답변에 오류가 있을 수 있어요.</p>}</div>
    </aside>
  </>;
}
