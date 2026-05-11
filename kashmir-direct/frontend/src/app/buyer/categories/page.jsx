'use client';

import CategoriesPage from '../../(public)/categories/page';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function BuyerCategoriesPage() {
  const { user, profile, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || isAdmin || (profile?.role !== 'customer' && profile?.role !== 'buyer'))) {
      router.push('/categories');
    }
  }, [user, profile, isAdmin, loading, router]);

  if (loading) return null;

  return <CategoriesPage />;
}
