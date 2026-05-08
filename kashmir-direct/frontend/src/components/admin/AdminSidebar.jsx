'use client';

import { ShieldCheck, LayoutDashboard, Package, Briefcase, Store, Settings, LogOut, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminSidebar({ activeTab, setActiveTab, stats, signOut }) {
  const navItems = [
    { id: 'overview', label: 'God Mode View', icon: LayoutDashboard },
    { id: 'products', label: 'Submissions', icon: Package, count: stats.pending },
    { id: 'managers', label: 'Operations', icon: Briefcase },
    { id: 'artisans', label: 'Artisan Registry', icon: Store },
    { id: 'settings', label: 'System Logic', icon: Settings }
  ];

  return (
    <aside className="w-80 bg-[#0A1A13] border-r border-white/5 flex flex-col h-screen sticky top-0 shrink-0">
      <div className="p-10 border-b border-white/5 flex items-center gap-5">
         <div className="w-12 h-12 bg-[#BC6C25] rounded-[1.2rem] flex items-center justify-center shadow-2xl shadow-[#BC6C25]/20">
            <ShieldCheck size={28} className="text-white" />
         </div>
         <div>
            <h1 className="text-xl font-black tracking-tighter uppercase italic text-white">Command</h1>
            <p className="text-[7px] font-black uppercase tracking-[0.5em] text-[#BC6C25]">Sovereign Terminal</p>
         </div>
      </div>

      <nav className="flex-1 p-8 space-y-2">
         {navItems.map(item => (
           <button 
            key={item.id} 
            onClick={() => setActiveTab(item.id)} 
            className={`w-full flex items-center justify-between px-6 py-5 rounded-[1.5rem] transition-all group ${activeTab === item.id ? 'bg-white/5 text-[#BC6C25]' : 'text-white/20 hover:text-white/60 hover:bg-white/[0.02]'}`}
           >
              <div className="flex items-center gap-5">
                 <item.icon size={20} />
                 <span className="text-[10px] font-black uppercase tracking-[0.2em]">{item.label}</span>
              </div>
              {item.count > 0 && <span className="bg-rose-500 text-white text-[8px] px-2 py-1 rounded-full font-black">{item.count}</span>}
           </button>
         ))}
      </nav>

      <div className="p-10 border-t border-white/5">
         <div className="bg-white/[0.03] p-6 rounded-3xl mb-8 border border-white/5">
            <p className="text-[8px] font-black uppercase tracking-widest text-[#BC6C25]">Identity Status</p>
            <p className="text-xs font-bold mt-2 flex items-center gap-2 text-white/60"><Globe size={12} /> Phantom Mode: ON</p>
         </div>
         <button 
            onClick={async () => {
               try {
                  await signOut();
                  window.location.href = '/staff';
               } catch (err) {
                  window.location.href = '/staff';
               }
            }} 
            className="flex items-center gap-4 text-rose-500/60 hover:text-rose-400 font-black text-[9px] uppercase tracking-widest px-4 transition-colors"
         >
            <LogOut size={16} /> Terminate Session
         </button>
      </div>
    </aside>
  );
}
