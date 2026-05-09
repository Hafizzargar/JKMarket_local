'use client';

import { useAuth } from '../../context/AuthContext';
import { User } from 'lucide-react';
import Link from 'next/link';

/**
 * 👤 USER NODE
 * A reusable component that displays the user's identity.
 * Used in the Navbar and Dashboards for a consistent "Elite Member" look.
 */
export default function UserNode({ size = 'sm', showName = true, className = '' }) {
  const { user, profile, isAdmin } = useAuth();
  
  if (!user) return null;

  const avatarUrl = profile?.avatar_url;
  const name = profile?.full_name || user?.email?.split('@')[0] || 'Member';

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {showName && (
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#1B4332] leading-tight">
            {name}
          </span>
          <span className="text-[7px] font-black uppercase tracking-widest text-[#BC6C25] leading-none opacity-60">
            {isAdmin ? 'Superadmin' : (profile?.role || 'Member')}
          </span>
        </div>
      )}
      
      <div className={`${sizeClasses[size]} rounded-full border-2 border-[#BC6C25]/20 p-0.5 group cursor-pointer transition-all hover:border-[#BC6C25]/60`}>
        <div className="w-full h-full rounded-full overflow-hidden bg-[#1B4332]/5 border border-[#1B4332]/10 relative">
          {avatarUrl ? (
            <img 
              src={avatarUrl} 
              alt={name} 
              className="w-full h-full object-cover transition-transform group-hover:scale-110" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#1B4332]/5">
              <User size={size === 'sm' ? 12 : 16} className="text-[#1B4332]/20" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
