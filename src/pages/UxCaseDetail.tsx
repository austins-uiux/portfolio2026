import { ArrowLeft, FlaskConical, ScanEye, ArrowRight, CircleHelp, CheckCircle2 } from 'lucide-react';
import { AppLink } from '../lib/router';
import { categoryEntries } from '../data/portfolio';
import { getUxCase, type UxCase, type UxSimulation } from '../data/ux-cases';

const caseImagePath = '/assets/ux-cases';

function SimulationSection({ report, study }: { report: UxSimulation; study: UxCase }) {
  const total = report.personaCount;
  const leading = report.factors.slice(0, 3);
  const scenarios = leading.map(factor => report.rows.find(person => person.reason === factor.name)).filter(person => person !== undefined);
  const statuses = [
    { key: 'complete' as const, label: '원활', note: '규칙상 낮은 마찰', color: 'var(--ux-success)' },
    { key: 'hesitate' as const, label: '주저', note: '규칙상 중간 마찰', color: 'var(--ux-warning)' },
    { key: 'drop' as const, label: '중단 위험', note: '규칙상 높은 마찰', color: 'var(--ux-danger)' },
  ];
  return <section className="ux-study-section" id="simulation" aria-labelledby="simulation-title">
    <div className="ux-study-section-title"><span className="ux-study-kicker">03 — UT LAB SIMULATION</span><h2 id="simulation-title">30명 합성 페르소나로 살펴본 마찰 신호</h2><p>입력한 문제 시나리오와 서비스 범주를 기준으로 A+studio UT Lab의 규칙 기반 엔진을 실행했습니다. 실제 사용자의 클릭·시선·이탈을 관측한 데이터가 아닙니다.</p></div>
    <div className="ux-study-method-note"><FlaskConical size={18} aria-hidden="true" /><div><strong>실험 성격: 합성 시뮬레이션</strong><span>이 엔진은 이미지 픽셀을 인식하거나 화면을 실제 조작하지 않습니다. 화면 관찰은 별도로 진행했고, 아래 수치는 UX 가설의 우선순위를 탐색하기 위한 가상 지표입니다. 실제 전환율, A/B 검증 결과로 해석할 수 없습니다.</span></div></div>
    <div className="ux-study-kpi-grid">
      <div className="ux-study-kpi"><span>합성 페르소나</span><strong>{total}<small>명</small></strong><span>고정된 유형·속성 조합</span></div>
      <div className="ux-study-kpi"><span>평균 마찰 점수</span><strong>{report.avgFriction}<small>/ 100</small></strong><span>엔진 자체 평가 점수</span></div>
      <div className="ux-study-kpi"><span>주저 판정</span><strong>{report.counts.hesitate}<small> / {total}명</small></strong><span>실제 사용자 주저율 아님</span></div>
    </div>
    <div className="ux-study-graph-grid">
      <div className="ux-study-panel"><div className="ux-study-panel-heading"><h3>시뮬레이션 결과 분포</h3><span>n = {total}</span></div><div className="ux-study-stacked" role="img" aria-label={`원활 ${report.counts.complete}명, 주저 ${report.counts.hesitate}명, 중단 위험 ${report.counts.drop}명`}>
        {statuses.filter(item => report.counts[item.key] > 0).map(item => <span key={item.key} style={{ flex: report.counts[item.key], background: item.color }} />)}
      </div><ul className="ux-study-legend">{statuses.map(item => <li key={item.key}><span className="ux-study-dot" style={{ background: item.color }} /><div><strong>{item.label} <b>{report.counts[item.key]}명</b></strong><small>{item.note}</small></div></li>)}</ul></div>
      <div className="ux-study-panel"><div className="ux-study-panel-heading"><h3>주요 마찰 요인</h3><span>대표 3개 / 중복 없는 분류</span></div><div className="ux-study-bars">{leading.map(factor => <div key={factor.key} className="ux-study-bar-row"><div><span>{factor.name}</span><b>{factor.count}<small> / {total}</small></b></div><div className="ux-study-bar-track"><span style={{ width: `${factor.count / total * 100}%` }} /></div></div>)}</div></div>
    </div>
    <div className="ux-study-subheading"><h3>페르소나별 합성 VOC</h3><span>실제 인터뷰 인용문이 아닌 엔진 생성 대사</span></div>
    <div className="ux-study-vocs">{scenarios.map(person => <blockquote key={person.id} className="ux-study-voc"><div className="ux-study-voc-header"><span className="ux-study-avatar">{person.name.slice(1, 3)}</span><div><strong>{person.name} · {person.age}세</strong><span>{person.role} · 합성 페르소나</span></div></div><p>“{person.voc}”</p><small>{person.reason}</small></blockquote>)}</div>
    <p className="ux-study-footnote">참고: {study.app}의 실제 사용자 VOC, 제품 성과, 앱 분석 데이터는 수집하지 않았습니다. 각 판정은 동일한 규칙과 시나리오 변수로 산출됩니다.</p>
  </section>;
}

