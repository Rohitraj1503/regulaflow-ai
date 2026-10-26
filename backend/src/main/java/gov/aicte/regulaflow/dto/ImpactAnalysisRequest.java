package gov.aicte.regulaflow.dto;

import jakarta.validation.constraints.NotNull;
import java.util.List;

public class ImpactAnalysisRequest {
    @NotNull
    private Long baseDocumentId;

    @NotNull
    private Long targetDocumentId;

    public ImpactAnalysisRequest() {}

    public Long getBaseDocumentId() { return baseDocumentId; }
    public void setBaseDocumentId(Long baseDocumentId) { this.baseDocumentId = baseDocumentId; }

    public Long getTargetDocumentId() { return targetDocumentId; }
    public void setTargetDocumentId(Long targetDocumentId) { this.targetDocumentId = targetDocumentId; }
}
