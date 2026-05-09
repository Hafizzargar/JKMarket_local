'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { ShoppingBag, Heart } from 'lucide-react';
import { useStore } from '../../store/useStore';
import Button from '../ui/Button';
import Logo from '../ui/Logo';
import UserNode from '../ui/UserNode';

export default function Navbar() {
  const { user, profile, isAdmin, signOut, loading } = useAuth();
  const { wishlist } = useStore();
  const { cartCount, setIsOpen } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const menuVariants = {
    closed: { opacity: 0, y: -20, transition: { duration: 0.3 } },
    open: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.5, staggerChildren: 0.1, delayChildren: 0.1 } 
    }
  };

  const itemVariants = {
    closed: { opacity: 0, x: -10 },
    open: { opacity: 1, x: 0 }
  };

  const navLinks = [
    { name: 'Products', href: '/products' },
    { name: 'Categories', href: '/categories' },
    { name: 'Journal', href: '/blog' },
    { name: 'Careers', href: '/careers' }
  ];

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${isMenuOpen ? 'bg-[#FDFBF7]' : 'bg-[#FDFBF7]/80 backdrop-blur-xl'} border-b border-[#1B4332]/5 sticky top-0 z-50`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex justify-between h-20 sm:h-24 items-center">
          <div className="flex items-center">
            <Link 
              href={
                isAdmin ? "/admin/dashboard" : 
                (profile?.role === 'seller' || profile?.role === 'shopkeeper') ? "/dashboard" : 
                user ? "/products" : "/"
              } 
              className="flex-shrink-0 hover:opacity-80 transition-opacity"
            >
              <Logo className="h-10 sm:h-12 w-auto" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-12">
            {!isAdmin && (
              <div className="flex space-x-10">
                {navLinks
                  .filter(link => {
                    // Hide 'Journal' and 'Careers' from all members (logged in users)
                    if (user && (link.name === 'Journal' || link.name === 'Careers')) return false;
                    return true;
                  })
                  .map((link) => (
                  <Link 
                    key={link.name}
                    href={link.href} 
                    className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1B4332]/40 hover:text-[#1B4332] transition-all"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            )}

            {mounted && !isAdmin && <div className="h-6 w-px bg-[#1B4332]/10" />}

            <div className="flex items-center space-x-8">
              {/* 🧺 CART NODE */}
              {mounted && user && !isAdmin && (
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => setIsOpen(true)}
                    className="relative group p-2 hover:bg-[#1B4332]/5 rounded-xl transition-all"
                  >
                    <ShoppingBag size={20} className="text-[#1B4332]/40 group-hover:text-[#1B4332]" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#BC6C25] text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg border-2 border-[#FDFBF7]">
                        {cartCount}
                      </span>
                    )}
                  </button>

                  <Link 
                    href="/wishlist"
                    className="relative group p-2 hover:bg-[#1B4332]/5 rounded-xl transition-all"
                  >
                    <Heart size={20} className="text-[#1B4332]/40 group-hover:text-[#1B4332]" />
                    {wishlist.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#1B4332] text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg border-2 border-[#FDFBF7]">
                        {wishlist.length}
                      </span>
                    )}
                  </Link>
                </div>
              )}

              {!mounted ? (
                <div className="w-20 h-8 bg-[#1B4332]/5 animate-pulse rounded-full" />
              ) : user ? (
                <>
                  <Link href="/setting/profile" className="mr-6 transition-transform active:scale-95">
                    <UserNode />
                  </Link>
                  {isAdmin ? (
                    <div className="flex items-center gap-8">
                      <Link href="/admin/dashboard" className="text-[10px] font-black uppercase tracking-[0.3em] text-[#BC6C25] hover:opacity-70">
                        Admin Command Center
                      </Link>
                      <button 
                        onClick={async () => {
                          await signOut();
                          window.location.replace('/');
                        }} 
                        className="text-[10px] font-black uppercase tracking-[0.3em] text-red-600/40 hover:text-red-600"
                      >
                        Exit Portal
                      </button>
                    </div>
                  ) : (
                    <>
                      {(profile?.role === 'seller' || profile?.role === 'shopkeeper') && (
                        <Link href="/dashboard" className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1B4332]/40 hover:text-[#1B4332]">Dashboard</Link>
                      )}
                      <button 
                        onClick={async () => {
                          await signOut();
                          window.location.replace('/');
                        }} 
                        className="text-[10px] font-black uppercase tracking-[0.3em] text-red-600/40 hover:text-red-600"
                      >
                        Sign Out
                      </button>
                    </>
                  )}
                </>
              ) : (
                <>
                  <Link href="/login" className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1B4332]/40 hover:text-[#1B4332]">Login</Link>
                  <Link href="/register" className="text-[10px] font-black uppercase tracking-[0.3em] text-[#BC6C25] hover:opacity-70">Join as Buyer</Link>
                  <Link href="/register">
                    <Button size="sm">Join Registry</Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-[#1B4332] p-3 rounded-2xl bg-white/50 border border-[#1B4332]/5"
            >
              {isMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8h16M4 16h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="lg:hidden fixed inset-x-0 top-20 bottom-0 bg-gradient-to-b from-[#FDFBF7] to-[#F5F1E6] z-[999] px-8 pt-12 pb-20 flex flex-col justify-between shadow-2xl opacity-100"
          >
            {/* Identity Node at Top */}
            {user && (
              <motion.div variants={itemVariants} className="mb-12">
                <Link href="/setting/profile" className="flex items-center gap-4 bg-[#1B4332]/5 p-4 rounded-3xl border border-[#1B4332]/5" onClick={() => setIsMenuOpen(false)}>
                  <UserNode size="md" />
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black uppercase text-[#1B4332]/40 tracking-widest leading-none mb-1">Identity Profile</span>
                    <span className="text-xs font-black text-[#1B4332] uppercase tracking-wider">Configure Settings</span>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Navigation Links */}
            <div className="flex-1 space-y-8">
              {isAdmin ? (
                <motion.div variants={itemVariants}>
                  <Link 
                    href="/admin/dashboard" 
                    onClick={() => setIsMenuOpen(false)}
                    className="text-2xl font-black text-[#BC6C25] tracking-tight uppercase"
                  >
                    Command Center
                  </Link>
                </motion.div>
              ) : (
                <>
                  {navLinks
                    .filter(link => {
                      if (user && (link.name === 'Journal' || link.name === 'Careers')) return false;
                      return true;
                    })
                    .map(link => (
                    <motion.div key={link.name} variants={itemVariants}>
                      <Link 
                        href={link.href} 
                        onClick={() => setIsMenuOpen(false)}
                        className="text-sm font-black text-[#1B4332] tracking-[0.3em] uppercase"
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  ))}
                </>
              )}
            </div>
            
            {/* Action Footer */}
            <motion.div variants={itemVariants} className="pt-8 border-t border-[#1B4332]/5 flex flex-col space-y-6">
              {!mounted ? (
                <div className="w-full h-12 bg-[#1B4332]/5 animate-pulse rounded-3xl" />
              ) : user ? (
                <>
                  {!isAdmin && (profile?.role === 'seller' || profile?.role === 'shopkeeper') && (
                    <Link 
                      href="/dashboard" 
                      onClick={() => setIsMenuOpen(false)}
                      className="text-sm font-black text-[#1B4332] uppercase tracking-[0.3em] flex items-center justify-between"
                    >
                      Artisan Dashboard
                      <div className="w-2 h-2 rounded-full bg-[#BC6C25]" />
                    </Link>
                  )}
                  <button 
                    onClick={async () => {
                      setIsMenuOpen(false);
                      await signOut();
                      window.location.replace('/');
                    }} 
                    className="w-full h-14 rounded-2xl bg-rose-500/5 text-rose-500 text-[10px] font-black uppercase tracking-[0.3em] border border-rose-500/10 hover:bg-rose-500/10 transition-all flex items-center justify-center"
                  >
                    Secure Sign Out
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <Link 
                    href="/login" 
                    onClick={() => setIsMenuOpen(false)}
                    className="h-14 rounded-2xl bg-[#1B4332]/5 text-[#1B4332] text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center border border-[#1B4332]/5"
                  >
                    Log In
                  </Link>
                  <Link 
                    href="/register" 
                    onClick={() => setIsMenuOpen(false)}
                    className="h-14 rounded-2xl bg-[#1B4332] text-white text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center shadow-lg shadow-[#1B4332]/10"
                  >
                    Join
                  </Link>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
