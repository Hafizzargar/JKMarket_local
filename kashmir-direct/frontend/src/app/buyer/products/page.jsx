'use client';

import ProductsPage from '../../(public)/products/page';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function BuyerProductsPage() {
  const { user, profile, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || isAdmin || (profile?.role !== 'customer' && profile?.role !== 'buyer'))) {
      router.push('/products');
    }
  }, [user, profile, isAdmin, loading, router]);

  if (loading) return null;

  return <ProductsPage />;
}
