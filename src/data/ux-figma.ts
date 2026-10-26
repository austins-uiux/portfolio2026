/** Case-specific Figma work samples. Add a public, viewable share URL per case. */
export const uxFigmaUrls: Record<string, string> = {
  'naver-cart': '',
  'tripstore-comparison': '',
  'venti-delivery-map': '',
  'flitto-membership': '',
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
