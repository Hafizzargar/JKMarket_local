'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import Logo from '../ui/Logo';

export default function Navbar() {
  const { user, isAdmin, signOut, loading } = useAuth();
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
    { name: 'Sellers', href: '/sellers' },
    { name: 'Categories', href: '/categories' },
    { name: 'Journal', href: '/blog' }
  ];

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#FDFBF7]/80 backdrop-blur-xl border-b border-[#1B4332]/5 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex justify-between h-20 sm:h-24 items-center">
          <div className="flex items-center">
            <Link href={isAdmin ? "/admin/dashboard" : "/"} className="flex-shrink-0 hover:opacity-80 transition-opacity">
              <Logo className="h-10 sm:h-12 w-auto" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-12">
            {/* 🛑 CONDITIONAL LOGIC: Hide public links for Admin */}
            {!isAdmin && (
              <div className="flex space-x-10">
                {navLinks.map((link) => (
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
              {!mounted ? (
                <div className="w-20 h-8 bg-[#1B4332]/5 animate-pulse rounded-full" />
              ) : user ? (
                <>
                  {isAdmin ? (
                    <div className="flex items-center gap-8">
                      <Link href="/admin/dashboard" className="text-[10px] font-black uppercase tracking-[0.3em] text-[#BC6C25] hover:opacity-70">
                        Admin Command Center
                      </Link>
                      <button onClick={signOut} className="text-[10px] font-black uppercase tracking-[0.3em] text-red-600/40 hover:text-red-600">
                        Exit Portal
                      </button>
                    </div>
                  ) : (
                    <>
                      <Link href="/dashboard" className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1B4332]/40 hover:text-[#1B4332]">Dashboard</Link>
                      <button onClick={signOut} className="text-[10px] font-black uppercase tracking-[0.3em] text-red-600/40 hover:text-red-600">Sign Out</button>
                    </>
                  )}
                </>
              ) : (
                <>
                  <Link href="/login" className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1B4332]/40 hover:text-[#1B4332]">Login</Link>
                  <Link href="/register">
                    <Button size="sm">Become a Seller</Button>
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
            className="lg:hidden fixed inset-x-0 top-20 bottom-0 bg-[#FDFBF7] z-40 px-8 pt-12 pb-20 flex flex-col justify-between"
          >
            <div className="space-y-10">
              {isAdmin ? (
                <motion.div variants={itemVariants}>
                  <Link 
                    href="/admin/dashboard" 
                    onClick={() => setIsMenuOpen(false)}
                    className="text-4xl font-black text-[#BC6C25] tracking-tighter"
                  >
                    Command Center
                  </Link>
                </motion.div>
              ) : (
                <>
                  {navLinks.map(link => (
                    <motion.div key={link.name} variants={itemVariants}>
                      <Link 
                        href={link.href} 
                        onClick={() => setIsMenuOpen(false)}
                        className="text-4xl font-black text-[#1B4332] tracking-tighter"
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  ))}
                </>
              )}
              
              <motion.div variants={itemVariants} className="pt-10 border-t border-[#1B4332]/5 flex flex-col space-y-6">
                {!mounted ? (
                  <div className="w-full h-12 bg-[#1B4332]/5 animate-pulse rounded-3xl" />
                ) : user ? (
                  <>
                    {!isAdmin && <Link href="/dashboard" className="text-lg font-black text-[#1B4332] uppercase tracking-widest">Dashboard</Link>}
                    <button onClick={signOut} className="text-lg font-black text-red-600 uppercase tracking-widest text-left">Sign Out</button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setIsMenuOpen(false)} className="text-lg font-black text-[#1B4332]/40 uppercase tracking-widest">Login</Link>
                    <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                      <Button size="lg" className="w-full">Become a Seller</Button>
                    </Link>
                  </>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
