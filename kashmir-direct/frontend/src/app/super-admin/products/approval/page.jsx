'use client';

import { useState, useEffect, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Loader2, Search, Filter, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useSearchParams } from 'next/navigation';
import GovernanceInspector from '@/components/admin/GovernanceInspector';

function SovereignAuditContent() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectModal, setInspectModal] = useState({ isOpen: false, item: null, isRejecting: false, reason: '' });
  const searchParams = useSearchParams();
  const inspectId = searchParams.get('inspect');

  // 🔄 FETCH PENDING VAULT (Via Secure API)
  const fetchPendingProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/data?type=products');
      const data = await response.json();
      
      if (data.error) throw new Error(data.error);
      
      // Filter only for pending submissions
      const pending = (data || []).filter(p => p.status === 'pending');
      setProducts(pending);

      // 🎯 AUTO-INSPECT DEEP LINK
      if (inspectId) {
        const target = pending.find(p => p.id === inspectId);
        if (target) {
          setInspectModal({ isOpen: true, item: target, isRejecting: false, reason: '' });
        }
      }
    } catch (err) {
      console.error('Audit Fetch Error:', err);
      toast.error('Failed to load pending submissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingProducts();
  }, [inspectId]);

  // 🛡️ SOVEREIGN GOVERNANCE COMMAND
  const handleGovernance = async (status, payload = {}) => {
    const toastId = toast.loading(`${status === 'approved' ? 'Certifying' : 'Returning'} product...`);
    const isApprove = status === 'approved';
    
    try {
      // 🏺 CONSTRUCT SOVEREIGN PAYLOAD
      const updateData = { 
        status,
        is_approved: isApprove,
        rejection_reason: isApprove ? null : inspectModal.reason
      };
      
      // Integrate Master Edits (Sovereign Fixes)
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

      const { error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', inspectModal.item.id);

      if (error) throw error;

      toast.success(`Product ${isApprove ? 'Certified' : 'Returned'} Successfully`, { id: toastId });
      setInspectModal({ isOpen: false, item: null, isRejecting: false, reason: '' });
      fetchPendingProducts();
    } catch (err) {
      console.error('Governance Error:', err);
      toast.error('Governance Protocol Failure', { id: toastId });
    }
  };

  const filtered = products.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sellers?.shop_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* 🏛️ AUDIT HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div>
            <div className="flex items-center gap-3 mb-2">
               <h1 className="text-3xl font-black tracking-tighter uppercase text-[#1B4332]">Sovereign Audit Room</h1>
               <div className="px-3 py-1 bg-[#BC6C25]/10 border border-[#BC6C25]/20 rounded-lg flex items-center gap-2">
                  <Clock size={12} className="text-[#BC6C25]" />
                  <span className="text-[10px] font-black text-[#BC6C25] uppercase tracking-widest">{products.length} Pending</span>
               </div>
            </div>
            <p className="text-sm font-medium text-[#1B4332]/40 italic">Dedicated high-focus workspace for Super Admin curation.</p>
         </div>

         <div className="flex items-center gap-4">
            <div className="relative group">
               <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1B4332]/20 group-focus-within:text-[#BC6C25] transition-colors" />
               <input 
                 type="text" 
                 placeholder="Search submissions..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="bg-white border border-[#1B4332]/5 rounded-2xl pl-10 pr-6 py-3 text-xs font-bold w-64 focus:border-[#BC6C25]/40 focus:outline-none transition-all shadow-sm"
               />
            </div>
            <button className="p-3 bg-white border border-[#1B4332]/5 rounded-2xl text-[#1B4332]/40 hover:text-[#BC6C25] transition-all shadow-sm">
               <Filter size={18} />
            </button>
         </div>
      </div>

      {/* 📜 SUBMISSION VAULT TABLE */}
      <div className="bg-white rounded-[2.5rem] border border-[#1B4332]/5 shadow-xl overflow-hidden min-h-[400px]">
         {loading ? (
           <div className="flex flex-col items-center justify-center h-[400px] gap-4">
              <Loader2 className="animate-spin text-[#BC6C25]" size={32} />
              <p className="text-[10px] font-black text-[#1B4332]/20 uppercase tracking-[0.4em]">Syncing Audit Vault...</p>
           </div>
         ) : filtered.length > 0 ? (
           <div className="overflow-x-auto no-scrollbar">
              <table className="w-full border-collapse">
                 <thead>
                    <tr className="bg-[#FDFBF7] border-b border-[#1B4332]/5">
                       <th className="px-8 py-5 text-left text-[9px] font-black text-[#1B4332]/30 uppercase tracking-[0.2em]">Product Identity</th>
                       <th className="px-8 py-5 text-left text-[9px] font-black text-[#1B4332]/30 uppercase tracking-[0.2em]">Measure</th>
                       <th className="px-8 py-5 text-left text-[9px] font-black text-[#1B4332]/30 uppercase tracking-[0.2em]">Valuation</th>
                       <th className="px-8 py-5 text-left text-[9px] font-black text-[#1B4332]/30 uppercase tracking-[0.2em]">Artisan Source</th>
                       <th className="px-8 py-5 text-right text-[9px] font-black text-[#1B4332]/30 uppercase tracking-[0.2em]">Governance</th>
                    </tr>
                 </thead>
                 <tbody>
                    {filtered.map((p) => (
                      <motion.tr 
                        key={p.id} 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        className="border-b border-[#1B4332]/[0.03] hover:bg-[#FDFBF7]/50 transition-colors group"
                      >
                         <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                               <div className="w-14 h-14 rounded-xl overflow-hidden border border-[#1B4332]/5 shadow-sm group-hover:scale-105 transition-transform duration-500">
                                  <img src={p.images?.[0]} className="w-full h-full object-cover" alt="Audit" />
                               </div>
                               <div>
                                  <p className="text-[8px] font-black text-[#BC6C25] uppercase tracking-widest mb-1">{p.category}</p>
                                  <p className="text-[13px] font-black text-[#1B4332] uppercase tracking-tighter">{p.title}</p>
                               </div>
                            </div>
                         </td>
                         <td className="px-8 py-6">
                            <p className="text-sm font-black text-[#1B4332] uppercase">{p.weight}{p.unit || 'g'}</p>
                            <p className="text-[9px] font-bold text-[#1B4332]/20 uppercase tracking-widest mt-1">Weight</p>
                         </td>
                         <td className="px-8 py-6">
                            <p className="text-sm font-black text-[#1B4332]">₹{p.price}</p>
                            <p className="text-[9px] font-bold text-[#BC6C25] uppercase tracking-widest mt-1">Price</p>
                         </td>
                         <td className="px-8 py-6">
                            <p className="text-[12px] font-black text-[#1B4332] uppercase leading-none">{p.sellers?.shop_name || 'Individual'}</p>
                            <p className="text-[9px] font-bold text-[#1B4332]/30 uppercase tracking-widest mt-1">{p.sellers?.profiles?.full_name}</p>
                         </td>
                         <td className="px-8 py-6 text-right">
                            <button 
                              onClick={() => setInspectModal({ isOpen: true, item: p, isRejecting: false, reason: '' })}
                              className="px-6 py-2.5 bg-[#1B4332] text-white text-[9px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-[#1B4332]/10 hover:bg-[#BC6C25] hover:-translate-y-0.5 active:translate-y-0 transition-all"
                            >
                               Start Audit
                            </button>
                         </td>
                      </motion.tr>
                    ))}
                 </tbody>
              </table>
           </div>
         ) : (
           <div className="flex flex-col items-center justify-center h-[400px] gap-6 p-12 text-center">
              <div className="w-20 h-20 bg-[#1B4332]/5 rounded-full flex items-center justify-center text-[#1B4332]/20">
                 <ShieldCheck size={40} />
              </div>
              <div>
                 <h3 className="text-xl font-black text-[#1B4332] uppercase tracking-tighter">Vault is Empty</h3>
                 <p className="text-[10px] font-bold text-[#1B4332]/20 uppercase tracking-[0.3em] mt-2">All submissions have been certified.</p>
              </div>
           </div>
         )}
      </div>

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

export default function SovereignAuditPage() {
  return (
    <Suspense fallback={<div className="flex flex-col items-center justify-center h-[400px] gap-4"><Loader2 className="animate-spin text-[#BC6C25]" size={32} /></div>}>
      <SovereignAuditContent />
    </Suspense>
  );
}
