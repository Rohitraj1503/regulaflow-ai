package gov.aicte.regulaflow.controller;

import gov.aicte.regulaflow.dto.ComplianceEvidenceDto;
import gov.aicte.regulaflow.dto.ComplianceObligationDto;
import gov.aicte.regulaflow.dto.EvidenceSubmitRequest;
import gov.aicte.regulaflow.dto.EvidenceVerificationRequest;
import gov.aicte.regulaflow.security.UserPrincipal;
import gov.aicte.regulaflow.service.ComplianceService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/compliance")
public class ComplianceController {

    private final ComplianceService complianceService;

    public ComplianceController(ComplianceService complianceService) {
        this.complianceService = complianceService;
    }

    @GetMapping("/obligations")
    public ResponseEntity<List<ComplianceObligationDto>> getObligations(
            @RequestParam(required = false) Long institutionId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(complianceService.getObligations(currentUser, institutionId));
    }

    @PostMapping("/evidence")
    @PreAuthorize("hasAnyRole('INSTITUTION_ADMIN', 'ADMIN')")
    public ResponseEntity<ComplianceEvidenceDto> submitEvidence(
            @Valid @RequestBody EvidenceSubmitRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(complianceService.submitEvidence(request, currentUser));
    }

    @PostMapping("/evidence/{evidenceId}/verify")
    @PreAuthorize("hasAnyRole('COMPLIANCE_OFFICER', 'REGULATORY_OFFICER', 'ADMIN')")
    public ResponseEntity<ComplianceEvidenceDto> verifyEvidence(
            @PathVariable Long evidenceId,
            @Valid @RequestBody EvidenceVerificationRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(complianceService.verifyEvidence(evidenceId, request, currentUser));
    }
}
