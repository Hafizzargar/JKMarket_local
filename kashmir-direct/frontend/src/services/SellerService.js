import { supabase } from '../lib/supabase';

/**
 * 🏺 SELLER SERVICE
 * Specialized logic for high-performance seller operations.
 */
export const SellerService = {
  /**
   * 📊 GET DASHBOARD STATS
   * Optimized query that only counts rows to avoid heavy data transfer.
   */
  getDashboardStats: async (userId) => {
    try {
      // 1. Fetch Seller Record ID
      const { data: seller } = await supabase
        .from('sellers')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      const sellerId = seller?.id;

      // 2. Parallel Count Queries for Maximum Speed
      const [approved, pending, rejected] = await Promise.all([
        supabase
          .from('products')
          .select('id', { count: 'exact', head: true })
          .or(`seller_id.eq.${sellerId},seller_id.eq.${userId}`)
          .eq('is_approved', true),
        
        supabase
          .from('products')
          .select('id', { count: 'exact', head: true })
          .or(`seller_id.eq.${sellerId},seller_id.eq.${userId}`)
          .eq('is_approved', false)
          .neq('status', 'rejected'),

        supabase
          .from('products')
          .select('id', { count: 'exact', head: true })
          .or(`seller_id.eq.${sellerId},seller_id.eq.${userId}`)
          .eq('status', 'rejected')
      ]);

      return {
        data: {
          approved: approved.count || 0,
          pending: pending.count || 0,
          rejected: rejected.count || 0,
          earnings: '₹24.5k' // Static for now as requested
        },
        error: null
      };
    } catch (error) {
      console.error('🛡️ [Seller Service] Stats Failure:', error);
      return { data: null, error };
    }
  }
};
