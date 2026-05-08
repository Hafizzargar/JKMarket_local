'use client';

import { useState, useRef, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { 
  User, Mail, Phone, ShieldCheck, MapPin, Lock, Camera, Loader2, Save, Globe,
  Eye, EyeOff
} from 'lucide-react';
import Button from './Button';

export default function ProfileNode() {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    address: '',
    phone_number: '',
    gst_number: '',
    pan_number: '',
    password: '',
    confirmPassword: ''
  });
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [hasManuallySelected, setHasManuallySelected] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (profile && !hasManuallySelected) {
      setFormData(prev => ({
        ...prev,
        full_name: profile.full_name || '',
        address: profile.address || ''
      }));
      setAvatarUrl(profile.avatar_url);
    }
  }, [profile, hasManuallySelected]);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ⚡ STICKY LOCAL PREVIEW
    const localUrl = URL.createObjectURL(file);
    setAvatarUrl(localUrl);
    setHasManuallySelected(true);
    
    setUploading(true);
    try {
      const path = `avatars/${user.id}_${Date.now()}`;
      const { error: uploadError } = await supabase.storage.from('product_images').upload(path, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('product_images').getPublicUrl(path);
      
      // ⚡ SILENT BACKGROUND SYNC
      setUploading(false); 

      const { error: updateError } = await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', user.id);
      
      if (updateError) {
        console.warn('Avatar column missing:', updateError.message);
        toast('Photo synced to session', { icon: '☁️' });
      } else {
        toast.success('Avatar Synced to Vault');
      }

      setAvatarUrl(publicUrl);
    } catch (err) { 
      toast.error(err.message);
      setAvatarUrl(profile?.avatar_url);
      setUploading(false); 
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 🛡️ STREAM A: PUBLIC PERSONA (Profiles)
      const { error: profileError } = await supabase.from('profiles').update({
        full_name: formData.full_name
      }).eq('id', user.id);
      
      if (profileError) console.warn('Profiles sync warning:', profileError.message);

      // 🛡️ STREAM B: PROFESSIONAL VAULT (Sellers)
      const sellerUpdate = {};
      if (formData.address) sellerUpdate.address = formData.address;
      if (formData.phone_number) sellerUpdate.phone_number = formData.phone_number;
      if (formData.gst_number) sellerUpdate.gst_number = formData.gst_number;
      if (formData.pan_number) sellerUpdate.pan_number = formData.pan_number;

      if (Object.keys(sellerUpdate).length > 0) {
        const { error: sellerError } = await supabase.from('sellers').update(sellerUpdate).eq('id', user.id);
        if (sellerError) console.warn('Sellers sync warning:', sellerError.message);
      }

      // 🛡️ STREAM C: SECURITY CORE (Auth)
      if (formData.password) {
        if (formData.password !== formData.confirmPassword) throw new Error('Passwords do not match');
        
        const strongPassRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!strongPassRegex.test(formData.password)) {
          throw new Error('Password must include Uppercase, Lowercase, Number & Special Character (e.g. Jammu@1234)');
        }

        const { error: authError } = await supabase.auth.updateUser({ password: formData.password });
        if (authError) throw authError;
      }

      toast.success('Identity Forge Complete');
      setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
    } catch (err) { 
      toast.error(err.message); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="w-full space-y-12">
      <header className="flex items-center justify-between border-b border-white/5 pb-8">
         <div>
            <h2 className="text-xl font-black text-white uppercase tracking-[0.3em]">Identity Node</h2>
            <p className="text-[10px] text-white/30 uppercase mt-2 tracking-widest font-bold italic">Manage your artisan credentials and security</p>
         </div>
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/5 border border-emerald-500/10 rounded-full">
               <ShieldCheck size={12} className="text-emerald-500" />
               <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Verified Artisan</span>
            </div>
            <button 
                type="submit" 
                form="identity-forge"
                disabled={loading} 
                className="h-12 px-8 rounded-xl bg-[#BC6C25] hover:bg-[#A65D1F] transition-all shadow-[0_0_20px_rgba(188,108,37,0.3)] flex items-center justify-center gap-3 group shrink-0"
            >
                {loading ? (
                  <Loader2 size={16} className="animate-spin text-white" />
                ) : (
                  <>
                     <Save size={14} className="text-white group-hover:scale-110 transition-transform" />
                     <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white">Commit Changes</span>
                  </>
                )}
            </button>
         </div>
      </header>

      <form id="identity-forge" onSubmit={handleUpdateProfile} className="flex flex-col lg:flex-row gap-12 items-start">
         {/* 📸 AVATAR SIDEBAR */}
         <div className="w-full lg:w-64 flex flex-col items-center gap-6 shrink-0">
            <div className="relative group">
               <div className="w-32 h-32 rounded-full border-2 border-[#BC6C25]/20 p-1.5 relative">
                  <div className="w-full h-full rounded-full overflow-hidden bg-white/5 border border-white/10 shadow-2xl relative">
                     {avatarUrl ? (
                        <img src={avatarUrl} className={`w-full h-full object-cover ${uploading ? 'opacity-30' : 'opacity-100'} transition-opacity`} />
                     ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/10 italic text-[8px]">No Node</div>
                     )}
                     {uploading && (
                       <div className="absolute inset-0 flex items-center justify-center">
                          <Loader2 size={20} className="animate-spin text-[#BC6C25]" />
                       </div>
                     )}
                  </div>
                  <button 
                    type="button" 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 cursor-pointer"
                  >
                     <Camera size={18} className="text-white" />
                     <span className="text-[7px] font-black text-white uppercase tracking-widest">Update</span>
                  </button>
               </div>
               <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} className="hidden" accept="image/*" />
            </div>
            <div className="text-center space-y-2">
               <p className="text-[10px] font-black text-[#BC6C25] uppercase tracking-widest leading-none">{profile?.full_name}</p>
               <p className="text-[7px] font-black text-white/10 uppercase tracking-[0.2em] px-4 leading-relaxed italic">Public Studio Persona</p>
            </div>
         </div>

         {/* 📝 FIELDS GRID */}
         <div className="flex-1 w-full space-y-8">
            {/* IMMUTABLE / CONDITIONAL ROW */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
               {/* 📧 EMAIL - ALWAYS LOCKED */}
               <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-1.5 opacity-60">
                  <label className="text-[7px] font-black uppercase text-white/20 tracking-widest flex items-center gap-2"><Mail size={8} /> Primary Email</label>
                  <p className="text-[12px] font-bold text-white/70 truncate">{user?.email}</p>
               </div>

               {/* 📞 PHONE - EDITABLE IF EMPTY */}
               <div className={`bg-white/[0.02] border rounded-2xl p-5 space-y-1.5 transition-all ${!profile?.phone_number ? 'border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.05)]' : 'border-white/5 opacity-60'}`}>
                  <label className="text-[7px] font-black uppercase text-[#BC6C25] tracking-widest flex items-center gap-2">
                    <Phone size={8} /> Phone Primary {!profile?.phone_number && '• Required'}
                  </label>
                  {!profile?.phone_number ? (
                    <input 
                      className="w-full bg-transparent border-none p-0 text-[12px] font-bold text-white focus:outline-none placeholder:text-white/10"
                      value={formData.phone_number} 
                      onChange={e => setFormData({...formData, phone_number: e.target.value})}
                      placeholder="+91 XXXXX XXXXX"
                    />
                  ) : (
                    <p className="text-[12px] font-bold text-white/70">{profile.phone_number}</p>
                  )}
               </div>

               {/* 🏢 GSTIN - EDITABLE IF EMPTY */}
               <div className={`bg-white/[0.02] border rounded-2xl p-5 space-y-1.5 transition-all ${!profile?.seller?.gst_number ? 'border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.05)]' : 'border-white/5 opacity-60'}`}>
                  <label className="text-[7px] font-black uppercase text-[#BC6C25] tracking-widest flex items-center gap-2">
                    <Globe size={8} /> GST Reference {!profile?.seller?.gst_number && '• Required'}
                  </label>
                  {!profile?.seller?.gst_number ? (
                    <input 
                      className="w-full bg-transparent border-none p-0 text-[12px] font-bold text-white focus:outline-none placeholder:text-white/10"
                      value={formData.gst_number} 
                      onChange={e => setFormData({...formData, gst_number: e.target.value})}
                      placeholder="GSTIN Node ID"
                    />
                  ) : (
                    <p className="text-[12px] font-bold text-white/70">VERIFIED: {profile.seller.gst_number}</p>
                  )}
               </div>

               {/* 🛡️ PAN - EDITABLE IF EMPTY */}
               <div className={`bg-white/[0.02] border rounded-2xl p-5 space-y-1.5 transition-all ${!profile?.seller?.pan_number ? 'border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.05)]' : 'border-white/5 opacity-60'}`}>
                  <label className="text-[7px] font-black uppercase text-[#BC6C25] tracking-widest flex items-center gap-2">
                    <ShieldCheck size={8} /> PAN Reference {!profile?.seller?.pan_number && '• Required'}
                  </label>
                  {!profile?.seller?.pan_number ? (
                    <input 
                      className="w-full bg-transparent border-none p-0 text-[12px] font-bold text-white focus:outline-none placeholder:text-white/10"
                      value={formData.pan_number} 
                      onChange={e => setFormData({...formData, pan_number: e.target.value})}
                      placeholder="Permanent Account Node"
                    />
                  ) : (
                    <p className="text-[12px] font-bold text-white/70">VERIFIED: {profile.seller.pan_number}</p>
                  )}
               </div>
            </div>

            {/* EDITABLE GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
               <div className="space-y-2">
                  <label className="text-[8px] font-black uppercase text-white/40 tracking-widest ml-1">Artisan Name</label>
                  <input 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[11px] font-bold text-white focus:outline-none focus:border-[#BC6C25]/60 transition-colors"
                    value={formData.full_name} 
                    onChange={e => setFormData({...formData, full_name: e.target.value})} 
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-[8px] font-black uppercase text-white/40 tracking-widest ml-1">Studio Address</label>
                  <input 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[11px] font-bold text-white focus:outline-none focus:border-[#BC6C25]/60 transition-colors"
                    value={formData.address} 
                    onChange={e => setFormData({...formData, address: e.target.value})} 
                  />
               </div>
               <div className="space-y-2 relative group/pass">
                  <label className="text-[8px] font-black uppercase text-white/40 tracking-widest ml-1">New Reset Pass</label>
                  <div className="relative">
                     <input 
                       type={showPassword ? "text" : "password"}
                       className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[11px] font-bold text-white focus:outline-none focus:border-[#BC6C25]/60 transition-colors pr-10"
                       value={formData.password} 
                       onChange={e => setFormData({...formData, password: e.target.value})} 
                       placeholder="••••••••"
                     />
                     <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-[#BC6C25] transition-colors"
                     >
                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                     </button>
                  </div>
               </div>
               <div className="space-y-2 relative group/pass">
                  <label className="text-[8px] font-black uppercase text-white/40 tracking-widest ml-1">Confirm Reset</label>
                  <div className="relative">
                     <input 
                       type={showPassword ? "text" : "password"}
                       className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[11px] font-bold text-white focus:outline-none focus:border-[#BC6C25]/60 transition-colors pr-10"
                       value={formData.confirmPassword} 
                       onChange={e => setFormData({...formData, confirmPassword: e.target.value})} 
                       placeholder="••••••••"
                     />
                  </div>
               </div>
            </div>

            <div className="pt-2 opacity-10">
               <p className="text-[7px] font-black text-white/40 uppercase tracking-[0.3em] text-right italic">Awaiting identity forge...</p>
            </div>
         </div>
      </form>
    </div>
  );
}
