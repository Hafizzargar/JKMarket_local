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
    if (!force && profile && profile.id === uid) return;

    console.log('🛡️ [Identity Vault] Syncing Registry for:', uid);
    
    // ⏱️ FETCH TIMEOUT: Don't let a slow DB hang the entire app
    const fetchTimeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Profile Sync Timeout')), 6000)
    );

    try {
      const fetchPromise = (async () => {
        // 1. Fetch base profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', uid)
          .maybeSingle();
        
        if (profileError || !profileData) {
          throw new Error(profileError?.message || 'Profile missing');
        }

        // 2. Fetch seller details if applicable
        if (profileData.role === 'seller' || profileData.role === 'shopkeeper') {
          const { data: sellerData } = await supabase
            .from('sellers')
            .select('*')
            .eq('user_id', uid)
            .maybeSingle();
          return { ...profileData, seller: sellerData };
        }
        return profileData;
      })();

      const finalProfile = await Promise.race([fetchPromise, fetchTimeout]);
      setProfile(finalProfile);
      console.log('🛡️ [Identity Vault] Registry Synced.');

    } catch (err) {
      console.warn('🛡️ [Identity Vault] Registry sync fallback:', err.message);
      
      // 🩹 VIRTUAL IDENTITY FALLBACK: Always set a profile so the UI can render
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
      console.log('🛡️ [Identity Vault] Auth State Change:', _event);
      
      setUser(currentUser);
      
      if (currentUser) {
        await fetchProfile(currentUser.id, currentUser);
      } else {
        setProfile(null);
      }
      
      // 🛡️ ALWAYS RELEASE LOADING
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile, setProfile]);

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
      localStorage.clear();
      setUser(null);
      setProfile(null);
      clearCache();
      try {
        await identityGuard.terminateSession();
      } catch (err) { console.warn(err.message); }
    },
    user,
    profile,
    isAdmin: profile?.role === 'admin' || profile?.role === 'superadmin' || user?.user_metadata?.role === 'admin' || user?.email === 'hafezzargar987@gmail.com',
    loading: loading || isRefreshing,
    refreshProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
