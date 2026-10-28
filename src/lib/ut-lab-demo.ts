import { translate } from '../i18n';
/** Local sample flow; no network image dependency. */
export function makeDemoSVG(step: number){
  const title=['오늘의 발견','장바구니','주문 확인'][step];
  const header=['상품 둘러보기','선택한 상품 2개','결제 전에 확인하세요'][step];
  const cardTitle=['데일리 코튼 티셔츠','데일리 코튼 티셔츠','주문 상품'][step];
  const price=['₩29,000','₩29,000','₩58,000'][step];
  const button=['장바구니 담기','다음으로','결제하기'][step];
  const extra=step===2?'<rect x="22" y="295" width="240" height="91" rx="11" fill="#f2f3f6"/><text x="38" y="321" font-size="11" fill="#727d8c">배송비</text><text x="236" y="321" text-anchor="end" font-size="11" fill="#727d8c">결제 시 계산</text><text x="38" y="358" font-size="12" font-weight="bold" fill="#202a35">총 결제 금액</text><text x="236" y="358" text-anchor="end" font-size="11" fill="#202a35">?</text>':'';
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="284" height="512" viewBox="0 0 284 512"><rect width="284" height="512" fill="#ffffff"/><rect x="0" y="0" width="284" height="52" fill="#fbfbfd"/><text x="22" y="31" font-size="13" font-family="Arial" font-weight="bold" fill="#2c3440">A+ MARKET</text><text x="262" y="31" text-anchor="end" font-size="11" fill="#9ba3ac">● ● ●</text><text x="22" y="83" font-size="17" font-family="Arial" font-weight="bold" fill="#252c35">${title}</text><text x="22" y="109" font-size="10" font-family="Arial" fill="#99a2ad">${header}</text><rect x="22" y="132" width="240" height="144" rx="11" fill="#f5f6f9"/><rect x="36" y="145" width="98" height="116" rx="8" fill="#dfe3ed"/><path d="M66 176 L102 176 L115 213 L97 230 L81 217 L65 230 L49 213 Z" fill="#b5bdd1"/><text x="145" y="171" font-size="10" font-family="Arial" fill="#798390">A+ Essentials</text><text x="145" y="195" font-size="11" font-weight="bold" font-family="Arial" fill="#2d3540">${cardTitle}</text><text x="145" y="219" font-size="13" font-weight="bold" font-family="Arial" fill="#2d3540">${price}</text><text x="145" y="242" font-size="9" font-family="Arial" fill="#a8afb8">수량 2 · 기본 배송</text>${extra}<rect x="22" y="428" width="240" height="48" rx="8" fill="#148ddf"/><text x="142" y="458" font-size="13" font-weight="bold" text-anchor="middle" font-family="Arial" fill="#ffffff">${button}</text><text x="142" y="493" font-size="9" fill="#a4acb5" text-anchor="middle" font-family="Arial">A+studio UT Lab · Demo flow ${step+1}</text></svg>`;
  return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg.replace(/>([^<>]+)</g, (_, text: string) => '>' + translate(text).replace(/&/g, '&amp;') + '<'));
}

