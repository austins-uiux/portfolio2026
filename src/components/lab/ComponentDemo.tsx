import { translate, localize } from '../../i18n';
import { useId, useState } from 'react';
import { StudioCardExample } from './StudioCardExample';
import {
  Check,
  ChevronRight,
  Download,
  FileText,
  Info,
  Mail,
  Plus,
  Search,
  Sparkles,
  Star,
  Terminal,
} from 'lucide-react';
import { toast } from 'sonner';
import { ko, enUS } from 'date-fns/locale';
import { getLocale } from '../../i18n';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import * as Accordion from '../lab-ui/accordion';
import * as Alert from '../lab-ui/alert';
import * as AlertDialog from '../lab-ui/alert-dialog';
import { AspectRatio } from '../lab-ui/aspect-ratio';
import * as Attachment from '../lab-ui/attachment';
import * as Avatar from '../lab-ui/avatar';
import { Badge } from '../lab-ui/badge';
import * as Breadcrumb from '../lab-ui/breadcrumb';
import * as Bubble from '../lab-ui/bubble';
import { Button } from '../lab-ui/button';
import * as ButtonGroup from '../lab-ui/button-group';
import { Calendar } from '../lab-ui/calendar';
import * as Card from '../lab-ui/card';
import * as Carousel from '../lab-ui/carousel';
import * as Chart from '../lab-ui/chart';
import { Checkbox } from '../lab-ui/checkbox';
import * as CodeBlock from '../lab-ui/code-block';
import * as Collapsible from '../lab-ui/collapsible';
import * as Combobox from '../lab-ui/combobox';
import * as Command from '../lab-ui/command';
import * as ContextMenu from '../lab-ui/context-menu';
import { DirectionProvider } from '../lab-ui/direction';
import * as Dialog from '../lab-ui/dialog';
import * as Drawer from '../lab-ui/drawer';
import * as DropdownMenu from '../lab-ui/dropdown-menu';
import * as Empty from '../lab-ui/empty';
import * as Field from '../lab-ui/field';
import * as HoverCard from '../lab-ui/hover-card';
import { Input } from '../lab-ui/input';
import * as InputGroup from '../lab-ui/input-group';
import * as InputOTP from '../lab-ui/input-otp';
import * as Item from '../lab-ui/item';
import { Kbd, KbdGroup } from '../lab-ui/kbd';
import { Label } from '../lab-ui/label';
import * as Marker from '../lab-ui/marker';
import * as Menubar from '../lab-ui/menubar';
import * as Message from '../lab-ui/message';
import * as MessageScroller from '../lab-ui/message-scroller';
import * as NativeSelect from '../lab-ui/native-select';
import * as NavigationMenu from '../lab-ui/navigation-menu';
import * as Pagination from '../lab-ui/pagination';
import * as Popover from '../lab-ui/popover';
import { Progress } from '../lab-ui/progress';
import * as Questionnaire from '../lab-ui/questionnaire';
import * as RadioGroup from '../lab-ui/radio-group';
import * as Resizable from '../lab-ui/resizable';
import { ScrollArea } from '../lab-ui/scroll-area';
import * as Select from '../lab-ui/select';
import { Separator } from '../lab-ui/separator';
import * as Sheet from '../lab-ui/sheet';
import * as Sidebar from '../lab-ui/sidebar';
import { Skeleton } from '../lab-ui/skeleton';
import { Slider } from '../lab-ui/slider';
import { Spinner } from '../lab-ui/spinner';
import { Switch } from '../lab-ui/switch';
import * as Table from '../lab-ui/table';
import * as Tabs from '../lab-ui/tabs';
import { Textarea } from '../lab-ui/textarea';
import { Toggle } from '../lab-ui/toggle';
import * as ToggleGroup from '../lab-ui/toggle-group';
import * as Tooltip from '../lab-ui/tooltip';
import * as Trace from '../lab-ui/trace';

export const demoIds = [
  'accordion',
  'alert',
  'alert-dialog',
  'aspect-ratio',
  'attachment',
  'avatar',
  'badge',
  'breadcrumb',
  'bubble',
  'button',
  'button-group',
  'calendar',
  'card',
  'carousel',
  'chart',
  'checkbox',
  'code-block',
  'collapsible',
  'combobox',
  'command',
  'context-menu',
  'data-table',
  'date-picker',
  'dialog',
  'direction',
  'drawer',
  'dropdown-menu',
  'empty',
  'field',
  'hover-card',
  'input',
  'input-group',
  'input-otp',
  'item',
  'kbd',
  'label',
  'marker',
  'menubar',
  'message',
  'message-scroller',
  'native-select',
  'navigation-menu',
  'pagination',
  'popover',
  'progress',
  'questionnaire',
  'radio-group',
  'resizable',
  'scroll-area',
  'select',
  'separator',
  'sheet',
  'sidebar',
  'skeleton',
  'slider',
  'spinner',
  'switch',
  'table',
  'tabs',
  'textarea',
  'toast',
  'toggle',
  'toggle-group',
  'tooltip',
  'trace',
  'typography',
] as const;

