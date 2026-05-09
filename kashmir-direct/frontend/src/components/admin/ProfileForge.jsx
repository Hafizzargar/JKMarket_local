'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Mail, Phone, ShieldCheck, Camera, Loader2, Save, Globe,
  Shield, Zap
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

import { useRouter } from 'next/navigation';

export default function ProfileForge({ profile, onUpdate }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    email: profile?.email || '',
    phone_number: profile?.phone_number || '',
    address: profile?.address || 'Quantum Command Center',
  });
  const [isDirty, setIsDirty] = useState(false);

  // 🛡️ SOVEREIGN DIRTY CHECKING
  useEffect(() => {
    const hasChanged = 
      formData.full_name !== (profile?.full_name || '') ||
      formData.phone_number !== (profile?.phone_number || '') ||
      formData.address !== (profile?.address || 'Quantum Command Center');
    
    setIsDirty(hasChanged);
  }, [formData, profile]);

  const handleUpdateProfile = async (e) => {
    if (e) e.preventDefault();
    console.log('🛡️ IDENTITY FORGE INITIATED');
    
    setLoading(true);
    try {
      if (!profile?.id) throw new Error('Identity Node ID missing');

      console.log('🔑 CHECKING VAULT CONNECTIVITY...');
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData?.session) {
        console.error('❌ SESSION EXPIRED OR INVALID');
        toast.error('Sovereign session expired. Re-authenticating...');
        setTimeout(() => router.push('/login'), 1500);
        return;
      }

      console.log('📡 SESSION STATUS: ACTIVE');

      console.log('📡 DISPATCHING TO SUPABASE VAULT...');
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          phone_number: formData.phone_number,
        })
        .eq('id', profile.id);

      if (error) {
        console.error('🛰️ VAULT ERROR:', error);
        throw error;
      }
      
      console.log('✅ VAULT SYNCHRONIZED SUCCESSFULLY');
      toast.success('Identity Forge Complete');
      setIsDirty(false);
      
      if (onUpdate) await onUpdate();
    } catch (err) {
      console.error('❌ IDENTITY FORGE FAILURE:', err);
      toast.error(err.message || 'Identity synchronization failed.');
    } finally {
      console.log('🏁 FORGE CYCLE COMPLETE');
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-8 max-w-6xl mx-auto">
      {/* 🏹 HEADER ACTION BAR */}
      <header className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-8 gap-6">
         <div>
            <h2 className="text-xl font-black text-white uppercase tracking-[0.3em] italic">Identity Forge</h2>
            <p className="text-[10px] text-white/30 uppercase mt-2 tracking-widest font-bold italic max-w-xs">Modify Sovereign Access Protocol</p>
         </div>
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#BC6C25]/5 border border-[#BC6C25]/10 rounded-full">
               <ShieldCheck size={10} className="text-[#BC6C25]" />
               <span className="text-[8px] font-black text-[#BC6C25] uppercase tracking-widest">Clearance Level 5</span>
            </div>
            {isDirty && (
              <button 
                  onClick={handleUpdateProfile}
                  disabled={loading} 
                  className="h-12 px-8 rounded-xl bg-[#BC6C25] hover:bg-[#A65D1F] transition-all shadow-[0_0_20px_rgba(188,108,37,0.3)] flex items-center justify-center gap-3 group shrink-0"
              >
                  {loading ? (
                    <Loader2 size={14} className="animate-spin text-white" />
                  ) : (
                    <>
                       <Save size={12} className="text-white group-hover:scale-110 transition-transform" />
                       <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white">Commit Changes</span>
                    </>
                  )}
              </button>
            )}
         </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-12 items-start">
         {/* 📸 AVATAR / DESIGNATION */}
         <div className="w-full lg:w-64 flex flex-col items-center gap-6 shrink-0">
            <div className="relative group">
               <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-[#BC6C25] to-[#E87C2A] flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-[#BC6C25]/20 border-4 border-[#1A2220]">
                  {formData.full_name.substring(0, 2).toUpperCase() || 'AD'}
               </div>
               <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#141A18] border border-white/10 rounded-xl flex items-center justify-center text-white/40 hover:text-[#BC6C25] transition-all shadow-xl">
                  <Camera size={18} />
               </button>
            </div>
            <div className="text-center space-y-2">
               <p className="text-[10px] font-black text-[#BC6C25] uppercase tracking-widest leading-none">Super Admin</p>
               <p className="text-[7px] font-black text-white/10 uppercase tracking-[0.2em] px-4 leading-relaxed italic">Quantum Node Operator</p>
            </div>
         </div>

         {/* 📝 FIELDS GRID - SINGLE SCREEN STYLE */}
         <div className="flex-1 w-full space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
               {/* 📧 EMAIL - LOCKED */}
               <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-1 opacity-40 cursor-not-allowed">
                  <label className="text-[7px] font-black uppercase text-white/20 tracking-widest flex items-center gap-2"><Mail size={8} /> Secure Email</label>
                  <p className="text-[12px] font-bold text-white/70 truncate">{formData.email}</p>
               </div>

               {/* 📞 PHONE */}
               <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 space-y-1 focus-within:border-[#BC6C25]/40 transition-all">
                  <label className="text-[7px] font-black uppercase text-[#BC6C25] tracking-widest flex items-center gap-2"><Phone size={8} /> Phone Protocol</label>
                  <input 
                     className="w-full bg-transparent border-none p-0 text-[12px] font-bold text-white focus:outline-none placeholder:text-white/10"
                     value={formData.phone_number} 
                     onChange={e => { setFormData({...formData, phone_number: e.target.value}); }}
                     placeholder="+91 XXXXX XXXXX"
                  />
               </div>

               {/* 🛡️ ROLE - LOCKED */}
               <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-1 opacity-40 cursor-not-allowed">
                  <label className="text-[7px] font-black uppercase text-white/20 tracking-widest flex items-center gap-2"><Zap size={8} /> Access Level</label>
                  <p className="text-[12px] font-bold text-white/70 truncate">SUPER ADMIN</p>
               </div>

               {/* 🌍 REGION - LOCKED */}
               <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-1 opacity-40 cursor-not-allowed">
                  <label className="text-[7px] font-black uppercase text-white/20 tracking-widest flex items-center gap-2"><Globe size={8} /> Global Presence</label>
                  <p className="text-[12px] font-bold text-white/70 truncate">KASHMIR DIRECT</p>
               </div>
            </div>

            {/* EDITABLE DETAIL ROW */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
               <div className="space-y-2">
                  <label className="text-[8px] font-black uppercase text-white/40 tracking-widest ml-1">Full Identity Name</label>
                  <div className="relative">
                     <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/10" size={14} />
                     <input 
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-[11px] font-bold text-white focus:outline-none focus:border-[#BC6C25]/60 transition-colors"
                        value={formData.full_name} 
                        onChange={e => { setFormData({...formData, full_name: e.target.value}); }} 
                     />
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="text-[8px] font-black uppercase text-white/40 tracking-widest ml-1">Command Hub Address</label>
                  <div className="relative">
                     <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-white/10" size={14} />
                     <input 
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-[11px] font-bold text-white focus:outline-none focus:border-[#BC6C25]/60 transition-colors"
                        value={formData.address} 
                        onChange={e => { setFormData({...formData, address: e.target.value}); }} 
                     />
                  </div>
               </div>
            </div>

            {/* 🛡️ SECURITY STATUS */}
            <div className="p-8 rounded-[2rem] bg-gradient-to-br from-[#BC6C25]/5 to-transparent border border-[#BC6C25]/10 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#BC6C25]/20 flex items-center justify-center">
                     <Shield size={20} className="text-[#BC6C25]" />
                  </div>
                  <div>
                     <p className="text-[10px] font-black text-white uppercase tracking-wider">Vault Integrity</p>
                     <p className="text-[8px] font-bold text-white/20 uppercase tracking-tighter mt-0.5">256-bit AES identity shielding active</p>
                  </div>
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#2ECC71] animate-pulse" />
                  <p className="text-[7px] font-black text-[#2ECC71] uppercase tracking-widest">Secured</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
