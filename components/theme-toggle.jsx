"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";

export function ThemeToggle() {
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const currentTheme = document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";
    setTheme(currentTheme);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = (e) => {
      const stored = localStorage.getItem("theme");
      if (!stored) {
        const newTheme = e.matches ? "dark" : "light";
        setTheme(newTheme);
        document.documentElement.classList.toggle("dark", e.matches);
      }
    };

    mediaQuery.addEventListener("change", handleSystemChange);
    return () => mediaQuery.removeEventListener("change", handleSystemChange);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9">
        <span className="h-4 w-4" />
      </Button>
    );
  }

  const isDark = theme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="h-9 w-9 cursor-pointer relative overflow-hidden"
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={{ rotate: isDark ? -5 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{ overflow: "visible" }}
      >
        {/* SVG Mask for crescent cutout */}
        <defs>
          <mask id="moon-mask">
            {/* White = visible area */}
            <rect x="0" y="0" width="24" height="24" fill="white" />
            {/* Black circle = cutout area — animates position */}
            <motion.circle
              r="10"
              fill="black"
              animate={{
                cx: isDark ? 15 : 28,
                cy: isDark ? 9 : 0,
              }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            />
          </mask>
        </defs>

        {/* Main circle with mask applied — creates the crescent */}
        <motion.circle
          cx="12"
          cy="12"
          fill="currentColor"
          mask="url(#moon-mask)"
          animate={{
            r: isDark ? 8 : 5,
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />

        {/* Sun rays — fade in/out */}
        {[
          { x1: 12, y1: 1, x2: 12, y2: 3 },
          { x1: 4.22, y1: 4.22, x2: 5.64, y2: 5.64 },
          { x1: 1, y1: 12, x2: 3, y2: 12 },
          { x1: 4.22, y1: 19.78, x2: 5.64, y2: 18.36 },
          { x1: 12, y1: 21, x2: 12, y2: 23 },
          { x1: 18.36, y1: 18.36, x2: 19.78, y2: 19.78 },
          { x1: 21, y1: 12, x2: 23, y2: 12 },
          { x1: 18.36, y1: 5.64, x2: 19.78, y2: 4.22 },
        ].map((ray, i) => (
          <motion.line
            key={i}
            x1={ray.x1}
            y1={ray.y1}
            x2={ray.x2}
            y2={ray.y2}
            animate={{
              opacity: isDark ? 0 : 1,
              scale: isDark ? 0 : 1,
            }}
            transition={{
              duration: 0.3,
              delay: isDark ? 0 : i * 0.03,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.svg>
    </Button>
  );
}

