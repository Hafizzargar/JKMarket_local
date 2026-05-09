'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { supabase } from '../../../lib/supabase';
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
  Lock,
  Mail
} from 'lucide-react';

export default function LoginPage() {
  const [view, setView] = useState('select'); // 'select' or 'form'
  const [selectedRole, setSelectedRole] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [cooldownActive, setCooldownActive] = useState(false);
  
  const { user, profile, signIn, signOut, isAdmin } = useAuth();
  const router = useRouter();

  // 🛡️ AUTH-GATE: Prevent logged-in users from accessing the login page
  useEffect(() => {
    if (user && profile) {
      let targetPath = '/dashboard';
      if (isAdmin) {
        targetPath = '/admin/dashboard';
      } else if (profile.role === 'customer' || profile.role === 'buyer') {
        targetPath = '/products';
      }
      window.location.replace(targetPath);
    }
  }, [user, profile, isAdmin]);

  if (user && profile) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-[#BC6C25]/20 border-t-[#BC6C25] rounded-full animate-spin" />
      </div>
    );
  }

  const roles = [
    { 
      id: 'customer', 
      title: 'Client / Buyer', 
      desc: 'Browse products and place orders', 
      icon: ShoppingBag, 
      color: 'bg-amber-500',
      lightColor: 'bg-amber-50' 
    },
    { 
      id: 'seller', 
      title: 'Shopkeeper', 
      desc: 'Manage your shop, products and orders', 
      icon: Store, 
      color: 'bg-emerald-500',
      lightColor: 'bg-emerald-50' 
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

      // 🛡️ SILENT SENTINEL: Handle error without throwing to suppress Next.js overlay
      if (signInError) {
        setLoading(false); // 🩹 ABSOLUTE RELEASE: Release spinner immediately
        console.warn('Vault Entry Denied:', signInError.message);
        
        if (signInError.message?.toLowerCase().includes('email not confirmed')) {
          setShowResend(true);
          toast.error('Identity Awaiting Activation. Please check your inbox or resend the link below.', {
            duration: 6000,
            icon: '📧',
            style: {
              borderRadius: '1.5rem',
              background: '#1B4332',
              color: '#fff',
              fontSize: '12px',
              fontWeight: '900',
              border: '1px solid rgba(255,255,255,0.1)'
            }
          });
        } else {
          toast.error(signInError.message || 'Vault Access Denied. Please check your credentials.', {
            icon: '🔒',
            style: {
              borderRadius: '1.5rem',
              background: '#1B4332',
              color: '#fff',
              fontSize: '12px',
              fontWeight: '900'
            }
          });
        }
        return; // Stop execution without throwing
      }


      console.log('--- Identity Vault: Syncing Registry ---');
      
      // 🔍 IDENTITY VALIDATION & AUTO-HEAL
      let { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role, verification_status')
        .eq('id', authData.user.id)
        .maybeSingle();
      
      // 🩹 AUTO-HEAL: If profile is missing, create it from auth metadata
      if (profileError?.code === 'PGRST116' || !profileData) {
        console.log('Identity Vault: Auto-healing missing profile...');
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([{
            id: authData.user.id,
            full_name: authData.user.user_metadata?.full_name || 'Artisan',
            email: email,
            role: selectedRole === 'admin' ? 'admin' : (selectedRole || 'customer'),
            verification_status: selectedRole === 'admin' ? 'verified' : 'pending'
          }])
          .select()
          .maybeSingle();
        
        if (!createError) profileData = newProfile;
        else {
          // 🛡️ EXPECTED RLS BEHAVIOR: Many users will hit RLS restrictions on 'profiles' table
          // We handle this gracefully via the Metadata Fallback below.
          console.warn('Identity Vault: Database entry restricted (RLS). Falling back to auth metadata.');
        }
      }

      setLoading(false);

      // 🚀 REDIRECTION
      console.log('--- Identity Vault: Access Granted, Redirecting ---');
      
      // Determine role from profile OR auth metadata fallback
      const effectiveRole = profileData?.role || authData.user.user_metadata?.role;
      const isActuallyAdmin = effectiveRole === 'admin' || effectiveRole === 'superadmin' || authData.user.app_metadata?.role === 'admin';
      
      let targetPath = '/dashboard';
      if (isActuallyAdmin) {
        targetPath = '/admin/dashboard';
      } else if (effectiveRole === 'customer' || effectiveRole === 'buyer') {
        targetPath = '/products';
      } else if (effectiveRole === 'seller' || effectiveRole === 'shopkeeper') {
        targetPath = '/dashboard';
      }
      
      toast.success('Access Granted.');
      window.location.replace(targetPath);

    } catch (err) {
      console.error('Unexpected Vault Failure:', err);
      toast.error('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  const handleResendActivation = async () => {
    if (!email || loading || cooldownActive) return;
    
    setLoading(true);
    try {
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });
      
      if (resendError) {
        console.warn('Resend Denied:', resendError.message);
        
        // 🛡️ SILENT SENTINEL: Handle rate limits without triggering Next.js overlay
        const isRateLimit = resendError.status === 429 || 
                            resendError.message?.toLowerCase().includes('rate limit') || 
                            resendError.message?.toLowerCase().includes('too many requests') ||
                            resendError.message?.toLowerCase().includes('security purposes') ||
                            resendError.message?.includes('429');

        if (isRateLimit) {
          setCooldownActive(true);
          setTimeout(() => setCooldownActive(false), 60000); // 60s Institutional Cooldown
          
          toast.error('Sovereign Cooldown Active. Please wait 60 seconds before forging a new link.', {
            id: 'resend-cooldown',
            icon: '⏳'
          });
        } else {
          toast.error(resendError.message || 'Resend failed. Please try again later.');
        }
        setLoading(false);
        return; // Stop execution without throwing
      }
      
      toast.success('Activation Link Forged. Please check your inbox.');
      setShowResend(false);
    } catch (err) {
      console.error('Unexpected Resend Failure:', err);
      toast.error('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 sm:p-10 lg:p-12 relative overflow-y-auto">
      <div className="bg-organic-mesh fixed inset-0" />
      <div className="noise-overlay fixed inset-0" />

      <motion.div 
        layout
        className={`${view === 'select' ? 'max-w-2xl' : 'max-w-md'} w-full glass-card p-8 sm:p-12 rounded-[3.5rem] border border-[#1B4332]/10 shadow-[0_40px_100px_-20px_rgba(27,67,50,0.1)] relative z-10 my-12 transition-all duration-700`}
      >
        <AnimatePresence mode="wait">
          {view === 'select' ? (
            <motion.div 
              key="selection"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="space-y-12"
            >
              <div className="text-center">
                <Logo className="h-10 mx-auto mb-8" />
                <h2 className="text-4xl font-black text-[#1B4332] tracking-tighter">Login as</h2>
                <p className="text-[10px] font-black text-[#1B4332]/30 uppercase tracking-[0.3em] mt-3">Choose your identity to enter the valley</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl mx-auto">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => handleRoleSelect(role.id)}
                    className="group relative bg-white/50 hover:bg-white p-8 rounded-[2.5rem] border border-[#1B4332]/5 hover:border-[#1B4332]/20 transition-all text-center flex flex-col items-center gap-6 shadow-sm hover:shadow-xl hover:-translate-y-2"
                  >
                    <div className={`w-20 h-20 ${role.color} rounded-3xl flex items-center justify-center text-white text-3xl shadow-lg group-hover:rotate-6 transition-transform duration-500`}>
                      <role.icon size={32} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-sm font-black text-[#1B4332] uppercase tracking-wider">{role.title}</h3>
                      <p className="text-[9px] font-bold text-[#1B4332]/40 leading-relaxed px-2 uppercase tracking-tighter">
                        {role.desc}
                      </p>
                    </div>
                    <div className="absolute bottom-4 opacity-0 group-hover:opacity-100 transition-opacity">
                       <ArrowRight size={14} className="text-[#BC6C25]" />
                    </div>
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

                <AnimatePresence>
                  {showResend && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="p-4 rounded-2xl bg-[#BC6C25]/5 border border-[#BC6C25]/10 text-center space-y-3 mb-6"
                    >
                       <p className="text-[10px] font-black uppercase tracking-widest text-[#BC6C25]/60 flex items-center justify-center gap-2">
                          <Mail size={12} />
                          Identity Awaiting Activation
                       </p>
                       <button 
                         type="button"
                         onClick={handleResendActivation}
                         disabled={loading || cooldownActive}
                         className={`text-[10px] font-black uppercase tracking-widest text-[#BC6C25] ${cooldownActive ? 'opacity-50 cursor-not-allowed' : 'hover:underline underline-offset-4'}`}
                       >
                         {cooldownActive ? 'Wait to Resend...' : 'Resend Activation Link'}
                       </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button
                  type="submit"
                  isLoading={loading}
                  className="w-full h-14 bg-[#1B4332] hover:bg-[#2D5A47] text-white rounded-2xl group shadow-2xl shadow-[#1B4332]/20"
                >
                  Enter the Valley <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
