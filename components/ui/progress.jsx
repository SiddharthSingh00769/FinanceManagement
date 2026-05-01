"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { motion, useReducedMotion } from "framer-motion"

import { cn } from "@/lib/utils"

function Progress({
  className,
  value,
  ...props
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    (<ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className
      )}
      {...props}>
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        asChild
      >
        <motion.div
            className="bg-primary h-full w-full flex-1"
            initial={{ x: shouldReduceMotion ? `-${100 - (value || 0)}%` : "-100%" }}
            animate={{ x: `-${100 - (value || 0)}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </ProgressPrimitive.Indicator>
    </ProgressPrimitive.Root>)
  );
}

export { Progress }
