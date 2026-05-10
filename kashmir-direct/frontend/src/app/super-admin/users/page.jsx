'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Loader2, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

// 🏛️ ADMINISTRATIVE COMPONENTS
import UserDirectory from '@/components/admin/UserDirectory';

function UserDirectoryContent() {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAdmin) fetchUsers();
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/data?type=users');
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setUsers(data || []);
    } catch (err) {
      console.error('Registry Stream Failure:', err);
      toast.error('User directory sync failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 pb-20">
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="page-header">
             <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_#3b82f6]" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1B4332]/40">Identity Registry Node</span>
             </div>
             <h1 className="text-4xl font-black text-[#1B4332] tracking-tighter leading-none">Global <span className="text-[#BC6C25] font-serif italic font-normal lowercase">Users</span></h1>
             <p className="text-[12px] font-medium text-[#1B4332]/40 italic mt-2">Monitoring {users.length} active valley identities.</p>
          </div>
          
          <button onClick={fetchUsers} className="h-14 px-8 bg-[#1B4332]/5 border border-[#1B4332]/10 text-[#1B4332] rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-[#1B4332] hover:text-white transition-all shadow-sm">
             <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh Directory
          </button>
       </div>

       <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <UserDirectory users={users} />
       </motion.div>
    </div>
  );
}

export default function SuperAdminUsersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#BC6C25]" /></div>}>
       <UserDirectoryContent />
    </Suspense>
  );
}
