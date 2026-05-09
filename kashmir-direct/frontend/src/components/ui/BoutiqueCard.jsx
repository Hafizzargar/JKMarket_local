'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Plus, Loader2, Heart, Star, ShoppingCart, Minus, Trash2 } from 'lucide-react';

/**
 * 🏔️ BOUTIQUE CARD (REUSABLE COMPONENT)
 * A high-fidelity, compact card design inspired by premium artisan marketplaces.
 * 
 * Props:
 * - title: Primary text
 * - subtitle: Small uppercase text above title
 * - price: Current price
 * - originalPrice: (Optional) Strikethrough price
 * - image: Product image URL
 * - rating: (Optional) Star rating value
 * - badge: (Optional) Text for top-left badge (default: 'Heritage')
 * - location: (Optional) Location text
 * - tags: (Array) Small pills below title
 * - unit: (Optional) Unit of measurement (default: 'pc')
 * - isWishlisted: Boolean for heart icon state
 * - isLoading: Boolean for action button loading state
 * - onAction: Function for primary button click
 * - onDecrement: Function for quantity decrement
 * - onWishlist: Function for wishlist toggle click
 * - actionIcon: Custom icon for the primary button (default: Plus)
 * - variant: 'default' | 'compact' (Optional)
 */

export default function BoutiqueCard({
  title,
  subtitle,
  price,
  originalPrice,
  image,
  rating = 4.9,
  badge = 'Heritage',
  location = '',
  tags = [],
  unit = 'pc',
  isWishlisted = false,
  isLoading = false,
  quantity = 0,
  onAction,
  onDecrement,
  onWishlist,
  actionIcon: ActionIcon = Plus,
  className = ""
}) {
  const discount = originalPrice && originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`group relative bg-[#F9F6EE] rounded-[1.5rem] p-1.5 transition-all duration-500 overflow-hidden shadow-sm hover:shadow-xl border border-transparent hover:border-[#1B4332]/5 ${className}`}
    >
      {/* 🖼️ IMAGE CONTAINER */}
      <div className="relative aspect-[16/11] rounded-[1.2rem] overflow-hidden bg-[#F2EDE0] flex items-center justify-center p-4">
        {/* 🏷️ BADGE STACK */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
          {badge && (
            <div className="bg-[#1B4332] px-3 py-1 rounded-full shadow-lg">
              <span className="text-[9px] font-bold text-white uppercase tracking-wider">
                {badge}
              </span>
            </div>
          )}
          {discount > 0 && (
            <div className="bg-red-500 px-2 py-0.5 rounded-full shadow-lg self-start">
              <span className="text-[8px] font-black text-white uppercase tracking-tighter">
                {discount}% OFF
              </span>
            </div>
          )}
        </div>

        {/* ❤️ WISHLIST ACTION */}
        <div className="absolute top-3 right-3 z-20">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onWishlist?.();
            }}
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg border border-white/50"
          >
            <Heart 
              className={`w-4 h-4 transition-colors ${isWishlisted ? "drop-shadow-[0_2px_5px_rgba(139,92,246,0.5)]" : ""}`}
              fill={isWishlisted ? "url(#boutiqueHeartGradient)" : "none"} 
              stroke={isWishlisted ? "none" : "#D1D5DB"} 
              strokeWidth={2}
            />
          </motion.button>
        </div>

        {/* IMAGE */}
        {image ? (
          <motion.img
            src={image}
            alt={title}
            whileHover={{ scale: 1.05 }}
            className="w-full h-full object-contain drop-shadow-lg"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center opacity-10">
            <span className="text-2xl">🏔️</span>
          </div>
        )}
      </div>

      {/* 📝 CONTENT AREA */}
      <div className="p-3 bg-white rounded-b-[1.2rem] -mt-4 relative z-10 shadow-[0_-5px_15px_rgba(242,237,224,0.3)]">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-bold text-gray-300 uppercase tracking-[0.2em]">
              {subtitle || 'Premium'}
            </p>
            <div className="flex items-center gap-0.5">
              <Star size={10} fill="#D4A373" stroke="#D4A373" />
              <span className="text-[9px] font-bold text-gray-400">{rating}</span>
            </div>
          </div>

          <h3 className="text-[14px] font-bold text-[#1B4332] leading-none tracking-tight line-clamp-1">
            {title}
          </h3>

          <div className="flex items-center gap-1 opacity-60">
             <MapPin size={8} className="text-red-400 fill-red-400" />
             <span className="text-[10px] font-medium text-gray-500 line-clamp-1">{location}</span>
          </div>

          {/* TAGS */}
          <div className="flex flex-wrap gap-1 py-0.5">
            {tags.slice(0, 2).map((tag, i) => (
              <span key={i} className="bg-[#F9F6EE] text-[#8B7E74] text-[8px] font-black px-2 py-0.5 rounded-full border border-[#F2EDE0]">
                {tag}
              </span>
            ))}
          </div>

          {/* PRICE & ACTION */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-50">
            <div className="flex flex-col">
              {originalPrice && originalPrice > price && (
                <span className="text-[9px] font-bold text-gray-300 line-through leading-none mb-0.5">
                  ₹{originalPrice}
                </span>
              )}
              <div className="flex baseline gap-0.5">
                <span className="text-[18px] font-black text-[#1B4332]">₹{price}</span>
                <span className="text-[10px] font-semibold text-gray-400">/{unit}</span>
              </div>
            </div>

            {/* 🛒 CART/QUANTITY CONTROLLER */}
            <motion.div 
              layout
              className={`relative flex items-center bg-[#1B4332] text-white rounded-xl shadow-lg shadow-[#1B4332]/20 transition-all overflow-hidden ${quantity > 0 ? 'px-1' : ''}`}
            >
              <AnimatePresence mode="wait">
                {quantity === 0 ? (
                  <motion.button
                    key="add"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onAction?.();
                    }}
                    disabled={isLoading}
                    className="w-9 h-9 flex items-center justify-center hover:bg-[#153225] transition-colors"
                  >
                    {isLoading ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <ActionIcon size={16} strokeWidth={3} />
                    )}
                  </motion.button>
                ) : (
                  <motion.div
                    key="quantity"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 'auto', opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="flex items-center gap-2 h-9"
                  >
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onDecrement?.();
                      }}
                      className="w-7 h-7 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors"
                    >
                      {quantity === 1 ? <Trash2 size={12} /> : <Minus size={12} strokeWidth={3} />}
                    </button>
                    
                    <span className="text-[11px] font-black min-w-[1ch] text-center">
                      {quantity}
                    </span>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onAction?.();
                      }}
                      className="w-7 h-7 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <Plus size={12} strokeWidth={3} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>

      {/* GRADIENT DEFINITION */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="boutiqueHeartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DDD6FE" />
            <stop offset="50%" stopColor="#A78BFA" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
}
