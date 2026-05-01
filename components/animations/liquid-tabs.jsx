"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function LiquidTabs({ tabs, activeTab, onTabChange }) {
  return (
    <div className="flex space-x-1 bg-muted/50 p-1 rounded-xl w-fit border shadow-inner">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "relative px-5 py-2 text-sm font-medium rounded-lg transition-colors outline-none cursor-pointer text-center min-w-[90px]",
              isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground/80"
            )}
            style={{
              WebkitTapHighlightColor: "transparent",
            }}
          >
            {isActive && (
              <motion.div
                layoutId="liquid-tab-indicator"
                className="absolute inset-0 bg-background rounded-lg shadow-sm border border-border/50"
                transition={{
                  type: "spring",
                  bounce: 0.25,
                  stiffness: 150,
                  damping: 15,
                  mass: 0.8
                }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
