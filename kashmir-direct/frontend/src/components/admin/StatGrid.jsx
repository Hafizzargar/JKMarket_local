'use client';

import { TrendingUp, Package, Store, Briefcase, Zap, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const Sparkline = ({ color }) => (
  <div className="absolute bottom-0 left-0 w-full h-12 opacity-30 group-hover:opacity-60 transition-opacity duration-700">
    <svg viewBox="0 0 100 30" className="w-full h-full preserve-3d">
      <defs>
        <linearGradient id={`grad-${color.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
        d="M0,25 Q15,5 30,20 T60,10 T100,15"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
      />
      <path
        d="M0,25 Q15,5 30,20 T60,10 T100,15 V30 H0 Z"
        fill={`url(#grad-${color.replace('#', '')})`}
      />
    </svg>
  </div>
);

export default function StatGrid({ stats }) {
  const config = [
    { label: 'Total Revenue', value: stats.revenue, icon: TrendingUp, color: '#1B4332', dot: 'bg-[#1B4332]' },
    { label: 'Live Products', value: stats.products, icon: Package, color: '#E87C2A', dot: 'bg-[#E87C2A]' },
    { label: 'Registered Shops', value: stats.sellers, icon: Store, color: '#BC6C25', dot: 'bg-[#BC6C25]' },
    { label: 'Customer Base', value: stats.buyers, icon: Users, color: '#1B4332', dot: 'bg-[#1B4332]' },
    { label: 'Staff Members', value: stats.managers, icon: Briefcase, color: '#BC6C25', dot: 'bg-[#BC6C25]' }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-5">
      {config.map((stat, i) => (
        <motion.div 
          key={i} 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white border border-[#1B4332]/5 p-6 rounded-[2rem] hover:bg-[#FDFBF7] transition-all group relative overflow-hidden shadow-[0_20px_50px_-20px_rgba(27,67,50,0.1)] hover:shadow-[0_30px_60px_-15px_rgba(27,67,50,0.15)]"
        >
           {/* 🎭 STUDIO HOVER BORDER */}
           <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#BC6C25] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
           
           <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="w-11 h-11 bg-[#1B4332]/5 rounded-xl flex items-center justify-center group-hover:bg-[#BC6C25]/10 group-hover:text-[#E87C2A] transition-all duration-500 shadow-sm border border-[#1B4332]/5" style={{ color: stat.color }}>
                 <stat.icon size={18} className="group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex flex-col items-end gap-0.5">
                 <div className="flex items-center gap-1.5">
                    <div className={`w-1 h-1 rounded-full ${stat.dot} shadow-[0_0_8px_currentColor] animate-pulse`} />
                    <span className="text-[7px] font-black text-[#1B4332]/20 uppercase tracking-[0.2em]">Active</span>
                 </div>
                 <Zap size={8} className="text-[#1B4332]/5" />
              </div>
           </div>

           <div className="space-y-1 relative z-10">
              <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[#1B4332]/30 leading-none truncate">{stat.label}</p>
              <p className="text-2xl font-black tracking-tighter text-[#1B4332] group-hover:text-[#E87C2A] transition-colors duration-500">{stat.value}</p>
           </div>

           <Sparkline color={stat.color} />

           {/* 🧬 AMBIENT DEPTH */}
           <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-[#1B4332]/[0.02] rounded-full blur-2xl pointer-events-none group-hover:bg-[#BC6C25]/5 transition-all duration-700" />
        </motion.div>
      ))}
    </div>
  );
}
