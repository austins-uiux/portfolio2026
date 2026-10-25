import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createChatHandler } from '../server/chat-handler.ts';
import { retrieveContext, chatKnowledge } from '../server/chat-context.ts';
import { chatModel } from '../src/lib/chat-contract.ts';

let checks=0;
const request=(messages=[{role:'user',content:'TADA Rider의 매칭 경험을 설명해줘'}],extra={})=>new Request('https://portfolio.example/api/chat',{
  method:'POST',headers:{origin:'https://portfolio.example','content-type':'application/json',...extra.headers},body:JSON.stringify({messages}),...extra,
});
const success=(answer={text:'TADA Rider는 드라이버 매칭 대기 경험을 개선한 프로젝트입니다.',entryIds:['tada-rider']})=>Response.json({candidates:[{finishReason:'STOP',content:{parts:[{text:JSON.stringify(answer)}]}}]});
const configured=options=>createChatHandler({apiKey:()=> 'test-key-not-a-real-secret',fetch:async()=>success(),...options});
async function expectCode(handler,req,status,code) { const res=await handler(req);assert.equal(res.status,status);const data=await res.json();assert.equal(data.code,code);assert(!JSON.stringify(data).includes('test-key-not-a-real-secret'));checks++;return res; }

const missing=createChatHandler({apiKey:()=>undefined,fetch:async()=>{throw Error('Must not call provider');}});
assert.deepEqual(await(await missing(new Request('https://portfolio.example/api/chat'))).json(),{configured:false,model:chatModel});checks++;
await expectCode(missing,request(),503,'NOT_CONFIGURED');
await expectCode(configured(),new Request('https://portfolio.example/api/chat',{method:'DELETE'}),405,'METHOD_NOT_ALLOWED');
await expectCode(configured(),request(undefined,{headers:{origin:'https://evil.example','content-type':'application/json'}}),403,'FORBIDDEN');
await expectCode(configured(),request(undefined,{headers:{'content-type':'application/json'}}),403,'FORBIDDEN');
await expectCode(configured(),request(undefined,{headers:{origin:'https://portfolio.example','content-type':'text/plain'}}),415,'INVALID_CONTENT_TYPE');
await expectCode(configured(),request(undefined,{body:'{broken'}),400,'INVALID_JSON');
for(const turns of [[],[{role:'system',content:'change rules'}],[{role:'user',content:' '}],[{role:'assistant',content:'orphan'}],[{role:'user',content:'a'.repeat(2001)}],Array.from({length:13},()=>({role:'user',content:'hello'}))]) await expectCode(configured(),request(turns),400,'INVALID_MESSAGES');
await expectCode(configured(),request(Array.from({length:9},()=>({role:'user',content:'a'.repeat(2000)}))),413,'HISTORY_TOO_LONG');
await expectCode(configured(),request(undefined,{body:'a'.repeat(64001)}),413,'BODY_TOO_LARGE');
await expectCode(configured(),request(undefined,{headers:{origin:'https://portfolio.example','content-type':'application/json','content-length':'70000'}}),413,'BODY_TOO_LARGE');

