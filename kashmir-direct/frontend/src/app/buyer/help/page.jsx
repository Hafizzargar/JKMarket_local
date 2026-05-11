'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LifeBuoy, MessageSquare, Plus, Search, 
  Clock, CheckCircle2, ChevronRight, HelpCircle,
  ShoppingBag, Send, AlertCircle, Sparkles
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

// 🎫 MOCK BUYER TICKETS (Sorted Newest First)
const MOCK_TICKETS = [
  { id: 'TK-1120', subject: 'Refund Request for Order #8820', status: 'In Progress', date: 'May 10, 2024', category: 'Returns', timestamp: 1715342400000 },
  { id: 'TK-1115', subject: 'Address Correction for Shipping', status: 'Resolved', date: 'May 08, 2024', category: 'Shipping', timestamp: 1715169600000 },
].sort((a, b) => b.timestamp - a.timestamp);

const STATUS_THEMES = {
  'In Progress': { bg: 'bg-amber-500/10', text: 'text-amber-600', dot: 'bg-amber-500' },
  'Resolved': { bg: 'bg-emerald-500/10', text: 'text-emerald-600', dot: 'bg-emerald-500' },
  'Closed': { bg: 'bg-slate-500/10', text: 'text-slate-600', dot: 'bg-slate-500' },
};

