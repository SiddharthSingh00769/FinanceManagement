"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEEAD", "#D4A5A5", "#9FA8DA"];

export function Confetti() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage
      y: -20,
      size: Math.random() * 10 + 5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: Math.random() * 2,
      duration: Math.random() * 3 + 2,
      rotation: Math.random() * 360,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ 
              x: `${p.x}%`, 
              y: "-10vh", 
              rotate: 0,
              opacity: 1 
            }}
            animate={{ 
              y: "110vh", 
              rotate: p.rotation + 360,
              opacity: [1, 1, 0] 
            }}
            transition={{ 
              duration: p.duration, 
              delay: p.delay, 
              ease: "linear",
              repeat: 0
            }}
            style={{
              position: "absolute",
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
