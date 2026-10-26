package gov.aicte.regulaflow.controller;

import gov.aicte.regulaflow.dto.AiQueryRequest;
import gov.aicte.regulaflow.dto.AiQueryResponse;
import gov.aicte.regulaflow.service.AiIntegrationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/ai")
public class AiController {

    private final AiIntegrationService aiIntegrationService;

    public AiController(AiIntegrationService aiIntegrationService) {
        this.aiIntegrationService = aiIntegrationService;
    }

    @PostMapping("/query")
    public ResponseEntity<AiQueryResponse> queryCopilot(@Valid @RequestBody AiQueryRequest request) {
        return ResponseEntity.ok(aiIntegrationService.queryRegulatoryCopilot(request));
    }
}
