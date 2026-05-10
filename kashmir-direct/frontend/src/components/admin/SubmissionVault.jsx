'use client';

import { Package, ChevronRight, Info, Store, Scale, ClipboardCheck, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SubmissionVault({ products = [], onInspect }) {
  if (!products || products.length === 0) {
    return (
      <div className="bg-white border border-[#1B4332]/5 rounded-[2rem] py-32 flex flex-col items-center justify-center text-center px-6 shadow-xl">
         <div className="relative mb-10">
            <div className="absolute inset-0 bg-[#BC6C25]/10 blur-[60px] rounded-full animate-pulse" />
            <div className="w-24 h-24 bg-[#1B4332]/5 rounded-[2rem] border border-[#1B4332]/10 flex items-center justify-center text-[#1B4332]/10 relative z-10">
               <Package size={48} className="opacity-20" />
            </div>
         </div>
         <h4 className="text-2xl font-black text-[#1B4332]/40 uppercase italic tracking-tighter">No Pending Requests</h4>
         <p className="text-[10px] font-bold text-[#1B4332]/20 uppercase tracking-[0.3em] mt-3 max-w-xs mx-auto">All incoming product requests have been reviewed.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#1B4332]/10 rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(27,67,50,0.1)] overflow-hidden">
       {/* 🏺 EXPANDED INTERNAL DATA VAULT SCROLL */}
       <div className="max-h-[calc(100vh-14rem)] overflow-y-auto no-scrollbar scroll-smooth">
          <table className="w-full text-left border-collapse relative">
             <thead className="sticky top-0 z-20">
                <tr className="bg-white border-b border-[#1B4332]/10 shadow-[0_1px_0_rgba(27,67,50,0.05)]">
                   <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.2em] text-[#1B4332]/30 bg-white">Product Details</th>
                   <th className="px-6 py-6 text-[9px] font-black uppercase tracking-[0.2em] text-[#1B4332]/30 text-center bg-white">Measure</th>
                   <th className="px-6 py-6 text-[9px] font-black uppercase tracking-[0.2em] text-[#1B4332]/30 text-center bg-white">Price</th>
                   <th className="px-6 py-6 text-[9px] font-black uppercase tracking-[0.2em] text-[#1B4332]/30 bg-white">Artisan / Shop</th>
                   <th className="px-6 py-6 text-[9px] font-black uppercase tracking-[0.2em] text-[#1B4332]/30 text-center bg-white">Status</th>
                   <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.2em] text-[#1B4332]/30 text-right bg-white">Action</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-[#1B4332]/[0.03]">
                {products.map((p, idx) => (
                  <tr key={p.id || `prod-${idx}`} className="group hover:bg-[#FDFBF7] transition-colors">
                     {/* 🏺 PRODUCT IDENTITY */}
                     <td className="px-10 py-8">
                        <div className="space-y-1">
                           <p className="text-[14px] font-black text-[#1B4332] uppercase tracking-tight group-hover:text-[#BC6C25] transition-colors">{p.title || p.name}</p>
                           <span className="text-[8px] font-black text-[#1B4332]/30 uppercase tracking-widest">{p.category}</span>
                        </div>
                     </td>

                     {/* ⚖️ MEASURE */}
                     <td className="px-6 py-8 text-center">
                        <div className="flex flex-col items-center gap-1">
                           <Scale size={12} className="text-[#BC6C25] opacity-40" />
                           <span className="text-[11px] font-black text-[#1B4332]/60 uppercase tracking-tighter">{p.weight}{p.unit || 'g'}</span>
                        </div>
                     </td>

                     {/* 💰 PRICE */}
                     <td className="px-6 py-8 text-center">
                        <div className="space-y-0.5">
                           <p className="text-[15px] font-black text-[#1B4332]">₹{p.price}</p>
                           <p className="text-[8px] font-bold text-[#1B4332]/20 uppercase tracking-tighter">₹{(p.price / (p.weight || 1)).toFixed(2)}/u</p>
                        </div>
                     </td>

                     {/* 🏷️ SOURCE */}
                     <td className="px-6 py-8">
                        <div className="space-y-0.5">
                           <p className="text-[12px] font-black text-[#1B4332] uppercase tracking-tight">{p.sellers?.shop_name || 'Individual'}</p>
                           <p className="text-[9px] font-bold text-[#1B4332]/20 uppercase tracking-widest italic">{p.sellers?.profiles?.full_name || 'Kashmiri Artisan'}</p>
                        </div>
                     </td>

                     {/* 🛡️ STATUS */}
                     <td className="px-6 py-8">
                        <div className="flex justify-center">
                           <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 border ${p.is_approved ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-600' : p.status === 'rejected' ? 'bg-rose-500/5 border-rose-500/10 text-rose-600' : 'bg-amber-500/5 border-amber-500/10 text-amber-600'}`}>
                              <div className={`w-1 h-1 rounded-full ${p.is_approved ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : p.status === 'rejected' ? 'bg-rose-500' : 'bg-amber-500 animate-pulse shadow-[0_0_8px_#f59e0b]'}`} />
                              {p.is_approved ? 'Live' : p.status === 'rejected' ? 'Returned' : 'Review'}
                           </div>
                        </div>
                     </td>

                     {/* 🚀 COMMAND */}
                     <td className="px-10 py-8 text-right">
                        <button 
                          onClick={() => onInspect(p)}
                          className="inline-flex items-center gap-3 h-10 px-6 rounded-xl bg-[#1B4332] text-white hover:bg-[#BC6C25] transition-all active:scale-95 group/btn shadow-lg hover:shadow-[#BC6C25]/20"
                        >
                           <span className="text-[9px] font-black uppercase tracking-[0.2em]">Inspect</span>
                           <ArrowUpRight size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
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
