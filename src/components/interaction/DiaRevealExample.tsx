import { DiaTextReveal } from '../magic-ui/dia-text-reveal';

export default function DiaRevealExample() {
  return <DiaTextReveal className="magic-type" text={['Make it clear.', 'Make it move.']} repeat colors={['#148ddf','#54c8ed','#a58bfa']} duration={2}/>;
}
