"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { Meteors } from "@/components/animations/meteors";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const HeroSection = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className="pb-20 px-4 relative overflow-hidden">
      <Meteors number={30} />
      <div className="container mx-auto text-center relative z-10">
        <h1 className="text-5xl md:text-8xl lg:text-[105px] bg-gradient-to-br from-blue-700 to-green-600 font-extrabold tracking-tighter pr-2 pb-2 text-transparent bg-clip-text animate-gradient">
            Manage Your Finances <br/> with Intelligence
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            An AI-powered financial management platform that helps you track, analyze, and optimize your spending with real time insights.
        </p>
        <div className="flex justify-center space-x-4">
            <Link href="/dashboard">
                <Button size="lg" className="px-8">Get Started</Button>
            </Link>
        </div>
        <div className="mt-16 flex justify-center perspective-[2000px]">
            <motion.div 
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d"
              }}
              className="relative rounded-lg shadow-2xl border mx-auto transition-all hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)]"
            >
                <Image src='/banner3.png' width={1280} height={720} alt="Dashboard Preview" priority className="rounded-lg"/>
            </motion.div>
        </div>
      </div>
    </div>
  )
}

export default HeroSection
