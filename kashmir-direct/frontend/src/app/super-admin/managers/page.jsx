'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Loader2, RefreshCw, ShieldAlert, Plus, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { ForgeButton } from '@/components/admin/shared/ForgeComponents';
import AddManagerSlideOver from '@/components/admin/AddManagerSlideOver';

// 🏛️ ADMINISTRATIVE COMPONENTS
import OpsCommand from '@/components/admin/OpsCommand';

function StaffManagementContent() {
  const { isAdmin } = useAuth();
  const [managers, setManagers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // 🛰️ GLOBAL SYNC LISTENER (Connected to Header Refresh)
  useEffect(() => {
    const handleGlobalSync = () => {
      fetchManagers();
    };
    window.addEventListener('platform-sync', handleGlobalSync);
    return () => window.removeEventListener('platform-sync', handleGlobalSync);
  }, []);

  useEffect(() => {
    if (isAdmin) fetchManagers();
  }, [isAdmin, page, pageSize]);

  const fetchManagers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/data?type=managers&page=${page}&pageSize=${pageSize}`);
      const result = await response.json();
      if (result.error) throw new Error(result.error);
      
      setManagers(result.data || []);
      setTotal(result.total || 0);
    } catch (err) {
      console.error('Registry Stream Failure:', err);
      toast.error('Staff sync failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleRecruitment = async (payload) => {
    const toastId = toast.loading(`Recruiting ${payload.full_name}...`);
    try {
      const response = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const result = await response.json();
      if (result.error) throw new Error(result.error);

      toast.success('Manager Successfully Recruited', { id: toastId });
      fetchManagers(); 
    } catch (err) {
      console.error('Recruitment Error:', err);
      toast.error(err.message || 'Recruitment Protocol Failure', { id: toastId });
    }
  };

  return (
    <div className="space-y-10 pb-20">
       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-[#1B4332] rounded-[10px] flex items-center justify-center text-white shadow-xl shadow-[#1B4332]/20">
                <Users size={24} />
             </div>
             <div>
                <h3 className="text-xl font-black text-[#1B4332] uppercase tracking-tighter">Command Staff</h3>
                <p className="text-[10px] font-bold text-[#BC6C25] uppercase tracking-widest mt-1">Operational Hierarchy Registry</p>
             </div>
          </div>

          <ForgeButton 
            variant="primary" 
            icon={Plus} 
            onClick={() => setIsAddOpen(true)}
            className="h-14 px-8"
          >
             Recruit New Staff
          </ForgeButton>
       </div>

       <AddManagerSlideOver 
         isOpen={isAddOpen} 
         onClose={() => setIsAddOpen(false)} 
         onAdd={handleRoleRecruitment}
       />

       <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <OpsCommand 
            managers={managers} 
            loading={loading}
            onAddManager={handleRoleRecruitment}
            totalItems={total}
            currentPage={page}
            itemsPerPage={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
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
