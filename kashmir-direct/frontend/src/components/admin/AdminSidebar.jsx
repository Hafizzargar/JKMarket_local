import { ShieldCheck, LayoutDashboard, Package, Briefcase, Settings, LogOut, Users, ChevronLeft, ChevronRight, ShoppingBag, ChevronDown, Database, FileText, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminSidebar({ activeTab, setActiveTab, stats, signOut, isCollapsed, setIsCollapsed, profile }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [expandedItems, setExpandedItems] = useState([]);

  const toggleExpand = (id) => {
    setExpandedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

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
    { id: 'admin', icon: LayoutDashboard, label: 'Dashboard', path: '/super-admin/dashboard' },
    { id: 'artisans', icon: Users, label: 'Identity Registry', path: '/super-admin/artisans' },
    { 
      id: 'products', 
      icon: ShoppingBag, 
      label: 'Product Vault', 
      path: '/super-admin/products',
      count: stats?.pending || 0
    },
    { id: 'managers', icon: Users, label: 'Staff Managers', path: '/super-admin/managers' },
    { id: 'careers', icon: Briefcase, label: 'Careers', path: '/super-admin/careers' },
    { id: 'orders', icon: Package, label: 'Buyer Orders', path: '/super-admin/orders' },
    { 
      id: 'vault', 
      icon: Database, 
      label: 'Platform Vault', 
      children: [
        { id: 'audit', label: 'Governance Audit', icon: ShieldCheck, path: '/super-admin/vault/audit' },
        { id: 'logs', label: 'System Logs', icon: FileText, path: '/super-admin/vault/logs' },
        { id: 'activity', label: 'Pulse Monitor', icon: Activity, path: '/super-admin/vault/pulse' }
      ]
    },
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
            className="fixed lg:sticky top-0 left-0 h-screen bg-[#FDFBF7] border-r border-[#1B4332]/5 flex flex-col shrink-0 z-[1000] lg:z-[1000] shadow-2xl lg:shadow-none"
          >
            {/* 🎚️ ROOT-LEVEL BORDER TOGGLE (ABSOLUTE VISIBILITY) */}
            <motion.button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              whileHover={{ scale: 1.15, filter: 'brightness(1.1)' }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="absolute -right-5 top-12 w-10 h-10 rounded-full bg-[#BC6C25] border-2 border-white flex items-center justify-center text-white shadow-[0_4px_25px_rgba(188,108,37,0.4)] z-[999] group cursor-pointer transition-all"
            >
              <AnimatePresence mode="wait">
                 <motion.div
                   key={isCollapsed ? 'right' : 'left'}
                   initial={{ opacity: 0, rotate: -180 }}
                   animate={{ opacity: 1, rotate: 0 }}
                   exit={{ opacity: 0, rotate: 180 }}
                   transition={{ duration: 0.3 }}
                 >
                    {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                 </motion.div>
              </AnimatePresence>
            </motion.button>

            <div className="p-6 flex items-center relative z-[100]">
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
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto no-scrollbar">
              {navItems.map((item) => {
                const hasChildren = item.children && item.children.length > 0;
                const isExpanded = expandedItems.includes(item.id);
                const isActive = item.path === '/super-admin/dashboard' 
                  ? pathname === item.path 
                  : pathname.startsWith(item.path) || (hasChildren && item.children.some(child => pathname.startsWith(child.path)));

                return (
                  <div key={item.id} className="space-y-1">
                    <button
                      onClick={() => {
                        if (hasChildren) {
                          toggleExpand(item.id);
                        } else {
                          router.push(item.path);
                          if (isMobile) setIsCollapsed(true);
                        }
                      }}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all group relative ${
                        isActive
                          ? (hasChildren ? 'bg-[#1B4332]/5 text-[#1B4332]' : 'bg-[#BC6C25] text-white shadow-xl shadow-[#BC6C25]/20') 
                          : 'text-[#1B4332]/40 hover:bg-[#1B4332]/[0.03] hover:text-[#1B4332]/60'
                      }`}
                    >
                      {/* 🌟 HIGH-PRIORITY HIGHLIGHTER (Pulse Effect for Pending items) */}
                      {item.id === 'products' && item.count > 0 && (
                        <motion.div 
                          animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute inset-0 bg-[#BC6C25] rounded-xl z-0"
                        />
                      )}

                      <item.icon size={16} className={`relative z-10 ${isActive && !hasChildren ? 'text-white' : 'group-hover:text-[#1B4332] transition-colors'}`} />
                      {!isCollapsed && (
                        <span className="relative z-10 text-[8px] font-black uppercase tracking-[0.15em] whitespace-nowrap truncate">
                          {item.label}
                        </span>
                      )}
                      {!isCollapsed && hasChildren && (
                        <ChevronDown 
                          size={12} 
                          className={`relative z-10 ml-auto transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                        />
                      )}
                      {!isCollapsed && item.count > 0 && (
                        <motion.span 
                          animate={item.id === 'products' ? { scale: [1, 1.1, 1] } : {}}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className={`relative z-10 ml-auto ${isActive ? 'bg-white text-[#BC6C25]' : 'bg-[#BC6C25] text-white'} text-[8px] font-black px-1.5 py-0.5 rounded-md shadow-lg shadow-[#BC6C25]/20 border border-white/20`}
                        >
                          {item.count}
                        </motion.span>
                      )}
                    </button>

                    {/* 📂 CHILDREN NODES */}
                    {!isCollapsed && hasChildren && (
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden pl-4 space-y-1"
                          >
                            {item.children.map(child => (
                              <button
                                key={child.id}
                                onClick={() => {
                                  router.push(child.path);
                                  if (isMobile) setIsCollapsed(true);
                                }}
                                className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition-all group ${
                                  pathname === child.path 
                                    ? 'bg-[#BC6C25]/10 text-[#BC6C25]' 
                                    : 'text-[#1B4332]/30 hover:bg-[#1B4332]/[0.02] hover:text-[#1B4332]/50'
                                }`}
                              >
                                <child.icon size={12} />
                                <span className="text-[7.5px] font-black uppercase tracking-widest">{child.label}</span>
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </div>
                );
              })}
            </nav>

            <div className="p-6 border-t border-[#1B4332]/5">
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
