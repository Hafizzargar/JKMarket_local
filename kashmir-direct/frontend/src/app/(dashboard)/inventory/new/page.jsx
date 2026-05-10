'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { ArrowUpRight, Loader2, ChevronLeft } from 'lucide-react';
import SellerProductForm from '@/components/ui/SellerProductForm';

export default function NewProductPage() {
  const router = useRouter();
  const submitRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div className="fixed inset-0 lg:left-[260px] top-16 lg:top-20 bg-[#FDFBF7] z-[60] flex items-center justify-center p-4 lg:p-10 overflow-hidden">
       <div className="absolute inset-0 bg-[#BC6C25]/[0.02] pointer-events-none" />
       
       <motion.div 
          initial={{ opacity: 0, scale: 0.98 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border border-[#1B4332]/10 rounded-2xl lg:rounded-[2rem] shadow-[0_30px_100px_-20px_rgba(27,67,50,0.15)] relative overflow-hidden flex flex-col w-full max-w-4xl h-full max-h-[85vh] lg:max-h-[750px]"
       >
          <div className="absolute top-0 left-0 w-full h-1 bg-[#BC6C25]/20" />
          
          {/* ⚡ HEADER */}
          <div className="px-6 lg:px-10 py-4 lg:py-5 border-b border-[#1B4332]/5 flex items-center justify-between bg-white shrink-0">
             <div className="flex items-center gap-4">
                <button 
                  onClick={() => router.back()} 
                  className="p-2 hover:bg-[#1B4332]/5 rounded-lg text-[#1B4332]/40 hover:text-[#1B4332] transition-colors"
                >
                   <ChevronLeft size={20} />
                </button>
                <div>
                   <h1 className="text-[16px] lg:text-[18px] font-black text-[#1B4332] uppercase tracking-tight leading-none mb-1">Add Product</h1>
                   <p className="text-[10px] font-medium text-[#1B4332]/40 italic">New Marketplace Listing</p>
                </div>
             </div>

             <button 
                onClick={() => submitRef.current?.()}
                disabled={isUploading}
                className="h-10 px-8 bg-[#BC6C25] text-white rounded-xl flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-wider shadow-lg hover:shadow-xl active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
             >
                {isUploading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    <span>Save</span>
                    <ArrowUpRight size={16} />
                  </>
                )}
             </button>
          </div>

          {/* 🏺 FORM AREA: Pure Scrollable Content */}
          <div className="flex-1 px-6 lg:px-10 py-6 lg:py-8 overflow-y-auto no-scrollbar bg-white">
             <SellerProductForm 
               onSubmitRef={submitRef}
               onLoadingChange={setIsUploading}
               onClose={() => router.push('/inventory')} 
             />
          </div>
       </motion.div>
    </div>
  );
}
