'use client';

import { Loader2 } from 'lucide-react';

export default function AdminButton({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  icon: Icon, 
  loading = false, 
  disabled = false,
  className = '',
  ...props
}) {
  const baseStyles = "h-12 px-8 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-[#BC6C25] hover:bg-[#E87C2A] text-white shadow-xl shadow-[#BC6C25]/20",
    secondary: "bg-[#1B4332]/5 text-[#1B4332]/30 hover:bg-[#1B4332]/10",
    danger: "bg-rose-500/5 text-rose-500 border border-rose-500/10 hover:bg-rose-500 hover:text-white",
    success: "bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl shadow-emerald-500/10",
    outline: "bg-transparent border border-[#1B4332]/10 text-[#1B4332]/60 hover:border-[#BC6C25] hover:text-[#BC6C25]"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <>
          {Icon && <Icon size={16} className={variant === 'primary' ? 'fill-white' : ''} />}
          {children}
        </>
      )}
    </button>
  );
}
