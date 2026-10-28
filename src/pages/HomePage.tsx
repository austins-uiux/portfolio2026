import { translate, localize, useLocale } from '../i18n';
import { categories } from '../data/portfolio';
import { AppLink } from '../lib/router';
import { AuroraBrand } from '../components/AuroraBrand';
import { HomeCardPreview } from '../components/home/HomeCardPreview';

export function HomePage() {
  const { locale } = useLocale();
  return <div data-figma-node="1:5">
    <section className="hero" aria-labelledby="home-title"><h1 id="home-title"><AuroraBrand /></h1><p>{locale === 'en' ? 'A+studio is the portfolio of Austin, an AI-native product designer. Explore my work, how I use AI, and the decisions behind the design.' : <>AI 네이티브 프로덕트 디자이너 Austin의 <br />프로젝트, AI 활용 능력, 디자인 철학 등을 담은 AI Agentic<br />포트폴리오 웹사이트 A+studio 입니다.</>}</p></section>
    <section className="home-overview content-container" aria-labelledby="overview-title" data-figma-node="29:623">
      <div className="home-grid">
        <div className="home-intro"><img className="section-mark" src="/assets/home-card-section-mark.svg" width="24" height="24" alt="" aria-hidden="true"/><h2 id="overview-title">{translate("무엇을 만들었고,")}<br />{translate("어떻게 해결했고,")}<br />{translate("왜 그렇게 판단했는지.")}</h2><p>{locale === 'en' ? <>Explore product work, UX experiments,<br />AI workflows, and design systems<br />with the reasoning behind<br />the decisions.</> : <>실무 프로젝트와 UX 실험, AI 활용 과정과<br className="desktop-break" /> 디자인 시스템을 통해 AI 네이티브 프로덕트<br className="desktop-break" /> 디자이너 Austin의 작업과 생각을<br className="desktop-break" /> 살펴보세요.</>}</p></div>
        {localize(categories.map(category => <AppLink key={category.id} href={`/work/${category.id}`} className={`overview-card overview-card--${category.id}`}><div className="overview-thumbnail" aria-hidden="true"><HomeCardPreview id={category.id}/></div><div className="overview-card-copy"><div className="overview-card-title"><h3>{localize(category.id === 'interaction-lab' ? '인터랙션 랩' : category.title)}</h3><img className="icon icon--arrow" src="/assets/home-card-arrow-right.svg" width="16" height="16" alt="" aria-hidden="true"/></div><p>{localize(category.homeDescription ?? category.description)}</p></div></AppLink>))}
      </div>
    </section>
  </div>;
}
