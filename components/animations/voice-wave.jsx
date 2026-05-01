"use client";

import { useEffect, useRef } from "react";

export function VoiceWave({ isRecording }) {
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    if (isRecording) {
      startVisualizer();
    } else {
      stopVisualizer();
    }

    return () => stopVisualizer();
  }, [isRecording]);

  const startVisualizer = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);

      draw();
    } catch (err) {
      console.error("Error accessing microphone for visualizer:", err);
    }
  };

  const stopVisualizer = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
  };

  const draw = () => {
    if (!canvasRef.current || !analyserRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      animationFrameRef.current = requestAnimationFrame(render);
      analyserRef.current.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const bars = 40;
      const barWidth = 3;
      const radius = 20;

      for (let i = 0; i < bars; i++) {
        const angle = (i * Math.PI * 2) / bars;
        const amplitude = dataArray[i % bufferLength] / 255;
        const barHeight = 10 + amplitude * 40;

        const x1 = centerX + Math.cos(angle) * radius;
        const y1 = centerY + Math.sin(angle) * radius;
        const x2 = centerX + Math.cos(angle) * (radius + barHeight);
        const y2 = centerY + Math.sin(angle) * (radius + barHeight);

        const hue = (i * 360) / bars;
        ctx.strokeStyle = `hsla(${hue}, 80%, 60%, 0.8)`;
        ctx.lineWidth = barWidth;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      
      // Add a soft center glow
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius - 5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(59, 130, 246, 0.2)";
      ctx.fill();
    };

    render();
  };

  if (!isRecording) return null;

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-muted/30 rounded-2xl border border-blue-500/20 backdrop-blur-sm">
      <canvas 
        ref={canvasRef} 
        width={200} 
        height={100} 
        className="w-full h-[100px]"
      />
      <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-blue-500 animate-pulse mt-2">
        Aura is Listening...
      </p>
    </div>
  );
}
