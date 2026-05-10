'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Download, ChevronRight, 
  Clock, CheckCircle2, Truck, AlertCircle,
  MoreVertical, ExternalLink, Calendar, ShoppingCart,
  ArrowLeft, Package, User, MapPin, CreditCard, ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import Logo from '@/components/ui/Logo';

// 📦 MASTER MOCK DATA
const MOCK_ORDERS = [
  { id: 'ORD-8821', customer: 'Hamid Zargar', date: 'May 10, 2024', amount: '₹12,450', status: 'Processing', items: 3, method: 'Prepaid', address: 'Srinagar, J&K' },
  { id: 'ORD-8820', customer: 'Sarah Khan', date: 'May 09, 2024', amount: '₹8,900', status: 'Shipped', items: 1, method: 'COD', address: 'Jammu, J&K' },
  { id: 'ORD-8819', customer: 'Rajesh Gupta', date: 'May 09, 2024', amount: '₹24,000', status: 'Delivered', items: 5, method: 'Prepaid', address: 'Delhi, IN' },
];

const STATUS_THEMES = {
  'Processing': { bg: 'bg-amber-500/10', text: 'text-amber-600', dot: 'bg-amber-500' },
  'Shipped': { bg: 'bg-blue-500/10', text: 'text-blue-600', dot: 'bg-blue-500' },
  'Delivered': { bg: 'bg-emerald-500/10', text: 'text-emerald-600', dot: 'bg-emerald-500' },
  'Pending': { bg: 'bg-slate-500/10', text: 'text-slate-600', dot: 'bg-slate-500' },
};

export default function SellerOrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-[#FDFBF7] selection:bg-[#BC6C25]/10 font-['Outfit',_sans-serif]">
      {/* 🏺 PREMIUM FLOATING HEADER */}
      <header className="sticky top-0 z-50 bg-white/60 backdrop-blur-3xl border-b border-[#1B4332]/5 px-6 lg:px-12 h-20 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="p-2.5 bg-[#1B4332]/5 rounded-xl text-[#1B4332]/40 hover:bg-[#BC6C25] hover:text-white transition-all active:scale-90">
            <ArrowLeft size={18} />
          </Link>
          <Logo className="h-8 hidden sm:block" />
          <div className="h-8 w-px bg-[#1B4332]/5 hidden lg:block" />
          <div className="hidden lg:flex items-center gap-2 px-4 py-1.5 bg-[#1B4332]/5 rounded-full border border-[#1B4332]/5">
            <div className="w-1.5 h-1.5 bg-[#BC6C25] rounded-full animate-pulse" />
            <h2 className="text-[10px] font-black tracking-widest uppercase text-[#1B4332]/60">Seller Order Node</h2>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col text-right">
            <p className="text-[11px] font-black text-[#1B4332] leading-none tracking-tight">Kashmir Direct</p>
            <p className="text-[9px] font-medium text-[#BC6C25] uppercase tracking-widest mt-1">Registry Command</p>
          </div>
          <div className="w-10 h-10 bg-[#1B4332] rounded-xl flex items-center justify-center text-white shadow-xl">
            <ShieldCheck size={18} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 lg:p-12 space-y-12">
        {/* 📑 TITLES */}
        <div className="space-y-2">
          <h1 className="text-4xl lg:text-5xl font-black text-[#1B4332] tracking-tighter leading-none">Order <span className="text-[#BC6C25] font-serif italic font-normal lowercase">Management</span></h1>
          <p className="text-[11px] font-black text-[#1B4332]/30 uppercase tracking-[0.4em]">Sovereign Administrative Workspace</p>
        </div>

        {/* 🔍 SEARCH GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8 relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#1B4332]/20" size={20} />
            <input 
              type="text" 
              placeholder="Filter by Order ID, Customer Name, or Logistics ID..."
              className="w-full h-16 pl-14 pr-6 bg-white border border-[#1B4332]/10 rounded-[1.5rem] text-sm focus:ring-4 focus:ring-[#BC6C25]/10 focus:border-[#BC6C25]/30 placeholder:text-[#1B4332]/20 transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="lg:col-span-2 h-16 bg-white border border-[#1B4332]/10 rounded-[1.5rem] flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-widest text-[#1B4332] hover:bg-[#FDFBF7] transition-all">
            <Filter size={18} className="text-[#BC6C25]" /> Filters
          </button>
          <button className="lg:col-span-2 h-16 bg-[#BC6C25] text-white rounded-[1.5rem] flex items-center justify-center text-[11px] font-black uppercase tracking-widest shadow-xl shadow-[#BC6C25]/20 hover:opacity-90 transition-all">
            Export
          </button>
        </div>

        {/* 📜 CARDS VIEW FOR MOBILE / TABLE FOR DESKTOP */}
        <div className="space-y-6">
          <AnimatePresence>
            {MOCK_ORDERS.map((order, i) => {
              const theme = STATUS_THEMES[order.status] || STATUS_THEMES['Pending'];
              
              return (
                <motion.div 
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white border border-[#1B4332]/5 rounded-[2.5rem] p-6 lg:p-8 hover:shadow-[0_20px_50px_rgba(27,67,50,0.05)] transition-all group overflow-hidden relative"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#BC6C25]/5 to-transparent rounded-full -mr-10 -mt-10 blur-2xl" />
                  
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-[1.5rem] bg-[#1B4332]/5 flex items-center justify-center text-[#1B4332] group-hover:bg-[#BC6C25] group-hover:text-white transition-all duration-500 shadow-inner">
                        <ShoppingCart size={24} />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-[10px] font-black text-[#BC6C25] uppercase tracking-widest bg-[#BC6C25]/5 px-2 py-0.5 rounded-full border border-[#BC6C25]/10">{order.id}</span>
                          <span className="text-[10px] font-medium text-[#1B4332]/40 italic">{order.date}</span>
                        </div>
                        <h3 className="text-xl font-black text-[#1B4332] tracking-tight">{order.customer}</h3>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 lg:flex items-center gap-6 lg:gap-12">
                      <div className="space-y-1">
                        <p className="text-[9px] font-black uppercase tracking-widest text-[#1B4332]/20 flex items-center gap-1.5"><MapPin size={10} /> Destination</p>
                        <p className="text-xs font-bold text-[#1B4332]">{order.address}</p>
                      </div>
                      <div className="space-y-1 text-right lg:text-left">
                        <p className="text-[9px] font-black uppercase tracking-widest text-[#1B4332]/20 flex items-center gap-1.5 lg:justify-start justify-end"><CreditCard size={10} /> Payment</p>
                        <p className="text-xs font-bold text-[#BC6C25]">{order.amount} <span className="text-[9px] text-[#1B4332]/30 uppercase">({order.method})</span></p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between lg:justify-end gap-4 border-t lg:border-t-0 border-[#1B4332]/5 pt-6 lg:pt-0">
                      <div className={`px-4 py-2 rounded-full ${theme.bg} ${theme.text} border border-white flex items-center gap-2 shadow-sm`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${theme.dot} animate-pulse`} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{order.status}</span>
                      </div>
                      <button className="w-12 h-12 rounded-2xl bg-[#1B4332] text-white flex items-center justify-center hover:bg-[#BC6C25] shadow-xl transition-all active:scale-90">
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </main>

      {/* 🏺 SUBTLE FOOTER */}
      <footer className="text-center p-12 opacity-20 select-none">
        <Logo className="h-6 mx-auto grayscale" />
        <p className="text-[9px] font-black uppercase tracking-[0.5em] mt-4">Kashmir Direct Order Control</p>
      </footer>
    </div>
  );
}
