package gov.aicte.regulaflow.controller;

import gov.aicte.regulaflow.dto.AuditEventDto;
import gov.aicte.regulaflow.service.AuditService;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayInputStream;
import java.util.List;

@RestController
@RequestMapping("/api/v1/audit")
public class AuditController {

    private final AuditService auditService;

    public AuditController(AuditService auditService) {
        this.auditService = auditService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'AUDITOR', 'REGULATORY_OFFICER')")
    public ResponseEntity<List<AuditEventDto>> getAuditEvents(
            @RequestParam(required = false) String entityType,
            @RequestParam(required = false) String entityId) {
        if (entityType != null && entityId != null) {
            return ResponseEntity.ok(auditService.getAuditEventsByEntity(entityType, entityId));
        }
        return ResponseEntity.ok(auditService.getAllAuditEvents());
    }

    @GetMapping("/export")
    @PreAuthorize("hasAnyRole('ADMIN', 'AUDITOR', 'REGULATORY_OFFICER')")
    public ResponseEntity<InputStreamResource> exportAuditCsv() {
        ByteArrayInputStream in = auditService.exportAuditCsv();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=regulaflow_audit_trail.csv");

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("application/csv"))
                .body(new InputStreamResource(in));
    }
}
