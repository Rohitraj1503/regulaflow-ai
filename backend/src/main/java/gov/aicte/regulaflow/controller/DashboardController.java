package gov.aicte.regulaflow.controller;

import gov.aicte.regulaflow.dto.DashboardMetricsDto;
import gov.aicte.regulaflow.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/metrics")
    public ResponseEntity<DashboardMetricsDto> getDashboardMetrics() {
        return ResponseEntity.ok(dashboardService.getDashboardMetrics());
    }
}
