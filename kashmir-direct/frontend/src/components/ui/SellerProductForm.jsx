'use client';

import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { 
  Image as ImageIcon, CheckCircle2, Loader2, X
} from 'lucide-react';

export default function SellerProductForm({ onSubmitRef, onLoadingChange, onClose, initialData = null }) {
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({ 
    name: initialData?.title || '', 
    price: initialData?.price || '', 
    actual_price: initialData?.actual_price || '',
    currency: initialData?.currency || 'INR',
    weight_value: initialData?.weight_value || '1',
    weight_unit: initialData?.weight_unit || 'kg',
    category: initialData?.category || 'Fresh Fruits', 
    description: initialData?.description || '',
    location: initialData?.location || ''
  });
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => { if (onLoadingChange) onLoadingChange(uploading); }, [uploading, onLoadingChange]);
  
  // 🚀 DIRECT ACTION: Expose the submit function directly to avoid DOM event issues
  useEffect(() => { 
    if (onSubmitRef) {
      onSubmitRef.current = () => {
        handleManualSubmit();
      };
    }
  }, [onSubmitRef, formData, images]); // Re-bind when data changes

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.title || '', 
        price: initialData.price || '', 
        actual_price: initialData.actual_price || '',
        currency: initialData.currency || 'INR',
        weight_value: initialData.weight_value || '1',
        weight_unit: initialData.weight_unit || 'kg',
        category: initialData.category || 'Fresh Fruits', 
        description: initialData.description || '',
        location: initialData.location || ''
      });
      setImages(initialData.images?.map(url => ({ preview: url, existing: true })) || []);
    }
  }, [initialData]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name?.trim()) newErrors.name = 'Required';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Invalid';
    if (!formData.location?.trim()) newErrors.location = 'Required';
    if (!formData.description?.trim()) newErrors.description = 'Required';
    if (images.length < 2) newErrors.images = 'Min 2 photos';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleManualSubmit = async () => {
    if (uploading) return;
    if (!validate()) { 
      toast.error('Check all mandatory fields'); 
      return; 
    }
    
    try {
      setUploading(true);
      const urls = [];
      
      for (const img of images) {
        if (img.existing) {
          urls.push(img.preview);
        } else if (img.file) {
          const fileExt = img.file.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const path = `${user.id}/${Date.now()}_${fileName}`;
          
          const { error: uploadError } = await supabase.storage
            .from('product_images')
            .upload(path, img.file);
            
          if (uploadError) throw uploadError;
          
          const { data: { publicUrl } } = supabase.storage
            .from('product_images')
            .getPublicUrl(path);
            
          urls.push(publicUrl);
        }
      }

      const payload = {
        title: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        actual_price: formData.actual_price ? parseFloat(formData.actual_price) : null,
        currency: formData.currency,
        weight_value: formData.weight_value,
        weight_unit: formData.weight_unit,
        unit: `${formData.weight_value}${formData.weight_unit}`,
        category: formData.category,
        images: urls,
        status: 'pending',
        is_approved: false,
        location: formData.location
      };

      if (initialData?.id) {
        const { error: updateError } = await supabase
          .from('products')
          .update(payload)
          .eq('id', initialData.id);
        if (updateError) throw updateError;
      } else {
        const { data: sellerRecord } = await supabase
          .from('sellers')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();
          
        const { error: insertError } = await supabase
          .from('products')
          .insert([{ ...payload, seller_id: sellerRecord?.id || user.id }]);
        if (insertError) throw insertError;
      }

      setSubmitted(true);
      toast.success('Listing Updated');
      setTimeout(() => onClose?.(), 800);
    } catch (err) {
      console.error('API Error:', err);
      toast.error(err.message || 'Server connection failed');
    } finally {
      setUploading(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.some(f => f.size > 2 * 1024 * 1024)) { toast.error('Max 2MB per image'); return; }
    if (images.length + files.length > 6) { toast.error('Max 6 images'); return; }
    
    const newImages = files.map(file => ({ 
      file, 
      preview: URL.createObjectURL(file),
      existing: false 
    }));
    
    setImages(prev => [...prev, ...newImages]);
    setErrors(prev => ({ ...prev, images: null }));
    
    // 🏺 Reset input so user can add same file again if they deleted it
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const InputLabel = ({ text, error }) => (
    <div className="flex justify-between items-center mb-1 px-0.5">
       <span className="text-[10px] font-black uppercase tracking-wider text-[#1B4332]/40">{text}</span>
       {error && <span className="text-[9px] font-bold text-rose-500 uppercase italic">{error}</span>}
    </div>
  );

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {submitted ? (
          <div className="py-12 text-center">
             <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/20 shadow-xl">
                <CheckCircle2 size={32} className="text-emerald-500" />
             </motion.div>
             <h4 className="text-[12px] font-black text-[#1B4332] uppercase tracking-widest">Vault Updated</h4>
          </div>
        ) : (
          <form onSubmit={(e) => e.preventDefault()} className="space-y-3.5">
             <div className="grid grid-cols-12 gap-3.5">
                <div className="col-span-8">
                   <InputLabel text="Product Name" error={errors.name} />
                   <input className="w-full bg-[#1B4332]/5 border border-[#1B4332]/5 rounded-xl px-4 py-2 text-[12px] font-bold text-[#1B4332] focus:outline-none focus:bg-white focus:border-[#BC6C25]/40 transition-all shadow-sm" placeholder="e.g. Saffron" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="col-span-4">
                   <InputLabel text="Currency" />
                   <div className="flex bg-[#1B4332]/5 border border-[#1B4332]/5 rounded-xl p-0.5 h-[36px] shadow-sm">
                      {['INR', 'USD'].map(c => (
                        <button key={c} type="button" onClick={() => setFormData({...formData, currency: c})} className={`flex-1 text-[9px] font-black rounded-lg transition-all ${formData.currency === c ? 'bg-[#BC6C25] text-white shadow-md' : 'text-[#1B4332]/20 hover:text-[#1B4332]'}`}>{c}</button>
                      ))}
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-3.5">
                <div>
                   <InputLabel text="Sale Price" error={errors.price} />
                   <input className="w-full bg-[#1B4332]/5 border border-[#1B4332]/5 rounded-xl px-4 py-2 text-[12px] font-bold text-[#1B4332] focus:outline-none focus:bg-white focus:border-[#BC6C25]/40 transition-all shadow-sm" type="number" placeholder="0.00" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                </div>
                <div>
                   <InputLabel text="Actual Price" />
                   <input className="w-full bg-[#1B4332]/5 border border-[#1B4332]/5 rounded-xl px-4 py-2 text-[12px] font-bold text-[#1B4332]/40 focus:outline-none focus:bg-white focus:border-[#BC6C25]/40 transition-all shadow-sm" type="number" placeholder="0.00" value={formData.actual_price} onChange={e => setFormData({...formData, actual_price: e.target.value})} />
                </div>
             </div>

             <div className="grid grid-cols-12 gap-3.5">
                <div className="col-span-7">
                   <InputLabel text="Location" error={errors.location} />
                   <input className="w-full bg-[#1B4332]/5 border border-[#1B4332]/5 rounded-xl px-4 py-2 text-[12px] font-bold text-[#1B4332] focus:outline-none focus:bg-white focus:border-[#BC6C25]/40 transition-all shadow-sm" placeholder="e.g. Kashmir" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                </div>
                <div className="col-span-5">
                   <InputLabel text="Unit" />
                   <div className="flex bg-[#1B4332]/5 border border-[#1B4332]/5 rounded-xl overflow-hidden shadow-sm h-[36px]">
                      <input className="w-12 lg:w-14 bg-transparent px-2 py-2 text-[12px] font-bold text-[#1B4332] focus:outline-none focus:bg-white transition-all text-center" type="text" placeholder="1" value={formData.weight_value} onChange={e => setFormData({...formData, weight_value: e.target.value})} />
                      <div className="w-[1px] bg-[#1B4332]/10 my-1.5" />
                      <select className="flex-1 bg-transparent px-1 py-2 text-[9px] lg:text-[10px] font-black text-[#BC6C25] uppercase tracking-widest outline-none cursor-pointer hover:bg-[#1B4332]/5 transition-all appearance-none text-center" value={formData.weight_unit} onChange={e => setFormData({...formData, weight_unit: e.target.value})}>
                         {['gm', 'kg', 'ml', 'ltr', 'pc', 'box'].map(u => <option key={u} value={u}>{u}</option>)}
                      </select>
                   </div>
                </div>
             </div>

             <div>
                <div className="flex justify-between items-center mb-1 px-0.5">
                   <span className="text-[10px] font-black uppercase tracking-wider text-[#1B4332]/40">Description</span>
                   <div className="flex gap-2">
                      {errors.description && <span className="text-[9px] font-bold text-rose-500 uppercase italic">{errors.description}</span>}
                      <span className={`text-[9px] font-black ${formData.description.length > 200 ? 'text-rose-500' : 'text-[#1B4332]/20'}`}>{formData.description.length}/200</span>
                   </div>
                </div>
                <textarea className="w-full bg-[#1B4332]/5 border border-[#1B4332]/5 rounded-xl px-4 py-2.5 text-[12px] font-bold text-[#1B4332] min-h-[60px] focus:outline-none focus:bg-white focus:border-[#BC6C25]/40 transition-all resize-none shadow-sm" placeholder="Product details..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
             </div>

             <div className="pt-1 border-t border-[#1B4332]/5">
                 <div className="flex justify-between items-center mb-2 px-0.5">
                   <span className="text-[10px] font-black uppercase tracking-wider text-[#1B4332]/40">Gallery (Min 2 / Max 6)</span>
                   {errors.images && <span className="text-[9px] font-bold text-rose-500 uppercase italic">{errors.images}</span>}
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                   {images.map((img, i) => (
                      <div key={i} className="aspect-square rounded-xl border border-[#1B4332]/10 overflow-hidden relative group shadow-sm bg-white">
                         <img src={img.preview} className="w-full h-full object-cover" />
                         <button type="button" onClick={() => setImages(images.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 w-5 h-5 bg-rose-600 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg"><X size={10} /></button>
                      </div>
                   ))}
                   {images.length < 6 && (
                      <button type="button" onClick={() => fileInputRef.current.click()} className={`aspect-square rounded-xl border-2 border-dashed ${errors.images ? 'border-rose-500/20 bg-rose-50/10' : 'border-[#1B4332]/10 bg-[#1B4332]/[0.02]'} flex flex-col items-center justify-center gap-1 hover:border-[#BC6C25]/40 hover:bg-white transition-all group`}>
                         <ImageIcon size={16} className="text-[#1B4332]/20 group-hover:text-[#BC6C25]" />
                         <span className="text-[8px] font-black uppercase tracking-widest text-[#1B4332]/30 group-hover:text-[#BC6C25]">Add</span>
                      </button>
                   )}
                </div>
                <input type="file" ref={fileInputRef} onChange={handleImageChange} multiple accept="image/*" className="hidden" />
             </div>
          </form>
        )}
      </AnimatePresence>
    </div>
  );
}
