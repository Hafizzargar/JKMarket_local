'use client';

import { motion } from 'framer-motion';
import ProfileNode from '@/components/ui/ProfileNode';

export default function ProfilePage() {
  return (
    <div className="space-y-8">
       <div className="page-header">
          <h1 className="text-[22px] font-bold text-[#1B4332] mb-1">My Profile</h1>
          <p className="text-[13px] text-[#1B4332]/40">Manage your artisan persona and account security.</p>
       </div>

       <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <ProfileNode />
       </motion.div>
    </div>
  );
}
