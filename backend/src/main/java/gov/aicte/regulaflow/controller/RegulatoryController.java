package gov.aicte.regulaflow.controller;

import gov.aicte.regulaflow.dto.*;
import gov.aicte.regulaflow.service.RegulatoryService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/regulatory")
public class RegulatoryController {

    private final RegulatoryService regulatoryService;

    public RegulatoryController(RegulatoryService regulatoryService) {
        this.regulatoryService = regulatoryService;
    }

    @GetMapping("/documents")
    public ResponseEntity<List<RegulatoryDocumentDto>> getRegulations() {
        return ResponseEntity.ok(regulatoryService.getActiveRegulations());
    }

    @GetMapping("/documents/all")
    public ResponseEntity<List<RegulatoryDocumentDto>> getAllRegulations() {
        return ResponseEntity.ok(regulatoryService.getAllRegulations());
    }

    @GetMapping("/documents/{id}/clauses")
    public ResponseEntity<List<RegulatoryClauseDto>> getClauses(@PathVariable Long id) {
        return ResponseEntity.ok(regulatoryService.getClausesByDocument(id));
    }

    @GetMapping("/knowledge-graph")
    public ResponseEntity<KnowledgeGraphDto> getKnowledgeGraph() {
        return ResponseEntity.ok(regulatoryService.getKnowledgeGraph());
    }

    @PostMapping("/impact-analysis")
    public ResponseEntity<ImpactAnalysisResponse> analyzeImpact(@Valid @RequestBody ImpactAnalysisRequest request) {
        return ResponseEntity.ok(regulatoryService.analyzeChangeImpact(request));
    }
}
