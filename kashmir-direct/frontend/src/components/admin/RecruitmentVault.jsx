'use client';

import { motion } from 'framer-motion';
import { Briefcase, MapPin, Clock, Edit2, Trash2, XCircle, CheckCircle2, User, Mail, FileText, ArrowUpRight, Zap } from 'lucide-react';
import { ForgeTable } from './shared/ForgeComponents';

export default function RecruitmentVault({ 
  type = 'jobs', 
  data = [], 
  onEdit, 
  onDelete, 
  onToggleStatus, 
  onView,
  loading = false
}) {
  const jobColumns = [
    { label: 'Position', align: 'left' },
    { label: 'Payscale', align: 'center' },
    { label: 'Experience', align: 'center' },
    { label: 'Status', align: 'center' },
    { label: 'Action', align: 'right' }
  ];

  const appColumns = [
    { label: 'Candidate', align: 'left' },
    { label: 'Applied For', align: 'left' },
    { label: 'Status', align: 'center' },
    { label: 'Review', align: 'right' }
  ];

  const renderJobRow = (item) => (
    <>
      <td className="px-8 py-6">
         <div className="space-y-1">
            <p className="text-[13px] font-black text-[#1B4332] uppercase tracking-tight group-hover:text-[#BC6C25] transition-colors italic">{item.title}</p>
            <div className="flex items-center gap-3">
               <span className="text-[8px] font-black text-[#BC6C25] uppercase tracking-widest">{item.department}</span>
               <span className="text-[8px] font-medium text-[#1B4332]/30 flex items-center gap-1 uppercase tracking-widest"><MapPin size={10} /> {item.location}</span>
            </div>
         </div>
      </td>
      <td className="px-4 py-6 text-center">
         <span className="text-[10px] font-black text-[#1B4332] uppercase tracking-tighter">
            {item.salary_range || 'TBD'}
         </span>
      </td>
      <td className="px-4 py-6 text-center">
         <span className="text-[9px] font-black text-[#1B4332]/50 uppercase tracking-widest">
            {item.experience_required || 'Not Specified'}
         </span>
      </td>
      <td className="px-4 py-6">
         <div className="flex justify-center">
            <button 
              onClick={() => onToggleStatus(item)}
              className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 border transition-all ${item.is_active ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-600 hover:bg-amber-500 hover:text-white hover:border-amber-500' : 'bg-[#1B4332]/5 border-[#1B4332]/10 text-[#1B4332]/30 hover:bg-emerald-500 hover:text-white hover:border-emerald-500'}`}
            >
               <div className={`w-1 h-1 rounded-lg ${item.is_active ? 'bg-emerald-500' : 'bg-[#1B4332]/20'}`} />
               {item.is_active ? 'Hiring' : 'Paused'}
            </button>
         </div>
      </td>
      <td className="px-8 py-6 text-right">
         <div className="flex items-center justify-end gap-2">
            <button 
              onClick={() => onEdit(item)}
              className="w-8 h-8 rounded-lg bg-[#1B4332]/5 text-[#1B4332]/20 hover:text-[#1B4332] hover:bg-[#1B4332]/10 transition-all flex items-center justify-center"
            >
               <Edit2 size={14} />
            </button>
            <button 
              onClick={() => onDelete(item.id)}
              className="w-8 h-8 rounded-lg bg-rose-500/5 text-rose-500/30 hover:text-white hover:bg-rose-500 transition-all flex items-center justify-center"
            >
               <Trash2 size={14} />
            </button>
         </div>
      </td>
    </>
  );

  const renderAppRow = (item) => (
    <>
      <td className="px-8 py-6">
         <div className="space-y-1">
            <p className="text-[13px] font-black text-[#1B4332] uppercase tracking-tight group-hover:text-[#BC6C25] transition-colors italic">{item.full_name}</p>
            <div className="flex items-center gap-3">
               <span className="text-[8px] font-black text-[#1B4332]/30 flex items-center gap-1 uppercase tracking-widest"><Mail size={10} /> {item.email}</span>
            </div>
         </div>
      </td>
      <td className="px-4 py-6">
         <div className="space-y-0.5">
            <p className="text-[11px] font-black text-[#BC6C25] uppercase tracking-tight">{item.jobs?.title || 'Unknown Position'}</p>
            <p className="text-[8px] font-bold text-[#1B4332]/20 uppercase tracking-widest italic">{item.jobs?.department || 'Recruitment'}</p>
         </div>
      </td>
      <td className="px-4 py-6">
         <div className="flex justify-center">
            <div className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 border ${item.status === 'Hired' ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-600' : item.status === 'Rejected' ? 'bg-rose-500/5 border-rose-500/10 text-rose-600' : 'bg-amber-500/5 border-amber-500/10 text-amber-600'}`}>
               <div className={`w-1 h-1 rounded-lg ${item.status === 'Hired' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : item.status === 'Rejected' ? 'bg-rose-500' : 'bg-amber-500 animate-pulse shadow-[0_0_8px_#f59e0b]'}`} />
               {item.status}
            </div>
         </div>
      </td>
      <td className="px-8 py-6 text-right">
         <button 
           onClick={() => onView(item)}
           className="inline-flex items-center gap-2 h-8 px-4 rounded-lg bg-[#1B4332] text-white hover:bg-[#BC6C25] transition-all active:scale-95 group/btn shadow-md hover:shadow-[#BC6C25]/20"
         >
            <span className="text-[8px] font-black uppercase tracking-widest">Review</span>
            <ArrowUpRight size={12} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
         </button>
      </td>
    </>
  );

  return (
    <ForgeTable 
      columns={type === 'jobs' ? jobColumns : appColumns}
      data={data}
      loading={loading}
      emptyMessage={`No ${type} found`}
      renderRow={type === 'jobs' ? renderJobRow : renderAppRow}
      icon={type === 'jobs' ? Briefcase : User}
    />
  );
}
