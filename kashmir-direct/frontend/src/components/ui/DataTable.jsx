'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ListFilter } from 'lucide-react';

export default function DataTable({ 
  title, 
  data = [], 
  columns = [], 
  actions = [], 
  isLoading = false,
  // API Pagination Props
  totalCount = 0,
  currentPage = 1,
  pageSize = 7,
  onPageChange,
  onPageSizeChange,
  getRowClassName // New prop for dynamic row styling
}) {
  const totalPages = Math.ceil(totalCount / pageSize);
  const startIndex = (currentPage - 1) * pageSize;

  return (
    <div className="bg-[#141A18] rounded-[1.5rem] border border-white/5 overflow-hidden shadow-2xl flex flex-col h-full">
      {/* 🏔️ COMPACT HEADER */}
      <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
         <div className="flex items-center gap-3">
            <ListFilter size={14} className="text-[#BC6C25]" />
            <h3 className="text-[9px] font-black tracking-[0.3em] uppercase italic text-white/30">{title}</h3>
         </div>
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 bg-white/5 rounded-lg px-2 py-1 border border-white/5">
               {[10, 20, 30].map(size => (
                 <button 
                   key={size} 
                   onClick={() => onPageSizeChange?.(size)}
                   className={`text-[8px] font-black px-2 py-1 rounded transition-all ${pageSize === size ? 'bg-[#BC6C25] text-white' : 'text-white/20 hover:text-white'}`}
                 >
                   {size}
                 </button>
               ))}
            </div>
            <div className="text-[8px] font-black text-white/10 uppercase tracking-widest px-3 py-1.5 rounded-lg border border-white/5">
               Total: {totalCount}
            </div>
         </div>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.01]">
              {columns.map((col, idx) => (
                <th key={idx} className={`px-6 py-3 text-[9px] font-black text-white/10 uppercase tracking-[0.2em] ${col.align === 'right' ? 'text-right' : ''}`}>
                  {col.header}
                </th>
              ))}
              {actions.length > 0 && (
                <th className="px-6 py-3 text-right text-[9px] font-black text-white/10 uppercase tracking-[0.2em]">Tools</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {isLoading && data.length === 0 ? (
              [...Array(pageSize)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {columns.map((_, idx) => (
                    <td key={idx} className="px-6 py-4"><div className="h-3 bg-white/5 rounded w-24" /></td>
                  ))}
                  {actions.length > 0 && <td className="px-6 py-4 text-right"><div className="h-6 w-6 bg-white/5 rounded-lg ml-auto" /></td>}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions.length > 0 ? 1 : 0)} className="px-6 py-20 text-center">
                   <p className="text-[10px] font-black text-white/5 uppercase tracking-widest italic">Node Empty</p>
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => (
                <motion.tr 
                  key={row.id || rowIdx} 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className={`hover:bg-white/[0.02] transition-all group ${getRowClassName ? getRowClassName(row) : ''}`}
                >
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className={`px-6 py-4 ${col.align === 'right' ? 'text-right' : ''}`}>
                      <div className="text-sm font-bold text-white/80 tracking-tight leading-tight">
                        {col.render ? col.render(row) : row[col.accessor]}
                      </div>
                    </td>
                  ))}
                  
                  {actions.length > 0 && (
                    <td className="px-6 py-4 text-right">
                       <div className="flex justify-end gap-1.5">
                          {actions.map((action, actionIdx) => (
                            <button 
                              key={actionIdx}
                              onClick={() => action.onClick(row)}
                              className={`p-2 rounded-lg transition-all border border-white/5 ${action.variant === 'danger' ? 'bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white' : 'bg-white/5 text-white/20 hover:text-white hover:bg-white/10'}`}
                            >
                              <action.icon size={12} />
                            </button>
                          ))}
                       </div>
                    </td>
                  )}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 🧭 NAVIGATION FOOTER */}
      <div className="px-6 py-4 border-t border-white/5 bg-white/[0.01] flex justify-between items-center">
         <p className="text-[8px] font-black text-white/10 uppercase tracking-widest">
            Chunk {startIndex + 1} - {Math.min(startIndex + data.length, totalCount)} of {totalCount}
         </p>
         <div className="flex items-center gap-2">
            <button 
              disabled={currentPage === 1 || isLoading}
              onClick={() => onPageChange?.(currentPage - 1)}
              className="p-1.5 rounded-lg border border-white/5 text-white/20 disabled:opacity-20 hover:text-white hover:bg-white/5 transition-all"
            >
               <ChevronLeft size={14} />
            </button>
            <span className="text-[9px] font-black text-white/40 px-2 tracking-widest">{currentPage} / {totalPages || 1}</span>
            <button 
              disabled={currentPage === totalPages || totalPages === 0 || isLoading}
              onClick={() => onPageChange?.(currentPage + 1)}
              className="p-1.5 rounded-lg border border-white/5 text-white/20 disabled:opacity-20 hover:text-white hover:bg-white/5 transition-all"
            >
               <ChevronRight size={14} />
            </button>
         </div>
      </div>
    </div>
  );
}
