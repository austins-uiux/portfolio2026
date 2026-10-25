/* A+studio UT Lab v0.2 — deterministic synthetic research, not empirical user testing. */
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
const round = number => Math.round(number);

const subcategories = {
  commerce: [['shopping','온라인 쇼핑몰'],['grocery','식료품 · 장보기'],['secondhand','중고거래'],['subscription','구독 커머스']],
  lifestyle: [['delivery','음식 배달'],['booking','예약 · 티켓'],['mobility','모빌리티'],['realestate','부동산 · 생활']],
  content: [['streaming','영상 · 스트리밍'],['news','뉴스 · 아티클'],['education','교육 · 학습'],['gaming','게임']],
  finance: [['banking','모바일 뱅킹'],['investing','투자 · 자산관리'],['payment','간편결제'],['insurance','보험']],
  social: [['messenger','메신저'],['community','커뮤니티'],['dating','매칭 · 데이팅'],['socialmedia','SNS']],
  brand: [['corporate','기업 · 브랜드'],['membership','멤버십'],['campaign','캠페인 · 이벤트'],['support','고객지원']],
  portal: [['search','검색 · 포털'],['productivity','생산성 도구'],['workspace','협업 · 업무'],['utilities','유틸리티']],
  health: [['fitness','피트니스'],['medical','병원 · 의료'],['wellness','웰니스'],['nutrition','영양 · 식단']]
};
const serviceContexts = {commerce:'구매 의사결정과 비용 정보',lifestyle:'시간과 장소 선택의 확실성',content:'콘텐츠 탐색과 소비 흐름',finance:'안전성과 신뢰 가능한 피드백',social:'관계 형성과 즉각적인 소통',brand:'브랜드 신뢰와 정보 접근성',portal:'탐색 효율과 과업 생산성',health:'정보 신뢰도와 개인 상황 적합성'};

const names = ['김서현','이준호','박민지','최도윤','정하은','강지훈','윤지아','임서준','한유진','오지민','조태현','신아린','송현우','권수빈','안지호','문예린','백승민','남수아','유건우','표나연','차지환','노은채','구재민','서유리','황도현','류지은','진승우','민하린','배시온','심다예'];
const personaRoles = ['빠른 해결 추구형','신중한 정보 비교형','가격 민감형','신뢰 중심형','디지털 초심자형','직관적 탐색형','접근성 고려형','반복 이용 숙련형','계획형 사용자','즉흥적 선택형','시간 절약형','보수적 결정형','혜택 탐색형','모바일 집중형','정보 확인형'];
const circumstances = ['이동 중 짧게 사용하는 편','결정 전 조건을 꼼꼼히 확인','할인·추가 비용에 민감','안내 문구와 신뢰 신호 중시','익숙하지 않은 앱은 천천히 탐색','최소 단계로 끝내기를 기대','작은 글씨와 복잡한 조작에 민감','반복 과업의 효율에 민감','여러 대안을 비교 후 선택','관심이 생기면 바로 행동','대기와 지연에 대한 인내가 낮음','변경·취소 가능성을 따져봄','실질 혜택을 끝까지 살펴봄','한 손 조작과 화면 밀도에 민감','오류 상황과 정책을 확인'];
const personaVoice = ['이동 중에는 더 간단한 안내가 필요해요.','다른 선택지와 비교할 기준이 보이면 좋겠어요.','제가 부담할 비용부터 확인하고 싶어요.','확실하다는 표시가 있으면 선택할 수 있어요.','익숙하지 않은 사람도 이해할 수 있으면 좋겠어요.','핵심 정보만 바로 보여주면 훨씬 편할 것 같아요.','글씨와 터치 영역이 더 분명했으면 해요.','자주 쓰는 기능이라 동선이 길면 불편해요.','미리 계획할 수 있도록 정보를 정리해주면 좋겠어요.','지금 바로 선택할 수 있게 해주면 좋겠어요.','몇 초라도 덜 걸리는 흐름을 선호해요.','나중에 수정하거나 취소할 수 있는지도 궁금해요.','실제 혜택이 어디에 적용되는지 보고 싶어요.','작은 화면에서도 중요한 정보가 먼저 보여야 해요.','문제가 생겼을 때 어떻게 해결할지 알려주세요.'];
const personaVoiceAlt = ['화면을 다시 찾아보지 않고 결정할 수 있게 해주세요.','선택 결과가 예상과 일치하는지 확인하고 싶어요.','미리 알아야 할 조건이 뒤에 숨지 않았으면 해요.','명확한 근거가 없다면 잠시 보류할 것 같아요.','복잡한 용어를 쉬운 말로 풀어주면 좋겠어요.','우선순위가 명확하면 더 빨리 끝낼 수 있어요.','헷갈리지 않게 상태를 구분해주면 좋겠어요.','이전 단계로 돌아가는 수고를 줄이고 싶어요.','변경 전에 전체 조건을 한 번에 보고 싶어요.','결정 직전에 망설이게 하는 요소가 없어야 해요.','일을 빠르게 끝낼 수 있다는 확신이 필요해요.','실수해도 되돌릴 수 있는지 알려주세요.','혜택 조건을 먼저 제시하면 이해하기 쉬워요.','스크롤을 많이 하지 않아도 핵심을 볼 수 있어야 해요.','진행이 정상인지 알려주는 피드백이 필요해요.'];
const palette = ['#eadcf5','#dceaf9','#f9e2cc','#d9f1e1','#f7dbe6','#ebebd2','#d7e2f4','#f3e0da'];
function hashedTrait(index, axis, seed){
  let x = Math.imul(index+1, 0x9e3779b1) ^ Math.imul(axis+11,0x85ebca6b) ^ Math.imul(seed+1,0xc2b2ae35);
  x ^= x>>>16;
  x=Math.imul(x,0x7feb352d);
  x^=x>>>15;
  return 1+((x>>>0)%5);
}

