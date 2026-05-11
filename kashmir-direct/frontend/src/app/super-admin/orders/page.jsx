'use client';

import { useState, useEffect, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, Search, Filter, ShoppingCart, Eye, Package, ArrowUpRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { ForgeTable } from '@/components/admin/shared/ForgeComponents';
import SovereignPagination from '@/components/admin/SovereignPagination';

function OrderRegistryContent() {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // 🛰️ GLOBAL SYNC LISTENER (Connected to Header Refresh)
  useEffect(() => {
    const handleGlobalSync = () => {
      fetchOrders();
    };
    window.addEventListener('platform-sync', handleGlobalSync);
    return () => window.removeEventListener('platform-sync', handleGlobalSync);
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/data?type=orders&page=${page}&pageSize=${pageSize}`);
      const result = await response.json();
      
      if (result.error) throw new Error(result.error);
      
      setOrders(result.data || []);
      setTotal(result.total || 0);
    } catch (err) {
      console.error('Order Fetch Error:', err);
      toast.error('Failed to sync order vault');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, pageSize]);

  const columns = [
    { label: 'Order Identity', align: 'left' },
    { label: 'Customer Detail', align: 'left' },
    { label: 'Financial Volume', align: 'left' },
    { label: 'Logistic Status', align: 'left' },
    { label: 'Governance', align: 'right' }
  ];

  const renderRow = (o) => (
    <>
      <td className="px-8 py-6">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1B4332]/5 flex items-center justify-center text-[#1B4332]/40 border border-[#1B4332]/5">
               <Package size={16} />
            </div>
            <div>
               <p className="text-[13px] font-black text-[#1B4332] uppercase tracking-tighter">{o.id.substring(0, 8)}</p>
               <p className="text-[9px] font-bold text-[#1B4332]/20 uppercase tracking-widest mt-1">{new Date(o.created_at).toLocaleDateString()}</p>
            </div>
         </div>
      </td>
      <td className="px-8 py-6">
         <p className="text-[12px] font-black text-[#1B4332] uppercase leading-none">{o.profiles?.full_name || 'Guest User'}</p>
         <p className="text-[9px] font-bold text-[#1B4332]/30 uppercase tracking-widest mt-1">{o.profiles?.email}</p>
      </td>
      <td className="px-8 py-6">
         <p className="text-sm font-black text-[#1B4332]">₹{o.total_amount?.toLocaleString() || '0'}</p>
         <p className="text-[9px] font-bold text-[#BC6C25] uppercase tracking-widest mt-1">Transaction Total</p>
      </td>
      <td className="px-8 py-6">
         <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border ${
            o.status === 'delivered' ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-600' :
            o.status === 'shipped' ? 'bg-blue-500/5 border-blue-500/10 text-blue-600' :
            'bg-amber-500/5 border-amber-500/10 text-amber-600'
         }`}>
            <div className={`w-1.5 h-1.5 rounded-full ${
               o.status === 'delivered' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' :
               o.status === 'shipped' ? 'bg-blue-500 shadow-[0_0_8px_#3b82f6]' :
               'bg-amber-500 shadow-[0_0_8px_#f59e0b]'
            }`} />
            <span className="text-[8px] font-black uppercase tracking-widest">{o.status}</span>
         </div>
      </td>
      <td className="px-8 py-6 text-right">
         <button className="px-6 py-2.5 bg-[#1B4332] text-white text-[9px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-[#1B4332]/10 hover:bg-[#BC6C25] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 mx-auto md:ml-auto md:mr-0">
            View Details
            <ArrowUpRight size={14} />
         </button>
      </td>
    </>
  );

  return (
    <div className="space-y-8">
      <ForgeTable 
         columns={columns}
         data={orders}
         loading={loading}
         emptyMessage="No Orders Found"
         renderRow={renderRow}
         icon={ShoppingCart}
         header={
           <div className="flex items-center justify-between px-6 py-3 bg-[#FDFBF7]/50 border-b border-[#1B4332]/5">
              {/* 🔍 COMPACT SEARCH */}
              <div className="relative group">
                 <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1B4332]/40 group-focus-within:text-[#BC6C25] transition-colors" />
                 <input 
                   type="text"
                   placeholder="Search orders..."
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
    </div>
  );
}

export default function OrderRegistryPage() {
  return (
    <Suspense fallback={<div className="flex flex-col items-center justify-center h-[400px] gap-4"><Loader2 className="animate-spin text-[#BC6C25]" size={32} /></div>}>
      <OrderRegistryContent />
    </Suspense>
  );
}