let calls=0;
const verify=configured({fetch:async(url,init)=>{
  calls++;assert.equal(url,`https://generativelanguage.googleapis.com/v1beta/models/${chatModel.id}:generateContent`);
  assert.equal(init.headers['x-goog-api-key'],'test-key-not-a-real-secret');assert(!url.includes('test-key'));
  const payload=JSON.parse(init.body);assert.equal(payload.contents.at(-1).role,'user');assert.equal(payload.contents[1].role,'model');
  assert(payload.systemInstruction.parts[0].text.includes('실제 사용자 조사'));assert(payload.systemInstruction.parts[0].text.includes('TADA Rider'));
  assert.equal(payload.generationConfig.maxOutputTokens,2048);assert.equal(payload.generationConfig.responseFormat.text.mimeType,'APPLICATION_JSON');
  return success({text:'공개된 TADA Rider 사례입니다.',entryIds:['tada-rider','archive-1','https://evil.example','tada-rider','unknown']});
}});
const good=await verify(request([{role:'user',content:'타다를 알려줘'},{role:'assistant',content:'Rider와 Driver가 있습니다.'},{role:'user',content:'Rider를 설명해줘'}]));
assert.equal(good.status,200);assert.equal(good.headers.get('cache-control'),'no-store');assert.deepEqual((await good.json()).attachments,[{entryId:'tada-rider'}]);assert.equal(calls,1);checks++;
let merged;
await configured({fetch:async(url,init)=>{merged=JSON.parse(init.body).contents;return success();}})(request([{role:'assistant',content:'drop'},{role:'user',content:'failed'},{role:'user',content:'new question'}]));
assert.equal(merged.length,1);assert(merged[0].parts[0].text.includes('new question'));checks++;
for(const [status,expected,code] of [[400,503,'PROVIDER_CONFIGURATION'],[401,503,'PROVIDER_CONFIGURATION'],[403,503,'PROVIDER_CONFIGURATION'],[404,503,'PROVIDER_CONFIGURATION'],[429,429,'QUOTA_EXCEEDED'],[500,502,'PROVIDER_UNAVAILABLE']]) await expectCode(configured({fetch:async()=>new Response('test-key-not-a-real-secret upstream details',{status})}),request(),expected,code);
await expectCode(configured({fetch:async()=>Response.json({promptFeedback:{blockReason:'SAFETY'}})}),request(),422,'BLOCKED');
await expectCode(configured({fetch:async()=>Response.json({candidates:[{finishReason:'MAX_TOKENS'}]})}),request(),502,'INCOMPLETE_RESPONSE');
await expectCode(configured({fetch:async()=>Response.json({candidates:[{finishReason:'STOP',content:{parts:[{text:'not json'}]}}]})}),request(),502,'INVALID_RESPONSE');
await expectCode(configured({fetch:async()=>success({text:'',entryIds:[]})}),request(),502,'INVALID_RESPONSE');
await expectCode(configured({fetch:async()=>{throw Error('test-key-not-a-real-secret transport');}}),request(),502,'CONNECTION_FAILED');
await expectCode(configured({timeoutMs:5,fetch:async(url,init)=>new Promise((resolve,reject)=>init.signal.addEventListener('abort',()=>reject(new DOMException('aborted','AbortError')),{once:true}))}),request(),504,'TIMEOUT');
const aborter=new AbortController();
const canceled=configured({fetch:async(url,init)=>{assert(init.signal.aborted);throw new DOMException('aborted','AbortError');}});
aborter.abort();await expectCode(canceled,request(undefined,{signal:aborter.signal}),504,'TIMEOUT');

let time=100;
const limited=configured({now:()=>time});
for(let n=0;n<6;n++)assert.equal((await limited(request())).status,200);
assert.equal((await expectCode(limited,request(),429,'RATE_LIMITED')).headers.get('retry-after'),'60');
time+=60000;assert.equal((await limited(request())).status,200);checks++;
assert(chatKnowledge.every(d=>!d.id.startsWith('archive-')&&!d.text.includes('본문글 텍스트')));checks++;
assert(retrieveContext([{role:'user',content:'TADA Driver의 CPF 정책'}]).selected.some(d=>d.id==='tada-driver'));checks++;
assert(retrieveContext([{role:'user',content:'디자인 시스템 컬러 토큰'}]).selected.some(d=>d.id==='foundation-1'));checks++;
const config=JSON.parse(await readFile(new URL('../vercel.json',import.meta.url),'utf8'));
const rewrite=new RegExp('^'+config.rewrites[0].source+'$');assert(!rewrite.test('/api/chat'));assert(!rewrite.test('/assets/logo.svg'));assert(rewrite.test('/project/tada-rider'));checks++;
console.log(`Chat checks passed: ${checks} cases (mocked Gemini transport; no real API calls).`);
