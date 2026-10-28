import { translate, localize } from '../i18n';
import { site } from '../data/portfolio';
import { AppLink } from '../lib/router';

export function Footer() {
  return <footer className="footer"><AppLink href="/" aria-label={translate("A+studio 홈")}><img src="/assets/home-Union1.svg" width="94" height="17" alt="A+studio" /></AppLink><p>{localize(site.credits)}</p><p>© 2026 A+studio.</p></footer>;
}
