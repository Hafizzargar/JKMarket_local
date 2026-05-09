'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingBag, ArrowRight, Minus, Plus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import Button from '../ui/Button';

export default function CartSidebar() {
  const { cart, isOpen, setIsOpen, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-[#081C15]/40 backdrop-blur-sm z-[60]"
          />

          {/* Sidebar */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-[#FDFBF7] shadow-2xl z-[70] flex flex-col border-l border-[#1B4332]/10"
          >
            {/* Header */}
            <div className="p-8 border-b border-[#1B4332]/5 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-[#1B4332] tracking-tighter uppercase italic">Your Vault</h2>
                <p className="text-[10px] font-bold text-[#1B4332]/30 uppercase tracking-widest mt-1">
                  {cartCount} Items Authenticated
                </p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-[#1B4332]/5 rounded-xl transition-all"
              >
                <X size={20} className="text-[#1B4332]" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-grow overflow-y-auto p-8 space-y-6 no-scrollbar">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-20 h-20 bg-[#1B4332]/5 rounded-3xl flex items-center justify-center text-3xl opacity-20">
                    <ShoppingBag size={40} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-black text-[#1B4332]">Vault Empty</h3>
                    <p className="text-xs text-[#1B4332]/40 font-bold uppercase tracking-widest leading-relaxed px-12">
                      Start adding authenticated valley treasures to your personal vault.
                    </p>
                  </div>
                  <Button onClick={() => setIsOpen(false)} variant="secondary" className="px-10">Browse Marketplace</Button>
                </div>
              ) : (
                cart.map((item) => (
                  <motion.div 
                    layout
                    key={item.id}
                    className="flex gap-6 group"
                  >
                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white border border-[#1B4332]/5 shrink-0">
                      <img src={item.images?.[0]} className="w-full h-full object-cover" alt={item.title} />
                    </div>
                    <div className="flex-grow space-y-2">
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-black text-[#1B4332] leading-tight uppercase">{item.title}</h4>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <p className="text-[10px] font-bold text-[#BC6C25] uppercase tracking-widest">₹{item.price} / {item.unit}</p>
                      
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-3 bg-[#1B4332]/5 rounded-lg p-1">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 hover:bg-white rounded-md transition-all text-[#1B4332]"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-xs font-black text-[#1B4332] min-w-[20px] text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 hover:bg-white rounded-md transition-all text-[#1B4332]"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <p className="text-xs font-black text-[#1B4332]">₹{item.price * item.quantity}</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-8 bg-[#FDFBF7] border-t border-[#1B4332]/10 space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#1B4332]/30">Vault Subtotal</span>
                  <span className="text-2xl font-black text-[#1B4332] tracking-tighter">₹{cartTotal}</span>
                </div>
                <Button className="w-full h-14 rounded-2xl group text-xs">
                  Proceed to Checkout <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <p className="text-[9px] font-bold text-center text-[#1B4332]/20 uppercase tracking-[0.2em]">
                  Secure Sovereign Fulfillment Guaranteed
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
