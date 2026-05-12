'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AuthProvider } from '../../context/AuthContext';
import { CartProvider } from '../../context/CartContext';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import CartSidebar from './CartSidebar';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { ShoppingBag, Sparkles } from 'lucide-react';

/**
 * 🛡️ CLIENT LAYOUT SHELL
 * This component provides the global state providers, background aesthetics, 
 * and high-level auth bridges without handling navigation logic.
 * Navigation is now handled by folder-specific layouts (Public, Buyer, Seller).
 */
function LayoutContent({ children }) {
  const pathname = usePathname();
  const { user, profile, loading: authLoading } = useAuth();
  const { cartCount, setIsOpen: setIsCartOpen } = useCart();
  const [isMounted, setIsMounted] = useState(false);
  const [isStable, setIsStable] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const timer = setTimeout(() => setIsStable(true), 200);
    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) {
    return <div className="h-screen w-full bg-[#FDFBF7]" />;
  }

  // 🛡️ NAVIGATION SENTINEL: Define route categories
  const isAuthRoute = pathname?.includes('/login') || pathname?.includes('/register');
  const isDashboard = pathname?.startsWith('/seller') || pathname?.startsWith('/super-admin') || pathname?.startsWith('/admin');
  
  // 🧭 VALID BUYER ROUTES: Only show floating tools on these specific pages
  const validBuyerRoutes = [
    '/buyer/dashboard', 
    '/buyer/products', 
    '/buyer/categories', 
    '/buyer/wishlist', 
  ];
  const isProductRoute = validBuyerRoutes.some(route => pathname === route || pathname?.startsWith(route + '/'));
  const showFloatingCart = isProductRoute && isStable && !isAuthRoute;

  // 🏛️ NAVBAR VISIBILITY: Show navbar on home, products, and any 404/unknown public page
  const showNavbar = isStable && !isAuthRoute && !authLoading && !isDashboard && !isProductRoute;

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2000,
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
      />
      
      <div className="bg-organic-mesh" />
      <div className="noise-overlay" />
      
      {/* 🔐 IDENTITY VERIFICATION BRIDGE */}
      <AnimatePresence>
        {(authLoading || !isStable) && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[100] bg-[#FDFBF7] flex flex-col items-center justify-center space-y-6"
          >
             <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-[#1B4332]/5 rounded-full" />
                <div className="absolute inset-0 border-4 border-t-[#BC6C25] rounded-full animate-spin" />
             </div>
             <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#1B4332]/30 animate-pulse">
                   Identity Vault
                </span>
                <span className="text-[7px] font-bold uppercase tracking-[0.2em] text-[#BC6C25]">Authenticating Node</span>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative flex h-screen overflow-hidden bg-[#FDFBF7]">
        <CartSidebar />

        {/* 🛒 FLOATING CART (Show only on Buyer Product Pages) */}
        {showFloatingCart && (
          <button
            onClick={() => setIsCartOpen(true)}
            className="fixed top-6 right-6 sm:top-8 sm:right-8 z-[55] w-12 h-12 sm:w-14 sm:h-14 bg-white border border-[#1B4332]/10 rounded-2xl shadow-xl flex items-center justify-center text-[#1B4332] hover:bg-[#1B4332] hover:text-white transition-all duration-500 group pointer-events-auto"
          >
            <ShoppingBag size={20} className="sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 bg-[#BC6C25] text-white text-[8px] sm:text-[10px] font-black w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center border-2 border-white shadow-lg animate-in zoom-in duration-300">
                {cartCount}
              </span>
            )}
          </button>
        )}
        
        <main className="flex-1 h-full overflow-y-auto">
          {children}
        </main>
      </div>
    </>
  );
}

export default function ClientLayout({ children }) {
  return (
    <AuthProvider>
      <CartProvider>
        <LayoutContent>{children}</LayoutContent>
      </CartProvider>
    </AuthProvider>
  );
}
