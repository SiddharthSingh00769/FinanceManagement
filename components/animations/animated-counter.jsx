"use client";

import { motion, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { useEffect } from "react";
import { formatCurrency } from "@/lib/currency";

export function AnimatedCounter({ targetValue }) {
  const shouldReduceMotion = useReducedMotion();

  // We use a spring to smoothly transition to the target value
  const springValue = useSpring(0, {
    stiffness: 60,
    damping: 15,
    restDelta: 0.01,
  });

  useEffect(() => {
    springValue.set(targetValue);
  }, [springValue, targetValue]);

  // Transform the raw number into a formatted currency string
  const displayValue = useTransform(springValue, (current) =>
    formatCurrency(current)
  );

  // If prefers-reduced-motion is enabled, just render the static value
  if (shouldReduceMotion) {
    return <span>{formatCurrency(targetValue)}</span>;
  }

  return <motion.span>{displayValue}</motion.span>;
}
