// Adapted from Magic UI (MIT). See vendor/magicui/LICENSE.md.
"use client"

import { motion, useScroll, type MotionProps } from "motion/react"

import { cn } from "@/lib/shadcn-utils"

interface ScrollProgressProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  keyof MotionProps
> {
  scrollContainer?: React.RefObject<HTMLElement | null>
  ref?: React.Ref<HTMLDivElement>
}

export function ScrollProgress({
  className,
  scrollContainer,
  ref,
  ...props
}: ScrollProgressProps) {
  const { scrollYProgress } = useScroll({ container: scrollContainer })

  return (
    <motion.div
      ref={ref}
      className={cn(
        "fixed inset-x-0 top-0 z-50 h-px origin-left bg-linear-to-r from-[#A97CF8] via-[#F38CB8] to-[#FDCC92]",
        className
      )}
      style={{
        scaleX: scrollYProgress,
      }}
      {...props}
    />
  )
}
