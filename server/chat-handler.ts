import { createHash } from 'node:crypto';
import { chatModel, CHAT_MAX_INPUT, CHAT_MAX_MESSAGES, CHAT_MAX_REPLY, type ChatTurn } from '../src/lib/chat-contract.ts';
import { buildSystemInstruction, knownEntryIds } from './chat-context.ts';

const MAX_BODY_BYTES = 64000;
const MAX_HISTORY_CHARS = 16000;
const WINDOW_MS = 60000;
export class ChatFailure extends Error {
  status: number;
  code: string;
  retryAfter?: number;
  constructor(status: number, code: string, message: string, retryAfter?: number) { super(message);this.status=status;this.code=code;this.retryAfter=retryAfter; }
}
type Dependencies = { apiKey?: () => string | undefined; fetch?: typeof fetch; now?: () => number; timeoutMs?: number };

/** Bounded, per-instance guard; Vercel Firewall/provider quotas cover distributed traffic. */
function createLimiter(now: () => number) {
  let windowStart=now(), total=0;
  const clients=new Map<string,number>();
  return (request: Request) => {
    const time=now();
    if(time-windowStart>=WINDOW_MS) { windowStart=time; total=0; clients.clear(); }
    const ip=request.headers.get('x-vercel-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'local';
    const key=createHash('sha256').update(ip).digest('hex');
    if(total>=30 || (clients.get(key)??0)>=6) throw new ChatFailure(429,'RATE_LIMITED','잠시 질문이 많아요. 1분 뒤 다시 시도해 주세요.',Math.max(1,Math.ceil((WINDOW_MS-time+windowStart)/1000)));
    total++; clients.set(key,(clients.get(key)??0)+1);
  };
}
function reply(body: unknown, status=200, extra: Record<string,string>={}) {
  return Response.json(body,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...extra}});
}
function checkOrigin(request: Request) {
  const origin=request.headers.get('origin');
  if(request.headers.get('sec-fetch-site')==='cross-site' || !origin || origin!==new URL(request.url).origin) throw new ChatFailure(403,'FORBIDDEN','이 사이트에서 다시 질문해 주세요.');
}
async function readMessages(request: Request): Promise<ChatTurn[]> {
  if(!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) throw new ChatFailure(415,'INVALID_CONTENT_TYPE','질문을 전송하는 형식을 확인해 주세요.');
  if(Number(request.headers.get('content-length'))>MAX_BODY_BYTES) throw new ChatFailure(413,'BODY_TOO_LARGE','대화가 너무 길어요. 짧게 나눠 질문해 주세요.');
  const reader=request.body?.getReader();
  if(!reader) throw new ChatFailure(400,'INVALID_MESSAGES','질문을 입력해 주세요.');
  let size=0; const chunks:Uint8Array[]=[];
  try { while(true) { const {done,value}=await reader.read(); if(done)break; size+=value.byteLength; if(size>MAX_BODY_BYTES){await reader.cancel();throw new ChatFailure(413,'BODY_TOO_LARGE','대화가 너무 길어요. 짧게 나눠 질문해 주세요.');}chunks.push(value); } } finally { reader.releaseLock(); }
  let body:unknown;
  try { body=JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { throw new ChatFailure(400,'INVALID_JSON','질문을 다시 전송해 주세요.'); }
  if(!body || typeof body!=='object' || !('messages' in body) || !Array.isArray(body.messages) || !body.messages.length || body.messages.length>CHAT_MAX_MESSAGES) throw new ChatFailure(400,'INVALID_MESSAGES','질문을 입력하거나 대화 길이를 줄여 주세요.');
  const messages:ChatTurn[]=[]; let chars=0;
  for(const item of body.messages) {
    if(!item || typeof item!=='object' || !['user','assistant'].includes(item.role) || typeof item.content!=='string' || !item.content.trim() || item.content.length>(item.role==='user'?CHAT_MAX_INPUT:CHAT_MAX_REPLY)) throw new ChatFailure(400,'INVALID_MESSAGES','질문은 2,000자 이하로 입력해 주세요.');
    chars+=item.content.length;
    if(chars>MAX_HISTORY_CHARS) throw new ChatFailure(413,'HISTORY_TOO_LONG','대화가 너무 길어요. 짧게 나눠 질문해 주세요.');
    messages.push({role:item.role,content:item.content.trim()});
  }
  if(messages.at(-1)?.role!=='user' || !messages.some(m=>m.role==='user')) throw new ChatFailure(400,'INVALID_MESSAGES','마지막 질문을 확인해 주세요.');
  // Gemini accepts contiguous same-role parts as one turn; merge failed-send follow-ups.
  while(messages[0]?.role==='assistant')messages.shift();
  return messages.reduce<ChatTurn[]>((turns,m)=> { const last=turns.at(-1); if(last?.role===m.role)last.content+='\n\n'+m.content;else turns.push({...m});return turns; },[]);
}

const responseSchema={type:'object',properties:{text:{type:'string',description:'방문자의 질문에 대한 간결하고 근거 있는 일반 텍스트 답변'},entryIds:{type:'array',items:{type:'string'},maxItems:3}},required:['text','entryIds'],additionalProperties:false};
export function createChatHandler(deps:Dependencies={}) {
  const apiKey=deps.apiKey??(()=>process.env.GEMINI_API_KEY);
  const transport=deps.fetch??fetch;
  const limit=createLimiter(deps.now??Date.now);
  return async (request:Request):Promise<Response> => {
    try {
      if(request.method==='GET') return reply({configured:Boolean(apiKey()?.trim()),model:chatModel});
      if(request.method!=='POST') return reply({code:'METHOD_NOT_ALLOWED',error:'지원하지 않는 요청입니다.'},405,{Allow:'GET, POST'});
      checkOrigin(request);
      const messages=await readMessages(request);
      const key=apiKey()?.trim();
      if(!key) throw new ChatFailure(503,'NOT_CONFIGURED','AI Chat 연결을 준비 중이에요. 잠시 후 다시 방문해 주세요.');
      limit(request);
      const controller=new AbortController();
      const abort=()=>controller.abort();
      request.signal.addEventListener('abort',abort,{once:true});
      if(request.signal.aborted)controller.abort();
      const timer=setTimeout(abort,deps.timeoutMs??25000);
      try {
        const result=await transport(`https://generativelanguage.googleapis.com/v1beta/models/${chatModel.id}:generateContent`,{
          method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':key},signal:controller.signal,
          body:JSON.stringify({systemInstruction:{parts:[{text:buildSystemInstruction(messages, request.headers.get('X-Aplus-Language') === 'en' ? 'en' : 'ko')}]},contents:messages.map(m=>({role:m.role==='assistant'?'model':'user',parts:[{text:m.content}]})),generationConfig:{maxOutputTokens:2048,thinkingConfig:{thinkingLevel:'MINIMAL'},responseFormat:{text:{mimeType:'APPLICATION_JSON',schema:responseSchema}}}}),
        });
        if(!result.ok) {
          // Log only a redacted provider error, never conversation text or credentials.
          const diagnostic = await result.json().catch(() => null);
          const reason = typeof diagnostic?.error?.message === 'string'
            ? diagnostic.error.message.split(key).join('[REDACTED]').replace(/AIza[\w-]+/g,'[REDACTED]').replace(/https?:\/\/\S+/g,'[URL]').slice(0,600)
            : 'No JSON error detail';
          console.warn('[gemini-provider]', JSON.stringify({ status: result.status, code: diagnostic?.error?.status, reason }));
          if(result.status===402) throw new ChatFailure(503,'CREDITS_EXHAUSTED','현재 AI 서비스를 이용할 수 없어요. 운영자 확인 후 다시 이용해 주세요.');
          if(result.status===429) throw new ChatFailure(429,'QUOTA_EXCEEDED','AI 사용 한도에 도달했어요. 잠시 후 다시 시도해 주세요.',60);
          if([400,401,403,404].includes(result.status)) throw new ChatFailure(503,'PROVIDER_CONFIGURATION','AI 연결 설정을 확인 중이에요. 잠시 후 다시 방문해 주세요.');
          throw new ChatFailure(502,'PROVIDER_UNAVAILABLE','AI 응답이 지연되고 있어요. 잠시 후 다시 시도해 주세요.');
        }
        const data=await result.json();
        const candidate=data?.candidates?.[0];
        if(data?.promptFeedback?.blockReason || candidate?.finishReason==='SAFETY') throw new ChatFailure(422,'BLOCKED','이 질문에 답변하기 어려워요. 포트폴리오에 관한 다른 질문을 해 주세요.');
        if(candidate?.finishReason!=='STOP') throw new ChatFailure(502,'INCOMPLETE_RESPONSE','답변을 완성하지 못했어요. 질문을 짧게 바꿔 다시 시도해 주세요.');
        const text=candidate?.content?.parts?.filter((p:{text?:unknown;thought?:boolean})=>typeof p.text==='string'&&!p.thought).map((p:{text:string})=>p.text).join('');
        let answer:unknown;
        try { answer=JSON.parse(text??''); } catch { throw new ChatFailure(502,'INVALID_RESPONSE','답변을 읽지 못했어요. 다시 시도해 주세요.'); }
        if(!answer || typeof answer!=='object' || !('text' in answer) || typeof answer.text!=='string' || !answer.text.trim() || answer.text.length>CHAT_MAX_REPLY || !('entryIds' in answer) || !Array.isArray(answer.entryIds)) throw new ChatFailure(502,'INVALID_RESPONSE','답변 형식을 확인하지 못했어요. 다시 시도해 주세요.');
        const ids=[...new Set(answer.entryIds.filter((id):id is string=>typeof id==='string'&&knownEntryIds.has(id)))].slice(0,3);
        return reply({text:answer.text.trim(),attachments:ids.map(entryId=>({entryId})),model:chatModel});
      } catch(error) {
        if(controller.signal.aborted)throw new ChatFailure(504,'TIMEOUT','응답 시간이 길어지고 있어요. 다시 시도해 주세요.');
        throw error;
      } finally { clearTimeout(timer);request.signal.removeEventListener('abort',abort); }
    } catch(error) {
      const failure=error instanceof ChatFailure?error:new ChatFailure(502,'CONNECTION_FAILED','AI에 연결하지 못했어요. 잠시 후 다시 시도해 주세요.');
      return reply({code:failure.code,error:failure.message},failure.status,failure.retryAfter?{'Retry-After':String(failure.retryAfter)}:{});
    }
  };
}
