import React, { useState, useEffect } from 'react';
import EnterpriseLayout from '../components/EnterpriseLayout';
import { api } from '../services/api';
import { 
  Network, 
  Layers, 
  Building2, 
  FileText, 
  ShieldCheck, 
  Info, 
  ArrowRight,
  Filter,
  Sparkles
} from 'lucide-react';

export default function KnowledgeGraphPage() {
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState(null);
  const [typeFilter, setTypeFilter] = useState('ALL');

  useEffect(() => {
    api.getKnowledgeGraph()
      .then(res => {
        setGraphData(res.data);
        if (res.data.nodes.length > 0) {
          setSelectedNode(res.data.nodes[0]);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredNodes = typeFilter === 'ALL' 
    ? graphData.nodes 
    : graphData.nodes.filter(n => n.type === typeFilter);

  const getConnectedEdges = (nodeId) => {
    return graphData.edges.filter(e => e.source === nodeId || e.target === nodeId);
  };

  const getNodeColor = (type) => {
    switch (type) {
      case 'REGULATION': return 'border-white/20 bg-white/[0.08] text-[#B9F56B]';
      case 'CLAUSE': return 'border-white/15 bg-white/[0.05] text-[#C8CBD2]';
      case 'INSTITUTION': return 'border-white/20 bg-white/[0.06] text-[#F5F5F5]';
      case 'APPLICATION': return 'border-[#B9F56B]/30 bg-[#B9F56B]/10 text-[#B9F56B]';
      case 'OBLIGATION': return 'border-white/15 bg-white/[0.05] text-[#C8CBD2]';
      default: return 'border-white/10 bg-white/[0.03] text-[#A5A5AD]';
    }
  };

  return (
    <EnterpriseLayout activeSection="reports">
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#B9F56B] shadow-[0_0_8px_#B9F56B]"></span>
              <span className="text-xs font-mono text-[#B9F56B] uppercase tracking-wider font-semibold">Semantic Knowledge Network</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F5F5] mt-1">
              Regulatory Knowledge Graph
            </h1>
            <p className="text-xs text-[#A5A5AD]">
              Relational ontologies linking statutory handbook clauses, institutions, live filings, and compliance mandates.
            </p>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#A5A5AD]" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="glass-input rounded-2xl px-3 py-1.5 text-xs text-[#F5F5F5] focus:outline-none focus:border-[#B9F56B]/50"
            >
              <option value="ALL" className="bg-[#111215] text-[#F5F5F5]">All Entity Types</option>
              <option value="REGULATION" className="bg-[#111215] text-[#F5F5F5]">Regulations</option>
              <option value="CLAUSE" className="bg-[#111215] text-[#F5F5F5]">Statutory Clauses</option>
              <option value="INSTITUTION" className="bg-[#111215] text-[#F5F5F5]">Institutions</option>
              <option value="APPLICATION" className="bg-[#111215] text-[#F5F5F5]">Applications</option>
              <option value="OBLIGATION" className="bg-[#111215] text-[#F5F5F5]">Compliance Obligations</option>
            </select>
          </div>
        </div>

        {/* Main Two-Column View */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Node Matrix View */}
          <div className="lg:col-span-2 glass-card rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#A5A5AD] uppercase font-semibold">
                Indexed Regulatory Entities ({filteredNodes.length})
              </span>
              <span className="text-[10px] text-[#B9F56B] font-mono">
                Relationships: {graphData.edges.length} Edges
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[560px] overflow-y-auto pr-1">
              {filteredNodes.map((node) => {
                const isSelected = selectedNode?.id === node.id;
                const colorClasses = getNodeColor(node.type);
                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all shadow-glass-highlight ${colorClasses} ${
                      isSelected ? 'ring-2 ring-[#B9F56B] shadow-lime-glow scale-[1.01] bg-white/[0.1]' : 'hover:bg-white/[0.09]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono mb-1 font-bold">
                      <span>{node.type}</span>
                      <span className="text-[#A5A5AD]">{node.status}</span>
                    </div>
                    <h4 className="text-xs font-semibold text-[#F5F5F5] truncate">{node.label}</h4>
                    <div className="text-[10px] text-[#A5A5AD] font-mono mt-1">ID: {node.id}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Explainability & Relationship Detail Pane */}
          <div className="glass-card rounded-3xl p-6 space-y-5">
            <div>
              <h3 className="text-xs font-mono uppercase text-[#B9F56B] font-semibold tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Explainable Relationship Inspector
              </h3>
              <p className="text-xs text-[#A5A5AD] mt-0.5">Click any node to trace governed dependencies</p>
            </div>

            {selectedNode ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl glass-surface space-y-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${getNodeColor(selectedNode.type)}`}>
                    {selectedNode.type}
                  </span>
                  <h4 className="text-sm font-bold text-[#F5F5F5]">{selectedNode.label}</h4>
                  <div className="text-xs text-[#A5A5AD] font-mono">Status: {selectedNode.status}</div>
                </div>

                {/* Connected Relationships */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-[#F5F5F5] block font-mono">
                    Active Connected Edges:
                  </span>
                  {getConnectedEdges(selectedNode.id).length === 0 ? (
                    <p className="text-xs text-[#A5A5AD]">No active direct links for this node.</p>
                  ) : (
                    getConnectedEdges(selectedNode.id).map((edge, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-mono">
                          <span className="text-[#A5A5AD] font-bold">{edge.source}</span>
                          <ArrowRight className="w-3 h-3 text-[#B9F56B]" />
                          <span className="text-[#F5F5F5]">{edge.target}</span>
                        </div>
                        <span className="text-[10px] font-mono text-[#B9F56B] font-bold">
                          {edge.relationship}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-3.5 rounded-2xl bg-[#B9F56B]/[0.06] border border-[#B9F56B]/20 text-xs text-[#F5F5F5] space-y-1">
                  <span className="font-semibold text-[#B9F56B] block text-[11px]">Explainability Rationale:</span>
                  <p className="text-[11px] text-[#A5A5AD] leading-relaxed">
                    When a regulation clause changes, the ontology engine traverses outgoing <code className="text-[#B9F56B] font-mono">APPLIES_TO</code> and <code className="text-[#B9F56B] font-mono">MANDATES</code> edges to automatically identify all affected technical campuses and running applications.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-[#A5A5AD] text-xs">
                Select an entity to inspect its structural connections.
              </div>
            )}
          </div>

        </div>

      </div>
    </EnterpriseLayout>
  );
}
