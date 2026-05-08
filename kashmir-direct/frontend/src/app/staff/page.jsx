'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Briefcase, HardHat, Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';

export default function StaffPortal() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleStaffLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Authenticate
      const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // 2. Role Check (Only Employees Allowed)
      const { data: profile, error: profError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profError) throw profError;

      const allowedRoles = ['superadmin', 'manager', 'labour'];
      if (!allowedRoles.includes(profile.role)) {
        await supabase.auth.signOut();
        throw new Error('Access Denied: This portal is for Staff Personnel only.');
      }

      // 3. Success Redirect
      toast.success(`Welcome to the Ops Sector, ${profile.role.toUpperCase()}`);
      
      if (profile.role === 'superadmin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }

    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1E16] flex items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* 🌌 AMBIENT STAFF BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#BC6C25]/10 blur-[150px] rounded-full" />
         <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-900/20 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-[#1B4332] rounded-[3.5rem] p-12 border border-white/5 shadow-2xl">
           <div className="text-center mb-10">
              <div className="w-20 h-20 bg-[#BC6C25] rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-[#BC6C25]/20">
                 <ShieldCheck size={40} className="text-white" />
              </div>
              <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">Staff Portal</h1>
              <p className="text-[10px] font-black text-[#BC6C25] uppercase tracking-[0.4em] mt-2">Restricted Access Zone</p>
           </div>

           <form onSubmit={handleStaffLogin} className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-4">Personnel Email</label>
                 <div className="relative">
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@kashmirdirect.com"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#BC6C25]/20 transition-all"
                      required
                    />
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-4">Access Code (Password)</label>
                 <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#BC6C25]/20 transition-all"
                    required
                 />
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-16 rounded-[1.5rem] bg-[#BC6C25] hover:bg-[#A65D1F] text-white font-black uppercase tracking-widest text-[11px] shadow-xl shadow-[#BC6C25]/20 mt-6"
              >
                {loading ? <Loader2 className="animate-spin" /> : (
                  <div className="flex items-center justify-center gap-3">
                     Verify Identity <ArrowRight size={16} />
                  </div>
                )}
              </Button>
           </form>

           <div className="mt-12 flex items-center justify-center gap-6">
              <div className="flex flex-col items-center gap-1 opacity-40">
                 <Briefcase size={16} className="text-white" />
                 <span className="text-[8px] font-bold text-white uppercase tracking-tighter">Managers</span>
              </div>
              <div className="w-[1px] h-6 bg-white/10" />
              <div className="flex flex-col items-center gap-1 opacity-40">
                 <HardHat size={16} className="text-white" />
                 <span className="text-[8px] font-bold text-white uppercase tracking-tighter">Labours</span>
              </div>
              <div className="w-[1px] h-6 bg-white/10" />
              <div className="flex flex-col items-center gap-1 opacity-40">
                 <Lock size={16} className="text-white" />
                 <span className="text-[8px] font-bold text-white uppercase tracking-tighter">Admins</span>
              </div>
           </div>
        </div>

        <p className="text-center mt-10 text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">
           Property of Kashmir Direct • System V.2.0
        </p>
      </motion.div>
    </div>
  );
}
