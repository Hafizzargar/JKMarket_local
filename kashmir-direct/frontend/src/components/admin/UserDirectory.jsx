'use client';

import { User, Shield, Briefcase, HardHat, ShoppingBag } from 'lucide-react';
import Button from '../ui/Button';

export default function UserDirectory({ users }) {
  const getRoleIcon = (role) => {
    switch(role) {
      case 'manager': return <Briefcase size={14} />;
      case 'labour': return <HardHat size={14} />;
      case 'seller': return <Store size={14} />;
      default: return <User size={14} />;
    }
  };

  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-[4rem] overflow-hidden shadow-2xl">
      <div className="p-12 border-b border-white/5">
         <h3 className="text-2xl font-black tracking-tighter uppercase italic text-white">System Directory</h3>
         <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1">Global User Base</p>
      </div>
      <table className="w-full text-left">
         <thead>
            <tr className="bg-white/[0.01]">
               <th className="px-12 py-8 text-[9px] font-black uppercase tracking-widest text-white/20">Identity</th>
               <th className="px-12 py-8 text-[9px] font-black uppercase tracking-widest text-white/20">Access Role</th>
               <th className="px-12 py-8 text-[9px] font-black uppercase tracking-widest text-white/20 text-right">Activity</th>
            </tr>
         </thead>
         <tbody className="divide-y divide-white/[0.03]">
            {users.map((u, idx) => (
              <tr key={u.id || `u-${idx}`} className="hover:bg-white/[0.02] transition-all group">
                 <td className="px-12 py-10">
                    <div>
                       <p className="text-lg font-black text-white">{u.full_name || 'Anonymous'}</p>
                       <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1">{u.email}</p>
                    </div>
                 </td>
                 <td className="px-12 py-10">
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-white/5 rounded-lg text-[#BC6C25]">{getRoleIcon(u.role)}</div>
                       <span className="text-[10px] font-black uppercase tracking-widest text-white/60">{u.role}</span>
                    </div>
                 </td>
                 <td className="px-12 py-10 text-right text-white/10 text-[10px] font-black uppercase tracking-[0.2em]">
                    Encrypted Session
                 </td>
              </tr>
            ))}
         </tbody>
      </table>
    </div>
  );
}
