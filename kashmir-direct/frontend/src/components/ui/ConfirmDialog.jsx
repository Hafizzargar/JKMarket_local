'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

export default function ConfirmDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Security Clearance", 
  message = "Are you sure you want to proceed with this high-risk operation?",
  confirmText = "Purge Record",
  variant = "danger" 
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
       <div className="p-8 text-center">
          <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center border ${variant === 'danger' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' : 'bg-amber-500/10 border-amber-500/20 text-amber-500'}`}>
             <AlertTriangle size={32} className={variant === 'danger' ? 'animate-pulse' : ''} />
          </div>
          
          <h4 className="text-sm font-black text-white uppercase tracking-widest mb-3">Authorize Action</h4>
          <p className="text-[11px] text-white/40 leading-relaxed px-4">{message}</p>
          
          <div className="grid grid-cols-2 gap-3 mt-10">
             <button 
               onClick={onClose}
               className="h-12 rounded-xl bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-widest text-white/40 hover:bg-white/10 hover:text-white transition-all"
             >
                Abort
             </button>
             <Button 
               onClick={() => { onConfirm(); onClose(); }}
               className={`h-12 rounded-xl border-none text-[9px] font-black uppercase tracking-widest shadow-lg ${variant === 'danger' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-[#BC6C25] hover:bg-[#A65D1F]'}`}
             >
                {confirmText}
             </Button>
          </div>
       </div>
    </Modal>
  );
}
