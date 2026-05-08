'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ShieldOff, AlertOctagon } from 'lucide-react';
import Button from '../ui/Button';

export default function PrivilegeManager({ isOpen, seller, newLimit, newExpiry, isVerified, setModal, onUpdate }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-8">
       <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModal({ isOpen: false })} className="absolute inset-0 bg-[#050B08]/90 backdrop-blur-2xl" />
       <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-[#0A1A13] w-full max-w-lg rounded-[4rem] p-16 shadow-2xl border border-white/5">
          <div className={`w-24 h-24 rounded-[2.5rem] flex items-center justify-center mb-10 ${isVerified ? 'bg-[#BC6C25]' : 'bg-rose-600'} text-white shadow-xl shadow-[#BC6C25]/10`}>
             {isVerified ? <Zap size={44} /> : <ShieldOff size={44} />}
          </div>
          <h3 className="text-4xl font-black tracking-tighter uppercase italic text-white">Artisan Access</h3>
          <p className="text-white/20 font-medium mb-12 italic">Modifying partition for <b>{seller?.shop_name}</b></p>
          
          <div className="space-y-6 mb-12">
             <div className="flex items-center justify-between p-8 bg-white/5 rounded-[2.5rem] border border-white/5">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Account Verified</span>
                <button onClick={() => setModal({ isVerified: !isVerified })} className={`w-14 h-8 rounded-full relative transition-all ${isVerified ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                   <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${isVerified ? 'right-1' : 'left-1'}`} />
                </button>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                   <label className="text-[9px] font-black uppercase tracking-widest text-white/20 ml-2">Slot Limit</label>
                   <input type="number" value={newLimit} onChange={(e) => setModal({ newLimit: e.target.value })} className="w-full bg-transparent border-none text-white text-lg font-black focus:outline-none mt-2" />
                </div>
                <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                   <label className="text-[9px] font-black uppercase tracking-widest text-white/20 ml-2">Expiry Date</label>
                   <input type="date" value={newExpiry} onChange={(e) => setModal({ newExpiry: e.target.value })} className="w-full bg-transparent border-none text-white text-sm font-black focus:outline-none mt-2" />
                </div>
             </div>
          </div>

          <div className="space-y-4">
             <Button onClick={() => onUpdate(false)} variant="primary" className="w-full h-20 rounded-[2rem] bg-[#BC6C25] font-black tracking-[0.3em] uppercase text-xs text-white">SAVE PRIVILEGES</Button>
             <button onClick={() => { if(confirm('TERMINATE ACCOUNT?')) onUpdate(true); }} className="w-full text-rose-500/40 hover:text-rose-500 text-[10px] font-black uppercase tracking-widest py-4 flex items-center justify-center gap-3 transition-colors">
                <AlertOctagon size={16} /> Terminate Access
             </button>
          </div>
       </motion.div>
    </div>
  );
}
