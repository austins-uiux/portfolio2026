import assert from 'node:assert/strict';
import ts from 'typescript';
import { mkdtemp, readFile, writeFile, mkdir, copyFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// Type checking alone cannot catch an emitted .js module importing a missing .ts file.
const root=fileURLToPath(new URL('..',import.meta.url));
const output=await mkdtemp(path.join(tmpdir(),'aplus-chat-build-'));
try {
  const config=JSON.parse(await readFile(path.join(root,'tsconfig.json'),'utf8'));
  const {options,errors}=ts.convertCompilerOptionsFromJson(config.compilerOptions,root);
  assert.equal(errors.length,0);
  await writeFile(path.join(output,'package.json'),JSON.stringify({type:'module'}));
  for(const source of ['api/chat.ts','server/chat-handler.ts','server/chat-context.ts','src/lib/chat-contract.ts']) {
    const target=path.join(output,source.replace(/\.ts$/,'.js'));
    await mkdir(path.dirname(target),{recursive:true});
    const result=ts.transpileModule(await readFile(path.join(root,source),'utf8'),{compilerOptions:options});
    assert(!/from ['"][^'"]+\.ts['"]/.test(result.outputText),`Unresolved TypeScript import in ${source}`);
    await writeFile(target,result.outputText);
  }
  await copyFile(path.join(root,'server/chat-knowledge.json'),path.join(output,'server/chat-knowledge.json'));
  const {default:handler}=await import(pathToFileURL(path.join(output,'api/chat.js')).href);
  const response=await handler.fetch(new Request('https://portfolio.example/api/chat'));
  assert.equal(response.status,200);
  const status=await response.json();
  assert.equal(status.model.id,'gemini-3.5-flash-lite');assert.equal(typeof status.configured,'boolean');
  console.log('Compiled API check passed: emitted JavaScript imports and status endpoint execute without source TypeScript files.');
} finally { await rm(output,{recursive:true,force:true}); }
