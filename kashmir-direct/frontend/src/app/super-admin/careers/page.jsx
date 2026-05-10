'use client';

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

// 🏛️ ADMINISTRATIVE COMPONENTS
import JobForge from '@/components/admin/JobForge';

function JobBoardContent() {
  return (
    <div className="space-y-10 pb-20">
       <div className="page-header">
          <div className="flex items-center gap-2 mb-2">
             <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse shadow-[0_0_8px_#f97316]" />
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1B4332]/40">Talent Acquisition Node</span>
          </div>
          <h1 className="text-4xl font-black text-[#1B4332] tracking-tighter leading-none">Artisan <span className="text-[#BC6C25] font-serif italic font-normal lowercase">Job Board</span></h1>
          <p className="text-[12px] font-medium text-[#1B4332]/40 italic mt-2">Forging the next generation of valley craftsmanship.</p>
       </div>

       <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <JobForge />
       </motion.div>
    </div>
  );
}

export default function SuperAdminCareersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#BC6C25]" /></div>}>
       <JobBoardContent />
    </Suspense>
  );
}
