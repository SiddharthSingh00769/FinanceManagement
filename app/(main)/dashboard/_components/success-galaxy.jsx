"use client";

import { useEffect, useRef, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function SuccessGalaxy({ transactions = [], accounts = [] }) {
  const canvasRef = useRef(null);
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

  const isDark = theme === "dark";

  // Mock milestones for visualization
  const milestones = useMemo(() => {
    const list = [
      { id: 1, name: "The First Step", achieved: transactions.length > 0, x: 20, y: 30 },
      { id: 2, name: "Diversity", achieved: accounts.length > 1, x: 40, y: 20 },
      { id: 3, name: "Momentum", achieved: transactions.length > 5, x: 60, y: 40 },
      { id: 4, name: "Planner", achieved: transactions.length > 10, x: 80, y: 30 },
      { id: 5, name: "Wealth Builder", achieved: accounts.some(a => a.balance > 1000), x: 50, y: 70 },
      { id: 6, name: "Guardian", achieved: accounts.length > 2, x: 30, y: 60 },
    ];
    return list;
  }, [transactions, accounts]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resize);
    resize();

    // Star particles for background
    const particles = Array.from({ length: 150 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.2 + 0.5,
      speed: Math.random() * 0.2 + 0.05,
      opacity: Math.random()
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Colors based on theme
      const starColor = isDark ? "255, 255, 255" : "59, 130, 246";
      const lineColor = isDark ? "rgba(59, 130, 246, 0.2)" : "rgba(37, 99, 235, 0.15)";
      const starFill = isDark ? "#60a5fa" : "#2563eb";
      const starGlow = isDark ? "#3b82f6" : "#3b82f6";

      // 1. Draw static background particles
      particles.forEach(p => {
        p.y -= p.speed;
        if (p.y < 0) p.y = canvas.height;
        
        ctx.fillStyle = `rgba(${starColor}, ${Math.abs(Math.sin(Date.now() * 0.001 + p.x)) * (isDark ? 0.4 : 0.2)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Draw Constellation Lines (Connecting achieved milestones)
      const achievedPoints = milestones.filter(m => m.achieved);
      if (achievedPoints.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = isDark ? 1 : 1.5;
        achievedPoints.forEach((m, i) => {
          const x = (m.x / 100) * canvas.width;
          const y = (m.y / 100) * canvas.height;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();
      }

      // 3. Draw Milestone Stars
      milestones.forEach(m => {
        const x = (m.x / 100) * canvas.width;
        const y = (m.y / 100) * canvas.height;

        if (m.achieved) {
          // Achieved: Glowing Star
          const glow = Math.abs(Math.sin(Date.now() * 0.002)) * 8 + 4;
          ctx.shadowBlur = isDark ? glow : 0;
          ctx.shadowColor = starGlow;
          ctx.fillStyle = starFill;
          ctx.beginPath();
          ctx.arc(x, y, isDark ? 4 : 5, 0, Math.PI * 2);
          ctx.fill();
          
          // Outer ring
          ctx.strokeStyle = isDark ? "rgba(96, 165, 250, 0.3)" : "rgba(37, 99, 235, 0.2)";
          ctx.beginPath();
          ctx.arc(x, y, glow + 2, 0, Math.PI * 2);
          ctx.stroke();
          
          ctx.shadowBlur = 0;
        } else {
          // Unachieved: Dim Hollow Circle
          ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)";
          ctx.beginPath();
          ctx.arc(x, y, 2.5, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [milestones, isDark]);

  return (
    <div className={cn(
      "fixed inset-0 pointer-events-none z-0 overflow-hidden transition-colors duration-1000",
      isDark ? "bg-[#020617]" : "bg-slate-50"
    )}>
      <canvas ref={canvasRef} className={cn("transition-opacity duration-1000", isDark ? "opacity-60" : "opacity-40")} />
      <div className={cn(
        "absolute inset-0 pointer-events-none transition-opacity duration-1000",
        isDark ? "bg-gradient-to-b from-transparent via-blue-950/10 to-black/80" : "bg-gradient-to-b from-blue-50/5 via-transparent to-slate-200/50"
      )} />
      
      {/* Legend in the corner */}
      <div className="absolute bottom-6 left-6 flex flex-col gap-1">
         <p className={cn("text-[10px] font-black uppercase tracking-[0.3em]", isDark ? "text-white/30" : "text-slate-900/20")}>Galaxy of Success</p>
         <div className="flex items-center gap-2">
            <div className={cn("h-1 w-8 rounded-full", isDark ? "bg-blue-500" : "bg-blue-600")} />
            <p className={cn("text-[8px] font-bold uppercase tracking-widest", isDark ? "text-blue-400" : "text-blue-600")}>
              {milestones.filter(m => m.achieved).length} / {milestones.length} Constellations Formed
            </p>
         </div>
      </div>
    </div>
  );
}
