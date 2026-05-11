'use client';

import Navbar from '../../components/layout/Navbar';
import { usePathname } from 'next/navigation';

export default function PublicLayout({ children }) {
  const pathname = usePathname();
  const isAuthRoute = pathname?.includes('/login') || pathname?.includes('/register');

  return (
    <div className="relative">
      {!isAuthRoute && <Navbar />}
      <main className={!isAuthRoute ? 'pt-16 sm:pt-20' : ''}>
        {children}
      </main>
    </div>
  );
}
