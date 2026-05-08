'use client';

import { TrendingUp, Package, Store, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StatGrid({ stats }) {
  const config = [
    { label: 'Market Revenue', value: stats.revenue, icon: TrendingUp, color: 'text-emerald-400' },
    { label: 'Live Inventory', value: stats.products, icon: Package, color: 'text-blue-400' },
    { label: 'Active Artisans', value: stats.sellers, icon: Store, color: 'text-amber-400' },
    { label: 'Ops Personnel', value: stats.managers, icon: Briefcase, color: 'text-[#BC6C25]' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      {config.map((stat, i) => (
        <motion.div 
          key={i} 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] hover:bg-white/[0.04] transition-all group"
        >
           <div className="flex justify-between items-start mb-6">
              <div className={`p-4 bg-white/5 rounded-2xl ${stat.color} group-hover:scale-110 transition-transform`}><stat.icon size={24} /></div>
              <span className="text-[10px] font-black text-white/20 uppercase">System Aggregation</span>
           </div>
           <p className="text-[9px] font-black uppercase tracking-widest text-white/30">{stat.label}</p>
           <p className="text-3xl font-black mt-1 tracking-tighter text-white">{stat.value}</p>
        </motion.div>
      ))}
    </div>
  );
}
