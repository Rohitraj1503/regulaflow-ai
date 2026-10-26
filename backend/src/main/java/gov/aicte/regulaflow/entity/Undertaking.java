package gov.aicte.regulaflow.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "undertakings")
public class Undertaking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "institution_id", nullable = false)
    private Institution institution;

    @Column(nullable = false)
    private String title;

    @Column(name = "declaration_text", nullable = false, columnDefinition = "TEXT")
    private String declarationText;

    @Column(name = "authorized_signatory_name", nullable = false, length = 150)
    private String authorizedSignatoryName;

    @Column(name = "signatory_designation", nullable = false, length = 100)
    private String signatoryDesignation;

    @Column(name = "ip_address", length = 50)
    private String ipAddress;

    @Column(name = "agreed_at")
    private LocalDateTime agreedAt = LocalDateTime.now();

    public Undertaking() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Application getApplication() { return application; }
    public void setApplication(Application application) { this.application = application; }

    public Institution getInstitution() { return institution; }
    public void setInstitution(Institution institution) { this.institution = institution; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDeclarationText() { return declarationText; }
    public void setDeclarationText(String declarationText) { this.declarationText = declarationText; }

    public String getAuthorizedSignatoryName() { return authorizedSignatoryName; }
    public void setAuthorizedSignatoryName(String authorizedSignatoryName) { this.authorizedSignatoryName = authorizedSignatoryName; }

    public String getSignatoryDesignation() { return signatoryDesignation; }
    public void setSignatoryDesignation(String signatoryDesignation) { this.signatoryDesignation = signatoryDesignation; }

    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }

    public LocalDateTime getAgreedAt() { return agreedAt; }
    public void setAgreedAt(LocalDateTime agreedAt) { this.agreedAt = agreedAt; }
}
