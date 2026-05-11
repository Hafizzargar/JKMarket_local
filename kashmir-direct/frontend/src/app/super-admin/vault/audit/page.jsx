'use client';

import { ShieldCheck, Lock, Eye, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GovernanceAuditPage() {
  return (
    <div className="space-y-10 pb-20">
       <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#1B4332] rounded-[10px] flex items-center justify-center text-white shadow-xl shadow-[#1B4332]/20">
             <ShieldCheck size={24} />
          </div>
          <div>
             <h3 className="text-xl font-black text-[#1B4332] uppercase tracking-tighter">Governance Audit</h3>
             <p className="text-[10px] font-bold text-[#BC6C25] uppercase tracking-widest mt-1">High-Security Policy & Permission Registry</p>
          </div>
       </div>

       <motion.div 
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         className="bg-white border border-[#1B4332]/10 rounded-[10px] p-20 flex flex-col items-center justify-center text-center shadow-sm"
       >
          <div className="w-20 h-20 bg-[#BC6C25]/5 rounded-2xl flex items-center justify-center text-[#BC6C25] mb-6">
             <Lock size={40} />
          </div>
          <h4 className="text-xl font-black text-[#1B4332] uppercase italic tracking-tighter">Vault Encryption Active</h4>
          <p className="text-[9px] font-bold text-[#1B4332]/40 uppercase tracking-[0.3em] mt-4 max-w-sm leading-relaxed">
             This governance node is currently under synchronization. The auditing forge will be live in the next protocol update.
          </p>
       </motion.div>
    </div>
  );
}
