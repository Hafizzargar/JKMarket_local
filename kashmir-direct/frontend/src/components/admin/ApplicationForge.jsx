'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { Users, Mail, Phone, Calendar, Trash2, CheckCircle2, XCircle, FileText, ExternalLink, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ApplicationForge() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('applications')
        .select('*, jobs(title, department)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (err) {
      console.error('Application Sync Error:', err.message || err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', id);
      if (error) throw error;
      toast.success(`Application ${status}.`);
      fetchApplications();
    } catch (err) {
      toast.error('Status update failed.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Permanently delete this application?')) return;
    try {
      const { error } = await supabase.from('applications').delete().eq('id', id);
      if (error) throw error;
      toast.success('Application removed.');
      fetchApplications();
    } catch (err) {
      toast.error('Deletion failed.');
    }
  };

  return (
    <div className="space-y-8">
       {/* 🏛️ APPLICATIONS HEADER */}
       <div className="bg-white p-8 sm:p-12 rounded-[3.5rem] border border-[#1B4332]/5 shadow-[0_30px_70px_-20px_rgba(27,67,50,0.1)] flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
             <div className="w-16 h-16 bg-[#1B4332] rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-[#1B4332]/20">
                <Users size={30} />
             </div>
             <div>
                <h3 className="text-2xl font-black text-[#1B4332] uppercase tracking-tighter leading-none">Talent Pool</h3>
                <p className="text-[10px] font-bold text-[#1B4332]/30 uppercase tracking-[0.2em] mt-2">{applications.length} New applications</p>
             </div>
          </div>
       </div>

       {/* 📜 APPLICATIONS LIST */}
       <div className="grid grid-cols-1 gap-6">
          {loading ? (
             [1, 2, 3].map(i => <div key={i} className="h-40 bg-white animate-pulse rounded-[2.5rem] border border-[#1B4332]/5" />)
          ) : applications.length > 0 ? (
            applications.map(app => (
              <motion.div 
                key={app.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white border border-[#1B4332]/5 rounded-[2.5rem] p-8 md:p-10 hover:shadow-2xl transition-all group relative overflow-hidden"
              >
                 <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    <div className="flex items-start gap-6">
                       <div className="w-16 h-16 rounded-2xl bg-[#BC6C25]/10 flex items-center justify-center text-[#BC6C25] font-black text-xs border border-[#BC6C25]/20 shrink-0">
                          {app.full_name?.split(' ').map(n => n[0]).join('') || 'AP'}
                       </div>
                       <div className="space-y-2">
                          <h4 className="text-xl font-black text-[#1B4332] uppercase tracking-tighter">{app.full_name}</h4>
                          <div className="flex flex-wrap gap-4 items-center text-[10px] font-bold text-[#1B4332]/40 uppercase tracking-widest">
                             <span className="flex items-center gap-1.5"><Mail size={12} className="text-[#BC6C25]" /> {app.email}</span>
                             <span className="flex items-center gap-1.5"><Phone size={12} className="text-[#BC6C25]" /> {app.phone || 'No phone'}</span>
                             <span className="flex items-center gap-1.5 px-3 py-1 bg-[#1B4332]/5 rounded-lg text-[#1B4332] border border-[#1B4332]/5">
                                Applied for: <span className="text-[#BC6C25] ml-1">{app.jobs?.title || 'Unknown Role'}</span>
                             </span>
                          </div>
                       </div>
                    </div>

                    <div className="flex items-center gap-3 self-end lg:self-center">
                       <button 
                         onClick={() => updateStatus(app.id, 'Approved')}
                         className="h-12 px-6 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all text-[9px] font-black uppercase tracking-widest flex items-center gap-2"
                       >
                          <CheckCircle2 size={16} /> Approve
                       </button>
                       <button 
                         onClick={() => updateStatus(app.id, 'Rejected')}
                         className="h-12 px-6 rounded-xl bg-rose-500/5 border border-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all text-[9px] font-black uppercase tracking-widest flex items-center gap-2"
                       >
                          <XCircle size={16} /> Reject
                       </button>
                       <button 
                         onClick={() => handleDelete(app.id)}
                         className="h-12 w-12 rounded-xl bg-[#1B4332]/5 border border-[#1B4332]/5 text-[#1B4332]/20 hover:text-rose-500 hover:bg-rose-50 transition-all flex items-center justify-center"
                       >
                          <Trash2 size={18} />
                       </button>
                    </div>
                 </div>

                 {/* 📄 COVER LETTER & DETAILS */}
                 <div className="mt-8 pt-8 border-t border-[#1B4332]/5">
                    <p className="text-[12px] text-[#1B4332]/60 leading-relaxed font-medium bg-[#FDFBF7] p-6 rounded-2xl border border-[#1B4332]/5 border-dashed">
                       {app.cover_letter || 'No cover letter provided.'}
                    </p>
                 </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-24 bg-white rounded-[3.5rem] border border-[#1B4332]/5 border-dashed">
               <Users size={48} className="mx-auto text-[#1B4332]/5 mb-6" />
               <p className="text-[#1B4332]/20 font-black tracking-[0.4em] uppercase text-[10px]">No applications received yet</p>
            </div>
          )}
       </div>
    </div>
  );
}
