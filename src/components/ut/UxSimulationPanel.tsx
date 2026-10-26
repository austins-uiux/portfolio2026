import { Brand, sidebarLogoScale } from '../Brand';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../lab-ui/tabs';
import type { UxCase } from '../../data/ux-cases';

/** Editorial interpretations of screen observations, not synthetic persona quotes. */
const observations: Record<string, { issue: string; direction: string }> = {
  'naver-cart': {
    issue: '할인 후 상품가와 배송비, 총액의 계산 근거가 서로 다른 위치에 있어 최종 금액을 직접 조합해야 해요.',
    direction: '추가 비용 불확실성을 먼저 해결해요. 상품 7,400원 + 배송비 2,500원 = 예상 금액 9,900원을 한곳에서 보여주고 배송지에 따른 변동 가능성도 가까이 안내해요.',
  },
  'tripstore-comparison': {
    issue: '세 숙소를 선택했지만 한 화면에서는 두 열만 보이고, 가격의 비교 조건과 시설별 차이를 찾기 어려워요.',
    direction: '최저가·체크인·조식·취소 조건처럼 서로 다른 항목을 먼저 모으고, 일정·인원과 세 번째 후보의 존재를 계속 보여줘요.',
  },
  'venti-delivery-map': {
    issue: '가까운 매장 세 곳이 주문불가인데도 거리순 목록의 상단에 있고, 지도 핀에서 주문 가능 여부를 구별하기 어려워요.',
    direction: '주문 가능한 매장을 먼저 노출하고, 상태별 핀 색과 목록 카드의 선택 상태를 연결해 불필요한 탐색을 줄이는 방향이에요.',
  },
  'flitto-membership': {
    issue: '배지 진행률은 0.0%로 보이지만 다음 등급까지 남은 조건과 달성했을 때의 의미는 별도 안내 시트를 읽어도 연결하기 어려워요.',
    direction: '현재 등급 → 다음 Bronze 목표 → 남은 건수·포인트 → 관련 활동 버튼을 한 흐름으로 연결해요.',
  },
};

export function UxSimulationPanel({ study }: { study: UxCase }) {
  const { report } = study;
  const observation = observations[study.id];

  return <div className="ux-sim" aria-label={`${study.app} UT Lab 규칙 기반 시뮬레이션 결과`}>
    <div className="ux-sim-header">
      <div className="ut-brand ux-sim-brand"><Brand variant="sidebar" scale={sidebarLogoScale} /><span className="ut-brand-badge">UT Lab</span></div>
      <span className="ux-sim-version">규칙 기반 시뮬레이션</span>
    </div>

    <Tabs defaultValue="summary" className="ux-sim-tabs">
      <TabsList className="ux-sim-tab-list" aria-label="시뮬레이션 결과 보기">
        <TabsTrigger value="summary">결과 요약</TabsTrigger>
        <TabsTrigger value="factors">마찰 요인</TabsTrigger>
        <TabsTrigger value="insight">UX 인사이트</TabsTrigger>
      </TabsList>

      <TabsContent value="summary" className="ux-sim-content">
        <div className="ux-sim-metrics">
          <div className="ux-sim-metric"><span>가상 페르소나</span><strong>{report.personaCount}<small>명</small></strong></div>
          <div className="ux-sim-metric"><span>평균 마찰 점수</span><strong>{report.avgFriction}<small>/100</small></strong></div>
          <div className="ux-sim-metric"><span>주저로 분류</span><strong>{report.counts.hesitate}<small>/{report.personaCount}명</small></strong></div>
        </div>
        <p className="ux-sim-caption">규칙에 따라 완료 {report.counts.complete}명 · 주저 {report.counts.hesitate}명 · 이탈 {report.counts.drop}명으로 분류됐어요.</p>
      </TabsContent>

      <TabsContent value="factors" className="ux-sim-content">
        <div className="ux-sim-factors">
          {report.factors.slice(0, 3).map((factor, index) => <div className="ux-sim-factor" key={factor.key}>
            <div className="ux-sim-factor-label"><span><span className="ux-sim-rank">0{index + 1}</span>{factor.name}</span><strong>{factor.count}명</strong></div>
            <div className="ux-sim-track" aria-label={`${factor.name}: ${report.personaCount}명 중 ${factor.count}명`} role="img"><span style={{ width: `${(factor.count / report.personaCount) * 100}%` }} /></div>
          </div>)}
        </div>
        <p className="ux-sim-caption">각 인물의 주요 마찰 요인 1개를 기준으로 집계했어요. 상위 3개 항목을 표시합니다.</p>
      </TabsContent>

      <TabsContent value="insight" className="ux-sim-content">
        {observation && <div className="ux-sim-observations">
          <div><span className="ux-sim-observation-label">화면에서 관찰한 문제</span><p>{observation.issue}</p></div>
          <div><span className="ux-sim-observation-label">우선 개선 가설</span><p>{observation.direction}</p></div>
        </div>}
      </TabsContent>
    </Tabs>

  </div>;
}
