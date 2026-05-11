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
