"use client";

import { motion, useReducedMotion } from "framer-motion";
import React from "react";

export function AnimatedGrid({ children, className }) {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
      },
    },
  };



  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedGridItem({ children, className }) {
  const shouldReduceMotion = useReducedMotion();

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    show: { 
        opacity: 1, 
        y: 0, 
        transition: { type: "spring", stiffness: 250, damping: 25 } 
    },
  };

  return <motion.div variants={itemVariants} className={className}>{children}</motion.div>;
}
