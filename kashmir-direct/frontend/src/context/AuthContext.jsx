'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useStore } from '../store/useStore';
import { identityGuard } from '../services/AuthService';
import { motion, AnimatePresence } from 'framer-motion';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const { profile, setProfile, clearCache, fetchWishlist } = useStore();
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const fetchProfile = useCallback(async (uid, currentUser = null, force = false) => {
    const currentProfile = useStore.getState().profile;
    if (!force && currentProfile && currentProfile.id === uid) return;

    console.log('🛡️ [Identity Vault] Loading Profile for:', uid);
    
    const fetchTimeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Profile Sync Timeout')), 10000)
    );

    try {
      const fetchPromise = (async () => {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', uid)
          .maybeSingle();
        
        if (profileError || !profileData) {
          throw new Error(profileError?.message || 'Profile missing');
        }

        if (profileData.role === 'seller' || profileData.role === 'shopkeeper') {
          const { data: sellerData } = await supabase
            .from('sellers')
            .select('*')
            .eq('user_id', uid)
            .maybeSingle();
          return { 
            ...profileData, 
            seller: sellerData,
            isApproved: sellerData?.is_verified || false 
          };
        }
        return { ...profileData, isApproved: true };
      })();

      const finalProfile = await Promise.race([fetchPromise, fetchTimeout]);
      setProfile(finalProfile);
      console.log('🛡️ [Identity Vault] Profile Synced.');

    } catch (err) {
      console.warn('🛡️ [Identity Vault] Using local profile (Sync timed out)');
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
  }, [setProfile]);

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        const currentUser = data?.session?.user ?? null;
        setUser(currentUser);
        if (currentUser) {
          await fetchProfile(currentUser.id, currentUser);
          fetchWishlist(currentUser.id);
        }
      } catch (err) {
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
        fetchWishlist(currentUser.id);
      } else {
        setProfile(null);
      }
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
      setIsLoggingOut(true);
      try {
        // 1. 🛡️ TERMINATE REMOTE SESSION
        await identityGuard.terminateSession();
        
        // 2. 🧹 PURGE LOCAL IDENTITY & COOKIES
        setUser(null);
        setProfile(null);
        localStorage.clear();
        sessionStorage.clear();
        clearCache();

        // 🍪 NUCLEAR COOKIE CLEAR: Wipe all cookies for this domain
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i];
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        }
        
        // 3. 🚀 CLEAN REDIRECT
        window.location.href = '/login';
      } catch (err) { 
        console.warn('🛡️ [Identity Vault] Logout Warning:', err.message);
        window.location.href = '/login';
      }
    },
    user,
    profile,
    isAdmin: profile?.role === 'admin' || profile?.role === 'superadmin' || user?.user_metadata?.role === 'admin' || user?.email === 'hafezzargar987@gmail.com',
    loading: loading || isRefreshing || isLoggingOut,
    refreshProfile,
    isLoggingOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {isLoggingOut && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[10000] bg-[#FDFBF7] flex items-center justify-center flex-col gap-6 backdrop-blur-2xl transition-all duration-500"
          >
             <div className="w-16 h-16 border-4 border-[#1B4332]/10 border-t-[#BC6C25] rounded-full animate-spin" />
             <div className="flex flex-col items-center">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#1B4332]/40 animate-pulse">Identity Vault</span>
                <p className="text-[12px] font-black uppercase tracking-[0.2em] text-[#1B4332] mt-2 italic font-serif lowercase">Terminating Session...</p>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
