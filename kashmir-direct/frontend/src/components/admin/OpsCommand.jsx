'use client';

import { useState } from 'react';
import { Briefcase, UserCircle, Plus, Settings, Activity, ShieldCheck, ChevronRight, Mail, Shield, Trash2, Edit3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SovereignPagination from './SovereignPagination';
import AddManagerSlideOver from './AddManagerSlideOver';

export default function OpsCommand({ managers = [], onAddManager }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const itemsPerPage = 8;
  
  const totalItems = managers.length;
  const currentManagers = managers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="bg-white border border-[#1B4332]/10 rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(27,67,50,0.1)] overflow-hidden flex flex-col min-h-[600px]">
       
       {/* 🏛️ STAFF MEMBERS HEADER */}
       <div className="px-10 py-8 bg-[#FDFBF7] border-b border-[#1B4332]/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-[#1B4332] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-[#1B4332]/20">
                <Shield size={24} />
             </div>
             <div>
                <h3 className="text-xl font-black text-[#1B4332] uppercase tracking-tighter leading-none">Staff Members</h3>
                <p className="text-[10px] font-bold text-[#1B4332]/30 uppercase tracking-[0.2em] mt-2">Current Managers</p>
             </div>
          </div>
          
          <button 
            onClick={() => setIsAddOpen(true)}
            className="h-12 px-6 bg-[#BC6C25] text-white rounded-xl flex items-center gap-3 text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-[#BC6C25]/20 group"
          >
             <Plus size={16} />
             Add New Manager
          </button>
       </div>

       <AddManagerSlideOver 
         isOpen={isAddOpen} 
         onClose={() => setIsAddOpen(false)} 
         onAdd={onAddManager}
       />

       {/* 📜 STAFF TABLE */}
       <div className="flex-1 overflow-x-auto no-scrollbar">
          <table className="w-full border-collapse">
             <thead>
                <tr className="bg-[#1B4332]/[0.02] border-b border-[#1B4332]/5">
                   <th className="px-10 py-5 text-[9px] font-black text-[#1B4332]/30 uppercase tracking-[0.2em]">Name</th>
                   <th className="px-8 py-5 text-[9px] font-black text-[#1B4332]/30 uppercase tracking-[0.2em]">Email</th>
                   <th className="px-8 py-5 text-[9px] font-black text-[#1B4332]/30 uppercase tracking-[0.2em]">Status</th>
                   <th className="px-8 py-5 text-[9px] font-black text-[#1B4332]/30 uppercase tracking-[0.2em]">Role</th>
                   <th className="px-10 py-5 text-right text-[9px] font-black text-[#1B4332]/30 uppercase tracking-[0.2em]">Actions</th>
                </tr>
             </thead>
             <tbody>
                {currentManagers.length > 0 ? currentManagers.map((m) => (
                  <motion.tr 
                    key={m.id} 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="border-b border-[#1B4332]/[0.03] hover:bg-[#FDFBF7]/50 transition-colors group"
                  >
                     <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-xl bg-[#BC6C25]/10 flex items-center justify-center text-[#BC6C25] font-black text-[10px] border border-[#BC6C25]/10">
                              {m.full_name?.split(' ').map(n => n[0]).join('') || 'AD'}
                           </div>
                           <div>
                              <p className="text-[13px] font-black text-[#1B4332] uppercase tracking-tighter">{m.full_name}</p>
                              <p className="text-[9px] font-bold text-[#1B4332]/20 uppercase tracking-widest mt-1">Regional Manager</p>
                           </div>
                        </div>
                     </td>
                     <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-[#1B4332]/60">
                           <Mail size={12} className="text-[#BC6C25]" />
                           <span className="text-[11px] font-medium">{m.email}</span>
                        </div>
                     </td>
                     <td className="px-8 py-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/5 border border-emerald-500/10 rounded-lg">
                           <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981]" />
                           <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Active</span>
                        </div>
                     </td>
                     <td className="px-8 py-6">
                        <div className="flex flex-wrap gap-1">
                           <span className="px-2 py-0.5 bg-[#1B4332]/5 text-[#1B4332]/40 rounded text-[7px] font-black uppercase tracking-widest border border-[#1B4332]/5">Check Products</span>
                           <span className="px-2 py-0.5 bg-[#1B4332]/5 text-[#1B4332]/40 rounded text-[7px] font-black uppercase tracking-widest border border-[#1B4332]/5">Support</span>
                        </div>
                     </td>
                     <td className="px-10 py-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                           <button className="w-9 h-9 rounded-lg bg-white border border-[#1B4332]/5 flex items-center justify-center text-[#1B4332]/20 hover:text-[#BC6C25] hover:border-[#BC6C25]/20 transition-all shadow-sm"><Edit3 size={16} /></button>
                           <button className="w-9 h-9 rounded-lg bg-white border border-rose-100 flex items-center justify-center text-rose-300 hover:text-rose-500 hover:border-rose-200 transition-all shadow-sm"><Trash2 size={16} /></button>
                        </div>
                     </td>
                  </motion.tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="py-24 text-center">
                       <div className="flex flex-col items-center justify-center gap-4 opacity-20">
                          <Briefcase size={48} />
                          <p className="text-[10px] font-black uppercase tracking-[0.4em]">No Managers Added</p>
                       </div>
                    </td>
                  </tr>
                )}
             </tbody>
          </table>
       </div>

       {/* 🔢 PAGE NAVIGATION */}
       <SovereignPagination 
         currentPage={currentPage}
         totalItems={totalItems}
         itemsPerPage={itemsPerPage}
         onPageChange={setCurrentPage}
       />
    </div>
  );
}
