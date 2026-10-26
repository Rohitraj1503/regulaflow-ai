package gov.aicte.regulaflow.dto;

import java.util.List;

public class KnowledgeGraphDto {
    private List<GraphNode> nodes;
    private List<GraphEdge> edges;

    public KnowledgeGraphDto() {}

    public KnowledgeGraphDto(List<GraphNode> nodes, List<GraphEdge> edges) {
        this.nodes = nodes;
        this.edges = edges;
    }

    public List<GraphNode> getNodes() { return nodes; }
    public void setNodes(List<GraphNode> nodes) { this.nodes = nodes; }

    public List<GraphEdge> getEdges() { return edges; }
    public void setEdges(List<GraphEdge> edges) { this.edges = edges; }

    public static class GraphNode {
        private String id;
        private String label;
        private String type; // REGULATION, CLAUSE, INSTITUTION, APPLICATION, OBLIGATION, OFFICER
        private String status;

        public GraphNode() {}

        public GraphNode(String id, String label, String type, String status) {
            this.id = id;
            this.label = label;
            this.type = type;
            this.status = status;
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getLabel() { return label; }
        public void setLabel(String label) { this.label = label; }

        public String getType() { return type; }
        public void setType(String type) { this.type = type; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }

    public static class GraphEdge {
        private String source;
        private String target;
        private String relationship; // GOVERNS, MANDATES, ASSIGNED_TO, HAS_DEFICIENCY, SUBMITTED_BY

        public GraphEdge() {}

        public GraphEdge(String source, String target, String relationship) {
            this.source = source;
            this.target = target;
            this.relationship = relationship;
        }

        public String getSource() { return source; }
        public void setSource(String source) { this.source = source; }

        public String getTarget() { return target; }
        public void setTarget(String target) { this.target = target; }

        public String getRelationship() { return relationship; }
        public void setRelationship(String relationship) { this.relationship = relationship; }
    }
}
