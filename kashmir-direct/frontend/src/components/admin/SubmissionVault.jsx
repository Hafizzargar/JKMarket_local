'use client';

import { Package, Search, ChevronRight, Info } from 'lucide-react';
import Button from '../ui/Button';
import { motion } from 'framer-motion';

export default function SubmissionVault({ products, onInspect }) {
  return (
    <div className="bg-[#141A18]/60 backdrop-blur-3xl border border-white/5 rounded-[3.5rem] overflow-hidden shadow-2xl relative group">
      {/* 🎭 AMBIENT GLOW */}
      <div className="absolute top-0 right-0 w-[30%] h-[30%] bg-[#BC6C25]/5 blur-[100px] pointer-events-none" />
      
      <div className="p-12 border-b border-white/5 flex justify-between items-center relative z-10">
         <div>
            <h3 className="text-3xl font-black tracking-tighter uppercase italic text-white leading-none">Submissions Vault</h3>
            <div className="flex items-center gap-3 mt-3">
               <div className="w-1.5 h-1.5 bg-[#BC6C25] rounded-full animate-pulse shadow-[0_0_10px_#BC6C25]" />
               <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Pending Validation Force • Registry Active</p>
            </div>
         </div>
         <div className="flex items-center gap-4">
            <div className="px-5 py-3 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-3">
               <Search size={14} className="text-white/20" />
               <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Filter Registry</span>
            </div>
         </div>
      </div>

      <div className="overflow-x-auto relative z-10">
        {products.length > 0 ? (
          <table className="w-full text-left">
             <thead>
                <tr className="bg-white/[0.01]">
                   <th className="px-12 py-8 text-[9px] font-black uppercase tracking-widest text-white/10">Artisan Listing</th>
                   <th className="px-12 py-8 text-[9px] font-black uppercase tracking-widest text-white/10">Shop Branch</th>
                   <th className="px-12 py-8 text-[9px] font-black uppercase tracking-widest text-white/10">Verification Node</th>
                   <th className="px-12 py-8 text-[9px] font-black uppercase tracking-widest text-white/10 text-right">System Action</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-white/[0.03]">
                {products.map((p, idx) => (
                  <tr key={p.id || `prod-${idx}`} className="hover:bg-white/[0.03] transition-all group/row">
                     <td className="px-12 py-10">
                        <div className="flex items-center gap-8">
                           <div className="relative shrink-0">
                              <div className="w-24 h-24 bg-white/5 rounded-[2rem] overflow-hidden border border-white/5 transition-all duration-500 group-hover/row:scale-[1.02] group-hover/row:shadow-[0_0_30px_rgba(188,108,37,0.15)] group-hover/row:border-[#BC6C25]/20 shadow-xl relative z-10">
                                 <img src={p.images?.[0]} className="w-full h-full object-cover grayscale-[0.5] group-hover/row:grayscale-0 transition-all duration-700" />
                              </div>
                              <div className="absolute inset-0 bg-[#BC6C25]/10 blur-2xl rounded-full opacity-0 group-hover/row:opacity-100 transition-opacity pointer-events-none" />
                           </div>
                           <div className="space-y-1.5">
                              <p className="text-xl font-black tracking-tight text-white/90 group-hover/row:text-white transition-colors">{p.title}</p>
                              <div className="flex items-center gap-3">
                                 <span className="text-[10px] font-black text-[#BC6C25] uppercase tracking-widest">{p.category}</span>
                                 <div className="w-1 h-1 bg-white/10 rounded-full" />
                                 <span className="text-[10px] font-bold text-white/30 tracking-widest uppercase italic">₹{p.price}</span>
                              </div>
                           </div>
                        </div>
                     </td>
                     <td className="px-12 py-10">
                        <div className="space-y-1.5">
                           <p className="text-sm font-black text-white/80 tracking-tight leading-none">{p.sellers?.shop_name || 'Individual Artisan'}</p>
                           <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">
                              {p.sellers?.profiles?.full_name || 'Guest User'}
                           </p>
                        </div>
                     </td>
                     <td className="px-12 py-10">
                        <div className="flex items-center gap-3">
                           <div className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-[0.2em] flex items-center gap-3 border ${p.is_approved ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-500' : p.status === 'rejected' ? 'bg-rose-500/5 border-rose-500/10 text-rose-500' : 'bg-amber-500/5 border-amber-500/10 text-amber-500'}`}>
                              <div className={`w-1 h-1 rounded-full ${p.is_approved ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : p.status === 'rejected' ? 'bg-rose-500' : 'bg-amber-500 animate-pulse shadow-[0_0_8px_#f59e0b]'}`} />
                              {p.is_approved ? 'Live' : p.status === 'rejected' ? 'Returned' : 'Queued'}
                           </div>
                           {p.status === 'rejected' && <Info size={12} className="text-rose-500/40" />}
                        </div>
                     </td>
                     <td className="px-12 py-10 text-right">
                        <button 
                          onClick={() => onInspect(p)}
                          className="h-14 px-10 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-[#BC6C25]/40 hover:bg-[#BC6C25]/10 text-white font-black text-[9px] tracking-[0.2em] uppercase transition-all flex items-center gap-3 ml-auto group/btn"
                        >
                           Inspect Protocol
                           <ChevronRight size={14} className="text-white/20 group-hover/btn:text-[#BC6C25] group-hover/btn:translate-x-1 transition-all" />
                        </button>
                     </td>
                  </tr>
                ))}
             </tbody>
          </table>
        ) : (
          <div className="py-32 flex flex-col items-center justify-center text-center">
             <div className="relative mb-10">
                <div className="absolute inset-0 bg-[#BC6C25]/20 blur-[60px] rounded-full animate-pulse" />
                <div className="w-24 h-24 bg-white/5 rounded-[2rem] border border-white/10 flex items-center justify-center text-white/10 relative z-10">
                   <Package size={48} className="opacity-20" />
                </div>
             </div>
             <h4 className="text-2xl font-black text-white/40 uppercase italic tracking-tighter">Registry Clear</h4>
             <p className="text-[10px] font-bold text-white/10 uppercase tracking-[0.3em] mt-3">All incoming submissions have been successfully processed.</p>
             <button className="mt-10 px-8 py-3 bg-white/5 border border-white/5 rounded-xl text-[8px] font-black text-white/20 uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all">
                Force Sync Data
             </button>
          </div>
        )}
      </div>
    </div>
  );
}
