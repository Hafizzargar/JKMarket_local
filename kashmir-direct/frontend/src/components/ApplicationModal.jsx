'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, User, Mail, Phone, FileText, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export default function ApplicationModal({ isOpen, onClose, job }) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    cover_letter: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await supabase
        .from('applications')
        .insert([{
          ...formData,
          job_id: job.id,
          status: 'Pending'
        }]);

      if (error) throw error;
      setSubmitted(true);
      toast.success('Application forged successfully!');
    } catch (err) {
      console.error('Application Error:', err);
      toast.error('Could not submit application.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 sm:p-12">
          {/* 🎭 BACKDROP */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#1B4332]/95 backdrop-blur-2xl" 
            onClick={onClose} 
          />
          
          {/* 🛡️ APPLICATION FORGE */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            className="relative bg-[#FDFBF7] w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.3)] flex flex-col max-h-[90vh] no-scrollbar"
          >
             {submitted ? (
               <div className="p-16 text-center space-y-8">
                  <div className="w-24 h-24 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center mx-auto text-emerald-500 border border-emerald-500/20 shadow-inner">
                     <CheckCircle2 size={48} />
                  </div>
                  <div className="space-y-4">
                     <h2 className="text-4xl font-black text-[#1B4332] tracking-tighter uppercase">Identity <span className="text-[#BC6C25] italic font-serif font-normal">Registered</span></h2>
                     <p className="text-[#1B4332]/40 font-medium text-sm leading-relaxed">
                        Your application for <span className="text-[#BC6C25] font-bold">{job?.title}</span> has been forged in the talent pool. Our governors will review your credentials shortly.
                     </p>
                  </div>
                  <button 
                    onClick={onClose}
                    className="w-full h-16 bg-[#1B4332] text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] shadow-xl shadow-[#1B4332]/20 transition-all hover:bg-[#BC6C25]"
                  >
                     Return to Valley
                  </button>
               </div>
             ) : (
               <>
                 <div className="p-10 sm:p-12 border-b border-[#1B4332]/5 flex items-center justify-between bg-white relative">
                    <div>
                       <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#BC6C25] mb-2 block">Application Node</span>
                       <h2 className="text-2xl sm:text-3xl font-black text-[#1B4332] tracking-tighter uppercase leading-none">
                          {job?.title}
                       </h2>
                    </div>
                    <button onClick={onClose} className="w-12 h-12 rounded-xl bg-[#1B4332]/5 text-[#1B4332]/20 hover:text-rose-500 transition-all flex items-center justify-center">
                       <X size={20} />
                    </button>
                 </div>

                 <form onSubmit={handleSubmit} className="p-10 sm:p-12 overflow-y-auto no-scrollbar space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                       <div className="space-y-3">
                          <label className="text-[9px] font-black uppercase tracking-[0.3em] text-[#1B4332]/40 ml-4">Full Identity</label>
                          <div className="relative">
                             <User size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-[#1B4332]/20" />
                             <input 
                                required
                                type="text"
                                placeholder="e.g. Aryan Zargar"
                                value={formData.full_name}
                                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                                className="w-full h-16 bg-white border border-[#1B4332]/10 rounded-2xl pl-14 pr-8 text-[12px] font-bold text-[#1B4332] focus:border-[#BC6C25]/40 focus:outline-none transition-all shadow-sm"
                             />
                          </div>
                       </div>
                       <div className="space-y-3">
                          <label className="text-[9px] font-black uppercase tracking-[0.3em] text-[#1B4332]/40 ml-4">Communication Line</label>
                          <div className="relative">
                             <Mail size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-[#1B4332]/20" />
                             <input 
                                required
                                type="email"
                                placeholder="email@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className="w-full h-16 bg-white border border-[#1B4332]/10 rounded-2xl pl-14 pr-8 text-[12px] font-bold text-[#1B4332] focus:border-[#BC6C25]/40 focus:outline-none transition-all shadow-sm"
                             />
                          </div>
                       </div>
                    </div>

                    <div className="space-y-3">
                       <label className="text-[9px] font-black uppercase tracking-[0.3em] text-[#1B4332]/40 ml-4">Contact Pulse (Optional)</label>
                       <div className="relative">
                          <Phone size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-[#1B4332]/20" />
                          <input 
                             type="tel"
                             placeholder="+91 XXXX-XXXXXX"
                             value={formData.phone}
                             onChange={(e) => setFormData({...formData, phone: e.target.value})}
                             className="w-full h-16 bg-white border border-[#1B4332]/10 rounded-2xl pl-14 pr-8 text-[12px] font-bold text-[#1B4332] focus:border-[#BC6C25]/40 focus:outline-none transition-all shadow-sm"
                          />
                       </div>
                    </div>

                    <div className="space-y-3">
                       <label className="text-[9px] font-black uppercase tracking-[0.3em] text-[#1B4332]/40 ml-4">Legacy Forge (Cover Letter)</label>
                       <textarea 
                          required
                          placeholder="Tell us about your craftsmanship and why you wish to join our legacy..."
                          rows={5}
                          value={formData.cover_letter}
                          onChange={(e) => setFormData({...formData, cover_letter: e.target.value})}
                          className="w-full bg-white border border-[#1B4332]/10 rounded-[2.5rem] p-8 text-[12px] font-medium text-[#1B4332] focus:border-[#BC6C25]/40 focus:outline-none transition-all shadow-sm min-h-[160px] leading-relaxed"
                       />
                    </div>

                    <button 
                       disabled={loading}
                       type="submit" 
                       className="w-full h-20 bg-[#BC6C25] text-white rounded-[2rem] text-[12px] font-black uppercase tracking-[0.4em] shadow-2xl shadow-[#BC6C25]/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-4 group/btn"
                    >
                       {loading ? 'Transmitting...' : 'Forge Application'}
                       <Send size={20} className="group-hover/btn:translate-x-2 group-hover/btn:-translate-y-2 transition-transform duration-500" />
                    </button>
                 </form>
               </>
             )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
