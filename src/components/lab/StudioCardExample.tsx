import { translate, localize } from '../../i18n';
import { ChevronRight } from 'lucide-react';
import * as Card from '../lab-ui/card';
import { Button } from '../lab-ui/button';

/** Shared by the component gallery and its decorative home thumbnail. */
export function StudioCardExample({ decorative=false, onAction }: { decorative?:boolean; onAction?:()=>void }) {
  return <Card.Card className="w-full">
    <Card.CardHeader><Card.CardTitle>A+studio</Card.CardTitle><Card.CardDescription>{translate("아이디어를 경험으로 만듭니다.")}</Card.CardDescription></Card.CardHeader>
    <Card.CardFooter>{localize(decorative ? <Button asChild size="sm"><span>{translate("자세히 보기")}<ChevronRight/></span></Button> : <Button size="sm" onClick={onAction}>{translate("자세히 보기")}<ChevronRight/></Button>)}</Card.CardFooter>
  </Card.Card>;
}
