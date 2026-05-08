'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';

export default function GovernanceInspector({ isOpen, item, isRejecting, reason, setModal, onAction }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-12">
       <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        onClick={() => setModal({ isOpen: false })} 
        className="absolute inset-0 bg-[#050B08]/95 backdrop-blur-3xl" 
       />
       <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 40 }} 
        animate={{ scale: 1, opacity: 1, y: 0 }} 
        exit={{ scale: 0.9, opacity: 0, y: 40 }} 
        className="relative bg-[#0A1A13] w-full max-w-6xl rounded-[4rem] shadow-2xl overflow-hidden flex border border-white/5"
       >
          <div className="w-1/2 p-20 bg-black/20 flex items-center justify-center border-r border-white/5">
             <div className="w-full aspect-square rounded-[3.5rem] overflow-hidden shadow-2xl border-4 border-white/10">
                <img src={item?.images?.[0]} className="w-full h-full object-cover shadow-2xl" />
             </div>
          </div>
          <div className="w-1/2 p-24 flex flex-col justify-center gap-12">
             <div>
                <div className="flex items-center gap-4 mb-6">
                   <span className="bg-[#BC6C25]/20 text-[#BC6C25] text-[9px] font-black px-4 py-2 rounded-xl uppercase tracking-widest">Sovereign Validation</span>
                   <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">ID: {item?.id.slice(0,8)}</span>
                </div>
                <h3 className="text-5xl font-black tracking-tighter uppercase italic text-white">{item?.title}</h3>
                <p className="text-lg font-medium text-white/30 mt-4 leading-relaxed italic">"{item?.description}"</p>
             </div>

             {!isRejecting ? (
               <div className="space-y-6">
                  <Button onClick={() => onAction('approved')} variant="primary" className="w-full h-20 rounded-[2rem] bg-emerald-600 hover:bg-emerald-500 font-black tracking-[0.3em] uppercase text-xs shadow-2xl shadow-emerald-500/20 text-white">APPROVE & PUBLISH LIVE</Button>
                  <Button onClick={() => setModal({ isRejecting: true })} variant="outline" className="w-full h-20 rounded-[2rem] border-rose-500/20 text-rose-500 font-black tracking-[0.3em] uppercase text-xs hover:bg-rose-500/10">DENY LISTING</Button>
               </div>
             ) : (
               <div className="space-y-8">
                  <div>
                     <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-6 mb-3 block">Instruction for Artisan</label>
                     <textarea 
                        value={reason} 
                        onChange={(e) => setModal({ reason: e.target.value })} 
                        placeholder="Specify required amendments..." 
                        className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] p-10 text-sm font-medium focus:outline-none min-h-[160px] text-white" 
                     />
                  </div>
                  <div className="flex gap-4">
                     <Button onClick={() => setModal({ isRejecting: false })} variant="outline" className="flex-1 h-16 rounded-[1.5rem] border-white/10 text-white/40">BACK</Button>
                     <Button onClick={() => onAction('rejected')} className="flex-1 h-16 rounded-[1.5rem] bg-rose-600 text-white font-black uppercase text-[10px] tracking-widest shadow-xl shadow-rose-600/20">CONFIRM REJECTION</Button>
                  </div>
               </div>
             )}
             <button onClick={() => setModal({ isOpen: false })} className="text-[10px] font-black uppercase tracking-[0.4em] text-white/10 hover:text-white transition-colors mt-6">Exit Command View</button>
          </div>
       </motion.div>
    </div>
  );
}
