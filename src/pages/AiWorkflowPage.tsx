import { SectionMark } from '../components/ui';
import { getCategory } from '../data/portfolio';
import { getWorkflow, workflowHref, workflowTools, workflows } from '../data/ai-workflow';
import { AppLink } from '../lib/router';

export function AiWorkflowPage({ flowId }: { flowId: string | null }) {
  const category = getCategory('ai-workflow')!;
  const flow = getWorkflow(flowId);
  return <div className="listing-page content-container workflow-page" data-figma-node={category.figmaNode}>
    <div className="workflow-top">
      <header className="page-heading"><SectionMark /><h1 tabIndex={-1}>{category.title}</h1><p>{category.description}</p></header>
      <nav className="workflow-chips" aria-label="AI 워크플로우 구분">
        {workflows.map(item => <AppLink key={item.id} href={workflowHref(item.id)} aria-current={flow.id === item.id ? 'page' : undefined}>{item.label}</AppLink>)}
      </nav>
    </div>
    <ul className="workflow-tools" aria-label="워크플로우에 사용하는 도구" role="list">
      {workflowTools.map(tool => <li key={tool.name} title={tool.name}>
        {tool.dark ? <span className="brand-image"><img className="brand-light" src={tool.src} width="30" height="30" alt={tool.name} /><img className="brand-dark" src={tool.dark} width="30" height="30" alt={tool.name} /></span> : <img src={tool.src} width="30" height="30" alt={tool.name} />}
      </li>)}
    </ul>
    <article className="workflow-document" aria-labelledby={`workflow-${flow.id}`}>
      <header className="workflow-document-heading"><h2 id={`workflow-${flow.id}`}>{flow.title}</h2><p>{flow.description}</p></header>
      <ol className="workflow-steps">
        {flow.steps.map((step, index) => <li key={step.title}>
          <span className="workflow-step-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
          <div><h3>{step.title}</h3><p>{step.body}</p></div>
        </li>)}
      </ol>
    </article>
  </div>;
}
