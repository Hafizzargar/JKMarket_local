'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

export default function GlobalHelpRedirect() {
  const { profile, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (profile?.role === 'seller') {
      router.push('/seller/help');
    } else if (profile?.role === 'customer' || profile?.role === 'buyer') {
      router.push('/buyer/help');
    } else {
      router.push('/buyer/help'); // Default to buyer help
    }
  }, [user, profile, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
      <div className="flex flex-col items-center gap-4">
         <div className="w-12 h-12 border-4 border-[#1B4332]/10 border-t-[#BC6C25] rounded-full animate-spin" />
         <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#1B4332]/40">Routing to Support Node</p>
      </div>
    </div>
  );
}
