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
    address: profile?.address || 'Main Office',
  });
  const [isDirty, setIsDirty] = useState(false);

  // 🛡️ SOVEREIGN DIRTY CHECKING
  useEffect(() => {
    const hasChanged = 
      formData.full_name !== (profile?.full_name || '') ||
      formData.phone_number !== (profile?.phone_number || '') ||
      formData.address !== (profile?.address || 'Main Office');
    
    setIsDirty(hasChanged);
  }, [formData, profile]);

  const handleUpdateProfile = async (e) => {
    if (e) e.preventDefault();
    console.log('🛡️ IDENTITY UPDATE INITIATED');
    
    setLoading(true);
    try {
      if (!profile?.id) throw new Error('User ID missing');

      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData?.session) {
        toast.error('Session expired. Please login again.');
        setTimeout(() => router.replace('/login'), 1500);
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          phone_number: formData.phone_number,
        })
        .eq('id', profile.id);

      if (error) throw error;
      
      toast.success('Profile updated successfully');
      setIsDirty(false);
      
      if (onUpdate) await onUpdate();
    } catch (err) {
      toast.error(err.message || 'Update failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-12 max-w-6xl mx-auto">
      {/* 🏹 HEADER ACTION BAR */}
      <header className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#1B4332]/5 pb-8 gap-6">
         <div>
            <h2 className="text-2xl font-black text-[#1B4332] uppercase tracking-[0.3em] italic">My Profile</h2>
            <p className="text-[10px] text-[#1B4332]/30 uppercase mt-2 tracking-widest font-bold italic max-w-xs">Update your personal and account details</p>
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
                  className="h-12 px-8 rounded-xl bg-[#BC6C25] hover:bg-[#A65D1F] transition-all shadow-2xl shadow-[#BC6C25]/20 flex items-center justify-center gap-3 group shrink-0"
              >
                  {loading ? (
                    <Loader2 size={14} className="animate-spin text-white" />
                  ) : (
                    <>
                       <Save size={12} className="text-white group-hover:scale-110 transition-transform" />
                       <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white">Save Changes</span>
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
               <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-[#BC6C25] to-[#E87C2A] flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-[#BC6C25]/20 border-4 border-white">
                  {formData.full_name.substring(0, 2).toUpperCase() || 'AD'}
               </div>
               <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-white border border-[#1B4332]/10 rounded-xl flex items-center justify-center text-[#1B4332]/20 hover:text-[#BC6C25] transition-all shadow-xl">
                  <Camera size={18} />
               </button>
            </div>
            <div className="text-center space-y-2">
               <p className="text-[11px] font-black text-[#BC6C25] uppercase tracking-widest leading-none">Super Admin</p>
               <p className="text-[8px] font-black text-[#1B4332]/20 uppercase tracking-[0.2em] px-4 leading-relaxed italic">Administrator</p>
            </div>
         </div>

         {/* 📝 FIELDS GRID - SINGLE SCREEN STYLE */}
         <div className="flex-1 w-full space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
               {/* 📧 EMAIL - LOCKED */}
               <div className="bg-[#1B4332]/5 border border-[#1B4332]/5 rounded-2xl p-5 space-y-1 opacity-60 cursor-not-allowed">
                  <label className="text-[7px] font-black uppercase text-[#1B4332]/40 tracking-widest flex items-center gap-2"><Mail size={8} /> Account Email</label>
                  <p className="text-[12px] font-bold text-[#1B4332]/70 truncate">{formData.email}</p>
               </div>

               {/* 📞 PHONE */}
               <div className="bg-[#1B4332]/[0.02] border border-[#1B4332]/10 rounded-2xl p-5 space-y-1 focus-within:border-[#BC6C25]/40 transition-all shadow-sm">
                  <label className="text-[7px] font-black uppercase text-[#BC6C25] tracking-widest flex items-center gap-2"><Phone size={8} /> Phone Number</label>
                  <input 
                     className="w-full bg-transparent border-none p-0 text-[12px] font-bold text-[#1B4332] focus:outline-none placeholder:text-[#1B4332]/10"
                     value={formData.phone_number} 
                     onChange={e => { setFormData({...formData, phone_number: e.target.value}); }}
                     placeholder="+91 XXXXX XXXXX"
                  />
               </div>

               {/* 🛡️ ROLE - LOCKED */}
               <div className="bg-[#1B4332]/5 border border-[#1B4332]/5 rounded-2xl p-5 space-y-1 opacity-60 cursor-not-allowed">
                  <label className="text-[7px] font-black uppercase text-[#1B4332]/40 tracking-widest flex items-center gap-2"><Zap size={8} /> Access Role</label>
                  <p className="text-[12px] font-bold text-[#1B4332]/70 truncate">Super Admin</p>
               </div>

               {/* 🌍 REGION - LOCKED */}
               <div className="bg-[#1B4332]/5 border border-[#1B4332]/5 rounded-2xl p-5 space-y-1 opacity-60 cursor-not-allowed">
                  <label className="text-[7px] font-black uppercase text-[#1B4332]/40 tracking-widest flex items-center gap-2"><Globe size={8} /> Company</label>
                  <p className="text-[12px] font-bold text-[#1B4332]/70 truncate">Kashmir Direct</p>
               </div>
            </div>

            {/* EDITABLE DETAIL ROW */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
               <div className="space-y-3">
                  <label className="text-[8px] font-black uppercase text-[#1B4332]/40 tracking-widest ml-1">Full Name</label>
                  <div className="relative">
                     <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1B4332]/10" size={14} />
                     <input 
                        className="w-full bg-white border border-[#1B4332]/10 rounded-xl pl-12 pr-4 py-4 text-[11px] font-bold text-[#1B4332] focus:outline-none focus:border-[#BC6C25]/60 transition-colors shadow-sm"
                        value={formData.full_name} 
                        onChange={e => { setFormData({...formData, full_name: e.target.value}); }} 
                     />
                  </div>
               </div>
               <div className="space-y-3">
                  <label className="text-[8px] font-black uppercase text-[#1B4332]/40 tracking-widest ml-1">Office Address</label>
                  <div className="relative">
                     <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1B4332]/10" size={14} />
                     <input 
                        className="w-full bg-white border border-[#1B4332]/10 rounded-xl pl-12 pr-4 py-4 text-[11px] font-bold text-[#1B4332] focus:outline-none focus:border-[#BC6C25]/60 transition-colors shadow-sm"
                        value={formData.address} 
                        onChange={e => { setFormData({...formData, address: e.target.value}); }} 
                     />
                  </div>
               </div>
            </div>

            {/* 🛡️ SECURITY STATUS */}
            <div className="p-8 rounded-[2rem] bg-gradient-to-br from-[#BC6C25]/5 to-white border border-[#BC6C25]/10 flex items-center justify-between shadow-sm">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#BC6C25]/10 flex items-center justify-center border border-[#BC6C25]/20">
                     <Shield size={20} className="text-[#BC6C25]" />
                  </div>
                  <div>
                     <p className="text-[10px] font-black text-[#1B4332] uppercase tracking-wider">Account Security</p>
                     <p className="text-[8px] font-bold text-[#1B4332]/30 uppercase tracking-tighter mt-0.5">Identity protection active</p>
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
