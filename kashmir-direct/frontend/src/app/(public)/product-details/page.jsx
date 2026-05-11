'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../../store/useStore';
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Star, MapPin, Sparkles, ShieldCheck, 
  Truck, CornerDownLeft, ShoppingBag, Heart, Share2,
  ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProductDetailsPage() {
  const router = useRouter();
  const { selectedProduct: product, toggleWishlist, wishlist } = useStore();
  const { user, isAdmin, profile } = useAuth();
  const { addToCart } = useCart();
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!product) {
      router.push('/products');
    } else {
      setSelectedImage(product.images?.[0]);
    }
  }, [product, router]);

  if (!product) return null;

  const isInWishlist = wishlist?.some(p => p.id === product.id);
  const isAuthorizedBuyer = user && !isAdmin && (profile?.role === 'customer' || profile?.role === 'buyer');

  const handleAddToCart = () => {
    if (!isAuthorizedBuyer) {
      toast.error('Please login as a buyer to shop', { id: 'auth-gate' });
      router.push('/login');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      addToCart({ ...product, quantity });
      toast.success('Added to collection', { icon: '📦' });
      setLoading(false);
    }, 800);
  };

  const handleWishlist = () => {
    if (!isAuthorizedBuyer) {
      toast.error('Login to save items', { id: 'wishlist-gate' });
      router.push('/login');
      return;
    }
    toggleWishlist(product, user.id);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-24 pb-12 selection:bg-[#BC6C25]/20">
      {/* 🏔️ AMBIENT BACKGROUND */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#BC6C25]/[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#1B4332]/[0.03] rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* 🧭 NAVIGATION */}
        <button 
          onClick={() => router.back()}
          className="group mb-8 inline-flex items-center gap-3 px-5 py-2.5 bg-white/60 backdrop-blur-xl border border-white rounded-2xl text-[#1B4332]/60 hover:text-[#BC6C25] hover:shadow-xl transition-all active:scale-95"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[9px] font-black uppercase tracking-[0.2em]">Return</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* 🖼️ GALLERY NODE (LEFT) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative group">
              <div className="aspect-square rounded-[2.5rem] bg-white p-8 flex items-center justify-center border border-white shadow-[0_32px_64px_-16px_rgba(27,67,50,0.06)] overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={selectedImage}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    src={selectedImage} 
                    className="w-full h-full object-contain drop-shadow-xl" 
                  />
                </AnimatePresence>
              </div>

              {/* FLOATING ACTION OVERLAYS */}
              <div className="absolute top-6 right-6 flex flex-col gap-2">
                <button 
                  onClick={handleWishlist}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-xl border transition-all shadow-lg ${isInWishlist ? 'bg-[#BC6C25] border-[#BC6C25] text-white' : 'bg-white/80 border-white text-[#1B4332]/20 hover:text-[#BC6C25]'}`}
                >
                  <Heart size={18} fill={isInWishlist ? "currentColor" : "none"} />
                </button>
              </div>
            </div>

            {/* THUMBNAILS */}
            <div className="flex gap-3 overflow-x-auto no-scrollbar py-1">
              {product.images?.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setSelectedImage(img)}
                  className={`relative shrink-0 w-20 h-20 rounded-xl bg-white p-1.5 border transition-all duration-300 ${selectedImage === img ? 'border-[#BC6C25] ring-4 ring-[#BC6C25]/5' : 'border-white opacity-40 hover:opacity-100'}`}
                >
                  <img src={img} className="w-full h-full object-cover rounded-lg" />
                </button>
              ))}
            </div>
          </div>

          {/* 📜 INTEL NODE (RIGHT) */}
          <div className="lg:col-span-6 space-y-8 lg:pt-4">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#BC6C25]/10 border border-[#BC6C25]/20">
                  <Sparkles size={10} className="text-[#BC6C25]" />
                  <span className="text-[8px] font-black tracking-[0.2em] uppercase text-[#BC6C25]">{product.category}</span>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1B4332]/5 border border-[#1B4332]/10">
                  <ShieldCheck size={10} className="text-[#1B4332]" />
                  <span className="text-[8px] font-black tracking-[0.2em] uppercase text-[#1B4332]">Authentic</span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-[#1B4332] tracking-tighter leading-none">
                {product.title}
              </h1>

              <div className="flex items-center justify-between py-4 border-y border-[#1B4332]/5">
                <div className="flex flex-col">
                   <span className="text-[9px] font-black uppercase tracking-widest text-[#1B4332]/30 mb-0.5">Value</span>
                   <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-[#1B4332]">₹{product.price}</span>
                      <span className="text-[11px] font-bold text-[#1B4332]/40">/{product.unit}</span>
                   </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end mb-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} fill={i < 4 ? "#BC6C25" : "none"} stroke="#BC6C25" />
                    ))}
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#1B4332]/30">4.9 (128 Connoisseurs)</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-[#1B4332]/30">
                <MapPin size={12} className="text-red-400" />
                Origin: {product.location}
              </div>
              <p className="text-sm text-[#1B4332]/70 leading-relaxed font-medium">
                {product.description || "Handcrafted using traditional techniques passed down through generations. Authenticated for purity and heritage."}
              </p>
            </div>

            {/* ACTION CENTER */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3">
                <div className="h-14 px-4 rounded-xl bg-white border border-[#1B4332]/5 flex items-center gap-6 shadow-sm">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="text-[#1B4332]/40 hover:text-[#BC6C25] transition-colors font-black text-lg">-</button>
                  <span className="text-base font-black text-[#1B4332] w-4 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} className="text-[#1B4332]/40 hover:text-[#BC6C25] transition-colors font-black text-lg">+</button>
                </div>
                
                <button 
                  onClick={handleAddToCart}
                  disabled={loading}
                  className="flex-1 h-14 bg-[#1B4332] hover:bg-[#2D5A47] text-white rounded-xl shadow-xl shadow-[#1B4332]/10 flex items-center justify-center gap-3 transition-all hover:scale-[1.01] active:scale-95 group overflow-hidden"
                >
                  <AnimatePresence mode="wait">
                    {loading ? (
                      <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Processing...</span>
                      </motion.div>
                    ) : (
                      <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
                        <ShoppingBag size={18} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Acquire Now</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </div>

              {/* LOGISTICS NODES */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-white/40 border border-white flex items-center gap-3 group hover:bg-white transition-all">
                  <div className="w-8 h-8 rounded-lg bg-[#BC6C25]/5 flex items-center justify-center text-[#BC6C25]">
                    <Truck size={14} />
                  </div>
                  <div>
                    <h5 className="text-[9px] font-black uppercase tracking-tight text-[#1B4332]">Express</h5>
                    <p className="text-[8px] font-bold text-[#1B4332]/40 italic">Node Delivery</p>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-white/40 border border-white flex items-center gap-3 group hover:bg-white transition-all">
                  <div className="w-8 h-8 rounded-lg bg-[#1B4332]/5 flex items-center justify-center text-[#1B4332]">
                    <CornerDownLeft size={14} />
                  </div>
                  <div>
                    <h5 className="text-[9px] font-black uppercase tracking-tight text-[#1B4332]">Returns</h5>
                    <p className="text-[8px] font-bold text-[#1B4332]/40 italic">Heritage Backed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RELATED SECTION TEASER */}
        <div className="mt-20 space-y-8 pb-12">
          <div className="flex items-end justify-between border-b border-[#1B4332]/5 pb-6">
            <div className="space-y-2">
              <h3 className="text-3xl font-black text-[#1B4332] tracking-tighter">Related <span className="text-[#BC6C25] font-serif italic font-normal">Nodes</span></h3>
              <p className="text-[9px] font-black text-[#1B4332]/30 uppercase tracking-[0.4em]">Expand collection</p>
            </div>
            <button className="flex items-center gap-2 text-[9px] font-black text-[#BC6C25] uppercase tracking-widest hover:gap-4 transition-all">
              Explore All <ChevronRight size={12} />
            </button>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 opacity-40 grayscale pointer-events-none">
             {[...Array(4)].map((_, i) => (
               <div key={i} className="h-48 rounded-[1.5rem] bg-white/20 border border-white" />
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
