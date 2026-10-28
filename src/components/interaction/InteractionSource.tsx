import { translate, translateText, localize } from '../../i18n';
import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from '../lab-ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../lab-ui/tabs';
import { getInteractionComponent } from '../../data/interaction-lab';
import demoSource from './InteractionDemo.tsx?raw';

const sources = import.meta.glob('../magic-ui/*.tsx', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
function example(id: string) {
  const helpers: Record<string, string[]> = {
    confetti: ['Surface', 'ConfettiExample'],
    pointer: ['Surface', 'CursorExample'],
    'smooth-cursor': ['Surface', 'CursorExample'],
    'animated-beam': ['BeamExample'],
    'text-reveal': ['ScrollExample'],
    'scroll-progress': ['ScrollExample'],
  };
  const parts = (helpers[id] ?? []).map((name) => {
    const start = demoSource.indexOf('function ' + name + '(');
    if (start < 0) return '';
    const rest = demoSource.slice(start);
    const end = rest.slice(1).search(/\n(?:function|export function) /);
    return end < 0 ? rest : rest.slice(0, end + 1);
  });
  const start = demoSource.indexOf(`    case '${id}':`);
  const next = demoSource.indexOf('\n    case ', start + 1);
  const jsx = demoSource
    .slice(start, next < 0 ? demoSource.indexOf('\n    default:', start) : next)
    .replace(/^\s*case '[^']+':\s*return\s*/, '')
    .replace(/;\s*$/, '');
  return [...parts, jsx].join('\n\n');
}
export function InteractionSource({ id }: { id: string }) {
  const component = getInteractionComponent(id)!;
  const files = [
    { name: `${id}.tsx`, content: sources[`../magic-ui/${id}.tsx`] },
  ].filter((file) => file.content);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState('example');
  const content =
    selected === 'example'
      ? example(id)
      : (files.find((f) => f.name === selected)?.content ?? '');
  async function copy() {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setError('');
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setError(
        '브라우저에서 복사를 허용하지 않았어요. 아래 코드를 직접 선택해 주세요.',
      );
    }
  }
  return (
    <section className="lab-source" aria-label={translateText(`${component.name} 코드`)}>
      <Tabs value={selected} onValueChange={setSelected}>
        <div className="lab-source-toolbar">
          <TabsList>
            <TabsTrigger value="example">{translate("사용 예시")}</TabsTrigger>
            {localize(files.map((file) => (
              <TabsTrigger key={file.name} value={file.name}>
                {localize(file.name)}
              </TabsTrigger>
            )))}
          </TabsList>
          <Button size="sm" variant="ghost" onClick={() => void copy()}>
            {localize(copied ? <Check /> : <Copy />)}
            {localize(copied ? '복사됨' : '복사')}
          </Button>
        </div>
        <TabsContent value={selected}>
          <pre tabIndex={0}>
            <code>{content}</code>
          </pre>
        </TabsContent>
      </Tabs>
      {localize(error && <p role="status">{localize(error)}</p>)}
      <p className="lab-source-note">{translate(" 미리보기에 사용한 JSX와 이 프로젝트에 포함된 컴포넌트 소스입니다. 예시의 상태·콜백·import는 실행 코드와 함께 전체 소스에서 확인할 수 있어요. ")}</p>
    </section>
  );
}
