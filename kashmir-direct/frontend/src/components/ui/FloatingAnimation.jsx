'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function FloatingAnimation() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {/* 🏺 LARGE KINETIC CARDS (Inspired by boardroom illustration) */}
      <motion.div
        animate={{
          y: [0, -30, 0],
          rotate: [0, 2, 0],
          scale: [1, 1.02, 1]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[15%] right-[10%] w-[350px] h-[450px] bg-gradient-to-br from-white/10 to-transparent border border-white/20 rounded-[4rem] backdrop-blur-[2px] hidden lg:block"
      />

      <motion.div
        animate={{
          y: [0, 40, 0],
          rotate: [0, -3, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[10%] left-[5%] w-[300px] h-[400px] bg-gradient-to-tr from-white/5 to-transparent border border-white/10 rounded-[3rem] backdrop-blur-[1px] hidden lg:block"
      />

      {/* ✨ FLOATING PARTICLES (Only rendered on client to avoid hydration mismatch) */}
      {mounted && [...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.3, 0],
            scale: [0, 1.5, 0],
            x: Math.random() * 200 - 100,
            y: Math.random() * 200 - 100,
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 2
          }}
          className="absolute w-2 h-2 rounded-full bg-[#BC6C25]/20 blur-sm"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`
          }}
        />
      ))}

      {/* 🏔️ AMBIENT GLOWS */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#BC6C25]/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#1B4332]/5 blur-[120px] rounded-full" />
      <div className="absolute inset-0 bg-organic-mesh opacity-[0.03]" />
    </div>
  );
}
