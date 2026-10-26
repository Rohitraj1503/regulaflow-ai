import React from 'react';
import { 
  FileEdit, 
  Send, 
  Search, 
  AlertTriangle, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock
} from 'lucide-react';

const STAGES = [
  { key: 'DRAFT', label: 'Draft Initiation', icon: FileEdit },
  { key: 'SUBMITTED', label: 'Application Filed', icon: Send },
  { key: 'UNDER_SCRUTINY', label: 'Scrutiny Cell', icon: Search },
  { key: 'DEFICIENCY_NOTED', label: 'Deficiencies', icon: AlertTriangle, warning: true },
  { key: 'EVC_SCHEDULED', label: 'EVC Inspection', icon: Calendar },
  { key: 'APPROVED', label: 'Statutory Approval', icon: CheckCircle, success: true },
];

export default function WorkflowStepper({ currentStatus, daysInStage, totalDays }) {
  const getStageIndex = (status) => {
    switch (status) {
      case 'DRAFT': return 0;
      case 'SUBMITTED': return 1;
      case 'UNDER_SCRUTINY': return 2;
      case 'DEFICIENCY_NOTED':
      case 'CLARIFICATION_SUBMITTED':
      case 'RESUBMITTED':
      case 'RE_SCRUTINY': return 3;
      case 'EVC_SCHEDULED':
      case 'EVC_COMPLETED': return 4;
      case 'APPROVED':
      case 'REJECTED':
      case 'CLOSED': return 5;
      default: return 1;
    }
  };

  const currentIndex = getStageIndex(currentStatus);

  return (
    <div className="w-full glass-card rounded-3xl p-5 sm:p-6 border border-white/14">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs uppercase font-mono tracking-wider text-[#A5A5AD]">Approval Workflow Trajectory</span>
          <div className="text-sm font-semibold text-[#F5F5F5] flex items-center gap-2 mt-0.5">
            <span>Status:</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${
              currentStatus === 'APPROVED' ? 'bg-[#B9F56B]/15 text-[#B9F56B] border-[#B9F56B]/30' :
              currentStatus === 'REJECTED' ? 'bg-[#FB7185]/20 text-[#FB7185] border-[#FB7185]/40' :
              currentStatus === 'DEFICIENCY_NOTED' ? 'bg-[#FB7185]/15 text-[#FB7185] border-[#FB7185]/30' :
              'bg-white/[0.08] text-[#B9F56B] border-white/20'
            }`}>
              {currentStatus}
            </span>
          </div>
        </div>

        {(daysInStage !== undefined || totalDays !== undefined) && (
          <div className="flex items-center gap-3 text-xs text-[#A5A5AD] font-mono">
            {daysInStage !== undefined && (
              <span className="flex items-center gap-1.5 text-[#B9F56B]">
                <Clock className="w-3.5 h-3.5" />
                Stage Age: {daysInStage}d
              </span>
            )}
            {totalDays !== undefined && (
              <span className="text-[#8A8D96]">
                Total: {totalDays}d
              </span>
            )}
          </div>
        )}
      </div>

      {/* Stepper Progress Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
        {STAGES.map((stage, idx) => {
          const Icon = stage.icon;
          const isPassed = idx < currentIndex;
          const isCurrent = idx === currentIndex;

          let colorClass = 'border-white/5 text-[#A5A5AD]/40 bg-white/[0.02]';
          if (isCurrent) {
            colorClass = stage.warning
              ? 'border-[#FB7185] text-[#FB7185] bg-[#FB7185]/10 shadow-[0_0_15px_rgba(251,113,133,0.2)] animate-pulse'
              : 'border-[#B9F56B] text-[#B9F56B] bg-[#B9F56B]/10 shadow-[0_0_18px_rgba(185,245,107,0.25)] animate-pulse';
          } else if (isPassed) {
            colorClass = 'border-white/20 text-[#F5F5F5] bg-white/[0.08] shadow-glass-highlight';
          }

          return (
            <div
              key={stage.key}
              className={`p-3.5 rounded-2xl border flex flex-col items-center text-center transition-all ${colorClass}`}
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-1.5">
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-semibold leading-tight">{stage.label}</span>
              <span className="text-[9px] font-mono mt-1 opacity-70">
                {isPassed ? '✓ Done' : isCurrent ? '● Active' : 'Waiting'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
