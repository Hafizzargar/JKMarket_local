'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../../store/useStore';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import { Heart, ShoppingBag, Trash2, ArrowLeft, Sparkles, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function BuyerWishlistPage() {
  const router = useRouter();
  const { wishlist, toggleWishlist, setSelectedProduct } = useStore();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleMoveToCart = (product) => {
    addToCart(product);
    toggleWishlist(product);
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    router.push('/product-details');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-4 sm:pt-6 pb-20">
      <div className="max-w-7xl mx-auto px-[clamp(1rem,5vw,2.5rem)] relative z-10">
        
        {/* 🏛️ HEADER */}
        <header className="mb-8 space-y-6">
           <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="space-y-4">
                 <motion.div
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-[#1B4332]/10 bg-white/50 backdrop-blur-md"
                 >
                    <Heart size={12} className="text-[#BC6C25]" fill="currentColor" />
                    <span className="text-[9px] font-black tracking-[0.4em] uppercase text-[#1B4332]/40">
                      Personal Vault
                    </span>
                 </motion.div>

                 <div className="space-y-2">
                    <h1 className="text-4xl sm:text-5xl font-black text-[#1B4332] tracking-tighter leading-none">
                       My <span className="text-[#BC6C25] font-serif italic font-normal">Wishlist</span>
                    </h1>
                    <p className="text-sm text-[#1B4332]/50 font-medium max-w-md">
                       Your collection of authenticated Kashmiri treasures, saved for later.
                    </p>
                 </div>
              </div>

              <Link href="/buyer/products">
                 <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#1B4332] hover:text-[#BC6C25] transition-colors group">
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Shop
                 </button>
              </Link>
           </div>
        </header>

        {/* 📦 WISHLIST GRID */}
        <div className="relative">
          <AnimatePresence mode="popLayout">
            {wishlist.length > 0 ? (
              <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {wishlist.map((product) => (
                  <motion.div
                    layout
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="group relative bg-white rounded-[2.5rem] p-5 border border-[#1B4332]/5 shadow-[0_20px_50px_-20px_rgba(27,67,50,0.08)] hover:shadow-[0_30px_60px_-15px_rgba(27,67,50,0.12)] transition-all duration-700 overflow-hidden"
                  >
                    {/* Image Node (Clickable) */}
                    <div 
                      onClick={() => handleViewDetails(product)}
                      className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-[#FDFBF7] mb-6 cursor-pointer"
                    >
                      <Image 
                        src={product.image_url || product.images?.[0] || '/placeholder-product.jpg'} 
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
                        onError={(e) => {
                          e.currentTarget.src = 'https://placehold.co/600x800?text=Kashmir+Treasure';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#081C15]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      
                      {/* Actions Over Image */}
                      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(product, user.id);
                          }}
                          className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Content Node (Clickable) */}
                    <div className="px-2 space-y-4">
                      <div 
                        onClick={() => handleViewDetails(product)}
                        className="flex justify-between items-start cursor-pointer group/title"
                      >
                        <div className="space-y-1 min-w-0">
                          <h3 className="text-sm font-black text-[#1B4332] truncate uppercase tracking-tight group-hover/title:text-[#BC6C25] transition-colors">
                            {product.title}
                          </h3>
                          <p className="text-[10px] font-bold text-[#BC6C25] uppercase tracking-widest">
                            {product.category}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-black text-[#1B4332]">₹{product.price}</p>
                          <p className="text-[8px] font-bold text-[#1B4332]/30 uppercase">Per {product.unit || 'Unit'}</p>
                        </div>
                      </div>

                      <button 
                        onClick={() => handleMoveToCart(product)}
                        className="w-full bg-[#1B4332] text-white py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#BC6C25] transition-all shadow-xl shadow-[#1B4332]/10"
                      >
                        <ShoppingCart size={16} />
                        Move to Cart
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-32 space-y-8 bg-white/50 backdrop-blur-md rounded-[3rem] border border-dashed border-[#1B4332]/10"
              >
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-xl relative">
                   <Heart size={40} className="text-[#1B4332]/5" />
                   <Sparkles size={20} className="absolute top-2 right-2 text-[#BC6C25]/20 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-[#1B4332]">Your Wishlist is Empty</h3>
                  <p className="text-[#1B4332]/40 text-sm font-medium max-w-xs mx-auto uppercase tracking-wider leading-relaxed">
                    Start exploring the valley to find your next treasure.
                  </p>
                </div>
                <Link href="/buyer/products">
                  <button className="bg-[#1B4332] text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#BC6C25] transition-all shadow-xl shadow-[#1B4332]/10">
                    Explore Marketplace
                  </button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
