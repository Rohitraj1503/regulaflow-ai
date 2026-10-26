package gov.aicte.regulaflow.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class EvidenceSubmitRequest {
    @NotNull
    private Long obligationId;

    @NotBlank
    private String documentName;

    private String filePath;
    private LocalDateTime validityStartDate;
    private LocalDateTime validityEndDate;
    private String remarks;

    public EvidenceSubmitRequest() {}

    public Long getObligationId() { return obligationId; }
    public void setObligationId(Long obligationId) { this.obligationId = obligationId; }

    public String getDocumentName() { return documentName; }
    public void setDocumentName(String documentName) { this.documentName = documentName; }

    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }

    public LocalDateTime getValidityStartDate() { return validityStartDate; }
    public void setValidityStartDate(LocalDateTime validityStartDate) { this.validityStartDate = validityStartDate; }

    public LocalDateTime getValidityEndDate() { return validityEndDate; }
    public void setValidityEndDate(LocalDateTime validityEndDate) { this.validityEndDate = validityEndDate; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
