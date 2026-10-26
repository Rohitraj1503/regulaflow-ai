import React, { useState, useEffect } from 'react';
import EnterpriseLayout from '../components/EnterpriseLayout';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  Users, 
  Building2, 
  CheckCircle2, 
  MapPin, 
  FileText,
  Star,
  Check
} from 'lucide-react';

export default function EvcManagementPage() {
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState('August 2025');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Form state
  const [targetInst, setTargetInst] = useState('Apex Institute of Technology');
  const [visitDate, setVisitDate] = useState('2025-08-28');
  const [visitTime, setVisitTime] = useState('10:00 AM');
  const [teamName, setTeamName] = useState('Team A');

  // Upcoming Visits in Glassmorphic Theme
  const upcomingVisits = [
    {
      id: 1,
      institution: 'ABC Engineering College',
      datetime: '15 Aug 2025 | 10:00 AM',
      day: 15,
      team: 'Team A',
      status: 'Upcoming',
      badgeColor: 'bg-[#B9F56B]/15 border-[#B9F56B]/30 text-[#B9F56B]',
      chipBg: 'bg-[#B9F56B] text-[#08090B]',
      color: '#B9F56B',
      lead: 'Dr. Vikramaditya Rao',
      members: 'Prof. H. S. Murthy (IIT Bombay), Er. S. P. Gupta (PWD Expert)'
    },
    {
      id: 2,
      institution: 'XYZ Institute of Technology',
      datetime: '18 Aug 2025 | 11:30 AM',
      day: 18,
      team: 'Team B',
      status: 'Upcoming',
      badgeColor: 'bg-white/[0.08] border-white/20 text-[#C8CBD2]',
      chipBg: 'bg-white/[0.2] text-[#F5F5F5]',
      color: '#C8CBD2',
      lead: 'Prof. Sunita Deshmukh',
      members: 'Dr. K. Raman (IISc), Er. M. Joshi (State CE)'
    },
    {
      id: 3,
      institution: 'Global Tech University',
      datetime: '22 Aug 2025 | 09:30 AM',
      day: 22,
      team: 'Team C',
      status: 'Upcoming',
      badgeColor: 'bg-[#B9F56B]/15 border-[#B9F56B]/30 text-[#B9F56B]',
      chipBg: 'bg-[#B9F56B] text-[#08090B]',
      color: '#B9F56B',
      lead: 'Dr. Vikramaditya Rao',
      members: 'Prof. A. N. Sen (NIT Trichy), Er. R. Nair'
    },
    {
      id: 4,
      institution: 'PQR Institute',
      datetime: '25 Aug 2025 | 02:00 PM',
      day: 25,
      team: 'Team A',
      status: 'Upcoming',
      badgeColor: 'bg-white/[0.08] border-white/20 text-[#C8CBD2]',
      chipBg: 'bg-white/[0.2] text-[#F5F5F5]',
      color: '#C8CBD2',
      lead: 'Dr. Meenakshi Sundaram',
      members: 'Prof. T. Agarwal (DTU), Er. V. Deshpande'
    }
  ];

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    setShowScheduleModal(false);
    showToast(`EVC Inspection scheduled for ${targetInst} on ${visitDate} (${teamName}).`);
  };

  // Calendar dates representation for August 2025
  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const calendarCells = [
    { day: 27, inMonth: false }, { day: 28, inMonth: false }, { day: 29, inMonth: false }, { day: 30, inMonth: false }, { day: 31, inMonth: false },
    { day: 1, inMonth: true }, { day: 2, inMonth: true }, { day: 3, inMonth: true }, { day: 4, inMonth: true }, { day: 5, inMonth: true },
    { day: 6, inMonth: true }, { day: 7, inMonth: true }, { day: 8, inMonth: true }, { day: 9, inMonth: true }, { day: 10, inMonth: true },
    { day: 11, inMonth: true }, { day: 12, inMonth: true }, { day: 13, inMonth: true }, { day: 14, inMonth: true },
    { day: 15, inMonth: true, event: upcomingVisits[0] },
    { day: 16, inMonth: true }, { day: 17, inMonth: true },
    { day: 18, inMonth: true, event: upcomingVisits[1] },
    { day: 19, inMonth: true }, { day: 20, inMonth: true }, { day: 21, inMonth: true },
    { day: 22, inMonth: true, event: upcomingVisits[2] },
    { day: 23, inMonth: true }, { day: 24, inMonth: true },
    { day: 25, inMonth: true, event: upcomingVisits[3] },
    { day: 26, inMonth: true }, { day: 27, inMonth: true }, { day: 28, inMonth: true }, { day: 29, inMonth: true }, { day: 30, inMonth: true }, { day: 31, inMonth: true },
    { day: 1, inMonth: false }, { day: 2, inMonth: false }, { day: 3, inMonth: false }, { day: 4, inMonth: false }
  ];

  return (
    <EnterpriseLayout activeSection="evc">
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

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#F5F5F5]">EVC Schedule</h1>
            <p className="text-xs text-[#A5A5AD]">Expert Visit Committee physical & hybrid inspections with institutional conflict-of-interest checks</p>
          </div>

          <button
            onClick={() => setShowScheduleModal(true)}
            className="btn-lime px-4 py-2.5 rounded-2xl text-xs font-bold shadow-lime-glow flex items-center gap-2 w-fit transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule EVC</span>
          </button>
        </div>

        {/* 2-Column Calendar & Upcoming Visits Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Calendar Workspace (7 cols) */}
          <div className="lg:col-span-7 p-6 rounded-3xl glass-card space-y-4">
            
            {/* Month Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-[#B9F56B]" />
                <h2 className="text-sm font-bold text-[#F5F5F5]">{currentMonth}</h2>
              </div>
              <div className="flex items-center gap-1.5">
                <button className="p-1.5 rounded-xl glass-button text-[#A5A5AD] hover:text-white">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="p-1.5 rounded-xl glass-button text-[#A5A5AD] hover:text-white">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Days of Week */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-[#A5A5AD] py-1">
              {daysOfWeek.map((d, i) => (
                <div key={i} className="py-1">{d}</div>
              ))}
            </div>

            {/* Calendar Grid Cells */}
            <div className="grid grid-cols-7 gap-1.5 text-xs">
              {calendarCells.map((cell, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    if (cell.event) {
                      setSelectedVisit(cell.event);
                      setShowDetailsModal(true);
                    }
                  }}
                  className={`min-h-[58px] p-2 rounded-2xl border flex flex-col justify-between transition-all ${
                    !cell.inMonth
                      ? 'bg-transparent border-transparent text-[#A5A5AD]/20'
                      : cell.event
                      ? 'bg-white/[0.08] border-white/25 cursor-pointer hover:border-[#B9F56B]/60 shadow-glass-highlight'
                      : 'bg-white/[0.03] border-white/10 text-[#A5A5AD] hover:bg-white/[0.06]'
                  }`}
                >
                  <span className={`font-mono text-[11px] ${
                    cell.inMonth ? (cell.event ? 'text-white font-bold' : 'text-[#A5A5AD]') : 'text-transparent'
                  }`}>
                    {cell.day}
                  </span>

                  {cell.event && (
                    <div 
                      className={`w-full py-0.5 px-1.5 rounded-lg text-[9px] font-bold truncate text-center ${cell.event.chipBg}`}
                    >
                      {cell.event.team}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-[11px] text-[#A5A5AD]">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B9F56B] shadow-[0_0_6px_#B9F56B]"></span>
                <span>Team A Inspection</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C8CBD2]"></span>
                <span>Team B Inspection</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-white/[0.4]"></span>
                <span>Team C Inspection</span>
              </div>
            </div>

          </div>

          {/* Upcoming EVC Visits Cards (5 cols) */}
          <div className="lg:col-span-5 p-6 rounded-3xl glass-card space-y-4 flex flex-col justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#F5F5F5] border-b border-white/10 pb-3">
                Upcoming EVC Visits
              </h2>

              <div className="space-y-3 pt-3">
                {upcomingVisits.map((v) => (
                  <div
                    key={v.id}
                    onClick={() => {
                      setSelectedVisit(v);
                      setShowDetailsModal(true);
                    }}
                    className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-white/25 cursor-pointer transition-all space-y-2 group shadow-glass-highlight"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-[#F5F5F5] group-hover:text-[#B9F56B] transition-colors truncate max-w-[210px]">
                        {v.institution}
                      </h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${v.badgeColor}`}>
                        {v.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#A5A5AD]">
                      <div className="flex items-center gap-1.5 font-mono">
                        <Clock className="w-3.5 h-3.5 text-[#B9F56B]" />
                        <span>{v.datetime}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-white/[0.06] text-[#F5F5F5] border border-white/15">
                        {v.team}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-[11px] text-[#A5A5AD] flex items-center justify-between">
              <span>All committees validated for zero conflict of interest</span>
              <span className="text-[#B9F56B] font-mono font-bold">100% Cleared</span>
            </div>
          </div>

        </div>

      </div>

      {/* Schedule EVC Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl max-w-md w-full p-6 space-y-4 border-white/20">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-bold text-sm text-[#F5F5F5]">Schedule On-Site EVC Visit</h3>
              <button onClick={() => setShowScheduleModal(false)} className="text-[#A5A5AD] hover:text-white">✕</button>
            </div>
            <form onSubmit={handleScheduleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#F5F5F5] mb-1">Target Institution</label>
                <select
                  value={targetInst}
                  onChange={(e) => setTargetInst(e.target.value)}
                  className="w-full glass-input rounded-xl p-2.5 text-white"
                >
                  <option value="Apex Institute of Technology">Apex Institute of Technology (Northern)</option>
                  <option value="Western College of Engineering">Western College of Engineering (Western)</option>
                  <option value="Southern Academy of Technological Sciences">Southern Academy (Southern)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-[#F5F5F5] mb-1">Visit Date</label>
                  <input
                    type="date"
                    required
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className="w-full glass-input rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#F5F5F5] mb-1">Time Slot</label>
                  <input
                    type="text"
                    required
                    value={visitTime}
                    onChange={(e) => setVisitTime(e.target.value)}
                    className="w-full glass-input rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#F5F5F5] mb-1">Inspection Committee Team</label>
                <select
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full glass-input rounded-xl p-2.5 text-white"
                >
                  <option value="Team A">Team A (Dr. Vikramaditya Rao, Prof. H. S. Murthy)</option>
                  <option value="Team B">Team B (Prof. Sunita Deshmukh, Dr. K. Raman)</option>
                  <option value="Team C">Team C (Dr. V. Rao, Prof. A. N. Sen)</option>
                </select>
              </div>

              <div className="p-3 rounded-2xl bg-[#B9F56B]/10 border border-[#B9F56B]/30 text-[#B9F56B] text-[11px] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Zero Conflict-of-Interest verified across selected experts.</span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 rounded-xl glass-button text-xs text-[#A5A5AD]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl btn-lime text-xs font-bold"
                >
                  Confirm Inspection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Visit Details Modal */}
      {showDetailsModal && selectedVisit && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl max-w-md w-full p-6 space-y-4 border-white/20">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="font-bold text-sm text-[#F5F5F5]">{selectedVisit.institution}</h3>
                <p className="text-xs text-[#B9F56B] font-mono">{selectedVisit.team} • {selectedVisit.status}</p>
              </div>
              <button onClick={() => setShowDetailsModal(false)} className="text-[#A5A5AD] hover:text-white">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-[#A5A5AD]">Inspection Schedule:</span>
                <span className="text-[#F5F5F5] font-mono">{selectedVisit.datetime}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-[#A5A5AD]">Lead Inspection Officer:</span>
                <span className="text-[#F5F5F5] font-medium">{selectedVisit.lead}</span>
              </div>
              <div>
                <span className="text-[#A5A5AD] block mb-1">Committee Members:</span>
                <p className="text-[#F5F5F5] bg-white/[0.04] p-3 rounded-2xl border border-white/10 text-[11px]">
                  {selectedVisit.members}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 rounded-xl glass-button text-xs text-[#A5A5AD]"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  showToast('EVC Digital Checklist & Scoring sheet initialized.');
                }}
                className="px-4 py-2 rounded-xl btn-lime text-xs font-bold"
              >
                Open Inspection Checklist
              </button>
            </div>
          </div>
        </div>
      )}

    </EnterpriseLayout>
  );
}
