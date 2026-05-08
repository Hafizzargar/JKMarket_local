'use client';

import { Package } from 'lucide-react';
import Button from '../ui/Button';

export default function SubmissionVault({ products, onInspect }) {
  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-[3.5rem] overflow-hidden shadow-2xl">
      <div className="p-12 border-b border-white/5 flex justify-between items-center">
         <div>
            <h3 className="text-2xl font-black tracking-tighter uppercase italic text-white">Submissions Vault</h3>
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1">Pending Validation Force</p>
         </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
           <thead>
              <tr className="bg-white/[0.01]">
                 <th className="px-12 py-8 text-[9px] font-black uppercase tracking-widest text-white/20">Artisan Listing</th>
                 <th className="px-12 py-8 text-[9px] font-black uppercase tracking-widest text-white/20">Shop Branch</th>
                 <th className="px-12 py-8 text-[9px] font-black uppercase tracking-widest text-white/20 text-right">System Action</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-white/[0.03]">
              {products.map((p, idx) => (
                <tr key={p.id || `prod-${idx}`} className="hover:bg-white/[0.02] transition-all group">
                   <td className="px-12 py-8">
                      <div className="flex items-center gap-8">
                         <div className="w-20 h-20 bg-white/5 rounded-[1.8rem] overflow-hidden border border-white/5 transition-transform group-hover:scale-105 shadow-xl">
                            <img src={p.images?.[0]} className="w-full h-full object-cover" />
                         </div>
                         <div>
                            <div className="flex items-center gap-3">
                               <p className="text-lg font-black tracking-tight text-white group-hover:text-[#BC6C25] transition-colors">{p.title}</p>
                               <span className={`px-2 py-0.5 rounded-lg text-[7px] font-black uppercase tracking-widest ${p.is_approved ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                  {p.is_approved ? 'LIVE' : 'PENDING'}
                               </span>
                            </div>
                            <p className="text-[10px] font-black text-white/20 uppercase mt-1">{p.category} • ₹{p.price}</p>
                         </div>
                      </div>
                   </td>
                   <td className="px-12 py-8">
                      <p className="text-sm font-bold text-white tracking-tight">{p.sellers?.shop_name}</p>
                      <p className="text-[10px] font-black text-[#BC6C25] uppercase tracking-widest mt-1 italic">
                         {p.sellers?.profiles?.full_name} • <span className="text-white/20 lowercase">{p.sellers?.profiles?.email}</span>
                      </p>
                   </td>
                   <td className="px-12 py-8 text-right">
                      <Button onClick={() => onInspect(p)} variant="primary" className="h-12 px-8 rounded-2xl bg-[#BC6C25] hover:bg-[#A65D1F] font-black text-[9px] tracking-widest uppercase shadow-lg shadow-[#BC6C25]/20 text-white">Inspect</Button>
                   </td>
                </tr>
              ))}
           </tbody>
        </table>
      </div>
    </div>
  );
}
