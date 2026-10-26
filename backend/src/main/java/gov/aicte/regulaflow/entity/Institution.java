package gov.aicte.regulaflow.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "institutions")
public class Institution {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "aicte_id", nullable = false, unique = true, length = 50)
    private String aicteId;

    @Column(nullable = false)
    private String name;

    @Column(name = "institute_type", nullable = false, length = 100)
    private String instituteType;

    @Column(length = 100)
    private String region;

    @Column(nullable = false, length = 100)
    private String state;

    @Column(length = 100)
    private String district;

    @Column(nullable = false, length = 100)
    private String city;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(length = 20)
    private String pincode;

    @Column(name = "established_year")
    private Integer establishedYear;

    @Column(name = "nirf_rank")
    private Integer nirfRank;

    @Column(name = "accreditation_status", length = 50)
    private String accreditationStatus;

    @Column(name = "campus_area_acres", precision = 8, scale = 2)
    private BigDecimal campusAreaAcres;

    @Column(name = "built_up_area_sqm", precision = 10, scale = 2)
    private BigDecimal builtUpAreaSqm;

    @Column(length = 50)
    private String status = "ACTIVE";

    @Column(name = "aicte_approval_status", length = 50)
    private String aicteApprovalStatus;

    @Column(name = "academic_year", length = 20)
    private String academicYear;

    @Column(name = "official_website", length = 255)
    private String officialWebsite;

    @Column(name = "source_url", length = 500)
    private String sourceUrl;

    @Column(name = "source_name", length = 255)
    private String sourceName;

    @Column(name = "source_publication_date")
    private java.time.LocalDate sourcePublicationDate;

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;

    @Column(name = "data_quality_status", length = 50)
    private String dataQualityStatus = "VERIFIED";

    @Column(name = "import_batch_id")
    private Long importBatchId;

    @Column(name = "programmes_offered", columnDefinition = "TEXT")
    private String programmesOffered;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Institution() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getAicteId() { return aicteId; }
    public void setAicteId(String aicteId) { this.aicteId = aicteId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getInstituteType() { return instituteType; }
    public void setInstituteType(String instituteType) { this.instituteType = instituteType; }

    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public Integer getEstablishedYear() { return establishedYear; }
    public void setEstablishedYear(Integer establishedYear) { this.establishedYear = establishedYear; }

    public Integer getNirfRank() { return nirfRank; }
    public void setNirfRank(Integer nirfRank) { this.nirfRank = nirfRank; }

    public String getAccreditationStatus() { return accreditationStatus; }
    public void setAccreditationStatus(String accreditationStatus) { this.accreditationStatus = accreditationStatus; }

    public BigDecimal getCampusAreaAcres() { return campusAreaAcres; }
    public void setCampusAreaAcres(BigDecimal campusAreaAcres) { this.campusAreaAcres = campusAreaAcres; }

    public BigDecimal getBuiltUpAreaSqm() { return builtUpAreaSqm; }
    public void setBuiltUpAreaSqm(BigDecimal builtUpAreaSqm) { this.builtUpAreaSqm = builtUpAreaSqm; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getOfficialWebsite() { return officialWebsite; }
    public void setOfficialWebsite(String officialWebsite) { this.officialWebsite = officialWebsite; }

    public String getSourceUrl() { return sourceUrl; }
    public void setSourceUrl(String sourceUrl) { this.sourceUrl = sourceUrl; }

    public LocalDateTime getVerifiedAt() { return verifiedAt; }
    public void setVerifiedAt(LocalDateTime verifiedAt) { this.verifiedAt = verifiedAt; }

    public String getProgrammesOffered() { return programmesOffered; }
    public void setProgrammesOffered(String programmesOffered) { this.programmesOffered = programmesOffered; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }

    public String getAicteApprovalStatus() { return aicteApprovalStatus; }
    public void setAicteApprovalStatus(String aicteApprovalStatus) { this.aicteApprovalStatus = aicteApprovalStatus; }

    public String getAcademicYear() { return academicYear; }
    public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }

    public String getSourceName() { return sourceName; }
    public void setSourceName(String sourceName) { this.sourceName = sourceName; }

    public java.time.LocalDate getSourcePublicationDate() { return sourcePublicationDate; }
    public void setSourcePublicationDate(java.time.LocalDate sourcePublicationDate) { this.sourcePublicationDate = sourcePublicationDate; }

    public String getDataQualityStatus() { return dataQualityStatus; }
    public void setDataQualityStatus(String dataQualityStatus) { this.dataQualityStatus = dataQualityStatus; }

    public Long getImportBatchId() { return importBatchId; }
    public void setImportBatchId(Long importBatchId) { this.importBatchId = importBatchId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
