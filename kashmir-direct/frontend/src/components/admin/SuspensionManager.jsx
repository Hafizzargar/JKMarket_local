import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldAlert, Mail, Ban, ShieldCheck, AlertCircle } from 'lucide-react';
import { ForgeModal, ForgeTextarea, ForgeButton } from './shared/ForgeComponents';

export default function SuspensionManager({ isOpen, user, message, setMessage, onUpdate, onClose }) {
  if (!isOpen || !user) return null;

  const isBanned = user.status === 'banned';

  return (
    <ForgeModal
      isOpen={isOpen}
      onClose={onClose}
      title="Identity Control"
      subtitle={user ? <>Target: <span className="text-[#BC6C25]">{user.full_name || 'Guest User'}</span></> : null}
      icon={isBanned ? ShieldCheck : ShieldAlert}
      footer={
        <>
           <ForgeButton variant="secondary" onClick={onClose}>
              Abort
           </ForgeButton>
           <ForgeButton 
             variant={isBanned ? 'primary' : 'danger'}
             icon={isBanned ? ShieldCheck : Ban}
             onClick={() => onUpdate(isBanned ? 'active' : 'banned')}
           >
              {isBanned ? 'Enable Access' : 'Disable Access'}
           </ForgeButton>
        </>
      }
    >
      <div className="space-y-6">
         {/* ⚠️ ADVISORY */}
         <div className={`${isBanned ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-700' : 'bg-rose-500/5 border-rose-500/10 text-rose-700'} p-6 rounded-2xl flex items-start gap-3 border transition-colors`}>
            <AlertCircle size={18} className="flex-shrink-0 mt-0.5 opacity-50" />
            <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">
               {isBanned 
                 ? 'Recovery will restore all access privileges immediately.'
                 : 'System lock will terminate all active sessions immediately.'}
            </p>
         </div>

         <ForgeTextarea 
            label="Email Notification Reason"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Specify why this action is being taken..."
         />
      </div>
    </ForgeModal>
  );
}