const issueLibrary = {
  cart: {
    label:'결제 전환의 불확실성', noun:'결제', action:'결제 진행', baseline:41,
    triggers:['장바구니','카트','checkout','결제','구매','배송비','주문'],
    factors:['추가 비용 불확실성','다음 행동의 발견성','정보 확인 부담','결제 신뢰 부족'],
    voc:{price:'추가 비용이 얼마인지 먼저 알고 싶어요. 마지막에 나오면 다시 고민하게 돼요.',clarity:'어디를 눌러야 주문이 이어지는지 순간적으로 헷갈렸어요.',effort:'이 단계에서 확인해야 할 게 너무 많아 보여요. 빨리 끝내고 싶어요.',trust:'최종 금액과 취소 조건이 명확하지 않아 바로 결제하기 망설여져요.'},
    solutions:[['최종 결제 금액을 조기에 노출','상품 금액·할인·배송비·최종 금액을 CTA 직전 한 영역에 고정해 비용의 예측 가능성을 높입니다.','높음','낮음'],['다음 행동을 단일 CTA로 명확화','주요 버튼의 레이블을 행동 중심으로 바꾸고, 선택과 결제 단계 사이의 불필요한 분기를 줄입니다.','높음','중간'],['신뢰 신호와 오류 복구 강화','배송 일정·반품 조건을 짧게 공개하고, 정보 수정 후에도 장바구니 상태가 유지되게 설계합니다.','중간','중간']],
    mock:['장바구니','상품과 최종 금액을 확인하세요','베이직 아이템','상품 1개','상품 금액','₩29,000','배송비','₩0','결제 예상 금액','₩29,000','29,000원 결제하기','안전결제 · 주문 전 최종 확인','배송비 포함']
  },
  signup: {
    label:'회원가입 중 인지 부담',noun:'가입',action:'가입 완료',baseline:40,
    triggers:['회원가입','가입','로그인','sign up','인증','온보딩','비밀번호'],
    factors:['가입 가치·혜택 불명확','단계 안내 부족','입력 부담','개인정보 신뢰 부족'],
    voc:{price:'이만큼 정보를 입력해야 할 만큼 얻는 혜택이 있는지 모르겠어요.',clarity:'가입이 몇 단계나 남았는지 알 수 없어 답답해요.',effort:'필수 입력 항목이 많아서 나중에 하려고 화면을 닫게 돼요.',trust:'왜 이 개인정보가 필요한지 알려주면 더 안심될 것 같아요.'},
    solutions:[['필수 입력의 점진적 분리','초기 가입에 꼭 필요한 항목만 받고, 부가 정보는 가입 후 프로필 완성 단계로 이동합니다.','높음','중간'],['진행 상태와 소요 시간 안내','현재 단계와 남은 단계를 표시하고 오류 시 입력값을 보존하여 재시도 비용을 줄입니다.','높음','낮음'],['개인정보 요청 이유 설명','민감 정보의 사용 목적과 선택 여부를 필드 가까이에 짧게 설명합니다.','중간','낮음']],
    mock:['시작하기','1분이면 준비가 끝나요','이메일 주소','name@example.com','비밀번호','8자 이상 입력','진행 단계','1 / 2','필수 입력','2개','완료까지','약 1분','다음 단계로','입력한 정보는 안전하게 보호돼요','1 / 2단계']
  },
  booking: {
    label:'예약 가능 여부의 모호함',noun:'예약',action:'예약 확정',baseline:39,
    triggers:['예약','날짜','시간 선택','스케줄','방문','티켓','좌석','booking'],
    factors:['추가 요금 불확실성','가능 시간 탐색 어려움','선택 과정 부담','취소 정책 불확실성'],
    voc:{price:'추가 요금이나 취소 수수료가 있는지 미리 확인하고 싶어요.',clarity:'선택할 수 있는 시간이 한눈에 보이지 않아 계속 왔다 갔다 했어요.',effort:'날짜를 바꿀 때마다 처음부터 다시 고르는 게 번거로워요.',trust:'선택한 일정이 정말 예약되는 건지 확신이 안 들어요.'},
    solutions:[['예약 가능 슬롯을 즉시 표시','가능한 시간만 강조하고, 불가능한 시간은 이유와 함께 비활성 상태로 구분합니다.','높음','중간'],['선택 내역을 요약·고정','날짜·시간·인원·예상 금액을 한 곳에서 확인하고 변경할 수 있도록 합니다.','높음','낮음'],['확정 전 정책과 결과 명시','취소·변경 기한과 예약 완료 후 받는 안내를 버튼 근처에서 설명합니다.','중간','낮음']],
    mock:['예약하기','원하는 일정을 선택하세요','방문 일정','10월 28일 · 수요일','예약 시간','14:00','이용 인원','성인 2명','추가 비용','없음','예약 확정','언제든 확정 전 수정할 수 있어요','예약 가능']
  },
  search: {
    label:'정보 탐색과 선택의 어려움',noun:'탐색',action:'항목 선택',baseline:36,
    triggers:['검색','찾기','필터','탐색','추천','분류','목록','콘텐츠'],
    factors:['결과 관련성 불명확','정보 구조 불명확','탐색 과정의 부담','결과 신뢰 부족'],
    voc:{price:'필요 없는 선택지가 너무 많이 보여서 비교하는 데 시간이 걸려요.',clarity:'제가 원하는 항목을 어떤 기준으로 찾는지 모르겠어요.',effort:'필터를 적용해도 결과가 명확하게 좁혀지지 않는 것 같아요.',trust:'왜 이 결과가 먼저 나오는지 설명이 있으면 좋겠어요.'},
    solutions:[['사용자 목표 중심으로 결과 정렬','가장 일반적인 과업을 상단에 배치하고, 항목 설명은 선택에 필요한 정보만 남깁니다.','높음','중간'],['필터 상태와 결과 수 가시화','적용된 필터를 칩으로 보여주고 삭제·초기화를 쉽게 만들어 탐색 통제감을 높입니다.','높음','낮음'],['추천 근거 및 상태 피드백 제공','정렬 기준과 추천 이유, 결과 없음 상태에서의 대안을 명확히 제시합니다.','중간','중간']],
    mock:['검색 결과','원하는 항목을 더 빠르게','추천 항목','나에게 맞는 선택','필터','2개 적용','검색 결과','24개','정렬','추천순','결과 자세히 보기','필터 초기화 가능','필터 적용됨']
  },
  generic: {
    label:'과업 흐름의 인지적 마찰',noun:'과업',action:'다음 단계',baseline:37,
    triggers:[],
    factors:['기대 효과 불명확','다음 행동이 불명확함','작업 단계의 부담','신뢰·오류 안내 부족'],
    voc:{price:'이 선택을 했을 때 어떤 결과가 생기는지 확실히 알고 싶어요.',clarity:'가장 중요한 버튼과 정보가 무엇인지 구분하기 어려웠어요.',effort:'여러 단계를 거치다 보니 지금 어디에 있는지 잊어버렸어요.',trust:'정상적으로 진행된 건지 피드백이 부족해 불안했어요.'},
    solutions:[['핵심 행동의 시각적 위계 강화','한 화면의 주요 과업을 하나로 정의하고, 다음 행동과 보조 행동의 대비를 높입니다.','높음','낮음'],['단계별 정보량과 선택지 축소','결정에 꼭 필요한 정보부터 보여주고 나머지는 사용자가 필요할 때 확인하게 만듭니다.','높음','중간'],['상태·결과·오류 피드백 제공','현재 상태, 처리 결과, 실패 시 복구 방법을 명확한 문장으로 표시합니다.','중간','중간']],
    mock:['계속 진행','중요한 것부터 확인하세요','현재 선택','선택한 항목','다음 단계','정보 확인','진행 상태','2 / 3','예상 소요','1분','계속하기','현재 진행 상태를 저장했어요','진행 중']
  }
};

