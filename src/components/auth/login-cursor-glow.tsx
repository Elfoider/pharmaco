"use client";

import { motion } from "framer-motion";

type LoginCursorGlowProps = {
  x: number;
  y: number;
};

export function LoginCursorGlow({ x, y }: LoginCursorGlowProps) {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      animate={{
        background: `radial-gradient(420px circle at ${x}px ${y}px, rgba(34,211,238,0.2), transparent 62%)`,
      }}
      transition={{ type: "tween", ease: "easeOut", duration: 0.22 }}
    />
  );
}
