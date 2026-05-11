'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import StatGrid from '@/components/admin/StatGrid';
import MarketInsight from '@/components/admin/MarketInsight';

export default function DashboardContent() {
  const { isAdmin } = useAuth();
  const [isDataLoading, setIsDataLoading] = useState(true);

  // 🛰️ GLOBAL STATE
  const [stats, setStats] = useState({ products: 0, sellers: 0, managers: 0, buyers: 0, pending: 0, revenue: '₹0' });

  // 🛰️ GLOBAL SYNC LISTENER (Connected to Header Refresh)
  useEffect(() => {
    const handleGlobalSync = () => {
      fetchStats();
    };
    window.addEventListener('platform-sync', handleGlobalSync);
    return () => window.removeEventListener('platform-sync', handleGlobalSync);
  }, []);

  useEffect(() => {
    if (isAdmin) {
      fetchStats();
    }
  }, [isAdmin]);

  const fetchStats = async () => {
    try {
      setIsDataLoading(true);
      const response = await fetch('/api/admin/stats');
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      setStats({
        products: data.products,
        sellers: data.sellers,
        managers: 0,
        buyers: data.users - data.sellers,
        pending: data.pending,
        revenue: data.revenue
      });
    } catch (err) {
      console.error('Stats Sync Failure:', err);
    } finally {
      setIsDataLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
       {/* 📊 ACTIVITY INDICATOR */}
       <StatGrid stats={stats} />
       <MarketInsight />
    </motion.div>
  );
}