const state = {images:[null,null,null], selectedIndex:0, personas:[], results:null, expanded:false, filter:'all', runNumber:0};
const primary = $('#categoryMain');
const secondary = $('#categorySub');

function getIssueType(input = $('#problem').value) {
  const normalized = input.toLowerCase();
  for(const type of ['cart','signup','booking','search']) {
    if(issueLibrary[type].triggers.some(term => normalized.includes(term))) return type;
  }
  const sub = secondary.value;
  if(['shopping','grocery','payment'].includes(sub)) return 'cart';
  if(['booking','medical'].includes(sub)) return 'booking';
  if(['search','news','streaming'].includes(sub)) return 'search';
  return 'generic';
}

function generatePersonas(){
  const context = serviceContexts[primary.value] || '앱 이용 과정의 편의성';
  const seed = Object.keys(subcategories).indexOf(primary.value) + 1;
  state.personas = names.map((name,index)=>{
    const profile = (index*7+seed*3)%15;
    const age = 19 + ((index*13+seed*5)%43);
    const digital = hashedTrait(index,1,seed);
    const speed = hashedTrait(index,2,seed);
    const price = hashedTrait(index,3,seed);
    const trust = hashedTrait(index,4,seed);
    const accessibility = hashedTrait(index,5,seed);
    return {id:index+1,name,age,role:personaRoles[profile],circumstance:circumstances[profile],voiceIndex:profile,digital,speed,price,trust,accessibility,context,color:palette[(index+seed)%palette.length],initials:name.substring(1,3)};
  });
  renderPersonas();
}

