'use client';

import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';
import SovereignLoading from '../ui/SovereignLoading';

/**
 * 🛡️ ROLE-BASED AUTH GUARD
 * A high-order component that protects routes based on user roles.
 * Usage: <AuthGuard allowedRoles={['admin', 'seller']}>{children}</AuthGuard>
 */
export default function AuthGuard({ children, allowedRoles = [] }) {
  const { user, profile, loading, isAdmin } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !loading) {
      // 🛡️ NATIVE REDIRECTION: Use window.location for stability during early initialization
      
      // 1. If not logged in, send to login
      if (!user) {
        window.location.replace('/login');
        return;
      }

      // 2. If roles are restricted, check if user has permission
      if (allowedRoles.length > 0) {
        const userRole = profile?.role;
        const hasAccess = allowedRoles.includes(userRole) || (allowedRoles.includes('admin') && isAdmin);
        
        if (!hasAccess) {
          // If no access, redirect to their default home
          const target = (userRole === 'customer' || userRole === 'buyer') ? '/products' : 
                         (userRole === 'admin' || userRole === 'superadmin') ? '/super-admin/dashboard' : '/seller/dashboard';
          window.location.replace(target);
        }
      }
    }
  }, [user, profile, loading, isAdmin, allowedRoles, mounted]);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <SovereignLoading message="Authenticating Identity Node" />
      </div>
    );
  }

  // Final check for rendering
  const userRole = profile?.role;
  const canRender = user && (
    allowedRoles.length === 0 || 
    allowedRoles.includes(userRole) || 
    (allowedRoles.includes('admin') && isAdmin)
  );

  return canRender ? children : null;
}
