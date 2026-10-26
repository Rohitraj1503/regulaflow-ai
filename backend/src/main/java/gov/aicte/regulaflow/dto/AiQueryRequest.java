package gov.aicte.regulaflow.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public class AiQueryRequest {
    @NotBlank
    private String query;

    private String categoryFilter;
    private String academicYear;

    public AiQueryRequest() {}

    public String getQuery() { return query; }
    public void setQuery(String query) { this.query = query; }

    public String getCategoryFilter() { return categoryFilter; }
    public void setCategoryFilter(String categoryFilter) { this.categoryFilter = categoryFilter; }

    public String getAcademicYear() { return academicYear; }
    public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }
}
