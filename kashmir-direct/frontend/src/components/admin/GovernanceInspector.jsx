'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, XCircle, ChevronLeft, ChevronRight, Info, Store, CheckCircle2, X, Scale, Tag, Edit3, ImagePlus, Trash2 } from 'lucide-react';

export default function GovernanceInspector({ isOpen, item, isRejecting, reason, setModal, onAction }) {
  const [currentImg, setCurrentImg] = useState(0);
  const fileInputRef = useRef(null);
  
  const [editedItem, setEditedItem] = useState({
    title: item?.title || '',
    category: item?.category || '',
    description: item?.description || '',
    price: item?.price || 0,
    weight: item?.weight || 0,
    unit: item?.unit || 'g',
    rating: item?.rating || 5,
    images: item?.images || []
  });

  useEffect(() => {
    if (!isOpen || editedItem.images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % editedItem.images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [isOpen, editedItem.images.length]);

  useEffect(() => {
    if (item) {
      setCurrentImg(0);
      const weightVal = item.weight ?? item.weight_value ?? 0;
      const unitVal = (item.unit ?? item.weight_unit ?? 'g').toLowerCase();
      
      setEditedItem({
        title: item.title || '',
        category: item.category || '',
        description: item.description || '',
        price: item.price ?? 0,
        weight: weightVal,
        unit: ['g', 'kg', 'ml', 'l'].includes(unitVal) ? unitVal : 'g',
        rating: item.rating || 5,
        images: item.images || []
      });
    }
  }, [item]);

  if (!isOpen) return null;

  const getChanges = () => {
    const changes = {};
    if (editedItem.title !== item?.title) changes.title = editedItem.title;
    if (editedItem.category !== item?.category) changes.category = editedItem.category;
    if (editedItem.description !== item?.description) changes.description = editedItem.description;
    if (Number(editedItem.price) !== Number(item?.price)) changes.price = Number(editedItem.price);
    if (Number(editedItem.weight) !== Number(item?.weight)) changes.weight = Number(editedItem.weight);
    if (editedItem.unit !== item?.unit) changes.unit = editedItem.unit;
    if (editedItem.rating !== (item?.rating || 5)) changes.rating = editedItem.rating;
    if (JSON.stringify(editedItem.images) !== JSON.stringify(item?.images)) changes.images = editedItem.images;
    return changes;
  };

  const hasChanges = Object.keys(getChanges()).length > 0;

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newUrls = files.map(file => URL.createObjectURL(file));
    setEditedItem(prev => ({ ...prev, images: [...prev.images, ...newUrls] }));
    setCurrentImg(editedItem.images.length);
  };

  const removeImage = (idx) => {
    const newImages = editedItem.images.filter((_, i) => i !== idx);
    setEditedItem(prev => ({ ...prev, images: newImages }));
    if (currentImg >= newImages.length) setCurrentImg(Math.max(0, newImages.length - 1));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex justify-end overflow-hidden">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModal({ isOpen: false })} className="absolute inset-0 bg-[#1B4332]/10 backdrop-blur-md" />

          <motion.div 
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 350 }}
            className="relative w-full max-w-4xl bg-white h-full shadow-[-40px_0_100px_rgba(27,67,50,0.2)] border-l border-[#1B4332]/10 flex flex-col"
          >
            {/* 🏛️ HEADER (COMPACT) */}
            <div className="px-6 py-3 border-b border-[#1B4332]/5 flex items-center justify-between bg-[#FDFBF7]">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#BC6C25] rounded-lg flex items-center justify-center text-white shadow-lg shadow-[#BC6C25]/10">
                     <ShieldCheck size={16} fill="currentColor" />
                  </div>
                  <div>
                     <p className="text-[7px] font-black text-[#BC6C25] uppercase tracking-[0.3em] leading-none">Admin Area</p>
                     <h3 className="text-[13px] font-black text-[#1B4332] uppercase tracking-tighter leading-none mt-1">Check Product</h3>
                  </div>
               </div>
               <button onClick={() => setModal({ isOpen: false })} className="w-8 h-8 rounded-full hover:bg-rose-500/5 flex items-center justify-center text-[#1B4332]/20 hover:text-rose-500 transition-all"><X size={18} /></button>
            </div>

            {/* 🍱 MAIN CONTENT (2-COLUMN GRID) */}
            <div className="flex-1 overflow-y-auto no-scrollbar grid grid-cols-5 h-full">
               
               {/* 📸 LEFT COLUMN (MEDIA & SHOP) */}
               <div className="col-span-2 border-r border-[#1B4332]/5 bg-[#FDFBF7]/30 p-6 space-y-6">
                  <div className="relative aspect-square rounded-[1.5rem] overflow-hidden border border-[#1B4332]/10 bg-white shadow-xl group/img">
                     <AnimatePresence mode="wait">
                       {editedItem.images.length > 0 ? (
                         <motion.img key={currentImg} src={editedItem.images[currentImg]} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full object-cover" alt="Product" />
                       ) : (
                         <div className="w-full h-full flex flex-col items-center justify-center text-[#1B4332]/20">
                            <ImagePlus size={32} className="mb-2" />
                            <p className="text-[8px] font-black uppercase tracking-widest">No Photos</p>
                         </div>
                       )}
                     </AnimatePresence>
                     
                     <div className="absolute top-4 right-4 flex flex-col gap-2 z-30 opacity-0 group-hover/img:opacity-100 transition-all">
                        <button onClick={() => fileInputRef.current?.click()} className="w-8 h-8 rounded-lg bg-white/90 backdrop-blur-md border border-[#1B4332]/10 flex items-center justify-center text-[#1B4332] hover:bg-[#BC6C25] hover:text-white transition-all shadow-lg"><ImagePlus size={14} /></button>
                        {editedItem.images.length > 0 && (
                          <button onClick={() => removeImage(currentImg)} className="w-8 h-8 rounded-lg bg-white/90 backdrop-blur-md border border-rose-100 flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-lg"><Trash2 size={14} /></button>
                        )}
                     </div>
                     <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" multiple accept="image/*" />

                     {editedItem.images.length > 1 && (
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1 z-20">
                           {editedItem.images.map((_, idx) => (
                             <button key={idx} onClick={() => setCurrentImg(idx)} className={`h-1 rounded-full transition-all ${currentImg === idx ? 'w-4 bg-[#BC6C25]' : 'w-1 bg-white/40'}`} />
                           ))}
                        </div>
                     )}
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-[#1B4332]/5 shadow-sm space-y-3">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#BC6C25]/10 rounded-lg flex items-center justify-center text-[#BC6C25]"><Store size={16} /></div>
                        <div className="flex-1 truncate">
                           <p className="text-[11px] font-black text-[#1B4332] uppercase truncate">{item?.sellers?.shop_name || 'Artisan Shop'}</p>
                           <p className="text-[7px] font-bold text-[#1B4332]/30 uppercase tracking-widest mt-0.5">Shop Name</p>
                        </div>
                     </div>
                     <div className="pt-3 border-t border-[#1B4332]/5">
                        <div className="flex items-center justify-between mb-1">
                           <span className="text-[7px] font-black text-[#BC6C25]/40 uppercase tracking-widest">Product Rating</span>
                           <div className="flex gap-1">
                              {[1,2,3,4,5].map((star) => (
                                <button key={star} onClick={() => setEditedItem({...editedItem, rating: star})} className={`transition-all ${editedItem.rating >= star ? 'text-[#BC6C25]' : 'text-[#BC6C25]/20'}`}><ShieldCheck size={10} fill={editedItem.rating >= star ? "currentColor" : "none"} /></button>
                              ))}
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* 📝 RIGHT COLUMN (EDITABLE DATA) */}
               <div className="col-span-3 p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                     <div className="space-y-1">
                        <span className="text-[7px] font-black text-[#BC6C25]/60 uppercase tracking-widest ml-1">Category</span>
                        <input value={editedItem.category} onChange={(e) => setEditedItem({...editedItem, category: e.target.value})} className="w-full bg-[#FDFBF7] rounded-xl border border-[#1B4332]/10 focus:border-[#BC6C25] text-[10px] font-black text-[#BC6C25] uppercase tracking-widest p-3 focus:ring-0 transition-all" />
                     </div>
                     <div className="space-y-1">
                        <span className="text-[7px] font-black text-[#1B4332]/40 uppercase tracking-widest ml-1">Edit Title</span>
                        <input value={editedItem.title} onChange={(e) => setEditedItem({...editedItem, title: e.target.value})} className="w-full bg-[#FDFBF7] rounded-xl border border-[#1B4332]/10 focus:border-[#BC6C25] text-[12px] font-black text-[#1B4332] uppercase tracking-tight p-3 focus:ring-0 transition-all" />
                     </div>
                  </div>

                  <div className="space-y-1">
                     <div className="flex items-center justify-between ml-1">
                        <span className="text-[7px] font-black text-[#BC6C25]/60 uppercase tracking-widest">Edit Description</span>
                        <span className="text-[7px] font-bold text-[#BC6C25]/30 uppercase tracking-widest italic">Product Info</span>
                     </div>
                     <textarea 
                       value={editedItem.description}
                       onChange={(e) => setEditedItem({...editedItem, description: e.target.value})}
                       className="w-full bg-[#FDFBF7] rounded-xl border border-[#1B4332]/10 focus:border-[#BC6C25] text-[12px] font-medium text-[#1B4332]/70 leading-relaxed italic focus:ring-0 p-4 h-[110px] resize-none transition-all"
                     />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                     <div className="p-4 bg-[#FDFBF7] rounded-xl border border-[#1B4332]/10 focus-within:border-[#BC6C25] transition-all shadow-sm">
                        <span className="text-[7px] font-black text-[#1B4332]/30 uppercase tracking-widest block mb-1">Price (₹)</span>
                        <input 
                          type="number" 
                          min="0"
                          value={editedItem.price} 
                          onChange={(e) => {
                            const val = e.target.value;
                            setEditedItem({...editedItem, price: val === '' ? '' : Math.max(0, val)});
                          }} 
                          className="w-full bg-transparent text-xl font-black text-[#1B4332] border-none p-0 focus:ring-0" 
                        />
                     </div>
                     <div className="p-4 bg-[#FDFBF7] rounded-xl border border-[#1B4332]/10 focus-within:border-[#BC6C25] transition-all shadow-sm">
                        <span className="text-[7px] font-black text-[#1B4332]/30 uppercase tracking-widest block mb-1">Weight / Unit</span>
                        <div className="flex items-center gap-2">
                           <input 
                             type="number" 
                             min="0"
                             value={editedItem.weight} 
                             onChange={(e) => {
                               const val = e.target.value;
                               setEditedItem({...editedItem, weight: val === '' ? '' : Math.max(0, val)});
                             }} 
                             className="w-16 bg-transparent text-xl font-black text-[#1B4332] border-none p-0 focus:ring-0 leading-none" 
                           />
                           <select 
                             value={editedItem.unit} 
                             onChange={(e) => setEditedItem({...editedItem, unit: e.target.value})}
                             className="bg-[#1B4332]/5 border-none rounded-lg text-[10px] font-black text-[#1B4332] uppercase p-1.5 focus:ring-0 cursor-pointer hover:bg-[#1B4332]/10 transition-all"
                           >
                              <option value="g">GM</option>
                              <option value="kg">KG</option>
                              <option value="ml">ML</option>
                              <option value="l">Litres</option>
                           </select>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* 🛠️ FOOTER ACTIONS (PINNED) */}
            <div className="p-6 border-t border-[#1B4332]/5 bg-white space-y-3">
               <AnimatePresence mode="wait">
                 {!isRejecting ? (
                   <motion.div key="actions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex gap-3">
                      <button onClick={() => onAction('approved', getChanges())} className="flex-[2] h-12 rounded-xl bg-[#1B4332] hover:bg-[#BC6C25] text-white font-black tracking-widest uppercase text-[9px] transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-[#1B4332]/10">
                         <CheckCircle2 size={16} />
                         {hasChanges ? 'Approve & Save Changes' : 'Approve Product'}
                      </button>
                      <button onClick={() => setModal({ isRejecting: true })} className="flex-1 h-12 rounded-xl bg-[#FDFBF7] border border-[#1B4332]/10 text-[#1B4332]/60 hover:text-rose-600 transition-all font-black tracking-widest uppercase text-[9px] flex items-center justify-center gap-2 active:scale-95"><XCircle size={16} />Reject</button>
                   </motion.div>
                 ) : (
                   <motion.div key="denial" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex gap-3">
                      <textarea value={reason} onChange={(e) => setModal({ reason: e.target.value })} placeholder="Why reject?..." className="flex-1 h-12 bg-[#FDFBF7] border border-[#1B4332]/10 rounded-xl px-4 py-3 text-[11px] font-medium focus:border-[#BC6C25] focus:outline-none text-[#1B4332] placeholder:text-[#1B4332]/20" />
                      <button onClick={() => setModal({ isRejecting: false })} className="w-12 h-12 rounded-xl bg-[#FDFBF7] border border-[#1B4332]/5 text-[#1B4332]/40 flex items-center justify-center"><X size={16} /></button>
                      <button onClick={() => onAction('rejected')} className="h-12 px-6 rounded-xl bg-rose-600 text-white font-black uppercase text-[9px] tracking-widest">Confirm</button>
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
