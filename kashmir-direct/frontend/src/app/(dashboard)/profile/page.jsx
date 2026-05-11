'use client';

import { motion } from 'framer-motion';
import ProfileNode from '@/components/ui/ProfileNode';

export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto pt-6 space-y-10 pb-20">
       <div className="page-header border-b border-[#1B4332]/5 pb-8">
          <h1 className="text-3xl font-black text-[#1B4332] tracking-tighter mb-2 uppercase">My <span className="text-[#BC6C25] font-serif italic font-normal">Vault</span></h1>
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#1B4332]/30">Secure Sovereign Identity Management</p>
       </div>

       <motion.div 
         initial={{ opacity: 0, y: 20 }} 
         animate={{ opacity: 1, y: 0 }}
         transition={{ type: 'spring', damping: 25 }}
       >
          <ProfileNode />
       </motion.div>
    </div>
  );
}
