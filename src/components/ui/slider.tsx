"use client"

import * as React from "react"
// import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

// Componente temporário até resolver o problema do build
const Slider = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <div className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
      <div className="absolute h-full bg-primary w-1/2" />
    </div>
    <div className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
  </div>
))
Slider.displayName = "Slider"

export { Slider }