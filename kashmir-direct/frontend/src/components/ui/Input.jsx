'use client';

import { motion } from 'framer-motion';

export default function Input({ 
  label, 
  error, 
  className = '', 
  ...props 
}) {
  return (
    <div className={`w-full flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-[#1B4332]/30 ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        <input
          className={`
            w-full px-6 py-4 bg-[#FDFBF7]/50 backdrop-blur-md border border-[#1B4332]/10
            rounded-2xl text-xs font-bold text-[#1B4332] placeholder:text-[#1B4332]/20
            focus:bg-white focus:border-[#BC6C25] outline-none transition-all duration-300
            ${error ? 'border-rose-500' : 'hover:border-[#1B4332]/20 shadow-sm'}
          `}
          {...props}
        />
        {/* ✨ High-Fidelity Glow on Focus */}
        <div className="absolute inset-0 rounded-2xl ring-4 ring-[#BC6C25]/5 opacity-0 group-focus-within:opacity-100 pointer-events-none transition-all duration-500 scale-105 group-focus-within:scale-100" />
      </div>
      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[9px] font-black uppercase tracking-widest text-rose-500 ml-1"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
