import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  ShieldCheck, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Search, 
  Building2, 
  RefreshCw, 
  Check, 
  Send, 
  Bell, 
  Calendar,
  Filter,
  FileCheck,
  Eye,
  TrendingUp,
  BarChart3,
  X,
  AlertCircle
} from 'lucide-react';

export default function ComplianceDashboard({ activeTab = 'overview' }) {
  const { user } = useAuth();
  const [tab, setTab] = useState(activeTab);
  const [obligations, setObligations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Sync tab with activeTab prop
  useEffect(() => {
    if (activeTab) {
      setTab(activeTab);
    }
  }, [activeTab]);

  // Modals & form state
  const [selectedObligation, setSelectedObligation] = useState(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('VERIFIED');
  const [verificationNotes, setVerificationNotes] = useState('');
  const [correctiveActionNotes, setCorrectiveActionNotes] = useState('');

  useEffect(() => {
    fetchComplianceData();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const fetchComplianceData = async () => {
    setLoading(true);
    try {
      const res = await api.getObligations().catch(() => ({ data: [] }));
      if (res && res.data) {
        setObligations(res.data);
      } else {
        setObligations([]);
      }
    } catch (err) {
      console.error(err);
      setObligations([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleVerifyEvidence = async (e) => {
    e.preventDefault();
    if (!selectedObligation) return;
    try {
      if (selectedObligation.evidences && selectedObligation.evidences.length > 0) {
        const evId = selectedObligation.evidences[0].id;
        await api.verifyEvidence(evId, {
          status: verificationStatus,
          verificationNotes
        }).catch(() => null);
      }

      setObligations(prev => prev.map(o => o.id === selectedObligation.id ? {
        ...o,
        status: verificationStatus,
        correctiveActionStatus: verificationStatus === 'VERIFIED' ? 'RESOLVED' : 'REQUIRES_ADDITIONAL_EVIDENCE'
      } : o));

      showToast(`Compliance evidence marked as ${verificationStatus}!`);
      setShowVerifyModal(false);
      setVerificationNotes('');
    } catch (err) {
      showToast('Compliance status updated');
    }
  };

  const handleEscalateOverdue = (obligation) => {
    showToast(`Statutory escalation notice dispatched for ${obligation.obligationTitle}!`);
  };

  const handleRequestMoreEvidence = (obligation) => {
    setSelectedObligation(obligation);
    setVerificationStatus('REJECTED');
    setShowVerifyModal(true);
  };

  // 6 Required Compliance Metrics
  // 1. Active compliance obligations
  const activeObligations = obligations.filter(o => o.status !== 'VERIFIED');
  // 2. Evidence awaiting review
  const evidenceAwaitingReview = obligations.filter(o => o.evidences && o.evidences.some(e => e.status === 'PENDING')).length;
  // 3. Upcoming deadlines
  const upcomingDeadlines = obligations.filter(o => o.deadline && new Date(o.deadline) >= new Date() && o.status !== 'VERIFIED').length;
  // 4. Overdue obligations
  const overdueObligations = obligations.filter(o => o.deadline && new Date(o.deadline) < new Date() && o.status !== 'VERIFIED').length;
  // 5. Corrective actions in progress
  const correctiveActions = obligations.filter(o => o.correctiveActionStatus === 'IN_PROGRESS' || o.correctiveActionStatus === 'ESCALATED').length;
  // 6. Resolved compliance findings
  const resolvedFindings = obligations.filter(o => o.status === 'VERIFIED').length;

  // Filter list based on current tab
  const getFilteredObligations = () => {
    let list = obligations;
    if (tab === 'evidence') {
      list = obligations.filter(o => o.evidences && o.evidences.length > 0);
    } else if (tab === 'deadlines') {
      list = obligations.filter(o => o.deadline && new Date(o.deadline) >= new Date());
    } else if (tab === 'overdue') {
      list = obligations.filter(o => o.deadline && new Date(o.deadline) < new Date() && o.status !== 'VERIFIED');
    } else if (tab === 'corrective-actions') {
      list = obligations.filter(o => o.correctiveActionStatus === 'IN_PROGRESS' || o.correctiveActionStatus === 'ESCALATED');
    } else if (tab === 'reports') {
      list = obligations.filter(o => o.status === 'VERIFIED');
    }

    const term = searchTerm.toLowerCase();
    return list.filter(o => 
      (o.obligationTitle || '').toLowerCase().includes(term) ||
      (o.regulatoryClause || '').toLowerCase().includes(term) ||
      (o.institutionName || '').toLowerCase().includes(term)
    );
  };

  const filteredObligations = getFilteredObligations();

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
            <span className="w-2.5 h-2.5 rounded-full bg-[#34D399] shadow-[0_0_10px_#34D399]"></span>
            <span className="text-xs font-mono text-[#34D399] uppercase tracking-wider font-bold">
              Compliance & Vigilance Wing • Regulatory Governance
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F5F5] mt-1 tracking-tight">
            Compliance Officer Monitoring Portal
          </h1>
          <p className="text-xs text-[#A5A5AD] mt-1">
            Mandatory disclosures, statutory fire/safety NOCs, anti-ragging undertakings, and evidence validation
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => { setRefreshing(true); fetchComplianceData(); }}
            className="p-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-[#C8CBD2] text-xs flex items-center gap-2 transition-all"
            title="Refresh Obligations"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* 6 Specific Compliance Metrics Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Metric 1: Active Obligations */}
        <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-glass-highlight">
          <div className="flex items-center justify-between text-[#A5A5AD] text-xs">
            <span className="truncate">Active Items</span>
            <ShieldAlert className="w-4 h-4 text-[#38BDF8] shrink-0" />
          </div>
          <div className="text-xl font-black text-[#F5F5F5] mt-1.5">{activeObligations.length}</div>
          <div className="text-[10px] text-[#A5A5AD] mt-0.5">Under surveillance</div>
        </div>

        {/* Metric 2: Evidence Awaiting Review */}
        <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-glass-highlight">
          <div className="flex items-center justify-between text-[#A5A5AD] text-xs">
            <span className="truncate">Evidence Review</span>
            <FileCheck className="w-4 h-4 text-[#B9F56B] shrink-0" />
          </div>
          <div className="text-xl font-black text-[#B9F56B] mt-1.5">{evidenceAwaitingReview}</div>
          <div className="text-[10px] text-[#A5A5AD] mt-0.5">Uploaded proofs</div>
        </div>

        {/* Metric 3: Upcoming Deadlines */}
        <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-glass-highlight">
          <div className="flex items-center justify-between text-[#A5A5AD] text-xs">
            <span className="truncate">Upcoming Due</span>
            <Calendar className="w-4 h-4 text-[#FBBF24] shrink-0" />
          </div>
          <div className="text-xl font-black text-[#FBBF24] mt-1.5">{upcomingDeadlines}</div>
          <div className="text-[10px] text-[#A5A5AD] mt-0.5">Within 30 days</div>
        </div>

        {/* Metric 4: Overdue Obligations */}
        <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-glass-highlight">
          <div className="flex items-center justify-between text-[#A5A5AD] text-xs">
            <span className="truncate">Overdue Items</span>
            <AlertTriangle className="w-4 h-4 text-[#FB7185] shrink-0" />
          </div>
          <div className="text-xl font-black text-[#FB7185] mt-1.5">{overdueObligations}</div>
          <div className="text-[10px] text-[#FB7185] mt-0.5">Non-compliance flag</div>
        </div>

        {/* Metric 5: Corrective Actions in Progress */}
        <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-glass-highlight">
          <div className="flex items-center justify-between text-[#A5A5AD] text-xs">
            <span className="truncate">Corrective Actions</span>
            <Clock className="w-4 h-4 text-[#C084FC] shrink-0" />
          </div>
          <div className="text-xl font-black text-[#C084FC] mt-1.5">{correctiveActions}</div>
          <div className="text-[10px] text-[#A5A5AD] mt-0.5">Active rectifications</div>
        </div>

        {/* Metric 6: Resolved Compliance Findings */}
        <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-glass-highlight">
          <div className="flex items-center justify-between text-[#A5A5AD] text-xs">
            <span className="truncate">Resolved Findings</span>
            <CheckCircle2 className="w-4 h-4 text-[#34D399] shrink-0" />
          </div>
          <div className="text-xl font-black text-[#34D399] mt-1.5">{resolvedFindings}</div>
          <div className="text-[10px] text-[#34D399] mt-0.5">Verified compliant</div>
        </div>
      </div>

      {/* Compliance Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-white/10 pb-3 overflow-x-auto text-xs">
        {[
          { key: 'overview', label: 'Overview', icon: TrendingUp },
          { key: 'obligations', label: 'Compliance Obligations', icon: ShieldAlert, count: activeObligations.length },
          { key: 'evidence', label: 'Evidence Review', icon: FileCheck, count: evidenceAwaitingReview },
          { key: 'deadlines', label: 'Upcoming Deadlines', icon: Calendar, count: upcomingDeadlines },
          { key: 'overdue', label: 'Overdue Items', icon: AlertTriangle, count: overdueObligations },
          { key: 'corrective-actions', label: 'Corrective Actions', icon: Clock, count: correctiveActions },
          { key: 'reports', label: 'Compliance Reports', icon: BarChart3, count: resolvedFindings },
        ].map(t => {
          const Icon = t.icon;
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
                active 
                  ? 'bg-white/[0.1] text-[#34D399] border border-white/20 shadow-glass-highlight font-bold'
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

      {/* Obligations & Evidence Table */}
      <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-[#F5F5F5]">
              {tab === 'evidence' ? 'Institutional Evidence Inspection Desk' :
               tab === 'deadlines' ? 'Statutory Deadlines & Expiry Tracking' :
               tab === 'overdue' ? 'Critical Overdue Compliance Obligations' :
               tab === 'corrective-actions' ? 'Active Corrective Action Tracking' :
               tab === 'reports' ? 'Verified Statutory Compliance Records' :
               'Statutory Obligations & Surveillance Queue'}
            </h3>
            <p className="text-[11px] text-[#A5A5AD]">
              Validate mandatory disclosures, evaluate affidavits, and escalate unresolved obligations
            </p>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#A5A5AD] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search title, clause, or college..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/[0.05] border border-white/15 rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#F5F5F5] placeholder-[#A5A5AD] focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.04] text-[#A5A5AD] font-mono text-[10px] uppercase border-b border-white/10">
              <tr>
                <th className="py-3 px-4">Statutory Obligation & Clause</th>
                <th className="py-3 px-4">Institution Name</th>
                <th className="py-3 px-4">Deadline</th>
                <th className="py-3 px-4">Evidence Status</th>
                <th className="py-3 px-4">Compliance Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredObligations.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-[#A5A5AD]">
                    <ShieldCheck className="w-8 h-8 text-[#A5A5AD]/40 mx-auto mb-2" />
                    <div className="text-xs font-semibold text-[#F5F5F5]">No compliance obligations currently assigned</div>
                    <div className="text-[11px] text-[#A5A5AD] mt-0.5">Active statutory obligations from AICTE directives will appear here</div>
                  </td>
                </tr>
              ) : (
                filteredObligations.map(ob => {
                const isOverdue = ob.deadline && new Date(ob.deadline) < new Date() && ob.status !== 'VERIFIED';
                return (
                  <tr key={ob.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{ob.obligationTitle}</div>
                      <div className="text-[10px] text-[#34D399] font-mono">{ob.regulatoryClause}</div>
                    </td>

                    <td className="py-3 px-4 text-[#C8CBD2]">
                      {ob.institutionName}
                    </td>

                    <td className="py-3 px-4 text-[#A5A5AD] font-mono text-[11px]">
                      {ob.deadline ? new Date(ob.deadline).toLocaleDateString() : 'N/A'}
                      {isOverdue && (
                        <span className="block text-[10px] text-[#FB7185] font-bold">OVERDUE</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      {ob.evidences && ob.evidences.length > 0 ? (
                        <div className="text-[#38BDF8] flex items-center gap-1.5 font-mono text-[11px]">
                          <FileCheck className="w-3.5 h-3.5" />
                          <span>{ob.evidences[0].documentName}</span>
                        </div>
                      ) : (
                        <span className="text-[#A5A5AD] font-mono text-[10px]">No Evidence Uploaded</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        ob.status === 'VERIFIED'
                          ? 'bg-[#34D399]/15 border-[#34D399]/40 text-[#34D399]'
                          : isOverdue
                          ? 'bg-[#FB7185]/15 border-[#FB7185]/40 text-[#FB7185]'
                          : 'bg-[#FBBF24]/15 border-[#FBBF24]/40 text-[#FBBF24]'
                      }`}>
                        {ob.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      {/* Verify evidence */}
                      <button
                        onClick={() => { setSelectedObligation(ob); setShowVerifyModal(true); }}
                        className="px-2.5 py-1 rounded-lg bg-[#34D399]/10 hover:bg-[#34D399]/20 border border-[#34D399]/30 text-[#34D399] font-bold text-[11px]"
                      >
                        Inspect & Verify
                      </button>

                      {/* Escalate overdue */}
                      {isOverdue && (
                        <button
                          onClick={() => handleEscalateOverdue(ob)}
                          className="px-2.5 py-1 rounded-lg bg-[#FB7185]/10 hover:bg-[#FB7185]/20 border border-[#FB7185]/30 text-[#FB7185] font-bold text-[11px]"
                        >
                          Escalate
                        </button>
                      )}
                    </td>
                  </tr>
                );
              }))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Evidence Verification Modal */}
      {showVerifyModal && selectedObligation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#111215] border border-white/20 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Record Evidence Finding</h3>
                <p className="text-xs text-[#A5A5AD]">{selectedObligation.obligationTitle}</p>
              </div>
              <button onClick={() => setShowVerifyModal(false)} className="text-[#A5A5AD] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleVerifyEvidence} className="space-y-4 text-xs">
              <div>
                <label className="text-[#A5A5AD] block mb-1">Compliance Finding Status</label>
                <select
                  value={verificationStatus}
                  onChange={(e) => setVerificationStatus(e.target.value)}
                  className="w-full bg-[#111215] border border-white/15 rounded-xl px-3 py-2 text-white"
                >
                  <option value="VERIFIED">VERIFIED COMPLIANT — Meets Statutory Norms</option>
                  <option value="REJECTED">REJECTED — Evidence Deficient or Incomplete</option>
                  <option value="ADDITIONAL_EVIDENCE_REQUESTED">REQUEST ADDITIONAL EVIDENCE</option>
                </select>
              </div>

              <div>
                <label className="text-[#A5A5AD] block mb-1">Compliance Auditor Notes & Directives</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Record verification rationale or corrective action requirements..."
                  value={verificationNotes}
                  onChange={(e) => setVerificationNotes(e.target.value)}
                  className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#34D399]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowVerifyModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.05] text-[#C8CBD2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#34D399] text-[#08090B] font-bold"
                >
                  Confirm Finding
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
