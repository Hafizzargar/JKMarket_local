'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { Plus, Briefcase, Trash2, Edit2, CheckCircle2, XCircle, Users, MapPin, Clock, Zap, ChevronRight, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

export default function JobForge() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: 'Srinagar, JK',
    type: 'Full-time',
    description: '',
    requirements: '',
    is_active: true
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (err) {
      console.error('Job Sync Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingJob) {
        const { error } = await supabase
          .from('jobs')
          .update(formData)
          .eq('id', editingJob.id);
        if (error) throw error;
        toast.success('Position updated.');
      } else {
        const { error } = await supabase
          .from('jobs')
          .insert([formData]);
        if (error) throw error;
        toast.success('New job posted.');
      }
      setIsModalOpen(false);
      setEditingJob(null);
      resetForm();
      fetchJobs();
    } catch (err) {
      toast.error('Could not save job.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this job?')) return;
    try {
      const { error } = await supabase.from('jobs').delete().eq('id', id);
      if (error) throw error;
      toast.success('Job deleted.');
      fetchJobs();
    } catch (err) {
      toast.error('Deletion failed.');
    }
  };

  const toggleStatus = async (job) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ is_active: !job.is_active })
        .eq('id', job.id);
      if (error) throw error;
      toast.success(job.is_active ? 'Hiring paused.' : 'Hiring resumed.');
      fetchJobs();
    } catch (err) {
      toast.error('Update failed.');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      department: '',
      location: 'Srinagar, JK',
      type: 'Full-time',
      description: '',
      requirements: '',
      is_active: true
    });
  };

  const openEdit = (job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      description: job.description,
      requirements: job.requirements,
      is_active: job.is_active
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* 🛡️ RECRUITMENT HEADER */}
      <div className="bg-white p-8 sm:p-12 rounded-[3.5rem] border border-[#1B4332]/5 shadow-[0_30px_70px_-20px_rgba(27,67,50,0.1)] flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-[30%] h-full bg-[#BC6C25]/5 blur-[80px] pointer-events-none" />
         
         <div className="flex items-center gap-6 sm:gap-8 relative z-10">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[2rem] bg-[#BC6C25]/10 flex items-center justify-center border border-[#BC6C25]/30 shadow-[0_0_30px_rgba(188,108,37,0.1)] group-hover:scale-105 transition-transform duration-500">
               <Briefcase size={32} className="text-[#BC6C25]" />
            </div>
            <div className="space-y-2">
               <h2 className="text-2xl sm:text-3xl font-black tracking-tighter uppercase italic text-[#1B4332] leading-none">Job Board</h2>
               <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
                  <p className="text-[9px] sm:text-[10px] font-black text-[#1B4332]/30 uppercase tracking-[0.2em]">{jobs.length} Active job posts</p>
               </div>
            </div>
         </div>
         
         <button 
           onClick={() => { resetForm(); setEditingJob(null); setIsModalOpen(true); }}
           className="w-full md:w-auto px-10 py-5 bg-[#BC6C25] hover:bg-[#E87C2A] text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-[#BC6C25]/20 transition-all flex items-center justify-center gap-4 relative z-10 group/btn"
         >
            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-500" /> 
            Post New Job
         </button>
      </div>

      {/* 📜 VACANCY LIST */}
      <div className="grid grid-cols-1 gap-6 relative">
        {loading ? (
           [1, 2, 3].map(i => <div key={i} className="h-28 bg-white animate-pulse rounded-[2.5rem] border border-[#1B4332]/5" />)
        ) : jobs.length > 0 ? (
          jobs.map(job => (
            <motion.div 
              key={job.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white border border-[#1B4332]/5 rounded-[2.5rem] p-8 md:px-12 flex flex-col md:flex-row items-center justify-between group hover:bg-[#FDFBF7] hover:border-[#BC6C25]/20 transition-all shadow-xl relative overflow-hidden"
            >
               {/* 🎭 HOVER ACCENT */}
               <div className="absolute top-0 left-0 h-full w-1.5 bg-[#BC6C25] scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />

               <div className="flex items-center gap-6 sm:gap-10 w-full md:w-auto">
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center border transition-all duration-500 ${job.is_active ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-500 shadow-sm' : 'bg-[#1B4332]/5 border-[#1B4332]/5 text-[#1B4332]/10'}`}>
                     {job.is_active ? <Zap size={24} className="fill-emerald-500" /> : <XCircle size={24} />}
                  </div>
                  <div className="space-y-2">
                     <div className="flex items-center gap-4 flex-wrap">
                        <h3 className="text-xl sm:text-2xl font-black text-[#1B4332]/90 tracking-tighter group-hover:text-[#1B4332] transition-colors uppercase italic">{job.title}</h3>
                        <span className="px-4 py-1.5 bg-[#1B4332]/5 rounded-xl text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-[#BC6C25] border border-[#1B4332]/5">{job.department}</span>
                     </div>
                     <div className="flex items-center gap-6 text-[9px] sm:text-[10px] font-bold text-[#1B4332]/20 uppercase tracking-[0.15em]">
                        <span className="flex items-center gap-2 group-hover:text-[#1B4332]/40 transition-colors"><MapPin size={14} className="text-[#BC6C25]" /> {job.location}</span>
                        <span className="flex items-center gap-2 group-hover:text-[#1B4332]/40 transition-colors"><Clock size={14} className="text-[#BC6C25]" /> {job.type}</span>
                     </div>
                  </div>
               </div>

               <div className="flex items-center gap-4 mt-8 md:mt-0 w-full md:w-auto border-t md:border-t-0 border-[#1B4332]/5 pt-6 md:pt-0">
                  <button 
                    onClick={() => toggleStatus(job)}
                    className={`h-11 px-5 rounded-xl transition-all flex items-center gap-2 text-[9px] font-black uppercase tracking-widest border ${job.is_active ? 'text-amber-600 bg-amber-500/5 border-amber-500/10 hover:bg-amber-500 hover:text-white' : 'text-emerald-600 bg-emerald-500/5 border-emerald-500/10 hover:bg-emerald-500 hover:text-white'}`}
                    title={job.is_active ? 'Pause Hiring' : 'Resume Hiring'}
                  >
                     {job.is_active ? <XCircle size={14} /> : <CheckCircle2 size={14} />}
                     {job.is_active ? 'Pause' : 'Resume'}
                  </button>
                  <button 
                    onClick={() => openEdit(job)}
                    className="h-11 w-11 rounded-xl bg-[#1B4332]/5 border border-[#1B4332]/5 text-[#1B4332]/20 hover:text-[#1B4332] hover:bg-[#1B4332]/10 hover:border-[#1B4332]/20 transition-all flex items-center justify-center shadow-sm"
                  >
                     <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(job.id)}
                    className="h-11 w-11 rounded-xl bg-rose-500/5 border border-rose-500/10 text-rose-500/30 hover:text-white hover:bg-rose-500 transition-all flex items-center justify-center shadow-sm"
                  >
                     <Trash2 size={18} />
                  </button>
                  <ChevronRight size={20} className="text-[#1B4332]/5 group-hover:text-[#BC6C25] group-hover:translate-x-2 transition-all ml-4 hidden md:block" />
               </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-24 bg-white rounded-[3.5rem] border border-[#1B4332]/5 border-dashed group hover:border-[#BC6C25]/20 transition-all">
             <Briefcase size={48} className="mx-auto text-[#1B4332]/5 mb-8 group-hover:text-[#BC6C25]/20 group-hover:scale-110 transition-all duration-700" />
             <p className="text-[#1B4332]/20 font-black tracking-[0.4em] uppercase text-xs px-6">No active jobs posted</p>
             <button onClick={() => setIsModalOpen(true)} className="mt-8 text-[#BC6C25] text-[10px] font-black uppercase tracking-widest hover:text-[#1B4332] transition-colors">Create First Job</button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            {/* 🎭 BACKDROP */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#1B4332]/90 backdrop-blur-xl" 
              onClick={() => setIsModalOpen(false)} 
            />
            
            {/* 🛡️ FORGE MODAL */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative bg-[#FDFBF7] border border-[#1B4332]/10 w-full max-w-3xl rounded-[3rem] p-10 md:p-16 shadow-[0_50px_100px_rgba(27,67,50,0.2)] overflow-y-auto max-h-[90vh] no-scrollbar group/modal"
            >
               {/* 🎭 AMBIENT ACCENT */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-[#BC6C25]/5 blur-[100px] pointer-events-none" />

               <div className="flex items-center gap-4 mb-10">
                  <div className="w-2 h-2 bg-[#BC6C25] rounded-full animate-pulse" />
                  <h2 className="text-2xl sm:text-3xl font-black text-[#1B4332] tracking-tighter uppercase italic leading-none">
                    {editingJob ? 'Edit Job Post' : 'Post New Job'}
                  </h2>
               </div>
               
               <form onSubmit={handleSubmit} className="space-y-8 sm:space-y-10 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-[#BC6C25] ml-4">Job Title</label>
                        <input 
                           required
                           type="text" 
                           value={formData.title}
                           onChange={(e) => setFormData({...formData, title: e.target.value})}
                           placeholder="e.g. Sales Manager"
                           className="w-full bg-white border border-[#1B4332]/10 rounded-2xl px-8 py-5 text-[#1B4332] text-xs font-bold focus:border-[#BC6C25]/50 focus:outline-none transition-all shadow-sm"
                        />
                     </div>
                     <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-[#BC6C25] ml-4">Department</label>
                        <input 
                           required
                           type="text" 
                           value={formData.department}
                           onChange={(e) => setFormData({...formData, department: e.target.value})}
                           placeholder="e.g. Management"
                           className="w-full bg-white border border-[#1B4332]/10 rounded-2xl px-8 py-5 text-[#1B4332] text-xs font-bold focus:border-[#BC6C25]/50 focus:outline-none transition-all shadow-sm"
                        />
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-[#BC6C25] ml-4">Location</label>
                        <div className="relative">
                           <MapPin size={14} className="absolute left-6 top-1/2 -translate-y-1/2 text-[#1B4332]/20" />
                           <input 
                              required
                              type="text" 
                              value={formData.location}
                              onChange={(e) => setFormData({...formData, location: e.target.value})}
                              className="w-full bg-white border border-[#1B4332]/10 rounded-2xl pl-14 pr-8 py-5 text-[#1B4332] text-xs font-bold focus:border-[#BC6C25]/50 focus:outline-none transition-all shadow-sm"
                           />
                        </div>
                     </div>
                     <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-[#BC6C25] ml-4">Job Type</label>
                        <div className="relative">
                           <Clock size={14} className="absolute left-6 top-1/2 -translate-y-1/2 text-[#1B4332]/20" />
                           <select 
                              value={formData.type}
                              onChange={(e) => setFormData({...formData, type: e.target.value})}
                              className="w-full bg-white border border-[#1B4332]/10 rounded-2xl pl-14 pr-8 py-5 text-[#1B4332] text-xs font-bold focus:border-[#BC6C25]/50 focus:outline-none appearance-none cursor-pointer transition-all shadow-sm"
                           >
                              <option value="Full-time">Full-time</option>
                              <option value="Part-time">Part-time</option>
                              <option value="Contract">Contract</option>
                              <option value="Internship">Internship</option>
                           </select>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-3">
                     <label className="text-[9px] font-black uppercase tracking-[0.3em] text-[#BC6C25] ml-4">Description</label>
                     <textarea 
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        rows={4}
                        className="w-full bg-white border border-[#1B4332]/10 rounded-[2rem] px-8 py-6 text-[#1B4332] text-xs font-medium focus:border-[#BC6C25]/50 focus:outline-none transition-all shadow-sm min-h-[140px] leading-relaxed"
                        placeholder="Detail the job responsibilities..."
                     />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-8">
                     <button type="submit" className="flex-[2] bg-[#BC6C25] hover:bg-[#E87C2A] text-white py-6 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-[#BC6C25]/20 transition-all flex items-center justify-center gap-4">
                        <Zap size={18} className="fill-white" />
                        {editingJob ? 'Update Job' : 'Post New Job'}
                     </button>
                     <button 
                       type="button" 
                       onClick={() => setIsModalOpen(false)} 
                       className="flex-1 bg-[#1B4332]/5 text-[#1B4332]/30 py-6 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-[#1B4332]/10 hover:text-[#1B4332] transition-all border border-[#1B4332]/5"
                     >
                        Cancel
                     </button>
                  </div>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
