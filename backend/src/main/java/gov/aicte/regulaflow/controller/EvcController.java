package gov.aicte.regulaflow.controller;

import gov.aicte.regulaflow.dto.EvcCreateRequest;
import gov.aicte.regulaflow.dto.EvcReportRequest;
import gov.aicte.regulaflow.dto.EvcScheduleDto;
import gov.aicte.regulaflow.security.UserPrincipal;
import gov.aicte.regulaflow.service.EvcService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/evc")
public class EvcController {

    private final EvcService evcService;

    public EvcController(EvcService evcService) {
        this.evcService = evcService;
    }

    @GetMapping
    public ResponseEntity<List<EvcScheduleDto>> getAllEvcSchedules() {
        return ResponseEntity.ok(evcService.getAllEvcSchedules());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EvcScheduleDto> getEvcById(@PathVariable Long id) {
        return ResponseEntity.ok(evcService.getEvcById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('REGULATORY_OFFICER', 'ADMIN')")
    public ResponseEntity<EvcScheduleDto> scheduleEvc(
            @Valid @RequestBody EvcCreateRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(evcService.scheduleEvc(request, currentUser));
    }

    @PostMapping("/{id}/report")
    @PreAuthorize("hasAnyRole('EVC_OFFICER', 'ADMIN')")
    public ResponseEntity<EvcScheduleDto> submitReport(
            @PathVariable Long id,
            @Valid @RequestBody EvcReportRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(evcService.submitEvcReport(id, request, currentUser));
    }
}
