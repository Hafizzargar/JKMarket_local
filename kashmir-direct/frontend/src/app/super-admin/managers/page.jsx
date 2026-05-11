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


       <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <OpsCommand managers={managers} onAddManager={handleRoleRecruitment} />
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
