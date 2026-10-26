package gov.aicte.regulaflow.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "evc_schedules")
public class EvcSchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    @Column(name = "visit_type", nullable = false, length = 50)
    private String visitType; // PHYSICAL, VIRTUAL

    @Column(name = "scheduled_date", nullable = false)
    private LocalDateTime scheduledDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lead_officer_id", nullable = false)
    private User leadOfficer;

    @Column(name = "committee_members")
    private String committeeMembers;

    @Column(nullable = false, length = 50)
    private String status; // SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED

    @Column(name = "findings_summary", columnDefinition = "TEXT")
    private String findingsSummary;

    @Column(name = "infrastructure_score")
    private Integer infrastructureScore;

    @Column(name = "faculty_score")
    private Integer facultyScore;

    @Column(name = "labs_score")
    private Integer labsScore;

    @Column(length = 50)
    private String recommendation; // RECOMMENDED, NOT_RECOMMENDED, CONDITIONAL

    @Column(name = "report_file_path", length = 500)
    private String reportFilePath;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    public EvcSchedule() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Application getApplication() { return application; }
    public void setApplication(Application application) { this.application = application; }

    public String getVisitType() { return visitType; }
    public void setVisitType(String visitType) { this.visitType = visitType; }

    public LocalDateTime getScheduledDate() { return scheduledDate; }
    public void setScheduledDate(LocalDateTime scheduledDate) { this.scheduledDate = scheduledDate; }

    public User getLeadOfficer() { return leadOfficer; }
    public void setLeadOfficer(User leadOfficer) { this.leadOfficer = leadOfficer; }

    public String getCommitteeMembers() { return committeeMembers; }
    public void setCommitteeMembers(String committeeMembers) { this.committeeMembers = committeeMembers; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getFindingsSummary() { return findingsSummary; }
    public void setFindingsSummary(String findingsSummary) { this.findingsSummary = findingsSummary; }

    public Integer getInfrastructureScore() { return infrastructureScore; }
    public void setInfrastructureScore(Integer infrastructureScore) { this.infrastructureScore = infrastructureScore; }

    public Integer getFacultyScore() { return facultyScore; }
    public void setFacultyScore(Integer facultyScore) { this.facultyScore = facultyScore; }

    public Integer getLabsScore() { return labsScore; }
    public void setLabsScore(Integer labsScore) { this.labsScore = labsScore; }

    public String getRecommendation() { return recommendation; }
    public void setRecommendation(String recommendation) { this.recommendation = recommendation; }

    public String getReportFilePath() { return reportFilePath; }
    public void setReportFilePath(String reportFilePath) { this.reportFilePath = reportFilePath; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
}
