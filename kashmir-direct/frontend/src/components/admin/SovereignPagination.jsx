'use client';

import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SovereignPagination({ currentPage, totalItems, itemsPerPage, onPageChange }) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  if (totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`w-10 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
            currentPage === i 
              ? 'bg-[#1B4332] text-white shadow-lg shadow-[#1B4332]/20 scale-110' 
              : 'text-[#1B4332]/40 hover:bg-[#1B4332]/5 hover:text-[#1B4332]'
          }`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-between px-10 py-6 bg-white border-t border-[#1B4332]/5">
      <div className="flex items-center gap-3">
         <p className="text-[10px] font-black text-[#1B4332]/20 uppercase tracking-[0.2em]">
            Showing <span className="text-[#1B4332]">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="text-[#1B4332]">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of <span className="text-[#BC6C25]">{totalItems}</span> Results
         </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="w-10 h-10 rounded-xl border border-[#1B4332]/5 flex items-center justify-center text-[#1B4332]/20 hover:text-[#BC6C25] hover:border-[#BC6C25]/20 disabled:opacity-30 transition-all"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="flex items-center gap-1.5">
          {renderPageNumbers()}
        </div>

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="w-10 h-10 rounded-xl border border-[#1B4332]/5 flex items-center justify-center text-[#1B4332]/20 hover:text-[#BC6C25] hover:border-[#BC6C25]/20 disabled:opacity-30 transition-all"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
