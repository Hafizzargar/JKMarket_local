'use client';

import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

export default function SovereignPagination({ 
  currentPage, 
  totalItems, 
  itemsPerPage, 
  onPageChange,
  onPageSizeChange,
  variant = 'full'
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  if (totalItems === 0) return null;

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 3; // Reduced for compact
    
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`w-8 h-8 rounded-[8px] text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${
            currentPage === i 
              ? 'bg-[#1B4332] text-white' 
              : 'text-[#1B4332]/40 hover:bg-[#1B4332]/5'
          }`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-6 py-3 px-6 bg-[#FDFBF7] border-b border-[#1B4332]/10">
        <div className="flex items-center gap-2">
           <p className="text-[10px] font-black text-[#1B4332]/60 uppercase tracking-widest">
              <span className="text-[#1B4332] bg-[#1B4332]/5 px-1.5 py-0.5 rounded-md">{(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalItems)}</span> 
              <span className="mx-2 text-[#1B4332]/20">of</span>
              <span className="text-[#BC6C25] font-black">{totalItems}</span>
           </p>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1B4332]/60 hover:text-[#BC6C25] disabled:opacity-10 transition-colors"
          >
            Prev
          </button>
          
          <div className="flex items-center gap-1.5 px-3 border-x border-[#1B4332]/10 mx-1">
             {renderPageNumbers()}
          </div>

          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1B4332]/60 hover:text-[#BC6C25] disabled:opacity-10 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between px-10 py-6 bg-white border-t border-[#1B4332]/5">
      <div className="flex items-center gap-12">
         <p className="text-[10px] font-black text-[#1B4332]/20 uppercase tracking-[0.2em]">
            Showing <span className="text-[#1B4332]">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="text-[#1B4332]">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of <span className="text-[#BC6C25]">{totalItems}</span> Results
         </p>

         {onPageSizeChange && (
           <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-[#1B4332]/20 uppercase tracking-widest">Rows:</span>
              <div className="relative group">
                <select 
                  value={itemsPerPage}
                  onChange={(e) => onPageSizeChange(Number(e.target.value))}
                  className="appearance-none bg-transparent border border-[#1B4332]/10 rounded-[10px] px-6 py-2.5 pr-10 text-[10px] font-black text-[#1B4332] outline-none focus:border-[#BC6C25] transition-all cursor-pointer"
                >
                  {[7, 14, 21, 50].map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
                <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#1B4332]/20 group-hover:text-[#BC6C25] transition-colors" />
              </div>
           </div>
         )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="w-24 h-10 rounded-[10px] border border-[#1B4332]/5 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#1B4332]/20 hover:text-[#BC6C25] hover:border-[#BC6C25]/20 disabled:opacity-30 transition-all group"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" /> Prev
        </button>

        <div className="flex items-center gap-1.5 mx-2">
          {renderPageNumbers()}
        </div>

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="w-24 h-10 rounded-[10px] border border-[#1B4332]/5 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#1B4332]/20 hover:text-[#BC6C25] hover:border-[#BC6C25]/20 disabled:opacity-30 transition-all group"
        >
          Next <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}
