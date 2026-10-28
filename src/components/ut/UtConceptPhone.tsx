import { localize } from '../../i18n';
import { issueLibrary, type IssueKey } from '../../data/ut-lab-data';

/** The actual After concept shown in both UT Lab and its home thumbnail. */
export function UtConceptPhone({ issue='cart' }: { issue?:IssueKey }) {
  const content=issueLibrary[issue].mock;
  return <div className="ut-phone ut-phone--after"><span className="ut-eyebrow">A+ PRODUCT</span><h3>{localize(content[0])}</h3><p>{localize(content[1])}</p><span className="ut-concept-badge">{localize(content[12])}</span><div className="ut-concept-item"><span/><div><strong>{localize(content[2])}</strong><small>{localize(content[3])}</small></div></div><dl>{localize([4,6,8].map(index=><div key={index}><dt>{localize(content[index])}</dt><dd>{localize(content[index+1])}</dd></div>))}</dl><div className="ut-concept-cta">{localize(content[10])}</div><small className="ut-concept-proof">✓ {localize(content[11])}</small></div>;
}
