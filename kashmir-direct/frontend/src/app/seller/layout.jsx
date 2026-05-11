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
import SovereignLoading from '@/components/ui/SovereignLoading';

export default function SellerLayout({ children }) {
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

  // 🛡️ AUTHENTICATION EXCLUSION: Don't guard the login page
  const isAuthPage = pathname === '/seller/login';
  if (isAuthPage) return children;

  // 🛡️ SOVEREIGN LOADING
  if (loading && !user) return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
       <SovereignLoading message="Securing Seller Channel" />
    </div>
  );

  if (!user && !loading) return null;

  return (
    <AuthGuard allowedRoles={['admin', 'seller', 'shopkeeper']}>
      <div className="min-h-screen bg-[#FDFBF7] flex font-['Outfit',_sans-serif] text-[#1B4332] overflow-hidden relative">
        <div className="noise-overlay opacity-[0.02]" />

        <AnimatePresence>
          {(isSidebarOpen || !isMobile) && (
            <motion.aside 
              initial={isMobile ? { x: -300 } : false}
              animate={{ x: 0 }}
              exit={isMobile ? { x: -300 } : false}
              className={`${isSidebarOpen ? 'w-[280px]' : 'w-20'} fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-[#1B4332]/5 flex flex-col transition-all duration-300 z-[100] lg:z-50 shrink-0 shadow-2xl lg:shadow-none`}
            >
               {/* 🏷️ TOGGLE BUTTON */}
               {!isMobile && (
                 <button 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="absolute -right-3 top-10 w-7 h-7 rounded-full bg-white border border-[#1B4332]/10 text-[#BC6C25] flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all z-[110]"
                 >
                    {isSidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
                 </button>
               )}

               <div className={`p-6 flex items-center gap-4 border-b border-[#1B4332]/5 ${!isSidebarOpen && 'justify-center'}`}>
                  <div className="w-10 h-10 bg-[#BC6C25] rounded-xl flex items-center justify-center shrink-0 shadow-lg cursor-pointer" onClick={() => navigate('/seller/dashboard')}>
                     <Zap size={20} className="text-white fill-white" />
                  </div>
                  {isSidebarOpen && (
                    <div className="flex-1">
                        <span className="text-[12px] font-black uppercase tracking-[0.2em] text-[#1B4332] leading-none">Seller Panel</span>
                        <p className="text-[10px] font-medium text-[#1B4332]/40 tracking-wide">Manage Shop</p>
                    </div>
                  )}
               </div>

               <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar py-6">
                  {isSidebarOpen && (
                    <div className="px-5 mb-8 space-y-2">
                        <button onClick={() => navigate('/seller/add-product')} className="w-full h-11 bg-[#1B4332] text-white rounded-xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:opacity-90 transition-all group">
                          <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" /> New Product
                        </button>
                    </div>
                  )}

                  <nav className="px-3 space-y-8">
                     <div>
                        {isSidebarOpen && <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#1B4332]/20 px-4 mb-4">Main Menu</p>}
                        <div className="space-y-1.5">
                            {[
                              { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, path: '/seller/dashboard' },
                              { id: 'inventory', label: 'My Products', icon: Package, path: '/seller/inventory' },
                            ].map((tab) => (
                              <button key={tab.id} onClick={() => navigate(tab.path)} className={`w-full flex items-center gap-4 rounded-2xl transition-all ${pathname === tab.path ? 'bg-[#BC6C25] text-white shadow-xl' : 'bg-transparent text-[#1B4332]/50 hover:bg-[#1B4332]/5'} ${isSidebarOpen ? 'px-4 py-3' : 'h-12 justify-center'}`}>
                                <tab.icon size={20} className={pathname === tab.path ? 'text-white' : 'text-[#1B4332]/30'} />
                                {isSidebarOpen && <span className="text-[14px] font-black tracking-tight">{tab.label}</span>}
                              </button>
                            ))}
                        </div>
                     </div>
                  </nav>
               </div>

               <div className="p-4 border-t border-[#1B4332]/5 space-y-2">
                  <button onClick={() => navigate('/profile')} className={`w-full flex items-center gap-4 rounded-2xl transition-all border ${pathname === '/profile' ? 'bg-[#BC6C25] text-white border-[#BC6C25] shadow-lg' : 'bg-[#1B4332]/5 border-transparent text-[#1B4332]'} ${isSidebarOpen ? 'px-4 py-3' : 'w-12 h-12 mx-auto justify-center'}`}>
                    <User size={20} className={pathname === '/profile' ? 'text-white' : 'text-[#1B4332]/30'} />
                    {isSidebarOpen && <span className="text-[14px] font-black tracking-tight">Settings</span>}
                  </button>
                  <button onClick={async () => { await signOut(); window.location.replace('/'); }} className={`flex items-center gap-4 rounded-2xl transition-all text-[#1B4332]/40 hover:text-rose-600 ${isSidebarOpen ? 'w-full px-4 py-3' : 'w-12 h-12 mx-auto justify-center'}`}><LogOut size={20} /> {isSidebarOpen && <span className="text-[14px] font-black tracking-tight">Sign Out</span>}</button>
               </div>
            </motion.aside>
          )}
        </AnimatePresence>

        <main className="flex-1 h-screen overflow-y-auto no-scrollbar relative z-10 flex flex-col">
            <header className="h-16 lg:h-20 bg-white/60 backdrop-blur-3xl border-b border-[#1B4332]/5 flex items-center justify-between px-6 lg:px-12 shrink-0">
               <div className="flex items-center gap-6">
                  {isMobile && <button onClick={() => setIsSidebarOpen(true)} className="p-2.5 bg-white border border-[#1B4332]/10 rounded-xl shadow-xl"><Menu size={22} /></button>}
                  <div className="flex items-center gap-2.5 px-4 py-2 bg-[#1B4332]/5 rounded-full border border-[#1B4332]/5">
                     <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                     <h2 className="text-[10px] font-black tracking-[0.2em] uppercase text-[#1B4332]/40">Online</h2>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#BC6C25] to-[#A65D1F] rounded-2xl flex items-center justify-center text-white text-sm font-black shadow-2xl cursor-pointer ring-4 ring-white">{profile?.full_name?.[0] || 'A'}</div>
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
