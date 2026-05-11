'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Package, Clock, CheckCircle2, Truck, 
  AlertCircle, ArrowLeft, Calendar, ShoppingBag,
  Sparkles, ExternalLink, ChevronRight
} from 'lucide-react';
import Link from 'next/link';

// 📦 MOCK BUYER ORDERS
const MOCK_ORDERS = [
  { id: 'ORD-8821', date: 'May 10, 2024', amount: '₹12,450', status: 'Processing', items: 3, items_list: 'Pashmina Shawl, Saffron (1g), Walnut (1kg)' },
  { id: 'ORD-8820', date: 'May 09, 2024', amount: '₹8,900', status: 'Shipped', items: 1, items_list: 'Hand-woven Silk Scarf' },
  { id: 'ORD-8819', date: 'May 08, 2024', amount: '₹24,000', status: 'Delivered', items: 2, items_list: 'Heritage Copper Samovar, Honey (5kg)' },
];

const STATUS_THEMES = {
  'Processing': { bg: 'bg-amber-500/10', text: 'text-amber-600', dot: 'bg-amber-500', icon: Clock },
  'Shipped': { bg: 'bg-blue-500/10', text: 'text-blue-600', dot: 'bg-blue-500', icon: Truck },
  'Delivered': { bg: 'bg-emerald-500/10', text: 'text-emerald-600', dot: 'bg-emerald-500', icon: CheckCircle2 },
  'Pending': { bg: 'bg-slate-500/10', text: 'text-slate-600', dot: 'bg-slate-500', icon: Clock },
  'Cancelled': { bg: 'bg-rose-500/10', text: 'text-rose-600', dot: 'bg-rose-500', icon: AlertCircle },
};

export default function BuyerOrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-4 sm:pt-6 pb-20">
      <div className="max-w-7xl mx-auto px-[clamp(1rem,5vw,2.5rem)] relative z-10">
        
        {/* 🏛️ HEADER */}
        <header className="mb-8 space-y-6">
           <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="space-y-4">
                 <motion.div
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-[#1B4332]/10 bg-white/50 backdrop-blur-md"
                 >
                    <Package size={12} className="text-[#BC6C25]" />
                    <span className="text-[9px] font-black tracking-[0.4em] uppercase text-[#1B4332]/40">
                      Purchase History
                    </span>
                 </motion.div>

                 <div className="space-y-2">
                    <h1 className="text-4xl sm:text-5xl font-black text-[#1B4332] tracking-tighter leading-none">
                       My <span className="text-[#BC6C25] font-serif italic font-normal">Orders</span>
                    </h1>
                    <p className="text-sm text-[#1B4332]/50 font-medium max-w-md">
                       Track your authenticated treasures from the valley to your doorstep.
                    </p>
                 </div>
              </div>

              <div className="flex flex-col items-end gap-6">
                 <Link href="/buyer/products">
                    <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#1B4332] hover:text-[#BC6C25] transition-colors group">
                       <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                       Back to Shop
                    </button>
                 </Link>

                 {/* 🔍 SEARCH MOVED UP */}
                 <div className="w-full md:w-[320px]">
                    <div className="relative group">
                       <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1B4332]/10 group-focus-within:text-[#BC6C25] transition-all" size={16} />
                       <input 
                         type="text" 
                         placeholder="Search ID or Item..."
                         className="w-full h-11 pl-11 pr-4 bg-white border border-[#1B4332]/5 rounded-xl text-[11px] font-bold text-[#1B4332] shadow-sm focus:outline-none focus:ring-4 focus:ring-[#BC6C25]/5 focus:border-[#BC6C25]/30 transition-all placeholder:text-[#1B4332]/20"
                         value={searchTerm}
                         onChange={(e) => setSearchTerm(e.target.value)}
                       />
                    </div>
                 </div>
              </div>
           </div>
        </header>

        {/* 📜 ORDERS LIST */}
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {MOCK_ORDERS.length > 0 ? (
              MOCK_ORDERS.map((order, i) => {
                const theme = STATUS_THEMES[order.status] || STATUS_THEMES['Pending'];
                const StatusIcon = theme.icon;
                
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="group bg-white rounded-[2rem] p-6 sm:p-8 border border-[#1B4332]/5 shadow-[0_15px_40px_-15px_rgba(27,67,50,0.05)] hover:shadow-[0_25px_50px_-10px_rgba(27,67,50,0.1)] transition-all duration-500"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                       {/* Order Info */}
                       <div className="flex items-start gap-6">
                          <div className="w-14 h-14 rounded-2xl bg-[#1B4332]/5 flex items-center justify-center text-[#1B4332] shrink-0">
                             <ShoppingBag size={24} />
                          </div>
                          <div className="space-y-1">
                             <div className="flex items-center gap-3">
                                <span className="text-sm font-black text-[#1B4332] tracking-tighter uppercase">{order.id}</span>
                                <div className={`px-3 py-1 rounded-full ${theme.bg} ${theme.text} flex items-center gap-1.5`}>
                                   <div className={`w-1 h-1 rounded-full ${theme.dot} animate-pulse`} />
                                   <span className="text-[8px] font-black uppercase tracking-widest">{order.status}</span>
                                </div>
                             </div>
                             <p className="text-[11px] font-bold text-[#1B4332]/40 uppercase tracking-widest flex items-center gap-2">
                                <Calendar size={12} /> {order.date}
                             </p>
                             <p className="text-xs font-medium text-[#1B4332]/60 mt-2 italic">
                                {order.items_list}
                             </p>
                          </div>
                       </div>

                       {/* Summary & Action */}
                       <div className="flex items-center justify-between lg:justify-end gap-12 border-t lg:border-t-0 pt-6 lg:pt-0 border-[#1B4332]/5">
                          <div className="text-left lg:text-right">
                             <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#1B4332]/20 mb-1">Total Amount</p>
                             <p className="text-xl font-black text-[#1B4332]">{order.amount}</p>
                             <p className="text-[9px] font-bold text-[#BC6C25] uppercase tracking-widest mt-1">{order.items} Items</p>
                          </div>
                          <button className="h-14 px-8 rounded-2xl bg-[#1B4332] text-white flex items-center gap-3 font-black text-[10px] uppercase tracking-widest hover:bg-[#BC6C25] transition-all shadow-xl shadow-[#1B4332]/10 group">
                             Track Order
                             <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                          </button>
                       </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-32 space-y-6 bg-white/50 backdrop-blur-md rounded-[3rem] border border-dashed border-[#1B4332]/10"
              >
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-xl">
                   <Package size={32} className="text-[#1B4332]/10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-[#1B4332]">No Orders Yet</h3>
                  <p className="text-[#1B4332]/40 text-sm font-medium uppercase tracking-widest">Your registry will appear here after your first purchase.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
