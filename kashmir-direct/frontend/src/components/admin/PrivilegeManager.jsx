'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ShieldOff, AlertOctagon, Calendar, Layers, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';

export default function PrivilegeManager({ isOpen, seller, newLimit, newExpiry, isVerified, setModal, onUpdate }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-8">
       {/* 🎭 BACKDROP */}
       <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        onClick={() => setModal({ isOpen: false })} 
        className="absolute inset-0 bg-black/90 backdrop-blur-2xl" 
       />

       {/* 🛡️ GOVERNANCE MODAL */}
       <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }} 
        animate={{ scale: 1, opacity: 1, y: 0 }} 
        exit={{ scale: 0.95, opacity: 0, y: 20 }} 
        className="relative bg-[#141A18] w-full max-w-lg rounded-[3rem] p-12 shadow-[0_0_80px_rgba(0,0,0,0.6)] border border-white/5 overflow-hidden"
       >
          {/* 🎭 AMBIENT ACCENT */}
          <div className={`absolute -top-24 -right-24 w-64 h-64 blur-[100px] pointer-events-none opacity-20 ${isVerified ? 'bg-[#BC6C25]' : 'bg-rose-600'}`} />

          <div className="relative z-10 flex flex-col items-center text-center">
             <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-8 ${isVerified ? 'bg-[#BC6C25]/10 text-[#BC6C25] border-[#BC6C25]/30' : 'bg-rose-600/10 text-rose-500 border-rose-500/30'} border shadow-2xl transition-all duration-500`}>
                {isVerified ? <ShieldCheck size={36} /> : <ShieldOff size={36} />}
             </div>
             
             <h3 className="text-3xl font-black tracking-tighter uppercase italic text-white leading-none">Artisan Governance</h3>
             <p className="text-white/20 text-[10px] font-bold uppercase tracking-[0.2em] mt-3 mb-10">Modifying Partition: <span className="text-white/40">{seller?.shop_name}</span></p>
             
             <div className="w-full space-y-4 mb-10 text-left">
                {/* ✅ VERIFICATION TOGGLE */}
                <div className="flex items-center justify-between p-6 bg-white/[0.03] rounded-2xl border border-white/5 group hover:border-white/10 transition-all">
                   <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${isVerified ? 'text-emerald-500 bg-emerald-500/5' : 'text-rose-500 bg-rose-500/5'}`}>
                         {isVerified ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Verification Status</span>
                   </div>
                   <button 
                      onClick={() => setModal({ isVerified: !isVerified })} 
                      className={`w-12 h-6 rounded-full relative transition-all duration-500 ${isVerified ? 'bg-emerald-500' : 'bg-rose-500'}`}
                   >
                      <motion.div 
                        animate={{ x: isVerified ? 24 : 4 }}
                        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg" 
                      />
                   </button>
                </div>

                {/* 🔢 LIMITS & EXPIRY */}
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-white/[0.03] p-5 rounded-2xl border border-white/5 group hover:border-[#BC6C25]/30 transition-all">
                      <div className="flex items-center gap-2 mb-2 opacity-20 group-hover:opacity-100 transition-opacity">
                         <Layers size={10} className="text-[#BC6C25]" />
                         <label className="text-[8px] font-black uppercase tracking-widest text-white">Validation Limit</label>
                      </div>
                      <input 
                        type="number" 
                        value={newLimit} 
                        onChange={(e) => setModal({ newLimit: e.target.value })} 
                        className="w-full bg-transparent border-none text-white text-xl font-black focus:outline-none focus:text-[#BC6C25] transition-colors" 
                      />
                   </div>
                   <div className="bg-white/[0.03] p-5 rounded-2xl border border-white/5 group hover:border-[#BC6C25]/30 transition-all">
                      <div className="flex items-center gap-2 mb-2 opacity-20 group-hover:opacity-100 transition-opacity">
                         <Calendar size={10} className="text-[#BC6C25]" />
                         <label className="text-[8px] font-black uppercase tracking-widest text-white">Cycle Reset</label>
                      </div>
                      <input 
                        type="date" 
                        value={newExpiry} 
                        onChange={(e) => setModal({ newExpiry: e.target.value })} 
                        className="w-full bg-transparent border-none text-white text-[11px] font-black focus:outline-none focus:text-[#BC6C25] transition-colors mt-1" 
                      />
                   </div>
                </div>
             </div>

             <div className="w-full space-y-4">
                <button 
                  onClick={() => onUpdate(false)} 
                  className="w-full h-16 rounded-2xl bg-[#BC6C25] hover:bg-[#E87C2A] text-white font-black tracking-[0.3em] uppercase text-[10px] shadow-2xl shadow-[#BC6C25]/20 transition-all flex items-center justify-center gap-3"
                >
                   <Zap size={16} className="fill-white" />
                   Commit Privileges
                </button>
                
                <button 
                  onClick={() => { if(confirm('TERMINATE ACCOUNT?')) onUpdate(true); }} 
                  className="w-full h-14 rounded-2xl bg-white/[0.02] border border-white/5 text-rose-500/40 hover:text-rose-500 hover:bg-rose-500/5 text-[9px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all"
                >
                   <AlertOctagon size={14} /> 
                   Terminate Access Protocol
                </button>
             </div>
          </div>
       </motion.div>
    </div>
  );
}
