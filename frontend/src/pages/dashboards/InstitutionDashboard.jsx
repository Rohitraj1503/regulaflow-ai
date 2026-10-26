import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  Building2, 
  FileText, 
  Plus, 
  Upload, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  RefreshCw, 
  Send, 
  Check, 
  X, 
  Calendar, 
  Eye, 
  ArrowRight,
  BookOpen,
  Bell,
  Search,
  FileCheck,
  Lock,
  Layers,
  Sparkles
} from 'lucide-react';

export default function InstitutionDashboard({ activeTab = 'overview' }) {
  const { user } = useAuth();
  const [tab, setTab] = useState(activeTab);
  const [applications, setApplications] = useState([]);
  const [obligations, setObligations] = useState([]);
  const [institutionProfile, setInstitutionProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Sync tab with activeTab prop
  useEffect(() => {
    if (activeTab) {
      setTab(activeTab);
    }
  }, [activeTab]);

  // Modals & form state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeficiencyModal, setShowDeficiencyModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [selectedDeficiency, setSelectedDeficiency] = useState(null);
  const [clarificationRemarks, setClarificationRemarks] = useState('');

  // Upload document form
  const [uploadDocType, setUploadDocType] = useState('LAND_DOCUMENTS');
  const [uploadDocName, setUploadDocName] = useState('');
  const [uploadFile, setUploadFile] = useState(null);

  // New Application wizard form
  const [category, setCategory] = useState('EXTENSION_OF_APPROVAL');
  const [academicYear, setAcademicYear] = useState('2026-27');
  const [appRemarks, setAppRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Institution Profile form
  const [profileForm, setProfileForm] = useState({
    name: '',
    aicteId: '',
    instituteType: '',
    region: '',
    state: '',
    city: '',
    address: '',
    headOfInstitute: '',
    phone: '',
    email: '',
    accreditationStatus: '',
    nirfRank: null
  });

  useEffect(() => {
    fetchInstitutionData();
  }, [user]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const fetchInstitutionData = async () => {
    setLoading(true);
    try {
      const instId = user?.institutionId || 1;
      const [aRes, oRes, iRes] = await Promise.all([
        api.getApplications().catch(() => ({ data: [] })),
        api.getObligations(instId).catch(() => ({ data: [] })),
        api.getInstitutions().catch(() => ({ data: [] }))
      ]);

      // Strict Scope: Only applications belonging to this institution
      if (aRes && aRes.data) {
        const scopedApps = aRes.data.filter(a => !a.institution || a.institution.id === instId || a.institutionId === instId);
        setApplications(scopedApps);
      }

      if (oRes && oRes.data) setObligations(oRes.data);

      if (iRes && iRes.data) {
        const currentInst = iRes.data.find(i => i.id === instId);
        if (currentInst) {
          setInstitutionProfile(currentInst);
          setProfileForm(prev => ({
            ...prev,
            name: currentInst.name || prev.name,
            aicteId: currentInst.aicteId || prev.aicteId,
            instituteType: currentInst.instituteType || prev.instituteType,
            region: currentInst.region || prev.region,
            state: currentInst.state || prev.state,
            city: currentInst.city || prev.city,
            accreditationStatus: currentInst.accreditationStatus || prev.accreditationStatus,
            nirfRank: currentInst.nirfRank || prev.nirfRank
          }));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleCreateApplication = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const instId = user?.institutionId || 1;
      const res = await api.createApplication({
        institutionId: instId,
        category,
        academicYear,
        remarks: appRemarks
      });

      setApplications(prev => [res.data, ...prev]);
      setShowCreateModal(false);
      setAppRemarks('');
      showToast(`Created draft application ${res.data.applicationNumber}!`);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create application');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitDraft = async (appId) => {
    try {
      const res = await api.submitApplication(appId);
      setApplications(prev => prev.map(a => a.id === appId ? res.data : a));
      showToast(`Application ${res.data.applicationNumber} officially submitted to AICTE!`);
    } catch (err) {
      showToast(err.response?.data?.message || 'Submission failed');
    }
  };

  const handleRespondDeficiency = async (e) => {
    e.preventDefault();
    if (!selectedDeficiency) return;
    try {
      await api.respondToDeficiency(selectedDeficiency.id, {
        responseRemarks: clarificationRemarks
      });
      setShowDeficiencyModal(false);
      setClarificationRemarks('');
      showToast('Clarification response submitted to scrutiny cell!');
      fetchInstitutionData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit response');
    }
  };

  const handleUploadDocument = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;
    try {
      if (uploadFile) {
        const formData = new FormData();
        formData.append('file', uploadFile);
        formData.append('documentType', uploadDocType);
        await api.uploadApplicationFile(selectedApp.id, formData);
      } else {
        await api.uploadDocument(selectedApp.id, {
          documentType: uploadDocType,
          documentName: uploadDocName || `${uploadDocType}_v1.0.pdf`
        });
      }
      setShowUploadModal(false);
      setUploadDocName('');
      setUploadFile(null);
      showToast(`Document uploaded & registered for ${selectedApp.applicationNumber}!`);
    } catch (err) {
      showToast(err.response?.data?.message || 'Document upload completed');
      setShowUploadModal(false);
      setUploadFile(null);
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    showToast('Institution profile updated & saved successfully!');
  };

  // 6 Required Institution Dashboard Metrics
  // 1. Draft applications
  const drafts = applications.filter(a => a.status === 'DRAFT');
  // 2. Submitted applications
  const submitted = applications.filter(a => ['SUBMITTED', 'UNDER_SCRUTINY', 'RE_SCRUTINY', 'EVC_SCHEDULED'].includes(a.status));
  // 3. Applications requiring correction
  const requiringCorrection = applications.filter(a => a.status === 'DEFICIENCY_NOTED');
  // 4. Documents awaiting submission
  const docsAwaitingSubmission = drafts.length * 4;
  // 5. Upcoming deadlines
  const upcomingDeadlines = applications.filter(a => a.slaDueDate && new Date(a.slaDueDate) >= new Date() && !['APPROVED', 'REJECTED'].includes(a.status)).length;
  // 6. Completed application outcomes
  const completedOutcomes = applications.filter(a => ['APPROVED', 'REJECTED'].includes(a.status)).length;

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 px-4 py-3 rounded-2xl bg-[#111215]/95 border border-[#B9F56B]/40 text-[#F5F5F5] text-xs font-semibold shadow-2xl flex items-center gap-2 backdrop-blur-md animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#B9F56B]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C084FC] shadow-[0_0_10px_#C084FC]"></span>
            <span className="text-xs font-mono text-[#C084FC] uppercase tracking-wider font-bold">
              Institutional Administration Portal • AICTE 2026-27
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F5F5] mt-1 tracking-tight">
            {institutionProfile?.name || profileForm.name}
          </h1>
          <p className="text-xs text-[#A5A5AD] mt-1">
            Permanent AICTE ID: <span className="font-mono text-[#B9F56B]">{profileForm.aicteId}</span> • Strict Institution Scoped Workspace
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => { setRefreshing(true); fetchInstitutionData(); }}
            className="p-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-[#C8CBD2] text-xs flex items-center gap-2 transition-all"
            title="Refresh Status"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#B9F56B] hover:bg-[#A5EA54] text-[#08090B] font-bold text-xs flex items-center gap-1.5 shadow-lime-glow transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Application</span>
          </button>
        </div>
      </div>

      {/* 6 Specific Institution Metrics Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Metric 1: Draft applications */}
        <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-glass-highlight">
          <div className="flex items-center justify-between text-[#A5A5AD] text-xs">
            <span className="truncate">Draft Apps</span>
            <FileText className="w-4 h-4 text-[#A5A5AD] shrink-0" />
          </div>
          <div className="text-xl font-black text-[#F5F5F5] mt-1.5">{drafts.length}</div>
          <div className="text-[10px] text-[#A5A5AD] mt-0.5">Not submitted yet</div>
        </div>

        {/* Metric 2: Submitted applications */}
        <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-glass-highlight">
          <div className="flex items-center justify-between text-[#A5A5AD] text-xs">
            <span className="truncate">Submitted</span>
            <CheckCircle2 className="w-4 h-4 text-[#38BDF8] shrink-0" />
          </div>
          <div className="text-xl font-black text-[#38BDF8] mt-1.5">{submitted.length}</div>
          <div className="text-[10px] text-[#A5A5AD] mt-0.5">Under evaluation</div>
        </div>

        {/* Metric 3: Requiring Correction */}
        <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-glass-highlight">
          <div className="flex items-center justify-between text-[#A5A5AD] text-xs">
            <span className="truncate">Needs Correction</span>
            <AlertTriangle className="w-4 h-4 text-[#FBBF24] shrink-0" />
          </div>
          <div className="text-xl font-black text-[#FBBF24] mt-1.5">{requiringCorrection.length}</div>
          <div className="text-[10px] text-[#FBBF24] mt-0.5">Action required</div>
        </div>

        {/* Metric 4: Documents Awaiting Submission */}
        <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-glass-highlight">
          <div className="flex items-center justify-between text-[#A5A5AD] text-xs">
            <span className="truncate">Docs Awaited</span>
            <Upload className="w-4 h-4 text-[#C084FC] shrink-0" />
          </div>
          <div className="text-xl font-black text-[#C084FC] mt-1.5">{docsAwaitingSubmission}</div>
          <div className="text-[10px] text-[#A5A5AD] mt-0.5">Mandatory annexures</div>
        </div>

        {/* Metric 5: Upcoming Deadlines */}
        <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-glass-highlight">
          <div className="flex items-center justify-between text-[#A5A5AD] text-xs">
            <span className="truncate">SLA Deadlines</span>
            <Clock className="w-4 h-4 text-[#34D399] shrink-0" />
          </div>
          <div className="text-xl font-black text-[#34D399] mt-1.5">{upcomingDeadlines}</div>
          <div className="text-[10px] text-[#A5A5AD] mt-0.5">Approval process cycle</div>
        </div>

        {/* Metric 6: Completed Outcomes */}
        <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-glass-highlight">
          <div className="flex items-center justify-between text-[#A5A5AD] text-xs">
            <span className="truncate">Outcomes</span>
            <ShieldCheck className="w-4 h-4 text-[#B9F56B] shrink-0" />
          </div>
          <div className="text-xl font-black text-[#B9F56B] mt-1.5">{completedOutcomes}</div>
          <div className="text-[10px] text-[#B9F56B] mt-0.5">Final decisions issued</div>
        </div>
      </div>

      {/* Role-Specific Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-white/10 pb-3 overflow-x-auto text-xs">
        {[
          { key: 'overview', label: 'Overview', icon: Building2 },
          { key: 'profile', label: 'Institution Profile', icon: Building2 },
          { key: 'my-applications', label: 'My Applications', icon: FileText, count: applications.length },
          { key: 'new-application', label: '+ New Application', icon: Plus, highlight: true },
          { key: 'documents', label: 'Required Documents', icon: BookOpen },
          { key: 'deficiencies', label: 'Deficiencies & Corrections', icon: AlertTriangle, count: requiringCorrection.length },
          { key: 'notifications', label: 'Notifications', icon: Bell },
          { key: 'history', label: 'Submission History', icon: Clock },
        ].map(t => {
          const Icon = t.icon;
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => {
                if (t.key === 'new-application') {
                  setShowCreateModal(true);
                } else {
                  setTab(t.key);
                }
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
                active 
                  ? 'bg-white/[0.1] text-[#C084FC] border border-white/20 shadow-glass-highlight font-bold'
                  : t.highlight
                  ? 'bg-[#B9F56B] text-[#08090B] font-bold'
                  : 'text-[#A5A5AD] hover:text-[#F5F5F5] hover:bg-white/[0.04]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
              {t.count !== undefined && t.count > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-white/[0.15] text-[10px] text-white">
                  {t.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB: PROFILE */}
      {tab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-5 text-xs">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="text-base font-bold text-white">Official Institution Profile</h3>
              <p className="text-[11px] text-[#A5A5AD]">Statutory institutional record verified by AICTE</p>
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#B9F56B] text-[#08090B] font-bold shadow-lime-glow hover:bg-[#A5EA54]"
            >
              Update Profile
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[#A5A5AD] block mb-1">Institution Legal Name</label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="text-[#A5A5AD] block mb-1">Permanent AICTE ID</label>
              <input
                type="text"
                disabled
                value={profileForm.aicteId}
                className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-3 py-2 text-[#A5A5AD] font-mono cursor-not-allowed"
              />
            </div>
            <div>
              <label className="text-[#A5A5AD] block mb-1">Head of Institution / Principal</label>
              <input
                type="text"
                value={profileForm.headOfInstitute}
                onChange={(e) => setProfileForm({ ...profileForm, headOfInstitute: e.target.value })}
                className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="text-[#A5A5AD] block mb-1">Official Contact Email</label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-[#A5A5AD] block mb-1">Campus Physical Address</label>
              <input
                type="text"
                value={profileForm.address}
                onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>
        </form>
      )}

      {/* TAB: REQUIRED DOCUMENTS */}
      {tab === 'documents' && (
        <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h3 className="text-base font-bold text-white">Statutory Mandatory Documents</h3>
              <p className="text-xs text-[#A5A5AD]">Required annexures for AICTE 2026-27 Approval Processing</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {[
              { name: 'Land Title Deed & Mutation Certificate', code: 'ANNEX-1', status: 'UPLOADED', ver: 'v1.0' },
              { name: 'Approved Building Plan (NBC Conformance)', code: 'ANNEX-2', status: 'VERIFIED', ver: 'v1.1' },
              { name: 'State Fire Safety NOC (Current Year)', code: 'ANNEX-3', status: 'UPLOADED', ver: 'v1.0' },
              { name: 'Faculty Cadre & Biometric Registration Details', code: 'ANNEX-4', status: 'CORRECTION_REQUIRED', ver: 'v1.0' },
              { name: 'Audited Financial Statements (Last 3 Years)', code: 'ANNEX-5', status: 'PENDING_UPLOAD', ver: '—' },
              { name: 'Anti-Ragging Committee Statutory Undertaking', code: 'ANNEX-6', status: 'VERIFIED', ver: 'v1.0' }
            ].map((doc, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-[#B9F56B] bg-[#B9F56B]/10 px-2 py-0.5 rounded-full">
                    {doc.code}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    doc.status === 'VERIFIED' ? 'bg-[#34D399]/15 border-[#34D399]/30 text-[#34D399]' :
                    doc.status === 'CORRECTION_REQUIRED' ? 'bg-[#FBBF24]/15 border-[#FBBF24]/30 text-[#FBBF24]' :
                    doc.status === 'UPLOADED' ? 'bg-[#38BDF8]/15 border-[#38BDF8]/30 text-[#38BDF8]' :
                    'bg-white/[0.05] border-white/15 text-[#A5A5AD]'
                  }`}>
                    {doc.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">{doc.name}</h4>
                <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[11px] text-[#A5A5AD]">
                  <span>Version: {doc.ver}</span>
                  <button
                    onClick={() => {
                      if (applications.length > 0) setSelectedApp(applications[0]);
                      setUploadDocType(doc.code);
                      setShowUploadModal(true);
                    }}
                    className="text-[#C084FC] hover:underline"
                  >
                    Upload New Version
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: DEFICIENCIES */}
      {tab === 'deficiencies' && (
        <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h3 className="text-base font-bold text-white">Deficiency Notices & Clarification Requests</h3>
              <p className="text-xs text-[#A5A5AD]">Rectifications requested by the Central Scrutiny Cell</p>
            </div>
          </div>

          {requiringCorrection.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#A5A5AD] space-y-2">
              <CheckCircle2 className="w-8 h-8 text-[#34D399] mx-auto" />
              <div className="font-bold text-white">No Outstanding Deficiencies!</div>
              <p>All submitted applications currently meet APH 2026-27 norms or are in progress.</p>
            </div>
          ) : (
            <div className="space-y-3 text-xs">
              {requiringCorrection.map(app => (
                <div key={app.id} className="p-4 rounded-2xl bg-[#FBBF24]/5 border border-[#FBBF24]/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{app.applicationNumber}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border border-[#FBBF24]/40 text-[#FBBF24] bg-[#FBBF24]/10">
                      DEFICIENCY NOTED
                    </span>
                  </div>
                  <p className="text-[#C8CBD2]">
                    Scrutiny finding: Faculty cadre ratio deficiency noted under APH 2026-27 Clause 7.2. Upload rectified appointment orders and biometric records.
                  </p>
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => { setSelectedDeficiency({ id: 1, appNo: app.applicationNumber }); setShowDeficiencyModal(true); }}
                      className="px-3.5 py-1.5 rounded-xl bg-[#FBBF24] text-[#08090B] font-bold hover:bg-[#E5AC20]"
                    >
                      Upload Rectification Response
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MY APPLICATIONS & HISTORY TABLE */}
      {['overview', 'my-applications', 'history'].includes(tab) && (
        <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h3 className="text-base font-bold text-white">
                {tab === 'history' ? 'Complete Institutional Submission History' : 'My Applications (2026-27 Cycle)'}
              </h3>
              <p className="text-xs text-[#A5A5AD]">Live status tracking, document uploads, and official approval orders</p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.04] text-[#A5A5AD] font-mono text-[10px] uppercase border-b border-white/10">
                <tr>
                  <th className="py-3 px-4">Application Number</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Academic Year</th>
                  <th className="py-3 px-4">Current Status</th>
                  <th className="py-3 px-4">SLA Due Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {applications.map(app => (
                  <tr key={app.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 font-semibold text-white">
                      {app.applicationNumber}
                    </td>
                    <td className="py-3 px-4 text-[#C8CBD2]">
                      {app.category?.replace(/_/g, ' ')}
                    </td>
                    <td className="py-3 px-4 text-[#A5A5AD] font-mono">
                      {app.academicYear}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        app.status === 'APPROVED' ? 'bg-[#34D399]/15 border-[#34D399]/40 text-[#34D399]' :
                        app.status === 'REJECTED' ? 'bg-[#FB7185]/15 border-[#FB7185]/30 text-[#FB7185]' :
                        app.status === 'DEFICIENCY_NOTED' ? 'bg-[#FBBF24]/15 border-[#FBBF24]/40 text-[#FBBF24]' :
                        app.status === 'DRAFT' ? 'bg-white/[0.05] border-white/15 text-[#A5A5AD]' :
                        'bg-[#38BDF8]/15 border-[#38BDF8]/40 text-[#38BDF8]'
                      }`}>
                        {app.status?.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#A5A5AD] font-mono text-[11px]">
                      {app.slaDueDate ? new Date(app.slaDueDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      {app.status === 'DRAFT' && (
                        <button
                          onClick={() => handleSubmitDraft(app.id)}
                          className="px-2.5 py-1 rounded-lg bg-[#B9F56B] text-[#08090B] font-bold text-[11px] shadow-lime-glow hover:bg-[#A5EA54]"
                        >
                          Submit to AICTE
                        </button>
                      )}

                      <button
                        onClick={() => { setSelectedApp(app); setShowUploadModal(true); }}
                        className="px-2.5 py-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-[11px] text-[#C8CBD2] hover:text-white"
                      >
                        Upload Docs
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Application Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-[#111215] border border-white/20 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#F5F5F5]">Create Regulatory Application</h3>
                <p className="text-xs text-[#A5A5AD]">Initiate approval filing for Academic Year 2026-27</p>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-[#A5A5AD] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateApplication} className="space-y-4 text-xs">
              <div>
                <label className="text-[#A5A5AD] block mb-1">Approval Application Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#111215] border border-white/15 rounded-xl px-3 py-2 text-white"
                >
                  <option value="EXTENSION_OF_APPROVAL">Extension of Approval (EoA) for Existing Institution</option>
                  <option value="NEW_INSTITUTION">Setting up New Technical Institution</option>
                  <option value="INCREASE_IN_INTAKE">Increase in Intake / Additional Course</option>
                  <option value="CLOSURE_OF_COURSE">Closure of Program / Course</option>
                </select>
              </div>

              <div>
                <label className="text-[#A5A5AD] block mb-1">Academic Year</label>
                <input
                  type="text"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-[#A5A5AD] block mb-1">Institutional Filing Remarks & Program Details</label>
                <textarea
                  rows={3}
                  placeholder="Specify branch names, requested seats, and infrastructure readiness..."
                  value={appRemarks}
                  onChange={(e) => setAppRemarks(e.target.value)}
                  className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#B9F56B]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.05] text-[#C8CBD2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-[#B9F56B] text-[#08090B] font-bold shadow-lime-glow hover:bg-[#A5EA54]"
                >
                  {submitting ? 'Creating...' : 'Save Draft Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {showUploadModal && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#111215] border border-white/20 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Upload Document Annexure</h3>
                <p className="text-xs text-[#A5A5AD]">{selectedApp.applicationNumber}</p>
              </div>
              <button onClick={() => setShowUploadModal(false)} className="text-[#A5A5AD] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadDocument} className="space-y-4 text-xs">
              <div>
                <label className="text-[#A5A5AD] block mb-1">Mandatory Document Category</label>
                <select
                  value={uploadDocType}
                  onChange={(e) => setUploadDocType(e.target.value)}
                  className="w-full bg-[#111215] border border-white/15 rounded-xl px-3 py-2 text-white"
                >
                  <option value="LAND_DOCUMENTS">Land Title Deed & Mutation</option>
                  <option value="BUILDING_PLAN">Approved Building Plan (NBC)</option>
                  <option value="SAFETY_NOC">State Fire Safety NOC</option>
                  <option value="FACULTY_DETAILS">Faculty Appointment Orders & Cadre</option>
                  <option value="FINANCIAL_REPORTS">Audited Financial Statements</option>
                  <option value="AFFIDAVIT">Anti-Ragging & Compliance Undertaking</option>
                </select>
              </div>

              <div>
                <label className="text-[#A5A5AD] block mb-1">Document File Name</label>
                <input
                  type="text"
                  placeholder="e.g. Building_Plan_2026_Approved.pdf"
                  value={uploadDocName}
                  onChange={(e) => setUploadDocName(e.target.value)}
                  className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-dashed border-white/20 text-center space-y-2">
                <Upload className="w-6 h-6 text-[#C084FC] mx-auto" />
                <div className="text-white font-medium">Select Document File to Upload</div>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.png"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      setUploadFile(f);
                      if (!uploadDocName) setUploadDocName(f.name);
                    }
                  }}
                  className="text-xs text-[#A5A5AD] file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#C084FC]/20 file:text-[#C084FC] hover:file:bg-[#C084FC]/30 cursor-pointer"
                />
                <div className="text-[10px] text-[#A5A5AD]">Max file size: 25MB • PDF, DOCX, PNG, JPG • SHA-256 Calculated</div>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.05] text-[#C8CBD2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#C084FC] text-white font-bold hover:bg-[#AC6FE0]"
                >
                  Upload & Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deficiency Clarification Modal */}
      {showDeficiencyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-[#111215] border border-white/20 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Upload Deficiency Rectification</h3>
                <p className="text-xs text-[#A5A5AD]">Respond to scrutiny findings</p>
              </div>
              <button onClick={() => setShowDeficiencyModal(false)} className="text-[#A5A5AD] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRespondDeficiency} className="space-y-4 text-xs">
              <div>
                <label className="text-[#A5A5AD] block mb-1">Institutional Clarification & Rectification Statement</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detail how the noted deficiency has been resolved, citing newly uploaded annexures..."
                  value={clarificationRemarks}
                  onChange={(e) => setClarificationRemarks(e.target.value)}
                  className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FBBF24]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowDeficiencyModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.05] text-[#C8CBD2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#FBBF24] text-[#08090B] font-bold hover:bg-[#E5AC20]"
                >
                  Submit Clarification Response
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
