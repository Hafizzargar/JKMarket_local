'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { ArrowUpRight, Loader2, ChevronLeft, Sparkles } from 'lucide-react';
import SellerProductForm from '@/components/ui/SellerProductForm';

export default function NewProductPage() {
  const router = useRouter();
  const submitRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div className="fixed inset-0 lg:left-[280px] top-16 lg:top-20 bg-[#FDFBF7] z-[60] flex items-center justify-center p-4 lg:p-10 overflow-hidden">
       <div className="absolute inset-0 bg-[#BC6C25]/[0.02] pointer-events-none" />
       
       <motion.div 
          initial={{ opacity: 0, scale: 0.98, y: 10 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-white border border-[#1B4332]/10 rounded-2xl lg:rounded-[3rem] shadow-[0_40px_120px_-30px_rgba(27,67,50,0.2)] relative overflow-hidden flex flex-col w-full max-w-5xl h-full max-h-[90vh] lg:max-h-[800px]"
       >
          {/* 🏺 PREMIUM DECOR */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#BC6C25]/20 via-[#BC6C25] to-[#BC6C25]/20" />
          
          {/* ⚡ HEADER */}
          <div className="px-8 lg:px-12 py-5 lg:py-7 border-b border-[#1B4332]/5 flex items-center justify-between bg-white/80 backdrop-blur-xl shrink-0">
             <div className="flex items-center gap-6">
                <button 
                  onClick={() => router.back()} 
                  className="p-3 bg-[#1B4332]/5 hover:bg-[#BC6C25] rounded-2xl text-[#1B4332]/40 hover:text-white transition-all active:scale-90"
                >
                   <ChevronLeft size={20} />
                </button>
                <div>
                   <div className="flex items-center gap-2 mb-1">
                      <Sparkles size={12} className="text-[#BC6C25]" />
                      <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#BC6C25]">Identity Registry</span>
                   </div>
                   <h1 className="text-2xl lg:text-3xl font-black text-[#1B4332] tracking-tighter leading-none">New <span className="text-[#BC6C25] font-serif italic font-normal lowercase">Listing</span></h1>
                </div>
             </div>

             <button 
                onClick={() => submitRef.current?.()}
                disabled={isUploading}
                className="h-12 px-10 bg-[#1B4332] text-white rounded-2xl flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-[#2D5A47] active:scale-95 transition-all disabled:opacity-50 disabled:grayscale group"
             >
                {isUploading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    <span>Commit Registry</span>
                    <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </>
                )}
             </button>
          </div>

          {/* 🏺 FORM AREA: Pure Scrollable Content */}
          <div className="flex-1 px-8 lg:px-12 py-8 lg:py-12 overflow-y-auto no-scrollbar bg-white">
             <div className="max-w-3xl mx-auto">
                <SellerProductForm 
                  onSubmitRef={submitRef}
                  onLoadingChange={setIsUploading}
                  onClose={() => router.push('/seller/inventory')} 
                />
             </div>
          </div>
       </motion.div>
    </div>
  );
}
