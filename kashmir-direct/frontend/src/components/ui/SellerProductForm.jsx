'use client';

import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { 
  Image as ImageIcon, CheckCircle2, Loader2, ArrowUpRight, X, ChevronDown
} from 'lucide-react';
import Button from '../ui/Button';

export default function SellerProductForm({ onClose, initialData = null }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ 
    name: initialData?.title || '', 
    price: initialData?.price || '', 
    currency: initialData?.currency || 'INR',
    weight_value: initialData?.weight_value || '1',
    weight_unit: initialData?.weight_unit || 'kg',
    category: initialData?.category || 'Fresh Fruits', 
    description: initialData?.description || '' 
  });
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef(null);

  // 🛡️ STATE SYNC: Re-populate form whenever initialData changes
  useEffect(() => {
    setFormData({
      name: initialData?.title || '', 
      price: initialData?.price || '', 
      currency: initialData?.currency || 'INR',
      weight_value: initialData?.weight_value || '1',
      weight_unit: initialData?.weight_unit || 'kg',
      category: initialData?.category || 'Fresh Fruits', 
      description: initialData?.description || '' 
    });
    setImages(initialData?.images?.map(url => ({ preview: url, existing: true })) || []);
    setSubmitted(false);
  }, [initialData]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 4) { toast.error('Max 4 frames'); return; }
    setImages([...images, ...files.map(file => ({ file, preview: URL.createObjectURL(file) }))]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      console.log('⚡ Step 0: Engine Start');
      if (!user) { toast.error('Session Expired'); return; }
      if (images.length < 1) { toast.error('Add visuals'); return; }
      setUploading(true);

      const urls = [];
      const imageList = Array.isArray(images) ? images : [];
      
      for (const img of imageList) {
        if (img.existing) { 
          urls.push(img.preview); 
        } else if (img.file) { // 🛡️ SAFETY CHECK: Skip if file is missing
          const path = `${user.id}/${Date.now()}_${img.file.name || 'unnamed'}`;
          console.log(`📡 Step 1: Uploading Visual... ${path}`);
          const { error: uploadError } = await supabase.storage.from('product_images').upload(path, img.file);
          if (uploadError) throw uploadError;
          
          const { data: { publicUrl } } = supabase.storage.from('product_images').getPublicUrl(path);
          urls.push(publicUrl);
        }
      }
      console.log('✅ Step 2: Visuals Committed');

      const payload = {
        title: formData.name, 
        description: formData.description,
        price: parseFloat(formData.price), 
        currency: formData.currency,
        weight_value: formData.weight_value, 
        weight_unit: formData.weight_unit,
        unit: `${formData.weight_value}${formData.weight_unit}`,
        category: formData.category, 
        images: urls, 
        status: 'pending',
        is_approved: false, 
        rejection_reason: null
      };

      console.log('📡 Step 3: Syncing with Vault...', payload);

      if (initialData?.id) {
        const { error: updateError } = await supabase.from('products').update(payload).eq('id', initialData.id);
        if (updateError) throw updateError;
        console.log('🎉 Step 4: Vault Updated');
      } else {
        const { data: s } = await supabase.from('sellers').select('id').eq('user_id', user.id).maybeSingle();
        const { error: insertError } = await supabase.from('products').insert([{ 
          ...payload, 
          seller_id: s?.id || user.id 
        }]);
        if (insertError) throw insertError;
        console.log('🎉 Step 4: New Node Forged');
      }

      onClose?.(); // ⚡ INSTANT CLOSE
      toast.success(initialData?.id ? 'Listing Updated' : 'Forged Successfully!');
    } catch (err) { 
      console.error('❌ FORGE CRITICAL FAILURE:', err);
      toast.error(err.message || 'Transmission Failed'); 
    } finally { 
      setUploading(false); 
    }
  };

  return (
    <div className="w-full relative">
      <div className="p-8">
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 text-center">
               <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/20"><CheckCircle2 size={32} className="text-emerald-500" /></div>
               <h4 className="text-sm font-black text-white uppercase tracking-widest">{initialData ? 'Update Validated' : 'Node Validated'}</h4>
               <p className="text-[10px] text-white/30 mt-2 uppercase">Closing Forge...</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
               {/* 🏷️ TITLE & CATEGORY */}
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                     <label className="text-[8px] font-black uppercase tracking-widest text-white/20 ml-1">Title</label>
                     <input className="w-full bg-white/5 border border-white/5 rounded-lg px-4 py-2.5 text-[11px] font-bold text-white focus:outline-none focus:border-[#BC6C25]/40" placeholder="Pure Saffron" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                  </div>
                  <div className="space-y-1.5">
                     <label className="text-[8px] font-black uppercase tracking-widest text-white/20 ml-1">Currency</label>
                     <div className="flex bg-white/5 border border-white/5 rounded-lg p-1">
                        {['INR', 'USD'].map(c => (
                          <button key={c} type="button" onClick={() => setFormData({...formData, currency: c})} className={`flex-1 py-1.5 text-[9px] font-black rounded-md transition-all ${formData.currency === c ? 'bg-[#BC6C25] text-white' : 'text-white/20 hover:text-white'}`}>{c}</button>
                        ))}
                     </div>
                  </div>
               </div>

               {/* 💰 PRICE & WEIGHT UNIT */}
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                     <label className="text-[8px] font-black uppercase tracking-widest text-white/20 ml-1">Price per Unit</label>
                     <input className="w-full bg-white/5 border border-white/5 rounded-lg px-4 py-2.5 text-[11px] font-bold text-white focus:outline-none focus:border-[#BC6C25]/40" type="number" placeholder="2500" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                     <div className="space-y-1.5">
                        <label className="text-[8px] font-black uppercase tracking-widest text-white/20 ml-1">Quantity</label>
                        <input className="w-full bg-white/5 border border-white/5 rounded-lg px-4 py-2.5 text-[11px] font-bold text-white focus:outline-none focus:border-[#BC6C25]/40" type="text" placeholder="1" value={formData.weight_value} onChange={e => setFormData({...formData, weight_value: e.target.value})} required />
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-[8px] font-black uppercase tracking-widest text-white/20 ml-1">Unit</label>
                        <select className="w-full bg-white/5 border border-white/5 rounded-lg px-2 py-2.5 text-[11px] font-bold text-white focus:outline-none focus:border-[#BC6C25]/40 appearance-none cursor-pointer" value={formData.weight_unit} onChange={e => setFormData({...formData, weight_unit: e.target.value})}>
                           {['gm', 'kg', 'pc', 'box'].map(u => <option key={u} value={u} className="bg-[#141A18] text-white">{u}</option>)}
                        </select>
                     </div>
                  </div>
               </div>

               <div className="space-y-1.5">
                  <label className="text-[8px] font-black uppercase tracking-widest text-white/20 ml-1">Specifications</label>
                  <textarea className="w-full bg-white/5 border border-white/5 rounded-lg px-4 py-3 text-[11px] font-bold text-white min-h-[70px] focus:outline-none focus:border-[#BC6C25]/40 resize-none" placeholder="Describe your artisan masterwork..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
               </div>

               <div className="grid grid-cols-5 gap-3 items-end">
                  <div className="col-span-4 grid grid-cols-4 gap-2">
                     {images.map((img, i) => (
                        <div key={i} className="aspect-square rounded-lg border border-white/10 overflow-hidden relative group">
                           <img src={img.preview} className="w-full h-full object-cover opacity-60 group-hover:opacity-100" />
                           <button type="button" onClick={() => setImages(images.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 w-5 h-5 bg-rose-600 rounded-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"><X size={10} /></button>
                        </div>
                     ))}
                     {images.length < 4 && (
                        <button type="button" onClick={() => fileInputRef.current.click()} className="aspect-square rounded-lg border border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center gap-1 hover:border-[#BC6C25]/40 transition-colors">
                           <ImageIcon size={14} className="text-white/20" />
                           <span className="text-[6px] font-black uppercase text-white/20 tracking-widest">Add Frame</span>
                        </button>
                     )}
                  </div>
                  <div className="col-span-1">
                     <Button type="submit" disabled={uploading} className="w-full h-10 rounded-lg bg-[#BC6C25] hover:bg-[#A65D1F] border-none shadow-xl">
                        {uploading ? <Loader2 size={12} className="animate-spin mx-auto text-white" /> : <ArrowUpRight size={16} className="mx-auto text-white" />}
                     </Button>
                  </div>
               </div>
               <input type="file" ref={fileInputRef} onChange={handleImageChange} multiple accept="image/*" className="hidden" />
            </form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
