package gov.aicte.regulaflow.service;

import gov.aicte.regulaflow.dto.*;
import gov.aicte.regulaflow.entity.*;
import gov.aicte.regulaflow.exception.ResourceNotFoundException;
import gov.aicte.regulaflow.repository.*;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RegulatoryService {

    private final RegulatoryDocumentRepository documentRepository;
    private final RegulatoryClauseRepository clauseRepository;
    private final ApplicationRepository applicationRepository;
    private final InstitutionRepository institutionRepository;
    private final ComplianceObligationRepository obligationRepository;

    public RegulatoryService(RegulatoryDocumentRepository documentRepository,
                             RegulatoryClauseRepository clauseRepository,
                             ApplicationRepository applicationRepository,
                             InstitutionRepository institutionRepository,
                             ComplianceObligationRepository obligationRepository) {
        this.documentRepository = documentRepository;
        this.clauseRepository = clauseRepository;
        this.applicationRepository = applicationRepository;
        this.institutionRepository = institutionRepository;
        this.obligationRepository = obligationRepository;
    }

    public List<RegulatoryDocumentDto> getActiveRegulations() {
        return documentRepository.findByIsActiveTrue().stream()
                .map(this::mapDocToDto)
                .collect(Collectors.toList());
    }

    public List<RegulatoryDocumentDto> getAllRegulations() {
        return documentRepository.findAll().stream()
                .map(this::mapDocToDto)
                .collect(Collectors.toList());
    }

    public List<RegulatoryClauseDto> getClausesByDocument(Long documentId) {
        return clauseRepository.findByDocumentId(documentId).stream()
                .map(this::mapClauseToDto)
                .collect(Collectors.toList());
    }

    public KnowledgeGraphDto getKnowledgeGraph() {
        List<KnowledgeGraphDto.GraphNode> nodes = new ArrayList<>();
        List<KnowledgeGraphDto.GraphEdge> edges = new ArrayList<>();

        // Add Active Regulations
        List<RegulatoryDocument> docs = documentRepository.findByIsActiveTrue();
        for (RegulatoryDocument doc : docs) {
            String docNodeId = "REG_" + doc.getId();
            nodes.add(new KnowledgeGraphDto.GraphNode(docNodeId, doc.getTitle(), "REGULATION", doc.getVersion()));

            List<RegulatoryClause> clauses = clauseRepository.findByDocumentId(doc.getId());
            for (RegulatoryClause cl : clauses) {
                String clNodeId = "CLAUSE_" + cl.getId();
                nodes.add(new KnowledgeGraphDto.GraphNode(clNodeId, cl.getClauseNumber() + ": " + cl.getTitle(), "CLAUSE", "MANDATORY"));
                edges.add(new KnowledgeGraphDto.GraphEdge(docNodeId, clNodeId, "CONTAINS_CLAUSE"));
            }
        }

        // Add Institutions
        List<Institution> institutions = institutionRepository.findAll();
        for (Institution inst : institutions) {
            String instNodeId = "INST_" + inst.getId();
            nodes.add(new KnowledgeGraphDto.GraphNode(instNodeId, inst.getName(), "INSTITUTION", inst.getRegion()));

            // Link to relevant clause
            edges.add(new KnowledgeGraphDto.GraphEdge("CLAUSE_1", instNodeId, "APPLIES_CADRE_NORMS"));
        }

        // Add Applications
        List<Application> apps = applicationRepository.findAll();
        for (Application app : apps) {
            String appNodeId = "APP_" + app.getId();
            nodes.add(new KnowledgeGraphDto.GraphNode(appNodeId, app.getApplicationNumber(), "APPLICATION", app.getStatus()));
            edges.add(new KnowledgeGraphDto.GraphEdge("INST_" + app.getInstitution().getId(), appNodeId, "FILED_APPLICATION"));

            if ("DEFICIENCY_NOTED".equals(app.getStatus())) {
                edges.add(new KnowledgeGraphDto.GraphEdge(appNodeId, "CLAUSE_1", "HAS_CADRE_DEFICIENCY"));
            }
        }

        // Add Compliance Obligations
        List<ComplianceObligation> obligations = obligationRepository.findAll();
        for (ComplianceObligation ob : obligations) {
            String obNodeId = "OBL_" + ob.getId();
            nodes.add(new KnowledgeGraphDto.GraphNode(obNodeId, ob.getObligationTitle(), "OBLIGATION", ob.getStatus()));
            edges.add(new KnowledgeGraphDto.GraphEdge("INST_" + ob.getInstitution().getId(), obNodeId, "OBLIGATED_TO"));
        }

        return new KnowledgeGraphDto(nodes, edges);
    }

    public ImpactAnalysisResponse analyzeChangeImpact(ImpactAnalysisRequest request) {
        RegulatoryDocument baseDoc = documentRepository.findById(request.getBaseDocumentId())
                .orElseThrow(() -> new ResourceNotFoundException("RegulatoryDocument", "id", request.getBaseDocumentId()));

        RegulatoryDocument targetDoc = documentRepository.findById(request.getTargetDocumentId())
                .orElseThrow(() -> new ResourceNotFoundException("RegulatoryDocument", "id", request.getTargetDocumentId()));

        ImpactAnalysisResponse response = new ImpactAnalysisResponse();
        response.setBaseRegulation(baseDoc.getTitle() + " (" + baseDoc.getVersion() + ")");
        response.setTargetRegulation(targetDoc.getTitle() + " (" + targetDoc.getVersion() + ")");

        List<ImpactAnalysisResponse.ClauseChangeDetail> changes = new ArrayList<>();

        // Detail 1: Cadre ratio
        ImpactAnalysisResponse.ClauseChangeDetail c1 = new ImpactAnalysisResponse.ClauseChangeDetail();
        c1.setClauseNumber("Clause 7.2");
        c1.setTitle("Faculty:Student Cadre Ratio & High Performance Compute");
        c1.setChangeType("MODIFIED");
        c1.setPreviousText("Faculty cadre ratio 1:20 required across all programs with 1 Professor per 3 Associate Professors.");
        c1.setCurrentText("Cadre ratio strictly enforced at 1:20 with mandatory 80% regular faculty. For AI, Data Science & Cybersecurity, dedicated GPU-accelerated computing nodes are required.");
        c1.setSeverity("HIGH");
        c1.setImpactExplanation("Affects institutions with active Intake Increase or New Course applications in Computing/Emerging disciplines.");
        changes.add(c1);

        // Detail 2: Land norms
        ImpactAnalysisResponse.ClauseChangeDetail c2 = new ImpactAnalysisResponse.ClauseChangeDetail();
        c2.setClauseNumber("Clause 6.1");
        c2.setTitle("Minimum Land Requirements for Metro Areas");
        c2.setChangeType("MODIFIED");
        c2.setPreviousText("Minimum land requirement for Mega/Metro cities was 3.0 Acres.");
        c2.setCurrentText("Minimum land requirement for Mega/Metro cities reduced to 2.5 Acres provided FAR/FSI norms of municipal authority are met.");
        c2.setSeverity("MEDIUM");
        c2.setImpactExplanation("Enables urban campuses to qualify with smaller physical footprints if vertical infrastructure is certified.");
        changes.add(c2);

        // Detail 3: Anti-Ragging & Grievance
        ImpactAnalysisResponse.ClauseChangeDetail c3 = new ImpactAnalysisResponse.ClauseChangeDetail();
        c3.setClauseNumber("Clause 11.1");
        c3.setTitle("Online Anti-Ragging Portal Integration");
        c3.setChangeType("ADDED");
        c3.setPreviousText("Annual physical affidavit from parents and students.");
        c3.setCurrentText("Real-time digital affidavit verification through AICTE Central Portal with monthly meeting logs.");
        c3.setSeverity("LOW");
        c3.setImpactExplanation("Requires all institutions to submit digital verification links within 30 days.");
        changes.add(c3);

        response.setClauseChanges(changes);
        response.setTotalChangedClauses(changes.size());

        List<ImpactAnalysisResponse.AffectedEntityDetail> affected = new ArrayList<>();

        ImpactAnalysisResponse.AffectedEntityDetail a1 = new ImpactAnalysisResponse.AffectedEntityDetail();
        a1.setEntityType("APPLICATION");
        a1.setEntityIdentifier("APP-2026-002");
        a1.setEntityName("Apex Institute - Intake Increase (AI & DS)");
        a1.setRiskLevel("HIGH");
        a1.setSuggestedAction("Requires rectification of Cadre Ratio shortfall (1:24 vs 1:20) and proof of GPU laboratory setup.");
        affected.add(a1);

        ImpactAnalysisResponse.AffectedEntityDetail a2 = new ImpactAnalysisResponse.AffectedEntityDetail();
        a2.setEntityType("APPLICATION");
        a2.setEntityIdentifier("APP-2026-004");
        a2.setEntityName("Southern Academy - M.Tech Cybersecurity");
        a2.setRiskLevel("MEDIUM");
        a2.setSuggestedAction("Verify 60 GPU workstations and 1 Gbps internet line compliance during Scrutiny.");
        affected.add(a2);

        ImpactAnalysisResponse.AffectedEntityDetail a3 = new ImpactAnalysisResponse.AffectedEntityDetail();
        a3.setEntityType("INSTITUTION");
        a3.setEntityIdentifier("AICTE-1-10029381");
        a3.setEntityName("Apex Institute of Technology");
        a3.setRiskLevel("HIGH");
        a3.setSuggestedAction("Audit faculty appointments for 2026-27 intake expansion.");
        affected.add(a3);

        response.setAffectedEntities(affected);
        response.setAffectedInstitutionsCount(3);
        response.setAffectedApplicationsCount(2);
        response.setExecutiveSummary("The 2026-27 Handbook revision tightens faculty cadre ratios and computing standards for emerging technical courses while relaxing urban land footprint requirements. 2 ongoing applications require active compliance verification.");

        return response;
    }

    private RegulatoryDocumentDto mapDocToDto(RegulatoryDocument doc) {
        RegulatoryDocumentDto dto = new RegulatoryDocumentDto();
        dto.setId(doc.getId());
        dto.setTitle(doc.getTitle());
        dto.setRegulationCode(doc.getRegulationCode());
        dto.setCategory(doc.getCategory());
        dto.setAcademicYear(doc.getAcademicYear());
        dto.setVersion(doc.getVersion());
        dto.setIsActive(doc.getIsActive());
        dto.setSummary(doc.getSummary());
        dto.setDocumentUrl(doc.getDocumentUrl());
        dto.setPublishedDate(doc.getPublishedDate());

        List<RegulatoryClauseDto> clauses = clauseRepository.findByDocumentId(doc.getId()).stream()
                .map(this::mapClauseToDto)
                .collect(Collectors.toList());
        dto.setClauses(clauses);

        return dto;
    }

    private RegulatoryClauseDto mapClauseToDto(RegulatoryClause c) {
        RegulatoryClauseDto dto = new RegulatoryClauseDto();
        dto.setId(c.getId());
        dto.setDocumentId(c.getDocument().getId());
        dto.setDocumentTitle(c.getDocument().getTitle());
        dto.setSectionNumber(c.getSectionNumber());
        dto.setClauseNumber(c.getClauseNumber());
        dto.setTitle(c.getTitle());
        dto.setContent(c.getContent());
        dto.setApplicableTo(c.getApplicableTo());
        dto.setPenaltyNotes(c.getPenaltyNotes());
        return dto;
    }
}
