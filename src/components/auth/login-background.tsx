"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { type MouseEvent } from "react";

export function LoginBackground() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set(event.clientX - rect.left);
    mouseY.set(event.clientY - rect.top);
  }

  return (
    <div
      className="pointer-events-auto absolute inset-0 overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="absolute -left-44 top-20 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl"
        animate={{ y: [0, 24, 0], x: [0, 8, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-8 right-[-100px] h-80 w-80 rounded-full bg-indigo-400/20 blur-3xl"
        animate={{ y: [0, -26, 0], x: [0, -10, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-0 opacity-70"
        style={{
          background: useMotionTemplate`radial-gradient(480px circle at ${mouseX}px ${mouseY}px, rgba(34,211,238,0.22), transparent 65%)`,
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:38px_38px]" />
    </div>
  );
}
