'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, ShoppingCart, Clock, CheckCircle2, XCircle,
  ChevronRight, ArrowLeft, Loader2, MapPin, Phone,
  CreditCard, ShieldCheck, AlertCircle, ShoppingBag,
  Eye, Check, X
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';
import DataTable from '@/components/ui/DataTable';
import Modal from '@/components/ui/Modal';

export default function InboundOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 🛑 REJECTION MODAL STATE
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [orderToReject, setOrderToReject] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);

  useEffect(() => {
    if (user) {
      fetchInboundOrders();
    }
  }, [user]);

  const fetchInboundOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error('Error fetching inbound orders:', err);
      toast.error('Failed to load inbound requests');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (order) => {
    setProcessingId(order.id);
    const loadingToast = toast.loading('Accepting order...');

    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'processing' })
        .eq('id', order.id);

      if (error) throw error;

      toast.success('Order Accepted', { id: loadingToast });
      fetchInboundOrders(); 
    } catch (err) {
      console.error('Accept error:', err);
      toast.error('Failed to accept order', { id: loadingToast });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) return toast.error('Please provide a reason');
    
    setIsRejecting(true);
    const loadingToast = toast.loading('Processing rejection...');

    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: 'rejected_by_seller',
          rejection_reason: rejectionReason
        })
        .eq('id', orderToReject.id);

      if (error) throw error;

      toast.success('Order Rejected', { id: loadingToast });
      setIsRejectModalOpen(false);
      setRejectionReason('');
      fetchInboundOrders();
    } catch (err) {
      console.error('Reject error:', err);
      toast.error('Failed to reject order', { id: loadingToast });
    } finally {
      setIsRejecting(false);
    }
  };

  // 🏛️ TABLE COLUMNS DEFINITION
  const columns = [
    {
      header: 'Request Node',
      accessor: 'id',
      render: (row) => (
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#1B4332]/5 flex items-center justify-center text-[#1B4332]">
            <ShoppingBag size={18} />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-black text-[#1B4332] tracking-tighter uppercase">#{row.id.slice(-8).toUpperCase()}</span>
            <span className="text-[9px] font-medium text-[#1B4332]/40 italic">{new Date(row.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Treasures',
      accessor: 'items',
      render: (row) => (
        <div className="max-w-[200px]">
          <p className="text-[11px] font-bold text-[#1B4332] truncate uppercase italic">
            {row.items?.map(item => item.title).join(', ')}
          </p>
          <p className="text-[9px] font-black text-[#BC6C25] uppercase tracking-widest mt-0.5">
            {row.items?.reduce((acc, item) => acc + item.quantity, 0)} Items
          </p>
        </div>
      )
    },
    {
      header: 'Destination',
      accessor: 'shipping_address',
      render: (row) => (
        <div className="flex items-center gap-2 max-w-[200px]">
          <MapPin size={12} className="text-[#1B4332]/20 shrink-0" />
          <p className="text-[10px] font-medium text-[#1B4332]/60 truncate uppercase tracking-tight">{row.shipping_address}</p>
        </div>
      )
    },
    {
      header: 'Value',
      accessor: 'total_amount',
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-[11px] font-black text-[#1B4332]">₹{row.total_amount}</span>
          <span className="text-[8px] font-bold text-[#BC6C25] uppercase tracking-widest">COD Protocol</span>
        </div>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <div className="px-3 py-1.5 rounded-full bg-[#BC6C25]/10 border border-[#BC6C25]/20 flex items-center gap-2 w-fit">
          <div className="w-1.5 h-1.5 rounded-full bg-[#BC6C25] animate-pulse" />
          <span className="text-[9px] font-black uppercase tracking-widest text-[#BC6C25]">{row.status}</span>
        </div>
      )
    }
  ];

  // 🛠️ ACTIONS DEFINITION
  const actions = [
    {
      icon: X,
      label: 'Reject',
      variant: 'danger',
      onClick: (row) => {
        setOrderToReject(row);
        setIsRejectModalOpen(true);
      }
    },
    {
      icon: Check,
      label: 'Accept',
      variant: 'primary',
      onClick: (row) => handleAccept(row)
    }
  ];

  return (
    <div className="space-y-10">
      {/* 🏺 HEADER */}
      <header className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#BC6C25]/10 border border-[#BC6C25]/20"
            >
              <ShoppingCart size={10} className="text-[#BC6C25]" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#BC6C25]">Registry Stream</span>
            </motion.div>
            <h1 className="text-4xl lg:text-5xl font-black text-[#1B4332] tracking-tighter leading-none uppercase italic">
              Inbound <span className="text-[#BC6C25] font-serif font-normal lowercase">Requests</span>
            </h1>
            <p className="text-[10px] font-bold text-[#1B4332]/30 uppercase tracking-[0.3em]">Approved by admin • Awaiting your fulfillment</p>
          </div>

          <div className="w-12 h-12 bg-white border border-[#1B4332]/10 rounded-2xl flex items-center justify-center text-[#1B4332] shadow-sm">
            <Package size={20} />
          </div>
        </div>
      </header>

      {/* 📜 DATATABLE */}
      <div className="h-[calc(100vh-320px)] min-h-[500px]">
        <DataTable 
          title="Fulfillment Registry"
          data={orders}
          columns={columns}
          actions={actions}
          isLoading={loading}
          totalCount={orders.length}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      </div>

      {/* 🛑 REJECTION MODAL */}
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        title="Order Relinquishment"
        maxWidth="max-w-md"
        action={
          <button 
            onClick={handleReject}
            disabled={isRejecting}
            className="h-10 px-8 bg-rose-500 text-white rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all disabled:opacity-50"
          >
            {isRejecting ? <Loader2 size={16} className="animate-spin" /> : <><span>Confirm Rejection</span><X size={16} /></>}
          </button>
        }
      >
        <div className="p-8 space-y-6">
           <div className="flex items-center gap-4 p-4 bg-rose-50/50 rounded-2xl border border-rose-100">
              <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center text-rose-500">
                 <AlertCircle size={20} />
              </div>
              <div>
                 <p className="text-[10px] font-black text-rose-500/40 uppercase tracking-widest">Rejecting Order</p>
                 <p className="text-sm font-black text-rose-600 uppercase">#{orderToReject?.id.substring(0, 8)}</p>
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-[#1B4332]/40 flex items-center gap-2">
                 Reason for Rejection
              </label>
              <textarea 
                placeholder="e.g. Out of stock, Quality issues, Logistic constraints..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                className="w-full bg-[#1B4332]/5 border-none rounded-2xl p-4 text-xs font-bold text-[#1B4332] outline-none ring-2 ring-transparent focus:ring-rose-500/30 transition-all placeholder:text-[#1B4332]/20 resize-none"
              />
           </div>

           <p className="text-[8px] font-bold text-[#1B4332]/40 uppercase tracking-widest leading-relaxed text-center">
              This action will notify the Super Admin and Buyer. Please be specific with your reason.
           </p>
        </div>
      </Modal>

      {/* 🛑 EMPTY STATE (Fallback) */}
      {!loading && orders.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 space-y-6 bg-white/30 backdrop-blur-md rounded-[3rem] border border-dashed border-[#1B4332]/10"
        >
          <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center mx-auto shadow-xl ring-4 ring-[#1B4332]/5">
            <AlertCircle size={32} className="text-[#1B4332]/10" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-black text-[#1B4332] uppercase italic">Registry is Quiet</h3>
            <p className="text-[9px] font-bold text-[#1B4332]/30 uppercase tracking-widest">No new inbound requests await fulfillment.</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
