package gov.aicte.regulaflow.dto;

import java.time.LocalDateTime;
import java.util.List;

public class ApplicationDto {
    private Long id;
    private String applicationNumber;
    private Long institutionId;
    private String institutionName;
    private String institutionAicteId;
    private String institutionRegion;
    private String category;
    private String academicYear;
    private String status;
    private Long assignedOfficerId;
    private String assignedOfficerName;
    private LocalDateTime submissionDate;
    private LocalDateTime slaDueDate;
    private LocalDateTime approvalDate;
    private String remarks;
    private Long daysInCurrentStage;
    private Long totalAgeingDays;
    private Boolean isSlaBreached;
    private List<DeficiencyDto> deficiencies;
    private List<ApplicationDocumentDto> documents;

    public ApplicationDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getApplicationNumber() { return applicationNumber; }
    public void setApplicationNumber(String applicationNumber) { this.applicationNumber = applicationNumber; }

    public Long getInstitutionId() { return institutionId; }
    public void setInstitutionId(Long institutionId) { this.institutionId = institutionId; }

    public String getInstitutionName() { return institutionName; }
    public void setInstitutionName(String institutionName) { this.institutionName = institutionName; }

    public String getInstitutionAicteId() { return institutionAicteId; }
    public void setInstitutionAicteId(String institutionAicteId) { this.institutionAicteId = institutionAicteId; }

    public String getInstitutionRegion() { return institutionRegion; }
    public void setInstitutionRegion(String institutionRegion) { this.institutionRegion = institutionRegion; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getAcademicYear() { return academicYear; }
    public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Long getAssignedOfficerId() { return assignedOfficerId; }
    public void setAssignedOfficerId(Long assignedOfficerId) { this.assignedOfficerId = assignedOfficerId; }

    public String getAssignedOfficerName() { return assignedOfficerName; }
    public void setAssignedOfficerName(String assignedOfficerName) { this.assignedOfficerName = assignedOfficerName; }

    public LocalDateTime getSubmissionDate() { return submissionDate; }
    public void setSubmissionDate(LocalDateTime submissionDate) { this.submissionDate = submissionDate; }

    public LocalDateTime getSlaDueDate() { return slaDueDate; }
    public void setSlaDueDate(LocalDateTime slaDueDate) { this.slaDueDate = slaDueDate; }

    public LocalDateTime getApprovalDate() { return approvalDate; }
    public void setApprovalDate(LocalDateTime approvalDate) { this.approvalDate = approvalDate; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public Long getDaysInCurrentStage() { return daysInCurrentStage; }
    public void setDaysInCurrentStage(Long daysInCurrentStage) { this.daysInCurrentStage = daysInCurrentStage; }

    public Long getTotalAgeingDays() { return totalAgeingDays; }
    public void setTotalAgeingDays(Long totalAgeingDays) { this.totalAgeingDays = totalAgeingDays; }

    public Boolean getIsSlaBreached() { return isSlaBreached; }
    public void setIsSlaBreached(Boolean isSlaBreached) { this.isSlaBreached = isSlaBreached; }

    public List<DeficiencyDto> getDeficiencies() { return deficiencies; }
    public void setDeficiencies(List<DeficiencyDto> deficiencies) { this.deficiencies = deficiencies; }

    public List<ApplicationDocumentDto> getDocuments() { return documents; }
    public void setDocuments(List<ApplicationDocumentDto> documents) { this.documents = documents; }
}
