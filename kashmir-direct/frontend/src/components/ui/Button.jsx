'use client';

import { motion } from 'framer-motion';

export default function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  isLoading = false,
  ...props 
}) {
  const variants = {
    primary: 'bg-[#1B4332] text-white shadow-[0_10px_20px_-5px_rgba(27,67,50,0.3)] hover:bg-[#2d5a45]',
    secondary: 'bg-emerald-50 text-[#1B4332] hover:bg-emerald-100',
    outline: 'bg-transparent border border-gray-100 text-gray-400 hover:bg-gray-50',
    danger: 'bg-rose-600 text-white shadow-[0_10px_20px_-5px_rgba(225,29,72,0.3)] hover:bg-rose-500',
    ghost: 'bg-transparent text-gray-400 hover:bg-gray-50/50'
  };

  const sizes = {
    sm: 'px-4 py-2 text-[8px]',
    md: 'px-6 py-4 text-[10px]',
    lg: 'px-8 py-5 text-[12px]'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98, y: 0 }}
      onClick={onClick}
      disabled={isLoading || props.disabled}
      className={`
        relative rounded-2xl font-black uppercase tracking-[0.2em] transition-all duration-300
        flex items-center justify-center gap-2 overflow-hidden
        ${variants[variant]}
        ${sizes[size]}
        ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}
        ${className}
      `}
      {...Object.fromEntries(Object.entries(props).filter(([key]) => key !== 'loading'))}
    >
      {/* Inner Aurora Glare */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
      
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : children}
    </motion.button>
  );
}
