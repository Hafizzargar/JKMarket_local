'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, ShoppingBag, CreditCard, XCircle, 
  UserCheck, Zap, Layers, Bell, ShieldCheck
} from 'lucide-react';

export default function GovernanceDropdown({ onAction }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const actions = [
    { id: 'orders', label: 'Orders', icon: ShoppingBag, color: '#1B4332' },
    { id: 'finance', label: 'Finance', icon: CreditCard, color: '#BC6C25' },
    { id: 'canceled', label: 'Canceled', icon: XCircle, color: '#AE2012' },
    { id: 'users', label: 'Verifications', icon: UserCheck, color: '#005F73' },
    { id: 'products', label: 'Approvals', icon: Zap, color: '#EE9B00' }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="h-10 px-4 bg-[#1B4332]/5 border border-[#1B4332]/10 rounded-xl flex items-center gap-3 group transition-all hover:bg-white hover:shadow-xl hover:shadow-[#1B4332]/5 active:scale-95"
      >
        <div className="w-5 h-5 bg-[#BC6C25] rounded-md flex items-center justify-center shadow-lg shadow-[#BC6C25]/20 group-hover:rotate-12 transition-transform">
           <Layers size={12} className="text-white" />
        </div>
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#1B4332]">Control Panel</span>
        <ChevronDown size={14} className={`text-[#1B4332]/20 transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full right-0 mt-3 w-64 bg-[#FDFBF7]/95 backdrop-blur-3xl border border-[#1B4332]/10 rounded-3xl shadow-[0_40px_80px_-20px_rgba(27,67,50,0.2)] overflow-hidden z-[100]"
          >
             <div className="p-4 border-b border-[#1B4332]/5 flex items-center justify-between bg-white/40">
                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-[#1B4332]/40">Quick Actions</span>
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
             </div>
             
             <div className="p-2">
                {actions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => {
                      onAction(action.id);
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-white transition-all group/item text-left relative overflow-hidden"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#1B4332]/5 flex items-center justify-center group-hover/item:scale-110 transition-transform relative z-10">
                       <action.icon size={18} style={{ color: action.color }} className="opacity-60 group-hover/item:opacity-100 transition-opacity" />
                    </div>
                    <div className="relative z-10">
                       <p className="text-[10px] font-black uppercase tracking-widest text-[#1B4332] leading-none">{action.label}</p>
                       <p className="text-[7px] font-bold text-[#1B4332]/20 uppercase tracking-widest mt-1">Management</p>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#BC6C25]/5 to-transparent -translate-x-full group-hover/item:translate-x-full transition-transform duration-1000" />
                  </button>
                ))}
             </div>

             <div className="p-4 bg-[#1B4332]/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <ShieldCheck size={12} className="text-[#BC6C25]" />
                   <span className="text-[7px] font-black uppercase tracking-widest text-[#1B4332]/30">Secure Console</span>
                </div>
                <div className="flex gap-1">
                   {[1,2,3].map(i => <div key={i} className="w-1 h-1 bg-[#1B4332]/10 rounded-full" />)}
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
