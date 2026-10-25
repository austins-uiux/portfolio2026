// Adapted from shadcn/ui (MIT). See vendor/shadcn/LICENSE.md.
import { Loader2Icon } from "lucide-react"
import { cn } from "@/lib/shadcn-utils"


function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <Loader2Icon
      data-slot="spinner"
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  )
}

export { Spinner }
