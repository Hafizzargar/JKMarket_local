'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { 
  ShieldCheck, LayoutDashboard, Search, Menu, X, Loader2, RefreshCw
} from 'lucide-react';
import AuthGuard from '@/components/auth/AuthGuard';
import AdminSidebar from '@/components/admin/AdminSidebar';
import GovernanceDropdown from '@/components/admin/GovernanceDropdown';
import SovereignLoading from '@/components/ui/SovereignLoading';

export default function SuperAdminLayout({ children }) {
  const { user, profile, loading, signOut, isAdmin } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);
  
  // 🛰️ STATS STATE (Shared across layout)
  const [stats, setStats] = useState({ products: 0, sellers: 0, pending: 0, revenue: '₹0' });

  // 🛰️ GLOBAL KINETIC SYNC
  useEffect(() => {
    // 🔄 Trigger on Tab Shift
    setIsDataLoading(true);
    const timer = setTimeout(() => setIsDataLoading(false), 1500);
    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    fetchGlobalStats();
  }, []);

  useEffect(() => {
    // 📡 Trigger on Manual/Internal Sync Events
    const handlePlatformSync = () => {
      setIsDataLoading(true);
      fetchGlobalStats();
      setTimeout(() => setIsDataLoading(false), 1500);
    };
    window.addEventListener('platform-sync', handlePlatformSync);
    return () => window.removeEventListener('platform-sync', handlePlatformSync);
  }, []);

  const fetchGlobalStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      const data = await response.json();
      if (!data.error) {
        setStats({
          products: data.products,
          sellers: data.sellers,
          pending: data.pending,
          revenue: data.revenue
        });
      }
    } catch (err) {
      console.error('Stats Sync Failure:', err);
    }
  };

  const changeTab = (tabId) => {
    // If tab maps to a path, navigate there
    const paths = {
      overview: '/super-admin/dashboard',
      products: '/super-admin/products',
      artisans: '/super-admin/artisans',
      users: '/super-admin/users',
      managers: '/super-admin/managers',
      careers: '/super-admin/careers',
      settings: '/super-admin/settings'
    };
    if (paths[tabId]) router.push(paths[tabId]);
  };

  if (loading && !user) return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
       <SovereignLoading message="Securing Admin Channel" />
    </div>
  );

  return (
    <AuthGuard allowedRoles={['admin', 'superadmin']}>
      <div className="min-h-screen bg-[#FDFBF7] flex font-['Inter',_sans-serif] text-[#1B4332] selection:bg-[#BC6C25] selection:text-white relative overflow-hidden">
        <div className="bg-organic-mesh opacity-10 absolute inset-0 pointer-events-none" />
        
        {/* 📱 MOBILE ADMIN HEADER */}
        <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#FDFBF7]/80 backdrop-blur-xl border-b border-[#1B4332]/5 flex items-center justify-between px-6 z-[70]">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#BC6C25] rounded-lg flex items-center justify-center shadow-lg">
                 <ShieldCheck size={16} className="text-white" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#1B4332]/40">Command</span>
           </div>
           <button 
             onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
             className="w-10 h-10 rounded-xl bg-[#1B4332]/5 border border-[#1B4332]/10 flex items-center justify-center text-[#BC6C25]"
           >
              {isSidebarCollapsed ? <LayoutDashboard size={20} /> : <X size={20} />}
           </button>
        </header>

        <AdminSidebar 
          activeTab={pathname.split('/').pop()} 
          setActiveTab={changeTab} 
          stats={stats} 
          signOut={signOut} 
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
          profile={profile}
        />

        <main className="flex-1 h-[100dvh] pt-16 lg:pt-0 flex flex-col overflow-hidden relative">
          {/* 🏛️ FIXED COMMAND HEADER */}
          <header className="bg-[#FDFBF7]/80 backdrop-blur-3xl border-b border-[#1B4332]/5 px-6 lg:px-12 py-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shrink-0 z-[60]">
             <div>
                <div className="flex items-center gap-3 mb-1">
                   <h2 className="text-lg lg:text-xl font-black tracking-tighter uppercase italic leading-none text-[#1B4332]">
                      {pathname.split('/').pop()} Management
                   </h2>

                </div>
                <div className="flex items-center gap-2">
                   <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
                   <p className="text-[7px] font-black text-[#1B4332]/20 uppercase tracking-[0.3em]">System Active</p>
                </div>
             </div>
             <div className="flex items-center gap-4 lg:gap-6 ml-auto">
                <div className="relative hidden xl:block">
                   <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1B4332]/20" />
                   <input type="text" placeholder="Search registry..." className="bg-[#1B4332]/5 border border-[#1B4332]/10 rounded-xl pl-10 pr-4 py-2.5 text-[9px] font-black uppercase tracking-widest w-48 text-[#1B4332] focus:border-[#BC6C25]/40 focus:outline-none transition-all" />
                </div>
                
                <GovernanceDropdown onAction={changeTab} />
                
                <motion.button 
                  onClick={() => {
                    setIsDataLoading(true);
                    window.dispatchEvent(new CustomEvent('platform-sync'));
                    // Provide a sophisticated 1.5s kinetic cycle
                    setTimeout(() => setIsDataLoading(false), 1500);
                  }}
                  animate={{ 
                    backgroundColor: isDataLoading ? 'rgba(188, 108, 37, 0.15)' : 'rgba(255, 255, 255, 0.4)',
                    borderColor: isDataLoading ? 'rgba(188, 108, 37, 0.3)' : 'rgba(27, 67, 50, 0.05)',
                    scale: isDataLoading ? 0.95 : 1
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-xl border shadow-sm flex items-center justify-center text-[#1B4332]/60 hover:text-[#BC6C25] transition-all group relative overflow-hidden"
                  title="Sync Current Registry"
                >
                   <motion.div
                     animate={{ rotate: isDataLoading ? 360 : 0 }}
                     transition={{ duration: 1, repeat: isDataLoading ? Infinity : 0, ease: "linear" }}
                     className="relative z-10"
                   >
                      <RefreshCw size={18} className={isDataLoading ? 'text-[#BC6C25]' : 'group-hover:rotate-180 transition-transform duration-500'} />
                   </motion.div>
                   {isDataLoading && (
                     <motion.div 
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       className="absolute inset-0 bg-[#BC6C25]/5 animate-pulse"
                     />
                   )}
                </motion.button>

                <div className="flex items-center gap-3 bg-white/40 p-1 rounded-2xl border border-[#1B4332]/5 shadow-sm hover:border-[#BC6C25]/20 transition-all cursor-pointer group/prof" onClick={() => router.push('/super-admin/settings')}>
                   <div className="hidden sm:flex flex-col items-end px-2">
                      <p className="text-[9px] font-black text-[#1B4332] uppercase tracking-tighter leading-none group-hover/prof:text-[#BC6C25] transition-colors">{profile?.full_name?.split(' ')[0] || 'Admin'}</p>
                      <p className="text-[7px] font-black text-[#BC6C25] uppercase tracking-[0.2em] mt-1">Admin</p>
                   </div>
                   <div className="w-9 h-9 bg-gradient-to-br from-[#1B4332] to-[#0A1A13] rounded-xl border border-white/10 flex items-center justify-center text-white font-black text-[10px] shadow-xl shrink-0 overflow-hidden">
                      {profile?.avatar_url || profile?.profile_image ? (
                        <img src={profile.avatar_url || profile.profile_image} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <span>
                          {profile?.full_name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'AD'}
                        </span>
                      )}
                   </div>
                </div>
             </div>
          </header>

          <div className="flex-1 overflow-hidden p-4 lg:p-6 relative">
             {/* ✨ AMBIENT GLOWS THAT SCROLL WITH CONTENT */}
             <div className="absolute top-0 right-0 w-[30%] h-[30%] bg-[#BC6C25]/5 blur-[120px] pointer-events-none" />
             <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-[#1B4332]/5 blur-[120px] pointer-events-none" />
             
             <div className="max-w-[1600px] mx-auto relative">
               {children}
             </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
