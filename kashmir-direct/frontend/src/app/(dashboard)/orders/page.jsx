'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Filter, Download, ChevronRight, 
  Clock, CheckCircle2, Truck, AlertCircle,
  MoreVertical, ExternalLink, Calendar, ShoppingCart
} from 'lucide-react';

// 📦 HIGH-FIDELITY MOCK DATA
const MOCK_ORDERS = [
  { id: 'ORD-8821', customer: 'Hamid Zargar', date: 'May 10, 2024', amount: '₹12,450', status: 'Processing', items: 3, method: 'Prepaid' },
  { id: 'ORD-8820', customer: 'Sarah Khan', date: 'May 09, 2024', amount: '₹8,900', status: 'Shipped', items: 1, method: 'COD' },
  { id: 'ORD-8819', customer: 'Rajesh Gupta', date: 'May 09, 2024', amount: '₹24,000', status: 'Delivered', items: 5, method: 'Prepaid' },
  { id: 'ORD-8818', customer: 'Ayesha Malik', date: 'May 08, 2024', amount: '₹1,200', status: 'Pending', items: 1, method: 'COD' },
  { id: 'ORD-8817', customer: 'Vikram Singh', date: 'May 08, 2024', amount: '₹15,600', status: 'Processing', items: 2, method: 'Prepaid' },
];

const STATUS_THEMES = {
  'Processing': { bg: 'bg-amber-500/10', text: 'text-amber-600', dot: 'bg-amber-500', icon: Clock },
  'Shipped': { bg: 'bg-blue-500/10', text: 'text-blue-600', dot: 'bg-blue-500', icon: Truck },
  'Delivered': { bg: 'bg-emerald-500/10', text: 'text-emerald-600', dot: 'bg-emerald-500', icon: CheckCircle2 },
  'Pending': { bg: 'bg-slate-500/10', text: 'text-slate-600', dot: 'bg-slate-500', icon: Clock },
  'Cancelled': { bg: 'bg-rose-500/10', text: 'text-rose-600', dot: 'bg-rose-500', icon: AlertCircle },
};

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-8 pb-20">
      {/* 🏺 HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-[#1B4332] uppercase tracking-tight">Order Registry</h1>
          <p className="text-[12px] font-medium text-[#1B4332]/40 italic">Monitoring the pulse of your artisan commerce.</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="h-11 px-5 bg-white border border-[#1B4332]/10 rounded-xl text-[11px] font-black uppercase tracking-widest text-[#1B4332]/60 hover:text-[#1B4332] transition-all flex items-center gap-2">
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* 📊 QUICK STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Today Orders', val: '12', sub: '+2 from yesterday', color: '#BC6C25' },
          { label: 'Processing', val: '08', sub: 'Urgent attention', color: '#F59E0B' },
          { label: 'Revenue', val: '₹42.8k', sub: 'Month to date', color: '#10B981' },
          { label: 'Completed', val: '142', sub: 'Total success', color: '#1B4332' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-[#1B4332]/5 shadow-sm">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#1B4332]/30 mb-2">{stat.label}</p>
            <p className="text-xl font-black text-[#1B4332]" style={{ color: stat.color }}>{stat.val}</p>
            <p className="text-[9px] font-medium text-[#1B4332]/40 italic mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* 🔍 SEARCH & FILTERS */}
      <div className="bg-white border border-[#1B4332]/10 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1B4332]/20" size={18} />
          <input 
            type="text" 
            placeholder="Search by Order ID, Customer, or Phone..."
            className="w-full h-12 pl-12 pr-4 bg-[#FDFBF7] border-none rounded-xl text-sm focus:ring-2 focus:ring-[#BC6C25]/20 placeholder:text-[#1B4332]/20 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none h-12 px-6 bg-[#FDFBF7] rounded-xl flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest text-[#1B4332]/40 hover:text-[#BC6C25] transition-all border border-[#1B4332]/5">
            <Filter size={16} /> Filters
          </button>
          <button className="flex-1 md:flex-none h-12 px-6 bg-[#1B4332] rounded-xl flex items-center justify-center text-white text-[11px] font-black uppercase tracking-widest shadow-lg">
            Search
          </button>
        </div>
      </div>

      {/* 📜 ORDERS TABLE */}
      <div className="bg-white border border-[#1B4332]/10 rounded-[2.5rem] shadow-xl overflow-hidden overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-[#1B4332]/5">
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#1B4332]/40">Identifier</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#1B4332]/40">Customer Node</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#1B4332]/40">Registry Date</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#1B4332]/40">Total Value</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#1B4332]/40">Current Status</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#1B4332]/40">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1B4332]/5">
            {MOCK_ORDERS.map((order) => {
              const theme = STATUS_THEMES[order.status] || STATUS_THEMES['Pending'];
              const StatusIcon = theme.icon;
              
              return (
                <motion.tr 
                  key={order.id} 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="group hover:bg-[#FDFBF7] transition-all cursor-pointer"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#1B4332]/5 flex items-center justify-center text-[#1B4332]"><ShoppingCart size={14} /></div>
                      <span className="text-xs font-black text-[#1B4332] tracking-tighter">{order.id}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#1B4332]">{order.customer}</span>
                      <span className="text-[9px] font-medium text-[#1B4332]/40 uppercase tracking-widest">{order.items} Products</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-[11px] font-medium text-[#1B4332]/60">
                      <Calendar size={12} className="text-[#1B4332]/20" />
                      {order.date}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-[#BC6C25]">{order.amount}</span>
                      <span className="text-[9px] font-bold text-[#1B4332]/20 uppercase">{order.method}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${theme.bg} ${theme.text} border border-white/50 shadow-sm`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${theme.dot} animate-pulse`} />
                      <span className="text-[9px] font-black uppercase tracking-widest">{order.status}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <button className="w-9 h-9 rounded-xl bg-[#FDFBF7] border border-[#1B4332]/5 flex items-center justify-center text-[#1B4332]/30 hover:text-[#BC6C25] hover:border-[#BC6C25]/20 transition-all shadow-sm">
                        <ExternalLink size={14} />
                      </button>
                      <button className="w-9 h-9 rounded-xl bg-[#FDFBF7] border border-[#1B4332]/5 flex items-center justify-center text-[#1B4332]/30 hover:bg-[#1B4332] hover:text-white transition-all shadow-sm">
                        <MoreVertical size={14} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>

        {MOCK_ORDERS.length === 0 && (
          <div className="p-20 text-center space-y-4">
            <div className="w-16 h-16 bg-[#1B4332]/5 rounded-3xl flex items-center justify-center mx-auto text-[#1B4332]/20">
              <ShoppingCart size={32} />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-black text-[#1B4332] uppercase">No Orders Found</p>
              <p className="text-xs text-[#1B4332]/40 italic">Your order registry is currently empty.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
