'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Logo from '../../components/ui/Logo';
import {
  ShieldCheck,
  Store,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  Mail,
  WifiOff,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export default function LoginPage() {
  const [view, setView] = useState('select');
  const [selectedRole, setSelectedRole] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [takingLong, setTakingLong] = useState(false);

  const { user, profile, signIn, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && profile) {
      let targetPath = '/seller/dashboard';
      if (isAdmin) targetPath = '/super-admin/dashboard';
      else if (profile.role === 'customer' || profile.role === 'buyer') targetPath = '/products';
      window.location.replace(targetPath);
    }
  }, [user, profile, isAdmin]);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (loading) return;
    setLoading(true);
    setTakingLong(false);
    const timer = setTimeout(() => setTakingLong(true), 5000);
    try {
      const { data: authData, error: signInError } = await signIn({ email: email.trim(), password });
      clearTimeout(timer);
      if (signInError) {
        toast.error(signInError.message || 'Access Denied', { icon: '🔒' });
        setLoading(false);
        return;
      }
      const metadataRole = authData.user?.user_metadata?.role || authData.user?.app_metadata?.role;
      let targetPath = (authData.user?.email === 'hafezzargar987@gmail.com' || metadataRole === 'admin') ? '/super-admin/dashboard' : (metadataRole === 'customer' ? '/products' : '/seller/dashboard');
      toast.success('Identity Verified.');
      window.location.replace(targetPath);
    } catch (err) {
      toast.error('Network Error.');
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  };

  const roles = [
    { 
      id: 'customer', 
      title: 'Client / Buyer', 
      icon: ShoppingBag, 
      accent: '#F59E0B', 
      bg: 'from-amber-500/10 to-transparent',
      tagline: 'Procure Elite Craftsmanship'
    },
    { 
      id: 'seller', 
      title: 'Master / Seller', 
      icon: Store, 
      accent: '#10B981', 
      bg: 'from-emerald-500/10 to-transparent',
      tagline: 'Manage Your Artisan Legacy'
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#FDFBF7] selection:bg-[#BC6C25]/20">
      {/* 🏺 ELITE BACKGROUND SYSTEM */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#BC6C25]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#1B4332]/5 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-organic-mesh opacity-[0.03]" />
      </div>

      <motion.div
        layout
        className={`${view === 'select' ? 'max-w-xl' : 'max-w-md'} w-full relative z-10`}
      >
        <AnimatePresence mode="wait">
          {view === 'select' ? (
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
                      Identity <span className="text-[#BC6C25] font-serif italic font-normal lowercase">Portal</span>
                    </h2>
                    <p className="text-[10px] font-black text-[#1B4332]/30 uppercase tracking-[0.4em]">Establish Secure Linkage</p>
                 </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {roles.map((role) => (
                  <motion.button 
                    key={role.id} 
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setSelectedRole(role.id); setView('form'); }} 
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
                  New to the Valley? <span className="underline underline-offset-4 decoration-[#BC6C25]/30 group-hover:decoration-[#BC6C25]">Create Account</span>
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="login-form" 
              initial={{ opacity: 0, x: 30 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -30 }} 
              className="bg-white/80 backdrop-blur-2xl p-10 sm:p-14 rounded-[3.5rem] border border-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] space-y-10"
            >
              <div className="relative">
                <button 
                  onClick={() => setView('select')} 
                  className="absolute -top-4 -left-4 p-3 bg-[#1B4332]/5 rounded-2xl text-[#1B4332]/40 hover:bg-[#BC6C25] hover:text-white transition-all active:scale-90"
                >
                  <ArrowLeft size={16} />
                </button>
                
                <div className="text-center pt-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#BC6C25]/10 border border-[#BC6C25]/20 mb-6">
                    <Sparkles size={10} className="text-[#BC6C25]" />
                    <span className="text-[9px] font-black tracking-[0.2em] uppercase text-[#BC6C25]">{selectedRole} Verification</span>
                  </div>
                  <h2 className="text-4xl font-black text-[#1B4332] tracking-tighter leading-none">Security Check</h2>
                </div>
              </div>

              <form className="space-y-6" onSubmit={handleLogin}>
                <div className="space-y-4">
                  <Input label="Identity Identifier" type="email" placeholder="artisan@valley.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-14 rounded-2xl" />
                  <Input label="Security Cipher" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required className="h-14 rounded-2xl" />
                </div>

                <AnimatePresence>
                  {takingLong && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center justify-center gap-2 text-[#BC6C25] text-[9px] font-black uppercase tracking-widest bg-[#BC6C25]/5 p-4 rounded-2xl border border-[#BC6C25]/10">
                      <WifiOff size={14} className="animate-pulse" />
                      Protocol sync taking longer...
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button 
                  type="submit" 
                  isLoading={loading} 
                  className="w-full h-16 bg-[#1B4332] hover:bg-[#2D5A47] text-white rounded-2xl shadow-xl shadow-[#1B4332]/20 font-black uppercase tracking-widest text-[11px] group"
                >
                  Confirm Entry <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
