'use client';

import { motion } from 'framer-motion';

export default function Switch({ isOn, onToggle, label }) {
  return (
    <div className="flex items-center gap-4 group/switch">
      <button
        onClick={onToggle}
        className={`
          relative w-14 h-7 rounded-full transition-all duration-500 flex items-center px-1.5
          shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]
          ${isOn ? 'bg-[#1B4332] shadow-[0_0_20px_rgba(27,67,50,0.2)]' : 'bg-gray-100'}
        `}
      >
        <motion.div
          animate={{ 
            x: isOn ? 28 : 0,
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            type: "spring", 
            stiffness: 400, 
            damping: 25,
            scale: { duration: 0.2 }
          }}
          className="w-4 h-4 bg-white rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.1)] relative overflow-hidden"
        >
          {/* Haptic Lens Flare */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white via-white/40 to-transparent opacity-60" />
        </motion.div>
      </button>
      {label && (
        <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-300
          ${isOn ? 'text-[#1B4332]' : 'text-gray-300'}
        `}>
          {label}
        </span>
      )}
    </div>
  );
}
