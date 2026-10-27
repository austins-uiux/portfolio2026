/** Case-specific Figma work samples. Add a public, viewable share URL per case. */
export const uxFigmaUrls: Record<string, string> = {
  'naver-cart': 'https://www.figma.com/design/OzVZZ4AUJ6RQ3alJsFrnVt/UX-%EA%B0%9C%EC%84%A0-%EC%82%AC%EB%A1%80?node-id=1-20&t=PXJAV48IPyye11At-4',
  'tripstore-comparison': 'https://www.figma.com/design/OzVZZ4AUJ6RQ3alJsFrnVt/UX-%EA%B0%9C%EC%84%A0-%EC%82%AC%EB%A1%80?node-id=1-752&t=PXJAV48IPyye11At-4',
  'venti-delivery-map': 'https://www.figma.com/design/OzVZZ4AUJ6RQ3alJsFrnVt/UX-%EA%B0%9C%EC%84%A0-%EC%82%AC%EB%A1%80?node-id=1-1616&t=PXJAV48IPyye11At-4',
  'flitto-membership': 'https://www.figma.com/design/OzVZZ4AUJ6RQ3alJsFrnVt/UX-%EA%B0%9C%EC%84%A0-%EC%82%AC%EB%A1%80?node-id=1-1769&t=PXJAV48IPyye11At-4',
};

/** Figma's official embed endpoint; preserve a link's page/frame selection. */
export function getFigmaEmbedUrl(shareUrl: string): string | null {
  if (!shareUrl.trim()) return null;
  try {
    const url = new URL(shareUrl);
    if (url.protocol !== 'https:' || !['figma.com', 'www.figma.com', 'embed.figma.com'].includes(url.hostname)) return null;
    if (!/^\/(design|proto|board|slides|deck)\/[A-Za-z0-9]+(?:\/|$)/.test(url.pathname)) return null;
    url.hostname = 'embed.figma.com';
    url.searchParams.set('embed-host', 'aplus-studio');
    return url.toString();
  } catch {
    return null;
  }
}
