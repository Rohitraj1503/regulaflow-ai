import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import EnterpriseLayout from '../components/EnterpriseLayout';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  ChevronRight, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Upload, 
  Eye, 
  Download, 
  Calendar, 
  UserCheck, 
  XCircle, 
  ShieldCheck, 
  History, 
  ArrowRight,
  Sparkles,
  Send,
  Building2,
  ChevronDown,
  AlertCircle,
  FileCheck,
  Scale,
  ExternalLink
} from 'lucide-react';

export default function ApplicationDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState('Overview');
  const [loading, setLoading] = useState(true);
  const [app, setApp] = useState(null);
  const [history, setHistory] = useState([]);
  const [deficiencies, setDeficiencies] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [complianceList, setComplianceList] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  
  // Modals state
  const [showFindingModal, setShowFindingModal] = useState(false);
  const [showClarificationModal, setShowClarificationModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDocVerifyModal, setShowDocVerifyModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [docVerifyStatus, setDocVerifyStatus] = useState('VERIFIED');
  const [docVerifyNotes, setDocVerifyNotes] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState('');

  // Form states
  const [findingRemarks, setFindingRemarks] = useState('');
  const [clarificationClause, setClarificationClause] = useState('APH 2026-27 Clause 7.2');
  const [assigneeId, setAssigneeId] = useState('');
  const [assigneeName, setAssigneeName] = useState('');
  const [eligibleOfficers, setEligibleOfficers] = useState([]);
  const [loadingOfficers, setLoadingOfficers] = useState(false);
  const [officersError, setOfficersError] = useState(null);
  const [docType, setDocType] = useState('LAND_USE_CERTIFICATE');
  const [docName, setDocName] = useState('Land_Ownership_Deed_Revision.pdf');

  const loadEligibleOfficers = async () => {
    setLoadingOfficers(true);
    setOfficersError(null);
    try {
      const res = await api.getEligibleOfficers();
      const list = res?.data || [];
      setEligibleOfficers(list);
      return list;
    } catch (e) {
      setOfficersError('Unable to load officers. Please try again.');
      return [];
    } finally {
      setLoadingOfficers(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    try {
      let appId = id;
      if (isNaN(id)) {
        const listRes = await api.getApplications().catch(() => ({ data: [] }));
        const found = listRes.data?.find(a => 
          a.applicationNumber?.toLowerCase() === id?.toLowerCase() ||
          a.applicationNumber?.replace(/-/g, '')?.toLowerCase() === id?.replace(/-/g, '')?.toLowerCase()
        );
        appId = found ? found.id : 1;
      }
      
      const [appRes, histRes, defRes, docRes, compRes, auditRes] = await Promise.all([
        api.getApplicationById(appId).catch(() => null),
        api.getApplicationHistory(appId).catch(() => ({ data: [] })),
        api.getApplicationDeficiencies(appId).catch(() => ({ data: [] })),
        api.getApplicationDocuments(appId).catch(() => ({ data: [] })),
        api.getComplianceObligations().catch(() => ({ data: [] })),
        api.getAuditEvents().catch(() => ({ data: [] }))
      ]);

      if (appRes && appRes.data) {
        setApp(appRes.data);
      } else {
        setApp({
          id: 1,
          applicationNumber: 'APP2025-001',
          institutionName: 'ABC Engineering College',
          institutionAicteId: 'AICTE-1-10029381',
          institutionRegion: 'Western',
          category: 'New Institute Approval',
          status: 'UNDER_SCRUTINY',
          submissionDate: '2025-07-12T10:00:00Z',
          slaDueDate: '2025-08-25T18:00:00Z',
          daysInCurrentStage: 12,
          assignedOfficer: 'Prof. Sunita Deshmukh'
        });
      }

      setHistory(histRes?.data || []);
      setDeficiencies(defRes?.data || []);
      
      const realDocs = (docRes?.data && docRes.data.length > 0) ? docRes.data : [
        { id: 1, documentName: 'Institution Information Form', documentType: 'INFO', verificationStatus: 'VERIFIED', version: 'v1', uploadedAt: '2025-07-12' },
        { id: 2, documentName: 'Land Ownership Document', documentType: 'LAND', verificationStatus: 'PENDING', version: 'v2', uploadedAt: '2025-07-14' },
        { id: 3, documentName: 'Sanctioned Building Plan', documentType: 'PLAN', verificationStatus: 'VERIFIED', version: 'v1', uploadedAt: '2025-07-12' },
        { id: 4, documentName: 'Faculty Cadre List', documentType: 'FACULTY', verificationStatus: 'PENDING', version: 'v1', uploadedAt: '2025-07-13' },
        { id: 5, documentName: 'Statutory Undertaking', documentType: 'UNDERTAKING', verificationStatus: 'VERIFIED', version: 'v1', uploadedAt: '2025-07-12' }
      ];
      setDocuments(realDocs);

      setComplianceList(compRes?.data?.slice(0, 5) || []);
      setAuditLogs(auditRes?.data?.slice(0, 8) || []);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg) => {
    setShowSuccessToast(msg);
    setTimeout(() => setShowSuccessToast(''), 4500);
  };

  const handleRecordFindings = async (e) => {
    e.preventDefault();
    try {
      if (app?.id) {
        await api.transitionWorkflow(app.id, {
          targetStatus: 'UNDER_SCRUTINY',
          remarks: findingRemarks || 'Scrutiny verification findings recorded.'
        });
      }
      setShowFindingModal(false);
      setFindingRemarks('');
      showToast('Scrutiny findings successfully recorded and audited.');
      loadData();
    } catch (e) {
      alert('Error recording findings: ' + (e.response?.data?.message || e.message));
    }
  };

  const handleRequestClarification = async (e) => {
    e.preventDefault();
    try {
      if (app?.id) {
        await api.transitionWorkflow(app.id, {
          targetStatus: 'DEFICIENCY_NOTED',
          remarks: 'Clarification requested from institution regarding regulatory compliance.',
          deficiencyClause: clarificationClause,
          deficiencyDescription: clarificationDesc,
          deficiencySeverity: 'HIGH'
        });
      }
      setShowClarificationModal(false);
      showToast('Statutory clarification notice sent to institution administrator.');
      loadData();
    } catch (e) {
      alert('Error requesting clarification: ' + (e.response?.data?.message || e.message));
    }
  };

  const handleAssignOfficer = async (e) => {
    e.preventDefault();
    try {
      if (app?.id) {
        await api.assignOfficer(app.id, assigneeId);
      }
      setShowAssignModal(false);
      showToast(`Officer assigned to application scrutiny successfully.`);
      loadData();
    } catch (err) {
      alert('Officer assignment failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleOpenDocVerify = (doc) => {
    setSelectedDoc(doc);
    setDocVerifyStatus(doc.verificationStatus === 'REJECTED' ? 'REJECTED' : 'VERIFIED');
    setDocVerifyNotes(doc.verificationNotes || '');
    setShowDocVerifyModal(true);
  };

  const handleSaveDocVerification = async (e) => {
    e.preventDefault();
    try {
      if (app?.id && selectedDoc?.id) {
        await api.verifyDocument(app.id, selectedDoc.id, {
          status: docVerifyStatus,
          notes: docVerifyNotes
        });
      }
      setShowDocVerifyModal(false);
      showToast(`Document marked as ${docVerifyStatus} with compliance remarks.`);
      loadData();
    } catch (err) {
      alert('Document verification update failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleUploadDocument = async (e) => {
    e.preventDefault();
    try {
      if (app?.id) {
        await api.uploadDocument(app.id, {
          documentType: docType,
          documentName: docName,
          filePath: `/uploads/${docName}`,
          fileSize: 1024000
        });
      }
      setShowUploadModal(false);
      showToast('Document uploaded successfully to digital repository.');
      loadData();
    } catch (e) {
      alert('Error uploading document: ' + (e.response?.data?.message || e.message));
    }
  };

  const handleReject = async () => {
    if (confirm('Are you sure you want to reject this statutory application? This action will be recorded in the immutable audit log.')) {
      try {
        if (app?.id) {
          await api.transitionWorkflow(app.id, {
            targetStatus: 'REJECTED',
            remarks: 'Application rejected due to critical non-compliance with AICTE Handbook norms.'
          });
        }
        showToast('Application rejected with audit trail entry.');
        loadData();
      } catch (e) {
        alert('Action failed: ' + (e.response?.data?.message || e.message));
      }
    }
  };

  const tabs = ['Overview', 'Documents', 'Scrutiny', 'EVC', 'Compliance', 'History', 'Audit Logs'];

  const workflowSteps = [
    { label: 'Submitted', sub: '12 Jul 2025', state: 'completed' },
    { label: 'Validation', sub: '14 Jul 2025', state: 'completed' },
    { label: 'Scrutiny', sub: app?.status === 'UNDER_SCRUTINY' ? 'In Progress' : 'Completed', state: app?.status === 'UNDER_SCRUTINY' ? 'active' : 'completed' },
    { label: 'Clarification', sub: app?.status === 'DEFICIENCY_NOTED' ? 'Pending Resp' : '', state: app?.status === 'DEFICIENCY_NOTED' ? 'active' : 'upcoming' },
    { label: 'EVC Visit', sub: app?.status === 'EVC_SCHEDULED' ? 'Scheduled' : '', state: app?.status === 'EVC_SCHEDULED' ? 'active' : 'upcoming' },
    { label: 'Decision', sub: app?.status === 'APPROVED' ? 'Granted' : '', state: app?.status === 'APPROVED' ? 'completed' : 'upcoming' },
  ];

  return (
    <EnterpriseLayout activeSection="applications">
      <div className="space-y-6">
        
        {/* Toast Notification */}
        {showSuccessToast && (
          <div className="p-3.5 rounded-2xl bg-white/[0.08] border border-[#B9F56B]/40 text-[#B9F56B] text-xs flex items-center justify-between shadow-2xl backdrop-blur-md animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#B9F56B]" />
              <span>{showSuccessToast}</span>
            </div>
            <button onClick={() => setShowSuccessToast('')} className="text-white hover:text-[#B9F56B]">✕</button>
          </div>
        )}

        {/* Top Breadcrumb & Header Bar */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-xs text-[#A5A5AD]">
            <Link to="/dashboard" className="hover:text-white transition-colors">Applications</Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#A5A5AD]" />
            <span className="text-[#B9F56B] font-mono">{app?.applicationNumber || 'APP2025-001'}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl sm:text-2xl font-bold text-[#F5F5F5]">
                  Application - {app?.applicationNumber || 'APP2025-001'}
                </h1>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/[0.06] border border-white/20 text-[#B9F56B] shadow-glass-highlight flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B9F56B] shadow-[0_0_6px_#B9F56B]"></span>
                  {app?.status?.replace(/_/g, ' ') || 'UNDER SCRUTINY'}
                </span>
              </div>
              <p className="text-xs text-[#A5A5AD] mt-1 flex items-center gap-2">
                <span className="text-[#F5F5F5] font-medium">{app?.institutionName || 'ABC Engineering College'}</span>
                <span>•</span>
                <span>AICTE ID: {app?.institutionAicteId || 'AICTE-1-10029381'}</span>
                <span>•</span>
                <span>{app?.category || 'Extension of Approval'}</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowFindingModal(true)}
                className="btn-lime px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-lime-glow transition-all"
              >
                <span>Scrutiny Actions</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Workflow Stepper in Frosted Glass Panel */}
        <div className="p-6 rounded-3xl glass-card overflow-x-auto">
          <div className="min-w-[680px] flex items-center justify-between relative">
            <div className="absolute top-4 left-6 right-6 h-0.5 bg-white/10 -z-0"></div>
            
            {workflowSteps.map((step, idx) => (
              <div key={step.label} className="flex flex-col items-center relative z-10 text-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step.state === 'completed'
                    ? 'bg-white/[0.12] text-[#F5F5F5] border border-white/30 shadow-glass-highlight ring-4 ring-[#08090B]'
                    : step.state === 'active'
                    ? 'bg-[#B9F56B] text-[#08090B] ring-4 ring-[#B9F56B]/30 shadow-lime-glow animate-pulse'
                    : 'bg-[#111215] border border-white/10 text-[#A5A5AD] ring-4 ring-[#08090B]'
                }`}>
                  {step.state === 'completed' ? (
                    <CheckCircle2 className="w-4 h-4 text-[#F5F5F5]" />
                  ) : (
                    idx + 1
                  )}
                </div>
                <span className={`text-xs mt-2 font-medium ${
                  step.state === 'active' ? 'text-[#B9F56B] font-bold' : step.state === 'completed' ? 'text-[#F5F5F5]' : 'text-[#A5A5AD]'
                }`}>
                  {step.label}
                </span>
                {step.sub && (
                  <span className="text-[10px] text-[#A5A5AD] font-mono leading-none mt-0.5">
                    {step.sub}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 7 Tabs Navigation in Smoky Charcoal Glass */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-1 rounded-2xl bg-white/[0.03] border border-white/10">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs font-medium rounded-xl transition-all whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-white/[0.1] text-[#B9F56B] border border-white/20 shadow-glass-highlight font-semibold'
                  : 'text-[#A5A5AD] hover:text-[#F5F5F5] hover:bg-white/[0.05]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'Overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Column 1: Application Details (4 cols) */}
            <div className="lg:col-span-4 p-6 rounded-3xl glass-card space-y-4">
              <h3 className="text-sm font-bold text-[#F5F5F5] border-b border-white/10 pb-3">
                Application Profile
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="text-[#A5A5AD]">Application ID</span>
                  <span className="font-mono font-semibold text-[#F5F5F5]">{app?.applicationNumber || 'APP2025-001'}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="text-[#A5A5AD]">Institution</span>
                  <span className="font-medium text-[#F5F5F5] text-right truncate max-w-[180px]">{app?.institutionName || 'ABC Engineering College'}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="text-[#A5A5AD]">Category</span>
                  <span className="text-[#F5F5F5]">{app?.category || 'New Institute Approval'}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="text-[#A5A5AD]">Region</span>
                  <span className="text-[#F5F5F5] font-mono">{app?.institutionRegion || 'Western'}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="text-[#A5A5AD]">Submission Date</span>
                  <span className="text-[#F5F5F5] font-mono">{app?.submissionDate ? new Date(app.submissionDate).toLocaleDateString() : '12 Jul 2025'}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="text-[#A5A5AD]">Current Stage</span>
                  <span className="text-[#B9F56B] font-semibold">{app?.status?.replace(/_/g, ' ') || 'UNDER SCRUTINY'}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="text-[#A5A5AD]">Assigned Officer</span>
                  <span className="text-[#F5F5F5] font-medium">{app?.assignedOfficer || 'Unassigned'}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="text-[#A5A5AD]">Days in Stage</span>
                  <span className="text-[#C8CBD2] font-mono font-bold">{app?.daysInCurrentStage || 12} days</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-[#A5A5AD]">SLA Deadline</span>
                  <span className="text-[#F5F5F5] font-mono">{app?.slaDueDate ? new Date(app.slaDueDate).toLocaleDateString() : '25 Aug 2025'}</span>
                </div>
              </div>
            </div>

            {/* Column 2: Documents Quick List (5 cols) */}
            <div className="lg:col-span-5 p-6 rounded-3xl glass-card space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-sm font-bold text-[#F5F5F5] flex items-center gap-2">
                  <span>Mandatory Documents</span>
                  <span className="text-xs text-[#A5A5AD] font-normal">({documents.length})</span>
                </h3>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="px-3 py-1.5 rounded-xl glass-button text-xs font-medium flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5 text-[#B9F56B]" />
                  <span>Upload</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {documents.map((doc) => (
                  <div
                    key={doc.id || doc.documentName}
                    className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between hover:border-white/25 transition-all shadow-glass-highlight"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-[#C8CBD2] shrink-0" />
                      <div>
                        <div className="text-xs font-medium text-[#F5F5F5] truncate max-w-[200px]">
                          {doc.documentName || doc.name}
                        </div>
                        <div className="text-[10px] text-[#A5A5AD]">{doc.uploadedAt || doc.date || 'Uploaded'}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        (doc.verificationStatus || doc.status) === 'VERIFIED'
                          ? 'bg-[#B9F56B]/15 text-[#B9F56B] border border-[#B9F56B]/30'
                          : (doc.verificationStatus || doc.status) === 'REJECTED'
                          ? 'bg-[#FB7185]/15 text-[#FB7185] border border-[#FB7185]/30'
                          : 'bg-white/[0.08] text-[#C8CBD2] border border-white/15'
                      }`}>
                        {doc.verificationStatus || doc.status || 'PENDING'}
                      </span>
                      <button
                        onClick={() => handleOpenDocVerify(doc)}
                        className="px-2 py-1 rounded-lg glass-button text-[10px] text-[#B9F56B]"
                        title="Audit Document"
                      >
                        Audit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3: Actions Panel (3 cols) */}
            <div className="lg:col-span-3 p-6 rounded-3xl glass-card space-y-3">
              <h3 className="text-sm font-bold text-[#F5F5F5] border-b border-white/10 pb-3">
                Regulatory Operations
              </h3>

              <div className="space-y-2.5 pt-1">
                <button
                  onClick={() => setShowFindingModal(true)}
                  className="w-full py-2.5 px-3 rounded-2xl btn-lime text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lime-glow"
                >
                  <span>Record Scrutiny Findings</span>
                </button>

                <button
                  onClick={() => setShowClarificationModal(true)}
                  className="w-full py-2.5 px-3 rounded-2xl glass-button text-xs font-semibold flex items-center justify-center gap-2"
                >
                  <span>Request Clarification</span>
                </button>

                <button
                  onClick={() => navigate('/evc')}
                  className="w-full py-2.5 px-3 rounded-2xl glass-button text-xs font-semibold flex items-center justify-center gap-2"
                >
                  <span>Schedule EVC Inspection</span>
                </button>

                <button
                  onClick={() => {
                    setAssigneeId(app?.assignedOfficerId ? String(app.assignedOfficerId) : '');
                    setShowAssignModal(true);
                    loadEligibleOfficers();
                  }}
                  className="w-full py-2.5 px-3 rounded-2xl glass-button text-xs font-semibold flex items-center justify-center gap-2"
                >
                  <span>Assign Officer</span>
                </button>

                <button
                  onClick={handleReject}
                  className="w-full py-2.5 px-3 rounded-2xl bg-[#FB7185]/10 hover:bg-[#FB7185]/20 text-[#FB7185] border border-[#FB7185]/30 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <span>Reject Application</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Documents Management */}
        {activeTab === 'Documents' && (
          <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-bold text-[#F5F5F5]">Digital Repository & Scrutiny Verification</h3>
                <p className="text-xs text-[#A5A5AD]">Review and mark individual documents verified or rejected against AICTE APH clauses</p>
              </div>
              <button
                onClick={() => setShowUploadModal(true)}
                className="btn-lime px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lime-glow"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Supporting Document</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-[#A5A5AD] font-mono">
                    <th className="py-3 px-3">Document Title</th>
                    <th className="py-3 px-3">Type</th>
                    <th className="py-3 px-3">Version</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Uploaded On</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {documents.map((doc) => (
                    <tr key={doc.id || doc.documentName} className="hover:bg-white/[0.02]">
                      <td className="py-3.5 px-3 font-medium text-[#F5F5F5] flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-[#B9F56B]" />
                        <span>{doc.documentName || doc.name}</span>
                      </td>
                      <td className="py-3.5 px-3 text-[#A5A5AD] font-mono">{doc.documentType || doc.type || 'DOCUMENT'}</td>
                      <td className="py-3.5 px-3 text-[#C8CBD2] font-mono">{doc.version || 'v1'}</td>
                      <td className="py-3.5 px-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                          (doc.verificationStatus || doc.status) === 'VERIFIED'
                            ? 'bg-[#B9F56B]/15 text-[#B9F56B] border-[#B9F56B]/40'
                            : (doc.verificationStatus || doc.status) === 'REJECTED'
                            ? 'bg-[#FB7185]/15 text-[#FB7185] border-[#FB7185]/40'
                            : 'bg-white/[0.08] text-[#C8CBD2] border-white/15'
                        }`}>
                          {doc.verificationStatus || doc.status || 'PENDING'}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-[#A5A5AD]">{doc.uploadedAt || '2025-07-12'}</td>
                      <td className="py-3.5 px-3 text-right space-x-2">
                        <button
                          onClick={() => handleOpenDocVerify(doc)}
                          className="px-3 py-1.5 rounded-xl glass-button text-xs text-[#B9F56B] font-semibold"
                        >
                          Audit & Verify
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Scrutiny & Deficiencies */}
        {activeTab === 'Scrutiny' && (
          <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-bold text-[#F5F5F5]">Scrutiny Findings & Deficiencies</h3>
                <p className="text-xs text-[#A5A5AD]">Deficiencies raised under AICTE Approval Process Handbook (APH 2026-27)</p>
              </div>
              <button
                onClick={() => setShowClarificationModal(true)}
                className="btn-lime px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lime-glow"
              >
                <AlertCircle className="w-4 h-4" />
                <span>Raise New Deficiency</span>
              </button>
            </div>

            {deficiencies.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-white/10 rounded-2xl text-[#A5A5AD] text-xs">
                No deficiencies currently open for this application. All verified documents comply with APH guidelines.
              </div>
            ) : (
              <div className="space-y-3">
                {deficiencies.map((def) => (
                  <div key={def.id} className="p-4 rounded-2xl bg-white/[0.04] border border-[#FB7185]/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#FB7185]/20 text-[#FB7185]">
                          {def.severity || 'HIGH'}
                        </span>
                        <span className="font-semibold text-xs text-[#F5F5F5]">{def.clauseReference || 'Clause Reference'}</span>
                      </div>
                      <span className="text-[10px] text-[#A5A5AD] font-mono">{def.status || 'OPEN'}</span>
                    </div>
                    <p className="text-xs text-[#A5A5AD]">{def.description}</p>
                    {def.institutionResponse && (
                      <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/10 text-[11px] text-[#B9F56B]">
                        <strong>Institution Rectification:</strong> {def.institutionResponse}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: EVC Inspection */}
        {activeTab === 'EVC' && (
          <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-bold text-[#F5F5F5]">Expert Visit Committee (EVC) Oversight</h3>
                <p className="text-xs text-[#A5A5AD]">Physical and virtual campus verification records, committee scores, and NOC checks</p>
              </div>
              <button
                onClick={() => navigate('/evc')}
                className="btn-lime px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lime-glow"
              >
                <Calendar className="w-4 h-4" />
                <span>Open EVC Management Desk</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
                <span className="text-xs text-[#A5A5AD]">Inspection Status</span>
                <div className="text-lg font-bold text-[#B9F56B]">Scheduled (Hybrid)</div>
                <p className="text-[11px] text-[#A5A5AD]">Committee assigned without conflict of interest</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
                <span className="text-xs text-[#A5A5AD]">Committee Lead</span>
                <div className="text-lg font-bold text-[#F5F5F5]">Dr. Vikramaditya Rao</div>
                <p className="text-[11px] text-[#A5A5AD]">Senior AICTE Empanelled Assessor</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
                <span className="text-xs text-[#A5A5AD]">Infrastructure Target Score</span>
                <div className="text-lg font-bold text-[#C8CBD2]">85 / 100</div>
                <p className="text-[11px] text-[#A5A5AD]">Required for Extension of Approval</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Compliance */}
        {activeTab === 'Compliance' && (
          <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-bold text-[#F5F5F5]">Institutional Compliance Obligations</h3>
                <p className="text-xs text-[#A5A5AD]">Statutory norms, mandatory disclosures, and fire safety certifications</p>
              </div>
              <Link to="/compliance" className="text-xs text-[#B9F56B] hover:underline font-semibold flex items-center gap-1">
                <span>View All Obligations</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {complianceList.map((c) => (
                <div key={c.id} className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-semibold text-[#F5F5F5]">{c.title}</h4>
                    <p className="text-[11px] text-[#A5A5AD] mt-0.5">{c.category || 'Statutory Requirement'} • Due: {c.dueDate || '2026-08-30'}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#B9F56B]/15 text-[#B9F56B] border border-[#B9F56B]/30">
                    {c.status || 'COMPLIANT'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 6: History */}
        {activeTab === 'History' && (
          <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6">
            <h3 className="text-lg font-bold text-[#F5F5F5] border-b border-white/10 pb-4">
              Application Lifecycle Transition Log
            </h3>
            <div className="space-y-4">
              {history.length === 0 ? (
                <div className="text-xs text-[#A5A5AD]">No previous stage transitions recorded.</div>
              ) : (
                history.map((h, i) => (
                  <div key={i} className="flex items-start gap-4 p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                    <div className="w-8 h-8 rounded-xl bg-white/[0.06] border border-white/15 text-[#B9F56B] flex items-center justify-center shrink-0">
                      <History className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#F5F5F5]">{h.fromStatus} → {h.toStatus}</span>
                        <span className="text-[10px] text-[#A5A5AD] font-mono">{h.transitionDate ? new Date(h.transitionDate).toLocaleString() : 'Recent'}</span>
                      </div>
                      <p className="text-xs text-[#A5A5AD] mt-1">{h.comments || 'Stage transition completed.'}</p>
                      <div className="text-[10px] text-[#B9F56B] font-mono mt-1">Authorized Actor: {h.transitionedBy || 'System'}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 7: Audit Logs */}
        {activeTab === 'Audit Logs' && (
          <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6">
            <h3 className="text-lg font-bold text-[#F5F5F5] border-b border-white/10 pb-4">
              Cryptographic Audit Ledger
            </h3>
            <div className="space-y-3">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-xs font-mono flex items-center justify-between">
                  <div>
                    <span className="text-[#B9F56B] font-bold">[{log.action}]</span>{' '}
                    <span className="text-[#F5F5F5]">{log.entityType} #{log.entityId}</span>
                    <div className="text-[10px] text-[#A5A5AD] mt-0.5">Actor: {log.actor} ({log.role})</div>
                  </div>
                  <span className="text-[10px] text-[#A5A5AD]">
                    {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Audited'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Record Scrutiny Findings Modal */}
      {showFindingModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl max-w-md w-full p-6 space-y-4 border-white/20">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-bold text-sm text-[#F5F5F5]">Record Scrutiny Findings</h3>
              <button onClick={() => setShowFindingModal(false)} className="text-[#A5A5AD] hover:text-white">✕</button>
            </div>
            <form onSubmit={handleRecordFindings} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#F5F5F5] mb-1">Scrutiny Findings & Checklist Notes</label>
                <textarea
                  rows="4"
                  required
                  value={findingRemarks}
                  onChange={(e) => setFindingRemarks(e.target.value)}
                  placeholder="Record verification notes regarding land title, municipal approvals, faculty ratios..."
                  className="w-full glass-input rounded-2xl p-3 text-xs text-[#F5F5F5]"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowFindingModal(false)}
                  className="px-4 py-2 rounded-xl glass-button text-xs text-[#A5A5AD]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl btn-lime text-xs font-bold"
                >
                  Submit Findings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Request Clarification Modal */}
      {showClarificationModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl max-w-md w-full p-6 space-y-4 border-white/20">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-bold text-sm text-[#F5F5F5]">Request Clarification (Deficiency Notice)</h3>
              <button onClick={() => setShowClarificationModal(false)} className="text-[#A5A5AD] hover:text-white">✕</button>
            </div>
            <form onSubmit={handleRequestClarification} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#F5F5F5] mb-1">Clause Reference</label>
                <input
                  type="text"
                  required
                  value={clarificationClause}
                  onChange={(e) => setClarificationClause(e.target.value)}
                  className="w-full glass-input rounded-xl p-2.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#F5F5F5] mb-1">Deficiency Description</label>
                <textarea
                  rows="3"
                  required
                  value={clarificationDesc}
                  onChange={(e) => setClarificationDesc(e.target.value)}
                  className="w-full glass-input rounded-xl p-2.5 text-xs text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowClarificationModal(false)}
                  className="px-4 py-2 rounded-xl glass-button text-xs text-[#A5A5AD]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl btn-lime text-xs font-bold"
                >
                  Issue Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Officer Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl max-w-sm w-full p-6 space-y-4 border-white/20">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-bold text-sm text-[#F5F5F5]">Assign Regulatory Officer</h3>
              <button onClick={() => setShowAssignModal(false)} className="text-[#A5A5AD] hover:text-white">✕</button>
            </div>
            <form onSubmit={handleAssignOfficer} className="space-y-4">
              <div>
                <label className="block text-xs text-[#A5A5AD] mb-1 font-medium">Select Qualified Officer</label>
                {loadingOfficers ? (
                  <div className="p-2.5 text-xs text-[#A5A5AD] bg-white/[0.03] border border-white/10 rounded-xl">
                    Loading eligible officers...
                  </div>
                ) : officersError ? (
                  <div className="p-2.5 text-xs text-[#FB7185] bg-[#FB7185]/10 border border-[#FB7185]/30 rounded-xl space-y-1">
                    <p>{officersError}</p>
                    <button type="button" onClick={loadEligibleOfficers} className="text-[#B9F56B] underline text-[11px]">
                      Retry
                    </button>
                  </div>
                ) : eligibleOfficers.length === 0 ? (
                  <div className="p-2.5 text-xs text-[#A5A5AD] bg-white/[0.03] border border-white/10 rounded-xl">
                    No eligible active officers found.
                  </div>
                ) : (
                  <select
                    value={assigneeId}
                    onChange={(e) => setAssigneeId(e.target.value)}
                    className="w-full glass-input rounded-xl p-2.5 text-xs text-white focus:outline-none"
                  >
                    <option value="">-- Choose Officer --</option>
                    {eligibleOfficers.map(off => (
                      <option key={off.id} value={off.id}>
                        {off.fullName || off.username}{off.department ? ` — ${off.department}` : (off.role ? ` (${off.role.replace('ROLE_', '').replace(/_/g, ' ')})` : '')}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 rounded-xl glass-button text-xs text-[#A5A5AD]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!assigneeId || loadingOfficers || !!officersError || eligibleOfficers.length === 0}
                  className="px-5 py-2 rounded-xl btn-lime text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Document Verification Modal */}
      {showDocVerifyModal && selectedDoc && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl max-w-md w-full p-6 space-y-4 border-white/20">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-bold text-sm text-[#F5F5F5]">Audit Document Verification</h3>
              <button onClick={() => setShowDocVerifyModal(false)} className="text-[#A5A5AD] hover:text-white">✕</button>
            </div>
            <form onSubmit={handleSaveDocVerification} className="space-y-4">
              <div>
                <div className="text-xs font-medium text-[#F5F5F5]">{selectedDoc.documentName || selectedDoc.name}</div>
                <div className="text-[10px] text-[#A5A5AD] font-mono mt-0.5">Type: {selectedDoc.documentType || 'DOCUMENT'}</div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#F5F5F5] mb-1">Verification Decision</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDocVerifyStatus('VERIFIED')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                      docVerifyStatus === 'VERIFIED'
                        ? 'bg-[#B9F56B]/20 text-[#B9F56B] border-[#B9F56B]'
                        : 'bg-white/[0.04] text-[#A5A5AD] border-white/10'
                    }`}
                  >
                    Mark Verified
                  </button>
                  <button
                    type="button"
                    onClick={() => setDocVerifyStatus('REJECTED')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                      docVerifyStatus === 'REJECTED'
                        ? 'bg-[#FB7185]/20 text-[#FB7185] border-[#FB7185]'
                        : 'bg-white/[0.04] text-[#A5A5AD] border-white/10'
                    }`}
                  >
                    Flag Deficient
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#F5F5F5] mb-1">Scrutiny Auditor Remarks</label>
                <textarea
                  rows="3"
                  value={docVerifyNotes}
                  onChange={(e) => setDocVerifyNotes(e.target.value)}
                  placeholder="e.g. Municipal seal verified. Clause 2.4 compliant."
                  className="w-full glass-input rounded-xl p-2.5 text-xs text-white"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowDocVerifyModal(false)}
                  className="px-4 py-2 rounded-xl glass-button text-xs text-[#A5A5AD]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl btn-lime text-xs font-bold"
                >
                  Save Verification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl max-w-md w-full p-6 space-y-4 border-white/20">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-bold text-sm text-[#F5F5F5]">Upload Supporting Document</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-[#A5A5AD] hover:text-white">✕</button>
            </div>
            <form onSubmit={handleUploadDocument} className="space-y-3">
              <div>
                <label className="block text-xs text-[#A5A5AD] mb-1">Document Category</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full glass-input rounded-xl p-2.5 text-xs text-white"
                >
                  <option value="LAND_USE_CERTIFICATE">Land Use / Conversion Certificate</option>
                  <option value="BUILDING_PLAN_SANCTION">Sanctioned Building Plan</option>
                  <option value="FIRE_SAFETY_NOC">Fire Safety NOC</option>
                  <option value="FACULTY_CADRE_LIST">Faculty Cadre List & Appointment Letters</option>
                  <option value="AFFIDAVIT_UNDERTAKING">Statutory Undertaking</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-[#A5A5AD] mb-1">Document Filename</label>
                <input
                  type="text"
                  required
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  className="w-full glass-input rounded-xl p-2.5 text-xs text-white"
                />
              </div>
              <div className="p-4 border-2 border-dashed border-white/15 rounded-2xl text-center text-xs text-[#A5A5AD] bg-white/[0.02]">
                <Upload className="w-6 h-6 text-[#B9F56B] mx-auto mb-1.5" />
                <span>Drag & drop signed PDF or click to browse</span>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl glass-button text-xs text-[#A5A5AD]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl btn-lime text-xs font-bold"
                >
                  Upload & Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </EnterpriseLayout>
  );
}
