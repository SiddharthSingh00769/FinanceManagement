"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import { formatCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";

export function SpendingStrand({ transactions }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const springScroll = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const rotate = useTransform(springScroll, [0, 1], [0, 720]); // Double helix twist

  if (!transactions || transactions.length === 0) return null;

  // Limit to most recent 15 for visual clarity
  const recentTransactions = transactions.slice(0, 15);

  return (
    <div ref={containerRef} className="relative py-10 min-h-[600px] flex flex-col items-center">
      {/* The Central "Backbone" of the DNA */}
      <div className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/20 via-purple-500/50 to-blue-500/20 left-1/2 -translate-x-1/2" />

      <div className="w-full max-w-md space-y-12">
        {recentTransactions.map((t, i) => {
          const isEven = i % 2 === 0;
          const amount = parseFloat(t.amount);
          // Scale size based on amount (logarithmic for better distribution)
          const size = Math.min(Math.max(Math.log10(amount + 1) * 20, 10), 60);
          
          return (
            <div key={t.id} className="relative flex items-center justify-center w-full">
              {/* The "Link" to the backbone */}
              <motion.div
                style={{ rotateY: rotate }}
                className={cn(
                  "absolute h-px bg-white/20 z-0",
                  isEven ? "left-1/2 right-[calc(50%-100px)]" : "right-1/2 left-[calc(50%-100px)]"
                )}
              />

              <motion.div
                initial={{ opacity: 0, scale: 0, x: isEven ? 50 : -50 }}
                whileInView={{ opacity: 1, scale: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, type: "spring" }}
                className={cn(
                  "relative z-10 flex items-center gap-4 w-full",
                  isEven ? "flex-row-reverse text-right pl-[50%]" : "flex-row pr-[50%]"
                )}
              >
                {/* The Node (Nucleotide) */}
                <motion.div
                  whileHover={{ scale: 1.2, z: 50 }}
                  className={cn(
                    "rounded-full flex items-center justify-center shrink-0 shadow-lg border",
                    t.type === "EXPENSE" 
                      ? "bg-red-500/20 border-red-500/50 text-red-400" 
                      : "bg-green-500/20 border-green-500/50 text-green-400"
                  )}
                  style={{ 
                    width: size, 
                    height: size,
                    boxShadow: t.type === "EXPENSE" 
                      ? `0 0 20px rgba(239, 68, 68, 0.2)` 
                      : `0 0 20px rgba(34, 197, 94, 0.2)`
                  }}
                >
                  <span className="text-[10px] font-black uppercase">
                    {t.category?.slice(0, 2)}
                  </span>
                </motion.div>

                {/* The Info */}
                <div className="flex flex-col">
                  <span className="text-xs font-black tracking-tighter text-white">
                    {formatCurrency(amount)}
                  </span>
                  <span className="text-[10px] font-medium text-muted-foreground truncate max-w-[120px]">
                    {t.description || t.category}
                  </span>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
      
      {/* Decorative End Node */}
      <div className="mt-8 h-4 w-4 rounded-full bg-purple-500/50 blur-sm animate-pulse" />
    </div>
  );
}
