'use client';

import AccountSidebar from '../../components/layout/AccountSidebar';
import Navbar from '../../components/layout/Navbar';
import { useStore } from '../../store/useStore';
import { usePathname } from 'next/navigation';

export default function BuyerLayout({ children }) {
  const { isSidebarCollapsed } = useStore();
  const pathname = usePathname();
  const isAuthRoute = pathname?.includes('/login') || pathname?.includes('/register');

  return (
    <div className="flex min-h-screen relative">
      {/* 🧭 BUYER SPECIFIC NAVIGATION */}
      {!isAuthRoute && <AccountSidebar />}
      
      <div className={`flex-grow transition-all duration-500 ${!isAuthRoute ? (isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-[280px]') : ''}`}>
        <main className="pt-8 sm:pt-12">
          {children}
        </main>
      </div>
    </div>
  );
}
