'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useStore } from '../store/useStore';
import { identityGuard } from '../services/AuthService';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const { profile, setProfile, clearCache } = useStore();
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchProfile = useCallback(async (uid, currentUser = null, force = false) => {
    // 🛡️ CACHE GUARD: Skip fetch if profile exists and we aren't forcing a refresh
    if (!force && profile && profile.id === uid) {
      return;
    }

    try {
      // Fetch base profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', uid)
        .maybeSingle();
      
      if (profileError || !profileData) {
        if (profileError && profileError.code !== 'PGRST116') {
          console.warn('Identity registry sync note:', profileError.message);
        }
        
        // 🩹 VIRTUAL PROFILE FALLBACK
        if (currentUser) {
          const metadata = currentUser.user_metadata || {};
          setProfile({
            id: uid,
            full_name: metadata.full_name || 'Artisan',
            email: currentUser.email,
            role: metadata.role || 'customer',
            is_virtual: true
          });
        }
        return;
      }

      // If they are a seller, fetch their seller-specific details
      if (profileData.role === 'seller' || profileData.role === 'shopkeeper') {
        let { data: sellerData } = await supabase
          .from('sellers')
          .select('*')
          .eq('user_id', uid)
          .maybeSingle();
        
        setProfile({ ...profileData, seller: sellerData });
      } else {
        setProfile(profileData);
      }
    } catch (err) {
      console.error('Identity registry sync error:', err);
    }
  }, [profile, setProfile]);

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        const currentUser = data?.session?.user ?? null;
        setUser(currentUser);
        
        if (currentUser) {
          await fetchProfile(currentUser.id, currentUser);
        }
      } catch (err) {
        console.error('⚖️ [Identity Vault] Session recovery failed:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser) {
        await fetchProfile(currentUser.id, currentUser);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);


  const refreshProfile = async () => {
    if (!user) return;
    setIsRefreshing(true);
    await fetchProfile(user.id, user, true);
    setIsRefreshing(false);
  };

  const value = {
    signUp: (data) => identityGuard.forgeIdentity(data.email, data.password, data.options?.data),
    signIn: (data) => identityGuard.executeAuthentication(data.email, data.password),
    signOut: async () => {
      console.log('🛡️ [Identity Vault] Initiating optimistic session purge...');
      
      // 🧹 STEP 1: IMMEDIATE LOCAL PURGE (Optimistic UI)
      localStorage.clear();
      setUser(null);
      setProfile(null);
      clearCache();

      try {
        // 📡 STEP 2: BACKGROUND VAULT SYNC
        await identityGuard.terminateSession();
        console.log('✅ [Identity Vault] Sovereign sync complete.');
      } catch (err) {
        console.warn('⚠️ [Identity Vault] Termination sync note:', err.message);
      }
    },
    user,
    profile,
    // 🛡️ TOKEN-BASED IDENTITY: Check database profile OR token metadata for admin status
    isAdmin: profile?.role === 'admin' || profile?.role === 'superadmin' || user?.user_metadata?.role === 'admin' || user?.app_metadata?.role === 'admin',
    loading: loading || isRefreshing,
    refreshProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
