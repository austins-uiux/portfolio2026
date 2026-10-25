import { site } from '../data/portfolio';
import { AppLink } from '../lib/router';

export function Footer() {
  return <footer className="footer"><AppLink href="/" aria-label="A+studio 홈"><img src="/assets/home-Union1.svg" width="94" height="17" alt="A+studio" /></AppLink><p>{site.credits}</p><p>© 2026 A+studio.</p></footer>;
}
