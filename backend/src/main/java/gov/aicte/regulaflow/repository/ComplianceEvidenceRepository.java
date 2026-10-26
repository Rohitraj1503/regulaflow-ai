package gov.aicte.regulaflow.repository;

import gov.aicte.regulaflow.entity.ComplianceEvidence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ComplianceEvidenceRepository extends JpaRepository<ComplianceEvidence, Long> {
    List<ComplianceEvidence> findByObligationId(Long obligationId);
}
