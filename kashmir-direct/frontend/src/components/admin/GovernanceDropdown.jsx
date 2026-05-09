'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, Package, CreditCard, XOctagon, 
  UserCheck, Zap, ChevronDown, Activity
} from 'lucide-react';

export default function GovernanceDropdown({ onAction }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const actions = [
    { id: 'orders', label: 'Order Registry', icon: Package, desc: 'Live fulfillment logs' },
    { id: 'payments', label: 'Payment Gateway', icon: CreditCard, desc: 'Financial audit stream' },
    { id: 'cancels', label: 'Cancellation Hub', icon: XOctagon, desc: 'Protocol terminations' },
    { id: 'users', label: 'User Validation', icon: UserCheck, desc: 'Identity verification' },
    { id: 'products', label: 'Product Protocol', icon: Zap, desc: 'Listing approvals' },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2.5 bg-[#BC6C25]/10 border border-[#BC6C25]/20 rounded-xl hover:bg-[#BC6C25]/20 transition-all group"
      >
        <div className="w-5 h-5 bg-[#BC6C25] rounded-md flex items-center justify-center shadow-lg shadow-[#BC6C25]/20">
          <ShieldCheck size={12} className="text-white" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-white/80 group-hover:text-white transition-colors">Governance</span>
        <ChevronDown size={14} className={`text-white/20 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-4 w-72 bg-[#141A18] border border-white/5 rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.5)] backdrop-blur-3xl overflow-hidden z-[100]"
          >
            <div className="p-4 border-b border-white/5 bg-white/[0.02]">
               <div className="flex items-center gap-2">
                  <Activity size={12} className="text-[#BC6C25]" />
                  <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/40">Sovereign Commands</p>
               </div>
            </div>

            <div className="p-2">
              {actions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => {
                    onAction(action.id);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-white/[0.03] transition-all group text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 border border-white/5 group-hover:border-[#BC6C25]/20">
                    <action.icon size={18} className="text-white/40 group-hover:text-[#BC6C25] transition-colors" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-white group-hover:text-[#BC6C25] uppercase tracking-wider transition-colors">{action.label}</p>
                    <p className="text-[8px] font-bold text-white/20 uppercase tracking-tighter mt-0.5">{action.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="p-4 bg-black/20 flex items-center justify-between">
               <span className="text-[7px] font-black uppercase tracking-widest text-white/10 italic">Secure Node • 256-bit AES</span>
               <div className="w-1.5 h-1.5 rounded-full bg-[#2ECC71] animate-pulse shadow-[0_0_8px_#2ECC71]" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
