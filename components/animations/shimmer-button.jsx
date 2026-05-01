"use client";

import React from "react";
import { cn } from "@/lib/utils";

export const ShimmerButton = ({
  className,
  children,
  onClick,
  disabled,
  containerClassName
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group relative flex h-10 w-full items-center justify-center overflow-hidden rounded-md p-[1px] shadow-sm outline-none transition-all focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50",
        // Idle Pulse effect
        "animate-pulse hover:animate-none",
        containerClassName
      )}
    >
      {/* Spinning gradient border */}
      <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#f97316_0%,#ec4899_50%,#f97316_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,#f97316_0%,#ec4899_50%,#f97316_100%)] opacity-70 group-hover:opacity-100 transition-opacity" />
      
      {/* Inner button background */}
      <div className={cn(
        "inline-flex h-full w-full items-center justify-center rounded-md bg-white dark:bg-background px-4 py-2 text-sm font-medium transition-colors z-10 backdrop-blur-3xl",
        "bg-gradient-to-br from-orange-500 hover:from-orange-600 to-pink-500 hover:to-pink-600 text-white",
        className
      )}>
        {children}
      </div>
    </button>
  );
};
