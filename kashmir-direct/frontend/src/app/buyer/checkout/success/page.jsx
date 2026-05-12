'use client';

import { motion } from 'framer-motion';
import { 
  CheckCircle2, Package, ArrowRight, 
  ShoppingBag, Mail, ShieldCheck, Home
} from 'lucide-react';
import Link from 'next/link';
import Button from '../../../../components/ui/Button';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-2xl w-full space-y-12">
        {/* Success Icon Animation */}
        <div className="relative">
          <motion.div 
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 200 }}
            className="w-32 h-32 bg-[#1B4332] rounded-[2.5rem] mx-auto flex items-center justify-center text-white shadow-2xl shadow-[#1B4332]/20 relative z-10"
          >
            <CheckCircle2 size={56} />
          </motion.div>
          {/* Ambient Rings */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1.5 }}
            transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
            className="absolute inset-0 border-2 border-[#1B4332]/10 rounded-[3rem]"
          />
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <header className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#BC6C25]">Sovereign Order Confirmed</span>
            <h1 className="text-5xl font-black text-[#1B4332] tracking-tighter uppercase italic leading-none">
              The Vault is Sealed
            </h1>
          </header>
          <p className="text-sm text-[#1B4332]/50 font-bold uppercase tracking-widest leading-relaxed max-w-md mx-auto">
            Your authenticated valley treasures have been secured. Our team is currently verifying availability with our artisans.
          </p>
        </div>

        {/* Order Details Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-[#1B4332]/5 rounded-[2rem] p-8 shadow-sm divide-y divide-[#1B4332]/5"
        >
          <div className="pb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1B4332]/5 flex items-center justify-center text-[#1B4332]">
                <Package size={20} />
              </div>
              <div className="text-left">
                <p className="text-[9px] font-black text-[#1B4332]/30 uppercase tracking-widest">Order Identifier</p>
                <p className="text-sm font-black text-[#1B4332] tracking-tighter">#{orderId?.slice(-8).toUpperCase() || 'KD-PROCESSING'}</p>
              </div>
            </div>
            <div className="px-3 py-1 bg-[#1B4332]/5 rounded-lg text-[#1B4332] text-[10px] font-black uppercase">
              Pending Approval
            </div>
          </div>

          <div className="pt-6 grid grid-cols-2 gap-8 text-left">
            <div className="space-y-1">
              <p className="text-[9px] font-black text-[#1B4332]/30 uppercase tracking-widest">Confirmation Email</p>
              <div className="flex items-center gap-2 text-[#1B4332]">
                <Mail size={12} />
                <span className="text-[10px] font-bold uppercase">Check your inbox</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] font-black text-[#1B4332]/30 uppercase tracking-widest">Security Status</p>
              <div className="flex items-center gap-2 text-[#BC6C25]">
                <ShieldCheck size={12} />
                <span className="text-[10px] font-bold uppercase">Sovereign Protected</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-4">
          <Link href="/buyer/orders" className="w-full sm:w-auto">
            <Button className="w-full h-14 rounded-2xl px-10 group">
              View Order Status <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/buyer/products" className="w-full sm:w-auto">
            <Button variant="secondary" className="w-full h-14 rounded-2xl px-10 flex items-center justify-center gap-2">
              <Home size={16} /> Back to Home
            </Button>
          </Link>
        </div>

        {/* Footer Note */}
        <p className="text-[9px] text-[#1B4332]/30 font-black uppercase tracking-[0.3em] pt-8">
          Kashmir Direct • Authentic • Sovereign • Direct
        </p>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1B4332]"></div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
