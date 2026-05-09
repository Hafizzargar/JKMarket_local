'use client';

import { motion } from 'framer-motion';
import { Activity, ArrowUpRight, Clock } from 'lucide-react';

export default function MarketInsight() {
  // 🛰️ MOCK TELEMETRY DATA (Last 7 Days)
  const data = [
    { day: 'Mon', revenue: 45, orders: 12 },
    { day: 'Tue', revenue: 52, orders: 15 },
    { day: 'Wed', revenue: 48, orders: 10 },
    { day: 'Thu', revenue: 70, orders: 22 },
    { day: 'Fri', revenue: 65, orders: 18 },
    { day: 'Sat', revenue: 85, orders: 25 },
    { day: 'Sun', revenue: 95, orders: 30 },
  ];

  const maxValue = 100;
  
  // 🖋️ PATH GENERATOR
  const generatePath = (data, key) => {
    return data.map((d, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - (d[key] / maxValue) * 100;
      return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
    }).join(' ');
  };

  const revenuePath = generatePath(data, 'revenue');
  const ordersPath = generatePath(data, 'orders');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="relative bg-[#242B29]/60 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 overflow-hidden group shadow-2xl"
    >
      {/* 🔮 AMBIENT DEPTH */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#BC6C25]/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-[#BC6C25]/10 rounded-lg flex items-center justify-center">
              <Activity size={16} className="text-[#BC6C25]" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white">Sales & Activity</h3>
          </div>
          <p className="text-[10px] text-white/30 font-medium uppercase tracking-widest italic">Weekly Performance Tracking</p>
        </div>

        <div className="flex items-center gap-8">
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-[#E87C2A] rounded-full shadow-[0_0_8px_#E87C2A]" />
              <div>
                <p className="text-[10px] font-black uppercase text-white/80">Total Revenue</p>
              </div>
           </div>
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-white/20 rounded-full" />
              <div>
                <p className="text-[10px] font-black uppercase text-white/40">Order Volume</p>
              </div>
           </div>
           <div className="h-10 w-[1px] bg-white/5 hidden md:block" />
           <div className="hidden md:flex flex-col items-end">
              <p className="text-[7px] font-black uppercase tracking-widest text-[#2ECC71] flex items-center gap-1"><ArrowUpRight size={10} /> Growth: +24%</p>
              <p className="text-[10px] font-black text-white/60 mt-1 uppercase tracking-tighter">Business Logic</p>
           </div>
        </div>
      </div>

      {/* 📊 ELITE VECTOR GRAPH */}
      <div className="relative h-64 w-full">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
          {/* 🏁 GRID LINES */}
          {[0, 25, 50, 75, 100].map(val => (
            <line key={val} x1="0" y1={val} x2="100" y2={val} stroke="white" strokeOpacity="0.03" strokeWidth="0.5" />
          ))}
          
          {/* 📦 ORDERS VOLUME (Subtle) */}
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.2 }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
            d={ordersPath}
            fill="none"
            stroke="white"
            strokeWidth="1"
            strokeDasharray="2 2"
          />

          {/* 💰 REVENUE FLOW (Main) */}
          <defs>
            <linearGradient id="chartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#E87C2A" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#E87C2A" stopOpacity="0" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            d={revenuePath}
            fill="none"
            stroke="#E87C2A"
            strokeWidth="2"
            filter="url(#glow)"
          />
          
          <motion.path
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 1 }}
            d={`${revenuePath} L 100,100 L 0,100 Z`}
            fill="url(#chartGrad)"
          />

          {/* 📍 DATA POINTS */}
          {data.map((d, i) => (
            <motion.circle
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.5 + (i * 0.1) }}
              cx={(i / (data.length - 1)) * 100}
              cy={100 - (d.revenue / maxValue) * 100}
              r="1.2"
              fill="#E87C2A"
              className="cursor-pointer"
            />
          ))}
        </svg>

        {/* 🗓️ TIMELINE AXIS */}
        <div className="flex justify-between mt-8 border-t border-white/5 pt-6">
          {data.map((d, i) => (
            <div key={i} className="text-center">
              <p className="text-[8px] font-black uppercase tracking-widest text-white/20 group-hover:text-white/40 transition-colors">{d.day}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 🛠️ SYSTEM UPTIME INDICATOR */}
      <div className="absolute bottom-10 right-10 flex items-center gap-3">
         <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className={`w-1 h-3 rounded-full ${i === 5 ? 'bg-white/10' : 'bg-[#2ECC71] shadow-[0_0_5px_#2ECC71]'}`} />
            ))}
         </div>
         <p className="text-[7px] font-black uppercase tracking-[0.3em] text-white/20 italic">Quantum Logic • Operational</p>
      </div>
    </motion.div>
  );
}
