'use client';

import { Briefcase, UserCircle, Plus, Settings, Activity, ShieldCheck, ChevronRight } from 'lucide-react';

export default function OpsCommand({ managers }) {
  return (
    <div className="bg-[#141A18]/60 backdrop-blur-3xl border border-white/5 rounded-[4rem] p-16 shadow-2xl relative overflow-hidden group">
       {/* 🎭 AMBIENT DEPTH */}
       <div className="absolute top-0 right-0 p-12 opacity-[0.03] text-[#BC6C25] pointer-events-none group-hover:opacity-[0.05] transition-opacity duration-700">
          <Briefcase size={280} />
       </div>
       <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#BC6C25]/5 blur-[120px] pointer-events-none" />

       <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
             <div className="w-2 h-2 bg-[#BC6C25] rounded-full animate-pulse shadow-[0_0_10px_#BC6C25]" />
             <h3 className="text-4xl font-black tracking-tighter uppercase italic text-white leading-none">Operations Command</h3>
          </div>
          <p className="text-sm font-medium text-white/30 max-w-xl italic leading-relaxed">The elite personnel layer responsible for manual marketplace oversight and autonomous labour force governance.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
             {managers.map(m => (
               <div key={m.id} className="bg-white/[0.03] border border-white/5 p-10 rounded-[3rem] hover:bg-white/[0.05] hover:border-[#BC6C25]/20 transition-all group/card relative overflow-hidden shadow-xl">
                  {/* 🎭 HOVER ACCENT */}
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#BC6C25] scale-y-0 group-hover/card:scale-y-100 transition-transform origin-top" />
                  
                  <div className="flex justify-between items-start mb-8">
                     <div className="w-16 h-16 bg-[#BC6C25]/10 text-[#BC6C25] rounded-2xl flex items-center justify-center group-hover/card:bg-[#BC6C25] group-hover/card:text-white transition-all shadow-lg border border-[#BC6C25]/20">
                        <UserCircle size={32} />
                     </div>
                     <div className="px-3 py-1.5 bg-white/5 rounded-lg border border-white/5 flex items-center gap-2">
                        <Activity size={10} className="text-emerald-500" />
                        <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Active Ops</span>
                     </div>
                  </div>

                  <h4 className="text-2xl font-black tracking-tight text-white/90 group-hover/card:text-white transition-colors">{m.full_name}</h4>
                  <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1.5 mb-8 border-b border-white/5 pb-6">{m.email}</p>
                  
                  <div className="flex gap-3">
                     <button className="flex-1 h-12 rounded-2xl bg-white/[0.05] border border-white/5 hover:border-[#BC6C25]/40 hover:bg-[#BC6C25]/10 text-white font-black text-[9px] tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-2 group/btn">
                        Personnel Stats
                        <ChevronRight size={14} className="text-white/20 group-hover/btn:translate-x-1 transition-transform" />
                     </button>
                     <button className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/5 flex items-center justify-center text-white/20 hover:text-[#BC6C25] hover:border-[#BC6C25]/40 transition-all">
                        <Settings size={18} />
                     </button>
                  </div>
               </div>
             ))}

             <button className="bg-white/[0.01] border-2 border-dashed border-white/5 rounded-[3rem] p-10 flex flex-col items-center justify-center gap-6 group hover:border-[#BC6C25]/30 hover:bg-[#BC6C25]/5 transition-all min-h-[320px]">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-white/10 group-hover:bg-[#BC6C25]/20 group-hover:text-[#BC6C25] group-hover:scale-110 transition-all shadow-inner">
                   <Plus size={32} />
                </div>
                <div className="text-center">
                   <p className="text-[12px] font-black uppercase tracking-[0.3em] text-white/20 group-hover:text-white transition-colors">Commission Manager</p>
                   <p className="text-[8px] font-bold text-white/5 uppercase tracking-widest mt-2">Initialize New Access Node</p>
                </div>
             </button>
          </div>
       </div>
    </div>
  );
}
