import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createContext, runInContext } from 'node:vm';
import ts from 'typescript';

// Compare the TypeScript port against the original v0.2 engine, not a duplicate implementation.
const root=fileURLToPath(new URL('..',import.meta.url));
const transpile=source=>ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const dataUrl=`data:text/javascript;base64,${Buffer.from(transpile(await readFile(`${root}/src/data/ut-lab-data.ts`,'utf8'))).toString('base64')}`;
const engineCode=transpile(await readFile(`${root}/src/lib/ut-lab-engine.ts`,'utf8')).replace(/(['"])\.\.\/data\/ut-lab-data\1/,JSON.stringify(dataUrl));
const engine=await import(`data:text/javascript;base64,${Buffer.from(engineCode).toString('base64')}`);
const source=await readFile(`${root}/vendor/ut-lab-original/app.js`,'utf8');
const controls={'#categoryMain':{value:'',selectedOptions:[{textContent:''}]},'#categorySub':{value:'',selectedOptions:[{textContent:''}]},'#problem':{value:''}};
const context=createContext({document:{querySelector:selector=>controls[selector]}});
runInContext(source.slice(0,source.indexOf('\nwireEvents();'))+'\nfunction renderPersonas() {}',context);
const categories={commerce:['커머스 · 쇼핑','shopping','온라인 쇼핑몰'],lifestyle:['라이프스타일 · O2O','delivery','음식 배달'],content:['콘텐츠 · 미디어','streaming','영상 · 스트리밍'],finance:['금융 · 핀테크','banking','모바일 뱅킹'],social:['소셜 · 커뮤니케이션','messenger','메신저'],brand:['브랜드 · 기업','corporate','기업 · 브랜드'],portal:['포털 · 생산성','search','검색 · 포털'],health:['건강 · 웰니스','fitness','피트니스']};
const problems=['장바구니에서 결제로 넘어가지 않고 이탈하는 사용자가 많아요.','회원가입 과정에서 입력 항목이 많아 완료 전에 포기합니다.','예약 가능한 시간을 찾기 어려워 예약을 완료하지 못합니다.','검색 결과의 필터가 불명확해서 탐색하기 어려워요.','다음 행동의 안내가 부족합니다.'];
let cases=0;
for(const [category,[label,subcategory,subLabel]] of Object.entries(categories)) for(const problem of problems) for(const imageCount of [1,2,3]) {
  controls['#categoryMain'].value=category;controls['#categoryMain'].selectedOptions[0].textContent=label;
  controls['#categorySub'].value=subcategory;controls['#categorySub'].selectedOptions[0].textContent=subLabel;controls['#problem'].value=problem;
  const before=JSON.parse(runInContext(`state.images=Array(${imageCount}).fill({});generatePersonas();JSON.stringify(simulate());`,context));
  const after=engine.simulate({category,subcategory,problem,imageCount});
  delete before.createdAt;delete after.createdAt;
  assert.deepEqual(after,before,`${category} / ${problem} / ${imageCount} images`);
  assert.equal(Object.values(after.counts).reduce((sum,count)=>sum+count,0),30);
  assert.equal(new Set(after.rows.map(row=>row.id)).size,30);cases++;
}
assert.throws(()=>engine.simulate({category:'commerce',subcategory:'booking',problem:problems[0],imageCount:1}));
assert.throws(()=>engine.simulate({category:'commerce',subcategory:'shopping',problem:problems[0],imageCount:4}));
console.log(`UT Lab engine parity: ${cases} scenarios match the original; 30-persona totals and invalid inputs verified.`);
