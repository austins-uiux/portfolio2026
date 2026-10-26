import { Component, useState, type ReactNode, useEffect, useRef } from 'react';
import { ArrowUpRight, RotateCcw } from 'lucide-react';
import {
  labComponents,
  labGroups,
  getLabComponent,
  type LabComponent,
} from '../data/component-lab';
import { AppLink } from '../lib/router';
import { SectionMark } from '../components/ui';
import { ComponentDemo } from '../components/lab/ComponentDemo';
import { ComponentSource } from '../components/lab/ComponentSource';
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
      <p role="alert">예시를 표시하지 못했어요. 페이지를 새로고침해 주세요.</p>
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
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '400px' },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className={`lab-demo lab-demo--${id}`}>
      <DemoBoundary>
        {visible ? (
          <ComponentDemo id={id} />
        ) : (
          <span className="lab-loading">미리보기</span>
        )}
      </DemoBoundary>
    </div>
  );
}
function LabCard({ component }: { component: LabComponent }) {
  return (
    <article className="lab-card" data-component={component.id}>
      <LazyDemo id={component.id} />
      <div className="lab-card-copy">
        <h2>
          <AppLink href={`/project/component-${component.id}`}>
            {component.name}
            <ArrowUpRight size={15} />
          </AppLink>
        </h2>
        <p>{component.description}</p>
        <span className="lab-card-category">{component.group}</span>
      </div>
    </article>
  );
}
export default function ComponentLabPage({
  componentId,
  theme,
}: {
  componentId?: string;
  theme: 'light' | 'dark';
}) {
  const [group, setGroup] = useState('전체');
  const [revision, setRevision] = useState(0);
  const item = componentId ? getLabComponent(componentId) : undefined;
  const items = labComponents.filter((c) => group === '전체' || c.group === group);
  return (
    <>
      <div
        className={`${item ? 'detail-page' : 'listing-page'} content-container component-lab lab-theme`}
        data-figma-node={item ? '30:2288' : '29:1278'}
      >
        {item ? (
          <>
            <header className="detail-heading">
              <AppLink className="lab-back" href="/work/component-lab">
                ← 컴포넌트 랩
              </AppLink>
              <h1 tabIndex={-1}>{item.name}</h1>
              <p>{item.description}</p>
            </header>
            <section className="lab-detail-section">
              <div className="lab-section-head">
                <h2>인터랙티브 프리뷰</h2>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setRevision((v) => v + 1)}
                >
                  <RotateCcw />
                  초기화
                </Button>
              </div>
              <div className={`lab-demo lab-demo--detail lab-demo--${item.id}`}>
                <DemoBoundary key={revision}>
                  <ClientOnly><ComponentDemo id={item.id} expanded /></ClientOnly>
                </DemoBoundary>
              </div>
            </section>
            <section className="lab-detail-section">
              <h2>구현 코드</h2>
              <ComponentSource id={item.id} />
            </section>
            <section className="lab-token-section">
              <h2>A+studio 토큰</h2>
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
            >
              shadcn/ui 공식 문서
              <ArrowUpRight size={16} />
            </a>
          </>
        ) : (
          <>
            <header className="page-heading">
              <SectionMark />
              <h1 tabIndex={-1}>컴포넌트 랩</h1>
              <p>
                shadcn/ui를 A+studio의 디자인 시스템 토큰으로 조합한 UI 컴포넌트 갤러리입니다.
                <br />
                직접 눌러보고, 상태와 구현 코드를 살펴보세요.
              </p>
            </header>
            <div className="lab-controls">
              <div
                className="lab-filters"
                role="group"
                aria-label="컴포넌트 분류"
              >
                {['전체', ...labGroups].map((label) => (
                  <button
                    key={label}
                    type="button"
                    aria-pressed={group === label}
                    onClick={() => setGroup(label)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <p className="lab-result-count" aria-live="polite">
                {items.length}개 컴포넌트
              </p>
            </div>
            {items.length ? (
              <div className="lab-grid">
                {items.map((c) => (
                  <LabCard key={c.id} component={c} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <h2>등록된 컴포넌트가 없어요</h2>
                <p>다른 분류를 선택해 보세요.</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setGroup('전체');
                  }}
                >
                  전체 보기
                </Button>
              </div>
            )}
          </>
        )}
        <footer className="lab-attribution">
          <span>shadcn/ui · MIT License</span>
          <p>오픈소스 컴포넌트의 테마 적용·조합 예시입니다.</p>
          <a
            href="https://github.com/shadcn-ui/ui"
            target="_blank"
            rel="noopener noreferrer"
          >
            원본 소스
            <ArrowUpRight size={14} />
          </a>
        </footer>
      </div>
      <Toaster theme={theme} position="bottom-right" closeButton />
    </>
  );
}
