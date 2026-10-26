import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EnterpriseLayout from '../components/EnterpriseLayout';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, 
  Plus, 
  FileText, 
  Upload, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ArrowRight, 
  ChevronRight,
  ShieldAlert,
  Send,
  Eye,
  Check
} from 'lucide-react';

export default function InstitutionPortal() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All 5');
  const [showNewModal, setShowNewModal] = useState(false);
  const [showDeficiencyModal, setShowDeficiencyModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Wizard state for new application
  const [wizardStep, setWizardStep] = useState(1);
  const [newCategory, setNewCategory] = useState('Extension of Approval');
  const [academicYear, setAcademicYear] = useState('2026-27');
  const [intakeSeats, setIntakeSeats] = useState(180);
  const [complianceConfirmed, setComplianceConfirmed] = useState(false);

  // Deficiency response state
  const [responseNotes, setResponseNotes] = useState('');

  // Application cards in Glassmorphism Theme
  const [applications, setApplications] = useState([
    {
      id: 'APP2025-001',
      category: 'New Institute Approval',
      date: '12 Jul 2025',
      status: 'Under Scrutiny',
      badgeColor: 'bg-[#B9F56B]/15 border-[#B9F56B]/40 text-[#B9F56B]',
      filterCategory: 'Submitted'
    },
    {
      id: 'APP2025-002',
      category: 'Extension of Approval',
      date: '05 Jul 2025',
      status: 'Clarification Required',
      badgeColor: 'bg-white/[0.08] border-white/20 text-[#C8CBD2]',
      filterCategory: 'Clarification',
      deficiencyClause: 'APH 2026-27 Clause 7.2',
      deficiencyDesc: 'Faculty cadre ratio deficit in CSE department (1:24 vs 1:20 mandatory).'
    },
    {
      id: 'APP2025-003',
      category: 'Increase in Intake',
      date: '18 Jun 2025',
      status: 'Approved',
      badgeColor: 'bg-[#B9F56B]/15 border-[#B9F56B]/40 text-[#B9F56B]',
      filterCategory: 'Submitted'
    },
    {
      id: 'APP2025-004',
      category: 'New Course Introduction',
      date: '10 Aug 2025',
      status: 'Draft',
      badgeColor: 'bg-white/[0.04] border-white/10 text-[#A5A5AD]',
      filterCategory: 'Draft'
    },
    {
      id: 'APP2025-005',
      category: 'Extension of Approval',
      date: '15 Aug 2025',
      status: 'Draft',
      badgeColor: 'bg-white/[0.04] border-white/10 text-[#A5A5AD]',
      filterCategory: 'Draft'
    }
  ]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const filterTabs = [
    { label: 'All 5', key: 'All 5' },
    { label: 'Draft 2', key: 'Draft' },
    { label: 'Submitted 2', key: 'Submitted' },
    { label: 'Clarification 1', key: 'Clarification' }
  ];

  const filteredApps = applications.filter(app => {
    if (activeFilter === 'All 5') return true;
    if (activeFilter === 'Draft') return app.filterCategory === 'Draft';
    if (activeFilter === 'Submitted') return app.status === 'Under Scrutiny' || app.status === 'Approved';
    if (activeFilter === 'Clarification') return app.status === 'Clarification Required';
    return true;
  });

  const handleCreateNewApp = async (e) => {
    e.preventDefault();
    const newId = `APP2025-00${applications.length + 1}`;
    const newRecord = {
      id: newId,
      category: newCategory,
      date: 'Today',
      status: 'Under Scrutiny',
      badgeColor: 'bg-[#B9F56B]/15 border-[#B9F56B]/40 text-[#B9F56B]',
      filterCategory: 'Submitted'
    };
    setApplications([newRecord, ...applications]);
    setShowNewModal(false);
    setWizardStep(1);
    showToast(`Application ${newId} created and submitted to AICTE Scrutiny Desk.`);
  };

  const handleDeficiencySubmit = (e) => {
    e.preventDefault();
    if (!selectedApp) return;
    setApplications(applications.map(a => 
      a.id === selectedApp.id ? { ...a, status: 'Under Scrutiny', badgeColor: 'bg-[#B9F56B]/15 border-[#B9F56B]/40 text-[#B9F56B]', filterCategory: 'Submitted' } : a
    ));
    setShowDeficiencyModal(false);
    showToast(`Clarification and documentary evidence submitted for ${selectedApp.id}.`);
  };

  return (
    <EnterpriseLayout activeSection="my-applications" institutionMode={true}>
      <div className="space-y-6">
        
        {/* Toast */}
        {toastMessage && (
          <div className="p-3.5 rounded-2xl bg-white/[0.08] border border-[#B9F56B]/40 text-[#B9F56B] text-xs flex items-center justify-between shadow-2xl backdrop-blur-md">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#B9F56B]" />
              <span>{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage('')} className="text-white hover:text-[#B9F56B]">✕</button>
          </div>
        )}

        {/* Header matching Panel 9 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#F5F5F5]">My Applications</h1>
            <p className="text-xs text-[#A5A5AD]">Manage your institution's statutory AICTE approval submissions, deficiency notices, and charters</p>
          </div>

          <button
            onClick={() => setShowNewModal(true)}
            className="btn-lime px-4 py-2.5 rounded-2xl text-xs font-bold shadow-lime-glow flex items-center gap-2 w-fit transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Application</span>
          </button>
        </div>

        {/* Filter Pills matching Glassmorphic Design */}
        <div className="flex flex-wrap items-center gap-2">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`px-4 py-2 rounded-2xl text-xs font-medium transition-all ${
                activeFilter === tab.key
                  ? 'btn-lime font-bold shadow-lime-glow'
                  : 'glass-button text-[#A5A5AD]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Application Cards List */}
        <div className="space-y-3">
          {filteredApps.map((app) => (
            <div
              key={app.id}
              className="p-5 rounded-3xl glass-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-white/[0.06] border border-white/15 flex items-center justify-center text-[#B9F56B] shrink-0 group-hover:scale-105 transition-transform shadow-glass-highlight">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#F5F5F5] text-sm">{app.id}</span>
                    <span className="text-xs text-[#A5A5AD]">•</span>
                    <span className="text-xs text-[#A5A5AD] font-mono">{app.date}</span>
                  </div>
                  <h3 className="text-xs font-medium text-[#F5F5F5] mt-0.5">
                    {app.category}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${app.badgeColor}`}>
                  {app.status}
                </span>

                {app.status === 'Clarification Required' ? (
                  <button
                    onClick={() => {
                      setSelectedApp(app);
                      setShowDeficiencyModal(true);
                    }}
                    className="px-3.5 py-1.5 rounded-xl glass-button text-[#B9F56B] text-xs font-semibold flex items-center gap-1.5"
                  >
                    <span>Submit Clarification</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => navigate(`/applications/${app.id}`)}
                    className="p-2 rounded-xl glass-button text-[#A5A5AD] hover:text-white"
                    title="View Workspace"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* New Application Creation Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl max-w-lg w-full p-6 space-y-4 border-white/20">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="font-bold text-sm text-[#F5F5F5]">Create New AICTE Application</h3>
                <p className="text-xs text-[#A5A5AD]">Step {wizardStep} of 3: {wizardStep === 1 ? 'Category & Intake' : wizardStep === 2 ? 'Documents' : 'Undertaking'}</p>
              </div>
              <button onClick={() => setShowNewModal(false)} className="text-[#A5A5AD] hover:text-white">✕</button>
            </div>

            {wizardStep === 1 && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#F5F5F5] mb-1">Application Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full glass-input rounded-xl p-2.5 text-white"
                  >
                    <option value="Extension of Approval">Extension of Approval (EoA)</option>
                    <option value="Increase in Intake">Increase in Intake</option>
                    <option value="New Course Introduction">New Course Introduction</option>
                    <option value="New Institute Approval">New Technical Institute Approval</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#F5F5F5] mb-1">Academic Year</label>
                    <input
                      type="text"
                      value={academicYear}
                      onChange={(e) => setAcademicYear(e.target.value)}
                      className="w-full glass-input rounded-xl p-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#F5F5F5] mb-1">Proposed Intake Seats</label>
                    <input
                      type="number"
                      value={intakeSeats}
                      onChange={(e) => setIntakeSeats(e.target.value)}
                      className="w-full glass-input rounded-xl p-2.5 text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setShowNewModal(false)}
                    className="px-4 py-2 rounded-xl glass-button text-xs text-[#A5A5AD]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setWizardStep(2)}
                    className="px-5 py-2 rounded-xl btn-lime text-xs font-bold"
                  >
                    Next: Upload Norms
                  </button>
                </div>
              </div>
            )}

            {wizardStep === 2 && (
              <div className="space-y-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2 text-[#F5F5F5]">
                  <div className="flex items-center justify-between">
                    <span>1. Land Title & Registered Deed</span>
                    <span className="text-[#B9F56B]">Attached (2.4 MB)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>2. Sanctioned Master Building Plan</span>
                    <span className="text-[#B9F56B]">Attached (5.1 MB)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>3. Faculty Cadre List (1:20 Compliance)</span>
                    <span className="text-[#B9F56B]">Attached (1.8 MB)</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setWizardStep(1)}
                    className="px-4 py-2 rounded-xl glass-button text-xs text-[#A5A5AD]"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setWizardStep(3)}
                    className="px-5 py-2 rounded-xl btn-lime text-xs font-bold"
                  >
                    Next: Statutory Undertaking
                  </button>
                </div>
              </div>
            )}

            {wizardStep === 3 && (
              <form onSubmit={handleCreateNewApp} className="space-y-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2 text-[#A5A5AD]">
                  <p>
                    I hereby certify that all infrastructural, financial, faculty and statutory norms of the AICTE Approval Process Handbook 2026-27 are strictly complied with.
                  </p>
                  <label className="flex items-center gap-2 pt-2 cursor-pointer text-[#F5F5F5]">
                    <input
                      type="checkbox"
                      required
                      checked={complianceConfirmed}
                      onChange={(e) => setComplianceConfirmed(e.target.checked)}
                      className="rounded border-white/20 bg-white/[0.05] text-[#B9F56B]"
                    />
                    <span className="font-semibold">I solemnly affirm and accept digital signature audit</span>
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setWizardStep(2)}
                    className="px-4 py-2 rounded-xl glass-button text-xs text-[#A5A5AD]"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={!complianceConfirmed}
                    className="px-5 py-2 rounded-xl btn-lime text-xs font-bold disabled:opacity-40"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Deficiency Clarification Submission Modal */}
      {showDeficiencyModal && selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl max-w-md w-full p-6 space-y-4 border-white/20">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="font-bold text-sm text-[#F5F5F5]">Respond to Statutory Deficiency</h3>
                <p className="text-xs text-[#B9F56B] font-mono">{selectedApp.id}</p>
              </div>
              <button onClick={() => setShowDeficiencyModal(false)} className="text-[#A5A5AD] hover:text-white">✕</button>
            </div>

            <form onSubmit={handleDeficiencySubmit} className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-1">
                <span className="text-[10px] text-[#A5A5AD] font-mono uppercase">Deficiency Flagged:</span>
                <div className="font-semibold text-[#F5F5F5]">{selectedApp.deficiencyClause}</div>
                <p className="text-[11px] text-[#A5A5AD]">{selectedApp.deficiencyDesc}</p>
              </div>

              <div>
                <label className="block font-semibold text-[#F5F5F5] mb-1">Clarification Explanation</label>
                <textarea
                  rows="3"
                  required
                  value={responseNotes}
                  onChange={(e) => setResponseNotes(e.target.value)}
                  placeholder="Detail the corrective actions taken, new appointments or rectifications made..."
                  className="w-full glass-input rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="p-3 border-2 border-dashed border-white/15 rounded-2xl text-center text-[#A5A5AD] bg-white/[0.02]">
                <Upload className="w-5 h-5 text-[#B9F56B] mx-auto mb-1" />
                <span>Attach appointment letters / revised compliance PDF</span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeficiencyModal(false)}
                  className="px-4 py-2 rounded-xl glass-button text-[#A5A5AD]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl btn-lime text-xs font-bold"
                >
                  Submit Clarification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </EnterpriseLayout>
  );
}
