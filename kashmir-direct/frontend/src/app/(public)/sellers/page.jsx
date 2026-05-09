'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../../lib/supabase';
import Link from 'next/link';

export default function SellersPage() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSellers() {
      const { data, error } = await supabase
        .from('sellers')
        .select('*');
      
      if (!error && data) {
        // 🛡️ IDENTITY GUARD: Filter out any potential duplicate records (even with different IDs) 
        // to ensure the UI only shows one unique workshop per name.
        const uniqueSellers = Array.from(new Map(data.map(item => [item.shop_name, item])).values());
        setSellers(uniqueSellers);
      }
      setLoading(false);
    }

    fetchSellers();
  }, []);

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-[60vh] space-y-4">
      <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
      <p className="text-slate-500 font-black animate-pulse">Meeting our artisans...</p>
    </div>
  );

  return (
    <div className="relative min-h-screen">
      <div className="bg-3d-mesh" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="mb-16 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl sm:text-7xl font-black text-slate-900 tracking-tight"
          >
            Our <span className="text-gradient">Artisans</span>
          </motion.h1>
          <p className="mt-4 text-xl text-slate-500 font-bold max-w-2xl mx-auto">
            Meet the hands that create magic. Supporting local businesses directly from Jammu & Kashmir.
          </p>
        </div>

        {sellers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {sellers.map((seller, i) => (
              <motion.div
                key={seller.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className="glass-card p-8 rounded-[2.5rem] border border-white/60 hover:shadow-2xl transition-all group"
              >
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-3xl font-black text-emerald-600 border-4 border-white shadow-lg">
                    {seller.shop_name?.[0] || 'S'}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors">{seller.shop_name}</h3>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{seller.business_type || 'Artisan'}</p>
                  </div>
                </div>
                
                <p className="text-slate-500 font-bold mb-8 line-clamp-3">
                  {seller.bio || "This seller is dedicated to bringing you the most authentic products from the heart of the valley."}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-400 font-bold uppercase">Location</span>
                    <span className="text-slate-800 font-black">{seller.location || 'Jammu & Kashmir'}</span>
                  </div>
                  <Link href={`/products?seller=${seller.id}`}>
                    <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black hover:bg-emerald-600 transition-colors shadow-lg">
                      View Shop
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="glass-card text-center py-24 rounded-[3rem] border border-white/50 max-w-2xl mx-auto">
             <span className="text-6xl mb-6 block">🏔️</span>
             <h3 className="text-2xl font-black text-slate-800">Joining our ranks...</h3>
             <p className="text-slate-500 font-bold mt-2">New artisans are being verified as we speak.</p>
          </div>
        )}
      </div>
    </div>
  );
}
