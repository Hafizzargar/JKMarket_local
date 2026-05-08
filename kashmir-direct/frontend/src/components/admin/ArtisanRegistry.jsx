'use client';

import { Store, CheckCircle2, ShieldOff, Zap } from 'lucide-react';
import Button from '../ui/Button';

export default function ArtisanRegistry({ shopkeepers, onEdit }) {
  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-[4rem] overflow-hidden shadow-2xl">
      <div className="p-12 border-b border-white/5">
         <h3 className="text-2xl font-black tracking-tighter uppercase italic text-white">Artisan Registry</h3>
         <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1">Verified Marketplace Partners</p>
      </div>
      <table className="w-full text-left">
         <thead>
            <tr className="bg-white/[0.01]">
               <th className="px-12 py-8 text-[9px] font-black uppercase tracking-widest text-white/20">Shop Branch</th>
               <th className="px-12 py-8 text-[9px] font-black uppercase tracking-widest text-white/20">Status</th>
               <th className="px-12 py-8 text-[9px] font-black uppercase tracking-widest text-white/20 text-right">System Action</th>
            </tr>
         </thead>
         <tbody className="divide-y divide-white/[0.03]">
            {shopkeepers.map((sk) => (
              <tr key={sk.id} className="hover:bg-white/[0.02] transition-all group">
                 <td className="px-12 py-10">
                    <div className="flex items-center gap-8">
                       <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-[#BC6C25] font-black text-xl group-hover:bg-[#BC6C25] group-hover:text-white transition-all shadow-xl">
                          {sk.shop_name[0]}
                       </div>
                       <div>
                          <p className="text-xl font-black tracking-tight text-white">{sk.shop_name}</p>
                          <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1">{sk.profiles?.email}</p>
                       </div>
                    </div>
                 </td>
                 <td className="px-12 py-10">
                    <div className="flex items-center gap-3">
                       <span className={`px-5 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest ${sk.is_verified ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                          {sk.is_verified ? 'Active' : 'Suspended'}
                       </span>
                       <span className="text-[10px] font-bold text-white/10 uppercase tracking-tighter italic">Slots: {sk.product_limit}</span>
                    </div>
                 </td>
                 <td className="px-12 py-10 text-right">
                    <Button onClick={() => onEdit(sk)} variant="outline" className="rounded-2xl font-black h-12 px-8 border-white/10 text-white/40 hover:text-white">Edit Access</Button>
                 </td>
              </tr>
            ))}
         </tbody>
      </table>
    </div>
  );
}
