import { useState } from 'react';
import { Briefcase, Mail, Shield, Trash2, Edit3, Plus, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { ForgeTable, ForgeButton } from './shared/ForgeComponents';
import SovereignPagination from './SovereignPagination';
import AddManagerSlideOver from './AddManagerSlideOver';

export default function OpsCommand({ 
  managers = [], 
  onAddManager, 
  loading = false,
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onPageSizeChange
}) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  
  const columns = [
    { label: 'Staff Member', align: 'left' },
    { label: 'Electronic Mail', align: 'left' },
    { label: 'Status', align: 'left' },
    { label: 'Authority Nodes', align: 'left' },
    { label: 'Actions', align: 'right' }
  ];

  const renderRow = (m) => (
    <>
      <td className="px-10 py-6">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-[10px] bg-[#BC6C25]/10 flex items-center justify-center text-[#BC6C25] font-black text-[10px] border border-[#BC6C25]/10">
               {m.full_name?.split(' ').map(n => n[0]).join('') || 'AD'}
            </div>
            <div>
               <p className="text-[13px] font-black text-[#1B4332] uppercase tracking-tighter">{m.full_name}</p>
               <p className="text-[9px] font-bold text-[#1B4332]/20 uppercase tracking-widest mt-1">{m.role || 'Regional Manager'}</p>
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
         <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/5 border border-emerald-500/10 rounded-[10px]">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981]" />
            <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Active</span>
         </div>
      </td>
      <td className="px-8 py-6">
         <div className="flex flex-wrap gap-1">
            <span className="px-2 py-0.5 bg-[#1B4332]/5 text-[#1B4332]/40 rounded-[10px] text-[7px] font-black uppercase tracking-widest border border-[#1B4332]/5">Check Products</span>
            <span className="px-2 py-0.5 bg-[#1B4332]/5 text-[#1B4332]/40 rounded-[10px] text-[7px] font-black uppercase tracking-widest border border-[#1B4332]/5">Support</span>
         </div>
      </td>
      <td className="px-10 py-6 text-right">
         <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
            <button className="w-9 h-9 rounded-[10px] bg-white border border-[#1B4332]/5 flex items-center justify-center text-[#1B4332]/20 hover:text-[#BC6C25] hover:border-[#BC6C25]/20 transition-all shadow-sm"><Edit3 size={16} /></button>
            <button className="w-9 h-9 rounded-[10px] bg-white border border-rose-100 flex items-center justify-center text-rose-300 hover:text-rose-500 hover:border-rose-200 transition-all shadow-sm"><Trash2 size={16} /></button>
         </div>
      </td>
    </>
  );

  return (
    <div className="space-y-6">
       <AddManagerSlideOver 
         isOpen={isAddOpen} 
         onClose={() => setIsAddOpen(false)} 
         onAdd={onAddManager}
       />

       <ForgeTable 
         columns={columns}
         data={managers || []}
         loading={loading}
         emptyMessage="No Managers Added"
         renderRow={renderRow}
         icon={Briefcase}
         header={
           <div className="flex items-center justify-between px-6 py-3 bg-[#FDFBF7]/50 border-b border-[#1B4332]/5">
              <div className="flex items-center gap-4">
                 {/* 🔍 COMPACT SEARCH */}
                 <div className="relative group">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1B4332]/40 group-focus-within:text-[#BC6C25] transition-colors" />
                    <input 
                      type="text"
                      placeholder="Search staff..."
                      className="bg-white border border-[#1B4332]/20 rounded-[8px] pl-10 pr-4 py-2 text-[10px] font-black text-[#1B4332] placeholder:text-[#1B4332]/40 outline-none focus:border-[#BC6C25]/40 focus:bg-white transition-all w-48"
                    />
                 </div>

                 <ForgeButton 
                   variant="primary"
                   icon={Plus}
                   onClick={() => setIsAddOpen(true)}
                 >
                    Recruit Manager
                 </ForgeButton>
              </div>

              {/* 🚀 COMPACT NAVIGATION */}
              <SovereignPagination 
                variant="compact"
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={onPageChange}
              />
           </div>
         }
       />
    </div>
  );
}
