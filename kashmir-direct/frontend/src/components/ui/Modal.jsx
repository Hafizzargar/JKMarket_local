'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, maxWidth = "max-w-2xl", action }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end lg:items-center justify-center lg:p-6 bg-[#020604]/80 backdrop-blur-md">
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
             initial={{ opacity: 0, y: 100 }} 
             animate={{ opacity: 1, y: 0 }} 
             exit={{ opacity: 0, y: 100 }} 
             className={`bg-white w-full ${maxWidth} h-[95vh] lg:h-auto lg:max-h-[90vh] flex flex-col rounded-t-[2.5rem] lg:rounded-[2.5rem] border-t lg:border border-[#1B4332]/5 shadow-[0_50px_100px_-20px_rgba(27,67,50,0.12)] overflow-hidden relative z-10`}
           >
              {/* Header */}
              {(title || action) && (
                <div className="px-6 py-4 lg:py-6 border-b border-[#1B4332]/5 flex justify-between items-center bg-[#FDFBF7]/50 backdrop-blur-sm shrink-0">
                   <div className="flex items-center gap-3">
                      <button 
                        onClick={onClose} 
                        className="p-1.5 rounded-lg text-[#1B4332]/40 hover:bg-rose-500/10 hover:text-rose-500 transition-all"
                      >
                        <X size={18} />
                      </button>
                      <h3 className="text-[11px] lg:text-[12px] font-black tracking-[0.2em] uppercase italic text-[#1B4332]">{title}</h3>
                   </div>
                   
                   {action && (
                     <div className="flex items-center">
                        {action}
                     </div>
                   )}
                </div>
              )}
              
              {/* Body */}
              <div className="flex-1 overflow-y-auto no-scrollbar p-6 lg:p-8">
                 {children}
              </div>
           </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
