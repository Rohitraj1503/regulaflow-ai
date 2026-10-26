package gov.aicte.regulaflow.controller;

import gov.aicte.regulaflow.dto.*;
import gov.aicte.regulaflow.security.UserPrincipal;
import gov.aicte.regulaflow.service.ApplicationWorkflowService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/applications")
public class ApplicationController {

    private final ApplicationWorkflowService workflowService;

    public ApplicationController(ApplicationWorkflowService workflowService) {
        this.workflowService = workflowService;
    }

    @GetMapping
    public ResponseEntity<List<ApplicationDto>> getApplications(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String category,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(workflowService.getApplications(currentUser, status, category));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApplicationDto> getApplicationById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(workflowService.getApplicationById(id, currentUser));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('INSTITUTION_ADMIN', 'ADMIN')")
    public ResponseEntity<ApplicationDto> createApplication(
            @Valid @RequestBody ApplicationCreateRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(workflowService.createApplication(request, currentUser));
    }

    @PostMapping("/{id}/submit")
    @PreAuthorize("hasAnyRole('INSTITUTION_ADMIN', 'ADMIN')")
    public ResponseEntity<ApplicationDto> submitApplication(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(workflowService.submitApplication(id, currentUser));
    }

    @PostMapping("/{id}/transition")
    @PreAuthorize("hasAnyRole('REGULATORY_OFFICER', 'SCRUTINY_OFFICER', 'EVC_OFFICER', 'ADMIN')")
    public ResponseEntity<ApplicationDto> transitionWorkflow(
            @PathVariable Long id,
            @Valid @RequestBody WorkflowTransitionRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(workflowService.transitionWorkflow(id, request, currentUser));
    }

    @GetMapping("/{id}/history")
    public ResponseEntity<List<WorkflowHistoryDto>> getApplicationHistory(@PathVariable Long id) {
        return ResponseEntity.ok(workflowService.getApplicationHistory(id));
    }

    @GetMapping("/{id}/deficiencies")
    public ResponseEntity<List<DeficiencyDto>> getApplicationDeficiencies(@PathVariable Long id) {
        return ResponseEntity.ok(workflowService.getApplicationDeficiencies(id));
    }

    @PostMapping("/deficiencies/{deficiencyId}/respond")
    @PreAuthorize("hasAnyRole('INSTITUTION_ADMIN', 'ADMIN')")
    public ResponseEntity<DeficiencyDto> respondToDeficiency(
            @PathVariable Long deficiencyId,
            @Valid @RequestBody DeficiencyResponseRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(workflowService.respondToDeficiency(deficiencyId, request, currentUser));
    }

    @PostMapping("/{id}/documents")
    public ResponseEntity<ApplicationDocumentDto> registerDocument(
            @PathVariable Long id,
            @RequestParam String documentType,
            @RequestParam String documentName,
            @RequestParam(required = false) String filePath,
            @RequestParam(required = false) Long fileSize,
            @RequestParam(required = false) String checksum,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(workflowService.registerDocument(id, documentType, documentName, filePath, fileSize, checksum, currentUser));
    }

    @GetMapping("/{id}/documents")
    public ResponseEntity<List<ApplicationDocumentDto>> getApplicationDocuments(@PathVariable Long id) {
        return ResponseEntity.ok(workflowService.getApplicationDocuments(id));
    }

    @GetMapping({"/officers", "/eligible-officers"})
    @PreAuthorize("hasAnyRole('REGULATORY_OFFICER', 'SCRUTINY_OFFICER', 'EVC_OFFICER', 'ADMIN')")
    public ResponseEntity<List<OfficerDto>> getEligibleOfficers() {
        return ResponseEntity.ok(workflowService.getEligibleOfficers());
    }

    @PostMapping("/{id}/assign")
    @PreAuthorize("hasAnyRole('REGULATORY_OFFICER', 'ADMIN')")
    public ResponseEntity<ApplicationDto> assignOfficer(
            @PathVariable Long id,
            @RequestBody java.util.Map<String, Long> body,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        Long officerId = body.get("officerId");
        return ResponseEntity.ok(workflowService.assignOfficer(id, officerId, currentUser));
    }

    @PostMapping("/{id}/documents/{docId}/verify")
    @PreAuthorize("hasAnyRole('SCRUTINY_OFFICER', 'REGULATORY_OFFICER', 'ADMIN')")
    public ResponseEntity<ApplicationDocumentDto> verifyDocument(
            @PathVariable Long id,
            @PathVariable Long docId,
            @RequestBody java.util.Map<String, String> body,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        String status = body.get("status");
        String deficiencyNotes = body.get("deficiencyNotes");
        return ResponseEntity.ok(workflowService.verifyDocument(id, docId, status, deficiencyNotes, currentUser));
    }

    @PostMapping(value = "/{id}/documents/upload", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('INSTITUTION_ADMIN', 'ADMIN')")
    public ResponseEntity<ApplicationDocumentDto> uploadDocument(
            @PathVariable Long id,
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file,
            @RequestParam(value = "documentType", required = false) String documentType,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(workflowService.uploadDocument(id, file, documentType, currentUser));
    }

    @GetMapping("/{id}/documents/{docId}/download")
    public ResponseEntity<org.springframework.core.io.Resource> downloadDocument(
            @PathVariable Long id,
            @PathVariable Long docId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        org.springframework.core.io.Resource resource = workflowService.getDocumentResource(id, docId, currentUser);
        return ResponseEntity.ok()
                .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
}
