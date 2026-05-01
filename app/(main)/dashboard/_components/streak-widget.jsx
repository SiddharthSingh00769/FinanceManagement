"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { getSpendingStreak } from "@/actions/streak";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Flame, Trophy, Medal } from "lucide-react";

export function StreakWidget() {
  const [streak, setStreak] = useState(null);
  const [longest, setLongest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStreak() {
      const result = await getSpendingStreak();
      if (result.success) {
        setStreak(result.data.currentStreak);
        setLongest(result.data.longestStreak);
      }
      setLoading(false);
    }
    fetchStreak();
  }, []);

  if (loading) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-6 flex items-center justify-center h-[140px]">
          <div className="animate-pulse flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-muted" />
            <div className="space-y-2">
              <div className="h-4 w-24 rounded bg-muted" />
              <div className="h-3 w-32 rounded bg-muted" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isOnFire = streak >= 3;
  const isLegendary = streak >= 7;

  // Flame intensity based on streak
  const flameColor = isLegendary
    ? "text-orange-400"
    : isOnFire
      ? "text-orange-500"
      : "text-muted-foreground";

  const bgGlow = isLegendary
    ? "from-orange-500/20 via-red-500/10 to-yellow-500/20"
    : isOnFire
      ? "from-orange-500/10 via-transparent to-transparent"
      : "";

  return (
    <motion.div
      whileHover={{ 
        scale: 1.02,
        rotateX: -1,
        rotateY: 3,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="h-full"
    >
      <Card className={cn(
        "glass-card neon-glow-orange border-white/20 h-full overflow-hidden relative",
        bgGlow && `bg-gradient-to-br ${bgGlow}`
      )}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {/* Left side: Flame + Streak count */}
            <div className="flex items-center gap-4">
              <div className="relative">
                {/* Animated flame icon */}
                <motion.div
                  animate={isOnFire ? {
                    scale: [1, 1.2, 1],
                    rotate: [0, -5, 5, 0],
                  } : {}}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    repeatType: "loop",
                  }}
                  className="relative z-10"
                >
                  <Flame
                    className={cn(
                      "h-10 w-10 transition-colors",
                      flameColor
                    )}
                    fill={isOnFire ? "currentColor" : "none"}
                  />
                </motion.div>

                {/* Fire glow behind the flame */}
                {isOnFire && (
                  <motion.div
                    className="absolute inset-0 rounded-full blur-2xl"
                    animate={{
                      opacity: [0.2, 0.5, 0.2],
                      scale: [1, 1.5, 1],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "loop",
                    }}
                    style={{
                      background: isLegendary
                        ? "radial-gradient(circle, rgba(251,146,60,0.6) 0%, transparent 70%)"
                        : "radial-gradient(circle, rgba(249,115,22,0.4) 0%, transparent 70%)",
                    }}
                  />
                )}
              </div>

              <div>
                <div className="flex items-baseline gap-2">
                  <span className={cn(
                    "text-4xl font-black tabular-nums tracking-tighter",
                    isLegendary ? "text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.5)]" : isOnFire ? "text-orange-500" : "text-foreground"
                  )}>
                    {streak}
                  </span>
                  <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                    {streak === 1 ? "day" : "days"}
                  </span>
                </div>
                <p className="text-xs font-medium text-muted-foreground/80 mt-1">
                  {streak === 0
                    ? "Start your streak today!"
                    : isLegendary
                      ? "Legendary status! 🔥"
                      : isOnFire
                        ? "You're on fire! Keep it up!"
                        : "Zero spend streak"
                  }
                </p>
              </div>
            </div>

            {/* Right side: Best streak */}
            <div className="text-right">
              <div className="flex items-center gap-1 justify-end text-muted-foreground/60 uppercase tracking-widest text-[10px] font-bold">
                <Trophy className="h-3 w-3" />
                <span>Best</span>
              </div>
              <p className={cn(
                "text-2xl font-black tabular-nums mt-0.5",
                longest >= 7 ? "text-amber-500 drop-shadow-[0_0_5px_rgba(245,158,11,0.3)]" : "text-foreground"
              )}>
                {longest}
              </p>
            </div>
          </div>

          {/* Bottom flame particles for legendary streaks */}
          {isLegendary && (
            <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{ backgroundSize: "200% 200%" }}
              />
            </div>
          )}

          {/* Trophy Case Section */}
          <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">Achievements</p>
            <div className="flex gap-2">
              <div className={cn("p-1.5 rounded-full transition-all duration-500", streak >= 3 ? "bg-amber-900/20 text-amber-600 border border-amber-600/30" : "bg-muted/10 text-muted-foreground/20")}>
                <Medal className="h-3 w-3" title="3 Day Streak: Bronze" />
              </div>
              <div className={cn("p-1.5 rounded-full transition-all duration-500", streak >= 7 ? "bg-slate-400/20 text-slate-400 border border-slate-400/30" : "bg-muted/10 text-muted-foreground/20")}>
                <Medal className="h-3 w-3" title="7 Day Streak: Silver" />
              </div>
              <div className={cn("p-1.5 rounded-full transition-all duration-500", streak >= 15 ? "bg-amber-400/20 text-amber-400 border border-amber-400/30" : "bg-muted/10 text-muted-foreground/20")}>
                <Trophy className="h-3 w-3" title="15 Day Streak: Gold" />
              </div>
              <div className={cn("p-1.5 rounded-full transition-all duration-500", streak >= 30 ? "bg-purple-500/20 text-purple-400 border border-purple-400/30 shadow-[0_0_10px_rgba(168,85,247,0.3)]" : "bg-muted/10 text-muted-foreground/20")}>
                <Trophy className="h-3 w-3 animate-pulse" title="30 Day Streak: Legend" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
