import { translate, localize } from '../i18n';
import { Component, useState, type ReactNode, useEffect, useRef } from 'react';
import { ArrowUpRight, RotateCcw } from 'lucide-react';
import {
  interactionComponents,
  interactionGroups,
  getInteractionComponent,
  type InteractionComponent,
} from '../data/interaction-lab';
import { AppLink } from '../lib/router';
import { SectionMark } from '../components/ui';
import { InteractionDemo } from '../components/interaction/InteractionDemo';
import { MotionConfig } from 'motion/react';
import { InteractionThemeContext } from '../components/interaction/InteractionTheme';
import { InteractionSource } from '../components/interaction/InteractionSource';
import { Button } from '../components/lab-ui/button';
import { Toaster } from '../components/lab-ui/sonner';
import { ClientOnly } from '../components/ClientOnly';

class DemoBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <p role="alert">{translate("예시를 표시하지 못했어요. 페이지를 새로고침해 주세요.")}</p>
    ) : (
      this.props.children
    );
  }
}
function LazyDemo({ id }: { id: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        setVisible(entries.some((e) => e.isIntersecting));
      },
      { rootMargin: '80px' },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className={`lab-demo magic-stage magic-stage--${id}`}>
      <DemoBoundary>
        <MotionConfig reducedMotion="user">
          {localize(visible ? (
            <InteractionDemo id={id} />
          ) : (
            <span className="lab-loading">{translate("미리보기")}</span>
          ))}
        </MotionConfig>
      </DemoBoundary>
    </div>
  );
}
function LabCard({ component }: { component: InteractionComponent }) {
  return (
    <article className="lab-card" data-component={component.id}>
      <LazyDemo id={component.id} />
      <div className="lab-card-copy">
        <h2>
          <AppLink href={`/project/interaction-${component.id}`}>
            {localize(component.name)}
            <ArrowUpRight size={15} />
          </AppLink>
        </h2>
        <p>{localize(component.description)}</p>
        <span className="lab-card-category">{localize(component.group)}</span>
      </div>
    </article>
  );
}
export default function InteractionLabPage({
  interactionId,
  theme,
  onThemeChange,
}: {
  interactionId?: string;
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
}) {
  const [group, setGroup] = useState('전체');
  const [revision, setRevision] = useState(0);
  const item = interactionId
    ? getInteractionComponent(interactionId)
    : undefined;
  const items = interactionComponents.filter(
    (c) => group === '전체' || c.group === group,
  );
  return (
    <InteractionThemeContext.Provider value={{ theme, onThemeChange }}>
      <div
        className={`${item ? 'detail-page' : 'listing-page'} content-container component-lab interaction-lab lab-theme`}
        data-figma-node={item ? '30:2288' : '29:1408'}
      >
        {localize(item ? (
          <>
            <header className="detail-heading">
              <AppLink className="lab-back" href="/work/interaction-lab">{translate(" ← 인터렉션 랩 ")}</AppLink>
              <h1 tabIndex={-1}>{localize(item.name)}</h1>
              <p>{localize(item.description)}</p>
            </header>
            <section className="lab-detail-section">
              <div className="lab-section-head">
                <h2>{translate("인터랙티브 프리뷰")}</h2>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setRevision((v) => v + 1)}
                >
                  <RotateCcw />{translate(" 초기화 ")}</Button>
              </div>
              <div
                className={`lab-demo lab-demo--detail magic-stage magic-stage--detail magic-stage--${item.id}`}
              >
                <DemoBoundary key={revision}>
                  <MotionConfig reducedMotion="user">
                    <ClientOnly><InteractionDemo id={item.id} expanded /></ClientOnly>
                  </MotionConfig>
                </DemoBoundary>
              </div>
            </section>
            <section className="lab-detail-section">
              <h2>{translate("구현 코드")}</h2>
              <InteractionSource id={item.id} />
            </section>
            <section className="lab-token-section">
              <h2>{translate("A+studio 토큰")}</h2>
              <dl>
                <div>
                  <dt>Primary</dt>
                  <dd>
                    <i />
                    #148DDF
                  </dd>
                </div>
                <div>
                  <dt>Font</dt>
                  <dd>Pretendard</dd>
                </div>
                <div>
                  <dt>Radius</dt>
                  <dd>4 / 6 / 10 / 14px</dd>
                </div>
                <div>
                  <dt>Theme</dt>
                  <dd>Light / Dark</dd>
                </div>
              </dl>
            </section>
            <a
              className="lab-upstream"
              href={item.docs}
              target="_blank"
              rel="noopener noreferrer"
            >{translate(" Magic UI 공식 문서 ")}<ArrowUpRight size={16} />
            </a>
          </>
        ) : (
          <>
            <header className="page-heading">
              <SectionMark />
              <h1 tabIndex={-1}>{translate("인터렉션 랩")}</h1>
              <p>{translate(" Magic UI를 A+studio의 디자인 시스템 토큰으로 조합한 인터랙션 갤러리입니다. ")}<br />{translate(" 직접 움직여보고, 모션과 구현 코드를 살펴보세요. ")}</p>
            </header>
            <div className="lab-controls">
              <div
                className="lab-filters"
                role="group"
                aria-label={translate("컴포넌트 분류")}
              >
                {localize(['전체', ...interactionGroups].map((label) => (
                  <button
                    key={label}
                    type="button"
                    aria-pressed={group === label}
                    onClick={() => setGroup(label)}
                  >
                    {localize(label)}
                  </button>
                )))}
              </div>
              <p className="lab-result-count" aria-live="polite">
                {localize(items.length)}{translate("개 컴포넌트 ")}</p>
            </div>
            {localize(items.length ? (
              <div className="lab-grid">
                {localize(items.map((c) => (
                  <LabCard key={c.id} component={c} />
                )))}
              </div>
            ) : (
              <div className="empty-state">
                <h2>{translate("등록된 컴포넌트가 없어요")}</h2>
                <p>{translate("다른 분류를 선택해 보세요.")}</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setGroup('전체');
                  }}
                >{translate(" 전체 보기 ")}</Button>
              </div>
            ))}
          </>
        ))}
        <footer className="lab-attribution">
          <span>Magic UI · MIT License</span>
          <p>{translate("오픈소스 컴포넌트의 테마 적용·조합 예시입니다.")}</p>
          <a
            href="https://github.com/magicuidesign/magicui"
            target="_blank"
            rel="noopener noreferrer"
          >{translate(" 원본 소스 ")}<ArrowUpRight size={14} />
          </a>
        </footer>
      </div>
      <Toaster theme={theme} position="bottom-right" closeButton />
    </InteractionThemeContext.Provider>
  );
}
