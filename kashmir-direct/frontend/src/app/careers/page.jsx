'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { Briefcase, MapPin, Clock, ArrowRight, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import Button from '../../components/ui/Button';

export default function CareersPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (err) {
      console.error('Careers Fetch Error:', err);
      // Fallback dummy data for initial preview if table doesn't exist yet
      setJobs([
        { id: '1', title: 'Quality Assurance Auditor', department: 'Operations', location: 'Srinagar, JK', type: 'Full-time' },
        { id: '2', title: 'Artisan Relations Manager', department: 'Management', location: 'Jammu, JK', type: 'Full-time' },
        { id: '3', title: 'Logistics Fleet Coordinator', department: 'Supply Chain', location: 'Remote / India', type: 'Contract' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = filter === 'All' ? jobs : jobs.filter(j => j.department === filter);
  const departments = ['All', ...new Set(jobs.map(j => j.department))];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* 🏔️ HERO SECTION */}
      <section className="relative py-24 sm:py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[#1B4332]/[0.02] -skew-y-3 origin-right" />
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-[#BC6C25]/20">
              <span className="text-[9px] font-black tracking-[0.4em] uppercase text-[#BC6C25]">Join the Valley Legacy</span>
            </div>
            <h1 className="text-5xl sm:text-7xl font-black text-[#1B4332] tracking-tighter leading-none">
              Forge Your <br/>
              <span className="text-[#BC6C25] font-serif italic font-normal">Future</span>
            </h1>
            <p className="text-lg text-[#1B4332]/50 font-medium max-w-2xl mx-auto leading-relaxed">
              Help us scale the purest artisan marketplace in the world. We are looking for guardians of heritage and masters of modern logistics.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 🔍 FILTER & LISTING */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8">
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-2 w-full md:w-auto">
            {departments.map(dept => (
              <button
                key={dept}
                onClick={() => setFilter(dept)}
                className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  filter === dept 
                  ? 'bg-[#1B4332] text-white shadow-xl' 
                  : 'bg-white text-[#1B4332]/40 border border-[#1B4332]/5 hover:bg-[#1B4332]/5'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-64">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1B4332]/20" />
            <input 
              type="text" 
              placeholder="Search roles..." 
              className="w-full bg-white border border-[#1B4332]/5 rounded-full py-3 pl-12 pr-6 text-[11px] font-bold focus:outline-none focus:ring-2 focus:ring-[#BC6C25]/20"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-white rounded-[2rem] animate-pulse border border-[#1B4332]/5" />
            ))}
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-6"
          >
            {filteredJobs.length > 0 ? filteredJobs.map(job => (
              <motion.div 
                key={job.id}
                variants={itemVariants}
                whileHover={{ y: -4, scale: 1.01 }}
                className="glass-card bg-white p-8 sm:p-10 rounded-[2.5rem] border border-[#1B4332]/5 hover:shadow-2xl transition-all group cursor-pointer"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-[#BC6C25]/10 text-[#BC6C25] text-[8px] font-black uppercase tracking-widest rounded-lg">
                        {job.department}
                      </span>
                      <span className="text-[8px] font-black uppercase tracking-widest text-[#1B4332]/20 flex items-center gap-1">
                        <Clock size={10} /> {job.type}
                      </span>
                    </div>
                    <h3 className="text-2xl font-black text-[#1B4332] tracking-tight group-hover:text-[#BC6C25] transition-colors">{job.title}</h3>
                    <div className="flex items-center gap-4 text-[10px] font-bold text-[#1B4332]/40 italic">
                      <span className="flex items-center gap-1"><MapPin size={12} /> {job.location}</span>
                    </div>
                  </div>
                  <Button size="sm" className="w-full sm:w-auto px-10 h-12 flex items-center gap-2">
                    Apply Node <ArrowRight size={14} />
                  </Button>
                </div>
              </motion.div>
            )) : (
              <div className="text-center py-32 space-y-4">
                <div className="text-6xl">🔍</div>
                <h3 className="text-xl font-black text-[#1B4332]">No positions in this node</h3>
                <p className="text-[#1B4332]/40 text-sm">Try exploring a different department or check back soon.</p>
              </div>
            )}
          </motion.div>
        )}
      </section>

      {/* 🌟 CULTURE SECTION */}
      <section className="py-32 px-6 bg-[#1B4332] rounded-[4rem] sm:rounded-[6rem] mx-4 my-20">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tighter">
            We build for the <br/>
            <span className="text-[#BC6C25] font-serif italic font-normal">Next Century</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 text-white/60">
             <div className="space-y-4">
                <div className="text-3xl">🏔️</div>
                <h4 className="text-xs font-black uppercase tracking-widest text-white">Heritage First</h4>
                <p className="text-[11px] leading-relaxed">Protecting the soul of Kashmiri craftsmanship in every digital node.</p>
             </div>
             <div className="space-y-4">
                <div className="text-3xl">🛡️</div>
                <h4 className="text-xs font-black uppercase tracking-widest text-white">Pure Governance</h4>
                <p className="text-[11px] leading-relaxed">Uncompromising quality standards and ethical artisan relations.</p>
             </div>
             <div className="space-y-4">
                <div className="text-3xl">🚀</div>
                <h4 className="text-xs font-black uppercase tracking-widest text-white">Scale Global</h4>
                <p className="text-[11px] leading-relaxed">Bringing the valley's treasures to the world's most elite markets.</p>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}
