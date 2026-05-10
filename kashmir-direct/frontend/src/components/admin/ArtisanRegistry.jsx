'use client';

import { Store, CheckCircle2, ShieldOff, Zap, ChevronRight, Globe } from 'lucide-react';
import Button from '../ui/Button';

export default function ArtisanRegistry({ shopkeepers, onEdit }) {
  return (
    <div className="bg-white border border-[#1B4332]/5 rounded-[3.5rem] overflow-hidden shadow-[0_30px_70px_-20px_rgba(27,67,50,0.1)] relative group">
      {/* 🎭 AMBIENT GLOW */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-[#BC6C25]/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 overflow-x-auto no-scrollbar">
        <table className="w-full text-left">
           <thead>
              <tr className="bg-[#1B4332]/[0.01]">
                 <th className="px-8 sm:px-12 py-8 text-[9px] font-black uppercase tracking-widest text-[#1B4332]/20">Shop Details</th>
                 <th className="px-8 sm:px-12 py-8 text-[9px] font-black uppercase tracking-widest text-[#1B4332]/20">Verification Status</th>
                 <th className="px-8 sm:px-12 py-8 text-[9px] font-black uppercase tracking-widest text-[#1B4332]/20 text-right">Actions</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-[#1B4332]/[0.05]">
              {shopkeepers.map((sk) => (
                <tr key={sk.id} className="hover:bg-[#1B4332]/[0.02] transition-all group/row">
                   <td className="px-8 sm:px-12 py-8 sm:py-10">
                      <div className="flex items-center gap-6 sm:gap-8">
                         <div className="relative">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#1B4332]/5 rounded-2xl flex items-center justify-center text-[#BC6C25] font-black text-xl group-hover/row:bg-[#BC6C25] group-hover/row:text-white transition-all shadow-sm border border-[#1B4332]/5 relative z-10">
                               {sk.shop_name[0]}
                            </div>
                            <div className="absolute inset-0 bg-[#BC6C25]/10 blur-xl rounded-full opacity-0 group-hover/row:opacity-100 transition-opacity" />
                         </div>
                         <div className="flex-1 min-w-0">
                           <p className="text-[13px] lg:text-[15px] font-black text-[#1B4332] truncate uppercase tracking-tighter leading-none group-hover:text-[#BC6C25] transition-colors">
                              {sk.shop_name || 'New Boutique'}
                           </p>
                           <p className="text-[9px] lg:text-[11px] font-black text-[#1B4332]/20 uppercase tracking-[0.2em] mt-1.5 truncate italic">
                              {sk.profiles?.full_name || 'Individual Artisan'}
                           </p>
                        </div>
                      </div>
                   </td>
                   <td className="px-8 sm:px-12 py-8 sm:py-10">
                      <div className="flex items-center gap-6">
                         <div className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-[0.2em] flex items-center gap-3 border ${sk.is_verified ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-600' : 'bg-rose-500/5 border-rose-500/10 text-rose-600'}`}>
                            <div className={`w-1 h-1 rounded-full ${sk.is_verified ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'}`} />
                            {sk.is_verified ? 'Verified' : 'Suspended'}
                         </div>
                         <div className="flex flex-col">
                            <span className="text-[9px] sm:text-[10px] font-black text-[#1B4332]/40 uppercase tracking-tighter leading-none italic mb-1">Product Limit</span>
                            <span className="text-[10px] sm:text-[11px] font-bold text-[#BC6C25] uppercase tracking-tighter italic">{sk.product_limit} Slots</span>
                         </div>
                      </div>
                   </td>
                   <td className="px-8 sm:px-12 py-8 sm:py-10 text-right">
                      <button 
                        onClick={() => onEdit(sk)}
                        className="h-11 px-6 sm:px-8 rounded-2xl bg-[#1B4332]/5 border border-[#1B4332]/5 hover:border-[#BC6C25]/40 hover:bg-[#BC6C25]/10 text-[#1B4332] font-black text-[9px] tracking-[0.2em] uppercase transition-all flex items-center gap-3 ml-auto group/btn shadow-sm"
                      >
                         Edit Permissions
                         <ChevronRight size={14} className="text-[#1B4332]/20 group-hover/btn:text-[#BC6C25] group-hover/btn:translate-x-1 transition-all" />
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
