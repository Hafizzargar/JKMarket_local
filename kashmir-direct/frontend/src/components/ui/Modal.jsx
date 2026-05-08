'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, maxWidth = "max-w-2xl" }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#020604]/80 backdrop-blur-md">
           {/* Backdrop Click */}
           <motion.div 
             initial={{ opacity: 0 }} 
             animate={{ opacity: 1 }} 
             exit={{ opacity: 0 }} 
             onClick={onClose} 
             className="absolute inset-0 cursor-zoom-out" 
           />

           {/* Modal Content */}
           <motion.div 
             initial={{ opacity: 0, scale: 0.95, y: 20 }} 
             animate={{ opacity: 1, scale: 1, y: 0 }} 
             exit={{ opacity: 0, scale: 0.95, y: 20 }} 
             className={`bg-[#141A18] w-full ${maxWidth} rounded-3xl border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] overflow-hidden relative z-10`}
           >
              {/* Header */}
              {title && (
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                   <h3 className="text-[10px] font-black tracking-[0.4em] uppercase italic text-white/40">{title}</h3>
                   <button 
                     onClick={onClose} 
                     className="w-8 h-8 rounded-lg flex items-center justify-center text-white/20 hover:bg-rose-500/20 hover:text-rose-500 transition-all"
                   >
                     <X size={16} />
                   </button>
                </div>
              )}
              
              {/* Body */}
              <div className="p-0">
                 {children}
              </div>
           </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
