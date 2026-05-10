'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ListFilter, MoreVertical } from 'lucide-react';

export default function DataTable({ 
  title, 
  data = [], 
  columns = [], 
  actions = [], 
  isLoading = false,
  totalCount = 0,
  currentPage = 1,
  pageSize = 7,
  onPageChange,
  onPageSizeChange,
  getRowClassName 
}) {
  const totalPages = Math.ceil(totalCount / pageSize);
  const startIndex = (currentPage - 1) * pageSize;

  return (
    <div className="bg-transparent lg:bg-white lg:rounded-[2.5rem] lg:border lg:border-[#1B4332]/5 overflow-hidden lg:shadow-[0_40px_80px_-20px_rgba(27,67,50,0.08)] flex flex-col h-full transition-all duration-500">
      {/* 🏔️ COMPACT HEADER */}
      <div className="px-4 lg:px-8 py-4 lg:py-6 lg:border-b border-[#1B4332]/5 flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#FDFBF7]/50 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none rounded-2xl lg:rounded-none mb-4 lg:mb-0 border border-[#1B4332]/5 lg:border-none shadow-sm lg:shadow-none">
         <div className="flex items-center gap-3.5 w-full sm:w-auto">
            <div className="w-8 h-8 rounded-xl bg-[#BC6C25]/10 flex items-center justify-center shrink-0">
               <ListFilter size={16} className="text-[#BC6C25]" />
            </div>
            <h3 className="text-[10px] font-black tracking-[0.3em] uppercase italic text-[#1B4332]/40 truncate">{title}</h3>
         </div>
         
         <div className="flex items-center justify-between sm:justify-end gap-3 lg:gap-6 w-full sm:w-auto">
            <div className="flex items-center gap-1.5 bg-[#1B4332]/5 lg:bg-white rounded-xl px-1.5 py-1 border border-[#1B4332]/10 shadow-inner lg:shadow-sm">
               {[10, 20, 30].map(size => (
                 <button 
                   key={size} 
                   onClick={() => onPageSizeChange?.(size)}
                   className={`text-[8px] lg:text-[9px] font-black px-2 lg:px-3 py-1.5 rounded-lg transition-all ${pageSize === size ? 'bg-[#BC6C25] text-white shadow-md' : 'text-[#1B4332]/60 hover:text-[#1B4332]'}`}
                 >
                   {size}
                 </button>
               ))}
            </div>
            <div className="text-[9px] font-black text-[#1B4332]/40 uppercase tracking-[0.1em] px-3 py-1.5 rounded-xl bg-[#1B4332]/5 lg:bg-white border border-[#1B4332]/10 whitespace-nowrap lg:shadow-sm">
               Nodes: {totalCount}
            </div>
         </div>
      </div>

      {/* 📱 MOBILE CARD VIEW (Hidden on Desktop) */}
      <div className="lg:hidden space-y-4 px-1 pb-20">
         {isLoading && data.length === 0 ? (
            [...Array(3)].map((_, i) => (
               <div key={i} className="bg-white rounded-2xl p-4 border border-[#1B4332]/5 animate-pulse shadow-sm">
                  <div className="flex gap-4">
                     <div className="w-16 h-16 bg-[#1B4332]/5 rounded-xl shrink-0" />
                     <div className="flex-1 space-y-2">
                        <div className="h-3 bg-[#1B4332]/5 rounded w-3/4" />
                        <div className="h-2 bg-[#1B4332]/5 rounded w-1/2" />
                     </div>
                  </div>
               </div>
            ))
         ) : data.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-[#1B4332]/5">
               <p className="text-[10px] font-black text-[#1B4332]/10 uppercase tracking-widest italic">No Data Found</p>
            </div>
         ) : (
            data.map((row, rowIdx) => (
               <motion.div 
                 key={row.id || rowIdx}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="bg-white rounded-2xl p-4 border border-[#1B4332]/5 shadow-sm active:scale-[0.98] transition-all"
               >
                  <div className="flex items-start justify-between mb-4">
                     {columns[0] && (
                        <div className="flex-1">
                           {columns[0].render ? columns[0].render(row) : (
                              <span className="text-[14px] font-bold text-[#1B4332]">{row[columns[0].accessor]}</span>
                           )}
                        </div>
                     )}
                     
                     {actions.length > 0 && (
                        <div className="flex gap-1.5 ml-2">
                           {actions.map((action, idx) => (
                              <button 
                                 key={idx}
                                 onClick={() => action.onClick(row)}
                                 className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all border ${action.variant === 'danger' ? 'bg-rose-50 border-rose-100 text-rose-500' : 'bg-[#FDFBF7] border-[#1B4332]/5 text-[#1B4332]/40'}`}
                              >
                                 <action.icon size={14} />
                              </button>
                           ))}
                        </div>
                     )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#1B4332]/5">
                     {columns.slice(1).map((col, idx) => (
                        <div key={idx}>
                           <p className="text-[8px] font-black text-[#1B4332]/20 uppercase tracking-widest mb-1">{col.header}</p>
                           {col.render ? col.render(row) : (
                              <p className="text-[12px] font-bold text-[#1B4332]">{row[col.accessor]}</p>
                           )}
                        </div>
                     ))}
                  </div>
               </motion.div>
            ))
         )}
      </div>

      {/* 🚢 DESKTOP TABLE VIEW (Hidden on Mobile) */}
      <div className="hidden lg:block overflow-x-auto flex-1 no-scrollbar">
        <table className="w-full text-left border-collapse min-w-full">
          <thead>
            <tr className="border-b border-[#1B4332]/5 bg-[#1B4332]/5">
              {columns.map((col, idx) => (
                <th key={idx} className={`px-6 py-4 text-[9px] font-black text-[#1B4332]/50 uppercase tracking-[0.2em] ${col.align === 'right' ? 'text-right' : ''}`}>
                  {col.header}
                </th>
              ))}
              {actions.length > 0 && (
                <th className="px-6 py-4 text-right text-[9px] font-black text-[#1B4332]/50 uppercase tracking-[0.2em]">Tools</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1B4332]/5">
            {isLoading && data.length === 0 ? (
              [...Array(pageSize)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {columns.map((_, idx) => (
                    <td key={idx} className="px-6 py-4"><div className="h-3 bg-[#1B4332]/5 rounded w-24" /></td>
                  ))}
                  {actions.length > 0 && <td className="px-6 py-4 text-right"><div className="h-6 w-6 bg-[#1B4332]/5 rounded-lg ml-auto" /></td>}
                </tr>
              ))
            ) : (
              data.map((row, rowIdx) => (
                <motion.tr 
                  key={row.id || rowIdx} 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className={`border-b border-[#1B4332]/5 hover:bg-[#FDFBF7] transition-all group/row ${getRowClassName ? getRowClassName(row) : ''}`}
                >
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className={`px-6 py-4 ${col.align === 'right' ? 'text-right' : ''}`}>
                      <div className="transition-transform group-hover/row:translate-x-1 duration-300">
                        {col.render ? col.render(row) : (
                          <span className="text-[13px] font-medium text-[#1B4332]">{row[col.accessor]}</span>
                        )}
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
                              className={`p-2 rounded-lg transition-all border border-[#1B4332]/5 ${action.variant === 'danger' ? 'bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white' : 'bg-[#1B4332]/5 text-[#1B4332]/40 hover:text-white hover:bg-[#1B4332]/10'}`}
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

      {/* 🧭 NAVIGATION FOOTER: Responsive */}
      <div className="fixed lg:relative bottom-0 left-0 right-0 lg:bottom-auto px-4 lg:px-6 py-3 lg:py-4 border-t border-[#1B4332]/5 bg-white lg:bg-[#1B4332]/5 flex justify-between items-center z-50 lg:z-auto shadow-[0_-10px_20px_-10px_rgba(27,67,50,0.1)] lg:shadow-none">
         <p className="text-[8px] font-black text-[#1B4332]/20 uppercase tracking-widest">
            {startIndex + 1}-{Math.min(startIndex + data.length, totalCount)} of {totalCount}
         </p>
         <div className="flex items-center gap-2">
            <button 
              disabled={currentPage === 1 || isLoading}
              onClick={() => onPageChange?.(currentPage - 1)}
              className="w-9 h-9 lg:w-7 lg:h-7 rounded-lg border border-[#1B4332]/5 text-[#1B4332]/40 disabled:opacity-20 flex items-center justify-center hover:bg-[#BC6C25] hover:text-white transition-all shadow-sm lg:shadow-none"
            >
               <ChevronLeft size={16} />
            </button>
            <span className="text-[9px] font-black text-[#1B4332]/40 px-2 tracking-widest">{currentPage} / {totalPages || 1}</span>
            <button 
              disabled={currentPage === totalPages || totalPages === 0 || isLoading}
              onClick={() => onPageChange?.(currentPage + 1)}
              className="w-9 h-9 lg:w-7 lg:h-7 rounded-lg border border-[#1B4332]/5 text-[#1B4332]/40 disabled:opacity-20 flex items-center justify-center hover:bg-[#BC6C25] hover:text-white transition-all shadow-sm lg:shadow-none"
            >
               <ChevronRight size={16} />
            </button>
         </div>
      </div>
    </div>
  );
}
