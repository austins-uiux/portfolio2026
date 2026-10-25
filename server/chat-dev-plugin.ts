import { Readable } from 'node:stream';
import type { Plugin } from 'vite';
import { createChatHandler } from './chat-handler.ts';

/** Run the exact Vercel handler in `npm run dev`, without a second server. */
export function chatDevPlugin(apiKey:()=>string|undefined):Plugin {
  const handler=createChatHandler({apiKey});
  return {name:'aplus-chat-api',configureServer(server) {
    server.middlewares.use('/api/chat',async(req,res)=> {
      const controller=new AbortController();
      req.once('aborted',()=>controller.abort());
      res.once('close',()=>{if(!res.writableFinished)controller.abort();});
      try {
        const headers=new Headers();
        for(const [key,value]of Object.entries(req.headers))if(value!==undefined)headers.set(key,Array.isArray(value)?value.join(','):value);
        const method=req.method??'GET';
        const init:RequestInit&{duplex?:'half'}={method,headers,signal:controller.signal};
        if(!['GET','HEAD'].includes(method)){init.body=Readable.toWeb(req) as ReadableStream<Uint8Array>;init.duplex='half';}
        const response=await handler(new Request(`http://${req.headers.host}/api/chat`,init));
        res.statusCode=response.status;response.headers.forEach((value,key)=>res.setHeader(key,value));
        res.end(Buffer.from(await response.arrayBuffer()));
      } catch { res.statusCode=500;res.setHeader('Content-Type','application/json');res.end(JSON.stringify({error:'AI 연결을 확인해 주세요.'})); }
    });
  }};
}
