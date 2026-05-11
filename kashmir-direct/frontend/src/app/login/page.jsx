'use client';

import { useRouter } from 'next/navigation';
import Logo from '../../components/ui/Logo';
import FloatingAnimation from '../../components/ui/FloatingAnimation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Store, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();

  const roles = [
    { 
      id: 'customer', 
      title: 'Buyer', 
      icon: ShoppingBag, 
      accent: '#F59E0B', 
      bg: 'from-amber-500/10 to-transparent',
      tagline: 'Shop for local products'
    },
    { 
      id: 'seller', 
      title: 'Seller', 
      icon: Store, 
      accent: '#10B981', 
      bg: 'from-emerald-500/10 to-transparent',
      tagline: 'Manage your shop'
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#FDFBF7] selection:bg-[#BC6C25]/20">
      <FloatingAnimation />

      <motion.div
        layout
        className="max-w-xl w-full relative z-10"
      >
        <AnimatePresence mode="wait">
          <motion.div 
            key="selection" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-12"
          >
            <div className="text-center space-y-6">
               <Logo className="h-10 mx-auto drop-shadow-sm" />
               <div className="space-y-2">
                  <h2 className="text-4xl sm:text-5xl font-black text-[#1B4332] tracking-tighter leading-none">
                    Welcome <span className="text-[#BC6C25] font-serif italic font-normal lowercase">Back</span>
                  </h2>
                  <p className="text-[10px] font-black text-[#1B4332]/30 uppercase tracking-[0.4em]">Login to your account</p>
               </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {roles.map((role) => (
                <motion.button 
                  key={role.id} 
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push(role.id === 'customer' ? '/buyer/login' : '/seller/login')} 
                  className="group relative w-full overflow-hidden bg-white/60 backdrop-blur-xl border border-white p-6 rounded-[2.5rem] flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(188,108,37,0.1)] transition-all duration-500"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${role.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                  
                  <div className="flex items-center gap-6 relative z-10">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl transition-all duration-500 group-hover:rotate-[10deg] group-hover:scale-110" style={{ background: role.accent }}>
                      <role.icon size={24} />
                    </div>
                    <div className="text-left">
                      <h3 className="text-sm font-black text-[#1B4332] uppercase tracking-[0.15em]">{role.title}</h3>
                      <p className="text-[10px] font-medium text-[#1B4332]/40 italic tracking-tight">{role.tagline}</p>
                    </div>
                  </div>

                  <div className="w-10 h-10 rounded-full bg-[#1B4332]/5 flex items-center justify-center text-[#1B4332]/20 group-hover:bg-[#BC6C25] group-hover:text-white transition-all duration-500 relative z-10">
                    <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </motion.button>
              ))}
            </div>

            <div className="text-center">
              <Link href="/register" className="inline-flex items-center gap-2 text-[10px] font-black text-[#BC6C25] uppercase tracking-widest hover:opacity-70 group">
                New here? <span className="underline underline-offset-4 decoration-[#BC6C25]/30 group-hover:decoration-[#BC6C25]">Create Account</span>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
