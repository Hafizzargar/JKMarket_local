'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function LogisticsAnimation() {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!mounted) {
    return <div className="w-full h-[400px] bg-[#1B4332]/[0.02] rounded-[3rem] animate-pulse" />;
  }

  // DESKTOP: Scaled down animation paths
  const desktopVanVariants = {
    animate: {
      x: [0, 200, 420, 680, 680, 0, 200, 420, 680, 680, 0],
      y: [0, -60, 40, -100, -100, 0, -60, 40, 140, 140, 0],
      opacity: [0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0],
      transition: {
        duration: 16,
        repeat: Infinity,
        ease: "easeInOut",
        times: [0, 0.1, 0.25, 0.45, 0.49, 0.5, 0.6, 0.75, 0.95, 0.99, 1]
      }
    }
  };

  // MOBILE: Vertical paths scaled down
  const mobileVanVariants = {
    animate: {
      y: [0, 100, 200, 320, 320, 0],
      opacity: [0, 1, 1, 1, 0, 0],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
        times: [0, 0.2, 0.4, 0.8, 0.95, 1]
      }
    }
  };

  const lineVariants = {
    animate: {
      strokeDashoffset: [0, -40],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  if (isMobile) {
    return (
      <div className="w-full py-8 px-4 relative">
        <div className="relative min-h-[500px] w-full glass-card rounded-[2.5rem] border border-[#1B4332]/10 overflow-hidden p-6 flex flex-col items-center gap-12">
          {/* Animated Vertical Line */}
          <div className="absolute top-16 bottom-16 left-1/2 -translate-x-1/2 w-px overflow-hidden">
             <motion.div 
               animate={{ y: ['-100%', '100%'] }}
               transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
               className="h-full w-full bg-gradient-to-b from-transparent via-[#1B4332]/20 to-transparent"
             />
          </div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 bg-white border border-[#1B4332]/5 rounded-2xl flex items-center justify-center text-3xl shadow-md">🏔️</div>
            <span className="mt-3 text-[8px] font-black uppercase tracking-widest text-[#1B4332]/30">Fields</span>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-[#FDFBF7] border-2 border-[#1B4332]/5 rounded-full flex items-center justify-center text-3xl shadow-lg relative">
              🔍
              <div className="absolute -top-1 -right-1 bg-[#1B4332] text-white text-[7px] font-black px-2 py-1 rounded-full shadow-md">VERIFIED</div>
            </div>
            <span className="mt-3 text-[8px] font-black uppercase tracking-widest text-[#1B4332]/30">Check</span>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 bg-white border border-[#1B4332]/5 rounded-2xl flex items-center justify-center text-3xl shadow-md">📦</div>
            <span className="mt-3 text-[8px] font-black uppercase tracking-widest text-[#1B4332]/30">Sorting</span>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-emerald-50/50 border border-emerald-100 rounded-[1.5rem] flex items-center justify-center text-4xl shadow-lg">🏡</div>
            <span className="mt-3 text-[8px] font-black uppercase tracking-widest text-emerald-800">Doorstep</span>
          </div>

          <motion.div variants={mobileVanVariants} animate="animate" className="absolute left-1/2 -translate-x-1/2 top-20 z-20">
            <div className="bg-[#1B4332] text-white p-3 rounded-xl shadow-xl flex items-center justify-center">
              <span className="text-xl">🚐</span>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-4 relative group">
      <div className="relative h-[450px] w-full glass-card rounded-[4rem] border border-[#1B4332]/10 overflow-hidden p-10 sm:p-14 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)]">
        
        {/* ✨ HIGH-FIDELITY ANIMATED FLOW LINES */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1200 450" preserveAspectRatio="none">
          <defs>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1B4332" stopOpacity="0.05" />
              <stop offset="50%" stopColor="#BC6C25" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#1B4332" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          
          <motion.path 
            variants={lineVariants}
            animate="animate"
            d="M150 225 Q 250 150, 400 225 Q 550 300, 700 225" 
            stroke="url(#lineGrad)" 
            strokeWidth="3" 
            fill="none" 
            strokeDasharray="12 18" 
          />
          <motion.path 
            variants={lineVariants}
            animate="animate"
            d="M700 225 Q 800 150, 950 112" 
            stroke="url(#lineGrad)" 
            strokeWidth="3" 
            fill="none" 
            strokeDasharray="12 18" 
          />
          <motion.path 
            variants={lineVariants}
            animate="animate"
            d="M700 225 Q 800 300, 950 337" 
            stroke="url(#lineGrad)" 
            strokeWidth="3" 
            fill="none" 
            strokeDasharray="12 18" 
          />
        </svg>

        <div className="relative w-full h-full flex items-center justify-between">
          <div className="flex flex-col items-center z-20">
            <div className="w-24 h-24 bg-white border border-[#1B4332]/10 rounded-[2rem] flex items-center justify-center text-4xl shadow-lg">🏔️</div>
            <span className="mt-8 text-[9px] font-black uppercase tracking-[0.3em] text-[#1B4332]/30">Fields</span>
          </div>

          <div className="flex flex-col items-center z-20">
            <div className="w-32 h-32 bg-[#FDFBF7] border-2 border-[#1B4332]/5 rounded-[3rem] flex items-center justify-center text-5xl shadow-xl relative">
              🔍
              <div className="absolute -top-2 -right-2 bg-[#1B4332] text-white text-[8px] font-black px-4 py-2 rounded-full tracking-widest shadow-lg border-2 border-white">VERIFIED</div>
            </div>
            <span className="mt-8 text-[9px] font-black uppercase tracking-[0.3em] text-[#1B4332]/30">Check</span>
          </div>

          <div className="flex flex-col items-center z-20">
            <div className="w-28 h-28 bg-white border border-[#1B4332]/10 rounded-[2rem] flex items-center justify-center text-4xl shadow-lg">📦</div>
            <span className="mt-8 text-[9px] font-black uppercase tracking-[0.3em] text-[#1B4332]/30">Sorting</span>
          </div>

          <div className="flex flex-col gap-20 z-20 pr-8">
            <div className="flex items-center gap-6 group/end">
              <div className="w-24 h-24 bg-white border border-emerald-50 rounded-[2.5rem] flex items-center justify-center text-5xl shadow-xl">🏡</div>
              <div className="text-left"><h4 className="text-xl font-black text-[#1B4332]">Doorstep</h4></div>
            </div>
            <div className="flex items-center gap-6 group/end">
              <div className="w-24 h-24 bg-white border border-orange-50 rounded-[2.5rem] flex items-center justify-center text-5xl shadow-xl">🏬</div>
              <div className="text-left"><h4 className="text-xl font-black text-[#1B4332]">Retail</h4></div>
            </div>
          </div>

          <motion.div variants={desktopVanVariants} animate="animate" className="absolute left-[12%] top-[45%] z-50">
            <div className="bg-[#1B4332] text-white p-4 rounded-2xl shadow-xl flex items-center justify-center">
              <span className="text-2xl">🚐</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
