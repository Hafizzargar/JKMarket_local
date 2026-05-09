'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function Drawer({ isOpen, onClose, title, children, side = 'right' }) {
  const isLeft = side === 'left';
  
  const drawerVariants = {
    closed: { x: isLeft ? '-100%' : '100%' },
    open: { x: 0 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#081C15]/60 backdrop-blur-sm z-[100]"
          />

          {/* Drawer Sidebar */}
          <motion.div 
            variants={drawerVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={`fixed top-0 bottom-0 w-full max-w-2xl bg-[#0D1110] shadow-2xl z-[110] flex flex-col border-${isLeft ? 'r' : 'l'} border-white/5 ${isLeft ? 'left-0' : 'right-0'}`}
          >
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div>
                <h2 className="text-xl font-black text-white tracking-widest uppercase italic">{title}</h2>
                <p className="text-[9px] font-black text-[#BC6C25] uppercase tracking-[0.3em] mt-1 opacity-60">
                   Identity Configuration Vault
                </p>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white/20 hover:bg-rose-500/20 hover:text-rose-500 transition-all border border-white/5"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-grow overflow-y-auto custom-scrollbar p-8 bg-[#0D1110]">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
