'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Package, LogOut, Home, ShieldOff, Zap, Layers, Activity,
  ChevronLeft, ChevronRight,
  Bell, Plus, User, ShieldCheck, X, Clock, Menu,
  LayoutDashboard, ShoppingCart, BarChart3
} from 'lucide-react';
import AuthGuard from '@/components/auth/AuthGuard';

export default function DashboardLayout({ children }) {
  const { user, profile, loading, signOut, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const navigate = (path) => {
    router.push(path);
    if (isMobile) setIsSidebarOpen(false);
  };

  if (loading && !user) return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
       <div className="w-12 h-12 border-2 border-[#BC6C25]/20 border-t-[#BC6C25] rounded-full animate-spin" />
    </div>
  );

  if (!user && !loading) return null;

  return (
    <AuthGuard allowedRoles={['admin', 'seller', 'shopkeeper', 'customer', 'buyer']}>
      <div className="min-h-screen bg-[#FDFBF7] flex font-['Outfit',_sans-serif] text-[#1B4332] overflow-hidden relative">
        <div className="noise-overlay opacity-[0.02]" />

        <AnimatePresence>
          {(isSidebarOpen || !isMobile) && (
            <motion.aside 
              initial={isMobile ? { x: -300 } : false}
              animate={{ x: 0 }}
              exit={isMobile ? { x: -300 } : false}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`${isSidebarOpen ? 'w-[280px]' : 'w-20'} fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-[#1B4332]/5 flex flex-col transition-all duration-300 z-[100] lg:z-50 shrink-0 shadow-2xl lg:shadow-none`}
            >
               {!isMobile && (
                 <button 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="absolute -right-3 top-10 w-7 h-7 rounded-full bg-white border border-[#1B4332]/10 text-[#BC6C25] flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all z-[110]"
                 >
                    {isSidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
                 </button>
               )}

               <div className={`p-6 flex items-center justify-between border-b border-[#1B4332]/5 ${!isSidebarOpen && 'justify-center'}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#BC6C25] rounded-xl flex items-center justify-center shrink-0 shadow-lg cursor-pointer" onClick={() => navigate('/dashboard')}>
                       <Zap size={20} className="text-white fill-white" />
                    </div>
                    {isSidebarOpen && (
                      <div>
                        <span className="text-[12px] font-black uppercase tracking-[0.2em] text-[#1B4332] leading-none mb-1">Artisan Panel</span>
                        <p className="text-[10px] font-medium text-[#1B4332]/40 tracking-wide">Valley Direct</p>
                      </div>
                    )}
                  </div>
                  {isMobile && isSidebarOpen && (
                    <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-[#1B4332]/20 hover:text-rose-500 transition-colors">
                       <X size={20} />
                    </button>
                  )}
               </div>

               <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar py-6">
                  {isSidebarOpen && (
                    <div className="px-5 mb-8 space-y-2">
                       {(isAdmin || user?.email?.trim().toLowerCase() === 'hafezzargar987@gmail.com') && (
                         <button onClick={() => navigate('/admin/dashboard')} className="w-full h-11 bg-[#1B4332] text-white rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:opacity-90 transition-all"><ShieldCheck size={14} /> Admin Node</button>
                       )}
                        <button onClick={() => navigate('/inventory/new')} className="w-full h-11 bg-white text-[#BC6C25] rounded-xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] border border-[#BC6C25]/20 hover:border-[#BC6C25] transition-all group shadow-sm"><Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" /> New Product</button>
                    </div>
                  )}

                  <nav className="px-3 space-y-10">
                     <div>
                        {isSidebarOpen && <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#1B4332]/20 px-4 mb-4">Workspace</p>}
                        <div className="space-y-1.5">
                            {[
                              { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, path: '/dashboard' },
                              { id: 'inventory', label: 'Inventory', icon: Package, path: '/inventory' },
                              { id: 'orders', label: 'Orders', icon: ShoppingCart, path: '/orders' },
                            ].map((tab) => (
                              <button key={tab.id} onClick={() => navigate(tab.path)} className={`w-full flex items-center gap-4 rounded-2xl transition-all ${pathname === tab.path ? 'bg-[#BC6C25] text-white shadow-xl translate-x-1' : 'bg-transparent text-[#1B4332]/50 hover:bg-[#1B4332]/5 hover:text-[#1B4332]'} ${isSidebarOpen ? 'px-4 py-3' : 'h-12 justify-center'}`}>
                                <tab.icon size={20} className={pathname === tab.path ? 'text-white' : 'text-[#1B4332]/30'} />
                                {isSidebarOpen && <span className="text-[14px] font-black tracking-tight">{tab.label}</span>}
                              </button>
                            ))}
                        </div>
                     </div>
                  </nav>
               </div>

               <div className="p-4 border-t border-[#1B4332]/5 space-y-2 bg-[#FDFBF7]/50">
                  <button onClick={() => navigate('/profile')} className={`w-full flex items-center gap-4 rounded-2xl transition-all ${pathname === '/profile' ? 'bg-[#BC6C25] text-white shadow-lg' : 'bg-white border border-[#1B4332]/5 text-[#1B4332] hover:bg-[#1B4332]/5'} ${isSidebarOpen ? 'px-4 py-3' : 'w-12 h-12 mx-auto justify-center'}`}>
                    <User size={20} className={pathname === '/profile' ? 'text-white' : 'text-[#1B4332]/30'} />
                    {isSidebarOpen && <span className="text-[14px] font-black tracking-tight">Settings</span>}
                  </button>
                  <button onClick={async () => { await signOut(); window.location.replace('/'); }} className={`flex items-center gap-4 rounded-2xl transition-all bg-transparent text-[#1B4332]/40 hover:text-rose-600 ${isSidebarOpen ? 'w-full px-4 py-3' : 'w-12 h-12 mx-auto justify-center'}`}><LogOut size={20} /> {isSidebarOpen && <span className="text-[14px] font-black tracking-tight">Sign Out</span>}</button>
               </div>
            </motion.aside>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isMobile && isSidebarOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-[#1B4332]/40 backdrop-blur-md z-[90] lg:hidden" />
          )}
        </AnimatePresence>

        <main className="flex-1 h-screen overflow-y-auto no-scrollbar relative z-10 flex flex-col">
            <header className="h-16 lg:h-20 bg-white/60 backdrop-blur-3xl border-b border-[#1B4332]/5 flex items-center justify-between px-6 lg:px-12 shrink-0">
               <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2.5 px-4 py-2 bg-[#1B4332]/5 rounded-full border border-[#1B4332]/5 shadow-inner">
                     <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                     <h2 className="text-[10px] font-black tracking-[0.2em] uppercase text-[#1B4332]/40">Active Session</h2>
                  </div>
               </div>

               <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white border border-[#1B4332]/10 rounded-xl text-[#1B4332]/40 shadow-sm hover:text-[#BC6C25] transition-all cursor-pointer">
                    <Bell size={18} />
                  </div>
                  
                  <div className="flex items-center gap-3" onClick={() => navigate('/profile')}>
                    <div className="w-10 h-10 bg-gradient-to-br from-[#BC6C25] to-[#A65D1F] rounded-2xl flex items-center justify-center text-white text-sm font-black shadow-2xl cursor-pointer ring-4 ring-white">{profile?.full_name?.[0] || 'A'}</div>
                  </div>

                  {isMobile && (
                    <button onClick={() => setIsSidebarOpen(true)} className="p-2.5 bg-white border border-[#1B4332]/10 rounded-xl text-[#1B4332] shadow-xl active:scale-90 transition-all ml-1">
                      <Menu size={22} />
                    </button>
                  )}
               </div>
            </header>
           <div className="flex-1 overflow-y-auto p-6 lg:p-12 no-scrollbar">
              <div className="max-w-7xl mx-auto">
                 {children}
              </div>
           </div>
        </main>
      </div>
    </AuthGuard>
  );
}
