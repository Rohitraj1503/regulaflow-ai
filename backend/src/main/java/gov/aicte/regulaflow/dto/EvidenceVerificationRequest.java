package gov.aicte.regulaflow.dto;

import jakarta.validation.constraints.NotBlank;

public class EvidenceVerificationRequest {
    @NotBlank
    private String status; // APPROVED, REJECTED

    private String remarks;

    public EvidenceVerificationRequest() {}

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
