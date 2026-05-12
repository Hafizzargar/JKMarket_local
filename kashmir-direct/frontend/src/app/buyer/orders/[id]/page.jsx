'use client';

import { useState, useEffect, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Package, Calendar, MapPin, 
  Phone, ShoppingBag, ShieldCheck, ChevronRight,
  Clock, Truck, CheckCircle2, AlertCircle, Loader2
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '../../../../lib/supabase';
import { useAuth } from '../../../../context/AuthContext';

import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

const TRACKING_STEPS = [
  { status: 'pending', label: 'Order Placed', icon: Clock },
  { status: 'approved', label: 'Verified by Admin', icon: ShieldCheck },
  { status: 'processing', label: 'Artisan Preparing', icon: Package },
  { status: 'shipped', label: 'In Transit', icon: Truck },
  { status: 'delivered', label: 'Delivered', icon: CheckCircle2 },
];

export default function OrderDetailsPage({ params }) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;
  const router = useRouter();
  const { user, profile } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    if (user && orderId) {
      fetchOrderDetails();
    }
  }, [user, orderId]);

  const handleCancelOrder = async () => {
    setShowCancelModal(false);
    setIsCancelling(true);
    const loadingToast = toast.loading('Cancelling your order...');

    try {
      // 1. Update Order Status in DB
      const { error: updateErr } = await supabase
        .from('orders')
        .update({ 
          status: 'cancelled',
          cancelled_at: new Date().toISOString()
        })
        .eq('id', order.id);

      if (updateErr) throw updateErr;

      // 2. Trigger Cancellation Emails
      await fetch('/api/orders/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order: {
            ...order,
            buyer_name: profile?.full_name || user?.email?.split('@')[0] || 'Valued Buyer',
            buyer_email: user?.email,
          },
          event: 'cancelled'
        })
      });

      toast.success('Order cancelled successfully', { id: loadingToast });
      fetchOrderDetails(); // Refresh UI
    } catch (err) {
      console.error('Cancellation Error:', err);
      toast.error('Failed to cancel order', { id: loadingToast });
    } finally {
      setIsCancelling(false);
    }
  };

  const fetchOrderDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (error) throw error;
      setOrder(data);
    } catch (err) {
      console.error('Error fetching order details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-[#BC6C25]" size={40} />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#1B4332]/40">Decrypting Order Vault...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-6">
          <AlertCircle size={32} className="text-rose-500" />
        </div>
        <h1 className="text-2xl font-black text-[#1B4332] mb-2">Order Not Found</h1>
        <p className="text-sm text-[#1B4332]/50 max-w-xs mb-8">This order identifier does not exist in our sovereign registry.</p>
        <Link href="/buyer/orders">
          <button className="px-8 h-12 bg-[#1B4332] text-white rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
            <ArrowLeft size={14} /> Back to History
          </button>
        </Link>
      </div>
    );
  }

  const currentStepIndex = TRACKING_STEPS.findIndex(step => step.status === order.status.toLowerCase());

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-8 pb-24">
      {/* 🛡️ CANCELLATION MODAL */}
      <AnimatePresence>
        {showCancelModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 text-left">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCancelModal(false)}
              className="absolute inset-0 bg-[#1B4332]/40 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-2xl border border-[#1B4332]/5 overflow-hidden"
            >
              <div className="bg-organic-mesh absolute inset-0 opacity-5 pointer-events-none" />
              <div className="relative z-10 space-y-6">
                <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 mx-auto">
                   <AlertCircle size={32} />
                </div>
                <div className="text-center space-y-2">
                   <h2 className="text-xl font-black text-[#1B4332] uppercase tracking-tight">Relinquish Treasure?</h2>
                   <p className="text-[11px] font-bold text-[#1B4332]/40 uppercase tracking-widest leading-relaxed">
                      Are you certain you wish to cancel this sovereign order? This action is irreversible once committed.
                   </p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4">
                   <button 
                     onClick={() => setShowCancelModal(false)}
                     className="h-14 rounded-2xl border border-[#1B4332]/10 text-[10px] font-black uppercase tracking-widest text-[#1B4332] hover:bg-[#1B4332]/5 transition-all"
                   >
                      Wait, Keep it
                   </button>
                   <button 
                     onClick={handleCancelOrder}
                     className="h-14 rounded-2xl bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 shadow-lg shadow-rose-500/20 transition-all"
                   >
                      Yes, Cancel
                   </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Navigation */}
        <Link href="/buyer/orders">
          <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#1B4332]/40 hover:text-[#BC6C25] transition-colors mb-12">
            <ArrowLeft size={14} /> Return to Registry
          </button>
        </Link>

        <div className="space-y-12">
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#BC6C25]">Order Fulfillment</span>
              <h1 className="text-4xl font-black text-[#1B4332] tracking-tighter uppercase leading-none">
                Order <span className="italic font-serif font-normal lowercase">#{order.id.slice(-8).toUpperCase()}</span>
              </h1>
            </div>
            <div className="flex flex-col items-end">
              <p className="text-[10px] font-black text-[#1B4332]/30 uppercase tracking-widest">Confirmation Date</p>
              <p className="text-sm font-black text-[#1B4332]">{new Date(order.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
          </header>

          {/* Tracking Progress */}
          <section className="bg-white rounded-[2.5rem] p-8 sm:p-12 border border-[#1B4332]/5 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-8">
              {TRACKING_STEPS.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                const StepIcon = step.icon;

                return (
                  <div key={step.status} className="relative flex flex-col items-center text-center gap-4">
                    {/* Line Connector */}
                    {index < TRACKING_STEPS.length - 1 && (
                      <div className="hidden sm:block absolute top-7 left-1/2 w-full h-[2px] bg-[#1B4332]/5">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: isCompleted ? '100%' : '0%' }}
                          className="h-full bg-[#BC6C25]"
                        />
                      </div>
                    )}
                    
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center relative z-10 transition-all duration-500 ${
                      isCompleted ? 'bg-[#1B4332] text-white shadow-lg shadow-[#1B4332]/20' : 'bg-[#1B4332]/5 text-[#1B4332]/20'
                    } ${isCurrent ? 'ring-4 ring-[#BC6C25]/20' : ''}`}>
                      <StepIcon size={24} />
                    </div>
                    
                    <div className="space-y-1">
                      <p className={`text-[9px] font-black uppercase tracking-widest ${isCompleted ? 'text-[#1B4332]' : 'text-[#1B4332]/20'}`}>
                        {step.label}
                      </p>
                      {isCurrent && (
                        <span className="inline-block px-2 py-0.5 bg-[#BC6C25]/10 text-[#BC6C25] text-[7px] font-black uppercase rounded">Active</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items Summary */}
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#1B4332]/40 ml-2">Authenticated Treasures</h3>
              <div className="bg-white rounded-[2.5rem] border border-[#1B4332]/5 overflow-hidden">
                <div className="p-8 space-y-6">
                  {order.items?.map((item, i) => (
                    <div key={i} className="flex items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-[#1B4332]/5 flex items-center justify-center text-[#1B4332] overflow-hidden">
                          {item.image ? (
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                          ) : (
                            <ShoppingBag size={24} />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-black text-[#1B4332] tracking-tighter">{item.title}</p>
                          <p className="text-[10px] font-bold text-[#1B4332]/40 uppercase tracking-widest">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="text-sm font-black text-[#1B4332]">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-[#1B4332]/5 p-8 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#1B4332]/40">Total Amount Secured</span>
                  <span className="text-2xl font-black text-[#1B4332]">₹{order.total_amount}</span>
                </div>
              </div>
            </div>

            {/* Delivery Details */}
            <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#1B4332]/40 ml-2">Sovereign Drop-off</h3>
              <div className="bg-white rounded-[2.5rem] p-8 border border-[#1B4332]/5 space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-[#BC6C25]">
                    <MapPin size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Destination</span>
                  </div>
                  <p className="text-sm font-bold text-[#1B4332] leading-relaxed">
                    {order.shipping_address}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-[#BC6C25]">
                    <Phone size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Secure Contact</span>
                  </div>
                  <p className="text-sm font-bold text-[#1B4332]">
                    {order.contact_phones}
                  </p>
                </div>

                <div className="pt-6 border-t border-[#1B4332]/5 flex items-center justify-between">
                   <div className="flex items-center gap-3 text-[#1B4332]/20">
                      <ShieldCheck size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest italic">Verification Active</span>
                   </div>
                   
                   {['pending', 'approved'].includes(order.status.toLowerCase()) && (
                      <button 
                        onClick={() => setShowCancelModal(true)}
                        disabled={isCancelling}
                        className="text-[9px] font-black uppercase tracking-widest text-rose-500/40 hover:text-rose-500 transition-colors flex items-center gap-1 group"
                      >
                        <X size={12} className="group-hover:rotate-90 transition-transform" /> Cancel
                      </button>
                   )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
