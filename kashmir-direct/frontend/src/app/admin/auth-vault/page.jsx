'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, ArrowRight, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import Logo from '../../../components/ui/Logo';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

export default function AdminAuthVault() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, SUPER_ADMIN_EMAIL } = useAuth();
  const router = useRouter();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    if (email.trim().toLowerCase() !== SUPER_ADMIN_EMAIL.trim().toLowerCase()) {
      toast.error('Unauthorized Access Attempt. This incident will be reported.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await signIn({ email, password });
      if (error) throw error;

      toast.success('Sovereign Access Granted.');
      router.push('/admin/dashboard');
    } catch (err) {
      // 🛡️ IDENTITY ACTIVATION HANDLER
      if (err.message?.toLowerCase().includes('email not confirmed')) {
        toast.error('Identity Awaiting Activation. Please check your admin inbox.', {
          icon: '📧',
          style: {
            borderRadius: '1rem',
            background: '#1B4332',
            color: '#fff',
            fontSize: '11px',
            fontWeight: '900'
          }
        });
      } else {
        toast.error('Access Denied. Institutional credentials invalid.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#081C15] relative overflow-hidden">
      {/* 🌌 DARK AMBIENT BACKGROUND */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#1B4332]/20 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#BC6C25]/5 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/4" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white/[0.03] backdrop-blur-3xl p-10 sm:p-12 rounded-[3.5rem] border border-white/10 shadow-2xl relative z-10"
      >
        <div className="text-center space-y-6 mb-12">
           <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-white/10 bg-white/5">
              <ShieldCheck size={12} className="text-[#BC6C25]" />
              <span className="text-[9px] font-black tracking-[0.4em] uppercase text-white/40">Secure Sovereign Vault</span>
           </div>
           
           <div className="space-y-2">
              <h1 className="text-4xl font-black text-white tracking-tighter">Admin Portal</h1>
              <p className="text-xs font-bold text-white/30 uppercase tracking-[0.2em]">Enter Institutional Credentials</p>
           </div>
        </div>

        <form onSubmit={handleAdminLogin} className="space-y-6">
           <div className="space-y-4">
              <div className="relative group">
                 <Input 
                   label="Administrative ID"
                   type="email"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   className="bg-white/5 border-white/10 text-white placeholder:text-white/10 focus:border-[#BC6C25]/50"
                   required
                 />
              </div>
              <div className="relative group">
                 <Input 
                   label="Secure Key"
                   type="password"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   className="bg-white/5 border-white/10 text-white placeholder:text-white/10 focus:border-[#BC6C25]/50"
                   required
                 />
              </div>
           </div>

           <Button 
             type="submit" 
             isLoading={loading}
             className="w-full h-14 bg-[#BC6C25] hover:bg-[#D4A373] text-white rounded-2xl group shadow-2xl shadow-black/40"
           >
             Unlock Systems <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
           </Button>
        </form>

        <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-center gap-2">
           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Active Security Node: 742-KD</span>
        </div>
      </motion.div>
    </div>
  );
}
