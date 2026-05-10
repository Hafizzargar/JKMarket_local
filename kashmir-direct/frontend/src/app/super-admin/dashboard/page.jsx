'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import StatGrid from '@/components/admin/StatGrid';
import MarketInsight from '@/components/admin/MarketInsight';

export default function DashboardContent() {
  const { isAdmin } = useAuth();
  const [isDataLoading, setIsDataLoading] = useState(true);
  const hasFetchedStats = useRef(false);

  // 🛰️ GLOBAL STATE
  const [stats, setStats] = useState({ products: 0, sellers: 0, managers: 0, buyers: 0, pending: 0, revenue: '₹0' });

  useEffect(() => {
    if (isAdmin && !hasFetchedStats.current) {
      fetchStats();
      hasFetchedStats.current = true;
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
       <div className="page-header mb-12">
          <div className="flex items-center gap-2 mb-2">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1B4332]/40">Live Stats</span>
          </div>
          <h1 className="text-4xl font-black text-[#1B4332] tracking-tighter leading-none">Sales <span className="text-[#BC6C25] font-serif italic font-normal lowercase">Overview</span></h1>
          <p className="text-[12px] font-medium text-[#1B4332]/40 italic mt-2">Checking how the marketplace is doing today.</p>
       </div>
       <StatGrid stats={stats} />
       <MarketInsight />
    </motion.div>
  );
}
