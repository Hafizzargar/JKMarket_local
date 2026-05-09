'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, XCircle, ChevronLeft, Info, Globe, Zap } from 'lucide-react';

export default function GovernanceInspector({ isOpen, item, isRejecting, reason, setModal, onAction }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12">
       {/* 🎭 BACKDROP */}
       <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        onClick={() => setModal({ isOpen: false })} 
        className="absolute inset-0 bg-black/95 backdrop-blur-3xl" 
       />

       {/* 🛡️ INSPECTOR MODAL */}
       <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 30 }} 
        animate={{ scale: 1, opacity: 1, y: 0 }} 
        exit={{ scale: 0.95, opacity: 0, y: 30 }} 
        className="relative bg-[#141A18] w-full max-w-6xl rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col md:flex-row border border-white/5 h-fit max-h-[90vh]"
       >
          {/* 🖼️ IMAGE CHAMBER */}
          <div className="md:w-1/2 p-8 md:p-12 bg-black/40 flex items-center justify-center border-b md:border-b-0 md:border-r border-white/5 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full bg-[#BC6C25]/5 blur-[80px] pointer-events-none" />
             <div className="relative group w-full aspect-square max-w-[450px]">
                <div className="absolute inset-0 bg-[#BC6C25]/20 blur-2xl rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl border-2 border-white/10 group-hover:border-[#BC6C25]/40 transition-all duration-700">
                   <img src={item?.images?.[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="Inspection Node" />
                   <div className="absolute bottom-6 right-6 px-4 py-2 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 flex items-center gap-2">
                      <div className="w-1 h-1 bg-[#BC6C25] rounded-full animate-pulse" />
                      <span className="text-[8px] font-black text-white/60 uppercase tracking-widest">Hi-Res Stream</span>
                   </div>
                </div>
             </div>
          </div>

          {/* 📜 PROTOCOL PANEL */}
          <div className="md:w-1/2 p-10 md:p-16 flex flex-col justify-between gap-10 relative overflow-y-auto no-scrollbar">
             <div>
                <div className="flex flex-wrap items-center gap-4 mb-8">
                   <div className="px-4 py-2 bg-[#BC6C25]/10 border border-[#BC6C25]/20 text-[#BC6C25] text-[9px] font-black rounded-xl uppercase tracking-widest flex items-center gap-2">
                      <ShieldCheck size={12} />
                      Sovereign Validation
                   </div>
                   <div className="px-4 py-2 bg-white/5 border border-white/5 text-[9px] font-black text-white/20 rounded-xl uppercase tracking-widest">
                      ID: {item?.id.slice(0,8)}
                   </div>
                </div>

                <h3 className="text-4xl font-black tracking-tighter uppercase italic text-white leading-tight mb-6">{item?.title}</h3>
                
                <div className="space-y-4">
                   <div className="flex items-start gap-4 p-5 bg-white/[0.02] rounded-2xl border border-white/5">
                      <Info size={16} className="text-[#BC6C25] mt-1 shrink-0" />
                      <p className="text-sm font-medium text-white/40 leading-relaxed italic">"{item?.description}"</p>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white/[0.01] rounded-2xl border border-white/5">
                         <span className="text-[8px] font-black text-white/10 uppercase tracking-widest block mb-1">Valuation</span>
                         <span className="text-xl font-black text-white">₹{item?.price}</span>
                      </div>
                      <div className="p-4 bg-white/[0.01] rounded-2xl border border-white/5">
                         <span className="text-[8px] font-black text-white/10 uppercase tracking-widest block mb-1">Origin</span>
                         <span className="text-sm font-black text-white uppercase tracking-tighter">{item?.sellers?.shop_name || 'Artisan Root'}</span>
                      </div>
                   </div>
                </div>
             </div>

             <div className="space-y-6">
                <AnimatePresence mode="wait">
                  {!isRejecting ? (
                    <motion.div 
                      key="actions" 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                       <button 
                        onClick={() => onAction('approved')} 
                        className="w-full h-16 rounded-2xl bg-[#BC6C25] hover:bg-[#E87C2A] text-white font-black tracking-[0.3em] uppercase text-[10px] shadow-2xl shadow-[#BC6C25]/20 transition-all flex items-center justify-center gap-3 group"
                       >
                          <Zap size={16} className="fill-white group-hover:scale-110 transition-transform" />
                          Publish to Global Vault
                       </button>
                       <button 
                        onClick={() => setModal({ isRejecting: true })} 
                        className="w-full h-16 rounded-2xl bg-white/5 border border-white/10 text-rose-500/60 hover:text-rose-500 hover:bg-rose-500/5 transition-all font-black tracking-[0.3em] uppercase text-[10px] flex items-center justify-center gap-3"
                       >
                          <XCircle size={16} />
                          Issue Denial Node
                       </button>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="denial" 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6"
                    >
                       <div className="relative">
                          <label className="text-[9px] font-black uppercase tracking-[0.3em] text-[#BC6C25] ml-4 mb-3 block">Amendment Instruction</label>
                          <textarea 
                             value={reason} 
                             onChange={(e) => setModal({ reason: e.target.value })} 
                             placeholder="Specify required amendments for the artisan..." 
                             className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 text-sm font-medium focus:border-[#BC6C25]/40 focus:outline-none min-h-[140px] text-white/90 placeholder:text-white/5 transition-all shadow-inner" 
                          />
                       </div>
                       <div className="flex gap-4">
                          <button 
                            onClick={() => setModal({ isRejecting: false })} 
                            className="flex-1 h-14 rounded-2xl bg-white/5 border border-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all font-black uppercase text-[9px] tracking-widest flex items-center justify-center gap-2"
                          >
                             <ChevronLeft size={14} /> Back
                          </button>
                          <button 
                            onClick={() => onAction('rejected')} 
                            className="flex-[2] h-14 rounded-2xl bg-rose-600/20 border border-rose-500/30 text-rose-500 hover:bg-rose-600 hover:text-white transition-all font-black uppercase text-[9px] tracking-widest shadow-xl shadow-rose-600/10"
                          >
                             Confirm Protocol Rejection
                          </button>
                       </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <button 
                  onClick={() => setModal({ isOpen: false })} 
                  className="w-full text-[9px] font-black uppercase tracking-[0.5em] text-white/10 hover:text-[#BC6C25] transition-all flex items-center justify-center gap-4 group"
                >
                   <div className="h-px bg-white/5 flex-1 group-hover:bg-[#BC6C25]/20 transition-all" />
                   Exit Terminal
                   <div className="h-px bg-white/5 flex-1 group-hover:bg-[#BC6C25]/20 transition-all" />
                </button>
             </div>
          </div>
       </motion.div>
    </div>
  );
}