function renderPersonas(){
  const data = state.expanded ? state.personas : state.personas.slice(0,6);
  $('#personaGrid').innerHTML = data.map(person=>`<button type="button" class="persona-card" data-persona="${person.id}"><div class="persona-card-head"><span class="persona-avatar" style="background:${person.color}">${person.initials}</span><div><strong>${person.name}</strong><small>${person.age}세 · ${person.role}</small></div><span class="persona-number">P${String(person.id).padStart(2,'0')}</span></div><p>${person.circumstance}. ${person.context}에 관심.</p><div class="persona-tags"><span>디지털 ${person.digital}/5</span><span>${topTrait(person)} 중시</span></div></button>`).join('');
  $('#togglePersonas').innerHTML = `${state.expanded?'간략히 보기':'30명 전체 보기'} <svg><use href="#i-chevron"/></svg>`;
  $('#personaFootnote').textContent = state.expanded ? '페르소나 카드를 클릭하면 가상의 목표와 성향을 상세히 볼 수 있습니다.' : '대표 6명 표시 · 전체 보기에서 30명 확인 가능';
}

function topTrait(person){
  const traits = [['속도',person.speed],['비용',person.price],['신뢰',person.trust],['접근성',person.accessibility]];
  return traits.sort((a,b)=>b[1]-a[1])[0][0];
}

function changeCategory(){
  const options = subcategories[primary.value] || [];
  secondary.disabled = !primary.value;
  secondary.innerHTML = options.length ? '<option value="">서비스 소분류 선택</option>'+options.map(([key,label])=>`<option value="${key}">${label}</option>`).join('') : '<option value="">대분류를 먼저 선택하세요</option>';
  $('#categoryHint').textContent = primary.value ? `${primary.selectedOptions[0].textContent}에서는 ${serviceContexts[primary.value]}에 대한 사용자 관점을 강조합니다.`:'서비스 유형을 선택하면 사용자 목표, 민감 요인, VOC 시나리오가 달라집니다.';
  generatePersonas();
  updateReady();
  invalidateResults();
}

function updateReady(){
  const complete = [state.images.some(Boolean),$('#problem').value.trim().length>=8,!!primary.value && !!secondary.value];
  const ids=['#checkImage','#checkProblem','#checkCategory'];
  complete.forEach((done,index)=>{
    const item=$(ids[index]);
    item.classList.toggle('ready',done);
    $('.tracker-state',item).textContent=done?'완료':'대기';
  });
  $('#readyCount').textContent=`${complete.filter(Boolean).length}/3`;
  $('#runTest').disabled=!complete.every(Boolean);
  $('#charCount').textContent=`${$('#problem').value.length} / 500`;
  return complete.every(Boolean);
}

function invalidateResults(){
  if(!state.results) return;
  state.results=null;
  $('#resultsContent').classList.add('hidden');
  $('#resultsEmpty').classList.remove('hidden');
  $('#afterContent').classList.add('hidden');
  $('#afterEmpty').classList.remove('hidden');
  $('#overviewStatus').innerHTML='Draft <span class="status-ring"></span>';
  $('#overviewStatusSub').textContent='설정이 변경되어 재실행이 필요합니다';
}

