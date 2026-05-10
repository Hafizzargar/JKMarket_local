'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, XCircle, ChevronLeft, ChevronRight, Info, Store, CheckCircle2, X, Scale, Tag, Edit3, ImagePlus, Trash2 } from 'lucide-react';

export default function GovernanceInspector({ isOpen, item, isRejecting, reason, setModal, onAction }) {
  const [currentImg, setCurrentImg] = useState(0);
  const fileInputRef = useRef(null);
  
  // 📝 MASTER EDIT STATE
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

  // 🔄 AUTO-SLIDESHOW ENGINE
  useEffect(() => {
    if (!isOpen || editedItem.images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % editedItem.images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [isOpen, editedItem.images.length]);

  // Reset state when item changes
  useEffect(() => {
    setCurrentImg(0);
    setEditedItem({
      title: item?.title || '',
      category: item?.category || '',
      description: item?.description || '',
      price: item?.price || 0,
      weight: item?.weight || 0,
      unit: item?.unit || 'g',
      rating: item?.rating || 5,
      images: item?.images || []
    });
  }, [item?.id]);

  if (!isOpen) return null;

  // 🧠 SMART CHANGE DETECTION
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

  // 🖼️ IMAGE HANDLERS
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newUrls = files.map(file => URL.createObjectURL(file)); // In real app, upload to Supabase
    setEditedItem(prev => ({
      ...prev,
      images: [...prev.images, ...newUrls]
    }));
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

          {/* 🏛️ EXPANDED MASTER PANEL (Wider for Better Visibility) */}
          <motion.div 
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 350 }}
            className="relative w-full max-w-xl bg-white h-full shadow-[-40px_0_100px_rgba(27,67,50,0.2)] border-l border-[#1B4332]/10 flex flex-col"
          >
            {/* 🏛️ SUPER ADMIN HEADER */}
            <div className="px-8 py-6 border-b border-[#1B4332]/5 flex items-center justify-between bg-[#FDFBF7] relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#BC6C25]/5 rounded-full -mr-16 -mt-16 blur-3xl" />
               <div className="flex items-center gap-4 relative z-10">
                  <div className="w-10 h-10 bg-[#BC6C25] rounded-xl flex items-center justify-center text-white shadow-xl shadow-[#BC6C25]/20 border border-white/20">
                     <ShieldCheck size={20} fill="currentColor" />
                  </div>
                  <div>
                     <div className="flex items-center gap-2">
                        <p className="text-[8px] font-black text-[#BC6C25] uppercase tracking-[0.4em] leading-none">Super Admin Authorized</p>
                        <div className="w-1.5 h-1.5 bg-[#BC6C25] rounded-full animate-pulse" />
                     </div>
                     <h3 className="text-base font-black text-[#1B4332] uppercase tracking-tighter leading-none mt-1.5">Sovereign Audit</h3>
                  </div>
               </div>
               <button onClick={() => setModal({ isOpen: false })} className="w-10 h-10 rounded-full hover:bg-rose-500/5 flex items-center justify-center text-[#1B4332]/20 hover:text-rose-500 transition-all relative z-10"><X size={20} /></button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-8">
               
               {/* 🖼️ MASTER IMAGE CAROUSEL */}
               <div className="relative aspect-[16/10] rounded-[2.5rem] overflow-hidden border border-[#1B4332]/10 bg-[#FDFBF7] shadow-lg group/img">
                  <AnimatePresence mode="wait">
                    {editedItem.images.length > 0 ? (
                      <motion.img key={currentImg} src={editedItem.images[currentImg]} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.6 }} className="w-full h-full object-cover" alt="Product" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-[#1B4332]/[0.02] text-[#1B4332]/20">
                         <ImagePlus size={48} className="mb-4" />
                         <p className="text-[10px] font-black uppercase tracking-widest">No Photos Uploaded</p>
                      </div>
                    )}
                  </AnimatePresence>
                  
                  {/* 📷 IMAGE ACTIONS (SUPER ADMIN ONLY) */}
                  <div className="absolute top-6 right-6 flex flex-col gap-2 z-30 opacity-0 group-hover/img:opacity-100 transition-all">
                     <button 
                       onClick={() => fileInputRef.current?.click()}
                       className="w-10 h-10 rounded-xl bg-white/90 backdrop-blur-md border border-[#1B4332]/10 flex items-center justify-center text-[#1B4332] hover:bg-[#BC6C25] hover:text-white transition-all shadow-xl"
                       title="Upload Photo"
                     >
                        <ImagePlus size={18} />
                     </button>
                     {editedItem.images.length > 0 && (
                       <button 
                         onClick={() => removeImage(currentImg)}
                         className="w-10 h-10 rounded-xl bg-white/90 backdrop-blur-md border border-rose-100 flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-xl"
                         title="Delete Photo"
                       >
                          <Trash2 size={18} />
                       </button>
                     )}
                  </div>
                  <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" multiple accept="image/*" />

                  {editedItem.images.length > 1 && (
                    <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-1.5 z-20">
                       {editedItem.images.map((_, idx) => (
                         <button key={idx} onClick={() => setCurrentImg(idx)} className={`h-1.5 rounded-full transition-all duration-500 ${currentImg === idx ? 'w-6 bg-[#BC6C25]' : 'w-1.5 bg-white/40 hover:bg-white/60'}`} />
                       ))}
                    </div>
                  )}

                  {editedItem.images.length > 1 && (
                    <>
                      <button onClick={(e) => { e.stopPropagation(); setCurrentImg((prev) => (prev - 1 + editedItem.images.length) % editedItem.images.length); }} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover/img:opacity-100 transition-all z-30"><ChevronLeft size={20} /></button>
                      <button onClick={(e) => { e.stopPropagation(); setCurrentImg((prev) => (prev + 1) % editedItem.images.length); }} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover/img:opacity-100 transition-all z-30"><ChevronRight size={20} /></button>
                    </>
                  )}

                  <div className="absolute top-6 left-6 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-xl border border-[#1B4332]/5 text-[8px] font-black text-[#1B4332] uppercase tracking-widest shadow-sm z-20">Photo {currentImg + 1} / {editedItem.images.length}</div>
               </div>

               {/* 🏺 MASTER EDITING AREA */}
               <div className="space-y-6">
                  <div className="space-y-4">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-1 mr-6">
                           <Tag size={12} className="text-[#BC6C25]" />
                           <input 
                             value={editedItem.category} 
                             onChange={(e) => setEditedItem({...editedItem, category: e.target.value})}
                             className="bg-transparent text-[10px] font-black text-[#BC6C25] uppercase tracking-[0.2em] border-none p-0 focus:ring-0 w-full"
                             placeholder="CATEGORY"
                           />
                        </div>
                        <div className="flex items-center gap-1.5 bg-[#BC6C25]/5 px-3 py-1.5 rounded-xl border border-[#BC6C25]/10">
                           {[1,2,3,4,5].map((star) => (
                             <button key={star} onClick={() => setEditedItem({...editedItem, rating: star})} className={`transition-all ${editedItem.rating >= star ? 'text-[#BC6C25]' : 'text-[#BC6C25]/20'}`}>
                                <ShieldCheck size={12} fill={editedItem.rating >= star ? "currentColor" : "none"} />
                             </button>
                           ))}
                        </div>
                     </div>
                     <div className="flex items-start gap-3 group/edit">
                        <input 
                          value={editedItem.title} 
                          onChange={(e) => setEditedItem({...editedItem, title: e.target.value})}
                          className="w-full bg-transparent text-2xl font-black text-[#1B4332] uppercase tracking-tighter leading-tight border-none p-0 focus:ring-0"
                          placeholder="PRODUCT TITLE"
                        />
                        <Edit3 size={16} className="text-[#1B4332]/10 mt-1" />
                     </div>
                  </div>

                  <div className="p-6 bg-[#1B4332]/[0.01] rounded-[1.5rem] border border-[#1B4332]/5 space-y-3">
                     <div className="flex items-center justify-between text-[#BC6C25]/60">
                        <div className="flex items-center gap-2">
                           <Info size={14} />
                           <span className="text-[9px] font-black uppercase tracking-widest">Description (Global View)</span>
                        </div>
                        <span className="text-[8px] font-bold uppercase opacity-30 italic">Sovereign Edit Access</span>
                     </div>
                     <textarea 
                       value={editedItem.description}
                       onChange={(e) => setEditedItem({...editedItem, description: e.target.value})}
                       className="w-full bg-transparent text-[13px] font-medium text-[#1B4332]/70 leading-relaxed italic border-none focus:ring-0 p-0 min-h-[100px] resize-none overflow-hidden"
                       placeholder="Fix description..."
                     />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-5 bg-[#FDFBF7] rounded-[1.5rem] border border-[#1B4332]/5 group">
                        <span className="text-[8px] font-black text-[#1B4332]/20 uppercase tracking-widest block mb-1.5">Market Price (₹)</span>
                        <input 
                          type="number"
                          value={editedItem.price} 
                          onChange={(e) => setEditedItem({...editedItem, price: e.target.value})}
                          className="w-full bg-transparent text-xl font-black text-[#1B4332] border-none p-0 focus:ring-0"
                        />
                     </div>
                     <div className="p-5 bg-[#FDFBF7] rounded-[1.5rem] border border-[#1B4332]/5 group">
                        <span className="text-[8px] font-black text-[#1B4332]/20 uppercase tracking-widest block mb-1.5">Weight / Unit</span>
                        <div className="flex items-center gap-2">
                           <input 
                             type="number"
                             value={editedItem.weight} 
                             onChange={(e) => setEditedItem({...editedItem, weight: e.target.value})}
                             className="w-20 bg-transparent text-xl font-black text-[#1B4332] border-none p-0 focus:ring-0"
                           />
                           <input 
                             value={editedItem.unit} 
                             onChange={(e) => setEditedItem({...editedItem, unit: e.target.value})}
                             className="w-12 bg-transparent text-xl font-black text-[#1B4332] uppercase border-none p-0 focus:ring-0"
                           />
                        </div>
                     </div>
                  </div>

                  <div className="flex items-center gap-4 px-6 py-5 bg-[#FDFBF7] rounded-[1.5rem] border border-[#1B4332]/5">
                     <Store size={20} className="text-[#BC6C25]" />
                     <div className="flex-1 truncate">
                        <p className="text-[13px] font-black text-[#1B4332] uppercase tracking-tight truncate leading-none">{item?.sellers?.shop_name || 'Artisan Shop'}</p>
                        <p className="text-[9px] font-bold text-[#1B4332]/30 uppercase tracking-[0.2em] mt-1.5 italic">Trusted Shop</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="p-8 border-t border-[#1B4332]/5 bg-white space-y-4">
               <AnimatePresence mode="wait">
                 {!isRejecting ? (
                   <motion.div key="actions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">
                      <button 
                       onClick={() => onAction('approved', getChanges())} 
                       className="w-full h-14 rounded-2xl bg-[#1B4332] hover:bg-[#BC6C25] text-white font-black tracking-[0.2em] uppercase text-[10px] shadow-xl transition-all flex items-center justify-center gap-3 group active:scale-[0.98]"
                      >
                         <CheckCircle2 size={18} />
                         {hasChanges ? 'Approve & Save Sovereign Fixes' : 'Approve Product'}
                      </button>
                      <button onClick={() => setModal({ isRejecting: true })} className="w-full h-14 rounded-2xl bg-[#FDFBF7] border border-[#1B4332]/10 text-[#1B4332]/60 hover:text-rose-600 transition-all font-black tracking-[0.2em] uppercase text-[10px] flex items-center justify-center gap-3 active:scale-[0.98]"><XCircle size={18} />Send Back</button>
                   </motion.div>
                 ) : (
                   <motion.div key="denial" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                      <textarea value={reason} onChange={(e) => setModal({ reason: e.target.value })} placeholder="Tell the artisan what to fix..." className="w-full bg-[#FDFBF7] border border-[#1B4332]/10 rounded-[1.5rem] p-5 text-[14px] font-medium focus:border-[#BC6C25] focus:outline-none min-h-[100px] text-[#1B4332] placeholder:text-[#1B4332]/10 transition-all shadow-inner" />
                      <div className="flex gap-3">
                         <button onClick={() => setModal({ isRejecting: false })} className="flex-1 h-12 rounded-2xl bg-[#FDFBF7] border border-[#1B4332]/5 text-[#1B4332]/40 font-black uppercase text-[9px] tracking-widest">Back</button>
                         <button onClick={() => onAction('rejected')} className="flex-[2] h-12 rounded-2xl bg-rose-600 text-white font-black uppercase text-[9px] tracking-widest">Confirm Send Back</button>
                      </div>
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
