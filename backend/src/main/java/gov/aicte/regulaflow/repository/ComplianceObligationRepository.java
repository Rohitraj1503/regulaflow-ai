package gov.aicte.regulaflow.repository;

import gov.aicte.regulaflow.entity.ComplianceObligation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ComplianceObligationRepository extends JpaRepository<ComplianceObligation, Long> {
    List<ComplianceObligation> findByInstitutionId(Long institutionId);
    List<ComplianceObligation> findByStatus(String status);
    Long countByStatus(String status);
}
