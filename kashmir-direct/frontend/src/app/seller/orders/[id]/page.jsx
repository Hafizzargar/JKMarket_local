'use client';

import { useState, useEffect, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Package, Truck, Calendar, ShoppingBag, 
  MapPin, User, Phone, CreditCard, ShieldCheck, 
  ExternalLink, AlertCircle, CheckCircle2, Clock
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function OrderDetailsPage({ params }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const { user } = useAuth();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && id) {
      fetchOrderDetails();
    }
  }, [user, id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          profiles:user_id (
            full_name,
            email,
            avatar_url
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setOrder(data);
    } catch (err) {
      console.error('Error fetching order details:', err);
      toast.error('Failed to load order treasures');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-[600px] flex flex-col items-center justify-center gap-4">
      <div className="w-16 h-16 border-4 border-[#BC6C25]/20 border-t-[#BC6C25] rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1B4332]/40">Syncing Registry Node...</p>
    </div>
  );

  if (!order) return (
    <div className="min-h-[600px] flex flex-col items-center justify-center gap-6">
       <div className="w-20 h-20 bg-rose-50 rounded-[2rem] flex items-center justify-center text-rose-500">
          <AlertCircle size={32} />
       </div>
       <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-[#1B4332] uppercase italic">Node Not Found</h2>
          <p className="text-[10px] font-bold text-[#1B4332]/40 uppercase tracking-widest">This order does not exist in our administrative vault.</p>
       </div>
       <button onClick={() => router.back()} className="px-8 py-3 bg-[#1B4332] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">Return to Registry</button>
    </div>
  );

  return (
    <div className="space-y-10 pb-20">
      {/* 🏺 HEADER */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[9px] font-black text-[#1B4332]/40 uppercase tracking-widest hover:text-[#BC6C25] transition-all"
          >
            <ArrowLeft size={14} /> Back to Registry
          </button>
          <div className="space-y-2">
            <h1 className="text-4xl lg:text-5xl font-black text-[#1B4332] tracking-tighter leading-none uppercase italic">
              Order <span className="text-[#BC6C25] font-serif font-normal lowercase">Inspection</span>
            </h1>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-[#1B4332]/5 rounded-lg text-[10px] font-black text-[#1B4332] uppercase tracking-widest border border-[#1B4332]/10">#{order.id.substring(0, 8)}</span>
              <div className="h-1 w-1 rounded-full bg-[#1B4332]/20" />
              <span className="text-[9px] font-bold text-[#1B4332]/40 uppercase tracking-widest italic">{new Date(order.created_at).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className={`px-6 py-3 rounded-2xl border flex items-center gap-3 ${
          order.status === 'delivered' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' :
          order.status === 'shipped' ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-600' :
          order.status === 'processing' ? 'bg-blue-500/10 border-blue-500/20 text-blue-600' :
          order.status === 'cancelled' || order.status === 'rejected_by_seller' ? 'bg-rose-500/10 border-rose-500/20 text-rose-600' :
          'bg-amber-500/10 border-amber-500/20 text-amber-600'
        }`}>
          <div className={`w-2 h-2 rounded-full bg-current animate-pulse`} />
          <span className="text-[11px] font-black uppercase tracking-[0.2em]">{order.status}</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 📦 ITEMS SECTION */}
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-white rounded-[2.5rem] border border-[#1B4332]/5 p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                 <div className="w-10 h-10 rounded-xl bg-[#BC6C25]/10 flex items-center justify-center text-[#BC6C25]">
                    <ShoppingBag size={18} />
                 </div>
                 <h3 className="text-xs font-black text-[#1B4332] uppercase tracking-widest">Ordered Treasures</h3>
              </div>

              <div className="space-y-4">
                 {order.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-6 p-4 rounded-3xl border border-[#1B4332]/5 hover:bg-[#FDFBF7] transition-all group">
                       <div className="w-16 h-16 rounded-2xl overflow-hidden border border-[#1B4332]/10 bg-[#FDFBF7] shrink-0 p-1">
                          <img src={item.image} className="w-full h-full object-cover rounded-xl" alt={item.title} />
                       </div>
                       <div className="flex-1">
                          <h4 className="text-[13px] font-black text-[#1B4332] uppercase italic leading-tight group-hover:text-[#BC6C25] transition-colors">{item.title}</h4>
                          <p className="text-[9px] font-bold text-[#1B4332]/30 uppercase tracking-widest mt-1">Quantity: {item.quantity}</p>
                       </div>
                       <div className="text-right">
                          <p className="text-sm font-black text-[#1B4332]">₹{item.price * item.quantity}</p>
                          <p className="text-[8px] font-bold text-[#BC6C25] uppercase tracking-widest">₹{item.price} / unit</p>
                       </div>
                    </div>
                 ))}
              </div>

              <div className="mt-10 pt-8 border-t border-dashed border-[#1B4332]/10 flex justify-between items-end">
                 <div className="space-y-1">
                    <p className="text-[9px] font-black text-[#1B4332]/20 uppercase tracking-widest">Payment Protocol</p>
                    <div className="flex items-center gap-2 px-3 py-1 bg-[#1B4332]/5 rounded-lg border border-[#1B4332]/10 w-fit">
                       <CreditCard size={12} className="text-[#1B4332]/40" />
                       <span className="text-[10px] font-black text-[#1B4332] uppercase">Cash on Delivery</span>
                    </div>
                 </div>
                 <div className="text-right space-y-1">
                    <p className="text-[10px] font-black text-[#1B4332]/30 uppercase tracking-widest italic">Registry Total</p>
                    <p className="text-3xl font-black text-[#1B4332] tracking-tighter">₹{order.total_amount?.toLocaleString()}</p>
                 </div>
              </div>
           </div>

           {/* 🛑 REJECTION INFO (If exists) */}
           {order.status === 'rejected_by_seller' && order.rejection_reason && (
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-rose-50 rounded-[2rem] border border-rose-100 p-8 space-y-4"
             >
                <div className="flex items-center gap-3 text-rose-600">
                   <AlertCircle size={20} />
                   <h3 className="text-xs font-black uppercase tracking-widest">Rejection Justification</h3>
                </div>
                <p className="text-[13px] font-bold text-rose-800 italic leading-relaxed">
                   "{order.rejection_reason}"
                </p>
             </motion.div>
           )}
        </div>

        {/* 🗺️ LOGISTICS & CUSTOMER SECTION */}
        <div className="space-y-8">
           {/* 👤 CUSTOMER NODE */}
           <div className="bg-white rounded-[2.5rem] border border-[#1B4332]/5 p-8 shadow-sm">
              <h3 className="text-[10px] font-black text-[#1B4332]/20 uppercase tracking-[0.2em] mb-6">Customer Node</h3>
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1B4332] to-[#0A1A13] flex items-center justify-center text-white font-black text-sm">
                    {order.profiles?.full_name?.charAt(0).toUpperCase() || 'G'}
                 </div>
                 <div>
                    <p className="text-sm font-black text-[#1B4332] uppercase">{order.profiles?.full_name || 'Guest User'}</p>
                    <p className="text-[9px] font-bold text-[#1B4332]/40 lowercase tracking-tight">{order.profiles?.email}</p>
                 </div>
              </div>
              <div className="space-y-4">
                 <div className="flex items-start gap-3">
                    <MapPin size={16} className="text-[#BC6C25] shrink-0 mt-0.5" />
                    <div>
                       <p className="text-[9px] font-black text-[#1B4332]/20 uppercase tracking-widest mb-1">Shipping Coordinates</p>
                       <p className="text-[11px] font-bold text-[#1B4332] uppercase italic leading-relaxed">{order.shipping_address}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3">
                    <Phone size={16} className="text-[#BC6C25] shrink-0" />
                    <div>
                       <p className="text-[9px] font-black text-[#1B4332]/20 uppercase tracking-widest mb-1">Contact Protocol</p>
                       <p className="text-[11px] font-bold text-[#1B4332]">{order.contact_phones || 'No Phone Node'}</p>
                    </div>
                 </div>
              </div>
           </div>

           {/* 🚚 LOGISTICS NODE */}
           {(order.status === 'shipped' || order.status === 'delivered') && (
             <div className="bg-gradient-to-br from-[#1B4332] to-[#0A1A13] rounded-[2.5rem] p-8 text-white shadow-xl shadow-[#1B4332]/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full -mr-16 -mt-16" />
                <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-6 relative z-10">Logistics Node</h3>
                <div className="space-y-6 relative z-10">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 backdrop-blur-md">
                         <Truck size={24} className="text-[#BC6C25]" />
                      </div>
                      <div>
                         <p className="text-[10px] font-black uppercase tracking-widest text-white/60">Partner</p>
                         <p className="text-lg font-black uppercase italic">{order.courier_name}</p>
                      </div>
                   </div>
                   <div className="p-4 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-md">
                      <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Waybill / Tracking ID</p>
                      <p className="text-sm font-black tracking-widest text-[#BC6C25] font-mono">{order.tracking_id}</p>
                   </div>
                   {order.status === 'shipped' && (
                     <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400">
                        <Clock size={12} />
                        <span>In Transit</span>
                     </div>
                   )}
                   {order.status === 'delivered' && (
                     <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400">
                        <CheckCircle2 size={12} />
                        <span>Registry Finalized</span>
                     </div>
                   )}
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
