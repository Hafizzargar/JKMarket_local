'use client';

import { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

// 🏛️ ADMINISTRATIVE COMPONENTS
import JobForge from '../../../components/admin/JobForge';
import ApplicationForge from '../../../components/admin/ApplicationForge';

function JobBoardContent() {
  const [activeTab, setActiveTab] = useState('jobs'); // 'jobs' or 'applications'

  return (
    <div className="space-y-10 pb-20">
       <div className="flex justify-end items-center mb-6">
          <div className="flex items-center p-1.5 bg-[#1B4332]/5 rounded-2xl border border-[#1B4332]/5 shadow-inner">
             <button 
               onClick={() => setActiveTab('jobs')}
               className={`px-10 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'jobs' ? 'bg-white text-[#BC6C25] shadow-lg' : 'text-[#1B4332]/40 hover:text-[#1B4332]'}`}
             >
                Job Board
             </button>
             <button 
               onClick={() => setActiveTab('applications')}
               className={`px-10 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'applications' ? 'bg-white text-[#BC6C25] shadow-lg' : 'text-[#1B4332]/40 hover:text-[#1B4332]'}`}
             >
                Applications
             </button>
          </div>
       </div>

       <motion.div 
         key={activeTab}
         initial={{ opacity: 0, y: 10 }} 
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.4, ease: "easeOut" }}
       >
          {activeTab === 'jobs' ? <JobForge /> : <ApplicationForge />}
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
