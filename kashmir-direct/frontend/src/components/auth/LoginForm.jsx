'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { ArrowRight, ArrowLeft, WifiOff, Sparkles, Eye, EyeOff } from 'lucide-react';

export default function LoginForm({ role = 'buyer' }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [takingLong, setTakingLong] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const { user, profile, signIn, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && profile) {
      let targetPath = '/seller/dashboard';
      if (isAdmin) targetPath = '/super-admin/dashboard';
      else if (profile.role === 'customer' || profile.role === 'buyer') targetPath = '/buyer/products';
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
        const friendlyMessage = signInError.message === 'Invalid login credentials' 
          ? 'Wrong email or password. Please check again.' 
          : signInError.message;
        toast.error(friendlyMessage, { icon: '🔒' });
        setLoading(false);
        return;
      }
      const metadataRole = authData.user?.user_metadata?.role || authData.user?.app_metadata?.role;
      let targetPath = (authData.user?.email === 'hafezzargar987@gmail.com' || metadataRole === 'admin') ? '/super-admin/dashboard' : (metadataRole === 'customer' || metadataRole === 'buyer' ? '/buyer/products' : '/seller/dashboard');
      toast.success('Login Successful');
      window.location.replace(targetPath);
    } catch (err) {
      toast.error('Network Error.');
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  };

  return (
    <motion.div 
      key="login-form" 
      initial={{ opacity: 0, x: 30 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -30 }} 
      className="bg-white/80 backdrop-blur-2xl p-10 sm:p-14 rounded-[3.5rem] border border-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] space-y-10 w-full max-w-md"
    >
      <div className="relative">
        <button 
          onClick={() => router.push('/login')} 
          className="absolute -top-4 -left-4 p-3 bg-[#1B4332]/5 rounded-2xl text-[#1B4332]/40 hover:bg-[#BC6C25] hover:text-white transition-all active:scale-90"
        >
          <ArrowLeft size={16} />
        </button>
        
        <div className="text-center pt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#BC6C25]/10 border border-[#BC6C25]/20 mb-6">
            <Sparkles size={10} className="text-[#BC6C25]" />
            <span className="text-[9px] font-black tracking-[0.2em] uppercase text-[#BC6C25]">{role} Login</span>
          </div>
          <h2 className="text-4xl font-black text-[#1B4332] tracking-tighter leading-none">Login</h2>
        </div>
      </div>

      <form className="space-y-6" onSubmit={handleLogin}>
        <div className="space-y-4">
          <Input label="Email" type="email" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-14 rounded-2xl" />
          <div className="relative">
            <Input 
              label="Password" 
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="h-14 rounded-2xl" 
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-[38px] p-2 text-[#1B4332]/20 hover:text-[#BC6C25] transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {takingLong && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center justify-center gap-2 text-[#BC6C25] text-[9px] font-black uppercase tracking-widest bg-[#BC6C25]/5 p-4 rounded-2xl border border-[#BC6C25]/10">
              <WifiOff size={14} className="animate-pulse" />
              Taking longer than usual...
            </motion.div>
          )}
        </AnimatePresence>

        <Button 
          type="submit" 
          isLoading={loading} 
          className="w-full h-16 bg-[#1B4332] hover:bg-[#2D5A47] text-white rounded-2xl shadow-xl shadow-[#1B4332]/20 font-black uppercase tracking-widest text-[11px] group"
        >
          Login <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </form>
    </motion.div>
  );
}
