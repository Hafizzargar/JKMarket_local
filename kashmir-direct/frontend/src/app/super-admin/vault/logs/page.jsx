'use client';

import { FileText, Terminal, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SystemLogsPage() {
  return (
    <div className="space-y-10 pb-20">
       <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#1B4332] rounded-[10px] flex items-center justify-center text-white shadow-xl shadow-[#1B4332]/20">
             <FileText size={24} />
          </div>
          <div>
             <h3 className="text-xl font-black text-[#1B4332] uppercase tracking-tighter">System Logs</h3>
             <p className="text-[10px] font-bold text-[#BC6C25] uppercase tracking-widest mt-1">Real-time Platform Activity Stream</p>
          </div>
       </div>

       <motion.div 
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         className="bg-white border border-[#1B4332]/10 rounded-[10px] p-20 flex flex-col items-center justify-center text-center shadow-sm"
       >
          <div className="w-20 h-20 bg-[#1B4332]/5 rounded-2xl flex items-center justify-center text-[#1B4332]/20 mb-6">
             <Terminal size={40} />
          </div>
          <h4 className="text-xl font-black text-[#1B4332]/30 uppercase italic tracking-tighter">Log Stream Silent</h4>
          <p className="text-[9px] font-bold text-[#1B4332]/10 uppercase tracking-[0.3em] mt-4 max-w-sm leading-relaxed">
             No security anomalies or operational logs detected in the current buffer. System stability is nominal.
          </p>
       </motion.div>
    </div>
  );
}
