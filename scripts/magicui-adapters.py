"""Bounded adaptations for the Vite gallery. Original sources remain in registry/."""
def adapt(name,source):
    if name=='code-comparison':
        source=source.replace('import("shiki")','import("@/lib/magic-highlighter")').replace('from "next-themes"','from "@/components/interaction/InteractionTheme"')
    if name=='scroll-progress':
        source=source.replace('  ref?: React.Ref<HTMLDivElement>', '  scrollContainer?: React.RefObject<HTMLElement | null>\n  ref?: React.Ref<HTMLDivElement>')
        source=source.replace('  className,\n  ref,', '  className,\n  scrollContainer,\n  ref,').replace('const { scrollYProgress } = useScroll()', 'const { scrollYProgress } = useScroll({ container: scrollContainer })')
    if name=='text-reveal':
        source=source.replace('  children: string\n}', '  children: string\n  scrollContainer?: React.RefObject<HTMLElement | null>\n}')
        source=source.replace('({ children, className })', '({ children, className, scrollContainer })').replace('    target: sectionRef,', '    target: sectionRef,\n    container: scrollContainer,')
    if name=='hero-video-dialog':
        source=source.replace('import { useState } from "react"', 'import { useCallback, useRef, useState } from "react"\nimport { useDialog } from "@/hooks/useDialog"')
        source=source.replace('  const selectedAnimation = animationVariants[animationStyle]', '  const selectedAnimation = animationVariants[animationStyle]\n  const panel = useRef<HTMLDivElement>(null)\n  const close = useCallback(() => setIsVideoOpen(false), [])\n  useDialog(isVideoOpen, panel, close)')
        source=source.replace('role="button"\n            tabIndex={0}', 'ref={panel} role="dialog" aria-modal="true" aria-label="데모 영상"\n            tabIndex={-1}')
        source=source.replace('<motion.button className=', '<motion.button type="button" aria-label="영상 닫기" className=')
    return source
