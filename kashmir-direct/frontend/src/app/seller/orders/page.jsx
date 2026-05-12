'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Filter, Download, ChevronRight, 
  Clock, CheckCircle2, Truck, AlertCircle,
  MoreVertical, ExternalLink, Calendar, ShoppingCart,
  ArrowLeft, Package, User, MapPin, CreditCard, ShieldCheck,
  Eye, Phone
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import DataTable from '@/components/ui/DataTable';
import { useRouter } from 'next/navigation';

export default function SellerOrdersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (user) {
      fetchSellerOrders();
    }
  }, [user, currentPage, pageSize]);

  const fetchSellerOrders = async () => {
    try {
      setLoading(true);
      // Fetch orders that are NOT approved (those are in inbound)
      // and NOT pending (those are in inbound/admin review)
      // Usually sellers see 'processing', 'shipped', 'delivered'
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .in('status', ['processing', 'shipped', 'delivered', 'cancelled', 'rejected_by_seller'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error('Error fetching seller orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      header: 'Shipment Node',
      accessor: 'id',
      render: (row) => (
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#BC6C25]/10 flex items-center justify-center text-[#BC6C25]">
            <Package size={18} />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-black text-[#1B4332] tracking-tighter uppercase">#{row.id.slice(-8).toUpperCase()}</span>
            <span className="text-[9px] font-medium text-[#1B4332]/40 italic">{new Date(row.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Destination',
      accessor: 'shipping_address',
      render: (row) => (
        <div className="max-w-[200px]">
          <p className="text-[10px] font-bold text-[#1B4332] truncate uppercase tracking-tight">{row.shipping_address}</p>
          <div className="flex items-center gap-1.5 mt-1">
             <Phone size={10} className="text-[#1B4332]/20" />
             <span className="text-[9px] font-medium text-[#1B4332]/40">{row.contact_phones?.split(',')[0]}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Valuation',
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
      render: (row) => {
        const status = row.status.toLowerCase();
        const themes = {
          'processing': 'bg-amber-500/10 border-amber-500/20 text-amber-600',
          'shipped': 'bg-blue-500/10 border-blue-500/20 text-blue-600',
          'delivered': 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600',
          'cancelled': 'bg-rose-500/10 border-rose-500/20 text-rose-600',
          'rejected_by_seller': 'bg-rose-500/10 border-rose-500/20 text-rose-600'
        };
        const theme = themes[status] || 'bg-slate-500/10 border-slate-500/20 text-slate-600';
        return (
          <div className={`px-3 py-1 rounded-full ${theme} border flex items-center gap-1.5 w-fit`}>
            <div className="w-1 h-1 rounded-full bg-current animate-pulse" />
            <span className="text-[8px] font-black uppercase tracking-widest">{row.status}</span>
          </div>
        );
      }
    }
  ];

  const actions = [
    {
      icon: Eye,
      label: 'Inspect',
      onClick: (row) => router.push(`/seller/orders/${row.id}`)
    }
  ];

  return (
    <div className="space-y-10">
      {/* 🏺 HEADER */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-[#BC6C25] rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1B4332]/40">Active Logistics</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-[#1B4332] tracking-tighter leading-none uppercase italic">
            Order <span className="text-[#BC6C25] font-serif font-normal lowercase">Registry</span>
          </h1>
          <p className="text-[11px] font-black text-[#1B4332]/30 uppercase tracking-[0.4em]">Sovereign Administrative Workspace</p>
        </div>

        <div className="flex items-center gap-4">
           <button className="h-14 px-8 bg-white border border-[#1B4332]/10 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest text-[#1B4332] hover:bg-[#FDFBF7] transition-all">
             <Download size={16} className="text-[#BC6C25]" /> Export
           </button>
        </div>
      </header>

      {/* 📜 DATATABLE */}
      <div className="h-[calc(100vh-320px)] min-h-[600px]">
        <DataTable 
          title="Active Shipments"
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
    </div>
  );
}
