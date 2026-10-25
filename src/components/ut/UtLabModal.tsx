import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { ArrowRight, Check, ChevronDown, Download, FlaskConical, Info, LoaderCircle, Plus, Printer, Users, X } from 'lucide-react';
import { Brand, sidebarLogoScale } from '../Brand';
import { categoryLabels, issueLibrary, serviceContexts, subcategories, type CategoryKey } from '../../data/ut-lab-data';
import { generatePersonas, simulate, topTrait, type LabReport, type Outcome, type Persona, type PersonaResult } from '../../lib/ut-lab-engine';
import { makeDemoSVG } from '../../lib/ut-lab-demo';
import { UtConceptPhone } from './UtConceptPhone';

interface FlowImage { src:string; name:string; objectUrl?:boolean; }
const screenNames=['첫 번째 화면','두 번째 화면','세 번째 화면'];
const outcomeLabels:Record<Outcome,string>={complete:'완료',hesitate:'지연',drop:'이탈'};
const outcomeColors:Record<Outcome,string>={complete:'var(--chart-2)',hesitate:'var(--chart-4)',drop:'var(--destructive)'};
const examples=[['장바구니 이탈','장바구니 화면에서 결제로 넘어가지 않고 이탈하는 사용자가 많아요.'],['가입 완료율','회원가입 과정에서 입력 항목이 많아 사용자가 완료 전에 포기합니다.'],['예약 실패','예약 가능한 시간을 찾기 어려워 사용자가 예약을 완료하지 못합니다.']];

function SectionHeading({step,title,description,children}:{step:string;title:string;description:string;children?:ReactNode}) {
  return <div className="ut-section-heading"><div><span className="ut-eyebrow">{step}</span><h2>{title}</h2><p>{description}</p></div>{children}</div>;
}
function PersonaAvatar({person}:{person:Persona}) { return <span className="ut-avatar" aria-hidden="true">{person.initials}</span>; }
function Inspector({person,method,onClose}:{person:Persona|PersonaResult|null;method:boolean;onClose:()=>void}) {
  const dialog=useRef<HTMLDialogElement>(null);
  const active=!!person||method;
  useEffect(()=>{ if(active && !dialog.current?.open) dialog.current?.showModal(); else if(!active) dialog.current?.close(); },[active]);
  return <dialog className="ut-inspector" ref={dialog} aria-modal={active||undefined} aria-labelledby="ut-inspector-title" onCancel={event=>{event.preventDefault();event.stopPropagation();onClose();}} onClick={event=>{if(event.target===event.currentTarget) onClose();}}>
    <header><h2 id="ut-inspector-title">{person?`${person.name} · 합성 페르소나`:'UT Lab은 어떻게 동작하나요?'}</h2><button type="button" className="ut-icon-button" aria-label="상세 창 닫기" onClick={onClose}><X size={18}/></button></header>
    {person ? <div className="ut-inspector-content"><div className="ut-persona-heading"><PersonaAvatar person={person}/><div><strong>{person.name}</strong><p>{person.age}세 · {person.role} · P{String(person.id).padStart(2,'0')}</p></div></div><p>{person.circumstance}. {person.context}에 관심이 많습니다.</p>
      {([['디지털 숙련도',person.digital],['빠른 진행 선호',person.speed],['가격 민감도',person.price],['신뢰·확신 요구',person.trust],['접근성 요구',person.accessibility]] as [string,number][]).map(([label,value])=><div className="ut-trait" key={label}><div><span>{label}</span><strong>{value} / 5</strong></div><meter min="0" max="5" value={value} aria-label={label}/></div>)}
      {'outcome' in person && <div className="ut-note"><strong>예상 {outcomeLabels[person.outcome]} · 마찰 {person.score}/100</strong><p>{person.reason}</p><p>“{person.voc}”</p><small>가정된 시도 시간 {person.time}초 · 실측값 아님</small></div>}
    </div> : <div className="ut-inspector-content"><p>문제 문장과 서비스 카테고리에 사전 정의된 가중치를 적용하는 <strong>규칙 기반 합성 시뮬레이터</strong>입니다.</p><ol><li>화면 1~3장, 문제 상황, 서비스 유형을 입력합니다.</li><li>성향이 다른 30개 페르소나의 마찰 가능성을 계산합니다.</li><li>합성 VOC, 가상 지표, 개선 가설과 개념 와이어프레임을 제공합니다.</li></ol><div className="ut-note">이미지는 미리보기용이며 이미지 AI 판독·자동 클릭·실제 인터뷰·GA·통계적 A/B 테스트는 연결되어 있지 않습니다. 수치는 실제 관측 결과가 아닙니다.</div><button type="button" className="ut-button ut-button--primary" onClick={onClose}>이해했어요 <Check size={16}/></button></div>}
  </dialog>;
}

