'use client';

import { usePathname } from 'next/navigation';
import { AuthProvider } from '../../context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Navbar from './Navbar';

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  
  // 🛡️ Hide Navbar on Dashboards, Home, and Auth pages for a premium boutique feel
  const hideNavbar = pathname === '/' || 
                     pathname?.startsWith('/admin') || 
                     pathname?.startsWith('/dashboard') || 
                     pathname?.startsWith('/login') || 
                     pathname?.startsWith('/register');

  return (
    <AuthProvider>
      {/* 🔔 Global Toaster for all notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#FDFBF7',
            color: '#1B4332',
            borderRadius: '1.5rem',
            border: '1px solid rgba(27,67,50,0.05)',
            fontSize: '11px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            padding: '16px 24px',
            boxShadow: '0 10px 40px rgba(27,67,50,0.05)',
          },
          success: {
            iconTheme: {
              primary: '#1B4332',
              secondary: '#FDFBF7',
            },
          },
          error: {
            iconTheme: {
              primary: '#E11D48',
              secondary: '#FDFBF7',
            },
          }
        }}
      />
      <div className="bg-organic-mesh" />
      <div className="noise-overlay" />
      <div className="relative flex flex-col min-h-screen">
        {!hideNavbar && <Navbar />}
        <main className="flex-grow">
          {children}
        </main>
      </div>
    </AuthProvider>
  );
}
