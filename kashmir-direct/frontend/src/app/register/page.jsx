'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Link from 'next/link';
import {
  User,
  Store,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Mail,
  Lock,
  Phone,
  Briefcase
} from 'lucide-react';
import toast from 'react-hot-toast';
import Logo from '../../components/ui/Logo';
import { supabase } from '../../lib/supabase';

export default function Register() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-organic-mesh text-[#1B4332] font-black uppercase tracking-widest animate-pulse">Initializing Vault...</div>}>
      <RegisterContent />
    </Suspense>
  );
}

function RegisterContent() {
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('type') === 'seller' ? 'seller' : 'customer';

  const [step, setStep] = useState(1);
  const [role, setRole] = useState(initialRole);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
    businessName: '',
    gstNumber: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cooldownActive, setCooldownActive] = useState(false);
  const { signUp, SUPER_ADMIN_EMAIL } = useAuth();
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (step === 1 && (!formData.fullName || !formData.phoneNumber)) {
      toast.error('Identity details required');
      return;
    }
    setStep(step + 1);
  };

  const handleRegister = async (e) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);

    try {
      // 🛡️ AUTH HARDENING: Pass metadata so database triggers can succeed
      const { data: authData, error: authError } = await signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            phone: formData.phoneNumber,
            role: role // 'customer' or 'seller'
          }
        }
      });

      setStep(4); // Success step
      toast.success('Registration complete. Welcome to the valley.');
    } catch (err) {
      console.error('REGISTRATION FAILURE:', err);

      // 🛡️ SOVEREIGN COOLDOWN HANDLER
      if (err.message?.toLowerCase().includes('security purposes')) {
        setCooldownActive(true);
        setTimeout(() => setCooldownActive(false), 5000); // UI Cooldown Reset

        toast.dismiss(); // Clear any pending toasts
        toast.error('Sovereign Cooldown Active. The valley vault is temporarily locked for security. Please wait 60 seconds.', {
          id: 'auth-cooldown', // Prevent duplicates
          duration: 6000,
          icon: '🛡️',
          style: {
            borderRadius: '1.5rem',
            background: '#1B4332',
            color: '#fff',
            fontSize: '12px',
            fontWeight: '900',
            border: '1px solid rgba(255,255,255,0.1)'
          }
        });
      } else {
        toast.error(err.message || 'Registration failed. Please check your credentials.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-10 relative overflow-hidden">
      <div className="bg-organic-mesh fixed inset-0" />
      <div className="noise-overlay fixed inset-0" />

      <div className="w-full max-w-xl bg-white/80 backdrop-blur-xl rounded-[2.5rem] sm:rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(27,67,50,0.08)] border border-[#1B4332]/10 overflow-hidden flex flex-col relative z-10 my-4 sm:my-12">

        {/* 🏔️ PROGRESS HEADER */}
        <div className="p-8 sm:p-10 pb-0 flex justify-between items-center relative z-20">
          <div className="flex items-center gap-6">
            <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-[#1B4332]/5 text-[#1B4332]/40 hover:text-[#1B4332] transition-all">
              <ArrowLeft size={16} />
            </Link>
            <div className="flex gap-2">
              {[1, 2, 3].map((s) => (
                <div key={s} className={`h-1.5 rounded-full transition-all duration-700 ${step >= s ? 'w-10 bg-[#1B4332]' : 'w-4 bg-[#1B4332]/5'}`} />
              ))}
            </div>
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#1B4332]/20">Phase {step}</span>
        </div>

        <div className="p-8 sm:p-12 flex-grow flex flex-col">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4 sm:space-y-8">
                <div className="text-center sm:text-left">
                  <Link href="/" className="inline-block mb-4 sm:mb-8 hover:opacity-80 transition-opacity">
                    <Logo className="h-8 sm:h-10 mx-auto sm:mx-0" />
                  </Link>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tighter text-[#1B4332]">Join the Community</h1>
                  <p className="text-[10px] sm:text-xs text-[#1B4332]/40 mt-1">Select your path in the valley.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      id: 'customer',
                      label: 'Connoisseur / Buyer',
                      desc: 'Shop the authenticated treasures of the valley',
                      icon: User,
                      color: 'bg-amber-500',
                      borderColor: 'border-amber-500/20'
                    },
                    {
                      id: 'seller',
                      label: 'Artisan / Shopkeeper',
                      desc: 'Open your heritage workshop to the world',
                      icon: Store,
                      color: 'bg-[#1B4332]',
                      borderColor: 'border-[#1B4332]/20'
                    }
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id)}
                      className={`p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border-2 transition-all flex flex-col items-center gap-2 sm:gap-4 group relative overflow-hidden text-center ${role === r.id
                          ? `${r.borderColor} bg-white shadow-xl shadow-[#1B4332]/5 scale-[1.02]`
                          : 'bg-white/50 backdrop-blur-md border-transparent text-[#1B4332]/40 hover:bg-white hover:border-[#1B4332]/5'
                        }`}
                    >
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-500 ${role === r.id ? `${r.color} text-white shadow-lg` : 'bg-[#1B4332]/5 text-[#1B4332]/20 group-hover:bg-[#1B4332]/10'
                        }`}>
                        <r.icon size={18} />
                      </div>
                      <div className="space-y-1 relative z-10">
                        <span className={`text-[11px] font-black uppercase tracking-widest block ${role === r.id ? 'text-[#1B4332]' : ''}`}>
                          {r.label}
                        </span>
                        <p className={`text-[9px] font-bold leading-tight px-2 uppercase tracking-tighter ${role === r.id ? 'text-[#1B4332]/40' : 'text-[#1B4332]/20'}`}>
                          {r.desc}
                        </p>
                      </div>

                      {role === r.id && (
                        <motion.div
                          layoutId="activeRole"
                          className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#BC6C25] shadow-[0_0_10px_#BC6C25]"
                        />
                      )}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                  />
                  <Input
                    label="Phone"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="+91 98765..."
                  />
                </div>

                <Button onClick={handleNext} className="w-full h-12 rounded-xl group bg-gradient-to-r from-[#1B4332] to-[#2D5A47]">
                  Continue <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                <div className="text-center sm:text-left">
                  <h1 className="text-2xl font-black tracking-tighter text-[#1B4332]">Security Setup</h1>
                  <p className="text-[11px] text-[#1B4332]/40 mt-1">Establish your administrative credentials.</p>
                </div>

                <div className="space-y-4">
                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="artisan@valley.com"
                  />
                  <Input
                    label="Secure Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                  />
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="p-3 rounded-xl border border-[#1B4332]/5 text-[#1B4332]/40 hover:text-[#1B4332] transition-colors">
                    <ArrowLeft size={18} />
                  </button>
                  <Button
                    onClick={role === 'seller' ? handleNext : handleRegister}
                    className={`flex-grow h-12 rounded-xl bg-gradient-to-r from-[#1B4332] to-[#2D5A47] ${cooldownActive ? 'opacity-50' : ''}`}
                    disabled={cooldownActive}
                  >
                    {cooldownActive ? 'Security Cooldown Active' : (role === 'seller' ? 'Final Details' : 'Complete Setup')}
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                <div className="text-center sm:text-left">
                  <h1 className="text-2xl font-black tracking-tighter text-[#1B4332]">Business Vault</h1>
                  <p className="text-[11px] text-[#1B4332]/40 mt-1">Complete your shopkeeper profile for verification.</p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <Input
                    label="Workshop Name"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    placeholder="e.g. Kashmir Heritage Silks"
                  />
                  <Input
                    label="GST Registration"
                    name="gstNumber"
                    value={formData.gstNumber}
                    onChange={handleInputChange}
                    placeholder="GSTIN Number"
                  />
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="p-3 rounded-xl border border-[#1B4332]/5 text-[#1B4332]/40 hover:text-[#1B4332] transition-colors">
                    <ArrowLeft size={18} />
                  </button>
                  <Button
                    onClick={handleRegister}
                    className={`flex-grow h-12 rounded-xl bg-gradient-to-r from-[#1B4332] to-[#2D5A47] ${cooldownActive ? 'opacity-50' : ''}`}
                    isLoading={isSubmitting}
                    disabled={cooldownActive}
                  >
                    {cooldownActive ? 'Security Cooldown Active' : 'Submit Verification'}
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="success" variants={stepVariants} initial="hidden" animate="visible" className="text-center py-12 space-y-6">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 size={40} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-[#1B4332]">Identity Created</h2>
                  <p className="text-xs text-[#1B4332]/40 mt-2 max-w-[200px] mx-auto">Welcome to the valley community. Your credentials are now active.</p>
                </div>
                <Button onClick={() => router.push('/login')} className="w-full h-14 rounded-2xl">
                  Enter the Marketplace
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {step < 4 && (
          <div className="px-12 py-8 bg-[#FDFBF7]/50 border-t border-[#1B4332]/5 text-center">
            <p className="text-[10px] font-bold text-[#1B4332]/30 uppercase tracking-widest">
              Already have an identity? <Link href="/login" className="text-[#1B4332] hover:underline">Sign In</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
