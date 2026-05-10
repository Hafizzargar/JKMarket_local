'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Loader2, ShieldCheck, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

// 🏛️ ADMINISTRATIVE COMPONENTS
import ArtisanRegistry from '@/components/admin/ArtisanRegistry';
import PrivilegeManager from '@/components/admin/PrivilegeManager';
import { supabase } from '@/lib/supabase';

function ArtisanRegistryContent() {
  const { isAdmin } = useAuth();
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 🕵️‍♂️ GOVERNANCE STATE
  const [privilegeModal, setPrivilegeModal] = useState({ isOpen: false, seller: null, newLimit: '', newExpiry: '', isVerified: true });

  useEffect(() => {
    if (isAdmin) fetchArtisans();
  }, [isAdmin]);

  const fetchArtisans = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/data?type=artisans');
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setArtisans(data || []);
    } catch (err) {
      console.error('Registry Stream Failure:', err);
      toast.error('Artisan sync failed');
    } finally {
      setLoading(false);
    }
  };

  const updatePrivileges = async () => {
    const { seller, newLimit, newExpiry, isVerified } = privilegeModal;
    try {
      const updates = { 
        product_limit: parseInt(newLimit),
        subscription_expires_at: new Date(newExpiry).toISOString(),
        is_verified: isVerified
      };
      await supabase.from('sellers').update(updates).eq('id', seller.id);
      toast.success('Artisan Rights Updated');
      fetchArtisans();
      setPrivilegeModal({ ...privilegeModal, isOpen: false });
    } catch (err) {
      toast.error('Governance failed');
    }
  };

  return (
    <div className="space-y-10 pb-20">
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="page-header">
             <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1B4332]/40">Artisan Registry Node</span>
             </div>
             <h1 className="text-4xl font-black text-[#1B4332] tracking-tighter leading-none">Shop <span className="text-[#BC6C25] font-serif italic font-normal lowercase">Governance</span></h1>
             <p className="text-[12px] font-medium text-[#1B4332]/40 italic mt-2">Managing {artisans.length} verified artisan boutiques.</p>
          </div>
          
          <button onClick={fetchArtisans} className="h-14 px-8 bg-[#1B4332]/5 border border-[#1B4332]/10 text-[#1B4332] rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-[#1B4332] hover:text-white transition-all shadow-sm">
             <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh Registry
          </button>
       </div>

       <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <ArtisanRegistry 
            shopkeepers={artisans} 
            onEdit={(sk) => setPrivilegeModal({ isOpen: true, seller: sk, newLimit: sk.product_limit.toString(), newExpiry: sk.subscription_expires_at?.split('T')[0], isVerified: sk.is_verified })} 
          />
       </motion.div>

       <PrivilegeManager 
          {...privilegeModal} 
          setModal={(update) => setPrivilegeModal(prev => ({ ...prev, ...update }))} 
          onUpdate={updatePrivileges} 
       />
    </div>
  );
}

export default function SuperAdminArtisansPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#BC6C25]" /></div>}>
       <ArtisanRegistryContent />
    </Suspense>
  );
}
