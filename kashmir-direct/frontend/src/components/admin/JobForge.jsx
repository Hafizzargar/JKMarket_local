'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { Briefcase, Zap, MapPin, Tag, Layers, Clock } from 'lucide-react';
import RecruitmentVault from './RecruitmentVault';
import { ForgeModal, ForgeInput, ForgeSelect, ForgeTextarea, ForgeButton, ForgeAlert } from './shared/ForgeComponents';
import toast from 'react-hot-toast';



export default function JobForge({ onCountChange }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [initialData, setInitialData] = useState(null);
  const [deleteAlert, setDeleteAlert] = useState({ isOpen: false, id: null });
  
  const [formData, setFormData] = useState({
    title: 'Sales Manager',
    customTitle: '',
    department: 'Management',
    customDepartment: '',
    location: 'Srinagar, JK',
    type: 'Full-time',
    salary_range: '',
    experience_required: '',
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
      if (onCountChange) onCountChange(data?.length || 0);
    } catch (err) {
      console.error('Job Sync Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const finalTitle = formData.title === 'Other' ? formData.customTitle : formData.title;
    if (!finalTitle.trim()) return "Job title is required";
    if (formData.department === 'Other' && !formData.customDepartment.trim()) return "Please specify the department";
    if (!formData.description.trim()) return "Job description is required";
    if (formData.description.length < 20) return "Description is too short (min 20 chars)";
    return null;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const errorMsg = validateForm();
    if (errorMsg) return toast.error(errorMsg);

    try {
      setSubmitting(true);
      const finalTitle = formData.title === 'Other' ? formData.customTitle : formData.title;
      const finalDepartment = formData.department === 'Other' ? formData.customDepartment : formData.department;
      
      const submissionData = { 
        ...formData, 
        title: finalTitle,
        department: finalDepartment 
      };
      delete submissionData.customTitle;
      delete submissionData.customDepartment;

      if (editingJob) {
        const { error } = await supabase
          .from('jobs')
          .update(submissionData)
          .eq('id', editingJob.id);
        if (error) throw error;
        toast.success('Position updated.');
      } else {
        const { error } = await supabase
          .from('jobs')
          .insert([submissionData]);
        if (error) throw error;
        toast.success('New job posted.');
      }
      setIsModalOpen(false);
      setEditingJob(null);
      resetForm();
      fetchJobs();
    } catch (err) {
      toast.error(err.message || 'Could not save job.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const { id } = deleteAlert;
    try {
      const { error } = await supabase.from('jobs').delete().eq('id', id);
      if (error) throw error;
      toast.success('Job deleted.');
      setDeleteAlert({ isOpen: false, id: null });
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
      title: 'Sales Manager',
      customTitle: '',
      department: 'Management',
      customDepartment: '',
      location: 'Srinagar, JK',
      type: 'Full-time',
      salary_range: '',
      experience_required: '',
      description: '',
      requirements: '',
      is_active: true
    });
  };

  const openEdit = (job) => {
    setEditingJob(job);
    const knownTitles = ['Sales Manager', 'Logistics Coordinator', 'Artisan Lead', 'Operation Manager'];
    const knownDepts = ['Management', 'IT', 'Sales', 'Logistics'];
    
    const isKnownTitle = knownTitles.includes(job.title);
    const isKnownDept = knownDepts.includes(job.department);

    const mappedData = {
      title: isKnownTitle ? job.title : 'Other',
      customTitle: isKnownTitle ? '' : job.title,
      department: isKnownDept ? job.department : 'Other',
      customDepartment: isKnownDept ? '' : job.department,
      location: job.location,
      type: job.type,
      salary_range: job.salary_range || '',
      experience_required: job.experience_required || '',
      description: job.description,
      requirements: job.requirements || '',
      is_active: job.is_active
    };

    setFormData(mappedData);
    setInitialData(mappedData);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const handleOpenForge = () => {
      resetForm();
      setEditingJob(null);
      const defaultData = {
        title: 'Sales Manager',
        customTitle: '',
        department: 'Management',
        customDepartment: '',
        location: 'Srinagar, JK',
        type: 'Full-time',
        salary_range: '',
        experience_required: '',
        description: '',
        requirements: '',
        is_active: true
      };
      setFormData(defaultData);
      setInitialData(defaultData);
      setIsModalOpen(true);
    };
    window.addEventListener('open-job-forge', handleOpenForge);
    return () => window.removeEventListener('open-job-forge', handleOpenForge);
  }, []);

  const isDirty = initialData ? JSON.stringify(formData) !== JSON.stringify(initialData) : false;

  return (
    <div className="space-y-6">
      <RecruitmentVault 
        type="jobs"
        data={jobs}
        onEdit={openEdit}
        onDelete={(id) => setDeleteAlert({ isOpen: true, id })}
        onToggleStatus={toggleStatus}
        loading={loading}
      />

      <ForgeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Job Manager"
        subtitle={<>Section: <span className="text-[#BC6C25]">Recruitment Hub</span></>}
        icon={Briefcase}
        footer={
          <>
            <ForgeButton 
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
               Cancel
            </ForgeButton>

            <ForgeButton 
              variant="primary"
              icon={Zap}
              onClick={handleSubmit}
              disabled={!isDirty || submitting}
              loading={submitting}
              className={!isDirty ? 'opacity-30 grayscale cursor-not-allowed' : ''}
            >
               {editingJob ? 'Save Changes' : 'Save Position'}
            </ForgeButton>
          </>
        }
      >
        <div className="space-y-6">
           <div className="grid grid-cols-2 gap-5">
              <ForgeSelect 
                 label="Job Title"
                 icon={Tag}
                 value={formData.title}
                 onChange={(e) => setFormData({...formData, title: e.target.value})}
              >
                 <option value="Sales Manager">Sales Manager</option>
                 <option value="Logistics Coordinator">Logistics Coordinator</option>
                 <option value="Artisan Lead">Artisan Lead</option>
                 <option value="Operation Manager">Operation Manager</option>
                 <option value="Other">Other (Custom)</option>
              </ForgeSelect>

              <ForgeSelect 
                 label="Department"
                 icon={Layers}
                 value={formData.department}
                 onChange={(e) => setFormData({...formData, department: e.target.value})}
              >
                 <option value="Management">Management</option>
                 <option value="IT">IT</option>
                 <option value="Sales">Sales</option>
                 <option value="Logistics">Logistics</option>
                 <option value="Other">Other (Custom)</option>
              </ForgeSelect>
           </div>

           <AnimatePresence>
              {(formData.title === 'Other' || formData.department === 'Other') && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-2 gap-5"
                >
                   {formData.title === 'Other' && (
                     <ForgeInput label="Custom Title" value={formData.customTitle} onChange={(e) => setFormData({...formData, customTitle: e.target.value})} placeholder="Type title..." />
                   )}
                   {formData.department === 'Other' && (
                     <ForgeInput label="Custom Dept" value={formData.customDepartment} onChange={(e) => setFormData({...formData, customDepartment: e.target.value})} placeholder="Type dept..." />
                   )}
                </motion.div>
              )}
           </AnimatePresence>

           <div className="grid grid-cols-2 gap-5">
              <ForgeInput label="Location" icon={MapPin} value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
              <ForgeSelect label="Job Type" icon={Clock} value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                 <option value="Full-time">Full-time</option>
                 <option value="Part-time">Part-time</option>
                 <option value="Contract">Contract</option>
                 <option value="Internship">Internship</option>
              </ForgeSelect>
           </div>

           <div className="grid grid-cols-2 gap-5">
              <ForgeInput label="Salary" icon={Zap} value={formData.salary_range} onChange={(e) => setFormData({...formData, salary_range: e.target.value})} placeholder="e.g. ₹20k - ₹35k" />
              <ForgeInput label="Experience" icon={Briefcase} value={formData.experience_required} onChange={(e) => setFormData({...formData, experience_required: e.target.value})} placeholder="e.g. 2+ Years" />
           </div>

           <ForgeTextarea 
              label="Position Description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Detail the responsibilities and requirements..."
           />
        </div>
      </ForgeModal>
      <ForgeAlert 
          isOpen={deleteAlert.isOpen}
          onClose={() => setDeleteAlert({ isOpen: false, id: null })}
          onConfirm={handleDelete}
          title="Delete Position"
          message="Are you sure you want to permanently remove this job posting? This action cannot be undone."
          confirmLabel="Delete Job"
       />
    </div>
  );
}
