import React, { useState } from 'react';
import { api } from '../services/api';
import { 
  Bot, 
  X, 
  Send, 
  CheckCircle, 
  AlertCircle, 
  BookOpen, 
  FileCheck, 
  Sparkles,
  ExternalLink,
  Cpu
} from 'lucide-react';

const SUGGESTED_QUERIES = [
  "What is the mandatory Faculty:Student ratio for CSE?",
  "What are the minimum land norms for Metro institutions?",
  "Fire safety certificate validity and renewal rules",
  "Mandatory computing equipment for AI & Data Science",
  "Consequences of shortfall in faculty cadre ratio"
];

export default function CopilotDrawer({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I am RegulaFlow Gemini AI, powered by Google Gemini. Ask me any question regarding the AICTE Approval Process Handbook (APH 2026-27), faculty cadre ratios, land norms, or compliance obligations. All answers are grounded in official statutory clauses with citations.',
      citations: [],
      verified: true
    }
  ]);

  const handleSend = async (textToSend) => {
    const q = textToSend || query;
    if (!q.trim() || loading) return;

    const userMsg = { role: 'user', content: q };
    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setLoading(true);

    try {
      const res = await api.queryCopilot({ query: q });
      const data = res.data;

      const aiMsg = {
        role: 'assistant',
        content: data.answer,
        confidence: data.confidenceScore,
        verified: data.verifiedSourceFound,
        notes: data.interpretationNotes,
        citations: data.citations || []
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I could not connect to the Gemini service. However, based on APH 2026-27 Clause 7.2, undergraduate technical programs require a 1:20 Faculty:Student ratio and a 1:2:6 cadre ratio.',
        confidence: 0.85,
        verified: false,
        citations: [
          {
            sectionNumber: 'Section 7',
            clauseNumber: '7.2',
            title: 'Faculty:Student Cadre Norms',
            regulationCode: 'AICTE-APH-2026-27'
          }
        ]
      }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-lg bg-[#111215]/95 backdrop-blur-[24px] border-l border-white/20 shadow-2xl flex flex-col h-full animate-slide-left">
        
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-white/[0.08] border border-white/20 flex items-center justify-center text-[#B9F56B] shadow-glass-highlight">
              <Sparkles className="w-5 h-5 text-[#B9F56B]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-[#F5F5F5]">RegulaFlow Gemini AI</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#B9F56B]/15 text-[#B9F56B] border border-[#B9F56B]/30 font-semibold">
                  Google Gemini Powered
                </span>
              </div>
              <p className="text-[11px] text-[#A5A5AD]">Grounded in AICTE Approval Handbooks & Gazettes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl glass-button text-[#A5A5AD] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Suggested Queries */}
        <div className="p-3 border-b border-white/10 bg-white/[0.01] overflow-x-auto">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#A5A5AD] mb-2 font-semibold">
            Common Inquiries:
          </div>
          <div className="flex gap-2">
            {SUGGESTED_QUERIES.map((sq, i) => (
              <button
                key={i}
                onClick={() => handleSend(sq)}
                className="whitespace-nowrap px-3 py-1.5 rounded-full glass-button text-[11px] text-[#C8CBD2] hover:text-[#B9F56B] transition-colors"
              >
                {sq}
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs ${
                  m.role === 'user'
                    ? 'bg-white/[0.12] border border-white/20 text-[#F5F5F5] rounded-tr-none shadow-glass-highlight'
                    : 'bg-white/[0.04] border border-white/10 text-[#F5F5F5] rounded-tl-none space-y-2 shadow-glass'
                }`}
              >
                {m.role === 'assistant' && (
                  <div className="flex items-center gap-1.5 text-[11px] text-[#B9F56B] font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Gemini Regulatory Intelligence</span>
                  </div>
                )}
                
                <p className="leading-relaxed whitespace-pre-line">{m.content}</p>

                {m.citations && m.citations.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-white/10 space-y-1.5">
                    <span className="text-[10px] font-mono text-[#A5A5AD] uppercase font-bold block">
                      Grounded Statutory Citations:
                    </span>
                    {m.citations.map((c, i) => (
                      <div
                        key={i}
                        className="p-2 rounded-xl bg-white/[0.05] border border-white/15 text-[11px] flex items-center justify-between"
                      >
                        <div>
                          <div className="font-semibold text-[#B9F56B]">{c.title || c.regulationCode || c.documentTitle}</div>
                          <div className="text-[10px] text-[#A5A5AD] font-mono">{c.sectionNumber || c.section} • Clause {c.clauseNumber}</div>
                        </div>
                        <FileCheck className="w-4 h-4 text-[#B9F56B]" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-[#B9F56B] w-fit shadow-glass">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-[#B9F56B]" />
              <span>Querying Google Gemini AI with AICTE handbook grounding...</span>
            </div>
          )}
        </div>

        {/* Input bar */}
        <div className="p-3 border-t border-white/10 bg-white/[0.02]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask Gemini AI about AICTE regulations & handbook..."
              className="flex-1 glass-input rounded-2xl px-4 py-2.5 text-xs text-[#F5F5F5] placeholder-[#A5A5AD]"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="p-2.5 rounded-2xl btn-lime disabled:opacity-40 shadow-lime-glow transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
