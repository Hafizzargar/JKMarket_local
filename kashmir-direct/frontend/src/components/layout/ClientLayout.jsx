'use client';

import { usePathname } from 'next/navigation';
import { AuthProvider } from '../../context/AuthContext';
import { CartProvider } from '../../context/CartContext';
import { Toaster, toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import CartSidebar from './CartSidebar';

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  
  // 🛡️ REUSABLE NAVIGATION STRATEGY: Show navbar on all public pages (including Home)
  // Only hide on intensive dashboards and auth vaults to maintain focus
  const hideNavbar = pathname?.startsWith('/admin') || 
                     pathname?.startsWith('/super-admin') || 
                     pathname?.startsWith('/seller') || 
                     pathname?.startsWith('/dashboard') || 
                     pathname?.startsWith('/inventory') || 
                     pathname?.startsWith('/profile') || 
                     pathname?.startsWith('/login') || 
                     pathname?.startsWith('/register');

  return (
    <AuthProvider>
      <CartProvider>
      {/* 🔔 Global Toaster for all notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 2000,
          // 🏛️ CUSTOM PREMIUM THEME
          className: 'premium-toast',
          style: {
            background: 'rgba(253, 251, 247, 0.95)',
            backdropFilter: 'blur(10px)',
            color: '#1B4332',
            borderRadius: '1.25rem',
            border: '1px solid rgba(27, 67, 50, 0.1)',
            padding: '4px',
            fontSize: '12px',
            fontWeight: '600',
            boxShadow: '0 20px 40px -10px rgba(27, 67, 50, 0.15)',
          },
        }}
      >
        {(t) => (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{ 
              background: 'rgba(253, 251, 247, 0.98)', 
              backdropFilter: 'blur(10px)',
              boxShadow: '0 25px 50px -12px rgba(27, 67, 50, 0.25)' 
            }}
            className={`flex items-center gap-3 px-5 py-4 rounded-[1.25rem] border border-[#1B4332]/10 min-w-[320px] ${
              t.visible ? 'animate-enter' : 'animate-leave'
            }`}
          >
            <div className="flex-shrink-0 text-xl">
              {t.icon}
            </div>
            <div className="flex-grow font-black uppercase tracking-[0.2em] text-[10px] text-[#1B4332] leading-tight">
              {typeof t.message === 'function' ? t.message(t) : t.message}
            </div>
            <button 
              onClick={() => toast.dismiss(t.id)}
              className="ml-2 p-1.5 hover:bg-[#1B4332]/5 rounded-lg transition-colors group flex-shrink-0"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-[#1B4332] opacity-20 group-hover:opacity-100 transition-opacity">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </motion.div>
        )}
      </Toaster>
      <div className="bg-organic-mesh" />
      <div className="noise-overlay" />
      <div className="relative flex flex-col min-h-screen">
        {!hideNavbar && <Navbar />}
        <CartSidebar />
        <main className="flex-grow">
          {children}
        </main>
      </div>
      </CartProvider>
    </AuthProvider>
  );
}
