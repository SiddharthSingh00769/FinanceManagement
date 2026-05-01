"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/60 backdrop-blur-xl">
      <div className="relative">
        {/* Pulsing Aura Rings */}
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 rounded-full bg-blue-500 blur-2xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.2, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.2,
          }}
          className="absolute inset-0 rounded-full bg-indigo-500 blur-xl"
        />
        
        {/* Central Spinning Core */}
        <div className="relative h-20 w-20 flex items-center justify-center rounded-full border-2 border-white/10 bg-black/40 backdrop-blur-md">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Loader2 className="h-10 w-10 text-blue-400" />
          </motion.div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center space-y-2"
      >
        <h2 className="text-xl font-black uppercase italic tracking-tighter text-white">
          Accessing <span className="text-blue-500">Aura Vault</span>
        </h2>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">
          Decrypting financial records...
        </p>
      </motion.div>
    </div>
  );
}
