import type { PortfolioEntry } from '../types';
import naverReport from './ux-reports/naver.json';
import tripstoreReport from './ux-reports/tripstore.json';
import ventiReport from './ux-reports/venti.json';
import flittoReport from './ux-reports/flitto.json';
import { uxEditorial } from './ux-editorial';

type Outcome = 'complete' | 'hesitate' | 'drop';
export type UxSimulation = {
  personaCount: number;
  counts: Record<Outcome, number>;
  avgFriction: number;
  factors: { name: string; count: number; key: string }[];
  rows: { id: number; name: string; age: number; role: string; outcome: string; reason: string; voc: string }[];
};

export interface UxCase {
  id: string;
  app: string;
  category: string;
  icon: string;
  eyebrow: string;
  title: string;
  lede: string;
  problem: string;
  observation: string;
  observations: { label: string; detail: string }[];
  hypothesis: string;
  mission: string;
  findings: { title: string; detail: string }[];
  decisions: { title: string; from: string; to: string; why: string }[];
  validation: { question: string; method: string; metric: string }[];
  closing: string;
  conceptCaption: string;
  report: UxSimulation;
}

const folder = '/assets/ux-cases';
export const uxCases: UxCase[] = [
  {
    id: 'naver-cart', app: '네이버 플러스 스토어', category: '쇼핑', icon: `${folder}/naver-figma-icon.png`,
    eyebrow: '01 / SHOPPING EXPERIENCE', title: '장바구니에서 최종 금액을 계산하게 만들지 않기',
    lede: '선택한 상품, 판매자별 배송, 주문 예상 금액. 장바구니에 정보는 충분하지만 사용자가 실제로 확인하려는 질문은 하나일 수 있습니다. “그래서 지금 얼마를 내는 거지?”',
    problem: '여러 판매자의 상품을 담은 장바구니에서 배송비와 할인 조건을 포함한 실제 지출 금액을 예측하기 어려울 수 있다.',
    observation: '제공된 UI Flow에는 일반배송·지금배달 탭, 판매자별 상품 묶음, 상품 선택 상태, 배송비 안내, 하단 주문 예상 금액과 주문 버튼이 보입니다. 기능이 많다는 사실만으로 이탈의 원인을 단정할 수는 없습니다.',
    observations: [
      { label: '배송 방식과 판매자 구조', detail: '상단의 배송 유형 탭과 판매자별 묶음이 서로 다른 분류 기준으로 제시됩니다.' },
      { label: '선택 상태와 합계의 관계', detail: '선택·해제 가능한 상품과 하단 주문 예상 금액이 분리된 위치에 있습니다.' },
      { label: '가격 정보의 여러 층위', detail: '상품 금액 외에 판매자 단위 배송비, 예상 금액 등 추가 확인 요소가 있습니다.' },
    ],
    hypothesis: '선택한 상품의 결제 구성과 배송 조건을 구매 결정 지점에서 함께 확인할 수 있으면 비용을 재계산하는 인지 부담을 줄일 수 있다.',
    mission: '서로 다른 판매자 상품 두 개를 선택하고, 배송비를 포함한 예상 결제 금액을 확인한 뒤 주문 단계로 진입하기.',
    findings: [
      { title: '비용 예측의 불확실성', detail: '선택 상태가 바뀔 때 상품 금액·배송비가 어떤 방식으로 반영되는지 더 직접적인 피드백이 필요하다는 가설입니다.' },
      { title: '흐름의 구분', detail: '일반배송·지금배달의 경계와 판매자 단위 정보의 관계를 사용자가 기억해야 할 수 있습니다.' },
      { title: '결정 직전의 정보 접근', detail: '주문 CTA 인근에서 결제 구성과 조건을 함께 확인할 수 있는 구조를 검토합니다.' },
    ],
    decisions: [
      { title: '금액을 하나의 영수증처럼', from: '판매자별 배송 정보와 화면 하단 예상 합계', to: '선택 상품금액·배송비·할인을 한곳에서 펼쳐 보는 결제 구성', why: '사용자가 최종 금액의 계산 과정을 직접 추론하지 않도록 합니다.' },
      { title: '배송 그룹의 의미를 분명하게', from: '여러 배송 탭과 판매자 섹션', to: '배송 방식별 그룹명, 도착 예상 정보, 별도 결제 여부를 명시', why: '분류 방식이 주문 경험에 어떤 영향을 주는지 설명합니다.' },
      { title: '선택 변경을 즉시 피드백', from: '상품 개별 선택과 떨어져 있는 합계', to: '선택 수량·금액 변화와 배송비 변동을 같은 화면에서 안내', why: '선택에 따른 결과를 즉시 확인할 수 있게 합니다.' },
    ],
    validation: [
      { question: '처음 보는 장바구니에서도 최종 결제 금액을 정확히 말할 수 있는가?', method: '5~8명 진행형 과업 테스트 + 사고 발화', metric: '정확한 금액 응답률 · 응답 시간' },
      { question: '배송 유형 및 판매자별 비용을 오해하지 않는가?', method: '변경 전후 프로토타입 비교', metric: '오해 사례 수 · 정보 재탐색 횟수' },
      { question: '실제 구매 흐름이 개선되는가?', method: '운영 환경에서 별도 A/B 테스트 설계', metric: '주문 진입률 · 결제 완료율 · 반품/문의율' },
    ],
    closing: '장바구니의 문제를 단순히 “구매 버튼이 눈에 띄지 않는다”로 환원하지 않았습니다. 사용자가 선택의 결과를 예측할 수 있는가를 중심으로 재설계할 필요가 있습니다.',
    conceptCaption: '생성형 AI를 이용해 그린 Before / After 방향성 참고 이미지입니다. 실제 서비스 화면이나 검증된 개선안은 아닙니다.',
    report: naverReport,
  },
  {
    id: 'tripstore-comparison', app: '트립스토어', category: '여행', icon: `${folder}/tripstore-figma-icon.png`,
    eyebrow: '02 / TRAVEL PLANNING', title: '숙소 세 곳을 비교하다 다시 검색창으로 돌아가는 이유',
    lede: '숙소 비교의 목적은 정보를 더 많이 보는 것이 아니라 차이를 더 빨리 이해하는 것입니다. 선택한 숙소 사이에 비교 기준이 일관되지 않으면 결정은 다시 탐색으로 돌아갑니다.',
    problem: '선택한 숙소의 가격·조건·위치를 나란히 확인하는 과정에서 서로 다른 정보량과 화면 폭이 직접적인 비교를 어렵게 만들 수 있다.',
    observation: '제공된 화면에는 “선택한 숙소 비교 3”, 일정·인원 조건, 숙소별 가격과 위치·편의시설·설명 및 “숙소 바로가기” 버튼이 있습니다. 두 개의 숙소 정보 열이 주요 비교 영역에 보이고 긴 텍스트가 반복됩니다.',
    observations: [
      { label: '선택 수와 비교 가시성', detail: '선택은 3곳으로 표시되지만 비교 영역에는 제한된 수의 열만 한 번에 노출됩니다.' },
      { label: '조건의 일관성', detail: '일정·인원 기준은 있으나 숙소별 요금·객실 조건을 같은 단위로 읽는지 확인이 필요합니다.' },
      { label: '장문의 정보 배치', detail: '상세 설명과 편의시설 문구가 길고, 차이보다 텍스트의 양이 먼저 눈에 들어올 수 있습니다.' },
    ],
    hypothesis: '동일 기준의 비교표와 차이점 우선 요약을 제공하면 사용자가 재탐색하지 않고 후보를 좁힐 수 있을 것이다.',
    mission: '후보 3곳 중 일정·인원 조건이 같은 숙소를 비교하고, 가격과 위치의 우선순위를 고려해 최종 1곳을 선택하기.',
    findings: [
      { title: '비교 기준의 발견성', detail: '가격·거리·편의시설 중 무엇이 같은 조건으로 비교되는지 명확하게 보여줄 필요가 있습니다.' },
      { title: '차이보다 설명이 앞서는 구조', detail: '사용자는 장문을 모두 읽어야 다른 점을 찾을 수 있다는 부담을 느낄 수 있습니다.' },
      { title: '제한된 화면 폭', detail: '3곳을 선택했더라도 한 화면에 들어오는 숙소 수는 제한되므로 가로 탐색 상태가 중요합니다.' },
    ],
    decisions: [
      { title: '차이만 먼저 보여주는 요약', from: '숙소별 장문 스펙 병치', to: '총액·취소 조건·이동 시간·핵심 편의시설 차이 하이라이트', why: '선택에 영향을 주는 차이를 우선 발견하도록 돕습니다.' },
      { title: '조건 고정 비교', from: '상단 날짜·인원과 개별 호텔 정보', to: '비교 전체에 적용된 검색 조건을 고정 헤더로 명시', why: '공정한 비교 조건인지 판단할 수 있게 합니다.' },
      { title: '세 번째 후보의 존재 표시', from: '일부 열만 보이는 비교', to: '후보 수·현재 위치·가로 스크롤 힌트 제공', why: '비교 대상 일부가 화면 밖에 있다는 점을 분명히 알립니다.' },
    ],
    validation: [
      { question: '사용자가 가장 저렴한 총액과 차이를 정확히 찾는가?', method: '동일 조건 비교 과업 / 화면별 진행 시간 측정', metric: '정답률 · 과업 소요시간' },
      { question: '비교에서 후보를 하나로 줄이는 데 얼마나 걸리는가?', method: 'Before/After 동일 정보로 수행', metric: '결정 시간 · 정보 왕복 횟수' },
      { question: '어떤 비교 기준이 실제 선택을 좌우하는가?', method: '후속 인터뷰 및 프로토타입 사용 로그', metric: '기준별 조회 빈도 · 최종 선택 이유' },
    ],
    closing: '비교 도구의 품질은 정보의 총량보다 선택 기준을 얼마나 균등하게 만드는지에 달려 있습니다. 숙소의 “상세함”과 숙소 간 “비교 가능성”은 다른 UX 목표입니다.',
    conceptCaption: '비교 기준을 표준화하고 차이를 강조하는 방향으로 제작한 콘셉트 이미지입니다. 실제 트립스토어의 개선 화면은 아닙니다.',
    report: tripstoreReport,
  },
  {
    id: 'venti-delivery-map', app: '더벤티', category: 'F&B 배달', icon: `${folder}/venti-figma-icon.png`,
    eyebrow: '03 / LOCATION-BASED ORDER', title: '가까운 매장 세 곳이 전부 주문불가였을 때',
    lede: '지도에서 매장을 찾을 때 거리만으로는 충분하지 않습니다. 사용자의 목적은 핀을 고르는 일이 아니라 지금 실제로 배달받을 수 있는 매장을 선택하는 일입니다.',
    problem: '지도에 표시된 다수의 매장 중 배달 가능 여부와 거리를 함께 판단하는 과정에서 선택과 탐색이 길어질 수 있다.',
    observation: '제공된 플로우는 지도에서 배달 위치를 정하고 상세 주소를 입력한 뒤 “배달 매장 찾기”로 진입하는 구조입니다. 다음 화면에 지도 핀과 거리순 매장 목록이 함께 표시되며, 일부 가까운 매장은 “주문불가” 상태입니다.',
    observations: [
      { label: '지도와 목록의 대응', detail: '여러 핀과 하단 목록이 함께 나타나지만 각 항목의 연결 관계를 확인해야 합니다.' },
      { label: '가까움과 가능함의 불일치', detail: '목록 상단에 가까운 매장이 있어도 “주문불가” 상태가 표시된 항목이 있습니다.' },
      { label: '주소 확정 단계', detail: '지도 위치, 상세 주소, 장소 별칭 입력이 나뉘어 있고 위치 정확도에 따라 검색 결과가 달라질 수 있습니다.' },
    ],
    hypothesis: '선택 가능한 매장을 기본적으로 먼저 보여주고 지도 핀과 목록을 동기화하면 탐색 마찰이 줄어들 것이다.',
    mission: '배달 위치를 지정한 뒤, 주문 가능한 가까운 매장을 지도나 목록에서 찾아 선택하기.',
    findings: [
      { title: '가장 가까운 매장이 최선은 아님', detail: '거리순 목록의 상위 항목이 주문 불가이면 사용자는 다음 후보를 추가 확인해야 합니다.' },
      { title: '상태 차이의 시각화', detail: '지도 핀에 주문 가능/불가 상태를 구분하면 목록과의 왕복을 줄일 여지가 있습니다.' },
      { title: '위치 확신이 우선', detail: '주소 입력과 핀 위치가 실제 배달 목적지와 일치하는지 피드백이 필요할 수 있습니다.' },
    ],
    decisions: [
      { title: '주문 가능 우선 필터', from: '주문 불가 매장을 포함한 거리순 목록', to: '“주문 가능만” 필터를 상단에 제시하고 기본 정렬을 조정', why: '현재 수행 가능한 과업에 집중하게 합니다.' },
      { title: '핀과 카드 상태 연결', from: '여러 핀·목록을 따로 탐색', to: '핀 탭 시 대응 카드 강조, 카드 탭 시 지도 중심 이동', why: '공간 정보와 상세 정보를 한 번에 연결합니다.' },
      { title: '배달 주소 확신 제공', from: '핀 조정·주소·별칭을 따로 입력', to: '검색 결과 상단에 배달 주소를 고정하고 수정 경로 제공', why: '잘못된 위치에서 매장을 고르는 위험을 낮춥니다.' },
    ],
    validation: [
      { question: '주문 가능한 가장 가까운 매장을 빠르게 고르는가?', method: '지도 기반 과업 / 선택 경로 기록', metric: '정상 매장 선택률 · 첫 선택까지 시간' },
      { question: '주문 불가 핀을 실수로 선택하는가?', method: '기존 vs 상태구분 프로토타입 비교', metric: '잘못된 탭 수 · 지도/목록 왕복 횟수' },
      { question: '주소 오류 때문에 탐색이 반복되는가?', method: '위치 수정 시나리오 검증', metric: '수정 완료율 · 재탐색률' },
    ],
    closing: '매장 선택의 본질은 지도를 잘 그리는 것이 아니라 “내가 지금 이용 가능한 선택지”를 드러내는 것입니다. 가까움·가능함·정확함의 우선순위를 다시 정의했습니다.',
    conceptCaption: '주문 가능 필터·상태별 핀·목록 연동을 표현한 AI 콘셉트 이미지입니다. 실제 더벤티 화면의 수정본은 아닙니다.',
    report: ventiReport,
  },
  {
    id: 'flitto-membership', app: '플리토', category: 'AI 서비스', icon: `${folder}/flitto-figma-icon.png`,
    eyebrow: '04 / REWARD & MOTIVATION', title: '다음 등급까지 뭘 얼마나 더 해야 하는지 알려주기',
    lede: '멤버십 등급이 많고 기준이 자세하더라도 사용자가 “내가 무엇을 얼마나 더 해야 하나?”에 답하지 못하면 안내는 동기로 연결되지 않습니다.',
    problem: '여러 유형의 배지와 Gold·Silver·Bronze 조건이 긴 목록으로 안내되어 개인의 현재 상태와 다음 목표를 연결하기 어려울 수 있다.',
    observation: '제공된 UI에서 활동 페이지의 배지 카드와 0.0% 진행 상태, “배지 획득 및 승급조건 보기” 액션, 긴 조건 안내 시트를 확인했습니다. 배지 종류에 따라 채택 포인트·번역 건수·기부 등의 조건과 단위가 다릅니다.',
    observations: [
      { label: '서로 다른 계산 단위', detail: '채택·번역·기부 등 배지마다 누적 기준과 단위가 달라 이해에 시간이 필요합니다.' },
      { label: '사용자 상태의 연결 부족', detail: '일부 배지의 0.0% 또는 “-”와 긴 승급 조건을 머릿속으로 연결해야 할 수 있습니다.' },
      { label: '조건 안내의 긴 목록', detail: '자신과 관련된 다음 등급이 아닌 모든 배지의 조건을 탐색해야 하는 구조입니다.' },
    ],
    hypothesis: '현재 등급·누적 상태·다음 등급까지 남은 수치를 하나로 연결하면 목표 이해와 다음 행동 선택을 도울 수 있을 것이다.',
    mission: '특정 배지를 선택하고 현재 상태에서 다음 등급까지 필요한 조건을 확인한 후 수행 가능한 다음 행동을 설명하기.',
    findings: [
      { title: '조건은 있지만 개인화된 다음 목표는 약함', detail: '절대 기준을 읽은 뒤 자신의 누적치를 빼서 남은 요구량을 계산해야 할 수 있습니다.' },
      { title: '배지 체계의 학습 부담', detail: '모든 등급의 조건을 한 번에 제공하면 초보 사용자는 우선순위를 정하기 어렵습니다.' },
      { title: '행동과 보상의 거리', detail: '“어떤 활동을 하면 다음 단계에 가까워지는가”가 안내의 핵심이어야 합니다.' },
    ],
    decisions: [
      { title: '나의 다음 단계부터', from: '모든 Gold·Silver·Bronze 조건 열람', to: '현재 등급·다음 목표·남은 수치를 우선 표시', why: '사용자의 진척도를 스스로 환산하지 않도록 합니다.' },
      { title: '배지별 정보 접기', from: '긴 전체 조건 목록', to: '현재 관련 배지를 상단 배치하고 세부 등급 조건은 펼쳐 보기', why: '초보자에게 필요한 정보량을 제한합니다.' },
      { title: '다음 행동 안내', from: '조건만 읽고 안내 종료', to: '번역 요청·기여 등의 가능한 행동으로 연결하는 CTA', why: '정보 확인을 실제 행동의 출발점으로 만듭니다.' },
    ],
    validation: [
      { question: '사용자가 다음 등급과 남은 요구량을 정확히 설명하는가?', method: '정보 탐색 UT / 계산 없이 응답하게 하기', metric: '정답률 · 조건 이해 시간' },
      { question: '어떤 행동이 승급에 영향을 주는지 이해하는가?', method: '시나리오 기반 사고 발화', metric: '올바른 다음 행동 선택률' },
      { question: '보상 구조가 실제 활동을 늘리는가?', method: '실서비스에서 장기 실험을 별도로 설계', metric: '활동 재방문률 · 유효 기여 횟수' },
    ],
    closing: '등급 안내에서 중요한 정보는 모든 사용자가 언젠가 도달할 최고 등급보다 “지금 나의 다음 단계”입니다. 개인화된 진행감과 설명 가능한 보상이 결합되어야 합니다.',
    conceptCaption: '다음 등급으로의 진행률과 남은 조건을 보여주는 방향으로 생성한 아이디어 이미지입니다. 실제 플리토 서비스 개선 결과가 아닙니다.',
    report: flittoReport,
  },
];

export const uxEntries: PortfolioEntry[] = uxCases.map(item => ({
  id: item.id,
  category: 'ux',
  title: item.title,
  meta: `${item.app} · ${item.category}`,
  kind: 'article',
  uxApp: { name: item.app, category: item.category, icon: item.icon },
  detailTitle: item.title,
  summary: uxEditorial[item.id].introduction,
  cover: { src: `${folder}/${item.id.split('-')[0]}-concept.svg`, alt: `${item.app}의 UI 개선 방향을 시각화한 콘셉트 이미지`, width: 1672, height: 941 },
  thumbnail: { src: `${folder}/${item.id.split('-')[0]}-thumbnail.svg`, alt: `${item.app} 개선 전후 모바일 화면을 중앙에 배치한 시각화`, width: 1672, height: 941 },
  sections: uxEditorial[item.id].sections.map(section => ({
    heading: section.heading,
    body: [...(section.paragraphs ?? []), ...(section.bullets ?? []), ...(section.afterBullets ?? []), section.quote ?? '', ...(section.steps ?? [])].join(' '),
  })),
}));

export const getUxCase = (id: string) => uxCases.find(item => item.id === id);