export default function BuyerHelpPage() {
  const { user } = useAuth();
  const [view, setView] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-2 sm:pt-4 pb-20">
      <div className="max-w-7xl mx-auto px-[clamp(1rem,5vw,2.5rem)] relative z-10">
        
        {/* 🏛️ STICKY HEADER CONCIERGE */}
        <header className="sticky top-0 bg-[#FDFBF7]/90 backdrop-blur-xl z-40 py-4 -mx-4 px-4 mb-8 border-b border-[#1B4332]/5">
           <div className="flex flex-col gap-4">
              <div className="space-y-1">
                 <div className="flex items-center gap-3">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#1B4332]/10 bg-white/50"
                    >
                       <LifeBuoy size={10} className="text-[#BC6C25]" />
                       <span className="text-[8px] font-black tracking-[0.4em] uppercase text-[#1B4332]/40">
                         Customer Concierge
                       </span>
                    </motion.div>
                 </div>

                 <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-3">
                    <h1 className="text-2xl sm:text-3xl font-black text-[#1B4332] tracking-tighter leading-none">
                       Help <span className="text-[#BC6C25] font-serif italic font-normal">& Concierge</span>
                    </h1>
                    <p className="text-[11px] text-[#1B4332]/40 font-medium italic">
                       Personalized Artisan Assistance
                    </p>
                 </div>
              </div>

              <div className="flex items-center gap-2">
                 <button 
                   onClick={() => setView('list')}
                   className={`h-10 px-4 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${view === 'list' ? 'bg-[#1B4332] text-white shadow-lg shadow-[#1B4332]/10' : 'text-[#1B4332]/40 hover:text-[#1B4332]'}`}
                 >
                   My Requests
                 </button>
                 <button 
                   onClick={() => setView('create')}
                   className={`h-10 px-6 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all flex items-center gap-2 ${view === 'create' ? 'bg-[#BC6C25] text-white' : 'bg-[#BC6C25] text-white shadow-lg shadow-[#BC6C25]/20 hover:scale-[1.02]'}`}
                 >
                   <Plus size={14} /> New Request
                 </button>
              </div>
           </div>
        </header>

        <AnimatePresence mode="wait">
          {view === 'list' ? (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* 🔍 COMPACT SEARCH */}
              <div className="max-w-xl relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#1B4332]/10 group-focus-within:text-[#BC6C25] transition-all" size={18} />
                <input 
                  type="text" 
                  placeholder="Search by ID or Subject..."
                  className="w-full h-12 pl-12 pr-6 bg-white border border-[#1B4332]/5 rounded-xl text-[13px] font-bold text-[#1B4332] shadow-sm focus:outline-none focus:ring-4 focus:ring-[#BC6C25]/5 focus:border-[#BC6C25]/30 transition-all placeholder:text-[#1B4332]/20"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* 📜 TICKET LIST */}
              <div className="grid grid-cols-1 gap-3">
                 {MOCK_TICKETS.map((ticket, i) => {
                   const theme = STATUS_THEMES[ticket.status] || STATUS_THEMES['Closed'];
                   return (
                     <motion.div
                       key={ticket.id}
                       initial={{ opacity: 0, x: -20 }}
                       animate={{ opacity: 1, x: 0 }}
                       transition={{ delay: i * 0.1 }}
                       className="group bg-white p-6 rounded-[2rem] border border-[#1B4332]/5 hover:shadow-[0_20px_50px_-20px_rgba(27,67,50,0.1)] transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer"
                     >
                        <div className="flex items-start gap-5">
                           <div className="w-12 h-12 rounded-2xl bg-[#1B4332]/5 flex items-center justify-center text-[#1B4332] shrink-0 group-hover:bg-[#1B4332] group-hover:text-white transition-all">
                              <ShoppingBag size={20} />
                           </div>
                           <div className="space-y-1">
                              <div className="flex items-center gap-3">
                                 <span className="text-[10px] font-black text-[#BC6C25] uppercase tracking-widest">{ticket.id}</span>
                                 <span className="text-[10px] font-bold text-[#1B4332]/30 uppercase tracking-widest">{ticket.category}</span>
                              </div>
                              <h3 className="text-sm font-black text-[#1B4332] leading-tight">{ticket.subject}</h3>
                              <p className="text-[10px] font-medium text-[#1B4332]/40 flex items-center gap-2">
                                 <Clock size={12} /> Status updated: {ticket.date}
                              </p>
                           </div>
                        </div>

                        <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0 border-[#1B4332]/5">
                           <div className={`px-4 py-1.5 rounded-full ${theme.bg} ${theme.text} flex items-center gap-2`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${theme.dot} animate-pulse`} />
                              <span className="text-[9px] font-black uppercase tracking-widest">{ticket.status}</span>
                           </div>
                           <ChevronRight size={18} className="text-[#1B4332]/10 group-hover:text-[#BC6C25] group-hover:translate-x-1 transition-all" />
                        </div>
                     </motion.div>
                   );
                 })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="create"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl bg-white p-8 sm:p-12 rounded-[3rem] border border-[#1B4332]/5 shadow-xl space-y-10"
            >
               <div className="space-y-2">
                  <h2 className="text-2xl font-black text-[#1B4332] tracking-tight uppercase">Open a Support Request</h2>
                  <p className="text-xs text-[#1B4332]/40 font-medium">How can we help you today? Our concierge team is here for you.</p>
               </div>

               <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setView('list'); }}>
                  <div className="space-y-4">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1B4332]/40 ml-4">Subject</label>
                        <input 
                          type="text" 
                          placeholder="What do you need help with?"
                          className="w-full h-14 px-6 bg-[#FDFBF7] border-none rounded-2xl text-sm font-bold text-[#1B4332] focus:ring-4 focus:ring-[#BC6C25]/5 transition-all"
                          required
                        />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1B4332]/40 ml-4">Category</label>
                           <select className="w-full h-14 px-6 bg-[#FDFBF7] border-none rounded-2xl text-sm font-bold text-[#1B4332] focus:ring-4 focus:ring-[#BC6C25]/5 transition-all appearance-none cursor-pointer">
                              <option>Order Status</option>
                              <option>Returns & Refunds</option>
                              <option>Product Quality</option>
                              <option>Shipping Issue</option>
                           </select>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1B4332]/40 ml-4">Priority</label>
                           <select className="w-full h-14 px-6 bg-[#FDFBF7] border-none rounded-2xl text-sm font-bold text-[#1B4332] focus:ring-4 focus:ring-[#BC6C25]/5 transition-all appearance-none cursor-pointer">
                              <option>Standard</option>
                              <option>Urgent</option>
                           </select>
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1B4332]/40 ml-4">Message</label>
                        <textarea 
                          placeholder="Describe your issue in detail..."
                          className="w-full h-40 p-6 bg-[#FDFBF7] border-none rounded-[2rem] text-sm font-bold text-[#1B4332] focus:ring-4 focus:ring-[#BC6C25]/5 transition-all resize-none"
                          required
                        />
                     </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full h-16 bg-[#1B4332] text-white rounded-2xl flex items-center justify-center gap-3 font-black text-[11px] uppercase tracking-widest hover:bg-[#BC6C25] transition-all shadow-xl shadow-[#1B4332]/10"
                  >
                    <Send size={18} /> Submit Request
                  </button>
               </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
