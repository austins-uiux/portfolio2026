import { useRef, useState, type ReactNode } from 'react';
import {
  Code2,
  FileText,
  Home,
  Layers,
  Palette,
  Sparkles,
  WandSparkles,
  Check,
  Plus,
  MousePointer2,
} from 'lucide-react';
import type { Tweet } from 'react-tweet/api';
import { toast } from 'sonner';
import { Button } from '../lab-ui/button';
import { Marquee } from '../magic-ui/marquee';
import {
  Terminal,
  AnimatedSpan,
  TypingAnimation as TerminalTyping,
} from '../magic-ui/terminal';
import { HeroVideoDialog } from '../magic-ui/hero-video-dialog';
import { AnimatedList } from '../magic-ui/animated-list';
import { Dock, DockIcon } from '../magic-ui/dock';
import { MagicTweet } from '../magic-ui/tweet-card';
import { OrbitingCircles } from '../magic-ui/orbiting-circles';
import { AvatarCircles } from '../magic-ui/avatar-circles';
import { IconCloud } from '../magic-ui/icon-cloud';
import { Lens } from '../magic-ui/lens';
import { Pointer } from '../magic-ui/pointer';
import { SmoothCursor } from '../magic-ui/smooth-cursor';
import { ProgressiveBlur } from '../magic-ui/progressive-blur';
import { AnimatedBeam } from '../magic-ui/animated-beam';
import { BorderBeam } from '../magic-ui/border-beam';
import { ShineBorder } from '../magic-ui/shine-border';
import { MagicCard } from '../magic-ui/magic-card';
import { GlareHover } from '../magic-ui/glare-hover';
import { Meteors } from '../magic-ui/meteors';
import { Confetti, type ConfettiRef } from '../magic-ui/confetti';
import { Particles } from '../magic-ui/particles';
import { AnimatedThemeToggler } from '../magic-ui/animated-theme-toggler';
import { BlurFade } from '../magic-ui/blur-fade';
import { TextAnimate } from '../magic-ui/text-animate';
import { TypingAnimation } from '../magic-ui/typing-animation';
import { LineShadowText } from '../magic-ui/line-shadow-text';
import { AuroraText } from '../magic-ui/aurora-text';
import { VideoText } from '../magic-ui/video-text';
import { NumberTicker } from '../magic-ui/number-ticker';
import { AnimatedShinyText } from '../magic-ui/animated-shiny-text';
import { AnimatedGradientText } from '../magic-ui/animated-gradient-text';
import { TextReveal } from '../magic-ui/text-reveal';
import DiaRevealExample from './DiaRevealExample';
import { HyperText } from '../magic-ui/hyper-text';
import { WordRotate } from '../magic-ui/word-rotate';
import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from '../magic-ui/scroll-based-velocity';
import { SparklesText } from '../magic-ui/sparkles-text';
import { MorphingText } from '../magic-ui/morphing-text';
import { SpinningText } from '../magic-ui/spinning-text';
import { Highlighter } from '../magic-ui/highlighter';
import Text3DFlip from '../magic-ui/text-3d-flip';
import { Safari } from '../magic-ui/safari';
import { Iphone } from '../magic-ui/iphone';
import { Android } from '../magic-ui/android';
import { RainbowButton } from '../magic-ui/rainbow-button';
import { ShimmerButton } from '../magic-ui/shimmer-button';
import { RippleButton } from '../magic-ui/ripple-button';
import { FlickeringGrid } from '../magic-ui/flickering-grid';
import { AnimatedGridPattern } from '../magic-ui/animated-grid-pattern';
import { RetroGrid } from '../magic-ui/retro-grid';
import { Ripple } from '../magic-ui/ripple';
import { DotPattern } from '../magic-ui/dot-pattern';
import { GridPattern } from '../magic-ui/grid-pattern';
import { HexagonPattern } from '../magic-ui/hexagon-pattern';
import { StripedPattern } from '../magic-ui/striped-pattern';
import { InteractiveGridPattern } from '../magic-ui/interactive-grid-pattern';
import { LightRays } from '../magic-ui/light-rays';
import { NoiseTexture } from '../magic-ui/noise-texture';
import { Floating3DParticles } from '../magic-ui/floating-3d-particles';
import { ShinyButton } from '../magic-ui/shiny-button';
import { File, Folder, Tree } from '../magic-ui/file-tree';
import { CodeComparison } from '../magic-ui/code-comparison';
import { ScrollProgress } from '../magic-ui/scroll-progress';
import { NeonGradientCard } from '../magic-ui/neon-gradient-card';
import { ComicText } from '../magic-ui/comic-text';
import { KineticText } from '../magic-ui/kinetic-text';
import { PixelImage } from '../magic-ui/pixel-image';
import { PulsatingButton } from '../magic-ui/pulsating-button';
import { WarpBackground } from '../magic-ui/warp-background';
import { InteractiveHoverButton } from '../magic-ui/interactive-hover-button';
import { AnimatedCircularProgressBar } from '../magic-ui/animated-circular-progress-bar';
import { Backlight } from '../magic-ui/backlight';
import { GlyphMatrix } from '../magic-ui/glyph-matrix';
import { useInteractionTheme } from './InteractionTheme';

