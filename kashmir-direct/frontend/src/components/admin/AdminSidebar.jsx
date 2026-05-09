import { ShieldCheck, LayoutDashboard, Package, Briefcase, Store, Settings, LogOut, Globe, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminSidebar({ activeTab, setActiveTab, stats, signOut, isCollapsed, setIsCollapsed, profile }) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navItems = [
    { id: 'overview', label: 'God Mode View', icon: LayoutDashboard },
    { id: 'products', label: 'Submissions', icon: Package, count: stats.pending },
    { id: 'managers', label: 'Operations', icon: Briefcase },
    { id: 'careers', label: 'Recruitment', icon: Users },
    { id: 'artisans', label: 'Artisan Registry', icon: Store },
    { id: 'settings', label: 'System Logic', icon: Settings }
  ];

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-64'} bg-[#1A2220] border-r border-white/5 flex flex-col h-screen sticky top-0 shrink-0 transition-all duration-500 relative group/sidebar z-[60]`}>
      <div className="p-6 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#BC6C25] rounded-xl flex items-center justify-center shadow-lg shadow-[#BC6C25]/20">
               <ShieldCheck size={18} className="text-white" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-[12px] font-black text-white uppercase tracking-tighter leading-none">Command</span>
                <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em] mt-1">Terminal</span>
              </div>
            )}
         </div>
         <button 
           onClick={() => setIsCollapsed(!isCollapsed)}
           className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all hover:bg-[#BC6C25] hover:border-[#BC6C25]"
         >
           {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
         </button>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 p-3.5 rounded-xl transition-all group relative ${
              activeTab === item.id 
                ? 'bg-[#BC6C25]/10 text-white' 
                : 'text-white/40 hover:bg-white/[0.03] hover:text-white/60'
            }`}
          >
            <item.icon size={18} className={activeTab === item.id ? 'text-[#BC6C25]' : 'group-hover:text-white transition-colors'} />
            {!isCollapsed && <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>}
            {!isCollapsed && item.count > 0 && (
              <span className="ml-auto bg-[#BC6C25] text-white text-[8px] font-black px-1.5 py-0.5 rounded-md shadow-lg shadow-[#BC6C25]/20">{item.count}</span>
            )}
            {activeTab === item.id && (
              <motion.div layoutId="activeNav" className="absolute left-0 w-1 h-6 bg-[#BC6C25] rounded-r-full" />
            )}
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-white/5">
         {!isCollapsed && (
           <button 
             onClick={() => setActiveTab('profile')}
             className="w-full text-left transition-transform active:scale-95 group/identity"
           >
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/[0.02] p-4 rounded-2xl mb-6 border border-white/5 group-hover/identity:bg-white/[0.05] group-hover/identity:border-[#BC6C25]/20 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[7px] font-black uppercase tracking-widest text-[#BC6C25]">Sovereign Node</p>
                  <span className="text-[6px] px-1.5 py-0.5 rounded bg-[#BC6C25]/20 text-[#BC6C25] font-black uppercase">Super Admin</span>
                </div>
                <p className="text-[10px] font-black text-white/80 truncate uppercase tracking-tighter group-hover/identity:text-white transition-colors">{profile?.full_name || 'Administrator'}</p>
                <p className="text-[8px] font-medium text-white/20 truncate italic mt-0.5">{profile?.email || 'secure.access@kashmir.direct'}</p>
             </motion.div>
           </button>
         )}
         <button 
            disabled={isLoggingOut}
            onClick={async () => {
                if (isLoggingOut) return;
                setIsLoggingOut(true);
                const toastId = toast.loading('Terminating Sovereign Session...');
                try {
                   await signOut();
                   toast.success('Session Terminated', { id: toastId });
                   router.push('/');
                } catch (err) {
                   console.error('Logout Failure:', err);
                   toast.error('Session purge failed, forcing exit.', { id: toastId });
                   router.push('/');
                } finally {
                   setIsLoggingOut(false);
                }
            }} 
            className={`flex items-center gap-3 text-rose-500/40 hover:text-rose-400 font-black text-[8px] uppercase tracking-widest transition-colors ${isCollapsed ? 'justify-center w-full' : 'px-2'} ${isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={isCollapsed ? 'Terminate Session' : ''}
         >
            <LogOut size={14} /> 
            {!isCollapsed && <span>Terminate</span>}
         </button>
      </div>
    </aside>
  );
}
