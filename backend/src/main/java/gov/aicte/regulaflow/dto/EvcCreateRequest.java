package gov.aicte.regulaflow.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class EvcCreateRequest {
    @NotNull
    private Long applicationId;

    @NotBlank
    private String visitType; // PHYSICAL, VIRTUAL

    @NotNull
    private LocalDateTime scheduledDate;

    @NotNull
    private Long leadOfficerId;

    private String committeeMembers;

    public EvcCreateRequest() {}

    public Long getApplicationId() { return applicationId; }
    public void setApplicationId(Long applicationId) { this.applicationId = applicationId; }

    public String getVisitType() { return visitType; }
    public void setVisitType(String visitType) { this.visitType = visitType; }

    public LocalDateTime getScheduledDate() { return scheduledDate; }
    public void setScheduledDate(LocalDateTime scheduledDate) { this.scheduledDate = scheduledDate; }

    public Long getLeadOfficerId() { return leadOfficerId; }
    public void setLeadOfficerId(Long leadOfficerId) { this.leadOfficerId = leadOfficerId; }

    public String getCommitteeMembers() { return committeeMembers; }
    public void setCommitteeMembers(String committeeMembers) { this.committeeMembers = committeeMembers; }
}
