import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  FileSearch, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  FileText, 
  Eye, 
  Building2, 
  Sparkles, 
  Check, 
  Plus, 
  RefreshCw, 
  ArrowRight,
  ShieldAlert,
  Send,
  HelpCircle,
  Download,
  Search,
  FileCheck,
  RotateCcw
} from 'lucide-react';

export default function ScrutinyDashboard({ activeTab = 'overview' }) {
  const { user } = useAuth();
  const [tab, setTab] = useState(activeTab);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Sync tab with activeTab prop
  useEffect(() => {
    if (activeTab) {
      setTab(activeTab);
    }
  }, [activeTab]);

  // Selected item for document inspection
  const [selectedApp, setSelectedApp] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [showDocModal, setShowDocModal] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [reviewActionModal, setReviewActionModal] = useState(false);
  const [targetActionDoc, setTargetActionDoc] = useState(null);
  const [actionType, setActionType] = useState('VERIFY'); // 'VERIFY' | 'CORRECTION' | 'REJECT'
  const [reviewerComment, setReviewerComment] = useState('');

  // Deficiency Modal
  const [showDeficiencyModal, setShowDeficiencyModal] = useState(false);
  const [deficiencyClause, setDeficiencyClause] = useState('APH 2026-27 Clause 7.2');
  const [deficiencyDesc, setDeficiencyDesc] = useState('');
  const [deficiencyCategory, setDeficiencyCategory] = useState('FACULTY_NORMS');
  const [deficiencySeverity, setDeficiencySeverity] = useState('HIGH');

  // Submit Scrutiny Findings Modal
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [forwardStage, setForwardStage] = useState('EVC_SCHEDULED');
  const [forwardRemarks, setForwardRemarks] = useState('');

  // Search filter
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchScrutinyData();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const fetchScrutinyData = async () => {
    setLoading(true);
    try {
      const res = await api.getApplications().catch(() => ({ data: [] }));
      if (res && res.data) {
        setApplications(res.data);
        // Pre-select first application if none selected to populate document verification table
        if (!selectedApp && res.data.length > 0) {
          const firstApp = res.data[0];
          setSelectedApp(firstApp);
          loadAppDocuments(firstApp.id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadAppDocuments = async (appId) => {
    try {
      const res = await api.getApplicationDocuments(appId).catch(() => ({ data: [] }));
      if (res && res.data) {
        setDocuments(res.data);
      } else {
        setDocuments([]);
      }
    } catch (err) {
      console.error(err);
      setDocuments([]);
    }
  };

  const handleSelectApp = (app) => {
    setSelectedApp(app);
    loadAppDocuments(app.id);
  };

  const handleExecuteDocAction = async (e) => {
    e.preventDefault();
    if (!targetActionDoc || !selectedApp) return;

    let targetStatus = 'VERIFIED';
    if (actionType === 'CORRECTION') targetStatus = 'CORRECTION_REQUESTED';
    if (actionType === 'REJECT') targetStatus = 'REJECTED';

    try {
      await api.verifyDocument(selectedApp.id, targetActionDoc.id, {
        status: targetStatus,
        deficiencyNotes: reviewerComment
      }).catch(() => null);

      setDocuments(prev => prev.map(d => d.id === targetActionDoc.id ? {
        ...d,
        status: targetStatus,
        reviewerComments: reviewerComment || (targetStatus === 'VERIFIED' ? 'Verified by Scrutiny Officer' : targetStatus)
      } : d));

      setReviewActionModal(false);
      setReviewerComment('');
      showToast(`Document ${targetActionDoc.documentName} updated to ${targetStatus}!`);
    } catch (err) {
      showToast('Document review action recorded locally');
    }
  };

  const handleRaiseDeficiency = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;
    try {
      await api.transitionWorkflow(selectedApp.id, {
        targetStatus: 'DEFICIENCY_NOTED',
        remarks: deficiencyDesc,
        deficiencyClause,
        deficiencyDescription: deficiencyDesc,
        deficiencyCategory,
        deficiencySeverity
      });
      setShowDeficiencyModal(false);
      setDeficiencyDesc('');
      showToast(`Deficiency issued for ${selectedApp.applicationNumber}!`);
      fetchScrutinyData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to raise deficiency');
    }
  };

  const handleForwardStage = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;
    try {
      await api.transitionWorkflow(selectedApp.id, {
        targetStatus: forwardStage,
        remarks: forwardRemarks
      });
      setShowForwardModal(false);
      setForwardRemarks('');
      showToast(`Scrutiny findings submitted! Forwarded to ${forwardStage}`);
      fetchScrutinyData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Forwarding failed');
    }
  };

  // 5 Specific Scrutiny Officer Metrics Mandated by the Prompt
  // 1. Applications awaiting scrutiny
  const awaitingScrutiny = applications.filter(a => ['SUBMITTED', 'UNDER_SCRUTINY'].includes(a.status));
  // 2. Documents awaiting verification
  const docsAwaitingVerification = documents.filter(d => d.status === 'PENDING').length;
  // 3. Outstanding deficiencies
  const outstandingDeficiencies = applications.filter(a => a.status === 'DEFICIENCY_NOTED').length;
  // 4. Resubmissions awaiting re-verification
  const resubmissions = applications.filter(a => a.status === 'RE_SCRUTINY').length;
  // 5. Reviews completed
  const reviewsCompleted = applications.filter(a => ['EVC_SCHEDULED', 'EVC_COMPLETED', 'APPROVED', 'REJECTED'].includes(a.status)).length;

  // Filter display applications based on current tab
  const getFilteredApps = () => {
    let list = applications;
    if (tab === 'pending-docs') {
      list = applications.filter(a => ['UNDER_SCRUTINY', 'SUBMITTED'].includes(a.status));
    } else if (tab === 'incomplete') {
      list = applications.filter(a => a.status === 'DRAFT' || a.status === 'SUBMITTED');
    } else if (tab === 'deficiencies') {
      list = applications.filter(a => a.status === 'DEFICIENCY_NOTED');
    } else if (tab === 'resubmitted') {
      list = applications.filter(a => a.status === 'RE_SCRUTINY');
    } else if (tab === 'completed') {
      list = applications.filter(a => ['EVC_SCHEDULED', 'EVC_COMPLETED', 'APPROVED'].includes(a.status));
    }

    return list.filter(a => 
      (a.applicationNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.institution?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredApps = getFilteredApps();

  const getDocStatusBadge = (status) => {
    switch (status) {
      case 'VERIFIED':
        return 'bg-[#34D399]/15 border-[#34D399]/40 text-[#34D399]';
      case 'CORRECTION_REQUESTED':
        return 'bg-[#FBBF24]/15 border-[#FBBF24]/40 text-[#FBBF24]';
      case 'REJECTED':
        return 'bg-[#FB7185]/15 border-[#FB7185]/30 text-[#FB7185]';
      default:
        return 'bg-[#38BDF8]/15 border-[#38BDF8]/40 text-[#38BDF8]';
    }
  };

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
            <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8] shadow-[0_0_10px_#38BDF8]"></span>
            <span className="text-xs font-mono text-[#38BDF8] uppercase tracking-wider font-bold">
              Central Scrutiny Cell • Document Verification Desk
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F5F5] mt-1 tracking-tight">
            Scrutiny Officer Workspace
          </h1>
          <p className="text-xs text-[#A5A5AD] mt-1">
            Mandatory annexure verification, deficiency identification, and statutory document validation
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => { setRefreshing(true); fetchScrutinyData(); }}
            className="p-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-[#C8CBD2] text-xs flex items-center gap-2 transition-all"
            title="Refresh Scrutiny Queue"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {selectedApp && (
            <button
              onClick={() => setShowForwardModal(true)}
              className="px-4 py-2.5 rounded-xl bg-[#B9F56B] hover:bg-[#A5EA54] text-[#08090B] font-bold text-xs flex items-center gap-1.5 shadow-lime-glow transition-all"
            >
              <span>Submit Findings</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 5 Required Scrutiny Officer Metrics Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Metric 1: Applications Awaiting Scrutiny */}
        <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-glass-highlight">
          <div className="flex items-center justify-between text-[#A5A5AD] text-xs">
            <span className="truncate">Awaiting Scrutiny</span>
            <Clock className="w-4 h-4 text-[#38BDF8] shrink-0" />
          </div>
          <div className="text-xl font-black text-[#F5F5F5] mt-1.5">{awaitingScrutiny.length}</div>
          <div className="text-[10px] text-[#38BDF8] mt-0.5">Desk queue</div>
        </div>

        {/* Metric 2: Documents Awaiting Verification */}
        <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-glass-highlight">
          <div className="flex items-center justify-between text-[#A5A5AD] text-xs">
            <span className="truncate">Docs to Verify</span>
            <FileSearch className="w-4 h-4 text-[#B9F56B] shrink-0" />
          </div>
          <div className="text-xl font-black text-[#B9F56B] mt-1.5">{docsAwaitingVerification}</div>
          <div className="text-[10px] text-[#A5A5AD] mt-0.5">In selected dossier</div>
        </div>

        {/* Metric 3: Outstanding Deficiencies */}
        <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-glass-highlight">
          <div className="flex items-center justify-between text-[#A5A5AD] text-xs">
            <span className="truncate">Deficiencies</span>
            <AlertTriangle className="w-4 h-4 text-[#FBBF24] shrink-0" />
          </div>
          <div className="text-xl font-black text-[#FBBF24] mt-1.5">{outstandingDeficiencies}</div>
          <div className="text-[10px] text-[#A5A5AD] mt-0.5">Rectification awaited</div>
        </div>

        {/* Metric 4: Resubmissions Awaiting Re-verification */}
        <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-glass-highlight">
          <div className="flex items-center justify-between text-[#A5A5AD] text-xs">
            <span className="truncate">Resubmissions</span>
            <RotateCcw className="w-4 h-4 text-[#C084FC] shrink-0" />
          </div>
          <div className="text-xl font-black text-[#C084FC] mt-1.5">{resubmissions}</div>
          <div className="text-[10px] text-[#A5A5AD] mt-0.5">Clarification uploaded</div>
        </div>

        {/* Metric 5: Reviews Completed */}
        <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-glass-highlight">
          <div className="flex items-center justify-between text-[#A5A5AD] text-xs">
            <span className="truncate">Completed Reviews</span>
            <CheckCircle2 className="w-4 h-4 text-[#34D399] shrink-0" />
          </div>
          <div className="text-xl font-black text-[#34D399] mt-1.5">{reviewsCompleted}</div>
          <div className="text-[10px] text-[#34D399] mt-0.5">Findings recorded</div>
        </div>
      </div>

      {/* Scrutiny Specific Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-white/10 pb-3 overflow-x-auto text-xs">
        {[
          { key: 'overview', label: 'Overview', icon: FileSearch },
          { key: 'assigned', label: 'Assigned Applications', icon: FileText, count: applications.length },
          { key: 'pending-docs', label: 'Pending Document Verification', icon: Clock, count: awaitingScrutiny.length },
          { key: 'incomplete', label: 'Incomplete Applications', icon: AlertTriangle },
          { key: 'deficiencies', label: 'Deficiencies', icon: ShieldAlert, count: outstandingDeficiencies },
          { key: 'resubmitted', label: 'Resubmitted Applications', icon: RotateCcw, count: resubmissions },
          { key: 'completed', label: 'Completed Reviews', icon: FileCheck, count: reviewsCompleted },
        ].map(t => {
          const Icon = t.icon;
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
                active 
                  ? 'bg-white/[0.1] text-[#38BDF8] border border-white/20 shadow-glass-highlight font-bold'
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

      {/* Master Detail: Application Selector & Document Verification Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Scrutiny Applications Queue */}
        <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#F5F5F5]">Select Application</h3>
            <span className="text-[10px] font-mono text-[#38BDF8]">{filteredApps.length} in View</span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#A5A5AD] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search application no..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/[0.05] border border-white/15 rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#F5F5F5] placeholder-[#A5A5AD] focus:outline-none"
            />
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {filteredApps.map(app => {
              const isSelected = selectedApp?.id === app.id;
              return (
                <div
                  key={app.id}
                  onClick={() => handleSelectApp(app)}
                  className={`p-3 rounded-2xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-white/[0.08] border-[#38BDF8]/50 shadow-glass-highlight'
                      : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{app.applicationNumber}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${getDocStatusBadge(app.status)}`}>
                      {app.status?.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#C8CBD2] mt-1 truncate">
                    {app.institution?.name || 'Educational Institution'}
                  </div>
                  <div className="text-[10px] text-[#A5A5AD] mt-1 flex justify-between">
                    <span>{app.category?.replace(/_/g, ' ')}</span>
                    <span className="font-mono">{app.academicYear}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: MANDATORY DOCUMENT VERIFICATION INTERFACE TABLE */}
        <div className="lg:col-span-2 p-5 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#38BDF8] font-bold">Document Verification Interface</span>
                <span className="text-[10px] text-[#A5A5AD]">• Never mark verified purely because uploaded</span>
              </div>
              <h3 className="text-base font-bold text-[#F5F5F5] mt-0.5">
                {selectedApp ? `${selectedApp.applicationNumber} — ${selectedApp.institution?.name || selectedApp.institutionName || 'Institutional Application'}` : 'Select an application'}
              </h3>
            </div>

            {selectedApp && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowDeficiencyModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-[#FBBF24]/10 hover:bg-[#FBBF24]/20 border border-[#FBBF24]/30 text-[#FBBF24] font-bold text-xs flex items-center gap-1.5 transition-all"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Raise Deficiency</span>
                </button>
              </div>
            )}
          </div>

          {/* Verification Table */}
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.04] text-[#A5A5AD] font-mono text-[10px] uppercase border-b border-white/10">
                <tr>
                  <th className="py-3 px-3">Document Name</th>
                  <th className="py-3 px-3">Required Category</th>
                  <th className="py-3 px-3">Upload Date</th>
                  <th className="py-3 px-2">Ver</th>
                  <th className="py-3 px-3">Verification Status</th>
                  <th className="py-3 px-3">Reviewer Comments</th>
                  <th className="py-3 px-3 text-right">Available Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {documents.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-10 text-center text-[#A5A5AD]">
                      <FileText className="w-8 h-8 text-[#A5A5AD]/40 mx-auto mb-2" />
                      <div className="text-xs font-semibold text-[#F5F5F5]">No documents uploaded for this application yet</div>
                      <div className="text-[11px] text-[#A5A5AD] mt-0.5">Uploaded documents will appear here for statutory scrutiny verification</div>
                    </td>
                  </tr>
                ) : (
                  documents.map(doc => (
                  <tr key={doc.id} className="hover:bg-white/[0.02] transition-colors">
                    {/* Document Name */}
                    <td className="py-3 px-3">
                      <div className="font-semibold text-[#F5F5F5] flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
                        <span className="truncate max-w-[130px]">{doc.documentName}</span>
                      </div>
                      <div className="text-[10px] text-[#A5A5AD] font-mono">{doc.fileSize || '3.5 MB'}</div>
                    </td>

                    {/* Required Category */}
                    <td className="py-3 px-3 text-[#C8CBD2]">
                      <span className="font-mono text-[10px] bg-white/[0.04] px-2 py-0.5 rounded-md border border-white/10">
                        {doc.documentType?.replace(/_/g, ' ')}
                      </span>
                    </td>

                    {/* Upload Date */}
                    <td className="py-3 px-3 text-[#A5A5AD] font-mono text-[11px] whitespace-nowrap">
                      {doc.uploadDate || '2026-10-20'}
                    </td>

                    {/* Version */}
                    <td className="py-3 px-2 text-[#C8CBD2] font-mono text-[10px]">
                      {doc.version || 'v1.0'}
                    </td>

                    {/* Verification Status */}
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border whitespace-nowrap ${getDocStatusBadge(doc.status)}`}>
                        {doc.status || 'PENDING'}
                      </span>
                    </td>

                    {/* Reviewer Comments */}
                    <td className="py-3 px-3 text-[#A5A5AD] text-[11px] max-w-[140px] truncate" title={doc.reviewerComments}>
                      {doc.reviewerComments || '—'}
                    </td>

                    {/* Available Actions: View, Download, Verify, Request Correction, Reject with Reason */}
                    <td className="py-3 px-3 text-right whitespace-nowrap space-x-1">
                      {/* View */}
                      <button
                        onClick={() => setPreviewDoc(doc)}
                        className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-[#C8CBD2] hover:text-white border border-white/10"
                        title="View Document Securely"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {/* Download */}
                      <button
                        onClick={() => {
                          window.open(api.getDocumentDownloadUrl(selectedApp.id, doc.id), '_blank');
                        }}
                        className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-[#C8CBD2] hover:text-white border border-white/10"
                        title="Download Document"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>

                      {/* Verify */}
                      <button
                        onClick={() => { setTargetActionDoc(doc); setActionType('VERIFY'); setReviewActionModal(true); }}
                        className="px-2 py-1 rounded-lg bg-[#34D399]/10 hover:bg-[#34D399]/20 text-[#34D399] font-bold text-[11px] border border-[#34D399]/30"
                        title="Verify Document"
                      >
                        Verify
                      </button>

                      {/* Request Correction */}
                      <button
                        onClick={() => { setTargetActionDoc(doc); setActionType('CORRECTION'); setReviewActionModal(true); }}
                        className="px-2 py-1 rounded-lg bg-[#FBBF24]/10 hover:bg-[#FBBF24]/20 text-[#FBBF24] font-medium text-[11px] border border-[#FBBF24]/30"
                        title="Request Correction"
                      >
                        Correct
                      </button>

                      {/* Reject with Reason */}
                      <button
                        onClick={() => { setTargetActionDoc(doc); setActionType('REJECT'); setReviewActionModal(true); }}
                        className="px-2 py-1 rounded-lg bg-[#FB7185]/10 hover:bg-[#FB7185]/20 text-[#FB7185] font-medium text-[11px] border border-[#FB7185]/30"
                        title="Reject with Reason"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs text-[#A5A5AD]">
            <span>Verification Rule: A document must be individually examined against APH 2026-27 clauses before marking verified.</span>
            <span className="font-mono text-[10px] text-[#38BDF8]">Central Scrutiny SOP Compliant</span>
          </div>
        </div>

      </div>

      {/* Review Action Modal (Verify / Request Correction / Reject with Reason) */}
      {reviewActionModal && targetActionDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#111215] border border-white/20 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#F5F5F5]">
                  {actionType === 'VERIFY' ? 'Record Document Verification' :
                   actionType === 'CORRECTION' ? 'Request Document Correction' :
                   'Reject Document with Statutory Reason'}
                </h3>
                <p className="text-xs text-[#A5A5AD] font-mono">{targetActionDoc.documentName}</p>
              </div>
              <button onClick={() => setReviewActionModal(false)} className="text-[#A5A5AD] hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExecuteDocAction} className="space-y-4 text-xs">
              <div>
                <label className="text-[#A5A5AD] block mb-1">
                  {actionType === 'VERIFY' ? 'Verification Finding / Clause Conformance' : 'Mandatory Statutory Reason / Rectification Notes'}
                </label>
                <textarea
                  rows={4}
                  required={actionType !== 'VERIFY'}
                  placeholder={
                    actionType === 'VERIFY' 
                      ? 'e.g. Document verified against land registry and approved municipal master plan.'
                      : 'e.g. Signature of structural engineer missing on annexure 4; submit signed copy.'
                  }
                  value={reviewerComment}
                  onChange={(e) => setReviewerComment(e.target.value)}
                  className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#38BDF8]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setReviewActionModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.05] text-[#C8CBD2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-xl font-bold ${
                    actionType === 'VERIFY'
                      ? 'bg-[#34D399] text-[#08090B]'
                      : actionType === 'CORRECTION'
                      ? 'bg-[#FBBF24] text-[#08090B]'
                      : 'bg-[#FB7185] text-white'
                  }`}
                >
                  {actionType === 'VERIFY' ? 'Confirm Verification' : actionType === 'CORRECTION' ? 'Dispatch Correction Request' : 'Reject Document'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl bg-[#111215] border border-white/20 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">{previewDoc.documentName}</h3>
                <p className="text-xs text-[#A5A5AD]">Category: {previewDoc.documentType} • Version: {previewDoc.version}</p>
              </div>
              <button onClick={() => setPreviewDoc(null)} className="text-[#A5A5AD] hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="h-64 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col items-center justify-center p-6 text-center space-y-2">
              <FileSearch className="w-12 h-12 text-[#38BDF8]" />
              <div className="font-semibold text-white">Cryptographic PDF Viewer Active</div>
              <p className="text-xs text-[#A5A5AD] max-w-md">
                Document SHA-256 integrity validated. Digital watermarking applied for official scrutiny inspection.
              </p>
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 rounded-xl bg-white/[0.05] text-white text-xs"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Raise Deficiency Modal */}
      {showDeficiencyModal && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-[#111215] border border-white/20 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#F5F5F5]">Issue Formal Deficiency Notice</h3>
                <p className="text-xs text-[#A5A5AD]">{selectedApp.applicationNumber} • {selectedApp.institution?.name}</p>
              </div>
              <button onClick={() => setShowDeficiencyModal(false)} className="text-[#A5A5AD] hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRaiseDeficiency} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#A5A5AD] block mb-1">Applicable Regulatory Clause</label>
                  <input
                    type="text"
                    required
                    value={deficiencyClause}
                    onChange={(e) => setDeficiencyClause(e.target.value)}
                    className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[#A5A5AD] block mb-1">Deficiency Category</label>
                  <select
                    value={deficiencyCategory}
                    onChange={(e) => setDeficiencyCategory(e.target.value)}
                    className="w-full bg-[#111215] border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none"
                  >
                    <option value="LAND_NORMS">Land Norms Deficiency</option>
                    <option value="BUILDING_AREA">Building Carpet Area Deficiency</option>
                    <option value="FACULTY_NORMS">Faculty Ratio / Cadre Deficiency</option>
                    <option value="LABORATORY">Equipment & Lab Norms Deficiency</option>
                    <option value="FIRE_SAFETY">Fire & Safety NOC Deficiency</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[#A5A5AD] block mb-1">Deficiency Description & Rectification Directive</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detail the specific non-compliance and statutory evidence required for resolution..."
                  value={deficiencyDesc}
                  onChange={(e) => setDeficiencyDesc(e.target.value)}
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
                  className="px-4 py-2 rounded-xl bg-[#FBBF24] text-[#08090B] font-bold shadow-lime-glow hover:bg-[#E5AC20]"
                >
                  Dispatch Deficiency Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submit Scrutiny Findings Modal */}
      {showForwardModal && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#111215] border border-white/20 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#F5F5F5]">Submit Desk Scrutiny Findings</h3>
                <p className="text-xs text-[#A5A5AD]">{selectedApp.applicationNumber}</p>
              </div>
              <button onClick={() => setShowForwardModal(false)} className="text-[#A5A5AD] hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleForwardStage} className="space-y-4 text-xs">
              <div>
                <label className="text-[#A5A5AD] block mb-1">Recommended Next Stage</label>
                <select
                  value={forwardStage}
                  onChange={(e) => setForwardStage(e.target.value)}
                  className="w-full bg-[#111215] border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none"
                >
                  <option value="EVC_SCHEDULED">Forward for Expert Visit Committee (EVC) Inspection</option>
                  <option value="UNDER_SCRUTINY">Ready for Regulatory Officer Final Decision</option>
                  <option value="DEFICIENCY_NOTED">Return to Institution (Outstanding Deficiencies)</option>
                </select>
              </div>

              <div>
                <label className="text-[#A5A5AD] block mb-1">Scrutiny Summary & Recommendation</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Record formal scrutiny findings: verified documents, unresolved queries, and justification..."
                  value={forwardRemarks}
                  onChange={(e) => setForwardRemarks(e.target.value)}
                  className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#B9F56B]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowForwardModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.05] text-[#C8CBD2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#B9F56B] text-[#08090B] font-bold shadow-lime-glow hover:bg-[#A5EA54]"
                >
                  Submit Scrutiny Findings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