function DemoTable({ interactive = false }: { interactive?: boolean }) {
  const [query, setQuery] = useState('');
  const [ascending, setAscending] = useState(true);
  const rows = [
    { name: 'Button', state: 'Ready' },
    { name: 'Dialog', state: 'Review' },
    { name: 'Input', state: 'Ready' },
  ]
    .filter((r) => r.name.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) =>
      ascending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name),
    );
  return (
    <div className="w-full space-y-3">
      {localize(interactive && (
        <Input
          aria-label={translate("테이블 필터")}
          placeholder={translate("컴포넌트 필터…")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      ))}
      <Table.Table>
        <Table.TableHeader>
          <Table.TableRow>
            <Table.TableHead>
              {localize(interactive ? (
                <button type="button" onClick={() => setAscending((v) => !v)}>{translate(" 이름 ")}{localize(ascending ? '↑' : '↓')}
                </button>
              ) : (
                '컴포넌트'
              ))}
            </Table.TableHead>
            <Table.TableHead>{translate("상태")}</Table.TableHead>
          </Table.TableRow>
        </Table.TableHeader>
        <Table.TableBody>
          {localize(rows.map((r) => (
            <Table.TableRow key={r.name}>
              <Table.TableCell>{localize(r.name)}</Table.TableCell>
              <Table.TableCell>
                <Badge variant="secondary">{localize(r.state)}</Badge>
              </Table.TableCell>
            </Table.TableRow>
          )))}
          {localize(!rows.length && (
            <Table.TableRow>
              <Table.TableCell colSpan={2}>{translate(" 검색 결과가 없습니다. ")}</Table.TableCell>
            </Table.TableRow>
          ))}
        </Table.TableBody>
      </Table.Table>
    </div>
  );
}

