'use client';

import { User, Shield, Briefcase, HardHat, Store, ChevronRight, Fingerprint } from 'lucide-react';

export default function UserDirectory({ users }) {
  const getRoleIcon = (role) => {
    switch(role) {
      case 'manager': return <Briefcase size={16} />;
      case 'labour': return <HardHat size={16} />;
      case 'seller': return <Store size={16} />;
      case 'superadmin': return <Shield size={16} />;
      default: return <User size={16} />;
    }
  };

  return (
    <div className="bg-[#141A18]/60 backdrop-blur-3xl border border-white/5 rounded-[3.5rem] overflow-hidden shadow-2xl relative group">
      {/* 🎭 AMBIENT DEPTH */}
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-[#BC6C25]/5 blur-[120px] pointer-events-none" />

      <div className="p-12 border-b border-white/5 flex justify-between items-center relative z-10">
         <div>
            <h3 className="text-3xl font-black tracking-tighter uppercase italic text-white leading-none">System Directory</h3>
            <div className="flex items-center gap-3 mt-3">
               <div className="w-1.5 h-1.5 bg-[#BC6C25] rounded-full shadow-[0_0_10px_#BC6C25]" />
               <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Global Identity Registry • Active Records</p>
            </div>
         </div>
         <div className="px-5 py-3 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-3">
            <Fingerprint size={14} className="text-[#BC6C25] animate-pulse" />
            <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Biometric Sync: OK</span>
         </div>
      </div>

      <div className="overflow-x-auto relative z-10">
        <table className="w-full text-left">
           <thead>
              <tr className="bg-white/[0.01]">
                 <th className="px-12 py-8 text-[9px] font-black uppercase tracking-widest text-white/10">Identity Node</th>
                 <th className="px-12 py-8 text-[9px] font-black uppercase tracking-widest text-white/10">Access Clearance</th>
                 <th className="px-12 py-8 text-[9px] font-black uppercase tracking-widest text-white/10 text-right">Activity Status</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-white/[0.03]">
              {users.map((u, idx) => (
                <tr key={u.id || `u-${idx}`} className="hover:bg-white/[0.03] transition-all group/row">
                   <td className="px-12 py-10">
                      <div className="flex items-center gap-6">
                         <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-white/40 group-hover/row:bg-[#BC6C25]/10 group-hover/row:text-[#BC6C25] transition-all border border-white/5 shadow-lg">
                            <User size={20} />
                         </div>
                         <div className="space-y-1">
                            <p className="text-xl font-black tracking-tight text-white/90 group-hover/row:text-white transition-colors">{u.full_name || 'Anonymous Phantom'}</p>
                            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{u.email}</p>
                         </div>
                      </div>
                   </td>
                   <td className="px-12 py-10">
                      <div className="flex items-center gap-4">
                         <div className={`p-2.5 rounded-xl border ${u.role === 'superadmin' ? 'bg-[#BC6C25]/10 border-[#BC6C25]/30 text-[#BC6C25]' : 'bg-white/5 border-white/5 text-white/40'} shadow-md`}>
                            {getRoleIcon(u.role)}
                         </div>
                         <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">{u.role}</span>
                            <span className="text-[8px] font-bold text-white/10 uppercase tracking-widest italic mt-1">Permission Level: {u.role === 'superadmin' ? '∞' : '01'}</span>
                         </div>
                      </div>
                   </td>
                   <td className="px-12 py-10 text-right">
                      <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/[0.02] rounded-xl border border-white/5">
                         <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_5px_#10b981]" />
                         <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20">Encrypted Active</span>
                         <ChevronRight size={12} className="text-white/5 group-hover/row:translate-x-1 transition-transform" />
                      </div>
                   </td>
                </tr>
              ))}
           </tbody>
        </table>
      </div>
    </div>
  );
}
