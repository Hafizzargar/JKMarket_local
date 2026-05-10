'use client';

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

// 🏛️ ADMINISTRATIVE COMPONENTS
import ProfileForge from '@/components/admin/ProfileForge';

function AdminSettingsContent() {
  const { profile } = useAuth();
  
  return (
    <div className="space-y-10 pb-20">
       <div className="page-header">
          <div className="flex items-center gap-2 mb-2">
             <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse shadow-[0_0_8px_#64748b]" />
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1B4332]/40">System Configuration Node</span>
          </div>
          <h1 className="text-4xl font-black text-[#1B4332] tracking-tighter leading-none">Admin <span className="text-[#BC6C25] font-serif italic font-normal lowercase">Settings</span></h1>
          <p className="text-[12px] font-medium text-[#1B4332]/40 italic mt-2">Managing the administrative identity and security protocols.</p>
       </div>

       <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <ProfileForge profile={profile} />
       </motion.div>
    </div>
  );
}

export default function SuperAdminSettingsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#BC6C25]" /></div>}>
       <AdminSettingsContent />
    </Suspense>
  );
}
