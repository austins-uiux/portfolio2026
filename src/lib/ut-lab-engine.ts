import { categoryLabels, subcategories, serviceContexts, names, personaRoles, circumstances, personaVoice, personaVoiceAlt, palette, hashedTrait, issueLibrary, type CategoryKey, type IssueKey, type FactorKey } from '../data/ut-lab-data';

export type Outcome = 'complete' | 'hesitate' | 'drop';
export interface Persona {
  id:number; name:string; age:number; role:string; circumstance:string; voiceIndex:number;
  digital:number; speed:number; price:number; trust:number; accessibility:number;
  context:string; color:string; initials:string;
}
export interface PersonaResult extends Persona { score:number; outcome:Outcome; leading:FactorKey; reason:string; voc:string; time:number; }
export interface LabInputs { problem:string; category:CategoryKey; subcategory:string; imageCount:number; }
export interface LabReport {
  issue:IssueKey; scenario:string; category:string; subcategory:string; createdAt:string;
  rows:PersonaResult[]; counts:Record<Outcome,number>; factors:{name:string; count:number; key:FactorKey}[];
  avgFriction:number; methodology:string;
}
const factorKeys:FactorKey[] = ['price','clarity','effort','trust'];

export function generatePersonas(category:CategoryKey|''):Persona[] {
  const context = category ? serviceContexts[category] : '앱 이용 과정의 편의성';
  const seed = Object.keys(subcategories).indexOf(category) + 1;
  return names.map((name,index)=>{
    const profile=(index*7+seed*3)%15;
    return { id:index+1, name, age:19+((index*13+seed*5)%43), role:personaRoles[profile], circumstance:circumstances[profile], voiceIndex:profile,
      digital:hashedTrait(index,1,seed), speed:hashedTrait(index,2,seed), price:hashedTrait(index,3,seed), trust:hashedTrait(index,4,seed), accessibility:hashedTrait(index,5,seed),
      context, color:palette[(index+seed)%palette.length], initials:name.substring(1,3) };
  });
}
export function topTrait(person:Persona) {
  const traits:[string,number][]=[['속도',person.speed],['비용',person.price],['신뢰',person.trust],['접근성',person.accessibility]];
  return traits.sort((a,b)=>b[1]-a[1])[0][0];
}
export function getIssueType(problem:string,subcategory:string):IssueKey {
  const normalized=problem.toLowerCase();
  for(const type of ['cart','signup','booking','search'] as const) if(issueLibrary[type].triggers.some(term=>normalized.includes(term))) return type;
  if(['shopping','grocery','payment'].includes(subcategory)) return 'cart';
  if(['booking','medical'].includes(subcategory)) return 'booking';
  if(['search','news','streaming'].includes(subcategory)) return 'search';
  return 'generic';
}
export function simulate(inputs:LabInputs):LabReport {
  if(!inputs.problem.trim() || inputs.imageCount<1 || inputs.imageCount>3 || !subcategories[inputs.category]?.some(([key])=>key===inputs.subcategory)) throw new Error('테스트 입력을 확인해 주세요.');
  const issue=getIssueType(inputs.problem,inputs.subcategory), scenario=inputs.problem.trim(), spec=issueLibrary[issue];
  const rows=generatePersonas(inputs.category).map((person):PersonaResult=>{
    const intensity:Record<FactorKey,number>={
      price:16+person.price*8+(issue==='cart'?14:issue==='booking'?4:0),
      clarity:17+(6-person.digital)*7+person.accessibility*3+(issue==='search'?10:issue==='booking'?7:0),
      effort:17+person.speed*6+(6-person.digital)*3+(issue==='signup'?12:0),
      trust:16+person.trust*7+(issue==='signup'?7:issue==='cart'?5:0),
    };
    const leading=[...factorKeys].sort((a,b)=>intensity[b]-intensity[a])[0];
    const complexity=Math.max(0,inputs.imageCount-1)*2;
    const contextModifier=inputs.category==='finance'?4:inputs.category==='health'?3:0;
    const personalShift=((person.id*17+scenario.length*3)%19)-9;
    const urgency=/(이탈|포기|불만|높아|많아|어려워)/.test(scenario)?5:0;
    const score=Math.max(19,Math.min(94,Math.round(spec.baseline*.35+intensity[leading]*.62+complexity+contextModifier+personalShift+urgency)));
    return {...person,score,outcome:score>=68?'drop':score>=51?'hesitate':'complete',leading,reason:spec.factors[factorKeys.indexOf(leading)],
      voc:`${spec.voc[leading]} ${person.id>15?personaVoiceAlt[person.voiceIndex]:personaVoice[person.voiceIndex]}`,
      time:Math.round(24+score*.85+person.speed*6+person.id%13)};
  });
  return {issue,scenario,category:categoryLabels[inputs.category],subcategory:subcategories[inputs.category].find(([key])=>key===inputs.subcategory)![1],createdAt:new Date().toISOString(),rows,
    counts:{complete:rows.filter(p=>p.outcome==='complete').length,hesitate:rows.filter(p=>p.outcome==='hesitate').length,drop:rows.filter(p=>p.outcome==='drop').length},
    factors:spec.factors.map((name,index)=>({name,key:factorKeys[index],count:rows.filter(p=>p.leading===factorKeys[index]).length})).sort((a,b)=>b.count-a.count),
    avgFriction:Math.round(rows.reduce((sum,p)=>sum+p.score,0)/30),methodology:'Deterministic rule-based persona simulation. No empirical UT, no screenshot understanding, no real LLM inference.'};
}
