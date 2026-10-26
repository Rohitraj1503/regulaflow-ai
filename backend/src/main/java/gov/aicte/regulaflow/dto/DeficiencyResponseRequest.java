package gov.aicte.regulaflow.dto;

import jakarta.validation.constraints.NotBlank;

public class DeficiencyResponseRequest {
    @NotBlank
    private String responseRemarks;

    private String complianceDocumentName;
    private String complianceDocumentPath;

    public DeficiencyResponseRequest() {}

    public String getResponseRemarks() { return responseRemarks; }
    public void setResponseRemarks(String responseRemarks) { this.responseRemarks = responseRemarks; }

    public String getComplianceDocumentName() { return complianceDocumentName; }
    public void setComplianceDocumentName(String complianceDocumentName) { this.complianceDocumentName = complianceDocumentName; }

    public String getComplianceDocumentPath() { return complianceDocumentPath; }
    public void setComplianceDocumentPath(String complianceDocumentPath) { this.complianceDocumentPath = complianceDocumentPath; }
}
