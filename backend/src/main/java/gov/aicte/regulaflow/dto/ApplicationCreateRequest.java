package gov.aicte.regulaflow.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ApplicationCreateRequest {
    @NotNull
    private Long institutionId;

    @NotBlank
    private String category; // NEW_INSTITUTE, EXTENSION_OF_APPROVAL, INTAKE_INCREASE, NEW_COURSE, CLOSURE

    @NotBlank
    private String academicYear;

    private String remarks;

    public ApplicationCreateRequest() {}

    public Long getInstitutionId() { return institutionId; }
    public void setInstitutionId(Long institutionId) { this.institutionId = institutionId; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getAcademicYear() { return academicYear; }
    public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
