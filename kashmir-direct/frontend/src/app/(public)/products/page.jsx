'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../../store/useStore';
import ProductGrid from '../../../components/products/ProductGrid';
import { Search, SlidersHorizontal, PackageSearch, Sparkles, ChevronDown, Lock } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function ProductsPage() {
  const { user, profile, isAdmin } = useAuth();
  const { products, isProductsLoading: loading, fetchProducts } = useStore();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const router = useRouter();
  const pathname = usePathname();
 
  useEffect(() => {
    if (user && !isAdmin && (profile?.role === 'customer' || profile?.role === 'buyer') && !pathname.startsWith('/buyer')) {
       window.location.replace('/buyer/products');
    }
  }, [user, profile, isAdmin, router, pathname]);

  useEffect(() => {
    fetchProducts(user);
    
    // 🛡️ RE-FETCH FALLBACK: If products are empty after 2 seconds, try one more time
    const timer = setTimeout(() => {
      if (products.length === 0) fetchProducts(user);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [user, fetchProducts, products.length]);

  const categories = ['All', ...new Set((products || []).map(p => p.category))];

  const filteredProducts = (products || []).filter(p => 
    (search === '' || p.title.toLowerCase().includes(search.toLowerCase()) || p.category?.toLowerCase().includes(search.toLowerCase())) &&
    (activeCategory === 'All' || p.category === activeCategory)
  );

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-[70vh] space-y-6">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 border-4 border-[#1B4332]/10 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-[#BC6C25] rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center text-2xl animate-pulse">🏔️</div>
      </div>
      <p className="text-[#1B4332]/40 font-black uppercase tracking-[0.4em] text-[10px]">Unlocking Valley Vaults</p>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-[#FDFBF7] pt-2 sm:pt-4">
      {/* 🏔️ AMBIENT BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#BC6C25]/[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#1B4332]/[0.03] rounded-full blur-[150px]" />
      </div>

      <div className={`max-w-7xl mx-auto px-[clamp(1rem,5vw,2.5rem)] relative z-10 transition-all duration-700 py-4`}>
        {/* 🏛️ SOVEREIGN HEADER */}
        <header className="mb-4 space-y-4 text-center lg:text-left">


           <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              {!user && (
                <div className="space-y-[clamp(0.75rem,1vh,1rem)]">
                   <h1 className="text-[clamp(2rem,6vw,4rem)] font-black text-[#1B4332] tracking-tighter leading-[0.9]">
                      Elite <br/>
                      <span className="text-[#BC6C25] font-serif italic font-normal">Marketplace</span>
                   </h1>
                   <p className="text-[clamp(0.875rem,1.1vw,1rem)] text-[#1B4332]/50 font-medium max-w-xl leading-relaxed mx-auto lg:mx-0">
                      Connecting global connoisseurs directly to the most authenticated artisan nodes across Jammu & Kashmir.
                   </p>
                </div>
              )}
              
              {/* 🛠️ CATEGORY QUICK-NODE */}
              <div className={`flex flex-wrap items-center justify-center lg:justify-end gap-[clamp(6px,0.8vw,10px)] ${user ? 'w-full lg:w-auto !justify-center lg:!justify-start' : ''}`}>
                 {categories.slice(0, 5).map(cat => (
                   <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-[clamp(0.8rem,1.5vw,1.25rem)] py-[clamp(6px,0.8vh,10px)] rounded-full text-[clamp(8px,0.8vw,10px)] font-black uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-[#1B4332] text-white shadow-xl' : 'bg-white/50 border border-[#1B4332]/10 text-[#1B4332]/40 hover:bg-white'}`}
                   >
                     {cat}
                   </button>
                 ))}
              </div>
           </div>
        </header>

        {/* 🔍 COMMAND SEARCH NODE (COMPACT & SLEEK) */}
        <div className="mt-6 mb-6 flex flex-col md:flex-row gap-[clamp(0.75rem,1.5vw,1.5rem)] max-w-5xl mx-auto w-full">
          <div className="relative flex-grow group">
            <div className="absolute inset-y-0 left-0 pl-[clamp(1.25rem,1.8vw,1.75rem)] flex items-center pointer-events-none">
              <Search size={20} className="text-[#1B4332]/10 group-focus-within:text-[#BC6C25] transition-all duration-500" />
            </div>
            <input
              type="text"
              placeholder="Search Pashmina, Saffron, Honey, Textiles..."
              className="w-full bg-white border border-[#1B4332]/5 rounded-[2rem] pl-[clamp(3.5rem,5vw,4.5rem)] pr-[clamp(1.5rem,2vw,2rem)] py-[clamp(0.75rem,1.8vh,1.25rem)] text-sm font-bold text-[#1B4332] shadow-[0_10px_40px_-10px_rgba(27,67,50,0.06)] focus:outline-none focus:ring-4 focus:ring-[#BC6C25]/5 focus:border-[#BC6C25]/30 transition-all duration-500 placeholder:text-[#1B4332]/15 placeholder:italic"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="bg-[#1B4332] text-white px-[clamp(1.5rem,3vw,2.5rem)] py-[clamp(0.75rem,1.8vh,1.25rem)] rounded-[2rem] flex items-center justify-center gap-[clamp(10px,1vw,16px)] font-black text-[clamp(9px,0.9vw,11px)] uppercase tracking-[0.2em] hover:bg-[#BC6C25] hover:scale-[1.02] transition-all duration-500 shadow-xl shadow-[#1B4332]/10 group whitespace-nowrap">
            <SlidersHorizontal size={18} className="group-hover:rotate-180 transition-transform duration-700" />
            Forge Filters
          </button>
        </div>
        
        {/* 📦 RESULTS GRID */}
        <div className="space-y-12">
          <div className="flex items-center justify-between border-b border-[#1B4332]/5 pb-6">
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1B4332]/30 flex items-center gap-3">
               <PackageSearch size={14} /> Found {filteredProducts.length} Treasures
             </span>
             <div className="flex items-center gap-2 text-[10px] font-black text-[#1B4332]/60 cursor-pointer">
                Sort: Newest <ChevronDown size={14} />
             </div>
          </div>

          <AnimatePresence mode="wait">
            {filteredProducts.length > 0 ? (
              <motion.div
                key={activeCategory + search + (user ? 'member' : 'guest')}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <ProductGrid products={filteredProducts} />
                
                {/* 🔒 GUEST TEASER LOCK BANNER */}
                {!user && products.length >= 6 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="mt-20 p-10 rounded-[3rem] bg-gradient-to-br from-[#1B4332] to-[#081C15] text-white text-center space-y-8 relative overflow-hidden shadow-2xl"
                  >
                     <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.03] rounded-full -translate-y-1/2 translate-x-1/3" />
                     <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#BC6C25]/10 rounded-full translate-y-1/3 -translate-x-1/4 blur-2xl" />
                     
                     <div className="relative z-10 space-y-4">
                        <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10">
                           <Lock size={24} className="text-[#BC6C25]" />
                        </div>
                        <h3 className="text-3xl sm:text-4xl font-black tracking-tighter">Unlock the Full Valley Vault</h3>
                        <p className="text-[#FDFBF7]/60 font-medium max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
                          You are currently viewing our guest teaser. Log in to your institutional account to explore our entire authenticated collection of Kashmiri treasures.
                        </p>
                     </div>

                     <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link href="/login">
                          <button className="bg-[#BC6C25] hover:bg-[#D4A373] text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-black/20">
                            Enter the Vault
                          </button>
                        </Link>
                        <Link href="/register">
                          <button className="bg-white/10 hover:bg-white/20 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border border-white/10">
                            Join the Registry
                          </button>
                        </Link>
                     </div>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="text-center py-40 space-y-6"
              >
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <PackageSearch size={40} className="text-[#1B4332]/10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-[#1B4332]">No Treasures Found</h3>
                  <p className="text-[#1B4332]/40 text-sm font-medium">Try adjusting your filters or searching for another heritage node.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
