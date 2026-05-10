'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { ShoppingBag, Heart, User, LogOut, LayoutDashboard, ShieldCheck, Menu, X } from 'lucide-react';
import { useStore } from '../../store/useStore';
import Button from '../ui/Button';
import Logo from '../ui/Logo';
import UserNode from '../ui/UserNode';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { user, profile, isAdmin, signOut, loading } = useAuth();
  const { wishlist } = useStore();
  const { cartCount, setIsOpen } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 🛡️ SOVEREIGN SCROLL LOCK: Prevent background scrolling when mobile menu is active
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);
  const pathname = usePathname();
  
  // 🛡️ SECURITY GATE: Hide navbar on dashboards
  const isDashboard = pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin');
  if (isDashboard) return null;

  const navLinks = [
    { name: 'Products', href: '/products' },
    { name: 'Categories', href: '/categories' },
    { name: 'Journal', href: '/blog' },
    { name: 'Careers', href: '/careers' }
  ];

  // 🛡️ INDEPENDENT SESSION STRATEGY: Hide Super Admin visibility on the storefront
  // We treat the storefront as a public space where Admin identity doesn't exist.
  // We show the 'Logged In' view ONLY for regular buyers.
  const showBuyerAuth = user && !isAdmin && (profile?.role === 'customer' || profile?.role === 'buyer');

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 sm:px-8 py-6 pointer-events-none">
       <header className="w-full max-w-7xl h-16 bg-white/70 backdrop-blur-2xl border border-white/20 rounded-full flex items-center justify-between px-6 sm:px-10 shadow-[0_8px_32px_rgba(27,67,50,0.08)] transition-all duration-500 hover:shadow-[0_12px_48px_rgba(27,67,50,0.12)] pointer-events-auto">
          
          {/* 🏔️ BRAND & NAV HUB */}
          <div className="flex items-center gap-6 sm:gap-10">
             <Link href="/" className="hover:opacity-70 transition-opacity flex items-center gap-4 shrink-0">
                <Logo className="h-8 sm:h-9" />
             </Link>
             
             <nav className="hidden lg:flex items-center gap-6 sm:gap-8 border-l border-[#1B4332]/5 pl-6 sm:pl-8">
                {navLinks.map((item) => (
                  <Link 
                    key={item.name} 
                    href={item.href} 
                    className={`text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] transition-colors whitespace-nowrap ${
                      pathname === item.href ? 'text-[#1B4332]' : 'text-[#1B4332]/40 hover:text-[#1B4332]'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
             </nav>
          </div>

          {/* 🛡️ UTILITY HUB */}
          <div className="flex items-center gap-4 sm:gap-8">
             <div className="flex items-center gap-4 sm:gap-6">
                {/* 🛒 CART TRIGGER - Reserved exclusively for authenticated Buyers */}
                {showBuyerAuth && (
                  <button 
                    onClick={() => setIsOpen(true)}
                    className="relative p-2 text-[#1B4332]/60 hover:text-[#1B4332] transition-colors group"
                  >
                    <ShoppingBag size={20} strokeWidth={2.5} />
                    {cartCount > 0 && (
                      <span className="absolute top-0 right-0 w-4 h-4 bg-[#BC6C25] text-white text-[8px] font-black rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        {cartCount}
                      </span>
                    )}
                  </button>
                )}

                {/* 👤 AUTHENTICATION HUB - Admin identity is hidden from storefront */}
                {!showBuyerAuth ? (
                  <div className="hidden sm:flex items-center gap-4 sm:gap-6">
                    <Link href="/login" className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-[#1B4332]/40 hover:text-[#1B4332] transition-colors">
                      Login
                    </Link>
                    <Link href="/register?type=seller">
                      <Button 
                        size="sm" 
                        className="h-9 sm:h-11 px-6 sm:px-10 text-[10px] sm:text-[11px] rounded-full uppercase tracking-[0.2em] font-black bg-[#1B4332] text-white shadow-[0_8px_20px_rgba(27,67,50,0.15)] hover:shadow-[0_12px_28px_rgba(27,67,50,0.25)] hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <span className="relative z-10">Join Us</span>
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="hidden sm:flex items-center gap-4 border-l border-[#1B4332]/5 pl-4 sm:pl-6">
                    <Link 
                      href="/dashboard"
                      className="items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#1B4332]/40 hover:text-[#1B4332] transition-colors"
                    >
                      <LayoutDashboard size={14} />
                      <span className="hidden xl:block">Account Hub</span>
                    </Link>
                    <div className="w-8 h-8 rounded-full border border-[#1B4332]/10 overflow-hidden shadow-sm">
                      <UserNode size="sm" />
                    </div>
                  </div>
                )}

                {/* 📱 MOBILE MENU TRIGGER */}
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="lg:hidden p-2 text-[#1B4332] hover:bg-[#1B4332]/5 rounded-xl transition-colors"
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
             </div>
          </div>
       </header>

       {/* 📱 MOBILE NAVIGATION DRAWER */}
       <AnimatePresence>
         {isMenuOpen && (
           <motion.div 
             initial={{ opacity: 0, y: -20, scale: 0.95 }}
             animate={{ opacity: 1, y: 0, scale: 1 }}
             exit={{ opacity: 0, y: -20, scale: 0.95 }}
             className="absolute top-24 left-4 right-4 bg-white/98 backdrop-blur-3xl rounded-[3rem] border border-[#1B4332]/10 shadow-2xl p-10 lg:hidden z-40 overflow-hidden pointer-events-auto"
           >
              <div className="bg-organic-mesh absolute inset-0 opacity-10 pointer-events-none" />
              <div className="relative z-10 flex flex-col h-full">
                 {/* Navigation Links */}
                 <div className="space-y-8 mb-16">
                    {navLinks.map((item) => (
                      <Link 
                        key={item.name} 
                        href={item.href} 
                        onClick={() => setIsMenuOpen(false)}
                        className="block text-2xl font-black text-[#1B4332] tracking-tighter hover:text-[#BC6C25] transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                 </div>

                 {/* 👤 AUTHENTICATION HUB (MOBILE) - Admin identity hidden */}
                 <div className="pt-10 border-t border-[#1B4332]/5 space-y-8">
                    {!showBuyerAuth ? (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1B4332]/30">Member Portal</span>
                           <Link 
                             href="/login" 
                             onClick={() => setIsMenuOpen(false)}
                             className="text-[11px] font-black uppercase tracking-widest text-[#BC6C25] hover:opacity-70"
                           >
                             Sign In &rarr;
                           </Link>
                        </div>
                        <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                          <Button className="w-full h-14 rounded-[2rem] text-xs font-black uppercase tracking-[0.2em] bg-[#1B4332] text-white shadow-2xl shadow-[#1B4332]/20">
                            Join Us
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <Link 
                        href="/dashboard" 
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center justify-between p-6 rounded-3xl bg-[#1B4332]/5 group"
                      >
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#1B4332] text-white flex items-center justify-center">
                               <User size={20} />
                            </div>
                            <span className="font-black uppercase tracking-widest text-[10px] text-[#1B4332]">My Account Hub</span>
                         </div>
                         <div className="w-8 h-8 rounded-full border border-[#1B4332]/10 overflow-hidden">
                            <UserNode size="sm" />
                         </div>
                      </Link>
                    )}
                 </div>
              </div>
           </motion.div>
         )}
       </AnimatePresence>
    </div>
  );
}
