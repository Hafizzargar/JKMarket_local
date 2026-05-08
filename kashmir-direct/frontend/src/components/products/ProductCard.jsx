'use client';

import { motion } from 'framer-motion';
import Button from '../ui/Button';

export default function ProductCard({ product }) {
  const { title, price, unit, category, location, image_url } = product;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      className="glass-card group overflow-hidden rounded-[3rem] border border-[#1B4332]/5 hover:border-[#1B4332]/10 hover:shadow-2xl transition-all duration-700"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[#FDFBF7]">
        {image_url ? (
          <motion.img
            src={image_url}
            alt={title}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#1B4332]/5">
            <span className="text-[#1B4332] font-black text-6xl opacity-5 tracking-tighter">AUTHENTIC</span>
          </div>
        )}
        <div className="absolute top-8 left-8">
          <span className="bg-[#FDFBF7]/90 backdrop-blur-md text-[#1B4332] text-[10px] font-black px-5 py-2 rounded-2xl uppercase tracking-widest border border-[#1B4332]/10 shadow-sm">
            {category || 'Heritage'}
          </span>
        </div>
      </div>
      
      <div className="p-8 sm:p-10">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-2xl sm:text-3xl font-black text-[#1B4332] group-hover:text-[#BC6C25] transition-colors line-clamp-1 leading-tight">
            {title}
          </h3>
        </div>
        
        <p className="text-base text-slate-500 font-bold flex items-center mb-10">
          <svg className="w-5 h-5 mr-3 text-[#BC6C25]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          {location || 'Jammu & Kashmir'}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="text-xs text-slate-400 font-black uppercase tracking-widest block mb-1">Pure Direct</span>
            <span className="text-3xl sm:text-4xl font-black text-[#1B4332] tracking-tight">₹{price} <span className="text-base font-bold text-slate-400">/ {unit}</span></span>
          </div>
          <Button className="bg-[#1B4332] text-[#FDFBF7] p-5 rounded-3xl hover:bg-[#2D6A4F] shadow-xl shadow-[#1B4332]/10 group-hover:rotate-6 transition-all duration-500">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path></svg>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
