'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

// The designated Super Admin email
const SUPER_ADMIN_EMAIL = 'hafezzargar987@gmail.com';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchProfile = async (uid) => {
    try {
      // Fetch base profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', uid)
        .single();
      
      if (profileError) throw profileError;

      // If they are a seller, fetch their seller-specific details
      if (profileData.role === 'seller') {
        let { data: sellerData, error: sellerError } = await supabase
          .from('sellers')
          .select('*')
          .eq('user_id', uid)
          .maybeSingle();
        
        // 🩹 SILENT SYNC: If registry is missing, we handle it in the UI rather than forcing an insert
        // which triggers FK violations on the 'users' table.
        setProfile({ ...profileData, seller: sellerData });
      } else {
        setProfile(profileData);
      }
    } catch (err) {
      console.error('Identity registry sync error:', err);
    }
  };

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        const currentUser = data?.session?.user ?? null;
        setUser(currentUser);
        
        if (currentUser) {
          await fetchProfile(currentUser.id);
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
        await fetchProfile(currentUser.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Check if current user is the hardcoded Super Admin
  const isSuperAdmin = user?.email === SUPER_ADMIN_EMAIL;

  const refreshProfile = async () => {
    if (!user) return;
    setIsRefreshing(true);
    await fetchProfile(user.id);
    setIsRefreshing(false);
  };

  const value = {
    signUp: (data) => supabase.auth.signUp(data),
    signIn: (data) => supabase.auth.signInWithPassword(data),
    signOut: async () => {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
    },
    user,
    profile,
    // Grant admin access if they have the role OR if they are the Super Admin email
    isAdmin: isSuperAdmin || profile?.role === 'admin',
    isSuperAdmin,
    SUPER_ADMIN_EMAIL,
    loading: loading || isRefreshing,
    refreshProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
