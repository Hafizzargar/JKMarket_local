'use client';

import { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, ShieldCheck, Camera, Loader2, Save, Globe,
  Shield, Zap, Building2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { ForgeInput } from './shared/ForgeComponents';

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
      <div className="flex flex-col lg:flex-row gap-16 items-start pt-4 relative">
         {/* 🏹 COMMIT BUTTON - FLOATING OR TOP-RIGHT */}
         {isDirty && (
           <button 
               onClick={handleUpdateProfile}
               disabled={loading} 
               className="absolute top-0 right-0 h-11 px-6 rounded-xl bg-[#BC6C25] hover:bg-[#A65D1F] transition-all shadow-xl shadow-[#BC6C25]/20 flex items-center justify-center gap-3 group z-10"
           >
               {loading ? (
                 <Loader2 size={14} className="animate-spin text-white" />
               ) : (
                 <>
                    <Save size={14} className="text-white group-hover:scale-110 transition-transform" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-white">Save Changes</span>
                 </>
               )}
           </button>
         )}

         {/* 📸 AVATAR / DESIGNATION */}
         <div className="w-full lg:w-72 flex flex-col items-center gap-8 shrink-0 bg-white p-10 rounded-[3rem] border border-[#1B4332]/5 shadow-xl shadow-[#1B4332]/[0.02]">
            <div className="relative group">
               <div className="w-40 h-40 rounded-[3rem] bg-gradient-to-br from-[#BC6C25] to-[#E87C2A] flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-[#BC6C25]/30 border-[6px] border-white overflow-hidden relative">
                  {formData.full_name.substring(0, 2).toUpperCase() || 'AD'}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <Camera size={32} className="text-white/80" />
                  </div>
               </div>
               <button className="absolute -bottom-2 -right-2 w-12 h-12 bg-white border border-[#1B4332]/10 rounded-2xl flex items-center justify-center text-[#1B4332]/20 hover:text-[#BC6C25] transition-all shadow-2xl">
                  <Camera size={20} />
               </button>
            </div>
            <div className="text-center space-y-3">
               <div className="px-4 py-1.5 bg-[#1B4332]/5 rounded-lg border border-[#1B4332]/10 inline-block">
                  <p className="text-[11px] font-black text-[#1B4332] uppercase tracking-widest">Super Admin</p>
               </div>
               <p className="text-[9px] font-black text-[#BC6C25]/40 uppercase tracking-[0.3em] leading-relaxed italic">Platform Architect</p>
            </div>
         </div>

         {/* 📝 FIELDS GRID */}
         <div className="flex-1 w-full space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <ForgeInput 
                  label="Legal Full Name"
                  icon={User}
                  placeholder="Enter your full name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
               />
               <ForgeInput 
                  label="Account Email"
                  icon={Mail}
                  value={formData.email}
                  disabled={true}
                  placeholder="locked@system.com"
               />
               <ForgeInput 
                  label="Contact Number"
                  icon={Phone}
                  placeholder="+91 XXXXX XXXXX"
                  value={formData.phone_number}
                  onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
               />
               <ForgeInput 
                  label="Administrative Node"
                  icon={Globe}
                  placeholder="Office Location"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
               />
            </div>

            {/* READ-ONLY STATUS ROW */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
               <div className="p-5 bg-[#1B4332]/[0.02] border border-[#1B4332]/5 rounded-2xl flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#1B4332]/5 flex items-center justify-center text-[#1B4332]/20">
                     <Zap size={18} />
                  </div>
                  <div>
                     <p className="text-[8px] font-black text-[#1B4332]/30 uppercase tracking-widest">Authority</p>
                     <p className="text-[11px] font-black text-[#1B4332] uppercase">Level 5</p>
                  </div>
               </div>
               <div className="p-5 bg-[#1B4332]/[0.02] border border-[#1B4332]/5 rounded-2xl flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#1B4332]/5 flex items-center justify-center text-[#1B4332]/20">
                     <Building2 size={18} />
                  </div>
                  <div>
                     <p className="text-[8px] font-black text-[#1B4332]/30 uppercase tracking-widest">Entity</p>
                     <p className="text-[11px] font-black text-[#1B4332] uppercase tracking-tighter">Kashmir Direct</p>
                  </div>
               </div>
               <div className="p-5 bg-emerald-500/[0.03] border border-emerald-500/10 rounded-2xl flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-emerald-500/10 flex items-center justify-center text-emerald-500">
                     <ShieldCheck size={18} />
                  </div>
                  <div>
                     <p className="text-[8px] font-black text-emerald-600/40 uppercase tracking-widest">Security</p>
                     <p className="text-[11px] font-black text-emerald-600 uppercase">Harden Active</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
