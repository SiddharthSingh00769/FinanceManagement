"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { forceSimulation, forceCollide, forceX, forceY, forceManyBody } from "d3-force";
import { motion } from "framer-motion";
import { defaultCategories } from "@/data/categories";
import * as Icons from "lucide-react";
import { formatCurrency } from "@/lib/currency";

export function ParticleGraph({ data }) {
  const containerRef = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const simulationRef = useRef(null);

  // Parse total to scale nodes
  const totalSpend = useMemo(() => data.reduce((acc, d) => acc + d.value, 0), [data]);

  // Handle Resize
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Initial dimensions
    const rect = containerRef.current.getBoundingClientRect();
    setDimensions({ width: rect.width, height: rect.height });

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Initialize Simulation
  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0 || data.length === 0) return;

    const maxVal = Math.max(...data.map((d) => d.value));
    const getRadius = (value) => {
      const minR = 35;
      const maxR = Math.min(80, dimensions.width / 5);
      return minR + Math.sqrt(value / maxVal) * (maxR - minR);
    };

    const initialNodes = data.map((d) => {
      const categoryData = defaultCategories.find((c) => c.id === d.name) || {};
      return {
        ...d,
        radius: getRadius(d.value),
        color: categoryData.color || "#8884d8",
        iconName: categoryData.icon || "Circle",
        percent: ((d.value / totalSpend) * 100).toFixed(1),
        x: dimensions.width / 2 + (Math.random() - 0.5) * 100, // Spawn near center
        y: dimensions.height / 2 + (Math.random() - 0.5) * 100,
      };
    });

    const sim = forceSimulation(initialNodes)
      .force("collide", forceCollide().radius((d) => d.radius + 4).iterations(3))
      .force("center_x", forceX(dimensions.width / 2).strength(0.06))
      .force("center_y", forceY(dimensions.height / 2).strength(0.06))
      .force("charge", forceManyBody().strength(10)) // Slight repulsion to prevent overlapping
      .on("tick", () => {
        setNodes([...sim.nodes()]);
      });

    simulationRef.current = sim;

    return () => sim.stop();
  }, [data, dimensions, totalSpend]);

  // Custom pointer events for dragging (avoids conflict with Framer Motion)
  const handlePointerDown = (e, node) => {
    e.preventDefault();
    if (!simulationRef.current) return;
    
    simulationRef.current.alphaTarget(0.3).restart();
    node.fx = node.x;
    node.fy = node.y;

    let lastX = e.clientX;
    let lastY = e.clientY;

    const onPointerMove = (eMove) => {
      node.fx += eMove.clientX - lastX;
      node.fy += eMove.clientY - lastY;
      lastX = eMove.clientX;
      lastY = eMove.clientY;
    };

    const onPointerUp = () => {
      node.fx = null;
      node.fy = null;
      simulationRef.current.alphaTarget(0);
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", onPointerUp);
    };

    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerup", onPointerUp);
  };

  if (data.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center text-muted-foreground">
        No expenses this month
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[350px] overflow-hidden rounded-xl bg-muted/10 cursor-crosshair"
    >
      {nodes.map((node, i) => {
        const IconComponent = Icons[node.iconName] || Icons.Circle;

        return (
          <motion.div
            key={node.name}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", delay: i * 0.05 }}
            onPointerDown={(e) => handlePointerDown(e, node)}
            className="absolute rounded-full flex flex-col items-center justify-center cursor-grab active:cursor-grabbing group shadow-md hover:shadow-xl hover:z-50 transition-shadow select-none touch-none"
            style={{
              width: node.radius * 2,
              height: node.radius * 2,
              backgroundColor: node.color,
              left: node.x - node.radius,
              top: node.y - node.radius,
            }}
          >
            <IconComponent className="text-white w-6 h-6 drop-shadow-md" />
            {node.radius > 45 && (
              <span className="text-white font-bold text-xs max-w-full px-2 mt-1 truncate drop-shadow-md text-center">
                {formatCurrency(node.value)}
              </span>
            )}

            {/* Hover Tooltip */}
            <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none -top-12 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs px-3 py-2 rounded-lg shadow-xl border whitespace-nowrap z-50">
              <div className="font-bold capitalize">{node.name.replace("-", " ")}</div>
              <div className="text-muted-foreground flex justify-between gap-3 mt-0.5">
                <span>{formatCurrency(node.value)}</span>
                <span className="font-semibold text-foreground">{node.percent}%</span>
              </div>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-popover border-b border-r rotate-45" />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
