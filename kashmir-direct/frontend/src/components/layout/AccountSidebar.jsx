'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ShoppingBag, Heart, Package, Settings, 
  HelpCircle, LogOut, ShieldCheck, ChevronRight, ChevronLeft,
  User, LayoutDashboard, Sparkles, Menu, Home,
  Grid
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../store/useStore';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import UserNode from '../ui/UserNode';
import Logo from '../ui/Logo';
import Button from '../ui/Button';

export default function AccountSidebar() {
  const pathname = usePathname();
  const { user, profile, signOut, isAdmin, isLoggingOut } = useAuth();
  const { setIsOpen: setIsCartOpen } = useCart();
  const { isAccountOpen, setIsAccountOpen, isSidebarCollapsed, setIsSidebarCollapsed } = useStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isBuyerRoute = pathname?.startsWith('/buyer');

  if (!isMounted || !isBuyerRoute || isLoggingOut) return null;

  const handleLinkClick = () => {
    // 🛡️ CLOSE CART: Ensure the cart drawer is dismissed on navigation
    setIsCartOpen(false);

    // 📱 MOBILE DRAWER: Close the sidebar on mobile
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsAccountOpen(false);
    }
  };

  const isBuyer = user && !isAdmin && (profile?.role === 'customer' || profile?.role === 'buyer');
  const isSeller = user && !isAdmin && (profile?.role === 'seller');

  const navLinks = [
    { name: 'All Products', href: isBuyer ? '/buyer/products' : '/products', icon: Home },
    { name: 'By Category', href: isBuyer ? '/buyer/categories' : '/categories', icon: Grid }
  ];

  const accountLinks = [
    { 
      name: 'My Cart', 
      desc: 'Items you added', 
      icon: ShoppingBag, 
      action: () => { setIsAccountOpen(false); setIsCartOpen(true); } 
    },
    { 
      name: 'My Wishlist', 
      desc: 'Your favorite items', 
      icon: Heart, 
      href: isBuyer ? '/buyer/wishlist' : '/wishlist' 
    },
    { 
      name: 'My Orders', 
      desc: 'Track your items', 
      icon: Package, 
      href: isBuyer ? '/buyer/orders' : '/orders' 
    },
    { 
      name: 'My Settings', 
      desc: 'Account Preferences', 
      icon: Settings, 
      href: '/setting/profile' 
    }
  ];

  const sidebarWidth = isSidebarCollapsed ? 'w-20' : 'w-[280px]';

  return (
    <>
      {/* 🟢 MOBILE FLOATING TRIGGER */}
      {!isAccountOpen && (
        <button 
          onClick={() => setIsAccountOpen(true)}
          className="lg:hidden fixed top-6 left-6 z-[55] w-12 h-12 bg-white border border-[#1B4332]/10 rounded-2xl shadow-xl flex items-center justify-center text-[#1B4332] active:scale-90 transition-all pointer-events-auto"
        >
          <Menu size={20} />
        </button>
      )}

      {/* 🏛️ PERSISTENT SIDEBAR (DESKTOP) + DRAWER (MOBILE) */}
      <AnimatePresence mode="wait">
        {(isAccountOpen || true) && (
          <>
            {/* 🏔️ AMBIENT OVERLAY (Mobile Only) */}
            {isAccountOpen && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsAccountOpen(false)}
                className="lg:hidden fixed inset-0 bg-[#081C15]/40 backdrop-blur-md z-[60] pointer-events-auto"
              />
            )}

            {/* 🏛️ THE SIDEBAR */}
            <motion.aside 
              initial={typeof window !== 'undefined' && window.innerWidth < 1024 ? { x: '-100%' } : false}
              animate={(isAccountOpen || (typeof window !== 'undefined' && window.innerWidth >= 1024)) ? { x: 0 } : { x: '-100%' }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`fixed top-0 left-0 bottom-0 z-[70] ${sidebarWidth} bg-[#FDFBF7] shadow-2xl lg:shadow-none flex flex-col border-r border-[#1B4332]/10 overflow-visible pointer-events-auto transition-all duration-500 ${!isAccountOpen && 'hidden lg:flex'}`}
            >
              {/* 🏔️ ORGANIC TEXTURE */}
              <div className="absolute inset-0 bg-organic-mesh opacity-[0.03] pointer-events-none" />

              {/* 🛠️ COLLAPSE TOGGLE (Desktop Only) */}
              <button 
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="hidden lg:flex absolute -right-3.5 top-12 w-7 h-7 bg-white border border-[#1B4332]/10 rounded-full items-center justify-center text-[#BC6C25] shadow-xl hover:scale-110 active:scale-95 transition-all z-[80]"
              >
                {isSidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
              </button>

              {/* 🌅 HEADER HUB */}
              <div className={`p-4 bg-gradient-to-b from-white to-[#FDFBF7] border-b border-[#1B4332]/5 relative overflow-hidden transition-all duration-500 ${isSidebarCollapsed && 'px-3'}`}>
                 <div className="bg-organic-mesh absolute inset-0 opacity-5 pointer-events-none" />
                 
                 <div className={`flex items-center justify-between relative z-10 mb-3 ${isSidebarCollapsed && 'justify-center mb-2'}`}>
                    <Link href="/" onClick={handleLinkClick}>
                       {isSidebarCollapsed ? (
                         <div className="w-8 h-8 bg-[#1B4332] rounded-xl flex items-center justify-center text-white font-black text-[10px] shadow-lg shadow-[#1B4332]/20 hover:scale-110 transition-transform">K</div>
                       ) : (
                         <Logo className="h-6" />
                       )}
                    </Link>
                    {!isSidebarCollapsed && (
                      <button 
                        onClick={() => setIsAccountOpen(false)}
                        className="lg:hidden p-1.5 hover:bg-[#1B4332]/5 rounded-xl transition-all"
                      >
                        <X size={14} className="text-[#1B4332]" />
                      </button>
                    )}
                 </div>

                 {user ? (
                   <div className={`flex items-center gap-2.5 relative z-10 p-2 rounded-xl bg-white/50 border border-white shadow-sm ${isSidebarCollapsed && 'justify-center p-1 border-none bg-transparent shadow-none'}`}>
                      <div className="w-10 h-10 rounded-xl border-2 border-[#BC6C25]/20 p-0.5 bg-white shadow-md shrink-0">
                         <div className="w-full h-full rounded-lg overflow-hidden">
                            <UserNode size="lg" showName={false} />
                         </div>
                      </div>
                      {!isSidebarCollapsed && (
                        <div className="flex flex-col min-w-0">
                           <h2 className="text-[12px] font-black text-[#1B4332] tracking-tight leading-tight truncate">
                              {profile?.full_name || 'Buyer'}
                           </h2>
                           <span className="text-[7px] font-bold text-[#BC6C25] uppercase tracking-widest mt-0.5">
                              {profile?.role || 'Buyer'} Account
                           </span>
                        </div>
                      )}
                   </div>
                 ) : (
                   <div className="relative z-10">
                      <Link href="/login" onClick={handleLinkClick}>
                         <Button className={`w-full h-9 rounded-xl text-[8px] font-black uppercase tracking-widest bg-[#1B4332] text-white shadow-lg shadow-[#1B4332]/10 hover:shadow-xl hover:-translate-y-0.5 transition-all ${isSidebarCollapsed && 'px-0 flex items-center justify-center'}`}>
                            {isSidebarCollapsed ? <User size={16} /> : 'Login to Shop'}
                         </Button>
                      </Link>
                   </div>
                 )}
              </div>

              {/* 🧭 NAVIGATION NODES */}
              <div className={`flex-grow overflow-y-auto p-3 space-y-3 no-scrollbar transition-all duration-500 ${isSidebarCollapsed && 'p-2'}`}>
                 {/* Main Navigation */}
                 <div className="space-y-0.5">
                    {!isSidebarCollapsed && <span className="text-[7px] font-black uppercase tracking-[0.4em] text-[#1B4332]/30 ml-2.5 mb-1.5 block">Shop Now</span>}
                    {navLinks.map((link) => (
                      <Link 
                        key={link.name} 
                        href={link.href} 
                        onClick={handleLinkClick}
                        title={isSidebarCollapsed ? link.name : ''}
                        className={`flex items-center gap-2.5 p-2 rounded-xl hover:bg-white border border-transparent hover:border-[#1B4332]/5 hover:shadow-sm transition-all group ${isSidebarCollapsed && 'justify-center p-1.5'}`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-white shadow-inner flex items-center justify-center text-[#1B4332] group-hover:bg-[#1B4332] group-hover:text-white transition-all shadow-[#1B4332]/5 shrink-0">
                           <link.icon size={14} />
                        </div>
                        {!isSidebarCollapsed && (
                          <>
                            <span className="text-[11px] font-black text-[#1B4332] uppercase tracking-wider">{link.name}</span>
                            <ChevronRight size={10} className="ml-auto text-[#1B4332]/10 group-hover:text-[#BC6C25] group-hover:translate-x-1 transition-all" />
                          </>
                        )}
                      </Link>
                    ))}
                 </div>

                 {/* Account Features */}
                 {user && (
                   <div className="space-y-0.5">
                      {!isSidebarCollapsed && <span className="text-[7px] font-black uppercase tracking-[0.4em] text-[#1B4332]/30 ml-2.5 mb-1.5 block">My Account</span>}
                      {accountLinks.map((link) => (
                        link.href ? (
                          <Link 
                            key={link.name} 
                            href={link.href} 
                            onClick={handleLinkClick}
                            title={isSidebarCollapsed ? link.name : ''}
                            className={`flex items-center gap-2.5 p-2 rounded-xl hover:bg-white border border-transparent hover:border-[#1B4332]/5 hover:shadow-sm transition-all group ${isSidebarCollapsed && 'justify-center p-1.5'}`}
                          >
                            <div className="w-8 h-8 rounded-lg bg-white shadow-inner flex items-center justify-center text-[#1B4332] group-hover:bg-[#1B4332] group-hover:text-white transition-all shadow-[#1B4332]/5 shrink-0">
                               <link.icon size={14} />
                            </div>
                            {!isSidebarCollapsed && (
                              <div className="flex-grow">
                                 <h4 className="text-[11px] font-black text-[#1B4332] uppercase tracking-wider">{link.name}</h4>
                                 <p className="text-[6px] font-bold text-[#1B4332]/30 uppercase tracking-tighter mt-0.5">{link.desc}</p>
                              </div>
                            )}
                            {!isSidebarCollapsed && <ChevronRight size={10} className="text-[#1B4332]/10 group-hover:text-[#BC6C25] group-hover:translate-x-1 transition-all" />}
                          </Link>
                        ) : (
                          <button 
                            key={link.name} 
                            onClick={link.action}
                            title={isSidebarCollapsed ? link.name : ''}
                            className={`w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-white border border-transparent hover:border-[#1B4332]/5 hover:shadow-sm transition-all group text-left ${isSidebarCollapsed && 'justify-center p-1.5'}`}
                          >
                            <div className="w-8 h-8 rounded-lg bg-white shadow-inner flex items-center justify-center text-[#1B4332] group-hover:bg-[#1B4332] group-hover:text-white transition-all shadow-[#1B4332]/5 shrink-0">
                               <link.icon size={14} />
                            </div>
                            {!isSidebarCollapsed && (
                              <div className="flex-grow">
                                 <h4 className="text-[11px] font-black text-[#1B4332] uppercase tracking-wider">{link.name}</h4>
                                 <p className="text-[6px] font-bold text-[#1B4332]/30 uppercase tracking-tighter mt-0.5">{link.desc}</p>
                              </div>
                            )}
                            {!isSidebarCollapsed && <ChevronRight size={10} className="text-[#1B4332]/20 group-hover:text-[#BC6C25] transition-colors" />}
                          </button>
                        )
                      ))}
                   </div>
                 )}
              </div>

              {/* 🛡️ SYSTEM NODE */}
              <div className={`p-4 pt-0 space-y-3 transition-all duration-500 ${isSidebarCollapsed && 'p-2'}`}>
                 <Link 
                   href={isSeller ? "/seller/help" : (isBuyer ? "/buyer/help" : "/help")} 
                   onClick={handleLinkClick}
                   title={isSidebarCollapsed ? 'Help' : ''}
                   className={`flex items-center justify-center gap-2 text-[#1B4332]/30 hover:text-[#1B4332] transition-colors ${isSidebarCollapsed && 'mb-0'}`}
                 >
                   <HelpCircle size={isSidebarCollapsed ? 16 : 10} />
                   {!isSidebarCollapsed && <span className="text-[7px] font-black uppercase tracking-[0.2em]">Help Center</span>}
                 </Link>

                 {user && (
                   <button 
                     onClick={() => signOut()}
                     title={isSidebarCollapsed ? 'Logout' : ''}
                     className={`w-full h-9 rounded-xl bg-white border border-[#1B4332]/10 flex items-center justify-center gap-2 text-[#1B4332] hover:bg-[#1B4332] hover:text-white hover:border-[#1B4332] transition-all group font-black text-[8px] uppercase tracking-[0.2em] shadow-sm ${isSidebarCollapsed && 'h-8 border-none bg-transparent shadow-none'}`}
                   >
                     <LogOut size={isSidebarCollapsed ? 16 : 10} className={`${!isSidebarCollapsed && 'group-hover:-translate-x-1'} transition-transform`} />
                     {!isSidebarCollapsed && 'Sign Out'}
                   </button>
                 )}

                 {!isSidebarCollapsed && (
                   <div className="flex items-center justify-center gap-1.5 pt-1.5 border-t border-[#1B4332]/5">
                      <ShieldCheck size={8} className="text-[#BC6C25]" />
                      <span className="text-[6px] font-black uppercase tracking-[0.3em] text-[#1B4332]/30">Kashmir Direct</span>
                   </div>
                 )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

