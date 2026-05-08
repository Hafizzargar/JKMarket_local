import './globals.css';
import { Outfit, Playfair_Display } from 'next/font/google';
import ClientLayout from '../components/layout/ClientLayout';

const outfit = Outfit({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif',
});

export const metadata = {
  title: 'Kashmir Direct | Shop Management & Inventory',
  description: 'The elite artisan marketplace and small business inventory system for local stores. Featuring labor management dashboards, delivery management for India, and role-based admin security.',
  keywords: 'shop management software for local stores, labour management dashboard, small business inventory system, delivery management app india, role based admin system, kashmir direct, artisan marketplace',
  icons: {
    icon: '/icon.svg',
  },
  openGraph: {
    title: 'Kashmir Direct - Elite Shop Management & Logistics',
    description: 'Transform your local store with our premium inventory and delivery management system.',
    url: 'https://kashmirdirect.in',
    siteName: 'Kashmir Direct',
    images: [
      {
        url: 'https://hqfeugrebpumkukervqz.supabase.co/storage/v1/object/public/product_images/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable} ${playfair.variable}`}>
      <body className="antialiased min-h-screen relative" suppressHydrationWarning>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
