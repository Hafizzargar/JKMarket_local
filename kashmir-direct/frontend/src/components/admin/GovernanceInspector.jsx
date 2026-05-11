import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, XCircle, Store, CheckCircle2, Scale, Tag, ImagePlus, Trash2, Layers, Info } from 'lucide-react';
import { ForgeModal, ForgeInput, ForgeTextarea, ForgeSelect, ForgeButton } from './shared/ForgeComponents';

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
    <ForgeModal
      isOpen={isOpen}
      onClose={() => setModal({ isOpen: false })}
      title={isRejecting ? "Return Submission" : "Governance Check"}
      subtitle={item ? <>Product: <span className="text-[#BC6C25]">{item.title}</span></> : null}
      icon={ShieldCheck}
      footer={
        <div className="w-full">
           {!isRejecting ? (
             <div className="flex gap-4">
                <ForgeButton 
                  variant="primary" 
                  icon={CheckCircle2} 
                  onClick={() => onAction('approved', getChanges())}
                  className="flex-[2] h-14"
                >
                   {hasChanges ? 'Approve & Save Changes' : 'Approve Product'}
                </ForgeButton>
                <ForgeButton 
                  variant="secondary" 
                  icon={XCircle} 
                  onClick={() => setModal({ isRejecting: true })}
                  className="flex-1 h-14 !text-rose-500 hover:!bg-rose-500 hover:!text-white"
                >
                   Reject
                </ForgeButton>
             </div>
           ) : (
             <div className="flex gap-4">
                <ForgeButton 
                  variant="secondary" 
                  onClick={() => setModal({ isRejecting: false })}
                  className="flex-1 h-14"
                >
                   Back
                </ForgeButton>
                <ForgeButton 
                  variant="danger" 
                  onClick={() => onAction('rejected')}
                  className="flex-[1.5] h-14"
                >
                   Confirm Return
                </ForgeButton>
             </div>
           )}
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {/* 📸 MEDIA & INFO */}
         <div className="space-y-6">
            <div className="relative aspect-square rounded-[2rem] overflow-hidden border border-[#1B4332]/10 bg-white shadow-2xl group/img">
               <AnimatePresence mode="wait">
                  {editedItem.images.length > 0 ? (
                    <motion.img key={currentImg} src={editedItem.images[currentImg]} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full object-cover" alt="Product" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-[#1B4332]/10">
                       <ImagePlus size={48} className="mb-3" />
                       <p className="text-[10px] font-black uppercase tracking-[0.2em]">No Media</p>
                    </div>
                  )}
               </AnimatePresence>
               
               <div className="absolute top-4 right-4 flex flex-col gap-2 z-30 opacity-0 group-hover/img:opacity-100 transition-all">
                  <button onClick={() => fileInputRef.current?.click()} className="w-10 h-10 rounded-xl bg-white/90 backdrop-blur-md border border-[#1B4332]/10 flex items-center justify-center text-[#1B4332] hover:bg-[#BC6C25] hover:text-white transition-all shadow-lg"><ImagePlus size={16} /></button>
                  {editedItem.images.length > 0 && (
                    <button onClick={() => removeImage(currentImg)} className="w-10 h-10 rounded-xl bg-white/90 backdrop-blur-md border border-rose-100 flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-lg"><Trash2 size={16} /></button>
                  )}
               </div>
               <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" multiple accept="image/*" />

               {editedItem.images.length > 1 && (
                  <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-1.5 z-20">
                     {editedItem.images.map((_, idx) => (
                       <button key={idx} onClick={() => setCurrentImg(idx)} className={`h-1.5 rounded-full transition-all ${currentImg === idx ? 'w-6 bg-[#BC6C25]' : 'w-1.5 bg-white/40 hover:bg-white/60'}`} />
                     ))}
                  </div>
               )}
            </div>

            <div className="p-6 bg-[#1B4332]/[0.02] rounded-3xl border border-[#1B4332]/5 space-y-4">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#BC6C25]/10 rounded-xl flex items-center justify-center text-[#BC6C25]"><Store size={20} /></div>
                  <div className="flex-1">
                     <p className="text-[12px] font-black text-[#1B4332] uppercase truncate">{item?.sellers?.shop_name || 'Artisan Shop'}</p>
                     <p className="text-[8px] font-bold text-[#1B4332]/30 uppercase tracking-[0.2em] mt-0.5">Proprietor Source</p>
                  </div>
               </div>
               <div className="pt-4 border-t border-[#1B4332]/5 flex items-center justify-between">
                  <span className="text-[9px] font-black text-[#1B4332]/40 uppercase tracking-widest">Target Rating</span>
                  <div className="flex gap-1.5">
                     {[1,2,3,4,5].map((star) => (
                       <button key={star} onClick={() => setEditedItem({...editedItem, rating: star})} className={`transition-all active:scale-110 ${editedItem.rating >= star ? 'text-[#BC6C25]' : 'text-[#BC6C25]/10'}`}><ShieldCheck size={14} fill={editedItem.rating >= star ? "currentColor" : "none"} /></button>
                     ))}
                  </div>
               </div>
            </div>
         </div>

         {/* 📝 FORM FIELDS */}
         <div className="space-y-6">
            {isRejecting ? (
              <ForgeTextarea 
                 label="Return Reason"
                 value={reason}
                 onChange={(e) => setModal({ reason: e.target.value })}
                 placeholder="Specify the reason for returning this submission..."
                 icon={Info}
              />
            ) : (
              <>
                <ForgeInput 
                   label="Product Category"
                   icon={Tag}
                   value={editedItem.category}
                   onChange={(e) => setEditedItem({...editedItem, category: e.target.value})}
                />
                <ForgeInput 
                   label="Product Title"
                   icon={Layers}
                   value={editedItem.title}
                   onChange={(e) => setEditedItem({...editedItem, title: e.target.value})}
                />
                <ForgeTextarea 
                   label="Detailed Description"
                   value={editedItem.description}
                   onChange={(e) => setEditedItem({...editedItem, description: e.target.value})}
                   placeholder="Describe the artisan's work..."
                />
                <div className="grid grid-cols-2 gap-4">
                   <ForgeInput 
                      label="Retail Price (₹)"
                      type="number"
                      value={editedItem.price}
                      onChange={(e) => setEditedItem({...editedItem, price: e.target.value})}
                   />
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1B4332]/40 ml-1">Scale / Unit</label>
                      <div className="flex items-center gap-2">
                         <div className="flex-1">
                            <ForgeInput 
                               type="number"
                               value={editedItem.weight}
                               onChange={(e) => setEditedItem({...editedItem, weight: e.target.value})}
                            />
                         </div>
                         <div className="w-24">
                            <ForgeSelect 
                               value={editedItem.unit}
                               onChange={(e) => setEditedItem({...editedItem, unit: e.target.value})}
                               options={[
                                  { label: 'GM', value: 'g' },
                                  { label: 'KG', value: 'kg' },
                                  { label: 'ML', value: 'ml' },
                                  { label: 'L', value: 'l' }
                               ]}
                            />
                         </div>
                      </div>
                   </div>
                </div>
              </>
            )}
         </div>
      </div>
    </ForgeModal>
  );
}
