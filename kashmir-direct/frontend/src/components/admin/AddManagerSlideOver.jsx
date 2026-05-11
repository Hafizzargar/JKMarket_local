import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Package, Users, BarChart3, ChevronRight, CheckCircle2, Mail, Lock, User, Info } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { ForgeModal, ForgeInput, ForgeButton } from './shared/ForgeComponents';

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
      permissions: ['Certify Listings', 'Request Fixes', 'Edit Descriptions']
    },
    {
      id: 'Artisan Manager',
      icon: Users,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      description: 'Oversees artisan accounts.',
      permissions: ['Approve Artisans', 'Verify Docs', 'Tier Management']
    },
    {
      id: 'Operations Manager',
      icon: BarChart3,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      description: 'Orders, delivery & finance.',
      permissions: ['Monitor Orders', 'Process Refunds', 'Fraud Detection']
    }
  ];

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
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
    <ForgeModal
      isOpen={isOpen}
      onClose={onClose}
      title="Manager Recruitment"
      subtitle={step === 1 ? "Step 1: Identity Profile" : "Step 2: Assign Authority Tier"}
      icon={Shield}
      footer={
        <>
           {step === 1 ? (
             <ForgeButton 
               onClick={() => setStep(2)}
               icon={ChevronRight}
               type="button"
             >
                Next Step: Assign Role
             </ForgeButton>
           ) : (
             <>
               <ForgeButton 
                 variant="secondary"
                 onClick={() => setStep(1)}
                 type="button"
               >
                  Back
               </ForgeButton>
               <ForgeButton 
                 onClick={handleSubmit}
                 icon={Shield}
                 type="submit"
                 form="recruitment-form"
               >
                  Confirm Recruitment
               </ForgeButton>
             </>
           )}
        </>
      }
    >
      <form id="recruitment-form" onSubmit={handleSubmit} className="space-y-8 py-2">
         <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                 <ForgeInput 
                    label="Full Legal Name"
                    icon={User}
                    placeholder="John Doe"
                    value={formData.full_name}
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    required
                 />
                 <ForgeInput 
                    label="Corporate Email"
                    icon={Mail}
                    type="email"
                    placeholder="john@kashmir-direct.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                 />
                 <ForgeInput 
                    label="Access Password"
                    icon={Lock}
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                 />

                 <div className="p-5 bg-[#BC6C25]/5 rounded-[10px] border border-[#BC6C25]/10 flex items-start gap-3">
                    <Info size={16} className="text-[#BC6C25] shrink-0 mt-0.5" />
                    <p className="text-[10px] font-bold text-[#BC6C25]/80 leading-relaxed italic uppercase tracking-widest">
                       "Managers are granted specific administrative nodes. Choose their role carefully to maintain platform sovereignty."
                    </p>
                 </div>
              </motion.div>
            ) : (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -20 }}
                className="grid gap-4"
              >
                 {roles.map((r) => (
                   <button
                     key={r.id}
                     onClick={() => setFormData({...formData, role: r.id})}
                     className={`text-left p-6 rounded-[10px] border transition-all flex items-start gap-4 group relative overflow-hidden ${
                       formData.role === r.id 
                         ? 'bg-white border-[#BC6C25] shadow-xl' 
                         : 'bg-white/50 border-[#1B4332]/5 hover:border-[#1B4332]/20 shadow-sm'
                     }`}
                   >
                      <div className={`w-12 h-12 ${r.bg} ${r.color} rounded-[10px] flex items-center justify-center shrink-0 border border-current/10`}>
                         <r.icon size={24} />
                      </div>
                      <div className="flex-1">
                         <div className="flex items-center justify-between">
                            <h4 className="text-sm font-black text-[#1B4332] uppercase tracking-tighter">{r.id}</h4>
                            {formData.role === r.id && <CheckCircle2 size={18} className="text-[#BC6C25]" />}
                         </div>
                         <p className="text-[10px] font-medium text-[#1B4332]/40 mt-1">{r.description}</p>
                         
                         <div className="mt-4 flex flex-wrap gap-1.5">
                            {r.permissions.map(p => (
                               <span key={p} className="px-2 py-0.5 bg-[#1B4332]/5 text-[#1B4332]/40 rounded-[10px] text-[7px] font-black uppercase tracking-widest border border-[#1B4332]/5">{p}</span>
                            ))}
                         </div>
                      </div>
                   </button>
                 ))}
              </motion.div>
            )}
         </AnimatePresence>
      </form>
    </ForgeModal>
  );
}
