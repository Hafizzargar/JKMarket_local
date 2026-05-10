'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Search, ShieldCheck, Loader2, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

// 🏛️ ADMINISTRATIVE COMPONENTS
import SubmissionVault from '@/components/admin/SubmissionVault';
import GovernanceInspector from '@/components/admin/GovernanceInspector';

function ProductsRegistryContent() {
  const { isAdmin } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 🕵️‍♂️ GOVERNANCE STATE
  const [inspectModal, setInspectModal] = useState({ isOpen: false, item: null, isRejecting: false, reason: '' });

  useEffect(() => {
    if (isAdmin) fetchProducts();
  }, [isAdmin]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/data?type=products');
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setProducts(data || []);
    } catch (err) {
      console.error('Registry Stream Failure:', err);
      toast.error('Product sync failed');
    } finally {
      setLoading(false);
    }
  };

  const handleInspect = (p) => {
    setInspectModal({ isOpen: true, item: p, isRejecting: false, reason: '' });
  };

  const handleGovernance = async (status, payload = {}) => {
    const { item, reason } = inspectModal;
    const isApprove = status === 'approved';
    const toastId = toast.loading(`${isApprove ? 'Certifying' : 'Returning'} listing...`);
    
    try {
      const updateData = { 
        is_approved: isApprove, 
        status: isApprove ? 'approved' : 'rejected', 
        rejection_reason: isApprove ? null : reason 
      };

      if (isApprove) {
        if (payload.title) updateData.title = payload.title;
        if (payload.category) updateData.category = payload.category;
        if (payload.description) updateData.description = payload.description;
        if (payload.price) updateData.price = Number(payload.price);
        if (payload.weight) updateData.weight = Number(payload.weight);
        if (payload.unit) updateData.unit = payload.unit;
        if (payload.rating) updateData.rating = payload.rating;
        if (payload.images) updateData.images = payload.images;
      }

      const { error } = await supabase.from('products').update(updateData).eq('id', item.id);
      
      if (error) throw error;
      toast.success(isApprove ? 'Listing Published' : 'Rejection Logged', { id: toastId });
      fetchProducts();
      setInspectModal({ ...inspectModal, isOpen: false });
    } catch (err) {
      toast.error('Governance Sync Error', { id: toastId });
    }
  };

  return (
    <div className="space-y-10 pb-20">
        {/* 🕵️‍♂️ DATA STREAM */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
           <SubmissionVault 
             products={products} 
             onInspect={handleInspect} 
           />
        </motion.div>

       <AnimatePresence>
          {inspectModal.isOpen && (
            <GovernanceInspector 
              {...inspectModal} 
              setModal={(update) => setInspectModal(prev => ({ ...prev, ...update }))} 
              onAction={handleGovernance} 
            />
          )}
       </AnimatePresence>
    </div>
  );
}

export default function SuperAdminProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#BC6C25]" /></div>}>
       <ProductsRegistryContent />
    </Suspense>
  );
}