export default function UtLabModal({open,onClose}:{open:boolean;onClose:()=>void}) {
  const dialog=useRef<HTMLDialogElement>(null), content=useRef<HTMLDivElement>(null), resultsSection=useRef<HTMLElement>(null), fileInput=useRef<HTMLInputElement>(null);
  const imagesRef=useRef<(FlowImage|null)[]>([null,null,null]), uploadIndex=useRef(0), operation=useRef(0), runTimer=useRef<number|undefined>(undefined);
  const [images,setImages]=useState<(FlowImage|null)[]>([null,null,null]);
  const [problem,setProblem]=useState(''), [category,setCategory]=useState<CategoryKey|''>(''), [subcategory,setSubcategory]=useState('');
  const [report,setReport]=useState<LabReport|null>(null), [expanded,setExpanded]=useState(false), [filter,setFilter]=useState<Outcome|'all'>('all');
  const [running,setRunning]=useState(false), [uploading,setUploading]=useState(false), [dragged,setDragged]=useState<number|null>(null), [feedback,setFeedback]=useState('');
  const [selectedPersona,setSelectedPersona]=useState<Persona|PersonaResult|null>(null), [methodOpen,setMethodOpen]=useState(false);
  const personas=useMemo(()=>generatePersonas(category),[category]);
  const ready=[images.some(Boolean),problem.trim().length>=8,!!category && !!subcategories[category].find(([key])=>key===subcategory)];
  const busy=running||uploading;
  useEffect(()=>{
    if(!open) return;
    const previous=document.activeElement instanceof HTMLElement?document.activeElement:null;
    const overflow=document.body.style.overflow;
    dialog.current?.showModal(); content.current?.scrollTo({top:0}); document.body.style.overflow='hidden';
    return ()=>{dialog.current?.close();document.body.style.overflow=overflow;if(previous?.isConnected) previous.focus();};
  },[open]);
  useEffect(()=>()=>{operation.current++;window.clearTimeout(runTimer.current);imagesRef.current.forEach(image=>{if(image?.objectUrl) URL.revokeObjectURL(image.src);});},[]);
  useEffect(()=>{if(report && open) resultsSection.current?.scrollIntoView({behavior:'smooth',block:'start'});},[report]);
  const closeInspector=useCallback(()=>{setSelectedPersona(null);setMethodOpen(false);},[]);
  function replaceImages(next:(FlowImage|null)[]) {
    imagesRef.current.forEach(image=>{if(image?.objectUrl && !next.some(item=>item?.src===image.src)) URL.revokeObjectURL(image.src);});
    imagesRef.current=next;setImages(next);setReport(null);setSelectedPersona(null);
  }
  function invalidate() {setReport(null);setSelectedPersona(null);setFeedback('');}
  async function addFiles(files:File[],preferred:number) {
    if(busy||!files.length) return;
    const id=++operation.current;setUploading(true);setFeedback('');
    const valid=files.filter(file=>['image/png','image/jpeg','image/webp'].includes(file.type) && file.size<=10*1024*1024);
    const positions=[preferred,...[0,1,2].filter(index=>index!==preferred&&!imagesRef.current[index])];
    const accepted:FlowImage[]=[];let rejected=files.length-valid.length;
    for(const file of valid.slice(0,positions.length)) {
      const src=URL.createObjectURL(file), probe=new Image();probe.src=src;
      try {await probe.decode();accepted.push({src,name:file.name,objectUrl:true});}
      catch {URL.revokeObjectURL(src);rejected++;}
    }
    if(id!==operation.current){accepted.forEach(image=>URL.revokeObjectURL(image.src));return;}
    const next=[...imagesRef.current];accepted.forEach((image,index)=>{next[positions[index]]=image;});if(accepted.length) replaceImages(next);setUploading(false);
    if(rejected) setFeedback('이미지를 확인해 주세요. PNG·JPG·WEBP 파일을 장당 10MB 이하로 올릴 수 있어요.');
    else if(valid.length>positions.length) setFeedback(`최대 3장까지 등록할 수 있어요. 이번에는 ${accepted.length}장을 추가했어요.`);
  }
  function loadDemo() {
    operation.current++;setUploading(false);replaceImages([0,1,2].map(step=>({src:makeDemoSVG(step),name:`A+ Market 샘플 ${step+1}`})));
    setProblem('장바구니에서 결제 단계로 넘어가지 않고 이탈하는 사용자가 많아요. 배송비가 마지막 단계까지 명확하지 않아 결정을 미루는 것이 원인일까요?');
    setCategory('commerce');setSubcategory('shopping');setFeedback('샘플 3장과 문제 상황을 준비했어요. 시뮬레이션을 시작해 보세요.');
  }
  function startTest() {
    if(!ready.every(Boolean)||!category||busy) return;
    const inputs={problem,category,subcategory,imageCount:images.filter(Boolean).length};setRunning(true);setFeedback('');
    runTimer.current=window.setTimeout(()=>{
      try {setReport(simulate(inputs));setFilter('all');}
      catch {setFeedback('입력 정보를 확인하고 다시 실행해 주세요.');}
      finally {setRunning(false);}
    },350);
  }
  function downloadReport() {
    if(!report) return;
    const data={title:'A+studio UT Lab — Synthetic Research Report',disclaimer:'Simulated hypotheses, not observed user research results.',inputs:{problem:report.scenario,category:report.category,subcategory:report.subcategory,imageNames:images.filter(Boolean).map(image=>image!.name)},...report};
    const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json;charset=utf-8'}));
    const link=document.createElement('a');link.href=url;link.download=`aplus-ut-lab-report-${report.createdAt.slice(0,10)}.json`;link.click();window.setTimeout(()=>URL.revokeObjectURL(url),2000);
  }
  const rows=report?.rows.filter(row=>filter==='all'||row.outcome===filter)??[];
  const spec=report?issueLibrary[report.issue]:null;
  return createPortal(<dialog ref={dialog} className="ut-modal" aria-modal={open||undefined} aria-labelledby="ut-lab-title" onCancel={event=>{event.preventDefault();onClose();}} onClick={event=>{if(event.target===event.currentTarget) onClose();}}>
    <header className="ut-header"><div className="ut-brand" id="ut-lab-title"><Brand variant="sidebar" scale={sidebarLogoScale}/><span className="ut-brand-badge">UT Lab</span></div><div className="ut-header-actions"><span>브라우저 로컬 처리</span><button type="button" className="ut-button ut-button--quiet" onClick={()=>setMethodOpen(true)}><Info size={15}/> 방법론</button><button type="button" className="ut-icon-button" aria-label="UT Lab 닫기" onClick={onClose}><X size={20}/></button></div></header>
    <div className="ut-content" ref={content}>
      <section className="ut-setup" aria-label="테스트 설계">
        <SectionHeading step="01 / SETUP" title="테스트 설계" description="UI의 현재 상태와 해결하고 싶은 사용자 경험 문제를 정의합니다."><button type="button" className="ut-button" onClick={loadDemo} disabled={busy}>샘플 데이터로 체험 <ArrowRight size={15}/></button></SectionHeading>
        <div className="ut-notice"><Info size={16}/><p>30개 합성 페르소나의 <strong>규칙 기반 시뮬레이션</strong>입니다. 이미지는 미리보기용이며, 결과는 실제 UT 관측값이 아닙니다.</p></div>
        {feedback && <p className="ut-feedback" role="status">{feedback}</p>}
        <div className="ut-design-grid"><fieldset className="ut-fields" disabled={busy}>
          <section className="ut-panel"><div className="ut-panel-heading"><h3><span>01</span> Before · UI Flow</h3><small>PNG, JPG, WEBP · 최대 3장</small></div><p className="ut-description">사용자가 경험하는 순서대로 올려주세요. 이미지는 외부 서버로 전송되지 않습니다.</p>
            <div className="ut-upload-grid">{images.map((image,index)=><div key={index} className={`ut-upload-slot${image?' has-image':''}${dragged===index?' is-dragging':''}`} onDragOver={event=>{event.preventDefault();if(!busy)setDragged(index);}} onDragLeave={()=>setDragged(null)} onDrop={event=>{event.preventDefault();setDragged(null);void addFiles([...event.dataTransfer.files],index);}}>
              <button type="button" className="ut-upload-select" aria-label={`${screenNames[index]} ${image?'변경':'업로드'}`} onClick={()=>{uploadIndex.current=index;fileInput.current?.click();}}>{image?<><img src={image.src} alt={`${screenNames[index]} 미리보기`}/><span>{screenNames[index]}</span><small>{image.name}</small></>:<><Plus size={22}/><strong>{screenNames[index]}</strong><small>클릭 또는 드래그</small><span className="ut-upload-order">0{index+1}</span></>}</button>
              {image&&<button type="button" className="ut-upload-remove" aria-label={`${screenNames[index]} 삭제`} onClick={()=>{operation.current++;replaceImages(images.map((item,i)=>i===index?null:item));setFeedback('');}}><X size={14}/></button>}
            </div>)}</div>
            <input ref={fileInput} type="file" aria-label="UI Flow 이미지 파일" accept="image/png,image/jpeg,image/webp" multiple hidden onChange={event=>{void addFiles([...event.target.files??[]],uploadIndex.current);event.target.value='';}}/>
          </section>
          <section className="ut-panel"><div className="ut-panel-heading"><h3><span>02</span> 문제 상황 정의</h3><small>{problem.length} / 500</small></div><label className="ut-label" htmlFor="ut-problem">어떤 사용자 행동이 문제인가요?</label><textarea id="ut-problem" maxLength={500} value={problem} onChange={event=>{setProblem(event.target.value);invalidate();}} placeholder="예: 장바구니 화면에서 결제로 넘어가지 않고 이탈하는 사용자가 많아요. 배송비가 마지막에 표시되는 것이 원인일까요?"/><div className="ut-examples"><span>빠른 예시</span>{examples.map(([label,text])=><button type="button" key={label} onClick={()=>{setProblem(text);invalidate();}}>{label}</button>)}</div></section>
          <section className="ut-panel"><div className="ut-panel-heading"><h3><span>03</span> 서비스 유형 선택</h3><small>카테고리별 가중치 적용</small></div><div className="ut-field-grid"><label className="ut-label">대분류<select value={category} onChange={event=>{setCategory(event.target.value as CategoryKey|'');setSubcategory('');invalidate();}}><option value="">서비스 대분류 선택</option>{Object.entries(categoryLabels).map(([key,label])=><option value={key} key={key}>{label}</option>)}</select></label><label className="ut-label">소분류<select value={subcategory} disabled={!category||busy} onChange={event=>{setSubcategory(event.target.value);invalidate();}}><option value="">{category?'서비스 소분류 선택':'대분류를 먼저 선택하세요'}</option>{category&&subcategories[category].map(([key,label])=><option value={key} key={key}>{label}</option>)}</select></label></div><p className="ut-description ut-category-hint">{category?`${categoryLabels[category]}에서는 ${serviceContexts[category]}에 대한 사용자 관점을 강조합니다.`:'서비스 유형을 선택하면 사용자 목표, 민감 요인, VOC 시나리오가 달라집니다.'}</p></section>
        </fieldset><aside className="ut-ready-panel"><div className="ut-panel-heading"><h3>실험 준비 상태</h3><strong className="ut-ready-count">{ready.filter(Boolean).length}/3</strong></div><ol className="ut-checklist">{[['UI Flow','화면 1~3장 추가'],['문제 정의','검증할 UX 문제 8자 이상'],['서비스 유형','대분류 및 소분류 선택']].map(([title,description],index)=><li key={title}><span className={`ut-check-icon${ready[index]?' is-ready':''}`}>{ready[index]?<Check size={14}/>:index+1}</span><div><strong>{title}</strong><small>{description}</small></div><span>{ready[index]?'완료':'대기'}</span></li>)}</ol><div className="ut-ready-population"><Users size={18}/><strong>30명의 합성 페르소나</strong><p>디지털 숙련도, 의사결정 성향, 접근성 요구와 시간·가격 민감도를 다양하게 조합합니다.</p></div><button type="button" className="ut-button ut-button--primary ut-button--full" onClick={startTest} disabled={!ready.every(Boolean)||busy}>{running?<LoaderCircle className="ut-spinning" size={16}/>:<FlaskConical size={16}/>} {running?'합성 규칙 계산 중…':uploading?'이미지 확인 중…':'시뮬레이션 시작'} {!busy&&<ArrowRight size={16}/>}</button><small className="ut-ready-footnote">실제 행동·전환율을 측정하지 않습니다.</small>{running&&<p role="status" className="sr-only">30개 합성 페르소나의 반응을 계산하고 있습니다.</p>}</aside></div>
      </section>
      <section className="ut-personas"><SectionHeading step="02 / PERSONAS" title="30개의 사용자 관점" description="목표와 제약이 다른 사용자들을 가정합니다. 카드를 누르면 성향을 살펴볼 수 있어요."><button type="button" className="ut-button" aria-expanded={expanded} onClick={()=>setExpanded(value=>!value)}>{expanded?'간략히 보기':'30명 전체 보기'}<ChevronDown size={15}/></button></SectionHeading><div className="ut-persona-grid">{(expanded?personas:personas.slice(0,6)).map(person=><button type="button" className="ut-persona-card" key={person.id} onClick={()=>setSelectedPersona(report?.rows.find(row=>row.id===person.id)??person)}><div className="ut-persona-heading"><PersonaAvatar person={person}/><div><strong>{person.name}</strong><small>{person.age}세 · {person.role}</small></div><span>P{String(person.id).padStart(2,'0')}</span></div><p>{person.circumstance}. {person.context}에 관심.</p><div className="ut-tags"><span>디지털 {person.digital}/5</span><span>{topTrait(person)} 중시</span></div></button>)}</div><p className="ut-caption">실제 조사 참여자가 아닌 생성 프로필 · {expanded?'30명 전체 표시':'대표 6명 표시'}</p></section>
      <section className="ut-results" ref={resultsSection} aria-label="시뮬레이션 인사이트"><SectionHeading step="03 / RESULTS" title="시뮬레이션 인사이트" description="설정한 문제와 사전 정의된 행동 규칙으로 생성한 가설입니다."><div className="ut-actions"><button type="button" className="ut-button" disabled={!report||busy} onClick={downloadReport}><Download size={15}/> JSON 다운로드</button><button type="button" className="ut-button" disabled={!report||busy} onClick={()=>window.print()}><Printer size={15}/> 리포트 인쇄</button></div></SectionHeading>
        {!report?<div className="ut-empty"><FlaskConical size={24}/><h3>첫 번째 리서치를 시작해 보세요.</h3><p>화면과 문제 상황을 입력하면 합성 VOC와 UX 개선 가설이 여기에 나타납니다.</p><button type="button" className="ut-button" onClick={()=>content.current?.scrollTo({top:0,behavior:'smooth'})}>테스트 설계로 이동 <ArrowRight size={15}/></button></div>:<>
          <div className="ut-notice"><Info size={16}/><p>아래 수치·시간·발언은 <strong>실제 사용자·GA·A/B 테스트의 관측값이 아닌 합성 결과</strong>입니다.</p></div>
          <div className="ut-metrics"><article><span>예상 완료</span><strong>{report.counts.complete}<small> / 30명</small></strong><p>규칙 기반 가상 행동 경로</p></article><article><span>이탈 시나리오</span><strong>{report.counts.drop}<small> / 30명</small></strong><p>핵심 과업 포기 가능성 가정</p></article><article><span>평균 마찰 점수</span><strong>{report.avgFriction}<small> / 100</small></strong><p>높을수록 경험상 장애가 큼</p></article><article className="ut-risk"><span>핵심 리스크</span><h3>{report.factors[0].name}</h3><p>30명 중 {report.factors[0].count}명의 지배적 위험 요인으로 가정</p></article></div>
          <div className="ut-chart-grid"><article className="ut-panel"><h3>가상 행동 결과 분포</h3><div className="ut-donut-layout"><div className="ut-donut" role="img" aria-label={`예상 완료 ${report.counts.complete}명, 지연 ${report.counts.hesitate}명, 이탈 ${report.counts.drop}명`} style={{background:`conic-gradient(var(--chart-2) 0 ${report.counts.complete/30*100}%,var(--chart-4) ${report.counts.complete/30*100}% ${(report.counts.complete+report.counts.hesitate)/30*100}%,var(--destructive) ${(report.counts.complete+report.counts.hesitate)/30*100}% 100%)`}}><div><strong>30</strong><span>합성 페르소나</span></div></div><dl className="ut-legend">{(['complete','hesitate','drop'] as const).map(key=><div key={key}><dt><i style={{background:outcomeColors[key]}}/>{outcomeLabels[key]} 시나리오</dt><dd>{report.counts[key]}명</dd></div>)}</dl></div></article><article className="ut-panel"><h3>주요 마찰 요인</h3><div className="ut-bars">{report.factors.map(factor=><div key={factor.key}><div><span>{factor.name}</span><strong>{factor.count} / 30</strong></div><meter min="0" max="30" value={factor.count} aria-label={factor.name}/></div>)}</div></article></div>
          <article className="ut-panel"><div className="ut-panel-heading"><h3>Voice of Persona / VOC</h3><small>합성 발언 · 실제 인터뷰 아님</small></div><div className="ut-voc-grid">{[...report.rows].sort((a,b)=>b.score-a.score).slice(0,6).map(row=><blockquote key={row.id}><p>“{row.voc}”</p><footer><strong>{row.name} · {row.age}세</strong><span>{row.role}</span></footer></blockquote>)}</div></article>
          <article className="ut-panel ut-results-table"><div className="ut-panel-heading"><h3>페르소나별 테스트 로그</h3><div className="ut-filter" role="group" aria-label="결과 필터">{(['all','drop','hesitate','complete'] as const).map(value=><button type="button" key={value} aria-pressed={filter===value} onClick={()=>setFilter(value)}>{value==='all'?'전체':outcomeLabels[value]}</button>)}</div></div><div className="ut-table-scroll"><table><caption className="sr-only">합성 페르소나별 예상 경로·마찰 점수·VOC</caption><thead><tr><th scope="col">페르소나</th><th scope="col">주요 성향</th><th scope="col">예상 경로</th><th scope="col">마찰 점수</th><th scope="col">가상 VOC</th></tr></thead><tbody>{rows.map(row=><tr key={row.id}><td><button type="button" className="ut-persona-link" onClick={()=>setSelectedPersona(row)}>{row.name}</button></td><td>{row.role}</td><td><span className={`ut-outcome ut-outcome--${row.outcome}`}>{outcomeLabels[row.outcome]}</span></td><td>{row.score} / 100</td><td>{row.voc}</td></tr>)}{!rows.length&&<tr><td colSpan={5}>해당하는 페르소나가 없습니다.</td></tr>}</tbody></table></div></article>
        </>}
      </section>
      <section className="ut-after"><SectionHeading step="04 / IMPROVEMENTS" title="After · UX 개선 방향" description="가상의 불편 신호를 검증 가능한 디자인 가설과 개선안으로 연결합니다."/>
        {!report||!spec?<div className="ut-empty"><h3>개선안은 시뮬레이션 후 생성됩니다.</h3><p>우선순위별 개선 가설과 개념 와이어프레임을 확인할 수 있어요.</p></div>:<>
          <div className="ut-recommendations">{spec.solutions.map(([title,description,impact,effort],index)=><article className="ut-panel" key={title}><span className="ut-eyebrow">가설 0{index+1}</span><h3>{title}</h3><p>{description}</p><div className="ut-tags"><span>예상 영향 {impact}</span><span>구현 난도 {effort}</span></div></article>)}</div>
          <article className="ut-panel"><div className="ut-panel-heading"><h3>Before → After</h3><small>개념 예시 · 원본 충실 재설계 아님</small></div><div className="ut-comparison"><div><h4>Before <small>업로드 이미지</small></h4><div className="ut-phone ut-phone--before"><img src={images.find(Boolean)!.src} alt="첫 번째 Before 원본 화면"/></div></div><ArrowRight size={22} aria-hidden="true"/><div><h4>After <small>구조 개선안</small></h4><UtConceptPhone issue={report.issue}/></div></div><p className="ut-caption">입력한 문제 유형에 맞춘 패턴 예시입니다. 업로드 이미지를 AI가 해석하거나 재디자인한 결과가 아닙니다.</p></article>
          <div className="ut-note"><h3>다음 단계 · 실제 사용자에게 검증하기</h3><ol><li>개선 가설을 Figma 프로토타입으로 구현합니다.</li><li>실제 사용자에게 동일한 과업을 테스트합니다.</li><li>성공률·소요 시간·정성 VOC를 관측하고 가설을 보완합니다.</li></ol></div>
        </>}
      </section>
      <footer className="ut-footer">A+studio UT Lab · 합성 가설을 탐색하고 실제 사용자에게 검증하세요.</footer>
    </div>
    <Inspector person={selectedPersona} method={methodOpen} onClose={closeInspector}/>
  </dialog>,document.body);
}
