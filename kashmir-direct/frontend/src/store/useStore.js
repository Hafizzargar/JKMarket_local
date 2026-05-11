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
      
      set({ products: data || [], lastFetchUser: !!user });
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

  // ❤️ WISHLIST VAULT (Supabase Persisted)
  wishlist: [],
  isWishlistLoading: false,

  fetchWishlist: async (userId) => {
    if (!userId) return;
    set({ isWishlistLoading: true });
    try {
      // 🕵️ TRY 'wishlist' FIRST, FALLBACK TO 'wishlist_items'
      let { data, error } = await supabase
        .from('wishlist')
        .select('*, products(*)')
        .eq('user_id', userId);
      
      // If table doesn't exist (42P01 in Postgres), try 'wishlist_items'
      if (error && error.code === '42P01') {
        const fallback = await supabase
          .from('wishlist_items')
          .select('*, products(*)')
          .eq('user_id', userId);
        data = fallback.data;
        error = fallback.error;
      }

      if (error) throw error;
      
      const items = data?.map(item => ({
        ...item.products,
        wishlist_id: item.id
      })) || [];

      set({ wishlist: items });
      
    } catch (error) {
      // 🛡️ SILENT FAIL IF TABLE MISSING (Allows user to run SQL script without console spam)
      if (error?.code === '42P01' || error?.message?.includes('schema cache')) {
        console.log('🏔️ [Identity Vault] Wishlist sync pending (Table creation required in Supabase).');
        return;
      }
      console.error('🛡️ [Identity Vault] Wishlist Sync Failed:', error.message || error);
    } finally {
      set({ isWishlistLoading: false });
    }
  },

  toggleWishlist: async (product, userId = null) => {
    const current = get().wishlist;
    const exists = current.find(p => p.id === product.id);
    
    // 🛡️ LOCAL STATE UPDATE (Optimistic)
    if (exists) {
      set({ wishlist: current.filter(p => p.id !== product.id) });
    } else {
      set({ wishlist: [...current, product] });
    }

    // 🏔️ REMOTE PERSISTENCE (If logged in)
    if (userId) {
      try {
        // Try 'wishlist' table
        const { error } = exists 
          ? await supabase.from('wishlist').delete().eq('user_id', userId).eq('product_id', product.id)
          : await supabase.from('wishlist').insert([{ user_id: userId, product_id: product.id }]);

        // Fallback to 'wishlist_items' if primary table missing
        if (error && error.code === '42P01') {
          exists
            ? await supabase.from('wishlist_items').delete().eq('user_id', userId).eq('product_id', product.id)
            : await supabase.from('wishlist_items').insert([{ user_id: userId, product_id: product.id }]);
        }
      } catch (error) {
        console.error('🛡️ [Identity Vault] Remote Wishlist Sync Error:', error);
      }
    }
  },

  // 🔍 PREVIEW VAULT
  selectedProduct: null,
  setSelectedProduct: (product) => set({ selectedProduct: product }),

  // 🎨 UI VAULT
  isAccountOpen: false,
  setIsAccountOpen: (isOpen) => set({ isAccountOpen: isOpen }),
  isSidebarCollapsed: false,
  setIsSidebarCollapsed: (isCollapsed) => set({ isSidebarCollapsed: isCollapsed }),

  // 🧹 CACHE PURGE
  clearCache: () => set({ 
    products: [], 
    sellerProducts: [], 
    wishlist: [], 
    lastFetchUser: null, 
    lastSellerId: null, 
    selectedProduct: null, 
    isAccountOpen: false,
    isSidebarCollapsed: false
  })
}));
