'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, RefreshCw, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { ForgeButton } from '@/components/admin/shared/ForgeComponents';

// 🏛️ ADMINISTRATIVE COMPONENTS
import JobForge from '../../../components/admin/JobForge';
import ApplicationForge from '../../../components/admin/ApplicationForge';

function JobBoardContent() {
  const [activeTab, setActiveTab] = useState('jobs'); // 'jobs' or 'applications'
  const [loading, setLoading] = useState(false);
  const [jobsCount, setJobsCount] = useState(0);
  const [appsCount, setAppsCount] = useState(0);

  // 🛰️ GLOBAL SYNC LISTENER
  useEffect(() => {
    const handleGlobalSync = () => {
      refreshData();
    };
    window.addEventListener('platform-sync', handleGlobalSync);
    return () => window.removeEventListener('platform-sync', handleGlobalSync);
  }, []);

  // 🔄 AUTO REFRESH ON TAB SWITCH
  useEffect(() => {
    refreshData();
  }, [activeTab]);

  const refreshData = () => {
    setLoading(true);
    // Simulate data pull for sub-components
    setTimeout(() => setLoading(false), 800);
  };

  return (
    <div className="space-y-10 pb-20">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center p-1.5 bg-[#1B4332]/5 rounded-[10px]">
             <button 
               onClick={() => setActiveTab('jobs')}
               className={`px-8 py-3 rounded-[10px] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'jobs' ? 'bg-white text-[#BC6C25] shadow-sm' : 'text-[#1B4332]/40 hover:text-[#1B4332]'}`}
             >
                Job Board
             </button>
             <button 
               onClick={() => setActiveTab('applications')}
               className={`px-8 py-3 rounded-[10px] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'applications' ? 'bg-white text-[#BC6C25] shadow-sm' : 'text-[#1B4332]/40 hover:text-[#1B4332]'}`}
             >
                Applications
             </button>
          </div>

          <div className="flex items-center gap-4 mr-2">
             <AnimatePresence mode="wait">
                {activeTab === 'jobs' ? (
                  <motion.div 
                    key="jobs-actions"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center gap-4"
                  >
                     <div className="flex items-center gap-3 px-4 py-2 bg-[#BC6C25]/5 rounded-[10px] border border-[#BC6C25]/10">
                        <div className="w-1.5 h-1.5 bg-[#BC6C25] rounded-full animate-pulse" />
                        <span className="text-[9px] font-black text-[#BC6C25] uppercase tracking-[0.2em] italic">Registry: {jobsCount} Vacancies</span>
                     </div>
                     
                     <ForgeButton 
                       icon={Plus}
                       onClick={() => window.dispatchEvent(new CustomEvent('open-job-forge'))}
                     >
                        Post Position
                     </ForgeButton>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="apps-actions"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center gap-3 px-4 py-2 bg-[#1B4332]/5 rounded-[10px] border border-[#1B4332]/5"
                  >
                     <div className="w-1.5 h-1.5 bg-[#1B4332] rounded-full animate-pulse" />
                     <span className="text-[8px] font-black text-[#1B4332]/40 uppercase tracking-widest italic">Pipeline: {appsCount} Candidates</span>
                  </motion.div>
                )}
             </AnimatePresence>
          </div>
       </div>

       <motion.div 
         key={activeTab}
         initial={{ opacity: 0, y: 10 }} 
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.4, ease: "easeOut" }}
       >
          {activeTab === 'jobs' ? <JobForge onCountChange={setJobsCount} /> : <ApplicationForge onCountChange={setAppsCount} />}
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
