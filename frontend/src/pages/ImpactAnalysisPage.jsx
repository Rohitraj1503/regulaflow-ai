import React, { useState, useEffect } from 'react';
import EnterpriseLayout from '../components/EnterpriseLayout';
import { api } from '../services/api';
import { 
  GitCompare, 
  AlertTriangle, 
  Building2, 
  FileText, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

export default function ImpactAnalysisPage() {
  const [impactData, setImpactData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Compare APH 2025-26 (id: 2) with APH 2026-27 (id: 1)
    api.analyzeImpact({ baseDocumentId: 2, targetDocumentId: 1 })
      .then(res => setImpactData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <EnterpriseLayout activeSection="documents">
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#B9F56B] shadow-[0_0_8px_#B9F56B]"></span>
              <span className="text-xs font-mono text-[#B9F56B] uppercase tracking-wider font-semibold">Policy Evolution Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F5F5] mt-1">
              Regulatory Change Impact Analysis
            </h1>
            <p className="text-xs text-[#A5A5AD]">
              Automated statutory diff between handbook editions identifying impacted institutions and running applications.
            </p>
          </div>

          <div className="px-4 py-2 rounded-2xl glass-card text-xs font-mono text-[#F5F5F5] flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-[#B9F56B]" />
            <span>Comparing: APH 2025-26 → APH 2026-27</span>
          </div>
        </div>

        {/* Executive Summary Card */}
        {impactData && (
          <div className="glass-card rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-[#B9F56B] font-mono text-xs font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>AICTE EXECUTIVE POLICY SYNTHESIS</span>
            </div>
            <p className="text-sm text-[#F5F5F5] leading-relaxed font-medium">
              {impactData.executiveSummary}
            </p>
            <div className="flex flex-wrap items-center gap-6 text-xs font-mono pt-3 border-t border-white/10 text-[#A5A5AD]">
              <span>Changed Clauses: <strong className="text-[#B9F56B]">{impactData.totalChangedClauses}</strong></span>
              <span>•</span>
              <span>Potentially Affected Applications: <strong className="text-[#F5F5F5]">{impactData.affectedApplicationsCount}</strong></span>
              <span>•</span>
              <span>Institutions Requiring Audit: <strong className="text-[#C8CBD2]">{impactData.affectedInstitutionsCount}</strong></span>
            </div>
          </div>
        )}

        {/* Main Grid: Changed Clauses and Affected Applications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Changed Clauses Column */}
          <div className="space-y-4">
            <h2 className="text-xs font-mono uppercase tracking-wider text-[#B9F56B] font-semibold flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>Modified Handbook Clauses</span>
            </h2>

            <div className="space-y-3">
              {impactData?.clauseChanges?.map((clause, idx) => (
                <div key={idx} className="glass-card rounded-3xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#B9F56B]">{clause.clauseNumber}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        clause.severity === 'HIGH' 
                          ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30' 
                          : 'bg-white/[0.08] text-[#C8CBD2] border border-white/15'
                      }`}>
                        {clause.severity} IMPACT
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#A5A5AD]">{clause.changeType}</span>
                  </div>

                  <h3 className="text-xs font-bold text-[#F5F5F5]">{clause.title}</h3>

                  {/* Diff Comparison */}
                  <div className="space-y-2 text-xs">
                    <div className="p-3 rounded-2xl bg-rose-950/20 border border-rose-500/20 text-rose-200 space-y-1">
                      <span className="text-[10px] font-mono uppercase block font-semibold text-rose-400">Previous Text (APH 2025-26):</span>
                      <p className="line-through opacity-75">{clause.previousText}</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#B9F56B]/[0.08] border border-[#B9F56B]/25 text-[#F5F5F5] space-y-1">
                      <span className="text-[10px] font-mono uppercase block font-semibold text-[#B9F56B]">Amended Gazette Text (APH 2026-27):</span>
                      <p>{clause.currentText}</p>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#A5A5AD] italic pt-2 border-t border-white/10">
                    Impact Note: {clause.impactExplanation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Impacted Applications and Institutions Column */}
          <div className="space-y-4">
            <h2 className="text-xs font-mono uppercase tracking-wider text-[#B9F56B] font-semibold flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              <span>Potentially Impacted Active Filings</span>
            </h2>

            <div className="space-y-3">
              {impactData?.affectedEntities?.map((entity, idx) => (
                <div key={idx} className="glass-card rounded-3xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#B9F56B]">{entity.entityIdentifier}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      entity.riskLevel === 'HIGH' 
                        ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30' 
                        : 'bg-white/[0.08] text-[#C8CBD2] border border-white/15'
                    }`}>
                      {entity.riskLevel} RISK
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-[#F5F5F5]">{entity.entityName}</h3>
                    <div className="text-[10px] font-mono text-[#A5A5AD] mt-0.5">Entity Type: {entity.entityType}</div>
                  </div>

                  <div className="p-3.5 rounded-2xl glass-surface text-xs space-y-1">
                    <span className="text-[10px] font-mono text-[#A5A5AD] uppercase font-semibold">Recommended Officer Action:</span>
                    <p className="text-[#F5F5F5]">{entity.suggestedAction}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </EnterpriseLayout>
  );
}
