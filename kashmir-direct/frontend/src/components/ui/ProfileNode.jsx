'use client';

import { useState, useRef, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { 
  User, Mail, Phone, ShieldCheck, MapPin, Lock, Camera, Loader2, Save, Globe,
  Eye, EyeOff, ShieldAlert, KeyRound, Fingerprint
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProfileNode({ isModal = false }) {
  const { user, profile, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [profileData, setProfileData] = useState({
    full_name: '',
    address: '',
    phone_number: ''
  });
  const [securityData, setSecurityData] = useState({
    password: '',
    confirmPassword: ''
  });
  
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (profile) {
      setProfileData({
        full_name: profile.full_name || '',
        address: profile.seller?.address || profile.address || '',
        phone_number: profile.seller?.phone_number || profile.phone_number || ''
      });
      setAvatarUrl(profile.avatar_url);
    }
  }, [profile]);

  useEffect(() => {
    if (!profile) return;
    if (activeTab === 'profile') {
      const dbAddress = profile.seller?.address || profile.address || '';
      const dbPhone = profile.seller?.phone_number || profile.phone_number || '';
      setIsDirty(
        profileData.full_name !== (profile.full_name || '') ||
        profileData.address !== dbAddress ||
        profileData.phone_number !== dbPhone
      );
    } else {
      setIsDirty(securityData.password !== '' && securityData.password === securityData.confirmPassword);
    }
  }, [profileData, securityData, profile, activeTab]);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const path = `avatars/${user.id}_${Date.now()}`;
      const { error: uploadErr } = await supabase.storage.from('product_images').upload(path, file);
      if (uploadErr) throw uploadErr;

      const { data: { publicUrl } } = supabase.storage.from('product_images').getPublicUrl(path);
      const { error: profileErr } = await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', user.id);
      if (profileErr) throw profileErr;

      await refreshProfile();
      toast.success('Photo Updated');
    } catch (err) { 
      console.error('Avatar Error:', err);
      toast.error('Upload failed'); 
    } finally { setUploading(false); }
  };

  const handleUpdate = async (e) => {
    if (e) e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    console.log('🚀 Starting Update Process...', activeTab);

    try {
      if (activeTab === 'profile') {
        const cleanName = profileData.full_name.trim().replace(/\s+/g, ' ');
        const cleanAddress = profileData.address.trim();
        const cleanPhone = profileData.phone_number.trim();

        // 1. Update Profiles Table
        const { error: pErr } = await supabase.from('profiles').update({ 
          full_name: cleanName,
          address: cleanAddress,
          phone_number: cleanPhone
        }).eq('id', user.id);
        if (pErr) throw pErr;

        // 2. Update Sellers Table
        const { error: sErr } = await supabase.from('sellers').update({ 
          address: cleanAddress, 
          phone_number: cleanPhone 
        }).eq('user_id', user.id);
        if (sErr) throw sErr;

        toast.success('Profile Saved');
      } else {
        // 🔐 Password Logic
        if (securityData.password.length < 6) throw new Error('Password must be at least 6 characters');
        if (securityData.password !== securityData.confirmPassword) throw new Error('Passwords do not match');

        console.log('🔐 Updating Auth Password...');
        const { error: authErr } = await supabase.auth.updateUser({ password: securityData.password });
        if (authErr) throw authErr;

        toast.success('Password Updated Successfully');
        setSecurityData({ password: '', confirmPassword: '' });
      }

      console.log('🔄 Refreshing Global State...');
      await refreshProfile();
      setIsDirty(false);
    } catch (err) { 
      console.error('❌ Update Error:', err);
      toast.error(err.message || 'Connection failed'); 
    } finally { 
      console.log('✅ Update Process Finished');
      setLoading(false); 
    }
  };

  if (!user) return null;

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-10 pb-8 border-b border-[#1B4332]/10">
         <div className="flex items-center gap-6">
            {/* 👤 HEADER AVATAR */}
            <div className="relative group shrink-0">
               <div className="w-20 h-20 rounded-[1.25rem] bg-gradient-to-br from-[#BC6C25] to-[#A65D1F] p-0.5 shadow-xl transition-transform hover:scale-105">
                  <div className="w-full h-full rounded-[1.1rem] overflow-hidden bg-white relative">
                     {avatarUrl ? <img src={avatarUrl} className={`w-full h-full object-cover ${uploading ? 'opacity-30' : 'opacity-100'}`} /> : <div className="w-full h-full flex items-center justify-center bg-[#1B4332]/5 text-[#1B4332]/20 italic text-[7px] font-black uppercase tracking-widest text-center px-2">No Image</div>}
                     {uploading && <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-sm"><Loader2 size={16} className="animate-spin text-[#BC6C25]" /></div>}
                  </div>
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#BC6C25] text-white rounded-lg shadow-xl flex items-center justify-center border-2 border-white hover:bg-[#1B4332] transition-all"><Camera size={12} /></button>
               </div>
               <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} className="hidden" accept="image/*" />
            </div>

            <div className="space-y-1">
               <div className="flex items-center gap-3">
                  <h1 className="text-xl font-black text-[#1B4332] tracking-tighter uppercase">Account <span className="text-[#BC6C25]">Profile</span></h1>
                  <div className="px-3 py-1 bg-emerald-500/5 border border-emerald-500/10 rounded-full flex items-center gap-1.5">
                    <ShieldCheck size={10} className="text-emerald-500" />
                    <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest leading-none">Verified {profile?.role === 'customer' || profile?.role === 'buyer' ? 'Member' : 'Seller'}</span>
                  </div>
               </div>
               <h2 className="text-sm font-black text-[#1B4332]/40 uppercase tracking-tight">{profileData.full_name || 'Artisan'}</h2>
               <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#1B4332]/20">Manage your personal details</p>
            </div>
         </div>
         
         <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-[#1B4332]/5 p-1 rounded-xl w-fit">
               <button onClick={() => setActiveTab('profile')} className={`px-5 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'profile' ? 'bg-white text-[#1B4332] shadow-sm' : 'text-[#1B4332]/40 hover:text-[#1B4332]'}`}><User size={12} /> Profile</button>
               <button onClick={() => setActiveTab('security')} className={`px-5 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'security' ? 'bg-white text-[#1B4332] shadow-sm' : 'text-[#1B4332]/40 hover:text-[#1B4332]'}`}><Lock size={12} /> Security</button>
            </div>
            
            <button 
               onClick={handleUpdate} 
               disabled={loading || !isDirty} 
               className={`h-10 px-8 rounded-xl font-black uppercase text-[9px] tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${isDirty ? 'bg-[#BC6C25] text-white shadow-lg hover:scale-105 active:scale-95' : 'bg-[#1B4332]/5 text-[#1B4332]/20 cursor-not-allowed'}`}
            >
               {loading ? <Loader2 size={14} className="animate-spin" /> : <> <Save size={14} /> {activeTab === 'profile' ? 'Save Changes' : 'Update Password'} </>}
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
         {/* 📝 LEFT COLUMN: FORM DETAILS */}
         <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
               {activeTab === 'profile' ? (
                  <motion.div key="profile-tab" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                     <div className="space-y-1.5"><label className="text-[9px] font-black text-[#1B4332]/30 uppercase tracking-widest ml-1">Full Name</label><input className="w-full bg-[#1B4332]/5 border border-transparent rounded-xl px-5 py-3 text-[12px] font-bold text-[#1B4332] focus:bg-white focus:ring-2 focus:ring-[#BC6C25]/20 focus:border-[#BC6C25]/20 transition-all outline-none shadow-sm" value={profileData.full_name} onChange={e => setProfileData({...profileData, full_name: e.target.value})} /></div>
                     <div className="space-y-1.5"><label className="text-[9px] font-black text-[#1B4332]/30 uppercase tracking-widest ml-1">Email Address</label><input className="w-full bg-[#1B4332]/5 border border-transparent rounded-xl px-5 py-3 text-[12px] font-bold text-[#1B4332]/30 cursor-not-allowed outline-none" value={user?.email} disabled /></div>
                     <div className="space-y-1.5"><label className="text-[9px] font-black text-[#1B4332]/30 uppercase tracking-widest ml-1">Phone Number</label><input className="w-full bg-[#1B4332]/5 border border-transparent rounded-xl px-5 py-3 text-[12px] font-bold text-[#1B4332] focus:bg-white focus:ring-2 focus:ring-[#BC6C25]/20 focus:border-[#BC6C25]/20 transition-all outline-none shadow-sm" value={profileData.phone_number} onChange={e => setProfileData({...profileData, phone_number: e.target.value})} /></div>
                     <div className="space-y-1.5"><label className="text-[9px] font-black text-[#1B4332]/30 uppercase tracking-widest ml-1">Boutique Address</label><input className="w-full bg-[#1B4332]/5 border border-transparent rounded-xl px-5 py-3 text-[12px] font-bold text-[#1B4332] focus:bg-white focus:ring-2 focus:ring-[#BC6C25]/20 focus:border-[#BC6C25]/20 transition-all outline-none shadow-sm" value={profileData.address} onChange={e => setProfileData({...profileData, address: e.target.value})} /></div>
                  </motion.div>
               ) : (
                  <motion.div key="security-tab" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-5 max-w-sm">
                     <div className="relative">
                        <input type={showPassword ? "text" : "password"} className="w-full bg-[#1B4332]/5 border border-transparent rounded-xl px-5 py-3.5 text-[12px] font-bold text-[#1B4332] focus:bg-white focus:ring-2 focus:ring-[#BC6C25]/20 transition-all outline-none shadow-sm" placeholder="Enter New Password" value={securityData.password} onChange={e => setSecurityData({...securityData, password: e.target.value})} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1B4332]/20 hover:text-[#BC6C25] transition-colors">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                     </div>
                     <input type={showPassword ? "text" : "password"} className="w-full bg-[#1B4332]/5 border border-transparent rounded-xl px-5 py-3.5 text-[12px] font-bold text-[#1B4332] focus:bg-white focus:ring-2 focus:ring-[#BC6C25]/20 transition-all outline-none shadow-sm" placeholder="Confirm New Password" value={securityData.confirmPassword} onChange={e => setSecurityData({...securityData, confirmPassword: e.target.value})} />
                  </motion.div>
               )}
            </AnimatePresence>
         </div>

         {/* 🛡️ RIGHT COLUMN: SECURITY NOTES */}
         <div className="lg:col-span-4">
            <div className="p-6 bg-[#BC6C25]/5 rounded-2xl border border-[#BC6C25]/10 space-y-4">
               <div className="flex items-center gap-3">
                  <ShieldAlert size={18} className="text-[#BC6C25]" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#BC6C25]">Security Protocol</span>
               </div>
               <p className="text-[9px] font-bold text-[#BC6C25]/60 leading-relaxed uppercase tracking-tight italic">
                  Keep your sovereign credentials updated to maintain account vault integrity. Changes take effect across all portal nodes immediately.
               </p>
               <div className="pt-4 border-t border-[#BC6C25]/10 flex items-center gap-2">
                  <KeyRound size={12} className="text-[#BC6C25]/40" />
                  <span className="text-[7px] font-black uppercase text-[#BC6C25]/30">Encrypted Sovereign Vault</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
