"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Compass, Moon, Sun, Anchor, Wind } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const WISDOMS = [
  {
    title: "The Seed",
    mantra: "Every grand oak was once a small seed. Your smallest save today is your forest tomorrow.",
    icon: Sparkles,
    color: "from-amber-500/20 to-orange-500/20",
    border: "border-amber-500/30",
    text: "text-amber-200"
  },
  {
    title: "The Horizon",
    mantra: "Don't look at the waves; look at the horizon. Your long-term vision is your true north.",
    icon: Compass,
    color: "from-blue-500/20 to-cyan-500/20",
    border: "border-blue-500/30",
    text: "text-blue-200"
  },
  {
    title: "The Quiet Moon",
    mantra: "In the silence of not spending, you hear the music of your future freedom.",
    icon: Moon,
    color: "from-purple-500/20 to-indigo-500/20",
    border: "border-purple-500/30",
    text: "text-purple-200"
  },
  {
    title: "The Rising Sun",
    mantra: "Each dawn is a fresh ledger. Yesterday's expenses are history; today's choices are yours.",
    icon: Sun,
    color: "from-yellow-500/20 to-red-500/20",
    border: "border-yellow-500/30",
    text: "text-yellow-200"
  },
  {
    title: "The Anchor",
    mantra: "Stability is not found in more, but in knowing what is enough.",
    icon: Anchor,
    color: "from-emerald-500/20 to-teal-500/20",
    border: "border-emerald-500/30",
    text: "text-emerald-200"
  },
  {
    title: "The Flow",
    mantra: "Wealth flows where it is respected. Treat every coin like a trusted messenger.",
    icon: Wind,
    color: "from-slate-500/20 to-blue-500/20",
    border: "border-slate-500/30",
    text: "text-slate-200"
  }
];

export function DailyWisdom() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [wisdom, setWisdom] = useState(null);
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const checkTheme = () => {
      setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
    };
    checkTheme();
    
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Pick a wisdom based on the date so it's the same for the whole day
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    setWisdom(WISDOMS[dayOfYear % WISDOMS.length]);
  }, []);

  if (!wisdom) return null;

  const isDark = theme === "dark";
  const Icon = wisdom.icon;

  return (
    <div className="perspective-1000 w-full h-full cursor-pointer group" onClick={() => setIsFlipped(!isFlipped)}>
      <motion.div
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 260, damping: 20 }}
        className="relative w-full h-full preserve-3d"
      >
        {/* Front (Back of card) */}
        <div className="absolute inset-0 backface-hidden">
          <Card className={cn(
            "w-full h-full glass-card flex flex-col items-center justify-center p-6 gap-6 overflow-hidden relative transition-colors duration-1000",
            isDark 
              ? "border-white/10 bg-gradient-to-br from-indigo-950/40 via-black/40 to-blue-950/40" 
              : "border-blue-500/10 bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/80"
          )}>
             {/* Tarot Pattern */}
             <div className={cn("absolute inset-0 pointer-events-none grid grid-cols-4 gap-4 p-4", isDark ? "opacity-10" : "opacity-5")}>
                {Array.from({ length: 16 }).map((_, i) => (
                  <Sparkles key={i} className="w-full h-full" />
                ))}
             </div>
             
             <div className="relative">
                <div className={cn("absolute inset-0 blur-3xl opacity-20 animate-pulse", isDark ? "bg-blue-500" : "bg-blue-600")} />
                <div className={cn(
                  "h-20 w-20 rounded-full border-2 flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform duration-500",
                  isDark ? "border-white/10" : "border-blue-500/10"
                )}>
                   <Moon className={cn("h-8 w-8 animate-pulse", isDark ? "text-blue-200" : "text-blue-600")} />
                </div>
             </div>

             <div className="text-center space-y-2 relative z-10">
                <h3 className={cn("text-sm font-black uppercase tracking-[0.4em]", isDark ? "text-white/50" : "text-blue-900/40")}>Daily Wisdom</h3>
                <p className={cn("text-[10px] font-bold uppercase tracking-widest animate-pulse", isDark ? "text-blue-400" : "text-blue-600")}>Tap to Reveal</p>
             </div>
          </Card>
        </div>

        {/* Back (Face of card) */}
        <div className="absolute inset-0 backface-hidden rotate-y-180">
          <Card className={cn(
            "w-full h-full glass-card flex flex-col items-center justify-center p-8 gap-6 border-2 transition-all duration-1000",
            isDark ? wisdom.border : "border-blue-500/20 shadow-xl",
            isDark ? `bg-gradient-to-br ${wisdom.color}` : "bg-white"
          )}>
             <motion.div
               initial={{ scale: 0 }}
               animate={{ scale: isFlipped ? 1 : 0 }}
               transition={{ delay: 0.3 }}
               className="relative"
             >
                <div className={cn("absolute inset-0 blur-2xl opacity-40", isDark ? wisdom.text : "text-blue-500")} />
                <Icon className={cn("h-16 w-16 relative z-10", isDark ? wisdom.text : "text-blue-600")} />
             </motion.div>

             <div className="text-center space-y-4">
                <motion.h4 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: isFlipped ? 1 : 0, y: isFlipped ? 0 : 10 }}
                  transition={{ delay: 0.5 }}
                  className={cn("text-xl font-black uppercase tracking-[0.2em] italic", isDark ? wisdom.text : "text-blue-900")}
                >
                  {wisdom.title}
                </motion.h4>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isFlipped ? 1 : 0 }}
                  transition={{ delay: 0.7 }}
                  className={cn("text-sm font-medium leading-relaxed italic max-w-[220px] mx-auto", isDark ? "text-white/80" : "text-slate-600")}
                >
                  &ldquo;{wisdom.mantra}&rdquo;
                </motion.p>
             </div>

             <div className="absolute bottom-4 left-0 right-0 text-center">
                <p className={cn("text-[8px] font-black uppercase tracking-[0.3em]", isDark ? "text-white/20" : "text-blue-900/10")}>Aura Oracle</p>
             </div>
          </Card>
        </div>
      </motion.div>

      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}
