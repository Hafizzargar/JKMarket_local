'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';

const CartContext = createContext({});

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const { user, isAdmin, profile } = useAuth();
  const [isSyncing, setIsSyncing] = useState(false);

  // 🔄 INITIAL FETCH: Load cart from LocalStorage OR Database
  useEffect(() => {
    setMounted(true);
    
    const initializeCart = async () => {
      // 1. Try to load from LocalStorage first (for quick UI)
      const savedCart = localStorage.getItem('kashmir_direct_cart');
      let localCart = [];
      if (savedCart) {
        try {
          localCart = JSON.parse(savedCart);
          setCart(localCart);
        } catch (e) {
          console.error('Failed to parse cart:', e);
        }
      }

      // 2. If user is logged in (and is a customer/buyer), fetch from Database and sync
      if (user && !isAdmin && (profile?.role === 'customer' || profile?.role === 'buyer')) {
        setIsSyncing(true);
        const { data: dbItems, error } = await supabase
          .from('cart_items')
          .select('*, products(*)')
          .eq('user_id', user.id);

        if (!error && dbItems) {
          const transformedItems = dbItems.map(item => ({
            ...item.products,
            quantity: item.quantity,
            db_id: item.id // Keep track of DB row ID
          }));

          // Merge Logic: Prioritize DB but add local items if not present
          const mergedCart = [...transformedItems];
          localCart.forEach(localItem => {
            if (!mergedCart.find(dbItem => dbItem.id === localItem.id)) {
              mergedCart.push(localItem);
              // Optionally sync this new local item to DB
              syncItemToDb(localItem.id, localItem.quantity);
            }
          });

          setCart(mergedCart);
        }
        setIsSyncing(false);
      }
    };

    if (mounted) initializeCart();
  }, [user, mounted, isAdmin, profile]);

  // 🛡️ PURGE: Wipe cart on logout or admin entry
  useEffect(() => {
    if ((!user || isAdmin) && mounted) {
      setCart([]);
      localStorage.removeItem('kashmir_direct_cart');
    }
  }, [user, mounted, isAdmin]);

  // Helper: Sync single item to Supabase (Optimized API call)
  const syncItemToDb = async (productId, quantity, dbId = null) => {
    if (!user || isAdmin) return;
    
    try {
      if (dbId) {
        // Precise update using Primary Key
        await supabase
          .from('cart_items')
          .update({ quantity: quantity })
          .eq('id', dbId);
      } else {
        // Upsert using composite keys
        const { data, error } = await supabase
          .from('cart_items')
          .upsert({ 
            user_id: user.id, 
            product_id: productId, 
            quantity: quantity 
          }, { onConflict: 'user_id,product_id' })
          .select('id')
          .single();
        
        if (!error && data) {
          // Update the item in local state with its new DB ID
          setCart(prev => prev.map(item => 
            item.id === productId ? { ...item, db_id: data.id } : item
          ));
        }
      }
    } catch (err) {
      console.error('Cart Sync Error:', err);
    }
  };

  // Save cart to LocalStorage whenever it changes
  useEffect(() => {
    if (mounted && !isAdmin) {
      localStorage.setItem('kashmir_direct_cart', JSON.stringify(cart));
    }
  }, [cart, mounted, isAdmin]);

  const addToCart = async (product) => {
    // 🛡️ SECURITY GATE: Only allow regular buyers to use the cart
    // Super Admins and Guest users are redirected to login
    if (!user || isAdmin || profile?.role !== 'customer') {
      toast.error('Please login as a buyer to add items to your cart', { 
        id: 'cart-gate',
        style: {
          background: '#1B4332',
          color: '#fff',
          borderRadius: '1rem',
          fontSize: '11px',
          fontWeight: '900',
          textTransform: 'uppercase',
          letterSpacing: '0.1em'
        }
      });
      router.push('/login');
      return;
    }

    let newQty = 1;
    let targetDbId = null;

    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        newQty = existing.quantity + 1;
        targetDbId = existing.db_id;
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: newQty } : item
        );
      } else {
        newQty = 1;
        return [...prev, { ...product, quantity: 1 }];
      }
    });

    // DB Sync with calculated quantity and existing ID if available
    if (user) {
      await syncItemToDb(product.id, newQty, targetDbId);
    }
    
    toast.success(`${product.title} added to your cart!`, { icon: '🧺' });
  };

  const removeFromCart = async (productId) => {
    const item = cart.find(i => i.id === productId);
    setCart(prev => prev.filter(item => item.id !== productId));
    
    if (item) {
      toast.success(`${item.title} removed from cart`, { icon: '🗑️' });
    }

    if (user && !isAdmin) {
      const query = supabase.from('cart_items').delete();
      if (item?.db_id) {
        await query.eq('id', item.db_id);
      } else {
        await query.eq('user_id', user.id).eq('product_id', productId);
      }
    }
  };

  const updateQuantity = async (productId, delta) => {
    let newQty = 1;
    let targetDbId = null;

    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        newQty = Math.max(1, item.quantity + delta);
        targetDbId = item.db_id;
        return { ...item, quantity: newQty };
      }
      return item;
    }));

    if (user && !isAdmin) {
      await syncItemToDb(productId, newQty, targetDbId);
    }
  };

  const clearCart = async () => {
    setCart([]);
    if (user && !isAdmin) {
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);
    }
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      cartCount,
      cartTotal,
      isOpen,
      setIsOpen,
      isSyncing
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
