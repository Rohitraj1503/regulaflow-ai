import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  FileSpreadsheet, 
  Download, 
  Search, 
  Clock, 
  ShieldCheck, 
  Lock, 
  Eye, 
  RefreshCw, 
  Filter, 
  FileText, 
  Activity, 
  User, 
  CheckCircle2, 
  Calendar, 
  AlertCircle,
  FileSearch,
  CheckSquare,
  BarChart3,
  TrendingUp,
  X
} from 'lucide-react';

export default function AuditorDashboard({ activeTab = 'overview' }) {
  const { user } = useAuth();
  const [tab, setTab] = useState(activeTab);
  const [events, setEvents] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntityFilter, setSelectedEntityFilter] = useState('ALL');
  const [selectedActionFilter, setSelectedActionFilter] = useState('ALL');
  const [inspectEvent, setInspectEvent] = useState(null);

  // Sync tab with activeTab prop
  useEffect(() => {
    if (activeTab) {
      setTab(activeTab);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchAuditorData();
  }, []);

  const fetchAuditorData = async () => {
    setLoading(true);
    try {
      const [eRes, aRes] = await Promise.all([
        api.getAuditEvents().catch(() => ({ data: [] })),
        api.getApplications().catch(() => ({ data: [] }))
      ]);

      if (eRes && eRes.data) setEvents(eRes.data);
      if (aRes && aRes.data) setApplications(aRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleExportCsv = () => {
    window.open(api.getAuditCsvExportUrl(), '_blank');
  };

  // 5 Specific Auditor Metrics Mandated by the Prompt
  // 1. Applications with available audit history
  const appsWithAuditHistory = applications.length;
  // 2. Recent recorded workflow actions
  const recentWorkflowActions = events.filter(e => e.action?.includes('TRANSITION') || e.action?.includes('SUBMIT') || e.action?.includes('ASSIGN')).length;
  // 3. Document verification events
  const documentVerificationEvents = events.filter(e => e.action?.includes('VERIFY') || e.action?.includes('DOCUMENT')).length;
  // 4. Recorded decision events
  const recordedDecisionEvents = events.filter(e => e.action?.includes('DECISION') || e.action?.includes('APPROV') || e.action?.includes('REJECT')).length;
  // 5. Audit findings requiring follow-up
  const auditFindingsRequiringFollowUp = events.filter(e => e.status === 'FLAGGED' || e.action?.includes('DEFICIENCY')).length;

  // Filter events based on active tab & filters
  const getFilteredEvents = () => {
    let list = events;
    if (tab === 'application-history') {
      list = events.filter(e => e.entityType === 'Application' || e.action?.includes('APPLICATION'));
    } else if (tab === 'doc-history') {
      list = events.filter(e => e.action?.includes('VERIFY') || e.action?.includes('DOCUMENT'));
    } else if (tab === 'workflow-transitions') {
      list = events.filter(e => e.action?.includes('TRANSITION') || e.action?.includes('SUBMIT'));
    } else if (tab === 'decision-history') {
      list = events.filter(e => e.action?.includes('DECISION') || e.action?.includes('APPROV') || e.action?.includes('REJECT'));
    } else if (tab === 'compliance-audit') {
      list = events.filter(e => e.entityType === 'ComplianceObligation' || e.action?.includes('COMPLIANCE'));
    }

    const term = searchTerm.toLowerCase();
    return list.filter(e => {
      const matchesSearch = (e.action || '').toLowerCase().includes(term) ||
                            (e.actorUsername || '').toLowerCase().includes(term) ||
                            (e.entityId || '').toLowerCase().includes(term) ||
                            (e.entityType || '').toLowerCase().includes(term);

      const matchesEntity = selectedEntityFilter === 'ALL' || e.entityType === selectedEntityFilter;
      const matchesAction = selectedActionFilter === 'ALL' || e.action === selectedActionFilter;

      return matchesSearch && matchesEntity && matchesAction;
    });
  };

  const filteredEvents = getFilteredEvents();
  const uniqueActions = Array.from(new Set(events.map(e => e.action).filter(Boolean)));
  const uniqueEntities = Array.from(new Set(events.map(e => e.entityType).filter(Boolean)));

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#94A3B8] shadow-[0_0_10px_#94A3B8]"></span>
            <span className="text-xs font-mono text-[#94A3B8] uppercase tracking-wider font-bold">
              Central Vigilance Commission • Independent Regulatory Audit
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F5F5] mt-1 tracking-tight">
            Independent Auditor Dashboard
          </h1>
          <p className="text-xs text-[#A5A5AD] mt-1">
            Immutable SHA-256 verified event ledger, decision tracking, and statutory compliance timeline inspection
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-[11px] font-mono text-[#34D399] flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#34D399]" />
            <span>Strict Read-Only Mode Enforced</span>
          </div>

          <button
            onClick={() => { setRefreshing(true); fetchAuditorData(); }}
            className="p-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-[#C8CBD2] text-xs flex items-center gap-2 transition-all"
            title="Refresh Ledger"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 text-[#F5F5F5] font-bold text-xs flex items-center gap-1.5 shadow-glass-highlight transition-all"
          >
            <Download className="w-4 h-4 text-[#B9F56B]" />
            <span>Export Official CSV</span>
          </button>
        </div>
      </div>

      {/* 5 Specific Auditor Metrics Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Metric 1: Applications with Audit History */}
        <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-glass-highlight">
          <div className="flex items-center justify-between text-[#A5A5AD] text-xs">
            <span className="truncate">Audited Apps</span>
            <Activity className="w-4 h-4 text-[#C084FC] shrink-0" />
          </div>
          <div className="text-xl font-black text-[#F5F5F5] mt-1.5">{appsWithAuditHistory}</div>
          <div className="text-[10px] text-[#A5A5AD] mt-0.5">With full event trail</div>
        </div>

        {/* Metric 2: Recent Workflow Actions */}
        <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-glass-highlight">
          <div className="flex items-center justify-between text-[#A5A5AD] text-xs">
            <span className="truncate">Workflow Actions</span>
            <Clock className="w-4 h-4 text-[#38BDF8] shrink-0" />
          </div>
          <div className="text-xl font-black text-[#38BDF8] mt-1.5">{recentWorkflowActions}</div>
          <div className="text-[10px] text-[#A5A5AD] mt-0.5">Transitions recorded</div>
        </div>

        {/* Metric 3: Document Verification Events */}
        <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-glass-highlight">
          <div className="flex items-center justify-between text-[#A5A5AD] text-xs">
            <span className="truncate">Doc Verifications</span>
            <FileSearch className="w-4 h-4 text-[#B9F56B] shrink-0" />
          </div>
          <div className="text-xl font-black text-[#B9F56B] mt-1.5">{documentVerificationEvents}</div>
          <div className="text-[10px] text-[#A5A5AD] mt-0.5">Desk scrutiny audits</div>
        </div>

        {/* Metric 4: Recorded Decision Events */}
        <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-glass-highlight">
          <div className="flex items-center justify-between text-[#A5A5AD] text-xs">
            <span className="truncate">Decisions Logged</span>
            <CheckCircle2 className="w-4 h-4 text-[#34D399] shrink-0" />
          </div>
          <div className="text-xl font-black text-[#34D399] mt-1.5">{recordedDecisionEvents}</div>
          <div className="text-[10px] text-[#34D399] mt-0.5">Multi-tier signoffs</div>
        </div>

        {/* Metric 5: Audit Findings Requiring Follow-up */}
        <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-glass-highlight">
          <div className="flex items-center justify-between text-[#A5A5AD] text-xs">
            <span className="truncate">Follow-up Items</span>
            <AlertCircle className="w-4 h-4 text-[#FBBF24] shrink-0" />
          </div>
          <div className="text-xl font-black text-[#FBBF24] mt-1.5">{auditFindingsRequiringFollowUp}</div>
          <div className="text-[10px] text-[#A5A5AD] mt-0.5">Flagged for review</div>
        </div>
      </div>

      {/* Auditor Specific Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-white/10 pb-3 overflow-x-auto text-xs">
        {[
          { key: 'overview', label: 'Overview', icon: TrendingUp },
          { key: 'audit-trail', label: 'Audit Trail', icon: FileSpreadsheet, count: events.length },
          { key: 'application-history', label: 'Application History', icon: FileText, count: appsWithAuditHistory },
          { key: 'doc-history', label: 'Document Verification History', icon: FileSearch, count: documentVerificationEvents },
          { key: 'workflow-transitions', label: 'Workflow Transitions', icon: ShieldCheck, count: recentWorkflowActions },
          { key: 'decision-history', label: 'Decision History', icon: CheckCircle2, count: recordedDecisionEvents },
          { key: 'compliance-audit', label: 'Compliance Audit', icon: ShieldCheck },
          { key: 'export-reports', label: 'Export Reports', icon: BarChart3 },
        ].map(t => {
          const Icon = t.icon;
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => {
                if (t.key === 'export-reports') {
                  handleExportCsv();
                } else {
                  setTab(t.key);
                }
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
                active 
                  ? 'bg-white/[0.1] text-[#94A3B8] border border-white/20 shadow-glass-highlight font-bold'
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

      {/* Audit Event Explorer */}
      <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-[#F5F5F5]">
              {tab === 'application-history' ? 'Institutional Application Audit History' :
               tab === 'doc-history' ? 'Historical Document Verification Ledger' :
               tab === 'workflow-transitions' ? 'Recorded Workflow Transitions & Stage History' :
               tab === 'decision-history' ? 'Executive & Committee Decision Records' :
               tab === 'compliance-audit' ? 'Statutory Compliance Audit Log' :
               'Cryptographic Audit Event Ledger'}
            </h3>
            <p className="text-[11px] text-[#A5A5AD]">
              Immutable SHA-256 event ledger with actor identity, timestamps, previous/new states, and cryptographic integrity
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#A5A5AD] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search event ledger..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white/[0.05] border border-white/15 rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#F5F5F5] placeholder-[#A5A5AD] focus:outline-none"
              />
            </div>

            <select
              value={selectedEntityFilter}
              onChange={(e) => setSelectedEntityFilter(e.target.value)}
              className="bg-white/[0.05] border border-white/15 rounded-xl px-2.5 py-1.5 text-xs text-[#F5F5F5] focus:outline-none"
            >
              <option value="ALL">All Entity Types</option>
              {uniqueEntities.map(ent => (
                <option key={ent} value={ent}>{ent}</option>
              ))}
            </select>

            <select
              value={selectedActionFilter}
              onChange={(e) => setSelectedActionFilter(e.target.value)}
              className="bg-white/[0.05] border border-white/15 rounded-xl px-2.5 py-1.5 text-xs text-[#F5F5F5] focus:outline-none"
            >
              <option value="ALL">All Actions</option>
              {uniqueActions.map(act => (
                <option key={act} value={act}>{act}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.04] text-[#A5A5AD] font-mono text-[10px] uppercase border-b border-white/10">
              <tr>
                <th className="py-3 px-4">Timestamp (UTC)</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Entity Type & ID</th>
                <th className="py-3 px-4">Transition States</th>
                <th className="py-3 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-[11px]">
              {filteredEvents.map((evt) => (
                <tr key={evt.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4 text-[#A5A5AD]">
                    {evt.timestamp ? new Date(evt.timestamp).toLocaleString() : 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-[#F5F5F5] font-semibold font-sans">
                    {evt.actorUsername}
                  </td>
                  <td className="py-3 px-4 text-[#38BDF8]">
                    {evt.actorRole?.replace('ROLE_', '')}
                  </td>
                  <td className="py-3 px-4 font-bold text-[#B9F56B]">
                    {evt.action}
                  </td>
                  <td className="py-3 px-4 text-[#C8CBD2]">
                    <span className="text-[#A5A5AD]">{evt.entityType}:</span> {evt.entityId}
                  </td>
                  <td className="py-3 px-4 text-[#A5A5AD]">
                    {evt.previousState && (
                      <span className="line-through text-[#FB7185] mr-1.5">{evt.previousState}</span>
                    )}
                    {evt.newState && (
                      <span className="text-[#34D399]">→ {evt.newState}</span>
                    )}
                    {!evt.previousState && !evt.newState && (
                      <span>-</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setInspectEvent(evt)}
                      className="px-2.5 py-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-[11px] text-[#C8CBD2] hover:text-white"
                    >
                      Audit Record
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Event Modal */}
      {inspectEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-[#111215] border border-white/20 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Cryptographic Event Record</h3>
                <p className="text-xs text-[#A5A5AD] font-mono">ID: {inspectEvent.id} • {inspectEvent.action}</p>
              </div>
              <button onClick={() => setInspectEvent(null)} className="text-[#A5A5AD] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-[#A5A5AD]">Timestamp:</span>
                <span className="font-mono text-white">{inspectEvent.timestamp ? new Date(inspectEvent.timestamp).toISOString() : 'N/A'}</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-[#A5A5AD]">Actor:</span>
                <span className="font-semibold text-white">{inspectEvent.actorUsername} ({inspectEvent.actorRole})</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-[#A5A5AD]">Entity Affected:</span>
                <span className="font-mono text-[#38BDF8]">{inspectEvent.entityType} #{inspectEvent.entityId}</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-[#A5A5AD]">Previous State:</span>
                <span className="font-mono text-[#FB7185]">{inspectEvent.previousState || 'NONE'}</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-[#A5A5AD]">New State:</span>
                <span className="font-mono text-[#34D399]">{inspectEvent.newState || 'NONE'}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-[#A5A5AD] block mb-1">Details & Remarks:</span>
                <p className="text-[#C8CBD2] font-mono text-[11px] leading-relaxed">
                  {inspectEvent.details || inspectEvent.remarks || 'Standard statutory workflow operation logged.'}
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setInspectEvent(null)}
                className="px-4 py-2 rounded-xl bg-white/[0.06] text-white text-xs"
              >
                Close Audit Inspection
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
