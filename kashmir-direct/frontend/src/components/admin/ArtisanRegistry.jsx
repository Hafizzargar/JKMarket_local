'use client';

import { Store, CheckCircle2, ShieldOff, Zap, ChevronRight, Globe } from 'lucide-react';
import Button from '../ui/Button';

export default function ArtisanRegistry({ shopkeepers, onEdit }) {
  return (
    <div className="bg-[#141A18]/60 backdrop-blur-3xl border border-white/5 rounded-[3.5rem] overflow-hidden shadow-2xl relative group">
      {/* 🎭 AMBIENT GLOW */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-[#BC6C25]/5 blur-[120px] pointer-events-none" />

      <div className="p-12 border-b border-white/5 flex justify-between items-center relative z-10">
         <div>
            <h3 className="text-3xl font-black tracking-tighter uppercase italic text-white leading-none">Artisan Registry</h3>
            <div className="flex items-center gap-3 mt-3">
               <div className="w-1.5 h-1.5 bg-[#BC6C25] rounded-full shadow-[0_0_10px_#BC6C25]" />
               <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Verified Marketplace Partners • Sovereign Tier</p>
            </div>
         </div>
         <div className="px-5 py-3 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-3">
            <Globe size={14} className="text-[#BC6C25]" />
            <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Global Ops Active</span>
         </div>
      </div>

      <div className="overflow-x-auto relative z-10">
        <table className="w-full text-left">
           <thead>
              <tr className="bg-white/[0.01]">
                 <th className="px-12 py-8 text-[9px] font-black uppercase tracking-widest text-white/10">Shop Branch</th>
                 <th className="px-12 py-8 text-[9px] font-black uppercase tracking-widest text-white/10">Sovereign Status</th>
                 <th className="px-12 py-8 text-[9px] font-black uppercase tracking-widest text-white/10 text-right">System Action</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-white/[0.03]">
              {shopkeepers.map((sk) => (
                <tr key={sk.id} className="hover:bg-white/[0.03] transition-all group/row">
                   <td className="px-12 py-10">
                      <div className="flex items-center gap-8">
                         <div className="relative">
                            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-[#BC6C25] font-black text-xl group-hover/row:bg-[#BC6C25] group-hover/row:text-white transition-all shadow-xl border border-white/5 relative z-10">
                               {sk.shop_name[0]}
                            </div>
                            <div className="absolute inset-0 bg-[#BC6C25]/10 blur-xl rounded-full opacity-0 group-hover/row:opacity-100 transition-opacity" />
                         </div>
                         <div className="space-y-1">
                            <p className="text-xl font-black tracking-tight text-white/90 group-hover/row:text-white transition-colors">{sk.shop_name}</p>
                            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{sk.profiles?.email}</p>
                         </div>
                      </div>
                   </td>
                   <td className="px-12 py-10">
                      <div className="flex items-center gap-6">
                         <div className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-[0.2em] flex items-center gap-3 border ${sk.is_verified ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-400' : 'bg-rose-500/5 border-rose-500/10 text-rose-400'}`}>
                            <div className={`w-1 h-1 rounded-full ${sk.is_verified ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'}`} />
                            {sk.is_verified ? 'Active' : 'Suspended'}
                         </div>
                         <div className="flex flex-col">
                            <span className="text-[10px] font-black text-white/40 uppercase tracking-tighter leading-none italic mb-1">Quota Allocated</span>
                            <span className="text-[11px] font-bold text-[#BC6C25] uppercase tracking-tighter italic">{sk.product_limit} Nodes</span>
                         </div>
                      </div>
                   </td>
                   <td className="px-12 py-10 text-right">
                      <button 
                        onClick={() => onEdit(sk)}
                        className="h-12 px-8 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#BC6C25]/40 hover:bg-[#BC6C25]/10 text-white font-black text-[9px] tracking-[0.2em] uppercase transition-all flex items-center gap-3 ml-auto group/btn"
                      >
                         Modify Privileges
                         <ChevronRight size={14} className="text-white/20 group-hover/btn:text-[#BC6C25] group-hover/btn:translate-x-1 transition-all" />
                      </button>
                   </td>
                </tr>
              ))}
           </tbody>
        </table>
      </div>
    </div>
  );
}
