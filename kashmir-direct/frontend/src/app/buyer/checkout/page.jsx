'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, MapPin, Phone, User, 
  CreditCard, ArrowLeft, ShoppingBag,
  Truck, CheckCircle2, ChevronRight
} from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import { supabase } from '../../../lib/supabase';
import { useRouter } from 'next/navigation';
import Button from '../../../components/ui/Button';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user, profile } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    address: '',
    phone_primary: '',
    phone_secondary: ''
  });

  // 🔄 PRE-FILL: Load existing info from profile
  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        address: profile.address || '',
        phone_primary: profile.phone_primary || '',
        phone_secondary: profile.phone_secondary || ''
      });
    }
  }, [profile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return toast.error('Your vault is empty!');
    
    setIsSubmitting(true);
    const loadingToast = toast.loading('Securing your order...');

    try {
      // 1. Update Profile (Save for next time)
      const { error: profileErr } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          address: formData.address,
          phone_primary: formData.phone_primary,
          phone_secondary: formData.phone_secondary
        })
        .eq('id', user.id);

      if (profileErr) throw profileErr;

      // 2. Create Order
      const { data: order, error: orderErr } = await supabase
        .from('orders')
        .insert([{
          // user_id is handled by DEFAULT auth.uid() in DB
          total_amount: cartTotal,
          shipping_address: formData.address,
          contact_phones: `${formData.phone_primary}${formData.phone_secondary ? `, ${formData.phone_secondary}` : ''}`,
          items: cart, 
          status: 'pending'
        }])
        .select()
        .single();

      if (orderErr) throw orderErr;

      // 3. Trigger Email Notifications (Nodemailer)
      try {
        await fetch('/api/orders/email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            order: {
              ...order,
              buyer_name: profile?.full_name || user?.email?.split('@')[0] || 'Valued Buyer',
              buyer_email: user?.email,
              items: cart
            },
            event: 'created'
          })
        });
      } catch (emailErr) {
        console.error('Email Notification Failed:', emailErr);
        // We don't block the user if email fails, as the order is already in DB
      }

      // 4. Cleanup & Redirect
      await clearCart();
      toast.success('Order placed successfully!', { id: loadingToast });
      router.push(`/buyer/checkout/success?id=${order.id}`);

    } catch (err) {
      console.error('Checkout Error Detailed:', err);
      const errorMessage = err.message || err.details || 'Fulfillment Security Error';
      toast.error(`Verification Failed: ${errorMessage}`, { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="w-24 h-24 bg-[#1B4332]/5 rounded-full flex items-center justify-center text-[#1B4332]/20">
          <ShoppingBag size={48} />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-[#1B4332] uppercase tracking-tighter italic">Vault is Empty</h1>
          <p className="text-sm text-[#1B4332]/40 font-bold uppercase tracking-widest max-w-xs mx-auto">
            You must have treasures in your vault before proceeding to the sovereign checkout.
          </p>
        </div>
        <Link href="/buyer/products">
          <Button variant="secondary" className="px-12">Return to Marketplace</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto pt-4">
        {/* Header Navigation */}
        <Link href="/buyer/products" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-[#1B4332]/40 hover:text-[#1B4332] transition-colors mb-6 group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Continue Shopping
        </Link>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* LEFT: Shipping Form */}
          <div className="flex-grow space-y-6 w-full lg:w-auto">
            <header className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-[#BC6C25]/10 text-[#BC6C25] text-[10px] font-black uppercase tracking-[0.2em] rounded-full">Secure Checkout</span>
                <div className="h-px flex-grow bg-[#1B4332]/5" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-black text-[#1B4332] tracking-tighter uppercase italic leading-none">
                Delivery Details
              </h1>
              <p className="text-[10px] text-[#1B4332]/30 font-bold uppercase tracking-widest">
                Specify your sovereign drop-off location
              </p>
            </header>

            <form onSubmit={handlePlaceOrder} className="space-y-4">
              {/* Name Field */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-[#1B4332]/40 flex items-center gap-2">
                  <User size={10} className="text-[#BC6C25]" /> Recipient Full Name
                </label>
                <input 
                  required
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  placeholder="e.g. Sheikh Mohammad"
                  className="w-full bg-white border border-[#1B4332]/10 rounded-xl p-3 text-sm font-bold text-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/10 transition-all outline-none"
                />
              </div>

              {/* Address Field */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-[#1B4332]/40 flex items-center gap-2">
                  <MapPin size={10} className="text-[#BC6C25]" /> Delivery Address
                </label>
                <textarea 
                  required
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Street, Landmark, District, PIN Code"
                  className="w-full bg-white border border-[#1B4332]/10 rounded-xl p-3 text-sm font-bold text-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/10 transition-all outline-none resize-none"
                />
              </div>

              {/* Phone Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-[#1B4332]/40 flex items-center gap-2">
                    <Phone size={10} className="text-[#BC6C25]" /> Primary Phone
                  </label>
                  <input 
                    required
                    name="phone_primary"
                    value={formData.phone_primary}
                    onChange={handleInputChange}
                    placeholder="+91 XXXX XXX XXX"
                    className="w-full bg-white border border-[#1B4332]/10 rounded-xl p-3 text-sm font-bold text-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/10 transition-all outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-[#1B4332]/40 flex items-center gap-2">
                    <Phone size={10} className="text-[#BC6C25]/40" /> Alternate Phone
                  </label>
                  <input 
                    name="phone_secondary"
                    value={formData.phone_secondary}
                    onChange={handleInputChange}
                    placeholder="+91 XXXX XXX XXX"
                    className="w-full bg-white border border-[#1B4332]/10 rounded-xl p-3 text-sm font-bold text-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/10 transition-all outline-none"
                  />
                </div>
              </div>

              {/* Payment Method Notice */}
              <div className="p-4 bg-white border border-[#BC6C25]/20 rounded-2xl space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#BC6C25]/10 flex items-center justify-center text-[#BC6C25]">
                    <CreditCard size={16} />
                  </div>
                  <div>
                    <h3 className="text-[10px] font-black text-[#1B4332] uppercase tracking-wider">Payment Method</h3>
                    <p className="text-[9px] font-bold text-[#BC6C25] uppercase">Pay on Delivery (COD)</p>
                  </div>
                  <CheckCircle2 size={14} className="ml-auto text-[#1B4332]" />
                </div>
                <p className="text-[8px] text-[#1B4332]/40 font-bold uppercase tracking-widest leading-relaxed">
                  For your safety and convenience, we exclusively offer Pay on Delivery. Inspect your valley treasures before payment.
                </p>
              </div>

              {/* Submit Button (Mobile) */}
              <div className="lg:hidden pt-4">
                 <Button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-16 rounded-2xl flex items-center justify-center gap-3 group"
                 >
                    {isSubmitting ? 'Authenticating...' : `Confirm Order • ₹${cartTotal}`}
                    {!isSubmitting && <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                 </Button>
              </div>
            </form>
          </div>

          {/* RIGHT: Order Summary */}
          <aside className="w-full lg:w-[360px] space-y-4">
            <div className="bg-white border border-[#1B4332]/10 rounded-[1.5rem] p-6 shadow-sm space-y-6 sticky top-20">
              <header className="flex items-center justify-between">
                <h2 className="text-lg font-black text-[#1B4332] tracking-tight uppercase italic">Vault Items</h2>
                <span className="px-2 py-0.5 bg-[#1B4332]/5 text-[#1B4332] text-[8px] font-black uppercase rounded-md">
                  {cart.length} Products
                </span>
              </header>

              {/* Items List */}
              <div className="space-y-4 max-h-[30vh] overflow-y-auto no-scrollbar">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3 group">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#FDFBF7] border border-[#1B4332]/5 shrink-0">
                      <img src={item.images?.[0]} className="w-full h-full object-cover" alt={item.title} />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="text-[10px] font-black text-[#1B4332] uppercase truncate">{item.title}</h4>
                      <p className="text-[8px] font-bold text-[#BC6C25] uppercase mt-0.5">₹{item.price} × {item.quantity}</p>
                    </div>
                    <p className="text-[10px] font-black text-[#1B4332] self-center">₹{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>

              {/* Calculations */}
              <div className="space-y-2 pt-4 border-t border-[#1B4332]/5">
                <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-[#1B4332]/40">
                  <span>Subtotal</span>
                  <span>₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-[#1B4332]/40">
                  <span>Shipping</span>
                  <span className="text-[#1B4332]">Free</span>
                </div>
                <div className="flex justify-between items-center pt-2 text-[#1B4332]">
                  <span className="text-[10px] font-black uppercase tracking-widest">Total Amount</span>
                  <span className="text-2xl font-black tracking-tighter">₹{cartTotal}</span>
                </div>
              </div>

              {/* Submit Button (Desktop) */}
              <Button 
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="hidden lg:flex w-full h-14 rounded-xl items-center justify-center gap-2 group mt-2 text-[10px]"
              >
                {isSubmitting ? 'Authenticating...' : 'Confirm Order'}
                {!isSubmitting && <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />}
              </Button>

              <div className="flex items-center justify-center gap-2 pt-2 opacity-30">
                <ShieldCheck size={12} className="text-[#1B4332]" />
                <span className="text-[7px] font-black uppercase tracking-[0.3em] text-[#1B4332]">Sovereign Encryption Active</span>
              </div>
            </div>

            {/* Extra Trust Badge */}
            <div className="bg-[#1B4332] rounded-[1.2rem] p-4 text-white flex gap-3 items-center overflow-hidden relative shadow-lg shadow-[#1B4332]/20">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                <Truck size={16} className="text-[#BC6C25]" />
              </div>
              <div>
                <h4 className="text-[9px] font-black uppercase tracking-widest">Valley Shipping</h4>
                <p className="text-[7px] font-bold text-white/50 uppercase tracking-tighter leading-tight mt-0.5">
                  Direct source fulfillment in 3-5 days.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
