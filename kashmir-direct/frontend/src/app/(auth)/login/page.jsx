'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Logo from '../../../components/ui/Logo';
import { 
  ShieldCheck, 
  Store, 
  ShoppingBag, 
  ArrowRight, 
  ArrowLeft,
  Lock
} from 'lucide-react';

export default function LoginPage() {
  const [view, setView] = useState('select'); // 'select' or 'form'
  const [selectedRole, setSelectedRole] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signIn, signOut, SUPER_ADMIN_EMAIL } = useAuth();
  const router = useRouter();
  const { supabase } = require('../../../lib/supabase');

  const roles = [
    { 
      id: 'shopkeeper', 
      title: 'Shopkeeper', 
      desc: 'Manage your shop, products and orders', 
      icon: Store, 
      color: 'bg-emerald-500',
      lightColor: 'bg-emerald-50' 
    },
    { 
      id: 'admin', 
      title: 'Super Admin', 
      desc: 'Full access to manage platform and users', 
      icon: ShieldCheck, 
      color: 'bg-indigo-500',
      lightColor: 'bg-indigo-50' 
    },
    { 
      id: 'buyer', 
      title: 'Client / Buyer', 
      desc: 'Browse products and place orders', 
      icon: ShoppingBag, 
      color: 'bg-amber-500',
      lightColor: 'bg-amber-50' 
    }
  ];

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    setView('form');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: authData, error: signInError } = await signIn({
        email,
        password,
      });

      if (signInError) throw signInError;

      // 🏛️ ADMINISTRATIVE FAST-TRACK
      if (email === SUPER_ADMIN_EMAIL) {
        toast.success('Administrative Access Granted.');
        router.push('/admin/dashboard');
        return;
      }

      // 🔍 IDENTITY VALIDATION & AUTO-HEAL
      let { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role, verification_status')
        .eq('id', authData.user.id)
        .single();
      
      // 🩹 AUTO-HEAL: If profile is missing, create it from auth metadata
      if (profileError?.code === 'PGRST116' || !profileData) {
        console.log('Auto-healing missing profile...');
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([{
            id: authData.user.id,
            full_name: authData.user.user_metadata?.full_name || 'Artisan',
            email: email,
            role: selectedRole === 'admin' ? 'admin' : (selectedRole || 'seller'),
            verification_status: selectedRole === 'admin' ? 'verified' : 'pending'
          }])
          .select()
          .single();
        
        if (!createError) profileData = newProfile;
        else throw new Error('Identity creation failed. Please register again.');
      }

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Identity Sync Error:', profileError);
        throw profileError;
      }

      // Check if Shopkeeper is verified
      if (profileData?.role === 'seller' && profileData?.verification_status !== 'verified') {
        await signOut();
        toast.error(
          "Identity Awaiting Verification. Please wait. Once verified, we will notify you.",
          { duration: 6000, icon: '⏳' }
        );
        return;
      }

      // 🚀 REDIRECTION
      // We don't wait for everything to be perfect - if we have a user and a role, we GO.
      const targetPath = profileData?.role === 'admin' ? '/admin/dashboard' : '/dashboard';
      
      toast.success('Access Granted.');
      setLoading(false); // Stop spinner BEFORE redirecting
      router.push(targetPath);

    } catch (err) {
      console.error('Login Failure:', err);
      toast.error(err.message || 'Login failed. Please check your credentials.');
      setLoading(false); // Ensure spinner stops on error
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 sm:p-10 lg:p-12 relative overflow-y-auto">
      <div className="bg-organic-mesh fixed inset-0" />
      <div className="noise-overlay fixed inset-0" />

      <motion.div 
        layout
        className="max-w-md w-full glass-card p-8 sm:p-12 rounded-[3.5rem] border border-[#1B4332]/10 shadow-[0_40px_100px_-20px_rgba(27,67,50,0.1)] relative z-10 my-12 overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {view === 'select' ? (
            <motion.div 
              key="selection"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8"
            >
              <div className="text-center">
                <Logo className="h-10 mx-auto mb-8" />
                <h2 className="text-3xl font-black text-[#1B4332] tracking-tighter">Login as</h2>
                <p className="text-xs font-bold text-[#1B4332]/30 uppercase tracking-[0.2em] mt-2">Choose your account type to continue</p>
              </div>

              <div className="space-y-4">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => handleRoleSelect(role.id)}
                    className="w-full group bg-white hover:bg-[#FDFBF7] p-5 rounded-3xl border border-[#1B4332]/5 hover:border-[#1B4332]/20 transition-all flex items-center gap-5 text-left shadow-sm hover:shadow-md"
                  >
                    <div className={`w-16 h-16 ${role.color} rounded-2xl flex items-center justify-center text-white text-2xl shadow-inner group-hover:scale-105 transition-transform`}>
                      <role.icon size={28} />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-sm font-black text-[#1B4332]">{role.title}</h3>
                      <p className="text-[10px] font-bold text-[#1B4332]/40 leading-tight mt-1">{role.desc}</p>
                    </div>
                    <ArrowRight size={16} className="text-[#1B4332]/10 group-hover:text-[#BC6C25] group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>

              <div className="pt-6 text-center">
                <div className="flex items-center justify-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                  <ShieldCheck size={12} />
                  <span>Secure Sovereign Login</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="login-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center">
                <button 
                  onClick={() => setView('select')}
                  className="inline-flex items-center gap-2 text-[10px] font-black text-[#1B4332]/30 hover:text-[#BC6C25] uppercase tracking-widest transition-colors mb-6"
                >
                  <ArrowLeft size={12} />
                  Change Account Type
                </button>
                <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-[#1B4332]/10 mb-4">
                   <span className="text-[9px] font-black tracking-[0.4em] uppercase text-[#1B4332]/40">
                    {roles.find(r => r.id === selectedRole)?.title} Vault
                   </span>
                </div>
                <h2 className="text-2xl font-black text-[#1B4332] tracking-tighter">Identity Check</h2>
              </div>

              <form className="space-y-6" onSubmit={handleLogin}>
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="artisan@valley.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  label="Secure Password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <div className="flex items-center justify-between px-2">
                   <Link href="/register" className="text-[10px] font-black text-[#BC6C25] uppercase tracking-widest hover:opacity-70">
                     Join the Valley
                   </Link>
                   <button type="button" className="text-[10px] font-black text-[#1B4332]/30 uppercase tracking-widest">
                     Recovery
                   </button>
                </div>

                <Button
                  type="submit"
                  isLoading={loading}
                  className="w-full"
                >
                  Enter the Valley
                </Button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
