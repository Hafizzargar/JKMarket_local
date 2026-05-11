import { ShieldCheck, LayoutDashboard, Package, Briefcase, Store, Settings, LogOut, Globe, Users, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AdminSidebar({ activeTab, setActiveTab, stats, signOut, isCollapsed, setIsCollapsed, profile }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setIsCollapsed(true);
      else setIsCollapsed(false);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const navItems = [
    { id: 'admin', icon: LayoutDashboard, label: 'Admin Panel', path: '/super-admin' },
    { id: 'products', icon: ShoppingBag, label: 'All Products', path: '/super-admin/products' },
    { id: 'approval', icon: ShieldCheck, label: 'Check Products', path: '/super-admin/products/approval', count: stats?.pending || 0 },
    { id: 'managers', icon: Users, label: 'Staff Managers', path: '/super-admin/managers' },
    { id: 'careers', icon: Briefcase, label: 'Careers', path: '/super-admin/careers' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/super-admin/settings' }
  ];

  return (
    <>
      {/* 🌑 MOBILE BACKDROP */}
      <AnimatePresence>
        {!isCollapsed && isMobile && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCollapsed(true)}
            className="fixed inset-0 bg-[#1B4332]/40 backdrop-blur-sm z-[75] lg:hidden"
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {(isCollapsed === false || !isMobile) && (
          <motion.aside 
            key="admin-sidebar"
            initial={isMobile ? { x: -300 } : { width: isCollapsed ? 80 : 256 }}
            animate={{ 
              x: 0,
              width: isCollapsed ? 80 : 256 
            }}
            exit={isMobile ? { x: -300 } : { opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed lg:sticky top-0 left-0 h-screen bg-[#FDFBF7] border-r border-[#1B4332]/5 flex flex-col shrink-0 z-[80] lg:z-50 shadow-2xl lg:shadow-none overflow-hidden"
          >
            <div className="p-6 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#BC6C25] rounded-xl flex items-center justify-center shadow-lg shadow-[#BC6C25]/20">
                     <ShieldCheck size={18} className="text-white" />
                  </div>
                  {!isCollapsed && (
                    <div className="flex flex-col">
                      <span className="text-[12px] font-black text-[#1B4332] uppercase tracking-tighter leading-none">Admin Panel</span>
                      <span className="text-[8px] font-black text-[#1B4332]/20 uppercase tracking-[0.2em] mt-1">Management</span>
                    </div>
                  )}
               </div>
               <button 
                 onClick={() => setIsCollapsed(!isCollapsed)}
                 className="w-6 h-6 rounded-full bg-[#1B4332]/5 border border-[#1B4332]/10 flex items-center justify-center text-[#1B4332]/40 hover:text-[#1B4332] transition-all hover:bg-[#BC6C25] hover:border-[#BC6C25] hover:text-white"
               >
                 {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
               </button>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto no-scrollbar">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    router.push(item.path);
                    if (isMobile) setIsCollapsed(true);
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all group relative ${
                    pathname === item.path
                      ? 'bg-[#BC6C25] text-white shadow-xl shadow-[#BC6C25]/20' 
                      : 'text-[#1B4332]/40 hover:bg-[#1B4332]/[0.03] hover:text-[#1B4332]/60'
                  }`}
                >
                  <item.icon size={16} className={pathname === item.path ? 'text-white' : 'group-hover:text-[#1B4332] transition-colors'} />
                  {!isCollapsed && (
                    <span className="text-[8px] font-black uppercase tracking-[0.15em] whitespace-nowrap truncate">
                      {item.label}
                    </span>
                  )}
                  {!isCollapsed && item.count > 0 && (
                    <span className={`ml-auto ${pathname === item.path ? 'bg-white text-[#BC6C25]' : 'bg-[#BC6C25] text-white'} text-[8px] font-black px-1.5 py-0.5 rounded-md shadow-lg shadow-[#BC6C25]/20`}>{item.count}</span>
                  )}
                  {pathname === item.path && (
                    <motion.div layoutId="activeNav" className="absolute left-0 w-1 h-6 bg-white rounded-r-full" />
                  )}
                </button>
              ))}
            </nav>

            <div className="p-6 border-t border-[#1B4332]/5 space-y-4">
               {!isCollapsed && (
                 <button 
                   onClick={() => {
                     router.push('/super-admin/settings');
                     if (isMobile) setIsCollapsed(true);
                   }}
                   className="w-full text-left transition-transform active:scale-95 group/identity"
                 >
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`p-3 rounded-2xl border transition-all flex items-center gap-3 ${pathname === '/super-admin/settings' ? 'bg-[#BC6C25]/10 border-[#BC6C25]/20' : 'bg-[#1B4332]/[0.02] border-[#1B4332]/5 group-hover/identity:bg-[#1B4332]/[0.05] group-hover/identity:border-[#BC6C25]/20'}`}>
                      <div className="w-8 h-8 rounded-lg bg-[#BC6C25] flex items-center justify-center text-white text-[10px] font-black overflow-hidden shrink-0">
                        {profile?.avatar_url || profile?.profile_image ? (
                          <img src={profile.avatar_url || profile.profile_image} className="w-full h-full object-cover" />
                        ) : (
                          profile?.full_name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'AD'
                        )}
                      </div>
                      <div className="flex-1 truncate">
                        <p className="text-[9px] font-black text-[#1B4332] truncate uppercase tracking-tighter leading-none">{profile?.full_name?.split(' ')[0] || 'Admin'}</p>
                        <p className="text-[7px] font-black text-[#BC6C25] uppercase tracking-widest mt-1">Admin</p>
                      </div>
                    </motion.div>
                 </button>
               )}

               <div className="space-y-1">
                 <button 
                   onClick={async () => {
                     if (isLoggingOut) return;
                     setIsLoggingOut(true);
                     const toastId = toast.loading('Terminating Session...');
                     try {
                        await signOut();
                        toast.success('Session Terminated', { id: toastId });
                        window.location.replace('/');
                     } catch (err) {
                        console.error('Logout Failure:', err);
                        toast.error('Sync Error, Forcing Exit', { id: toastId });
                        window.location.replace('/');
                     } finally {
                        setIsLoggingOut(false);
                     }
                   }}
                   disabled={isLoggingOut}
                   className="w-full flex items-center gap-4 p-3.5 rounded-xl text-rose-600/40 hover:bg-rose-500/5 hover:text-rose-600 transition-all uppercase text-[10px] font-black tracking-widest"
                 >
                   <LogOut size={18} />
                   {!isCollapsed && <span>Logout</span>}
                 </button>
               </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
