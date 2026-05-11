import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ShieldOff, AlertOctagon, Calendar, Layers, CheckCircle2, XCircle, ShieldCheck, Mail, ArrowLeft } from 'lucide-react';
import { ForgeModal, ForgeInput, ForgeTextarea, ForgeButton } from './shared/ForgeComponents';

export default function PrivilegeManager({ isOpen, seller, newLimit, newExpiry, isVerified, setModal, onUpdate }) {
  const [isTerminating, setIsTerminating] = useState(false);
  const [reason, setReason] = useState('Your account has been terminated due to policy violations. This is a final decision by the Super Admin.');

  if (!isOpen) return null;

  return (
    <ForgeModal
      isOpen={isOpen}
      onClose={() => { setModal({ isOpen: false }); setIsTerminating(false); }}
      title={isTerminating ? "Terminate Artisan" : "Artisan Governance"}
      subtitle={seller ? <>Target: <span className="text-[#BC6C25]">{seller.shop_name}</span></> : null}
      icon={isTerminating ? AlertOctagon : (isVerified ? ShieldCheck : ShieldOff)}
      footer={
        !isTerminating ? (
          <>
            <ForgeButton 
              variant="secondary"
              icon={AlertOctagon}
              onClick={() => setIsTerminating(true)}
            >
               Terminate Access
            </ForgeButton>

            <ForgeButton 
              variant="primary"
              icon={Zap}
              onClick={() => onUpdate(false)}
            >
               Commit Changes
            </ForgeButton>
          </>
        ) : (
          <>
             <ForgeButton 
               variant="secondary"
               onClick={() => setIsTerminating(false)}
             >
                Cancel
             </ForgeButton>
             <ForgeButton 
               variant="danger"
               icon={Zap}
               onClick={() => onUpdate(true, reason)}
             >
                Confirm Termination
             </ForgeButton>
          </>
        )
      }
    >
      <AnimatePresence mode="wait">
        {!isTerminating ? (
          <motion.div 
            key="edit" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
             {/* ✅ VERIFICATION TOGGLE */}
             <div className="flex items-center justify-between p-7 bg-[#1B4332]/[0.02] rounded-3xl border border-[#1B4332]/5 group hover:border-[#1B4332]/10 transition-all">
                <div className="flex items-center gap-5">
                   <div className={`p-3 rounded-xl ${isVerified ? 'text-emerald-500 bg-emerald-500/10' : 'text-rose-500 bg-rose-500/10'}`}>
                      {isVerified ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#1B4332]/40 leading-none mb-1">Status</span>
                      <span className={`text-[12px] font-black uppercase tracking-tighter ${isVerified ? 'text-emerald-600' : 'text-rose-600'}`}>{isVerified ? 'Active & Verified' : 'Access Restricted'}</span>
                   </div>
                </div>
                <button 
                   onClick={() => setModal({ isVerified: !isVerified })} 
                   className={`w-14 h-7 rounded-full relative transition-all duration-500 ${isVerified ? 'bg-emerald-500' : 'bg-rose-500'} shadow-inner shadow-black/10`}
                >
                   <motion.div 
                     animate={{ x: isVerified ? 30 : 6 }}
                     className="absolute top-1.5 w-4 h-4 bg-white rounded-full shadow-lg" 
                   />
                </button>
             </div>

             <div className="grid grid-cols-2 gap-5">
                <ForgeInput 
                  label="Product Limit" 
                  icon={Layers} 
                  type="number" 
                  value={newLimit} 
                  onChange={(e) => setModal({ newLimit: e.target.value })} 
                />
                <ForgeInput 
                  label="Subscription Reset" 
                  icon={Calendar} 
                  type="date" 
                  value={newExpiry} 
                  onChange={(e) => setModal({ newExpiry: e.target.value })} 
                />
             </div>
          </motion.div>
        ) : (
          <motion.div 
            key="terminate" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
             <div className="bg-rose-500/5 border border-rose-500/10 p-6 rounded-2xl flex items-start gap-4">
                <AlertOctagon size={20} className="text-rose-600 flex-shrink-0 mt-1" />
                <p className="text-[10px] font-bold text-rose-600 uppercase tracking-widest leading-relaxed">
                   This action will immediately lock the artisan out of the dashboard and hide all their products from the marketplace.
                </p>
             </div>

             <ForgeTextarea 
                label="Termination Reason (Sent via Email)"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Detail the reason for this action..."
             />
          </motion.div>
        )}
      </AnimatePresence>
    </ForgeModal>
  );
}
