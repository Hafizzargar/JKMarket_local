'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Loader2, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

// 🏛️ ADMINISTRATIVE COMPONENTS
import OpsCommand from '@/components/admin/OpsCommand';

function StaffManagementContent() {
  const { isAdmin } = useAuth();
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAdmin) fetchManagers();
  }, [isAdmin]);

  const fetchManagers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/data?type=users');
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      const mList = data?.filter(p => p.role?.toLowerCase() === 'manager') || [];
      setManagers(mList);
    } catch (err) {
      console.error('Registry Stream Failure:', err);
      toast.error('Staff sync failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 pb-20">
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="page-header">
             <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_8px_#6366f1]" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1B4332]/40">Operations Command Node</span>
             </div>
             <h1 className="text-4xl font-black text-[#1B4332] tracking-tighter leading-none">Staff <span className="text-[#BC6C25] font-serif italic font-normal lowercase">Management</span></h1>
             <p className="text-[12px] font-medium text-[#1B4332]/40 italic mt-2">Overseeing {managers.length} regional operation managers.</p>
          </div>
          
          <button onClick={fetchManagers} className="h-14 px-8 bg-[#1B4332]/5 border border-[#1B4332]/10 text-[#1B4332] rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-[#1B4332] hover:text-white transition-all shadow-sm">
             <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Sync Ops Command
          </button>
       </div>

       <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <OpsCommand managers={managers} />
       </motion.div>
    </div>
  );
}

export default function SuperAdminStaffPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#BC6C25]" /></div>}>
       <StaffManagementContent />
    </Suspense>
  );
}