export function ComponentDemo({
  id,
  expanded = false,
}: {
  id: string;
  expanded?: boolean;
}) {
  const uid = useId();
  const [checked, setChecked] = useState(false);
  const [value, setValue] = useState(40);
  const [page, setPage] = useState(1);
  const [date, setDate] = useState<Date | undefined>(new Date(2026, 9, 25));
  const [text, setText] = useState('');
  switch (id) {
    case 'accordion':
      return (
        <Accordion.Accordion type="single" collapsible className="w-full">
          <Accordion.AccordionItem value="one" className="py-[10px]">
            <Accordion.AccordionTrigger className="px-[10px]">{translate(" 어떤 컴포넌트인가요? ")}</Accordion.AccordionTrigger>
            <Accordion.AccordionContent className="px-[10px]">{translate(" 내용을 접고 펼칠 수 있는 아코디언입니다. ")}</Accordion.AccordionContent>
          </Accordion.AccordionItem>
          <Accordion.AccordionItem value="two" className="py-[10px]">
            <Accordion.AccordionTrigger className="px-[10px]">{translate(" 키보드도 지원하나요? ")}</Accordion.AccordionTrigger>
            <Accordion.AccordionContent className="px-[10px]">{translate(" Tab과 Enter로 탐색하고 열 수 있어요. ")}</Accordion.AccordionContent>
          </Accordion.AccordionItem>
        </Accordion.Accordion>
      );
    case 'alert':
      return (
        <Alert.Alert>
          <Info />
          <Alert.AlertTitle>{translate("변경 사항을 확인하세요")}</Alert.AlertTitle>
          <Alert.AlertDescription>{translate(" 저장하기 전에 입력한 내용을 검토해 주세요. ")}</Alert.AlertDescription>
        </Alert.Alert>
      );
    case 'alert-dialog':
      return (
        <AlertDialog.AlertDialog>
          <AlertDialog.AlertDialogTrigger asChild>
            <Button variant="outline">{translate("확인 창 열기")}</Button>
          </AlertDialog.AlertDialogTrigger>
          <AlertDialog.AlertDialogContent>
            <AlertDialog.AlertDialogHeader>
              <AlertDialog.AlertDialogTitle>{translate(" 초안을 삭제할까요? ")}</AlertDialog.AlertDialogTitle>
              <AlertDialog.AlertDialogDescription>{translate(" 갤러리 동작 예시입니다. 실제 데이터는 삭제되지 않습니다. ")}</AlertDialog.AlertDialogDescription>
            </AlertDialog.AlertDialogHeader>
            <AlertDialog.AlertDialogFooter>
              <AlertDialog.AlertDialogCancel>{translate(" 취소 ")}</AlertDialog.AlertDialogCancel>
              <AlertDialog.AlertDialogAction
                onClick={() => toast(translate('초안 삭제 동작을 확인했어요.'))}
              >{translate(" 삭제 ")}</AlertDialog.AlertDialogAction>
            </AlertDialog.AlertDialogFooter>
          </AlertDialog.AlertDialogContent>
        </AlertDialog.AlertDialog>
      );
    case 'aspect-ratio':
      return (
        <div className="w-full overflow-hidden rounded-lg">
          <AspectRatio ratio={16 / 9}>
            <div className="lab-art h-full">
              <Sparkles size={36} />
              <span>16 : 9</span>
            </div>
          </AspectRatio>
        </div>
      );
    case 'attachment':
      return (
        <Attachment.Attachment>
          <Attachment.AttachmentMedia>
            <FileText />
          </Attachment.AttachmentMedia>
          <Attachment.AttachmentContent>
            <Attachment.AttachmentTitle>
              design-tokens.json
            </Attachment.AttachmentTitle>
            <Attachment.AttachmentDescription>{translate(" JSON · 2.4 KB · 예시 파일 ")}</Attachment.AttachmentDescription>
          </Attachment.AttachmentContent>
        </Attachment.Attachment>
      );
    case 'avatar':
      return (
        <div className="flex items-center gap-3">
          {localize(['A+', 'AL', 'UI'].map((s, i) => (
            <Avatar.Avatar key={s} className={i === 0 ? 'size-12' : 'size-9'}>
              <Avatar.AvatarFallback>{localize(s)}</Avatar.AvatarFallback>
            </Avatar.Avatar>
          )))}
        </div>
      );
    case 'badge':
      return (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Badge>Primary</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Error</Badge>
        </div>
      );
    case 'breadcrumb':
      return (
        <Breadcrumb.Breadcrumb>
          <Breadcrumb.BreadcrumbList>
            <Breadcrumb.BreadcrumbItem>
              <Breadcrumb.BreadcrumbLink
                href={
                  import.meta.env.VITE_STANDALONE_PREVIEW === 'true'
                    ? '#/'
                    : '/'
                }
              >{translate(" 홈 ")}</Breadcrumb.BreadcrumbLink>
            </Breadcrumb.BreadcrumbItem>
            <Breadcrumb.BreadcrumbSeparator />
            <Breadcrumb.BreadcrumbItem>
              <Breadcrumb.BreadcrumbPage>{translate("컴포넌트 랩")}</Breadcrumb.BreadcrumbPage>
            </Breadcrumb.BreadcrumbItem>
          </Breadcrumb.BreadcrumbList>
        </Breadcrumb.Breadcrumb>
      );
    case 'bubble':
      return (
        <Bubble.BubbleGroup className="w-full">
          <Bubble.Bubble variant="muted">
            <Bubble.BubbleContent>{translate("어떤 UI가 필요하세요?")}</Bubble.BubbleContent>
          </Bubble.Bubble>
          <Bubble.Bubble align="end">
            <Bubble.BubbleContent>{translate("읽기 편한 대화 UI요.")}</Bubble.BubbleContent>
          </Bubble.Bubble>
        </Bubble.BubbleGroup>
      );
    case 'button':
      return (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button onClick={() => toast(translate('Primary 버튼을 눌렀어요.'))}>
            Primary
          </Button>
          <Button
            variant="outline"
            onClick={() => toast(translate('Outline 버튼을 눌렀어요.'))}
          >
            Outline
          </Button>
          <Button disabled>Disabled</Button>
          {localize(expanded && (
            <>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button size="sm">Small</Button>
              <Button size="lg">Large</Button>
              <Button variant="ghost">Ghost</Button>
            </>
          ))}
        </div>
      );
    case 'button-group':
      return (
        <ButtonGroup.ButtonGroup>
          <Button
            variant="outline"
            onClick={() => setValue((v) => Math.max(0, v - 1))}
            aria-label={translate("수량 줄이기")}
          >
            −
          </Button>
          <ButtonGroup.ButtonGroupText>{localize(value)}</ButtonGroup.ButtonGroupText>
          <Button
            variant="outline"
            onClick={() => setValue((v) => v + 1)}
            aria-label={translate("수량 늘리기")}
          >
            +
          </Button>
        </ButtonGroup.ButtonGroup>
      );
    case 'calendar':
      return (
        <Calendar
          locale={getLocale() === 'en' ? enUS : ko}
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-lg border"
        />
      );
    case 'card':
      return <StudioCardExample onAction={() => toast(translate('카드의 액션 버튼을 눌렀어요.'))} />;
    case 'carousel':
      return (
        <Carousel.Carousel
          className={expanded ? 'w-full max-w-[320px]' : 'w-full max-w-[140px]'}
        >
          <Carousel.CarouselContent>
            {localize([1, 2, 3].map((n) => (
              <Carousel.CarouselItem key={n}>
                <div className="lab-art h-28 rounded-lg">0{localize(n)}</div>
              </Carousel.CarouselItem>
            )))}
          </Carousel.CarouselContent>
          <Carousel.CarouselPrevious />
          <Carousel.CarouselNext />
        </Carousel.Carousel>
      );
    case 'chart':
      return (
        <Chart.ChartContainer
          config={{ views: { label: '조회수', color: 'var(--chart-1)' } }}
          className="h-40 w-full"
        >
          <BarChart
            accessibilityLayer
            data={[
              { day: 'Mon', views: 42 },
              { day: 'Tue', views: 76 },
              { day: 'Wed', views: 58 },
              { day: 'Thu', views: 92 },
              { day: 'Fri', views: 66 },
            ]}
          >
            <CartesianGrid vertical={false} />
            <XAxis dataKey="day" tickLine={false} axisLine={false} />
            <Chart.ChartTooltip content={<Chart.ChartTooltipContent />} />
            <Bar dataKey="views" fill="var(--chart-1)" radius={4} />
          </BarChart>
        </Chart.ChartContainer>
      );
    case 'checkbox':
      return (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Checkbox
              id={uid}
              checked={checked}
              onCheckedChange={(v) => setChecked(v === true)}
            />
            <Label htmlFor={uid}>{translate("이용 약관에 동의합니다")}</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox disabled id={uid + 'disabled'} />
            <Label htmlFor={uid + 'disabled'}>{translate("선택 불가")}</Label>
          </div>
        </div>
      );
    case 'code-block':
      return (
        <CodeBlock.CodeBlock className="w-full">
          <CodeBlock.CodeBlockHeader>
            <CodeBlock.CodeBlockTitle>hello.ts</CodeBlock.CodeBlockTitle>
            <CodeBlock.CodeBlockActions>
              <CodeBlock.CodeBlockCopyButton
                value={'const studio = "A+studio";'}
              />
            </CodeBlock.CodeBlockActions>
          </CodeBlock.CodeBlockHeader>
          <CodeBlock.CodeBlockContent>
            <CodeBlock.CodeBlockLine>
              {localize('const studio = "A+studio";')}
            </CodeBlock.CodeBlockLine>
          </CodeBlock.CodeBlockContent>
        </CodeBlock.CodeBlock>
      );
    case 'collapsible':
      return (
        <Collapsible.Collapsible className="w-full">
          <Collapsible.CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full">{translate(" 파일 목록 펼치기 ")}</Button>
          </Collapsible.CollapsibleTrigger>
          <Collapsible.CollapsibleContent>
            <div className="mt-3 rounded-lg border p-3 text-sm">
              tokens.css
              <br />
              button.tsx
              <br />
              input.tsx
            </div>
          </Collapsible.CollapsibleContent>
        </Collapsible.Collapsible>
      );
    case 'combobox':
      return (
        <Combobox.Combobox items={['React', 'Vue', 'Svelte', 'Angular']}>
          <Combobox.ComboboxInput
            placeholder={translate("프레임워크 검색")}
            aria-label={translate("프레임워크 검색")}
          />
          <Combobox.ComboboxContent>
            <Combobox.ComboboxEmpty>{translate("결과가 없습니다.")}</Combobox.ComboboxEmpty>
            <Combobox.ComboboxList>
              {localize((item: string) => (
                <Combobox.ComboboxItem key={item} value={item}>
                  {localize(item)}
                </Combobox.ComboboxItem>
              ))}
            </Combobox.ComboboxList>
          </Combobox.ComboboxContent>
        </Combobox.Combobox>
      );
    case 'command':
      return (
        <Command.Command className="rounded-lg border">
          <Command.CommandInput placeholder={translate("명령 검색…")} />
          <Command.CommandList>
            <Command.CommandEmpty>{translate("검색 결과가 없습니다.")}</Command.CommandEmpty>
            <Command.CommandGroup heading="빠른 실행">
              <Command.CommandItem onSelect={() => toast(translate('검색 명령 실행'))}>
                <Search />{translate(" 검색 ")}</Command.CommandItem>
              <Command.CommandItem
                onSelect={() => toast(translate('새 프로젝트 명령 실행'))}
              >
                <Plus />{translate("새 프로젝트 ")}</Command.CommandItem>
            </Command.CommandGroup>
          </Command.CommandList>
        </Command.Command>
      );
    case 'context-menu':
      return (
        <ContextMenu.ContextMenu>
          <ContextMenu.ContextMenuTrigger className="w-full rounded-lg border border-dashed p-10 text-center text-sm">{translate(" 여기서 우클릭 ")}<br />
            <span className="text-muted-foreground">{translate(" 또는 메뉴 키 / 길게 누르기 ")}</span>
          </ContextMenu.ContextMenuTrigger>
          <ContextMenu.ContextMenuContent>
            <ContextMenu.ContextMenuItem
              onSelect={() => toast(translate('복사 동작을 선택했어요.'))}
            >{translate(" 복사 ")}</ContextMenu.ContextMenuItem>
            <ContextMenu.ContextMenuItem
              onSelect={() => toast(translate('붙여넣기 동작을 선택했어요.'))}
            >{translate(" 붙여넣기 ")}</ContextMenu.ContextMenuItem>
          </ContextMenu.ContextMenuContent>
        </ContextMenu.ContextMenu>
      );
    case 'data-table':
      return <DemoTable interactive />;
    case 'date-picker':
      return (
        <Popover.Popover>
          <Popover.PopoverTrigger asChild>
            <Button variant="outline">
              {localize(date ? date.toLocaleDateString('ko-KR') : '날짜 선택')}
            </Button>
          </Popover.PopoverTrigger>
          <Popover.PopoverContent className="w-auto p-0">
            <Calendar
              locale={getLocale() === 'en' ? enUS : ko}
              mode="single"
              selected={date}
              onSelect={setDate}
            />
          </Popover.PopoverContent>
        </Popover.Popover>
      );
    case 'dialog':
      return (
        <Dialog.Dialog>
          <Dialog.DialogTrigger asChild>
            <Button variant="outline">{translate("프로필 편집")}</Button>
          </Dialog.DialogTrigger>
          <Dialog.DialogContent>
            <Dialog.DialogHeader>
              <Dialog.DialogTitle>{translate("프로필 편집")}</Dialog.DialogTitle>
              <Dialog.DialogDescription>{translate(" 갤러리 예시입니다. 입력은 서버에 저장되지 않습니다. ")}</Dialog.DialogDescription>
            </Dialog.DialogHeader>
            <Label htmlFor={uid}>{translate("이름")}</Label>
            <Input id={uid} defaultValue="Austin" />
            <Dialog.DialogFooter>
              <Dialog.DialogClose asChild>
                <Button onClick={() => toast(translate('프로필 저장 동작을 확인했어요.'))}>{translate(" 저장 ")}</Button>
              </Dialog.DialogClose>
            </Dialog.DialogFooter>
          </Dialog.DialogContent>
        </Dialog.Dialog>
      );
    case 'direction':
      return (
        <DirectionProvider dir={checked ? 'rtl' : 'ltr'}>
          <div className="w-full space-y-3">
            <Button variant="outline" onClick={() => setChecked((v) => !v)}>{translate(" 방향 전환: ")}{localize(checked ? 'RTL' : 'LTR')}
            </Button>
            <div
              dir={checked ? 'rtl' : 'ltr'}
              className="flex items-center gap-2 rounded-lg border p-3"
            >
              <span>{translate("시작")}</span>
              <ChevronRight className={checked ? 'rotate-180' : ''} />
              <span>{translate("끝")}</span>
            </div>
          </div>
        </DirectionProvider>
      );
    case 'drawer':
      return (
        <Drawer.Drawer>
          <Drawer.DrawerTrigger asChild>
            <Button variant="outline">{translate("아래에서 열기")}</Button>
          </Drawer.DrawerTrigger>
          <Drawer.DrawerContent>
            <div className="mx-auto w-full max-w-sm p-6">
              <Drawer.DrawerHeader>
                <Drawer.DrawerTitle>{translate("목표 설정")}</Drawer.DrawerTitle>
                <Drawer.DrawerDescription>{translate(" 슬라이더로 목표를 조정해 보세요. ")}</Drawer.DrawerDescription>
              </Drawer.DrawerHeader>
              <Slider
                value={[value]}
                onValueChange={(v) => setValue(v[0])}
                max={100}
                aria-label={translate("목표")}
              />
              <p className="my-4 text-center">{localize(value)}%</p>
              <Drawer.DrawerFooter>
                <Drawer.DrawerClose asChild>
                  <Button>{translate("완료")}</Button>
                </Drawer.DrawerClose>
              </Drawer.DrawerFooter>
            </div>
          </Drawer.DrawerContent>
        </Drawer.Drawer>
      );
    case 'dropdown-menu':
      return (
        <DropdownMenu.DropdownMenu>
          <DropdownMenu.DropdownMenuTrigger asChild>
            <Button variant="outline">{translate("메뉴 열기")}</Button>
          </DropdownMenu.DropdownMenuTrigger>
          <DropdownMenu.DropdownMenuContent>
            <DropdownMenu.DropdownMenuLabel>{translate(" 프로젝트 ")}</DropdownMenu.DropdownMenuLabel>
            <DropdownMenu.DropdownMenuSeparator />
            <DropdownMenu.DropdownMenuItem
              onSelect={() => toast(translate('편집을 선택했어요.'))}
            >{translate(" 편집 ")}</DropdownMenu.DropdownMenuItem>
            <DropdownMenu.DropdownMenuItem
              onSelect={() => toast(translate('공유를 선택했어요.'))}
            >{translate(" 공유 ")}</DropdownMenu.DropdownMenuItem>
          </DropdownMenu.DropdownMenuContent>
        </DropdownMenu.DropdownMenu>
      );
    case 'empty':
      return (
        <Empty.Empty>
          <Empty.EmptyHeader>
            <Empty.EmptyMedia variant="icon">
              <Search />
            </Empty.EmptyMedia>
            <Empty.EmptyTitle>{translate("아직 프로젝트가 없어요")}</Empty.EmptyTitle>
            <Empty.EmptyDescription>{translate(" 새 프로젝트로 첫 작업을 시작해 보세요. ")}</Empty.EmptyDescription>
          </Empty.EmptyHeader>
        </Empty.Empty>
      );
    case 'field':
      return (
        <Field.Field>
          <Field.FieldLabel htmlFor={uid}>{translate("이메일")}</Field.FieldLabel>
          <Input id={uid} type="email" placeholder="hello@aplus.studio" />
          <Field.FieldDescription>{translate(" 프로젝트 소식을 받을 주소예요. ")}</Field.FieldDescription>
        </Field.Field>
      );
    case 'hover-card':
      return (
        <HoverCard.HoverCard openDelay={150}>
          <HoverCard.HoverCardTrigger asChild>
            <Button variant="link">{translate("@Austin · 마우스를 올려보세요")}</Button>
          </HoverCard.HoverCardTrigger>
          <HoverCard.HoverCardContent>
            <p className="font-semibold">Austin Lee</p>
            <p className="mt-2 text-sm text-muted-foreground">{translate(" AI 네이티브 프로덕트 디자이너 ")}</p>
          </HoverCard.HoverCardContent>
        </HoverCard.HoverCard>
      );
    case 'input':
      return (
        <div className="w-full space-y-3">
          <Input aria-label={translate("기본 입력")} placeholder={translate("이름을 입력하세요")} />
          <Input disabled aria-label={translate("비활성 입력")} placeholder="Disabled" />
          {localize(expanded && (
            <Input
              aria-invalid="true"
              aria-label={translate("오류 입력")}
              placeholder={translate("오류 상태")}
            />
          ))}
        </div>
      );
    case 'input-group':
      return (
        <InputGroup.InputGroup>
          <InputGroup.InputGroupAddon>
            <Search />
          </InputGroup.InputGroupAddon>
          <InputGroup.InputGroupInput
            placeholder={translate("프로젝트 검색…")}
            aria-label={translate("입력 그룹 검색")}
          />
          <InputGroup.InputGroupAddon align="inline-end">
            <Kbd>⌘ K</Kbd>
          </InputGroup.InputGroupAddon>
        </InputGroup.InputGroup>
      );
    case 'input-otp':
      return (
        <InputOTP.InputOTP maxLength={4} aria-label={translate("4자리 인증번호")}>
          <InputOTP.InputOTPGroup>
            {localize([0, 1, 2, 3].map((index) => (
              <InputOTP.InputOTPSlot index={index} key={index} />
            )))}
          </InputOTP.InputOTPGroup>
        </InputOTP.InputOTP>
      );
    case 'item':
      return (
        <Item.Item variant="outline">
          <Item.ItemMedia variant="icon">
            <FileText />
          </Item.ItemMedia>
          <Item.ItemContent>
            <Item.ItemTitle>{translate("디자인 시스템")}</Item.ItemTitle>
            <Item.ItemDescription>Tokens & components</Item.ItemDescription>
          </Item.ItemContent>
          <Item.ItemActions>
            <Button
              size="icon-sm"
              variant="ghost"
              aria-label={translate("항목 열기")}
              onClick={() => toast(translate('항목 액션을 눌렀어요.'))}
            >
              <ChevronRight />
            </Button>
          </Item.ItemActions>
        </Item.Item>
      );
    case 'kbd':
      return (
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>Shift</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      );
    case 'label':
      return (
        <div className="w-full space-y-2">
          <Label htmlFor={uid}>{translate("프로젝트 이름")}</Label>
          <Input id={uid} placeholder="A+studio" />
        </div>
      );
    case 'marker':
      return (
        <div className="w-full space-y-5">
          <Marker.Marker>
            <Marker.MarkerIcon>
              <Check />
            </Marker.MarkerIcon>
            <Marker.MarkerContent>{translate("저장이 완료되었어요")}</Marker.MarkerContent>
          </Marker.Marker>
          <Marker.Marker variant="separator">
            <Marker.MarkerContent>{translate("오늘")}</Marker.MarkerContent>
          </Marker.Marker>
        </div>
      );
    case 'menubar':
      return (
        <Menubar.Menubar>
          <Menubar.MenubarMenu>
            <Menubar.MenubarTrigger>{translate("파일")}</Menubar.MenubarTrigger>
            <Menubar.MenubarContent>
              <Menubar.MenubarItem
                onSelect={() => toast(translate('새 파일을 선택했어요.'))}
              >{translate(" 새 파일 ")}</Menubar.MenubarItem>
              <Menubar.MenubarItem onSelect={() => toast(translate('저장을 선택했어요.'))}>{translate(" 저장 ")}</Menubar.MenubarItem>
            </Menubar.MenubarContent>
          </Menubar.MenubarMenu>
          <Menubar.MenubarMenu>
            <Menubar.MenubarTrigger>{translate("편집")}</Menubar.MenubarTrigger>
            <Menubar.MenubarContent>
              <Menubar.MenubarItem
                onSelect={() => toast(translate('실행 취소를 선택했어요.'))}
              >{translate(" 실행 취소 ")}</Menubar.MenubarItem>
            </Menubar.MenubarContent>
          </Menubar.MenubarMenu>
        </Menubar.Menubar>
      );
    case 'message':
      return (
        <Message.Message>
          <Message.MessageAvatar className="size-8">A+</Message.MessageAvatar>
          <Message.MessageContent>
            <Message.MessageHeader>Austin</Message.MessageHeader>
            <Bubble.Bubble variant="muted">
              <Bubble.BubbleContent>{translate(" 좋은 디자인은 작은 디테일에서 시작돼요. ")}</Bubble.BubbleContent>
            </Bubble.Bubble>
            <Message.MessageFooter>{translate("지금")}</Message.MessageFooter>
          </Message.MessageContent>
        </Message.Message>
      );
    case 'message-scroller':
      return (
        <div className="h-44 w-full rounded-lg border p-3">
          <MessageScroller.MessageScrollerProvider>
            <MessageScroller.MessageScroller>
              <MessageScroller.MessageScrollerViewport>
                <MessageScroller.MessageScrollerContent>
                  {localize(Array.from({ length: 8 }, (_, i) => (
                    <MessageScroller.MessageScrollerItem key={i}>
                      <Bubble.Bubble
                        variant={i % 2 ? 'default' : 'muted'}
                        align={i % 2 ? 'end' : 'start'}
                      >
                        <Bubble.BubbleContent>{translate(" 메시지 ")}{localize(i + 1)}{translate(" · 스크롤해 보세요 ")}</Bubble.BubbleContent>
                      </Bubble.Bubble>
                    </MessageScroller.MessageScrollerItem>
                  )))}
                </MessageScroller.MessageScrollerContent>
              </MessageScroller.MessageScrollerViewport>
              <MessageScroller.MessageScrollerButton />
            </MessageScroller.MessageScroller>
          </MessageScroller.MessageScrollerProvider>
        </div>
      );
    case 'native-select':
      return (
        <NativeSelect.NativeSelect aria-label={translate("프로젝트 유형")} defaultValue="">
          <NativeSelect.NativeSelectOption value="" disabled>{translate(" 프로젝트 유형 선택 ")}</NativeSelect.NativeSelectOption>
          <NativeSelect.NativeSelectOption value="web">{translate(" 웹사이트 ")}</NativeSelect.NativeSelectOption>
          <NativeSelect.NativeSelectOption value="app">{translate(" 모바일 앱 ")}</NativeSelect.NativeSelectOption>
        </NativeSelect.NativeSelect>
      );
    case 'navigation-menu':
      return (
        <NavigationMenu.NavigationMenu>
          <NavigationMenu.NavigationMenuList>
            <NavigationMenu.NavigationMenuItem>
              <NavigationMenu.NavigationMenuTrigger>{translate(" 둘러보기 ")}</NavigationMenu.NavigationMenuTrigger>
              <NavigationMenu.NavigationMenuContent>
                <div className="w-44 p-2">
                  <NavigationMenu.NavigationMenuLink asChild>
                    <button onClick={() => toast(translate('소개 메뉴를 눌렀어요.'))}>{translate(" 소개 ")}</button>
                  </NavigationMenu.NavigationMenuLink>
                  <NavigationMenu.NavigationMenuLink asChild>
                    <button onClick={() => toast(translate('프로젝트 메뉴를 눌렀어요.'))}>{translate(" 프로젝트 ")}</button>
                  </NavigationMenu.NavigationMenuLink>
                </div>
              </NavigationMenu.NavigationMenuContent>
            </NavigationMenu.NavigationMenuItem>
          </NavigationMenu.NavigationMenuList>
        </NavigationMenu.NavigationMenu>
      );
    case 'pagination':
      return (
        <Pagination.Pagination>
          <Pagination.PaginationContent>
            <Pagination.PaginationItem>
              <Pagination.PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((v) => Math.max(1, v - 1));
                }}
                aria-disabled={page === 1}
              />
            </Pagination.PaginationItem>
            {localize([1, 2, 3].map((n) => (
              <Pagination.PaginationItem key={n}>
                <Pagination.PaginationLink
                  href="#"
                  isActive={page === n}
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(n);
                  }}
                >
                  {localize(n)}
                </Pagination.PaginationLink>
              </Pagination.PaginationItem>
            )))}
            <Pagination.PaginationItem>
              <Pagination.PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((v) => Math.min(3, v + 1));
                }}
                aria-disabled={page === 3}
              />
            </Pagination.PaginationItem>
          </Pagination.PaginationContent>
        </Pagination.Pagination>
      );
    case 'popover':
      return (
        <Popover.Popover>
          <Popover.PopoverTrigger asChild>
            <Button variant="outline">{translate("설정 열기")}</Button>
          </Popover.PopoverTrigger>
          <Popover.PopoverContent>
            <div className="space-y-3">
              <h3 className="font-semibold">{translate("알림 설정")}</h3>
              <div className="flex items-center justify-between gap-4">
                <Label htmlFor={uid}>{translate("이메일 알림")}</Label>
                <Switch id={uid} />
              </div>
            </div>
          </Popover.PopoverContent>
        </Popover.Popover>
      );
    case 'progress':
      return (
        <div className="w-full space-y-3">
          <Progress value={value} aria-label={translate("진행률")} />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setValue((v) => (v + 20) % 120)}
          >{translate(" 진행률 변경 · ")}{localize(value)}%
          </Button>
        </div>
      );
    case 'questionnaire':
      return <QuestionnaireDemo />;
    case 'radio-group':
      return (
        <RadioGroup.RadioGroup defaultValue="standard" className="w-full gap-3">
          {localize(['standard', 'compact'].map((v, i) => (
            <div className="flex items-center gap-2" key={v}>
              <RadioGroup.RadioGroupItem id={uid + v} value={v} />
              <Label htmlFor={uid + v}>{localize(i ? 'Compact' : 'Standard')}</Label>
            </div>
          )))}
        </RadioGroup.RadioGroup>
      );
    case 'resizable':
      return (
        <Resizable.ResizablePanelGroup
          orientation="horizontal"
          className="min-h-32 w-full rounded-lg border"
        >
          <Resizable.ResizablePanel defaultSize="50%">
            <div className="flex h-32 items-center justify-center">Left</div>
          </Resizable.ResizablePanel>
          <Resizable.ResizableHandle withHandle />
          <Resizable.ResizablePanel defaultSize="50%">
            <div className="flex h-32 items-center justify-center">Right</div>
          </Resizable.ResizablePanel>
        </Resizable.ResizablePanelGroup>
      );
    case 'scroll-area':
      return (
        <ScrollArea className="h-40 w-full rounded-lg border">
          <div className="space-y-3 p-4">
            {localize(Array.from({ length: 12 }, (_, i) => (
              <p key={i} className="border-b pb-2 text-sm">{translate(" 컴포넌트 항목 ")}{localize(i + 1)}
              </p>
            )))}
          </div>
        </ScrollArea>
      );
    case 'select':
      return (
        <Select.Select>
          <Select.SelectTrigger className="w-full" aria-label={translate("역할 선택")}>
            <Select.SelectValue placeholder={translate("역할을 선택하세요")} />
          </Select.SelectTrigger>
          <Select.SelectContent>
            <Select.SelectItem value="designer">{translate("디자이너")}</Select.SelectItem>
            <Select.SelectItem value="developer">{translate("개발자")}</Select.SelectItem>
            <Select.SelectItem value="pm">PM</Select.SelectItem>
          </Select.SelectContent>
        </Select.Select>
      );
    case 'separator':
      return (
        <div className="w-full space-y-4">
          <p className="text-sm">{translate("섹션 구분")}</p>
          <Separator />
          <div className="flex h-5 items-center gap-4 text-sm">
            <span>UI</span>
            <Separator orientation="vertical" />
            <span>UX</span>
            <Separator orientation="vertical" />
            <span>AI</span>
          </div>
        </div>
      );
    case 'sheet':
      return (
        <Sheet.Sheet>
          <Sheet.SheetTrigger asChild>
            <Button variant="outline">{translate("우측 패널 열기")}</Button>
          </Sheet.SheetTrigger>
          <Sheet.SheetContent>
            <Sheet.SheetHeader>
              <Sheet.SheetTitle>{translate("프로젝트 설정")}</Sheet.SheetTitle>
              <Sheet.SheetDescription>{translate(" 본문 위에 표시되는 사이드 패널입니다. ")}</Sheet.SheetDescription>
            </Sheet.SheetHeader>
            <div className="space-y-2 p-4">
              <Label htmlFor={uid}>{translate("프로젝트 이름")}</Label>
              <Input id={uid} defaultValue="A+studio" />
            </div>
          </Sheet.SheetContent>
        </Sheet.Sheet>
      );
    case 'sidebar':
      return (
        <Sidebar.SidebarProvider className="h-44 min-h-0 w-full">
          <Sidebar.Sidebar
            collapsible="none"
            className="w-full rounded-lg border"
          >
            <Sidebar.SidebarHeader>
              <strong>A+studio</strong>
            </Sidebar.SidebarHeader>
            <Sidebar.SidebarContent>
              <Sidebar.SidebarMenu>
                {localize(['대시보드', '프로젝트', '설정'].map((label, i) => (
                  <Sidebar.SidebarMenuItem key={label}>
                    <Sidebar.SidebarMenuButton
                      isActive={page === i + 1}
                      onClick={() => setPage(i + 1)}
                    >
                      <span>{localize(label)}</span>
                    </Sidebar.SidebarMenuButton>
                  </Sidebar.SidebarMenuItem>
                )))}
              </Sidebar.SidebarMenu>
            </Sidebar.SidebarContent>
          </Sidebar.Sidebar>
        </Sidebar.SidebarProvider>
      );
    case 'skeleton':
      return (
        <div className="flex w-full items-center gap-3">
          <Skeleton className="size-12 rounded-full" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
          </div>
        </div>
      );
    case 'slider':
      return (
        <div className="w-full space-y-4">
          <Label htmlFor={uid}>{translate("볼륨 · ")}{localize(value)}%</Label>
          <Slider
            id={uid}
            value={[value]}
            onValueChange={(v) => setValue(v[0])}
            max={100}
            step={1}
            aria-label={translate("볼륨")}
          />
        </div>
      );
    case 'spinner':
      return (
        <div className="flex items-center gap-3 text-muted-foreground">
          <Spinner />{translate(" 불러오는 중… ")}</div>
      );
    case 'switch':
      return (
        <div className="flex items-center gap-3">
          <Switch id={uid} checked={checked} onCheckedChange={setChecked} />
          <Label htmlFor={uid}>{translate("알림 ")}{localize(checked ? '켜짐' : '꺼짐')}</Label>
        </div>
      );
    case 'table':
      return <DemoTable />;
    case 'tabs':
      return (
        <Tabs.Tabs defaultValue="design" className="w-full">
          <Tabs.TabsList>
            <Tabs.TabsTrigger value="design">{translate("디자인")}</Tabs.TabsTrigger>
            <Tabs.TabsTrigger value="code">{translate("코드")}</Tabs.TabsTrigger>
          </Tabs.TabsList>
          <Tabs.TabsContent value="design" className="p-3 text-sm">{translate(" 토큰과 컴포넌트로 일관된 경험을 만듭니다. ")}</Tabs.TabsContent>
          <Tabs.TabsContent value="code" className="p-3 text-sm">{translate(" React + TypeScript로 구현합니다. ")}</Tabs.TabsContent>
        </Tabs.Tabs>
      );
    case 'textarea':
      return (
        <div className="w-full space-y-2">
          <Textarea
            placeholder={translate("프로젝트를 소개해 주세요")}
            aria-label={translate("프로젝트 소개")}
            value={text}
            maxLength={120}
            onChange={(e) => setText(e.target.value)}
          />
          <p className="text-right text-xs text-muted-foreground">
            {localize(text.length)}/120
          </p>
        </div>
      );
    case 'toast':
      return (
        <div className="flex flex-wrap justify-center gap-2">
          <Button
            variant="outline"
            onClick={() =>
              toast.success(translate('저장 완료'), {
                description: translate('작업 내용이 저장되었어요. (데모)'),
              })
            }
          >{translate(" 성공 알림 ")}</Button>
          <Button
            variant="outline"
            onClick={() =>
              toast.error(translate('저장 실패'), {
                description: translate('잠시 후 다시 시도해 주세요. (데모)'),
              })
            }
          >{translate(" 오류 알림 ")}</Button>
        </div>
      );
    case 'toggle':
      return (
        <Toggle
          aria-label={translate("즐겨찾기")}
          pressed={checked}
          onPressedChange={setChecked}
          variant="outline"
        >
          <Star />
          {localize(checked ? '선택됨' : '즐겨찾기')}
        </Toggle>
      );
    case 'toggle-group':
      return (
        <ToggleGroup.ToggleGroup
          type="single"
          defaultValue="left"
          variant="outline"
        >
          <ToggleGroup.ToggleGroupItem value="left" aria-label={translate("왼쪽 정렬")}>
            Left
          </ToggleGroup.ToggleGroupItem>
          <ToggleGroup.ToggleGroupItem value="center" aria-label={translate("가운데 정렬")}>
            Center
          </ToggleGroup.ToggleGroupItem>
          <ToggleGroup.ToggleGroupItem value="right" aria-label={translate("오른쪽 정렬")}>
            Right
          </ToggleGroup.ToggleGroupItem>
        </ToggleGroup.ToggleGroup>
      );
    case 'tooltip':
      return (
        <Tooltip.TooltipProvider delayDuration={100}>
          <Tooltip.Tooltip>
            <Tooltip.TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                aria-label={translate("다운로드 도움말")}
              >
                <Download />
              </Button>
            </Tooltip.TooltipTrigger>
            <Tooltip.TooltipContent>{translate("파일 다운로드")}</Tooltip.TooltipContent>
          </Tooltip.Tooltip>
        </Tooltip.TooltipProvider>
      );
    case 'trace':
      return (
        <Trace.Trace>
          <Trace.TraceLine>
            <Trace.TraceIcon>
              <Check />
            </Trace.TraceIcon>
            <Trace.TraceTitle>{translate("요청 분석 완료")}</Trace.TraceTitle>
            <Trace.TraceDescription>0.2s</Trace.TraceDescription>
          </Trace.TraceLine>
          <Trace.TraceCollapsible>
            <Trace.TraceCollapsibleTrigger>
              <Trace.TraceLine>
                <Trace.TraceIcon>
                  <Terminal />
                </Trace.TraceIcon>
                <Trace.TraceTitle>{translate("컴포넌트 검색")}</Trace.TraceTitle>
              </Trace.TraceLine>
            </Trace.TraceCollapsibleTrigger>
            <Trace.TraceCollapsibleContent>{translate(" Button, Input, Card를 찾았어요. ")}</Trace.TraceCollapsibleContent>
          </Trace.TraceCollapsible>
        </Trace.Trace>
      );
    case 'typography':
      return (
        <div className="w-full space-y-3">
          <h3 className="text-2xl font-bold tracking-tight">
            Design with intent.
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">{translate(" 작은 디테일을 연결해 명확한 사용자 경험을 만듭니다. ")}</p>
          <blockquote className="border-l-2 pl-3 text-sm">
            From idea to experience.
          </blockquote>
        </div>
      );
    default:
      return <p>{translate("등록되지 않은 컴포넌트입니다.")}</p>;
  }
}

