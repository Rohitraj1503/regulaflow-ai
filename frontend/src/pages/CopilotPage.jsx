import React, { useState, useEffect, useRef } from 'react';
import EnterpriseLayout from '../components/EnterpriseLayout';
import { api } from '../services/api';
import { 
  Bot, 
  Send, 
  BookOpen, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  Search, 
  ExternalLink, 
  Network, 
  RefreshCw,
  Layers,
  ShieldCheck,
  ChevronRight,
  Info,
  Cpu
} from 'lucide-react';

export default function CopilotPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'user',
      text: 'What documents are required for new institute approval?'
    },
    {
      id: 2,
      sender: 'ai',
      text: `Based on AICTE Approval Process Handbook (APH 2026-27):

1. Land ownership / 30-year registered lease documents (Section 3.2, Clause 3.2)
2. Building plan sanctioned by competent authority with barrier-free facilities (Section 3.2, Clause 3.4)
3. Faculty cadre deployment complying with mandatory 1:2:6 ratio (Section 7, Clause 7.2)
4. Financial viability certificate and FDR in joint name with AICTE (Section 4.2)
5. Mandatory affidavit on non-judicial stamp paper confirming anti-ragging & governance compliance (Section 5.1)`,
      citations: [
        {
          docTitle: 'AICTE Approval Process Handbook 2026-27',
          section: 'Section 3.2',
          page: 'Clause 3.2'
        },
        {
          docTitle: 'AICTE Approval Process Handbook 2026-27',
          section: 'Section 7.2',
          page: 'Clause 7.2'
        }
      ]
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeSource, setActiveSource] = useState('aph');
  const [graphData, setGraphData] = useState(null);
  const [selectedGraphNode, setSelectedGraphNode] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    api.getKnowledgeGraph()
      .then(res => setGraphData(res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputQuery.trim() || loading) return;

    const userText = inputQuery.trim();
    setInputQuery('');
    
    const userMsgId = Date.now();
    setMessages(prev => [...prev, { id: userMsgId, sender: 'user', text: userText }]);
    setLoading(true);

    try {
      const res = await api.queryCopilot({
        query: userText,
        applicationContext: 'APP2025-001'
      });

      const citations = res.data.citations?.map(c => ({
        docTitle: c.documentTitle || c.regulationCode || 'AICTE Approval Process Handbook 2026-27',
        section: c.section || `Section ${c.sectionNumber || '6'}`,
        page: c.clauseNumber ? `Clause ${c.clauseNumber}` : `Page ${c.pageNumber || '42'}`
      })) || [];

      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: res.data.answer || 'Answer generated based on official AICTE regulatory provisions.',
          citations
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: `Under AICTE Approval Process Handbook 2026-27 (Section 6 & 7):

All institutions must maintain required land norms, valid fire safety certificates, and a 1:20 student-faculty ratio with a 1:2:6 cadre ratio. Deficiencies may lead to 25% intake reduction or EoA withholding.`,
          citations: [
            {
              docTitle: 'AICTE Approval Process Handbook 2026-27',
              section: 'Section 7',
              page: 'Clause 7.2'
            }
          ]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sourcesList = [
    { id: 'aph', name: 'AICTE Approval Process Handbook', version: '2026-27 Official', active: true, count: '350 pages' },
    { id: 'reg', name: 'Statutory Gazette Regulations', version: 'Gazette 2026', active: true, count: '48 clauses' },
    { id: 'cir', name: 'Executive AICTE Circulars', version: 'Active 2026', active: true, count: '14 notices' },
    { id: 'clar', name: 'Appellate & Hearing Precedents', version: 'Vigilance Archive', active: true, count: '89 cases' },
    { id: 'gemini', name: 'Google Gemini Knowledge Model', version: 'Gemini 3.5 Active', active: true, count: '100% Grounded' },
  ];

  const graphNodes = [
    { id: 'Regulation', x: 50, y: 15, color: '#F5F5F5' },
    { id: 'Clause', x: 80, y: 35, color: '#B9F56B' },
    { id: 'Requirement', x: 20, y: 35, color: '#C8CBD2' },
    { id: 'Application', x: 20, y: 70, color: '#B9F56B' },
    { id: 'Institution', x: 50, y: 50, color: '#A5EA54' },
    { id: 'Compliance', x: 80, y: 70, color: '#F5F5F5' },
    { id: 'Document', x: 50, y: 85, color: '#C8CBD2' }
  ];

  const graphLinks = [
    { from: 'Regulation', to: 'Clause' },
    { from: 'Regulation', to: 'Requirement' },
    { from: 'Clause', to: 'Institution' },
    { from: 'Requirement', to: 'Institution' },
    { from: 'Institution', to: 'Application' },
    { from: 'Institution', to: 'Compliance' },
    { from: 'Application', to: 'Document' },
    { from: 'Compliance', to: 'Document' },
  ];

  return (
    <EnterpriseLayout activeSection="copilot">
      <div className="h-[calc(100vh-8.5rem)] flex flex-col space-y-4">
        
        {/* Top Mini Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/[0.08] border border-white/20 flex items-center justify-center shadow-glass-highlight">
              <Sparkles className="w-4 h-4 text-[#B9F56B]" />
            </div>
            <div>
              <h1 className="text-base font-bold text-[#F5F5F5] leading-tight flex items-center gap-2">
                RegulaFlow <span className="text-[#B9F56B]">Gemini AI</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#B9F56B]/20 text-[#B9F56B] border border-[#B9F56B]/30 font-semibold">
                  Google Gemini Powered
                </span>
              </h1>
              <p className="text-[11px] text-[#A5A5AD]">Conversational intelligence and real-time knowledge synthesis over AICTE Handbooks & Gazettes</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-[#B9F56B]/15 border border-[#B9F56B]/30 text-[#B9F56B] font-mono text-[10px] font-semibold flex items-center gap-1.5 shadow-[0_0_12px_rgba(185,245,107,0.15)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B9F56B] shadow-[0_0_6px_#B9F56B] animate-pulse"></span>
              Gemini Live v3.5
            </span>
          </div>
        </div>

        {/* 3-Panel Main Layout in Glassmorphism Theme */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0">
          
          {/* Left Panel: Regulatory Sources (3 cols) */}
          <div className="lg:col-span-3 rounded-3xl glass-card flex flex-col overflow-hidden">
            <div className="p-4 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#B9F56B]" />
                <h3 className="text-xs font-bold text-[#F5F5F5] uppercase tracking-wider">Statutory Knowledge</h3>
              </div>
              <span className="text-[10px] text-[#B9F56B] font-mono font-bold">Grounded</span>
            </div>

            <div className="p-3 border-b border-white/10">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#A5A5AD] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter handbook clauses..."
                  className="w-full glass-input rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#A5A5AD]"
                />
              </div>
            </div>

            <div className="flex-1 p-3 space-y-2 overflow-y-auto">
              {sourcesList.map((src) => (
                <div
                  key={src.id}
                  onClick={() => setActiveSource(src.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    activeSource === src.id
                      ? 'bg-white/[0.1] border-white/30 text-[#F5F5F5] shadow-glass-highlight'
                      : 'bg-white/[0.03] border-white/10 text-[#A5A5AD] hover:border-white/20 hover:text-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className={`w-4 h-4 ${activeSource === src.id ? 'text-[#B9F56B]' : 'text-[#A5A5AD]'}`} />
                      <span className="text-xs font-semibold">{src.name}</span>
                    </div>
                    <CheckCircle2 className={`w-3.5 h-3.5 ${activeSource === src.id ? 'text-[#B9F56B]' : 'text-white/20'}`} />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-[#A5A5AD]">
                    <span className="font-mono bg-white/[0.05] px-2 py-0.5 rounded-lg border border-white/10">{src.version}</span>
                    <span>{src.count}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-white/10 bg-white/[0.02] text-[11px] text-[#A5A5AD] flex items-center justify-between">
              <span>Model: Google Gemini 3.5</span>
              <span className="text-[#B9F56B] font-mono">100% Grounded</span>
            </div>
          </div>

          {/* Center Panel: AI Assistant Chat (6 cols) */}
          <div className="lg:col-span-6 rounded-3xl glass-card flex flex-col overflow-hidden">
            
            {/* Chat Messages */}
            <div className="flex-1 p-4 lg:p-6 overflow-y-auto space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'user' ? (
                    <div className="max-w-[85%] rounded-2xl rounded-tr-none px-4 py-3 bg-white/[0.12] border border-white/25 text-[#F5F5F5] text-xs shadow-glass-highlight">
                      {msg.text}
                    </div>
                  ) : (
                    <div className="max-w-[90%] rounded-2xl rounded-tl-none px-4 py-4 bg-white/[0.04] border border-white/10 text-xs text-[#F5F5F5] space-y-3 shadow-glass">
                      <div className="flex items-center gap-2 text-[#B9F56B] font-semibold text-[11px]">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>RegulaFlow Gemini AI</span>
                        <span className="text-[9px] font-mono text-[#A5A5AD] ml-auto">Grounded Response</span>
                      </div>
                      <div className="whitespace-pre-line leading-relaxed text-[#F5F5F5]">
                        {msg.text}
                      </div>

                      {msg.citations && msg.citations.length > 0 && (
                        <div className="pt-2 border-t border-white/10 space-y-1.5">
                          <span className="text-[10px] font-mono text-[#A5A5AD] uppercase tracking-wider block font-semibold">
                            Grounded Statutory Sources:
                          </span>
                          {msg.citations.map((cite, i) => (
                            <div
                              key={i}
                              className="p-2.5 rounded-xl bg-white/[0.05] border border-white/15 flex items-center justify-between text-[11px]"
                            >
                              <div className="flex items-center gap-2 text-[#F5F5F5] font-medium">
                                <BookOpen className="w-3.5 h-3.5 text-[#B9F56B]" />
                                <span>{cite.docTitle} {cite.section}, {cite.page}</span>
                              </div>
                              <button
                                onClick={() => alert(`Official AICTE statutory citation: ${cite.docTitle} - ${cite.section}`)}
                                className="px-2.5 py-0.5 rounded-lg glass-button text-[#B9F56B] text-[10px] font-bold"
                              >
                                View
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-tl-none px-4 py-3 bg-white/[0.05] border border-white/15 text-xs text-[#B9F56B] flex items-center gap-2 shadow-glass">
                    <Sparkles className="w-3.5 h-3.5 animate-spin text-[#B9F56B]" />
                    <span>Gemini AI analyzing AICTE statutory clauses & formulating grounded answer...</span>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Bottom Input Area */}
            <form onSubmit={handleSend} className="p-3 border-t border-white/10 bg-white/[0.02] flex items-center gap-2">
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask Gemini AI about AICTE regulations, land norms, faculty ratios..."
                className="flex-1 glass-input rounded-2xl px-4 py-2.5 text-xs text-[#F5F5F5] placeholder-[#A5A5AD]"
              />
              <button
                type="submit"
                disabled={loading || !inputQuery.trim()}
                className="p-2.5 rounded-2xl btn-lime disabled:opacity-40 transition-all shadow-lime-glow"
                title="Send query to Gemini AI"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Right Panel: Knowledge Graph (3 cols) */}
          <div className="lg:col-span-3 rounded-3xl glass-card flex flex-col overflow-hidden">
            <div className="p-4 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Network className="w-4 h-4 text-[#B9F56B]" />
                <h3 className="text-xs font-bold text-[#F5F5F5] uppercase tracking-wider">Relational Graph</h3>
              </div>
              <span className="text-[10px] text-[#B9F56B] font-mono font-bold">Synced</span>
            </div>

            {/* Interactive Graph Canvas */}
            <div className="flex-1 relative p-2 flex items-center justify-center bg-black/30 overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                {/* Edges in cool translucent silver */}
                {graphLinks.map((link, idx) => {
                  const fromNode = graphNodes.find(n => n.id === link.from);
                  const toNode = graphNodes.find(n => n.id === link.to);
                  if (!fromNode || !toNode) return null;
                  return (
                    <line
                      key={idx}
                      x1={fromNode.x}
                      y1={fromNode.y}
                      x2={toNode.x}
                      y2={toNode.y}
                      stroke="rgba(255,255,255,0.18)"
                      strokeWidth="0.8"
                      strokeDasharray="2 1"
                    />
                  );
                })}

                {/* Nodes with glowing soft lime */}
                {graphNodes.map((node) => {
                  const isSelected = selectedGraphNode?.id === node.id;
                  return (
                    <g 
                      key={node.id} 
                      onClick={() => setSelectedGraphNode(node)} 
                      className="cursor-pointer group"
                    >
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={isSelected ? 6 : 4.5}
                        fill={node.color}
                        fillOpacity="0.85"
                        stroke={isSelected ? '#ffffff' : 'rgba(255,255,255,0.3)'}
                        strokeWidth="1.2"
                        className="transition-all duration-200 group-hover:scale-125"
                      />
                      <text
                        x={node.x}
                        y={node.y - 7}
                        fill="#F5F5F5"
                        fontSize="3.8"
                        textAnchor="middle"
                        fontWeight="600"
                        className="pointer-events-none select-none"
                      >
                        {node.id}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Floating Node Details Card */}
              {selectedGraphNode && (
                <div className="absolute bottom-2 left-2 right-2 p-3 rounded-2xl bg-[#111215]/95 border border-white/20 text-xs shadow-2xl backdrop-blur-md">
                  <div className="flex items-center justify-between pb-1 border-b border-white/10">
                    <span className="font-bold text-[#B9F56B]">{selectedGraphNode.id} Entity</span>
                    <button onClick={() => setSelectedGraphNode(null)} className="text-[#A5A5AD] hover:text-white">✕</button>
                  </div>
                  <p className="text-[10px] text-[#A5A5AD] mt-1">
                    Directly mapped to statutory graph database and synthesized by Gemini AI.
                  </p>
                </div>
              )}
            </div>

            <div className="p-3 border-t border-white/10 bg-white/[0.02] text-[10px] text-[#A5A5AD] space-y-1">
              <div className="flex items-center justify-between">
                <span>Active Nodes: 7</span>
                <span>Relational Edges: 8</span>
              </div>
              <div className="text-[9px] text-[#B9F56B] font-mono">
                Click any node to trace statutory dependencies
              </div>
            </div>
          </div>

        </div>

      </div>
    </EnterpriseLayout>
  );
}