const scene = '/assets/interaction-scene.svg';
const video = '/assets/interaction-loop.mp4';
const socialText =
  '작은 모션을 연결해 명확한 경험을 만듭니다. — 로컬 샘플 게시글';
const sampleTweet: Tweet = {
  __typename: 'Tweet',
  id_str: '0',
  lang: 'ko',
  created_at: '2026-10-25T00:00:00.000Z',
  display_text_range: [0, socialText.length],
  text: socialText,
  user: {
    id_str: '0',
    name: 'A+studio · 샘플',
    screen_name: 'aplus_demo',
    profile_image_url_https: scene,
    profile_image_shape: 'Circle',
    verified: false,
    is_blue_verified: false,
  },
  favorite_count: 0,
  conversation_count: 0,
  news_action_type: 'conversation',
  edit_control: {
    edit_tweet_ids: ['0'],
    editable_until_msecs: '0',
    is_edit_eligible: false,
    edits_remaining: '0',
  },
  isEdited: false,
  isStaleEdit: false,
};
const localHref = (id: string) =>
  (import.meta.env.VITE_STANDALONE_PREVIEW === 'true' ? '#' : '') +
  '/project/interaction-' +
  id;
function Surface({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`magic-surface ${className}`}>{children}</div>;
}
function CenterLabel({ children }: { children: ReactNode }) {
  return <div className="magic-center-label">{children}</div>;
}
function CursorExample({ smooth = false }: { smooth?: boolean }) {
  const [active, setActive] = useState(false);
  return (
    <Surface className="magic-cursor-area">
      <div
        className="magic-cursor-target"
        onPointerEnter={(e) => e.pointerType !== 'touch' && setActive(true)}
        onPointerLeave={() => setActive(false)}
      >
        <MousePointer2 />
        <span>이 영역에서 마우스를 움직여보세요</span>
        {smooth ? (
          active && (
            <SmoothCursor
              cursor={<MousePointer2 fill="#148DDF" color="white" size={30} />}
            />
          )
        ) : (
          <Pointer>
            <MousePointer2 fill="#148DDF" color="white" size={28} />
          </Pointer>
        )}
      </div>
    </Surface>
  );
}
function ScrollExample({ reveal = false }: { reveal?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      className="magic-scroll-area"
      tabIndex={0}
      aria-label="예시 안에서 스크롤"
    >
      <ScrollProgress
        scrollContainer={ref}
        className="sticky top-0 h-1 bg-primary"
      />
      {reveal ? (
        <TextReveal scrollContainer={ref} className="h-[400px]">
          Scroll to reveal. 작은 모션이 경험을 바꿉니다.
        </TextReveal>
      ) : (
        <div className="space-y-8 p-5">
          {Array.from({ length: 6 }, (_, i) => (
            <p key={i} className="text-sm">
              0{i + 1} · 이 영역을 스크롤해 보세요.
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
function BeamExample() {
  const container = useRef<HTMLDivElement>(null),
    from = useRef<HTMLDivElement>(null),
    to = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={container}
      className="relative flex h-36 w-full items-center justify-between px-5"
    >
      <div ref={from} className="magic-node">
        <Code2 />
      </div>
      <div ref={to} className="magic-node">
        <Sparkles />
      </div>
      <AnimatedBeam
        containerRef={container}
        fromRef={from}
        toRef={to}
        gradientStartColor="#148DDF"
        gradientStopColor="#77d7ff"
        duration={3}
      />
    </div>
  );
}
function ConfettiExample() {
  const ref = useRef<ConfettiRef>(null);
  return (
    <Surface>
      <Confetti
        ref={ref}
        manualstart
        globalOptions={{ useWorker: false }}
        className="pointer-events-none absolute inset-0 size-full"
        options={{
          particleCount: 60,
          spread: 70,
          colors: ['#148ddf', '#61c5ff', '#9c7ee7'],
        }}
      />
      <Button
        onClick={() =>
          ref.current?.fire({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.65 },
          })
        }
      >
        축하하기
        <Sparkles />
      </Button>
    </Surface>
  );
}

export function InteractionDemo({
  id,
  expanded = false,
}: {
  id: string;
  expanded?: boolean;
}) {
  const { theme, onThemeChange } = useInteractionTheme();
  const [value, setValue] = useState(65);
  const [replay, setReplay] = useState(0);
  const notify = () => toast('인터랙션 버튼을 눌렀어요.');
  switch (id) {
    case 'marquee':
      return (
        <div className="w-full overflow-hidden">
          <Marquee pauseOnHover className="[--duration:14s]">
            {['Design', 'Build', 'Explore', 'A+studio'].map((s) => (
              <div className="magic-pill" key={s}>
                {s}
              </div>
            ))}
          </Marquee>
          <Marquee pauseOnHover reverse className="[--duration:18s]">
            {['Interaction', 'Motion', 'React'].map((s) => (
              <div className="magic-pill" key={s}>
                {s}
              </div>
            ))}
          </Marquee>
        </div>
      );
    case 'terminal':
      return (
        <Terminal className="w-full min-w-0 p-3 text-xs" key={replay}>
          <TerminalTyping duration={45} className="text-xs">
            $ npm run build
          </TerminalTyping>
          <AnimatedSpan className="text-xs text-primary">
            ✓ Components ready
          </AnimatedSpan>
          <AnimatedSpan className="text-xs">
            A+studio · interaction lab
          </AnimatedSpan>
        </Terminal>
      );
    case 'hero-video-dialog':
      return (
        <HeroVideoDialog
          videoSrc={video}
          thumbnailSrc={scene}
          thumbnailAlt="A+studio 데모 영상 재생"
        />
      );
    case 'animated-list':
      return (
        <AnimatedList delay={1300} className="w-full gap-2">
          {[
            '새 아이디어가 도착했어요',
            '컴포넌트 검토 완료',
            '프로젝트 준비 완료',
          ].map((s, i) => (
            <div className="magic-notice" key={s}>
              <span className="magic-node">
                <Check size={15} />
              </span>
              <span>{s}</span>
              <small>0{i + 1}</small>
            </div>
          ))}
        </AnimatedList>
      );
    case 'dock':
      return (
        <Dock
          iconSize={34}
          iconMagnification={48}
          className="h-16 border bg-card px-2"
        >
          {[Home, Palette, Code2, Sparkles].map((Icon, i) => (
            <DockIcon key={i}>
              <button
                type="button"
                aria-label={
                  ['홈 아이콘', '디자인 아이콘', '코드 아이콘', 'AI 아이콘'][i]
                }
                className="flex size-full items-center justify-center rounded-full bg-secondary"
                onClick={notify}
              >
                <Icon size={18} />
              </button>
            </DockIcon>
          ))}
        </Dock>
      );
    case 'tweet-card':
      return (
        <div className="magic-sample-tweet">
          <MagicTweet tweet={sampleTweet} />
        </div>
      );
    case 'orbiting-circles':
      return (
        <div className="relative flex h-44 w-full items-center justify-center">
          <span className="magic-node bg-primary text-white">A+</span>
          <OrbitingCircles radius={62} iconSize={24} duration={16}>
            <Palette className="text-primary" />
            <Code2 className="text-primary" />
            <Sparkles className="text-primary" />
          </OrbitingCircles>
        </div>
      );
    case 'avatar-circles':
      return (
        <AvatarCircles
          numPeople={12}
          avatarUrls={Array.from({ length: 3 }, () => ({
            imageUrl: scene,
            profileUrl: localHref(id),
          }))}
        />
      );
    case 'icon-cloud':
      return (
        <div className="magic-icon-cloud">
          <IconCloud
            icons={Array.from({ length: 12 }, (_, i) => {
              const Icon = [Palette, Code2, Layers, Sparkles][i % 4];
              return <Icon key={i} color="#148DDF" size={28} />;
            })}
          />
        </div>
      );
    case 'lens':
      return (
        <Lens lensSize={100} zoomFactor={1.7}>
          <img
            src={scene}
            alt="확대할 A+studio 그래픽"
            className="w-full rounded-lg"
          />
        </Lens>
      );
    case 'pointer':
      return <CursorExample />;
    case 'smooth-cursor':
      return <CursorExample smooth />;
    case 'progressive-blur':
      return (
        <div className="relative w-full overflow-hidden rounded-lg">
          <img
            src={scene}
            alt="블러가 점차 적용되는 그래픽"
            className="w-full"
          />
          <ProgressiveBlur height="70%" position="bottom" />
        </div>
      );
    case 'animated-beam':
      return <BeamExample />;
    case 'border-beam':
      return (
        <Surface>
          <span className="magic-feature-title">Border beam</span>
          <BorderBeam
            duration={5}
            size={90}
            colorFrom="#148ddf"
            colorTo="#74d7ff"
          />
        </Surface>
      );
    case 'shine-border':
      return (
        <Surface>
          <span className="magic-feature-title">A little shine.</span>
          <ShineBorder
            shineColor={['#148ddf', '#74d7ff', '#a58bfa']}
            duration={8}
          />
        </Surface>
      );
    case 'magic-card':
      return (
        <MagicCard
          className="h-36 w-full rounded-xl"
          gradientColor={theme === 'dark' ? '#163956' : '#d9f0ff'}
          gradientFrom="#148ddf"
          gradientTo="#78d4ff"
        >
          <CenterLabel>
            <Sparkles />
            마우스를 움직여보세요
          </CenterLabel>
        </MagicCard>
      );
    case 'glare-hover':
      return (
        <GlareHover
          width="100%"
          height="144px"
          background="var(--card)"
          color="#148ddf"
          opacity={0.4}
        >
          <CenterLabel>Hover to shine.</CenterLabel>
        </GlareHover>
      );
    case 'meteors':
      return (
        <Surface>
          <Meteors number={8} />
          <CenterLabel>Make a wish.</CenterLabel>
        </Surface>
      );
    case 'confetti':
      return <ConfettiExample />;
    case 'particles':
      return (
        <Surface>
          <Particles
            quantity={expanded ? 60 : 25}
            color="#148ddf"
            size={0.8}
            className="absolute inset-0"
          />
          <CenterLabel>Little details.</CenterLabel>
        </Surface>
      );
    case 'animated-theme-toggler':
      return (
        <div className="flex flex-col items-center gap-3">
          <AnimatedThemeToggler
            theme={theme}
            onThemeChange={onThemeChange}
            className="magic-theme-toggle"
            aria-label="애니메이션으로 테마 전환"
          />
          <span className="text-xs text-muted-foreground">Light ↔ Dark</span>
        </div>
      );
    case 'blur-fade':
      return (
        <div className="w-full space-y-3 text-center">
          <BlurFade key={replay} delay={0.15}>
            <div className="magic-pill">From blur to clarity.</div>
          </BlurFade>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setReplay((v) => v + 1)}
          >
            다시 재생
          </Button>
        </div>
      );
    case 'text-animate':
      return (
        <TextAnimate
          animation="blurInUp"
          by="word"
          className="magic-type"
          once={false}
        >
          Design with intention.
        </TextAnimate>
      );
    case 'typing-animation':
      return (
        <TypingAnimation className="magic-type" duration={90}>
          Hello, A+studio.
        </TypingAnimation>
      );
    case 'line-shadow-text':
      return (
        <LineShadowText className="magic-type" shadowColor="#148ddf">
          Create.
        </LineShadowText>
      );
    case 'aurora-text':
      return (
        <AuroraText
          className="magic-type"
          colors={['#148ddf', '#4dc4f2', '#8d74d6', '#148ddf']}
        >
          A+studio
        </AuroraText>
      );
    case 'video-text':
      return (
        <div className="relative h-28 w-full">
          <VideoText src={video} fontSize={75}>
            MOTION
          </VideoText>
        </div>
      );
    case 'number-ticker':
      return (
        <div className="text-center">
          <NumberTicker value={2026} className="magic-type" />
          <p className="mt-2 text-xs text-muted-foreground">
            Counting possibilities.
          </p>
        </div>
      );
    case 'animated-shiny-text':
      return (
        <AnimatedShinyText className="magic-type text-2xl">
          A little brighter.
        </AnimatedShinyText>
      );
    case 'animated-gradient-text':
      return (
        <AnimatedGradientText
          className="magic-type text-2xl"
          colorFrom="#148ddf"
          colorTo="#9c7ee7"
        >
          Design in motion.
        </AnimatedGradientText>
      );
    case 'text-reveal':
      return <ScrollExample reveal />;
    case 'dia-text-reveal':
      return <DiaRevealExample />;
    case 'hyper-text':
      return (
        <HyperText className="magic-type" duration={1000}>
          A+STUDIO
        </HyperText>
      );
    case 'word-rotate':
      return (
        <WordRotate
          className="magic-type"
          words={['Design.', 'Build.', 'Explore.']}
          duration={2000}
        />
      );
    case 'scroll-based-velocity':
      return (
        <div className="w-full overflow-hidden">
          <ScrollVelocityContainer>
            <ScrollVelocityRow
              className="text-2xl font-semibold"
              baseVelocity={3}
            >
              Design • Build • Explore •{' '}
            </ScrollVelocityRow>
            <ScrollVelocityRow
              className="text-xl text-primary"
              baseVelocity={3}
              direction={-1}
            >
              A+studio • Motion •{' '}
            </ScrollVelocityRow>
          </ScrollVelocityContainer>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            페이지 스크롤에 반응해요
          </p>
        </div>
      );
    case 'sparkles-text':
      return (
        <SparklesText
          className="magic-type"
          sparklesCount={5}
          colors={{ first: '#148ddf', second: '#9c7ee7' }}
        >
          Sparkle.
        </SparklesText>
      );
    case 'morphing-text':
      return (
        <MorphingText
          className="magic-morph"
          texts={['Design', 'Create', 'Explore']}
        />
      );
    case 'spinning-text':
      return (
        <div className="relative flex h-40 w-full items-center justify-center">
          <Sparkles className="text-primary" />
          <SpinningText radius={4} className="text-xs" duration={18}>
            A+studio • Design in motion •{' '}
          </SpinningText>
        </div>
      );
    case 'highlighter':
      return (
        <p className="text-center text-xl font-semibold">
          Design with{' '}
          <Highlighter action="underline" color="#148ddf">
            intention.
          </Highlighter>
        </p>
      );
    case 'text-3d-flip':
      return <Text3DFlip className="magic-type">A+studio</Text3DFlip>;
    case 'safari':
      return <Safari url="aplus.studio" imageSrc={scene} className="w-full" />;
    case 'iphone':
      return <Iphone src={scene} className="magic-phone" />;
    case 'android':
      return <Android src={scene} className="magic-phone" />;
    case 'rainbow-button':
      return (
        <RainbowButton onClick={notify}>
          Explore
          <Plus />
        </RainbowButton>
      );
    case 'shimmer-button':
      return (
        <ShimmerButton
          background="#148ddf"
          onClick={notify}
          className="px-6 py-3 text-sm text-white"
        >
          Shimmer
          <Sparkles size={16} />
        </ShimmerButton>
      );
    case 'ripple-button':
      return (
        <RippleButton
          onClick={notify}
          className="bg-primary px-6 py-3 text-white"
        >
          Click to ripple
        </RippleButton>
      );
    case 'flickering-grid':
      return (
        <Surface>
          <FlickeringGrid
            className="absolute inset-0"
            color="#148ddf"
            squareSize={3}
            gridGap={5}
            maxOpacity={0.5}
          />
          <CenterLabel>Flicker.</CenterLabel>
        </Surface>
      );
    case 'animated-grid-pattern':
      return (
        <Surface>
          <AnimatedGridPattern
            numSquares={12}
            maxOpacity={0.35}
            duration={4}
            className="text-primary fill-primary/30 stroke-primary/20"
          />
          <CenterLabel>Always evolving.</CenterLabel>
        </Surface>
      );
    case 'retro-grid':
      return (
        <Surface>
          <RetroGrid
            cellSize={30}
            lightLineColor="#148ddf"
            darkLineColor="#148ddf"
            opacity={0.5}
          />
          <CenterLabel>Back to the future.</CenterLabel>
        </Surface>
      );
    case 'ripple':
      return (
        <Surface>
          <Ripple mainCircleSize={50} numCircles={6} className="text-primary" />
          <Sparkles className="relative z-10 text-primary" />
        </Surface>
      );
    case 'dot-pattern':
      return (
        <Surface>
          <DotPattern width={14} height={14} className="fill-primary/40" />
          <CenterLabel>Connect the dots.</CenterLabel>
        </Surface>
      );
    case 'grid-pattern':
      return (
        <Surface>
          <GridPattern
            width={24}
            height={24}
            squares={[
              [2, 2],
              [4, 3],
              [6, 1],
            ]}
            className="fill-primary/20 stroke-primary/30"
          />
          <CenterLabel>Find the rhythm.</CenterLabel>
        </Surface>
      );
    case 'hexagon-pattern':
      return (
        <Surface>
          <HexagonPattern
            radius={16}
            className="fill-primary/10 stroke-primary/40"
          />
          <CenterLabel>Think in patterns.</CenterLabel>
        </Surface>
      );
    case 'striped-pattern':
      return (
        <Surface>
          <StripedPattern className="text-primary/30" />
          <CenterLabel>A different angle.</CenterLabel>
        </Surface>
      );
    case 'interactive-grid-pattern':
      return (
        <Surface>
          <InteractiveGridPattern
            width={24}
            height={24}
            squares={[12, 7]}
            className="fill-primary/5 stroke-primary/30"
            squaresClassName="hover:fill-primary/50"
          />
          <CenterLabel>Move your mouse.</CenterLabel>
        </Surface>
      );
    case 'light-rays':
      return (
        <Surface>
          <LightRays count={4} color="rgba(20,141,223,.5)" blur={10} />
          <CenterLabel>Let ideas shine.</CenterLabel>
        </Surface>
      );
    case 'noise-texture':
      return (
        <Surface className="bg-primary/15">
          <NoiseTexture
            className="absolute inset-0 size-full"
            noiseOpacity={0.5}
          />
          <CenterLabel>Feel the texture.</CenterLabel>
        </Surface>
      );
    case 'floating-3d-particles':
      return (
        <Surface>
          <Floating3DParticles
            quantity={expanded ? 100 : 40}
            color="#148ddf"
            opacity={0.6}
            size={3}
            className="absolute inset-0 size-full"
          />
          <CenterLabel>A little depth.</CenterLabel>
        </Surface>
      );
    case 'shiny-button':
      return <ShinyButton onClick={notify}>Shine on.</ShinyButton>;
    case 'file-tree':
      return (
        <div className="h-44 w-full">
          <Tree initialExpandedItems={['src']} className="w-full">
            <Folder element="src" value="src">
              <Folder element="components" value="components">
                <File value="button">button.tsx</File>
                <File value="card">card.tsx</File>
              </Folder>
              <File value="app">App.tsx</File>
            </Folder>
          </Tree>
        </div>
      );
    case 'code-comparison':
      return (
        <CodeComparison
          beforeCode={'const color = "gray"; // [!code --]'}
          afterCode={'const color = "#148DDF"; // [!code ++]'}
          language="typescript"
          filename="tokens.ts"
          lightTheme="github-light"
          darkTheme="github-dark"
        />
      );
    case 'scroll-progress':
      return <ScrollExample />;
    case 'neon-gradient-card':
      return (
        <NeonGradientCard
          className="w-full"
          neonColors={{ firstColor: '#148ddf', secondColor: '#9c7ee7' }}
        >
          <CenterLabel>Neon dreams.</CenterLabel>
        </NeonGradientCard>
      );
    case 'comic-text':
      return <ComicText fontSize={2.5}>POW!</ComicText>;
    case 'kinetic-text':
      return <KineticText text="MOTION" className="text-3xl" />;
    case 'pixel-image':
      return (
        <div className="magic-pixel">
          <PixelImage
            src={scene}
            grid="8x8"
            maxAnimationDelay={1200}
            pixelFadeInDuration={600}
          />
        </div>
      );
    case 'pulsating-button':
      return (
        <PulsatingButton
          onClick={notify}
          pulseColor="#148ddf"
          className="bg-primary"
        >
          Pulse
          <Plus size={16} />
        </PulsatingButton>
      );
    case 'warp-background':
      return (
        <WarpBackground
          className="h-36 w-full p-4"
          beamsPerSide={2}
          beamSize={8}
          gridColor="rgba(20,141,223,.25)"
        >
          <CenterLabel>Explore more.</CenterLabel>
        </WarpBackground>
      );
    case 'interactive-hover-button':
      return (
        <InteractiveHoverButton onClick={notify}>
          Explore
        </InteractiveHoverButton>
      );
    case 'animated-circular-progress-bar':
      return (
        <div className="flex flex-col items-center gap-3">
          <AnimatedCircularProgressBar
            value={value}
            gaugePrimaryColor="#148ddf"
            gaugeSecondaryColor="var(--color-border)"
            className="size-28 text-xl"
          />
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setValue((v) => (v + 15) % 105)}
          >
            진행률 변경
          </Button>
        </div>
      );
    case 'backlight':
      return (
        <Backlight>
          <div className="magic-backlight-card">
            <Sparkles />
            Ideas glow here.
          </div>
        </Backlight>
      );
    case 'glyph-matrix':
      return (
        <Surface>
          <GlyphMatrix
            className="absolute inset-0 size-full"
            color="#148ddf"
            cellSize={16}
            interval={140}
          />
        </Surface>
      );
    default:
      return <p>등록되지 않은 인터랙션입니다.</p>;
  }
}
