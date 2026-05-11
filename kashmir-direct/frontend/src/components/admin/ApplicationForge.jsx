'use client'; 


import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { Users, Mail, Phone, FileText, CheckCircle2, XCircle, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import RecruitmentVault from './RecruitmentVault';
import { ForgeModal, ForgeButton, ForgeAlert } from './shared/ForgeComponents';

export default function ApplicationForge({ onCountChange }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [deleteAlert, setDeleteAlert] = useState({ isOpen: false, id: null });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          jobs (title, department)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
      if (onCountChange) onCountChange(data?.length || 0);
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
      toast.success(`Application ${status}`);
      setSelectedApp(null);
      fetchApplications();
    } catch (err) {
      toast.error('Status update failed');
    }
  };

  const handleDelete = async () => {
    const { id } = deleteAlert;
    try {
      const { error } = await supabase.from('applications').delete().eq('id', id);
      if (error) throw error;
      toast.success('Application removed.');
      setDeleteAlert({ isOpen: false, id: null });
      fetchApplications();
      setSelectedApp(null);
    } catch (err) {
      toast.error('Deletion failed.');
    }
  };

  return (
    <div className="space-y-6">


      {/* 📜 RECRUITMENT TABLE */}
      <RecruitmentVault 
        type="applications"
        data={applications}
        onView={(app) => setSelectedApp(app)}
        loading={loading}
      />
      
      <ForgeModal
        isOpen={!!selectedApp}
        onClose={() => setSelectedApp(null)}
        title="Review Candidate"
        subtitle={selectedApp ? <>Viewing: <span className="text-[#BC6C25]">{selectedApp.full_name}</span></> : null}
        icon={Users}
        footer={
          <>
            <ForgeButton variant="secondary" onClick={() => setSelectedApp(null)}>
              Cancel
            </ForgeButton>
            <ForgeButton variant="danger" onClick={() => setDeleteAlert({ isOpen: true, id: selectedApp.id })}>
              <Trash2 size={16} />
            </ForgeButton>
            <ForgeButton variant="danger" onClick={() => updateStatus(selectedApp.id, 'Rejected')}>
              Reject
            </ForgeButton>
            <ForgeButton variant="primary" icon={CheckCircle2} onClick={() => updateStatus(selectedApp.id, 'Hired')}>
              Hire Candidate
            </ForgeButton>
          </>
        }
      >
        {selectedApp && (
          <div className="space-y-6">
             <div className="grid grid-cols-2 gap-5">
                <div className="bg-[#1B4332]/[0.02] p-6 rounded-3xl border border-[#1B4332]/5">
                   <div className="flex items-center gap-2 mb-2 opacity-30">
                      <Mail size={12} className="text-[#BC6C25]" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#1B4332]">Email Contact</span>
                   </div>
                   <p className="text-[13px] font-black text-[#1B4332] truncate">{selectedApp.email}</p>
                </div>
                <div className="bg-[#1B4332]/[0.02] p-6 rounded-3xl border border-[#1B4332]/5">
                   <div className="flex items-center gap-2 mb-2 opacity-30">
                      <Phone size={12} className="text-[#BC6C25]" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#1B4332]">Phone Number</span>
                   </div>
                   <p className="text-[13px] font-black text-[#1B4332]">{selectedApp.phone || 'Not provided'}</p>
                </div>
             </div>

             <div className="bg-[#1B4332]/[0.02] p-7 rounded-3xl border border-[#1B4332]/5">
                <div className="flex items-center justify-between mb-4">
                   <div className="flex items-center gap-2 opacity-30">
                      <FileText size={12} className="text-[#BC6C25]" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#1B4332]">Candidate Pitch</span>
                   </div>
                   <span className="text-[9px] font-black text-[#BC6C25] uppercase tracking-widest italic">Cover Letter</span>
                </div>
                <p className="text-[13px] text-[#1B4332]/70 leading-relaxed font-medium italic">
                   "{selectedApp.cover_letter || 'No cover letter submitted.'}"
                </p>
             </div>
          </div>
        )}
      </ForgeModal>

      <ForgeAlert 
          isOpen={deleteAlert.isOpen}
          onClose={() => setDeleteAlert({ isOpen: false, id: null })}
          onConfirm={handleDelete}
          title="Remove Candidate"
          message="Are you sure you want to permanently delete this application? This action cannot be reversed."
          confirmLabel="Remove Application"
       />
    </div>
  );
}
