import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full items-center justify-between gap-2 rounded-md border-0 bg-white px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-all outline-none ring-[1px] ring-gray-200 focus:ring-primary focus:ring-[2px] disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-destructive data-[placeholder]:text-muted-foreground data-[size=default]:h-10 data-[size=sm]:h-8 hover:ring-primary/50 active:bg-primary/5 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

export { Input }
