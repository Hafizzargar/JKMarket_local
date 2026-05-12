'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, Briefcase, AlertCircle } from 'lucide-react';

/**
 * 🛡️ FORGE MODAL
 * A premium, governance-style modal with high corner radius and elite layout.
 */
export const ForgeModal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon: Icon,
  children,
  footer,
  maxWidth = 'max-w-xl'
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          {/* 🎭 BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#1B4332]/40 backdrop-blur-md"
            onClick={onClose}
          />

          {/* 🛡️ VAULT CONTAINER */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className={`relative bg-white w-full ${maxWidth} rounded-[10px] shadow-[0_50px_100px_-20px_rgba(27,67,50,0.2)] border border-[#1B4332]/5 max-h-[95vh] flex flex-col`}
          >
            {/* 🎩 ELITE HEADER */}
            <div className="flex items-center justify-between px-6 sm:px-8 pt-6 sm:pt-8 mb-6 shrink-0">
              <div className="flex items-center gap-4">
                {Icon && (
                  <div className="w-10 h-10 rounded-[10px] bg-[#BC6C25]/10 text-[#BC6C25] flex items-center justify-center shadow-sm border border-[#BC6C25]/10">
                    <Icon size={20} />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-black tracking-tighter uppercase italic text-[#1B4332] leading-none">{title}</h3>
                  {subtitle && <p className="text-[#1B4332]/30 text-[9px] font-black uppercase tracking-[0.2em] mt-2">{subtitle}</p>}
                </div>
              </div>
              <button onClick={onClose} className="p-3 bg-[#1B4332]/5 rounded-2xl text-[#1B4332]/40 hover:bg-[#BC6C25] hover:text-white transition-all">
                <X size={20} />
              </button>
            </div>

            {/* 🍱 MAIN CONTENT */}
            <div className="flex-1 overflow-y-auto no-scrollbar px-6 sm:px-8 pb-6">
              {children}
            </div>

            {/* 🚀 ACTION FOOTER */}
            {footer && (
              <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-2 shrink-0 flex flex-row items-center justify-end gap-3">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

/**
 * 🏷️ FORGE INPUT
 * Card-styled input with icon and premium focus states.
 */
export const ForgeInput = ({ label, icon: Icon, ...props }) => (
  <div className="bg-[#1B4332]/[0.05] p-4 rounded-[10px] border border-[#1B4332]/10 group hover:border-[#BC6C25]/40 transition-all">
    <div className="flex items-center gap-2 mb-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
      {Icon && <Icon size={10} className="text-[#BC6C25]" />}
      <label className="text-[8px] font-black uppercase tracking-widest text-[#1B4332]">{label}</label>
    </div>
    <input
      {...props}
      className="w-full bg-transparent border-none text-[#1B4332] text-[12px] font-black focus:outline-none focus:text-[#BC6C25] transition-colors p-0 placeholder:text-[#1B4332]/30"
    />
  </div>
);

/**
 * 🍱 FORGE SELECT
 * Card-styled select with icon and custom arrow.
 */
export const ForgeSelect = ({ label, icon: Icon, children, ...props }) => (
  <div className="bg-[#1B4332]/[0.05] p-4 rounded-[10px] border border-[#1B4332]/10 group hover:border-[#BC6C25]/40 transition-all">
    <div className="flex items-center gap-2 mb-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
      {Icon && <Icon size={10} className="text-[#BC6C25]" />}
      <label className="text-[8px] font-black uppercase tracking-widest text-[#1B4332]">{label}</label>
    </div>
    <div className="relative">
      <select
        {...props}
        className="w-full bg-transparent border-none text-[#1B4332] text-[12px] font-black focus:outline-none focus:text-[#BC6C25] transition-colors p-0 appearance-none cursor-pointer"
      >
        {children}
      </select>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-[#1B4332]/30 group-hover:text-[#BC6C25]">
        <ChevronDown size={12} />
      </div>
    </div>
  </div>
);

/**
 * 📝 FORGE TEXTAREA
 * Large card-styled textarea for descriptions/notes.
 */
export const ForgeTextarea = ({ label, ...props }) => (
  <div className="bg-[#1B4332]/[0.05] p-7 rounded-3xl border border-[#1B4332]/10 group hover:border-[#BC6C25]/40 transition-all">
    <label className="text-[9px] font-black uppercase tracking-widest text-[#1B4332]/50 block mb-4">{label}</label>
    <textarea
      {...props}
      className="w-full bg-transparent border-none text-[13px] font-medium text-[#1B4332]/80 leading-relaxed italic focus:ring-0 p-0 h-32 resize-none no-scrollbar placeholder:text-[#1B4332]/20"
    />
  </div>
);

/**
 * 📊 FORGE TABLE
 * Premium, high-density table for administrative data registries.
 */
export const ForgeTable = ({
  columns = [],
  data = [],
  renderRow,
  loading = false,
  emptyMessage = "No records found",
  icon: EmptyIcon = Briefcase,
  header,
  footer
}) => {
  if (!loading && data.length === 0) {
    return (
      <div className="bg-white border border-[#1B4332]/5 rounded-[10px] py-24 flex flex-col items-center justify-center text-center px-6 shadow-sm">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-[#BC6C25]/10 blur-[50px] rounded-full animate-pulse" />
          <div className="w-20 h-20 bg-[#1B4332]/5 rounded-2xl border border-[#1B4332]/10 flex items-center justify-center text-[#1B4332]/10 relative z-10">
            <EmptyIcon size={40} className="opacity-20" />
          </div>
        </div>
        <h4 className="text-xl font-black text-[#1B4332]/30 uppercase italic tracking-tighter">{emptyMessage}</h4>
        <p className="text-[9px] font-bold text-[#1B4332]/10 uppercase tracking-[0.3em] mt-2">The registry is currently silent.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#1B4332]/10 rounded-[10px] shadow-[0_30px_60px_-15px_rgba(27,67,50,0.1)] overflow-hidden flex-1 min-h-[500px] flex flex-col">
      {header}
      <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth pb-8">
        <table className="w-full text-left border-collapse relative">
          <thead className="sticky top-0 z-20">
            <tr className="bg-white border-b border-[#1B4332]/10">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-[#1B4332]/30 bg-white ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'}`}
                  style={{ width: col.width }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1B4332]/[0.03]">
            {loading ? (
              [1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="animate-pulse">
                  {columns.map((_, j) => (
                    <td key={j} className="px-8 py-6">
                      <div className="h-4 bg-[#1B4332]/5 rounded-lg w-full" />
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              data.map((item, idx) => (
                <tr key={item.id || idx} className="group hover:bg-[#FDFBF7] transition-colors">
                  {renderRow(item, idx)}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex-none">
        {footer}
      </div>
    </div>
  );
};

/**
 * 🏷️ FORGE BADGE
 * Premium status indicator with kinetic pulse and variant-aware styling.
 */
export const ForgeBadge = ({ label, icon: Icon, variant = 'neutral' }) => {
  const variants = {
    success: 'bg-emerald-500/5 border-emerald-500/10 text-emerald-600',
    warning: 'bg-amber-500/5 border-amber-500/10 text-amber-600',
    danger: 'bg-rose-500/5 border-rose-500/10 text-rose-600',
    indigo: 'bg-indigo-500/5 border-indigo-500/10 text-indigo-600',
    neutral: 'bg-[#1B4332]/5 border-[#1B4332]/10 text-[#1B4332]/60'
  };

  const activeVariant = variants[variant] || variants.neutral;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${activeVariant} transition-all`}>
      {Icon && <Icon size={10} className="shrink-0" />}
      <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${variant === 'success' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
        variant === 'warning' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' :
          variant === 'danger' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]' :
            variant === 'indigo' ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]' :
              'bg-[#1B4332]/40'
        }`} />
      <span className="text-[8px] font-black uppercase tracking-[0.2em] whitespace-nowrap">{label}</span>
    </div>
  );
};

/**
 * 🚀 FORGE BUTTON
 * Standardized high-density action button with 55px height and elite kinetics.
 */
export const ForgeButton = ({
  children,
  icon: Icon,
  variant = 'primary',
  onClick,
  className = '',
  loading = false,
  ...props
}) => {
  const variants = {
    primary: 'bg-[#1B4332] text-white hover:bg-[#BC6C25] shadow-lg shadow-[#1B4332]/20',
    secondary: 'bg-[#1B4332]/5 border border-[#1B4332]/10 text-[#1B4332] hover:bg-[#1B4332] hover:text-white',
    danger: 'bg-rose-600 text-white shadow-lg shadow-rose-600/20 hover:bg-rose-700',
    ghost: 'bg-transparent text-[#1B4332]/40 hover:text-[#BC6C25] hover:bg-[#BC6C25]/5',
    mint: 'bg-emerald-500/5 border border-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white shadow-sm'
  };

  const activeVariant = variants[variant] || variants.primary;

  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center justify-center gap-3 h-[41px] px-6 rounded-[10px] 
        text-[9px] font-black uppercase tracking-[0.2em] transition-all 
        active:scale-95 disabled:opacity-50 disabled:pointer-events-none group
        ${activeVariant} ${className}
      `}
      {...props}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {Icon && <Icon size={16} className="group-hover:scale-110 transition-transform" />}
          {children}
        </>
      )}
    </button>
  );
};

/**
 * ⚠️ FORGE ALERT
 * Compact confirmation modal for critical administrative decisions.
 */
export const ForgeAlert = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Protocol",
  message,
  confirmLabel = "Confirm",
  variant = "danger"
}) => {
  return (
    <ForgeModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      icon={AlertCircle}
      maxWidth="max-w-md"
      footer={
        <>
          <ForgeButton variant="secondary" onClick={onClose}>
            Cancel
          </ForgeButton>
          <ForgeButton variant={variant} onClick={onConfirm}>
            {confirmLabel}
          </ForgeButton>
        </>
      }
    >
      <div className="py-2">
        <p className="text-[13px] font-bold text-[#1B4332]/60 leading-relaxed uppercase tracking-tight">
          {message}
        </p>
      </div>
    </ForgeModal>
  );
};

/**
 * 🎛️ FORGE TAB BAR
 * Standardized animated tab switcher for filtering/views.
 */
export const ForgeTabBar = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="flex items-center gap-2 p-1 bg-[#1B4332]/5 rounded-2xl w-fit border border-[#1B4332]/5">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`relative px-6 py-2.5 rounded-xl transition-all flex items-center gap-2 group`}
        >
          {activeTab === tab.id && (
            <motion.div 
              layoutId="active-forge-tab"
              className="absolute inset-0 bg-white shadow-md rounded-xl z-0"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
          {tab.icon && (
            <tab.icon 
              size={14} 
              className={`relative z-10 transition-colors ${activeTab === tab.id ? 'text-[#BC6C25]' : 'text-[#1B4332]/40 group-hover:text-[#1B4332]/60'}`} 
            />
          )}
          <span className={`relative z-10 text-[9px] font-black uppercase tracking-widest transition-colors ${activeTab === tab.id ? 'text-[#1B4332]' : 'text-[#1B4332]/40 group-hover:text-[#1B4332]/60'}`}>
            {tab.label}
          </span>
        </button>
      ))}
    </div>
  );
};
