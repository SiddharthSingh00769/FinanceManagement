"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function Template({ children }) {
  const shouldReduceMotion = useReducedMotion();

  const variants = {
    hidden: { 
        opacity: 0, 
        scale: shouldReduceMotion ? 1 : 0.98, 
        y: shouldReduceMotion ? 0 : 10 
    },
    enter: { 
        opacity: 1, 
        scale: 1, 
        y: 0 
    },
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="enter"
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} // Custom spring-like easing
      className="h-full w-full"
    >
      {children}
    </motion.div>
  );
}
