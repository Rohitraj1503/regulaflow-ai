package gov.aicte.regulaflow.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "institution_import_history")
public class InstitutionImportHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String filename;

    @Column(name = "file_size")
    private Long fileSize;

    @Column(name = "total_rows", nullable = false)
    private Integer totalRows = 0;

    @Column(name = "inserted_rows", nullable = false)
    private Integer insertedRows = 0;

    @Column(name = "updated_rows", nullable = false)
    private Integer updatedRows = 0;

    @Column(name = "skipped_rows", nullable = false)
    private Integer skippedRows = 0;

    @Column(name = "rejected_rows", nullable = false)
    private Integer rejectedRows = 0;

    @Column(nullable = false, length = 50)
    private String status;

    @Column(name = "imported_by", length = 100)
    private String importedBy;

    @Column(name = "error_summary", columnDefinition = "TEXT")
    private String errorSummary;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public InstitutionImportHistory() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFilename() { return filename; }
    public void setFilename(String filename) { this.filename = filename; }

    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }

    public Integer getTotalRows() { return totalRows; }
    public void setTotalRows(Integer totalRows) { this.totalRows = totalRows; }

    public Integer getInsertedRows() { return insertedRows; }
    public void setInsertedRows(Integer insertedRows) { this.insertedRows = insertedRows; }

    public Integer getUpdatedRows() { return updatedRows; }
    public void setUpdatedRows(Integer updatedRows) { this.updatedRows = updatedRows; }

    public Integer getSkippedRows() { return skippedRows; }
    public void setSkippedRows(Integer skippedRows) { this.skippedRows = skippedRows; }

    public Integer getRejectedRows() { return rejectedRows; }
    public void setRejectedRows(Integer rejectedRows) { this.rejectedRows = rejectedRows; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getImportedBy() { return importedBy; }
    public void setImportedBy(String importedBy) { this.importedBy = importedBy; }

    public String getErrorSummary() { return errorSummary; }
    public void setErrorSummary(String errorSummary) { this.errorSummary = errorSummary; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
