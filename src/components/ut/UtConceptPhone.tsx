import { issueLibrary, type IssueKey } from '../../data/ut-lab-data';

/** The actual After concept shown in both UT Lab and its home thumbnail. */
export function UtConceptPhone({ issue='cart' }: { issue?:IssueKey }) {
  const content=issueLibrary[issue].mock;
  return <div className="ut-phone ut-phone--after"><span className="ut-eyebrow">A+ PRODUCT</span><h3>{content[0]}</h3><p>{content[1]}</p><span className="ut-concept-badge">{content[12]}</span><div className="ut-concept-item"><span/><div><strong>{content[2]}</strong><small>{content[3]}</small></div></div><dl>{[4,6,8].map(index=><div key={index}><dt>{content[index]}</dt><dd>{content[index+1]}</dd></div>)}</dl><div className="ut-concept-cta">{content[10]}</div><small className="ut-concept-proof">✓ {content[11]}</small></div>;
}
