import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export const useStore = create((set, get) => ({
  // 🛡️ IDENTITY VAULT
  profile: null,
  setProfile: (profile) => set({ profile }),

  // 🏔️ MARKETPLACE VAULT
  products: [],
  isProductsLoading: false,
  productsError: null,
  
  fetchProducts: async (user = null) => {
    // 🛡️ AUTH-SENSITIVE FETCH: Re-fetch if user status changed (Member <-> Guest)
    const isMember = !!user;
    if (get().lastFetchUser === isMember && get().products.length > 0) {
      return;
    }

    set({ isProductsLoading: true, productsError: null });
    
    try {
      let query = supabase.from('products').select('*');
      
      // 🛡️ GUEST LOCK: Teaser only
      if (!user) {
        query = query.limit(6);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      set({ products: data, lastFetchUser: !!user });
    } catch (error) {
      set({ productsError: error.message });
    } finally {
      set({ isProductsLoading: false });
    }
  },

  // 🏪 SELLER VAULT
  sellerProducts: [],
  isSellerDataLoading: false,
  
  fetchSellerProducts: async (userId, role) => {
    if (get().sellerProducts.length > 0 && get().lastSellerId === userId) {
      return;
    }

    if (!userId || (role !== 'seller' && role !== 'shopkeeper')) return;

    set({ isSellerDataLoading: true });
    
    try {
      const { data: sellerRecord } = await supabase
        .from('sellers')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      const sellerId = sellerRecord?.id;
      let query = supabase.from('products').select('*');

      if (sellerId) {
        query = query.or(`seller_id.eq.${sellerId},seller_id.eq.${userId}`);
      } else {
        query = query.eq('seller_id', userId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      set({ sellerProducts: data, lastSellerId: userId });
    } catch (error) {
      console.error('Seller data fetch error:', error);
    } finally {
      set({ isSellerDataLoading: false });
    }
  },

  // ❤️ WISHLIST VAULT
  wishlist: [],
  toggleWishlist: (product) => {
    const current = get().wishlist;
    const exists = current.find(p => p.id === product.id);
    if (exists) {
      set({ wishlist: current.filter(p => p.id !== product.id) });
    } else {
      set({ wishlist: [...current, product] });
    }
  },

  // 🧹 CACHE PURGE
  clearCache: () => set({ products: [], sellerProducts: [], wishlist: [], lastFetchUser: null, lastSellerId: null })
}));
