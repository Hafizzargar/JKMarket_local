'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Package, Users, BarChart3, ChevronRight, CheckCircle2, Mail, Lock, User } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AddManagerSlideOver({ isOpen, onClose, onAdd }) {
  const [step, setStep] = useState(1); // 1: Info, 2: Role Selection
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'Listing Manager'
  });

  const roles = [
    {
      id: 'Listing Manager',
      icon: Package,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      description: 'Reviews & certifies products.',
      permissions: ['Certify Listings', 'Request Fixs', 'Edit Descriptions', 'Audit Reports']
    },
    {
      id: 'Artisan Manager',
      icon: Users,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      description: 'Oversees artisan accounts.',
      permissions: ['Approve Artisans', 'Verify Docs', 'Handle Complaints', 'Tier Management']
    },
    {
      id: 'Operations Manager',
      icon: BarChart3,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      description: 'Orders, delivery & finance.',
      permissions: ['Monitor Orders', 'Process Refunds', 'Courier Sync', 'Fraud Detection']
    }
  ];

  const handleSubmit = () => {
    if (!formData.full_name || !formData.email || !formData.password) {
      toast.error('Please complete all identity fields');
      return;
    }
    onAdd(formData);
    onClose();
    setStep(1);
    setFormData({ full_name: '', email: '', password: '', role: 'Listing Manager' });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 🌑 BACKDROP */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#1B4332]/40 backdrop-blur-sm z-[100]"
          />

          {/* 🏹 SLIDE-OVER */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-screen w-full max-w-lg bg-[#FDFBF7] shadow-2xl z-[110] flex flex-col"
          >
            {/* 🏛️ HEADER */}
            <div className="p-8 border-b border-[#1B4332]/5 flex items-center justify-between bg-white">
               <div>
                  <div className="flex items-center gap-2 mb-1">
                     <Shield size={16} className="text-[#BC6C25]" />
                     <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1B4332]/40">Manager Recruitment</span>
                  </div>
                  <h2 className="text-2xl font-black text-[#1B4332] uppercase tracking-tighter">New Manager</h2>
               </div>
               <button onClick={onClose} className="p-3 rounded-xl bg-[#1B4332]/5 text-[#1B4332]/40 hover:text-rose-500 transition-all">
                  <X size={20} />
               </button>
            </div>

            {/* 🧪 CONTENT */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-8">
               <div className="space-y-8">
                  {step === 1 ? (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                       <div className="space-y-4">
                          <label className="text-[10px] font-black text-[#1B4332]/40 uppercase tracking-widest ml-1">Identity Details</label>
                          <div className="relative">
                             <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1B4332]/20" />
                             <input 
                               type="text" 
                               placeholder="Full Name"
                               value={formData.full_name}
                               onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                               className="w-full bg-white border border-[#1B4332]/10 rounded-2xl pl-12 pr-6 py-4 text-xs font-bold focus:border-[#BC6C25]/40 focus:outline-none transition-all shadow-sm"
                             />
                          </div>
                          <div className="relative">
                             <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1B4332]/20" />
                             <input 
                               type="email" 
                               placeholder="Email Address"
                               value={formData.email}
                               onChange={(e) => setFormData({...formData, email: e.target.value})}
                               className="w-full bg-white border border-[#1B4332]/10 rounded-2xl pl-12 pr-6 py-4 text-xs font-bold focus:border-[#BC6C25]/40 focus:outline-none transition-all shadow-sm"
                             />
                          </div>
                          <div className="relative">
                             <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1B4332]/20" />
                             <input 
                               type="password" 
                               placeholder="Access Password"
                               value={formData.password}
                               onChange={(e) => setFormData({...formData, password: e.target.value})}
                               className="w-full bg-white border border-[#1B4332]/10 rounded-2xl pl-12 pr-6 py-4 text-xs font-bold focus:border-[#BC6C25]/40 focus:outline-none transition-all shadow-sm"
                             />
                          </div>
                       </div>

                       <div className="p-6 bg-[#BC6C25]/5 rounded-[2rem] border border-[#BC6C25]/10 border-dashed">
                          <p className="text-[10px] font-bold text-[#BC6C25] leading-relaxed italic">
                             "Managers are granted specific administrative nodes. Choose their role carefully to maintain platform sovereignty."
                          </p>
                       </div>
                    </motion.div>
                  ) : (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                       <label className="text-[10px] font-black text-[#1B4332]/40 uppercase tracking-widest ml-1">Assign Authority Tier</label>
                       <div className="grid gap-4">
                          {roles.map((r) => (
                            <button
                              key={r.id}
                              onClick={() => setFormData({...formData, role: r.id})}
                              className={`text-left p-6 rounded-[2rem] border transition-all flex items-start gap-4 group relative overflow-hidden ${
                                formData.role === r.id 
                                  ? 'bg-white border-[#BC6C25] shadow-xl' 
                                  : 'bg-white/50 border-[#1B4332]/5 hover:border-[#1B4332]/20'
                              }`}
                            >
                               <div className={`w-12 h-12 ${r.bg} ${r.color} rounded-2xl flex items-center justify-center shrink-0`}>
                                  <r.icon size={24} />
                               </div>
                               <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                     <h4 className="text-sm font-black text-[#1B4332] uppercase">{r.id}</h4>
                                     {formData.role === r.id && <CheckCircle2 size={16} className="text-[#BC6C25]" />}
                                  </div>
                                  <p className="text-[10px] font-medium text-[#1B4332]/40 mt-1">{r.description}</p>
                                  
                                  <div className="mt-4 flex flex-wrap gap-1.5">
                                     {r.permissions.map(p => (
                                       <span key={p} className="px-2 py-0.5 bg-[#1B4332]/5 text-[#1B4332]/40 rounded text-[7px] font-black uppercase tracking-widest">{p}</span>
                                     ))}
                                  </div>
                               </div>
                            </button>
                          ))}
                       </div>
                    </motion.div>
                  )}
               </div>
            </div>

            {/* 🏁 FOOTER */}
            <div className="p-8 border-t border-[#1B4332]/5 bg-white flex items-center gap-4">
               {step === 1 ? (
                 <button 
                   onClick={() => setStep(2)}
                   className="flex-1 h-14 bg-[#1B4332] text-white rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#1B4332]/20 hover:-translate-y-0.5 active:translate-y-0 transition-all"
                 >
                    Next Step: Assign Role <ChevronRight size={16} />
                 </button>
               ) : (
                 <>
                   <button 
                     onClick={() => setStep(1)}
                     className="h-14 px-6 border border-[#1B4332]/10 text-[#1B4332]/40 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#1B4332]/5 transition-all"
                   >
                      Back
                   </button>
                   <button 
                     onClick={handleSubmit}
                     className="flex-1 h-14 bg-[#BC6C25] text-white rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#BC6C25]/20 hover:-translate-y-0.5 active:translate-y-0 transition-all"
                   >
                      Confirm Recruitment <Shield size={16} />
                   </button>
                 </>
               )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
