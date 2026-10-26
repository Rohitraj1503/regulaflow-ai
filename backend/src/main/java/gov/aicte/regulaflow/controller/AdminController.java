package gov.aicte.regulaflow.controller;

import gov.aicte.regulaflow.dto.AdminOverviewDto;
import gov.aicte.regulaflow.dto.SystemSettingsDto;
import gov.aicte.regulaflow.dto.UserDto;
import gov.aicte.regulaflow.entity.Institution;
import gov.aicte.regulaflow.security.UserPrincipal;
import gov.aicte.regulaflow.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final gov.aicte.regulaflow.service.InstitutionImportService institutionImportService;

    public AdminController(AdminService adminService,
                           gov.aicte.regulaflow.service.InstitutionImportService institutionImportService) {
        this.adminService = adminService;
        this.institutionImportService = institutionImportService;
    }

    @GetMapping("/overview")
    public ResponseEntity<AdminOverviewDto> getOverview() {
        return ResponseEntity.ok(adminService.getOverview());
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PostMapping("/users")
    public ResponseEntity<UserDto> createUser(
            @Valid @RequestBody UserDto request,
            @RequestParam(required = false, defaultValue = "password123") String password,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(adminService.createUser(request, password, currentUser));
    }

    @PatchMapping("/users/{id}/toggle-active")
    public ResponseEntity<UserDto> toggleUserActive(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(adminService.toggleUserActive(id, currentUser));
    }

    @PatchMapping("/users/{id}/role")
    public ResponseEntity<UserDto> updateUserRole(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        String newRole = body.get("role");
        return ResponseEntity.ok(adminService.updateUserRole(id, newRole, currentUser));
    }

    @PostMapping("/users/{id}/reset-password")
    public ResponseEntity<Map<String, String>> resetUserPassword(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        String newPassword = body != null ? body.get("newPassword") : null;
        return ResponseEntity.ok(adminService.resetUserPassword(id, newPassword, currentUser));
    }

    @GetMapping("/institutions")
    public ResponseEntity<List<Institution>> getAllInstitutions() {
        return ResponseEntity.ok(adminService.getAllInstitutions());
    }

    @PatchMapping("/institutions/{id}/status")
    public ResponseEntity<Institution> updateInstitutionStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        String status = body.get("status");
        return ResponseEntity.ok(adminService.updateInstitutionStatus(id, status, currentUser));
    }

    @GetMapping("/settings")
    public ResponseEntity<SystemSettingsDto> getSettings() {
        return ResponseEntity.ok(adminService.getSettings());
    }

    @PutMapping("/settings")
    public ResponseEntity<SystemSettingsDto> updateSettings(
            @RequestBody SystemSettingsDto updated,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(adminService.updateSettings(updated, currentUser));
    }

    @PostMapping(value = "/institutions/import/preview", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<gov.aicte.regulaflow.dto.InstitutionImportPreviewDto> previewInstitutionImport(
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        return ResponseEntity.ok(institutionImportService.previewCsv(file));
    }

    @PostMapping(value = "/institutions/import/confirm", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<gov.aicte.regulaflow.dto.InstitutionImportResultDto> confirmInstitutionImport(
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file,
            @RequestParam(value = "updateExisting", defaultValue = "false") boolean updateExisting,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(institutionImportService.confirmImport(file, updateExisting, currentUser));
    }

    @GetMapping("/institutions/import/history")
    public ResponseEntity<List<gov.aicte.regulaflow.entity.InstitutionImportHistory>> getImportHistory() {
        return ResponseEntity.ok(institutionImportService.getImportHistory());
    }
}
