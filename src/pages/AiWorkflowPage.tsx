import { translate, translateText, localize } from '../i18n';
import { SectionMark } from '../components/ui';
import { getCategory } from '../data/portfolio';
import { getWorkflow, workflowHref, workflowTools, workflows } from '../data/ai-workflow';
import { AppLink } from '../lib/router';

export function AiWorkflowPage({ flowId }: { flowId: string | null }) {
  const category = getCategory('ai-workflow')!;
  const flow = getWorkflow(flowId);
  return <div className="listing-page content-container workflow-page" data-figma-node={category.figmaNode}>
    <div className="workflow-top">
      <header className="page-heading"><SectionMark /><h1 tabIndex={-1}>{localize(category.title)}</h1><p>{localize(category.description)}</p></header>
      <nav className="workflow-chips" aria-label={translate("AI 워크플로우 구분")}>
        {localize(workflows.map(item => <AppLink key={item.id} href={workflowHref(item.id)} aria-current={flow.id === item.id ? 'page' : undefined}>{localize(item.label)}</AppLink>))}
      </nav>
    </div>
    <ul className="workflow-tools" aria-label={translate("워크플로우에 사용하는 도구")} role="list">
      {localize(workflowTools.map(tool => <li key={tool.name} title={translateText(tool.name)}>
        {localize(tool.dark ? <span className="brand-image"><img className="brand-light" src={tool.src} width="30" height="30" alt={translateText(tool.name)} /><img className="brand-dark" src={tool.dark} width="30" height="30" alt={translateText(tool.name)} /></span> : <img src={tool.src} width="30" height="30" alt={translateText(tool.name)} />)}
      </li>))}
    </ul>
    <article className="workflow-document" aria-labelledby={`workflow-${flow.id}`}>
      <header className="workflow-document-heading"><h2 id={`workflow-${flow.id}`}>{localize(flow.title)}</h2><p>{localize(flow.description)}</p></header>
      <ol className="workflow-steps">
        {localize(flow.steps.map((step, index) => <li key={step.title}>
          <span className="workflow-step-number" aria-hidden="true">{localize(String(index + 1).padStart(2, '0'))}</span>
          <div><h3>{localize(step.title)}</h3><p>{localize(step.body)}</p></div>
        </li>))}
      </ol>
    </article>
  </div>;
}
