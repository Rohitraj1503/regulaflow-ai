package gov.aicte.regulaflow.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class EvcReportRequest {
    @NotBlank
    private String findingsSummary;

    @NotNull
    private Integer infrastructureScore;

    @NotNull
    private Integer facultyScore;

    @NotNull
    private Integer labsScore;

    @NotBlank
    private String recommendation; // RECOMMENDED, NOT_RECOMMENDED, CONDITIONAL

    private String reportFilePath;

    public EvcReportRequest() {}

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
}
