"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, RotateCcw, TrendingUp, TrendingDown } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { createPortal } from "react-dom";
import { Confetti } from "@/components/animations/confetti";

export function MonthlyReplay({ transactions, onClose, timeRange }) {
  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [runningBalance, setRunningBalance] = useState(0);
  const [history, setHistory] = useState([]);
  const [impact, setImpact] = useState(false);
  const [vibe, setVibe] = useState("neutral"); // neutral, positive, negative
  const [showSummary, setShowSummary] = useState(false);
  const [totals, setTotals] = useState({ income: 0, expense: 0 });

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const timeRangeLabel = useMemo(() => {
    switch (timeRange) {
      case "this-month": return "This Month";
      case "1m": return "Last 1 Month";
      case "3m": return "Last 3 Months";
      case "6m": return "Last 6 Months";
      case "1y": return "Last 1 Year";
      case "all": return "All Time";
      default: return "Your History";
    }
  }, [timeRange]);

  const sortedTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [transactions]);

  const heroTransaction = useMemo(() => {
    return [...sortedTransactions].sort((a, b) => b.amount - a.amount).find(t => t.type === "INCOME");
  }, [sortedTransactions]);

  useEffect(() => {
    if (isPlaying && currentIndex < sortedTransactions.length - 1) {
      const timer = setTimeout(() => {
        const nextIndex = currentIndex + 1;
        const t = sortedTransactions[nextIndex];
        const amount = parseFloat(t.amount);
        
        setRunningBalance(prev => t.type === "INCOME" ? prev + amount : prev - amount);
        setTotals(prev => ({
          income: t.type === "INCOME" ? prev.income + amount : prev.income,
          expense: t.type === "EXPENSE" ? prev.expense + amount : prev.expense,
        }));
        setHistory(prev => [...prev, t]);
        setCurrentIndex(nextIndex);
        
        // Trigger impact for large transactions (> 500)
        if (amount > 500) {
          setImpact(true);
          setTimeout(() => setImpact(false), 200);
        }

        // Change vibe
        setVibe(t.type === "INCOME" ? "positive" : "negative");
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isPlaying && currentIndex === sortedTransactions.length - 1) {
      setTimeout(() => {
        setIsPlaying(false);
        setShowSummary(true);
        setVibe("neutral");
      }, 1000);
    }
  }, [isPlaying, currentIndex, sortedTransactions]);

  const startReplay = () => {
    setCurrentIndex(-1);
    setRunningBalance(0);
    setHistory([]);
    setTotals({ income: 0, expense: 0 });
    setIsPlaying(true);
    setShowSummary(false);
    setVibe("neutral");
  };

  const auraComments = [
    "Analyzing your path...",
    "Looking good so far!",
    "Ouch, that one hurt a bit.",
    "Big moves only!",
    "Wealth is a journey, not a destination.",
    "Nice influx of cash!",
    "Careful with the splurging...",
    "You're a financial wizard!",
  ];

  const netSavings = totals.income - totals.expense;

  if (!mounted) return null;

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: 1,
        backgroundColor: vibe === "positive" ? "rgba(6, 78, 59, 0.9)" : vibe === "negative" ? "rgba(69, 10, 10, 0.9)" : "rgba(0, 0, 0, 0.95)",
        x: impact ? [0, -10, 10, -10, 0] : 0
      }}
      transition={{ backgroundColor: { duration: 0.5 } }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-10 backdrop-blur-3xl overflow-hidden"
    >
      {showSummary && netSavings > 0 && <Confetti />}

      {/* Background Particles Decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-[150px] animate-pulse" />
         <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-[150px] animate-pulse delay-700" />
      </div>

      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-6 right-6 text-white/50 hover:text-white z-[1010]"
        onClick={onClose}
      >
        <X className="h-6 w-6" />
      </Button>

      <div className="w-full max-w-5xl relative z-10">
        <AnimatePresence mode="wait">
          {!showSummary ? (
            <motion.div 
              key="player"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center"
            >
              {/* Left: Stats & Controls */}
              <div className="space-y-8 text-center md:text-left">
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="space-y-2"
                >
                  <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase italic leading-none">
                    {timeRangeLabel} <br/> <span className="text-blue-500 underline decoration-blue-500/30">In Motion</span>
                  </h2>
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <div className="h-1 w-12 bg-blue-500 rounded-full" />
                    <p className="text-blue-200 text-xs font-bold uppercase tracking-[0.2em]">Cinematic Replay</p>
                  </div>
                </motion.div>

                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-blue-400">Running Balance</p>
                  <motion.div 
                    key={runningBalance}
                    initial={{ scale: 0.9, opacity: 0, y: 10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    className={cn(
                      "text-6xl md:text-8xl font-black tracking-tighter text-white tabular-nums drop-shadow-2xl",
                      impact && "scale-110 text-blue-300"
                    )}
                  >
                    {formatCurrency(runningBalance)}
                  </motion.div>
                </div>

                <div className="h-12 flex items-center justify-center md:justify-start">
                  <AnimatePresence mode="wait">
                    {isPlaying && (
                      <motion.p 
                        key={currentIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-sm italic font-medium text-blue-200/80"
                      >
                        &ldquo;{auraComments[currentIndex % auraComments.length]}&rdquo;
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <Button 
                    size="lg" 
                    onClick={startReplay}
                    disabled={isPlaying}
                    className="rounded-full bg-blue-600 hover:bg-blue-700 h-14 px-8 text-lg font-bold shadow-xl shadow-blue-600/40 group overflow-hidden relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                    {currentIndex === -1 ? <Play className="mr-2 h-5 w-5 fill-current" /> : <RotateCcw className="mr-2 h-5 w-5" />}
                    {currentIndex === -1 ? "Start Replay" : "Re-Watch"}
                  </Button>
                </div>
              </div>

              {/* Right: Visualizer */}
              <Card className="glass-card border-white/20 h-[550px] relative overflow-hidden flex flex-col p-6 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />
                
                <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar relative z-10">
                  <AnimatePresence mode="popLayout">
                    {history.slice(-6).map((t, i) => (
                      <motion.div
                        key={t.id}
                        initial={{ opacity: 0, x: 50, scale: 0.8, rotate: 2 }}
                        animate={{ 
                          opacity: 1 - (history.slice(-6).length - 1 - i) * 0.15, 
                          x: 0, 
                          scale: 1,
                          rotate: 0 
                        }}
                        className={cn(
                          "p-5 rounded-3xl flex items-center justify-between border shadow-lg transition-colors relative",
                          t.type === "INCOME" ? "bg-green-500/20 border-green-500/30" : "bg-red-500/20 border-red-500/30",
                          t.id === heroTransaction?.id && "border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.2)]"
                        )}
                      >
                        {t.id === heroTransaction?.id && (
                          <div className="absolute -top-2 -left-2 bg-yellow-500 text-black text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter z-20">
                            Hero Influx
                          </div>
                        )}
                        <div className="flex items-center gap-4">
                          <motion.div 
                            animate={t.type === "INCOME" ? { scale: [1, 1.2, 1] } : {}}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className={cn("p-3 rounded-2xl", t.type === "INCOME" ? "bg-green-500/30 text-green-300" : "bg-red-500/30 text-red-300")}
                          >
                            {t.type === "INCOME" ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                          </motion.div>
                          <div className="text-left">
                            <p className="text-base font-black text-white leading-tight">{t.description || t.category}</p>
                            <p className="text-[10px] text-white/50 uppercase font-black tracking-widest">{new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={cn("text-lg font-black tracking-tighter", t.type === "INCOME" ? "text-green-300" : "text-red-300")}>
                            {t.type === "INCOME" ? "+" : "-"}{formatCurrency(t.amount)}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {currentIndex === -1 && !isPlaying && (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                      <div className="relative">
                        <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 animate-pulse" />
                        <div className="h-24 w-24 rounded-full bg-blue-500/10 flex items-center justify-center border-2 border-blue-500/20 relative z-10">
                          <Play className="h-10 w-10 text-blue-400 fill-current" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xl font-bold text-white uppercase italic tracking-tighter">Ready for Action?</p>
                        <p className="text-sm text-muted-foreground font-medium max-w-[250px]">
                          Experience your finances like never before. Grab some popcorn.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Progress Bar at bottom */}
                <div className="mt-6 pt-6 border-t border-white/10 flex flex-col gap-3">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Progress</span>
                    <span className="text-[10px] font-black text-white tabular-nums">
                      {Math.max(0, currentIndex + 1)} / {sortedTransactions.length}
                    </span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)]"
                      animate={{ width: `${((currentIndex + 1) / sortedTransactions.length) * 100}%` }}
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          ) : (
            <motion.div 
              key="summary"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto space-y-10 text-center"
            >
              <div className="space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="mx-auto h-20 w-20 rounded-full bg-yellow-500 flex items-center justify-center shadow-[0_0_30px_rgba(234,179,8,0.4)]"
                >
                  <TrendingUp className="h-10 w-10 text-black" />
                </motion.div>
                <h3 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase italic">
                  Replay <span className="text-blue-500">Complete</span>
                </h3>
                <p className="text-blue-200/60 font-medium italic">
                  &ldquo;{netSavings > 0 ? "You're building an empire. Keep this momentum!" : "A tough period, but your resilience is your greatest asset."}&rdquo;
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: "Total Influx", value: totals.income, color: "text-green-400" },
                  { label: "Total Outflux", value: totals.expense, color: "text-red-400" },
                  { label: "Net Difference", value: netSavings, color: netSavings > 0 ? "text-blue-400" : "text-white" }
                ].map((stat, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="glass-card p-6 border-white/10 rounded-3xl"
                  >
                    <p className="text-[10px] uppercase font-black tracking-widest text-white/40 mb-2">{stat.label}</p>
                    <p className={cn("text-2xl font-black tracking-tighter", stat.color)}>
                      {stat.value >= 0 ? "" : "-"}{formatCurrency(Math.abs(stat.value))}
                    </p>
                  </motion.div>
                ))}
              </div>

              <Button 
                size="lg" 
                onClick={startReplay}
                className="rounded-full bg-white text-black hover:bg-white/90 h-16 px-12 text-xl font-black italic uppercase"
              >
                Re-Watch Journey
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>,
    document.body
  );
}
