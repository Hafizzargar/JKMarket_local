'use client';

import { motion } from 'framer-motion';

/**
 * 🏔️ SOVEREIGN LOADING
 * A premium, institutional-grade loading screen for the Kashmir Direct platform.
 */
export default function SovereignLoading({ message = "Unlocking Valley Vaults", fullScreen = true }) {
  const containerClasses = fullScreen 
    ? "fixed inset-0 z-[20000] bg-[#FDFBF7] flex flex-col items-center justify-center space-y-8" 
    : "py-20 flex flex-col items-center justify-center space-y-8";

  return (
    <div className={containerClasses}>
      <div className="relative w-24 h-24">
        {/* Outer Glow */}
        <div className="absolute inset-[-8px] bg-[#BC6C25]/5 rounded-full blur-xl animate-pulse" />
        
        {/* Rotating Rings */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-[3px] border-[#1B4332]/5 rounded-full"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-[3px] border-t-[#BC6C25] rounded-full"
        />
        
        {/* Center Node */}
        <div className="absolute inset-0 flex items-center justify-center text-3xl drop-shadow-lg">
          🏔️
        </div>
      </div>
      
      <div className="text-center space-y-2">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#1B4332]/40 animate-pulse">
          {message}
        </p>
        <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#BC6C25]/20 to-transparent mx-auto" />
      </div>
    </div>
  );
}
