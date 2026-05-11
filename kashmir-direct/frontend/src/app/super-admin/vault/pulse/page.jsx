'use client';

import { Activity, Zap, HeartPulse } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PulseMonitorPage() {
  return (
    <div className="space-y-10 pb-20">
       <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#1B4332] rounded-[10px] flex items-center justify-center text-white shadow-xl shadow-[#1B4332]/20">
             <Activity size={24} />
          </div>
          <div>
             <h3 className="text-xl font-black text-[#1B4332] uppercase tracking-tighter">Pulse Monitor</h3>
             <p className="text-[10px] font-bold text-[#BC6C25] uppercase tracking-widest mt-1">Operational Health & API Vitality</p>
          </div>
       </div>

       <motion.div 
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         className="bg-white border border-[#1B4332]/10 rounded-[10px] p-20 flex flex-col items-center justify-center text-center shadow-sm"
       >
          <div className="w-20 h-20 bg-emerald-500/5 rounded-2xl flex items-center justify-center text-emerald-500 mb-6 relative">
             <div className="absolute inset-0 bg-emerald-500/20 blur-[20px] rounded-full animate-pulse" />
             <HeartPulse size={40} className="relative z-10" />
          </div>
          <h4 className="text-xl font-black text-[#1B4332] uppercase italic tracking-tighter">Platform Heartbeat: Stable</h4>
          <p className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.4em] mt-4">
             Latency: 12ms | Uptime: 99.9% | Sync: Active
          </p>
       </motion.div>
    </div>
  );
}
