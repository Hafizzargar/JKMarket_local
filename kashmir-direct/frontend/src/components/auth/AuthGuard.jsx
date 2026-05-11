'use client';

import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';
import SovereignLoading from '../ui/SovereignLoading';
import { ShieldCheck, ShieldAlert } from 'lucide-react';

/**
 * 🛡️ ROLE-BASED AUTH GUARD
 * A high-order component that protects routes based on user roles.
 * Usage: <AuthGuard allowedRoles={['admin', 'seller']}>{children}</AuthGuard>
 */
export default function AuthGuard({ children, allowedRoles = [] }) {
  const { user, profile, loading, isAdmin, signOut } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const userRole = profile?.role;
  const isApproved = profile?.isApproved !== false; 
  const isBanned = profile?.status === 'banned';
  const hasAccess = allowedRoles.length === 0 || allowedRoles.includes(userRole) || (allowedRoles.includes('admin') && isAdmin);
  const canRender = user && hasAccess && isApproved && !isBanned;

  useEffect(() => {
    if (mounted && !loading) {
      // 🛡️ NATIVE REDIRECTION: Use window.location for stability during early initialization
      
      // 1. If not logged in, send to login
      if (!user) {
        window.location.replace('/login');
        return;
      }

      // 2. If roles are restricted, check if user has permission
      if (!hasAccess || isBanned) {
        // If banned or no access, redirect or logout
        if (isBanned) return; // Handled by UI below
        const target = (userRole === 'customer' || userRole === 'buyer') ? '/products' : 
                       (userRole === 'admin' || userRole === 'superadmin') ? '/super-admin/dashboard' : '/seller/dashboard';
        window.location.replace(target);
      }
    }
  }, [user, profile, loading, isAdmin, allowedRoles, mounted, hasAccess, userRole, isApproved, isBanned]);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <SovereignLoading message="Authenticating Identity Node" />
      </div>
    );
  }

  // 🚫 BAN GATE: Block restricted members
  if (user && isBanned) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-10 text-center space-y-8">
        <div className="w-24 h-24 bg-rose-500/10 rounded-[2.5rem] flex items-center justify-center text-rose-600 animate-bounce">
           <ShieldAlert size={48} />
        </div>
        <div className="space-y-3 max-w-md">
           <h2 className="text-3xl font-black text-[#1B4332] tracking-tighter uppercase italic">Account Restricted</h2>
           <p className="text-[11px] font-bold text-[#1B4332]/40 uppercase tracking-widest leading-relaxed">
             Access to your Kashmir Direct Identity has been terminated due to a violation of platform integrity. 
             If you believe this is an error, contact the Super-Admin.
           </p>
        </div>
        <button 
          onClick={async () => {
            await signOut();
            window.location.replace('/');
          }}
          className="px-10 py-4 bg-rose-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-rose-600/20 hover:bg-[#1B4332] transition-all"
        >
          Terminate Session & Exit
        </button>
      </div>
    );
  }

  // 🛡️ APPROVAL GATE: Block unverified sellers
  if (user && profile?.role === 'seller' && !isApproved) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-10 text-center space-y-8">
        <div className="w-24 h-24 bg-[#BC6C25]/10 rounded-[2.5rem] flex items-center justify-center text-[#BC6C25] animate-pulse">
           <ShieldCheck size={48} />
        </div>
        <div className="space-y-3 max-w-md">
           <h2 className="text-3xl font-black text-[#1B4332] tracking-tighter uppercase italic">Account Pending</h2>
           <p className="text-[11px] font-bold text-[#1B4332]/40 uppercase tracking-widest leading-relaxed">
             The Kashmir Direct Vault is currently verifying your artisan credentials. You will receive access once the Super-Admin has approved your boutique.
           </p>
        </div>
        <button 
          onClick={async () => {
            await signOut();
            window.location.replace('/');
          }}
          className="px-10 py-4 bg-[#1B4332] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-[#1B4332]/20 hover:bg-[#BC6C25] transition-all"
        >
          Logout & Return Home
        </button>
      </div>
    );
  }

  if (!canRender) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center flex-col gap-4">
        <SovereignLoading message="Unauthorized Access. Redirecting..." />
      </div>
    );
  }

  return children;
}
