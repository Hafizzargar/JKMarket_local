'use client';

import { useState, useEffect, Suspense } from 'react';
import { ShoppingBag, ShieldCheck, XCircle, Search, Filter, Loader2, Package, Eye, CheckCircle, Ban, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ForgeTable, ForgeButton } from '@/components/admin/shared/ForgeComponents';
import SovereignPagination from '@/components/admin/SovereignPagination';
import GovernanceInspector from '@/components/admin/GovernanceInspector';

function ProductRegistryContent() {
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'active' | 'rejected'
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectModal, setInspectModal] = useState({ isOpen: false, item: null, isRejecting: false, reason: '' });
  
  const searchParams = useSearchParams();
  const deepInspectId = searchParams.get('inspect');

  // 🛰️ GLOBAL SYNC LISTENER
  useEffect(() => {
    const handleGlobalSync = () => fetchProducts();
    window.addEventListener('platform-sync', handleGlobalSync);
    return () => window.removeEventListener('platform-sync', handleGlobalSync);
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/data?type=products&page=${page}&pageSize=${pageSize}&status=${activeTab}`);
      const result = await response.json();
      
      if (result.error) throw new Error(result.error);
      
      const rawData = result.data || [];
      setProducts(rawData);
      setTotal(result.total || 0);

      // 🎯 AUTO-INSPECT DEEP LINK
      if (deepInspectId) {
         const target = rawData.find(p => p.id === deepInspectId);
         if (target) setInspectModal({ isOpen: true, item: target, isRejecting: false, reason: '' });
      }
    } catch (err) {
      console.error('Inventory Sync Failure:', err);
      toast.error('Failed to sync inventory vault');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1); // Reset page on tab shift
  }, [activeTab]);

  useEffect(() => {
    fetchProducts();
  }, [page, pageSize, activeTab]);

  const handleGovernance = async (status, payload = {}) => {
    const isApprove = status === 'approved';
    const toastId = toast.loading(`${isApprove ? 'Certifying' : 'Returning'} product...`);
    
    try {
      const updateData = { 
        status,
        is_approved: isApprove,
        rejection_reason: isApprove ? null : inspectModal.reason
      };
      
      if (isApprove) {
        if (payload.title) updateData.title = payload.title;
        if (payload.category) updateData.category = payload.category;
        if (payload.description) updateData.description = payload.description;
        if (payload.price) updateData.price = Number(payload.price);
        if (payload.weight) updateData.weight_value = Number(payload.weight);
        if (payload.unit) updateData.weight_unit = payload.unit;
        if (payload.images) updateData.images = payload.images;
      }

      const { error } = await supabase.from('products').update(updateData).eq('id', inspectModal.item.id);
      if (error) throw error;

      toast.success(`Product ${isApprove ? 'Certified' : 'Returned'} Successfully`, { id: toastId });
      
      // 🚀 OPTIMISTIC UI UPDATE
      setProducts(prev => prev.filter(p => p.id !== inspectModal.item.id));
      setInspectModal({ isOpen: false, item: null, isRejecting: false, reason: '' });
    } catch (err) {
      console.error('Governance Failure:', err);
      toast.error('Governance Protocol Failure', { id: toastId });
    }
  };

  const tabs = [
    { id: 'pending', label: 'Approval Vault', icon: ShieldCheck, color: '#BC6C25' },
    { id: 'active', label: 'Active Inventory', icon: CheckCircle, color: '#1B4332' },
    { id: 'rejected', label: 'Rejected Vault', icon: Ban, color: '#E63946' }
  ];

  const columns = [
    { label: 'Ref', align: 'center', width: '60px' },
    { label: 'Product Essence', align: 'left' },
    { label: 'Artisan Source', align: 'left' },
    { label: 'Valuation', align: 'left' },
    { label: 'Governance', align: 'right' }
  ];

  const renderRow = (p, idx) => {
    const sNo = (page - 1) * pageSize + idx + 1;
    return (
      <>
        <td className="px-8 py-6 text-center">
           <span className="text-[10px] font-black text-[#1B4332]/20 uppercase tracking-tighter">
             {sNo.toString().padStart(2, '0')}
           </span>
        </td>
        <td className="px-8 py-6">
           <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-[#1B4332]/5 overflow-hidden border border-[#1B4332]/5 flex-shrink-0">
                 {p.images?.[0] ? (
                   <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-[#1B4332]/20">
                      <Package size={20} />
                   </div>
                 )}
              </div>
              <div>
                 <p className="text-[13px] font-black text-[#1B4332] uppercase tracking-tighter leading-tight">{p.name || p.title}</p>
                 <p className="text-[9px] font-bold text-[#BC6C25] uppercase tracking-widest mt-1">{p.category || 'Luxury Goods'}</p>
              </div>
           </div>
        </td>
      <td className="px-8 py-6">
         <p className="text-[12px] font-black text-[#1B4332] uppercase leading-none">{p.sellers?.shop_name || 'Direct Artisan'}</p>
         <p className="text-[9px] font-bold text-[#1B4332]/30 uppercase tracking-widest mt-1">{p.sellers?.profiles?.full_name}</p>
      </td>
      <td className="px-8 py-6">
         <p className="text-sm font-black text-[#1B4332]">₹{p.price?.toLocaleString()}</p>
         <p className="text-[9px] font-bold text-[#1B4332]/30 uppercase tracking-widest mt-1">Market Valuation</p>
      </td>
      <td className="px-8 py-6 text-right">
         <div className="flex items-center justify-end gap-2">
            <ForgeButton 
              variant="primary"
              icon={ArrowUpRight}
              onClick={() => setInspectModal({ isOpen: true, item: p, isRejecting: false, reason: '' })}
            >
               {activeTab === 'pending' ? 'Review' : 'Manage'}
            </ForgeButton>
         </div>
      </td>
    </>
    );
  };

  return (
    <div className="space-y-8">
       {/* 🏛️ ELITE TAB NAVIGATION */}
       <div className="flex items-center gap-2 p-1 bg-[#1B4332]/5 rounded-2xl w-fit border border-[#1B4332]/5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-6 py-2.5 rounded-xl transition-all flex items-center gap-2 group`}
            >
               {activeTab === tab.id && (
                 <motion.div 
                   layoutId="active-inventory-tab"
                   className="absolute inset-0 bg-white shadow-md rounded-xl z-0"
                   transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                 />
               )}
               <tab.icon 
                 size={14} 
                 className={`relative z-10 transition-colors ${activeTab === tab.id ? 'text-[#BC6C25]' : 'text-[#1B4332]/40 group-hover:text-[#1B4332]/60'}`} 
               />
               <span className={`relative z-10 text-[9px] font-black uppercase tracking-widest transition-colors ${activeTab === tab.id ? 'text-[#1B4332]' : 'text-[#1B4332]/40 group-hover:text-[#1B4332]/60'}`}>
                  {tab.label}
               </span>
            </button>
          ))}
       </div>

       <ForgeTable 
         columns={columns}
         data={products}
         loading={loading}
         emptyMessage={`No ${activeTab} products found in the vault.`}
         renderRow={renderRow}
         icon={Package}
         header={
           <div className="flex items-center justify-between px-6 py-3 bg-[#FDFBF7]/50 border-b border-[#1B4332]/5">
              {/* 🔍 COMPACT SEARCH */}
              <div className="relative group">
                 <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1B4332]/40 group-focus-within:text-[#BC6C25] transition-colors" />
                 <input 
                   type="text"
                   placeholder="Search inventory..."
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="bg-white border border-[#1B4332]/20 rounded-[8px] pl-10 pr-4 py-2 text-[10px] font-black text-[#1B4332] placeholder:text-[#1B4332]/40 outline-none focus:border-[#BC6C25]/40 focus:bg-white transition-all w-48"
                 />
              </div>

              {/* 🚀 COMPACT NAVIGATION */}
              <SovereignPagination 
                variant="compact"
                currentPage={page}
                totalItems={total}
                itemsPerPage={pageSize}
                onPageChange={setPage}
              />
           </div>
         }
       />

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

export default function ProductRegistryPage() {
  return (
    <Suspense fallback={<div className="flex flex-col items-center justify-center h-[400px] gap-4"><Loader2 className="animate-spin text-[#BC6C25]" size={32} /></div>}>
      <ProductRegistryContent />
    </Suspense>
  );
}