export function UxCaseDetail({ id }: { id: string }) {
  const study = getUxCase(id);
  if (!study) return null;
  const entries = categoryEntries('ux');
  const idx = entries.findIndex(entry => entry.id === id);
  const prev = entries[idx - 1];
  const next = entries[idx + 1];
  const key = id.split('-')[0];
  return <article className="detail-page entry-detail ux-study content-container">
    <header className="detail-heading ux-study-heading">
      <AppLink className="entry-back" href="/work/ux"><ArrowLeft size={15} /> UX 개선 사례</AppLink>
      <span className="ux-study-kicker">{study.eyebrow}</span>
      <h1 tabIndex={-1}>{study.title}</h1>
      <div className="ux-study-byline"><img src={study.icon} alt="" width="24" height="24" /><span>{study.app}</span><span className="ux-study-category">{study.category}</span><span className="ux-study-byline-sep"/><span>UX 리디자인 탐색 · 가상 시뮬레이션</span></div>
      <p className="ux-study-lede">{study.lede}</p>
    </header>
    <figure className="ux-study-hero"><img src={`${caseImagePath}/${key}-concept.svg`} width="1672" height="941" alt={`${study.app} UX 개선 가설을 표현한 화면설계 참고 이미지`} loading="eager" decoding="async"/><figcaption>초안용 벡터 화면설계 이미지입니다. 실제 서비스 디자인이나 테스트로 검증된 화면이 아닙니다.</figcaption></figure>
    <div className="ux-study-overview">
      <div><span>WHAT</span><strong>{study.problem}</strong></div><div><span>HOW</span><strong>UI Flow 관찰 → 개선 가설 → 30명 합성 시뮬레이션 → 재설계 방향</strong></div><div><span>STATUS</span><strong>실제 서비스 변경·실사용자 UT 미실시 / Figma 재작업 예정</strong></div>
    </div>
    <nav className="ux-study-toc" aria-label="문서 목차"><span>이 글에서 다루는 내용</span><a href="#context">01 문제와 관찰</a><a href="#hypothesis">02 검증할 가설</a><a href="#simulation">03 UT Lab 결과</a><a href="#redesign">04 개선 제안</a><a href="#next">05 다음 검증</a></nav>

    <section className="ux-study-section" id="context" aria-labelledby="context-title">
      <div className="ux-study-section-title"><span className="ux-study-kicker">01 — CONTEXT & OBSERVATION</span><h2 id="context-title">화면에 무엇이 있고, 어디에서 막힐까?</h2><p>{study.observation}</p></div>
      <figure className="ux-study-source"><div className="ux-study-source-draft"><ScanEye size={28}/><strong>UI Flow 원본 이미지</strong><p>첨부 스크린샷은 별도로 검토했으며 원본 파일은 이미지 배포 단계에서 교체할 예정입니다. 아래에는 화면에서 확인한 구조를 먼저 정리했습니다.</p></div><figcaption><ScanEye size={14} /> 초기 배포용 이미지 영역 · 실제 이미지 교체 예정</figcaption></figure>
      <div className="ux-study-observations">{study.observations.map((item, index) => <div key={item.label}><span className="ux-study-item-index">0{index + 1}</span><div><h3>{item.label}</h3><p>{item.detail}</p></div></div>)}</div>
      <div className="ux-study-evidence-note"><CircleHelp size={17}/><p>위 항목은 <strong>이미지에서 확인한 UI 구조</strong>를 바탕으로 한 전문가 관찰입니다. 실제 사용자가 해당 이유로 이탈했다는 사실은 확인되지 않았습니다.</p></div>
    </section>

    <section className="ux-study-section" id="hypothesis" aria-labelledby="hypothesis-title"><div className="ux-study-section-title"><span className="ux-study-kicker">02 — HYPOTHESIS</span><h2 id="hypothesis-title">문제를 먼저 검증 가능한 질문으로 바꾸다</h2></div><div className="ux-study-thesis"><span>DESIGN HYPOTHESIS</span><p>“{study.hypothesis}”</p></div><div className="ux-study-task"><span>가정한 사용자 과업</span><p>{study.mission}</p></div></section>

    <SimulationSection report={study.report} study={study} />

    <section className="ux-study-section" id="redesign" aria-labelledby="redesign-title"><div className="ux-study-section-title"><span className="ux-study-kicker">04 — DESIGN DIRECTION</span><h2 id="redesign-title">결과를 읽고, 무엇을 바꾸려 할까?</h2><p>시뮬레이션 수치를 제품 성과로 단정하지 않고 화면 관찰과 연결해 우선 검토할 설계 방향을 정리했습니다.</p></div>
      <div className="ux-study-findings">{study.findings.map((item, i) => <div key={item.title}><div className="ux-study-finding-number">0{i + 1}</div><h3>{item.title}</h3><p>{item.detail}</p></div>)}</div>
      <div className="ux-study-decisions">{study.decisions.map((decision, index) => <div className="ux-study-decision" key={decision.title}><div className="ux-study-decision-title"><span>DESIGN {String(index + 1).padStart(2, '0')}</span><h3>{decision.title}</h3></div><div className="ux-study-before-after"><div><span>BEFORE · 관찰한 구조</span><p>{decision.from}</p></div><ArrowRight className="ux-study-transition-icon" size={22} aria-hidden="true"/><div><span>AFTER · 제안 방향</span><p>{decision.to}</p></div></div><p className="ux-study-why"><CheckCircle2 size={16}/>{decision.why}</p></div>)}</div>
      <figure className="ux-study-concept"><img src={`${caseImagePath}/${key}-concept.svg`} alt={`${study.app}의 Before / After 화면설계 방향성 참고 이미지`} loading="lazy" decoding="async"/><figcaption><span>FIGMA REDRAW REFERENCE</span>초안용 벡터 콘셉트입니다. Figma에서 실제 앱 스타일로 다시 그릴 예정입니다.</figcaption></figure>
    </section>

    <section className="ux-study-section" id="next" aria-labelledby="next-title"><div className="ux-study-section-title"><span className="ux-study-kicker">05 — NEXT VALIDATION</span><h2 id="next-title">좋아 보이는 디자인에서, 검증된 디자인으로</h2><p>다음 단계에서는 Figma로 Before/After 프로토타입을 제작하고 동일 과업의 실제 사용성 테스트를 진행해야 합니다. UT Lab 데이터만으로 개선 효과를 말할 수는 없습니다.</p></div><div className="ux-study-validation">{study.validation.map((item, i) => <div key={item.question}><span>0{i + 1}</span><div><h3>{item.question}</h3><p>{item.method}</p><small>검증 지표 · {item.metric}</small></div></div>)}</div><div className="ux-study-conclusion"><span>DESIGNER'S NOTE</span><p>{study.closing}</p></div></section>
    <nav className="entry-pager" aria-label="다른 UX 개선 사례"><div>{prev && <AppLink href={`/project/${prev.id}`}><small>이전 사례</small><span>← {prev.title}</span></AppLink>}</div><div>{next && <AppLink href={`/project/${next.id}`}><small>다음 사례</small><span>{next.title} →</span></AppLink>}</div></nav>
  </article>;
}