function makeDemoSVG(step){
  const title=['오늘의 발견','장바구니','주문 확인'][step];
  const header=['상품 둘러보기','선택한 상품 2개','결제 전에 확인하세요'][step];
  const cardTitle=['데일리 코튼 티셔츠','데일리 코튼 티셔츠','주문 상품'][step];
  const price=['₩29,000','₩29,000','₩58,000'][step];
  const button=['장바구니 담기','다음으로','결제하기'][step];
  const extra=step===2?'<rect x="22" y="295" width="240" height="91" rx="11" fill="#f2f3f6"/><text x="38" y="321" font-size="11" fill="#727d8c">배송비</text><text x="236" y="321" text-anchor="end" font-size="11" fill="#727d8c">결제 시 계산</text><text x="38" y="358" font-size="12" font-weight="bold" fill="#202a35">총 결제 금액</text><text x="236" y="358" text-anchor="end" font-size="11" fill="#202a35">?</text>':'';
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="284" height="512" viewBox="0 0 284 512"><rect width="284" height="512" fill="#ffffff"/><rect x="0" y="0" width="284" height="52" fill="#fbfbfd"/><text x="22" y="31" font-size="13" font-family="Arial" font-weight="bold" fill="#2c3440">A+ MARKET</text><text x="262" y="31" text-anchor="end" font-size="11" fill="#9ba3ac">● ● ●</text><text x="22" y="83" font-size="17" font-family="Arial" font-weight="bold" fill="#252c35">${title}</text><text x="22" y="109" font-size="10" font-family="Arial" fill="#99a2ad">${header}</text><rect x="22" y="132" width="240" height="144" rx="11" fill="#f5f6f9"/><rect x="36" y="145" width="98" height="116" rx="8" fill="#dfe3ed"/><path d="M66 176 L102 176 L115 213 L97 230 L81 217 L65 230 L49 213 Z" fill="#b5bdd1"/><text x="145" y="171" font-size="10" font-family="Arial" fill="#798390">A+ Essentials</text><text x="145" y="195" font-size="11" font-weight="bold" font-family="Arial" fill="#2d3540">${cardTitle}</text><text x="145" y="219" font-size="13" font-weight="bold" font-family="Arial" fill="#2d3540">${price}</text><text x="145" y="242" font-size="9" font-family="Arial" fill="#a8afb8">수량 2 · 기본 배송</text>${extra}<rect x="22" y="428" width="240" height="48" rx="8" fill="#2586ec"/><text x="142" y="458" font-size="13" font-weight="bold" text-anchor="middle" font-family="Arial" fill="#ffffff">${button}</text><text x="142" y="493" font-size="9" fill="#a4acb5" text-anchor="middle" font-family="Arial">A+studio UT Lab · Demo flow ${step+1}</text></svg>`;
  return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
}

function renderUploads(){
  const labels=['첫 번째 화면','두 번째 화면','세 번째 화면'];
  const stages=['01 / ENTRY','02 / ACTION','03 / OUTCOME'];
  $$('.upload-slot').forEach((slot,index)=>{
    const entry=state.images[index];
    slot.classList.toggle('has-image',!!entry);
    slot.setAttribute('aria-label',entry?`${labels[index]}: ${entry.name}. 변경하려면 클릭`:`${labels[index]} 업로드`);
    if(entry){
      slot.innerHTML=`<img src="${entry.src}" alt="${escapeHTML(entry.name)} 화면 미리보기"/><strong>${labels[index]}</strong><small>${escapeHTML(entry.name)}</small><span class="remove-upload" role="button" tabindex="0" data-remove="${index}" aria-label="${labels[index]} 삭제"><svg><use href="#i-close"/></svg></span>`;
    }else{
      slot.innerHTML=`<span class="upload-icon"><svg><use href="#i-plus"/></svg></span><strong>${labels[index]}</strong><small>클릭 또는 드래그</small><span class="slot-step">${stages[index]}</span>`;
    }
  });
  updateReady();
}

function setImage(index,entry){
  const old=state.images[index];
  if(old?.revoke) URL.revokeObjectURL(old.src);
  state.images[index]=entry;
}

function addFiles(files,preferred=0){
  const valid=files.filter(file=>['image/png','image/jpeg','image/webp'].includes(file.type)&&file.size<=10*1024*1024);
  if(valid.length!==files.length) toast('PNG · JPG · WEBP 파일(장당 10MB 이하)만 사용할 수 있어요.');
  if(!valid.length) return;
  let positions=[preferred,...[0,1,2].filter(index=>index!==preferred&&!state.images[index])];
  valid.slice(0,positions.length).forEach((file,index)=>setImage(positions[index],{src:URL.createObjectURL(file),name:file.name,revoke:true}));
  renderUploads();
  invalidateResults();
}

function toast(message){
  const node=$('#toast');
  node.textContent=message;
  node.classList.add('visible');
  clearTimeout(toast.timer);
  toast.timer=setTimeout(()=>node.classList.remove('visible'),3200);
}

function analyzePersona(person,issue,scenario){
  const intensity = {
    price: 16 + person.price*8 + (issue==='cart'?14:issue==='booking'?4:0),
    clarity: 17 + (6-person.digital)*7 + person.accessibility*3 + (issue==='search'?10:issue==='booking'?7:0),
    effort: 17 + person.speed*6 + (6-person.digital)*3 + (issue==='signup'?12:0),
    trust: 16 + person.trust*7 + (issue==='signup'?7:issue==='cart'?5:0)
  };
  const leading=Object.keys(intensity).sort((a,b)=>intensity[b]-intensity[a])[0];
  const complexity = Math.max(0,state.images.filter(Boolean).length-1)*2;
  const contextModifier = primary.value==='finance'?4:primary.value==='health'?3:0;
  const personalShift = ((person.id*17+scenario.length*3)%19)-9;
  const urgency=/(이탈|포기|불만|높아|많아|어려워)/.test(scenario)?5:0;
  const score=clamp(round(issueLibrary[issue].baseline*.35+intensity[leading]*.62+complexity+contextModifier+personalShift+urgency),19,94);
  const outcome=score>=68?'drop':score>=51?'hesitate':'complete';
  const factorIndex={price:0,clarity:1,effort:2,trust:3}[leading];
  const reason=issueLibrary[issue].factors[factorIndex];
  const voc=`${issueLibrary[issue].voc[leading]} ${person.id>15?personaVoiceAlt[person.voiceIndex]:personaVoice[person.voiceIndex]}`;
  const time=round(24+score*.85+person.speed*6+person.id%13);
  return {...person,score,outcome,leading,reason,voc,time};
}

function simulate(){
  const issue=getIssueType();
  const scenario=$('#problem').value.trim();
  const rows=state.personas.map(person=>analyzePersona(person,issue,scenario));
  const counts={complete:rows.filter(p=>p.outcome==='complete').length,hesitate:rows.filter(p=>p.outcome==='hesitate').length,drop:rows.filter(p=>p.outcome==='drop').length};
  const factors=issueLibrary[issue].factors.map((label,index)=>{
    const key=['price','clarity','effort','trust'][index];
    return {name:label,count:rows.filter(p=>p.leading===key).length,key};
  }).sort((a,b)=>b.count-a.count);
  return {issue,scenario,category:primary.selectedOptions[0].textContent,subcategory:secondary.selectedOptions[0].textContent,createdAt:new Date().toISOString(),rows,counts,factors,avgFriction:round(rows.reduce((sum,p)=>sum+p.score,0)/30),methodology:'Deterministic rule-based persona simulation. No empirical UT, no screenshot understanding, no real LLM inference.'};
}

function sparkline(values){
  const path=values.map((value,index)=>`${index?'L':'M'} ${index*10} ${30-value*.25}`).join(' ');
  return `<svg viewBox="0 0 70 32" preserveAspectRatio="none"><path d="${path}" stroke="currentColor" fill="none" stroke-width="2.5" stroke-linecap="round"/></svg>`;
}

function renderResults(result){
  $('#resultsEmpty').classList.add('hidden');
  $('#resultsContent').classList.remove('hidden');
  $('#afterEmpty').classList.add('hidden');
  $('#afterContent').classList.remove('hidden');
  $('#overviewStatus').innerHTML='Complete <span class="status-ring" style="background:#79c9a1;box-shadow:0 0 0 4px #dff4e7"></span>';
  $('#overviewStatusSub').textContent='합성 리서치 리포트 생성됨';
  $('#metricSuccess').textContent=result.counts.complete;
  $('#metricDrop').textContent=result.counts.drop;
  $('#metricFriction').textContent=result.avgFriction;
  $('#metricRisk').textContent=result.factors[0].name;
  $('#metricRiskDesc').textContent=`30명 중 ${result.factors[0].count}명의 지배적 위험 요인으로 가정`;
  $('#successSparkline').innerHTML=sparkline(result.rows.slice(0,8).map(p=>p.outcome==='complete'?26:10));
  $('#dropSparkline').innerHTML=sparkline(result.rows.slice(0,8).map(p=>p.outcome==='drop'?28:9));
  $('#frictionSparkline').innerHTML=sparkline(result.rows.slice(0,8).map(p=>p.score));
  const {complete,hesitate,drop}=result.counts;
  const a=complete/30*100,b=(complete+hesitate)/30*100;
  $('#outcomeDonut').style.background=`conic-gradient(#76bea1 0 ${a}%,#e4b17b ${a}% ${b}%,#d98882 ${b}% 100%)`;
  $('#outcomeLegend').innerHTML=[['complete','완료 시나리오','#76bea1'],['hesitate','지연·망설임','#e4b17b'],['drop','이탈 시나리오','#d98882']].map(([key,label,color])=>`<div class="legend-row"><span class="legend-dot" style="background:${color}"></span><span>${label}</span><strong>${result.counts[key]} <small>명</small></strong></div>`).join('');
  $('#frictionBars').innerHTML=result.factors.map(factor=>`<div class="friction-row"><div class="friction-row-head"><span>${factor.name}</span><strong>${factor.count} / 30</strong></div><div class="friction-track"><div class="friction-fill" style="width:${factor.count/30*100}%"></div></div></div>`).join('');
  const selected=[...result.rows].sort((a,b)=>b.score-a.score).slice(0,6);
  $('#vocGrid').innerHTML=selected.map(p=>`<div class="voc-card"><svg><use href="#i-quote"/></svg><blockquote>“${escapeHTML(p.voc)}”</blockquote><div class="voc-card-footer"><strong>${p.name} · ${p.age}세</strong><span>${p.role}</span></div></div>`).join('');
  renderTable();
  renderAfter(result);
}

function renderTable(){
  const rows=state.results?.rows || [];
  const filtered=state.filter==='all'?rows:rows.filter(person=>person.outcome===state.filter);
  const status={complete:'완료',hesitate:'지연',drop:'이탈'};
  $('#personaResultsBody').innerHTML=filtered.map(p=>`<tr><td><span class="table-avatar" style="background:${p.color}">${p.initials}</span>${p.name}</td><td>${p.role}</td><td><span class="table-result ${p.outcome}">${status[p.outcome]}</span></td><td><div class="score-meter">${p.score}<span class="score-meter-track"><span style="width:${p.score}%"></span></span></div></td><td title="${escapeHTML(p.voc)}">${escapeHTML(p.voc)}</td></tr>`).join('') || '<tr><td colspan="5">해당하는 페르소나가 없습니다.</td></tr>';
}

function renderAfter(result){
  const spec=issueLibrary[result.issue];
  $('#recommendGrid').innerHTML=spec.solutions.map(([title,description,impact,effort],index)=>`<article class="recommend-card"><div class="recommend-num">HYPOTHESIS 0${index+1}</div><h3>${title}</h3><p>${description}</p><div class="recommend-meta"><span>예상 영향 ${impact}</span><span>구현 난도 ${effort}</span></div></article>`).join('');
  const before=state.images.find(Boolean);
  $('#beforePhone').innerHTML=before?`<img src="${before.src}" alt="업로드한 첫 번째 Before 화면"/>`:'<div class="phone-placeholder">업로드한 UI가 없습니다.</div>';
  const m=spec.mock;
  $('#afterPhone').innerHTML=`<div class="mock-brand">A+ PRODUCT <span>◉</span></div><div class="mock-title">${m[0]}</div><div class="mock-sub">${m[1]}</div><span class="mock-badge">${m[12]}</span><div class="mock-product"><div class="mock-product-thumb"></div><div class="mock-product-text"><b>${m[2]}</b><small>${m[3]}</small></div></div><div class="mock-total"><div class="mock-total-row"><span>${m[4]}</span><strong>${m[5]}</strong></div><div class="mock-total-row"><span>${m[6]}</span><strong>${m[7]}</strong></div><div class="mock-total-row highlight"><span>${m[8]}</span><strong>${m[9]}</strong></div></div><div class="mock-cta">${m[10]}</div><div class="mock-proof">✓ ${m[11]}</div>`;
}

function detailPersona(id){
  const person=(state.results?.rows||state.personas).find(p=>p.id===Number(id));
  if(!person) return;
  const status={complete:'예상 완료',hesitate:'예상 지연',drop:'예상 이탈'};
  const traits=[['디지털 숙련도',person.digital],['빠른 진행 선호',person.speed],['가격 민감도',person.price],['신뢰·확신 요구',person.trust],['접근성 요구',person.accessibility]];
  $('#personaDetail').innerHTML=`<div class="detail-header"><span class="persona-avatar" style="background:${person.color}">${person.initials}</span><div><h2>${person.name}</h2><p>${person.age}세 · ${person.role} · P${String(person.id).padStart(2,'0')}</p></div></div><div class="detail-quote">“${person.circumstance}. ${person.context}에 관심이 많습니다.”</div>${traits.map(([name,value])=>`<div class="trait-row"><div class="trait-row-title"><span>${name}</span><strong>${value} / 5</strong></div><div class="trait-track"><div class="trait-fill" style="width:${value*20}%"></div></div></div>`).join('')}${person.outcome?`<div class="detail-outcome"><h3>${status[person.outcome]} · 마찰 점수 ${person.score}/100</h3><p>가장 강한 가상 마찰: ${person.reason}</p><p>합성 VOC: “${person.voc}”</p><p>가정된 과업 시도 시간: ${person.time}초 (실측값 아님)</p></div>`:''}`;
  $('#personaDialog').showModal();
}

function startTest(){
  if(!updateReady()){toast('UI 화면, 문제 설명, 서비스 유형을 모두 입력해주세요.');return;}
  const overlay=$('#testOverlay');
  overlay.classList.remove('hidden');
  $('#runTest').disabled=true;
  const stages=[['30개의 관점을 준비하고 있어요','서로 다른 사용자 목표와 행동 성향을 구성합니다.'],['마찰 가능성을 모델링하고 있어요','문제 유형별 사전 정의된 가중치를 계산합니다.'],['리서치 가설을 정리하고 있어요','합성 VOC와 개선 방향을 생성합니다.']];
  let current=0;
  const next=()=>{
    current+=10;
    const stage=Math.min(2,Math.floor(current/34));
    $('#processTitle').textContent=stages[stage][0];
    $('#processSubtitle').textContent=stages[stage][1];
    $('#processProgress').style.width=`${current}%`;
    $('#processPercent').textContent=`${current}%`;
    if(current<100){setTimeout(next,100);}else{
      state.results=simulate();
      state.filter='all';
      $$('.filter-pill').forEach(el=>el.classList.toggle('active',el.dataset.filter==='all'));
      renderResults(state.results);
      overlay.classList.add('hidden');
      $('#runTest').disabled=false;
      $('#results').scrollIntoView({behavior:'smooth'});
      toast('합성 UT 리포트가 생성되었어요.');
    }
  };
  $('#processProgress').style.width='0';
  $('#processPercent').textContent='0%';
  setTimeout(next,130);
}

function loadDemo(){
  for(let i=0;i<3;i++) setImage(i,{src:makeDemoSVG(i),name:`A+ Market 샘플 ${i+1}`,revoke:false});
  $('#problem').value='장바구니에서 결제 단계로 넘어가지 않고 이탈하는 사용자가 많아요. 배송비가 마지막 단계까지 명확하지 않아 결정을 미루는 것이 원인일까요?';
  primary.value='commerce';
  changeCategory();
  secondary.value='shopping';
  generatePersonas();
  renderUploads();
  updateReady();
  invalidateResults();
  $('#setup').scrollIntoView({behavior:'smooth'});
  toast('샘플 3장과 문제 상황을 준비했어요. 시뮬레이션을 시작해보세요.');
}

function downloadReport(){
  if(!state.results){toast('먼저 테스트를 실행해주세요.');return;}
  const report={title:'A+studio UT Lab — Synthetic Research Report',disclaimer:'These outputs are simulated hypotheses, not observed user research results.',inputs:{problem:state.results.scenario,category:state.results.category,subcategory:state.results.subcategory,imageNames:state.images.filter(Boolean).map(i=>i.name)},...state.results};
  const url=URL.createObjectURL(new Blob([JSON.stringify(report,null,2)],{type:'application/json;charset=utf-8'}));
  const link=document.createElement('a');
  link.href=url;link.download=`aplus-ut-lab-report-${new Date().toISOString().slice(0,10)}.json`;link.click();
  setTimeout(()=>URL.revokeObjectURL(url),2000);
  toast('합성 리서치 JSON을 다운로드했어요.');
}

function wireEvents(){
  $$('.nav-item').forEach(button=>button.addEventListener('click',()=>{
    $$('.nav-item').forEach(n=>n.classList.remove('active'));
    button.classList.add('active');
    $('#'+button.dataset.target).scrollIntoView({behavior:'smooth'});
  }));
  $('#heroStart').addEventListener('click',()=>$('#setup').scrollIntoView({behavior:'smooth'}));
  $('#emptyStart').addEventListener('click',()=>$('#setup').scrollIntoView({behavior:'smooth'}));
  $('#loadDemo').addEventListener('click',loadDemo);
  $('#problem').addEventListener('input',()=>{updateReady();invalidateResults()});
  $$('.example-chip').forEach(button=>button.addEventListener('click',()=>{$('#problem').value=button.dataset.problem;updateReady();invalidateResults()}));
  primary.addEventListener('change',changeCategory);
  secondary.addEventListener('change',()=>{generatePersonas();updateReady();invalidateResults()});
  $('#togglePersonas').addEventListener('click',()=>{state.expanded=!state.expanded;renderPersonas()});
  $('#personaGrid').addEventListener('click',event=>{const card=event.target.closest('[data-persona]');if(card)detailPersona(card.dataset.persona)});
  const fileInput=$('#fileInput');
  $('#uploadGrid').addEventListener('click',event=>{
    const remove=event.target.closest('[data-remove]');
    if(remove){event.stopPropagation();setImage(Number(remove.dataset.remove),null);renderUploads();invalidateResults();return;}
    const slot=event.target.closest('[data-index]');
    if(slot){state.selectedIndex=Number(slot.dataset.index);fileInput.value='';fileInput.click();}
  });
  $('#uploadGrid').addEventListener('keydown',event=>{
    const remove=event.target.closest('[data-remove]');
    if(remove&&(event.key==='Enter'||event.key===' ')){event.preventDefault();event.stopPropagation();setImage(Number(remove.dataset.remove),null);renderUploads();invalidateResults()}
  });
  fileInput.addEventListener('change',event=>addFiles([...event.target.files],state.selectedIndex));
  $$('.upload-slot').forEach(slot=>{
    slot.addEventListener('dragover',event=>{event.preventDefault();slot.classList.add('dragging')});
    slot.addEventListener('dragleave',()=>slot.classList.remove('dragging'));
    slot.addEventListener('drop',event=>{event.preventDefault();slot.classList.remove('dragging');addFiles([...event.dataTransfer.files],Number(slot.dataset.index))});
  });
  $('#runTest').addEventListener('click',startTest);
  $('#exportJson').addEventListener('click',downloadReport);
  $('#printReport').addEventListener('click',()=>{if(!state.results){toast('먼저 테스트를 실행해주세요.');return;}window.print()});
  $$('.filter-pill').forEach(button=>button.addEventListener('click',()=>{state.filter=button.dataset.filter;$$('.filter-pill').forEach(n=>n.classList.toggle('active',n===button));renderTable()}));
  $('#aboutMethod').addEventListener('click',()=>$('#methodDialog').showModal());
  $$('.close-dialog').forEach(button=>button.addEventListener('click',()=>button.closest('dialog').close()));
  $$('dialog').forEach(dialog=>dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()}));
  $('#themeToggle').addEventListener('click',()=>{
    const mode=document.documentElement.dataset.theme==='dark'?'light':'dark';
    document.documentElement.dataset.theme=mode;
    try{localStorage.setItem('aplus:theme',mode)}catch(e){}
    $('#themeToggle').setAttribute('aria-label',mode==='dark'?'라이트 모드로 변경':'다크 모드로 변경');
  });
}

wireEvents();
generatePersonas();
renderUploads();
$('#exportJson').disabled=false;
$('#printReport').disabled=false;
$('#themeToggle').setAttribute('aria-label',document.documentElement.dataset.theme==='dark'?'라이트 모드로 변경':'다크 모드로 변경');