function QuestionnaireDemo() {
  const [done, setDone] = useState(false);
  return done ? (
    <div className="space-y-3 text-center">
      <Check className="mx-auto text-primary" />
      <p>{translate("응답을 확인했어요.")}</p>
      <Button variant="outline" size="sm" onClick={() => setDone(false)}>{translate(" 다시 선택 ")}</Button>
    </div>
  ) : (
    <Questionnaire.Questionnaire
      onSubmit={(event) => {
        event.preventDefault();
        setDone(true);
      }}
    >
      <Questionnaire.QuestionnaireItem name="role" required>
        <Questionnaire.QuestionnaireTitle>{translate(" 어떤 역할인가요? ")}</Questionnaire.QuestionnaireTitle>
        <Questionnaire.QuestionnaireChoices>
          <Questionnaire.QuestionnaireChoice value="designer">{translate(" 디자이너 ")}</Questionnaire.QuestionnaireChoice>
          <Questionnaire.QuestionnaireChoice value="developer">{translate(" 개발자 ")}</Questionnaire.QuestionnaireChoice>
        </Questionnaire.QuestionnaireChoices>
        <Questionnaire.QuestionnaireError />
        <Questionnaire.QuestionnaireActions>
          <Questionnaire.QuestionnaireSubmit>{translate(" 완료 ")}</Questionnaire.QuestionnaireSubmit>
        </Questionnaire.QuestionnaireActions>
      </Questionnaire.QuestionnaireItem>
    </Questionnaire.Questionnaire>
  );
}
