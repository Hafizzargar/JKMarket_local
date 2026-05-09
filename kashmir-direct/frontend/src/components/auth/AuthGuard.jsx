'use client';

import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import SovereignLoading from '../ui/SovereignLoading';

/**
 * 🛡️ ROLE-BASED AUTH GUARD
 * A high-order component that protects routes based on user roles.
 * Usage: <AuthGuard allowedRoles={['admin', 'seller']}>{children}</AuthGuard>
 */
export default function AuthGuard({ children, allowedRoles = [] }) {
  const { user, profile, loading, isAdmin } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !loading) {
      // 1. If not logged in, send to login
      if (!user) {
        router.replace('/login');
        return;
      }

      // 2. If roles are restricted, check if user has permission
      if (allowedRoles.length > 0) {
        const userRole = profile?.role;
        const hasAccess = allowedRoles.includes(userRole) || (allowedRoles.includes('admin') && isAdmin);
        
        if (!hasAccess) {
          // If no access, redirect to their default home
          if (userRole === 'customer' || userRole === 'buyer') {
            router.replace('/products');
          } else {
            router.replace('/dashboard');
          }
        }
      }
    }
  }, [user, profile, loading, isAdmin, router, allowedRoles]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <SovereignLoading message="Authenticating Identity Node" />
      </div>
    );
  }

  // Only render children if user exists and passes the role check
  const canRender = user && (allowedRoles.length === 0 || allowedRoles.includes(profile?.role) || (allowedRoles.includes('admin') && isAdmin));

  return canRender ? children : null;
}
