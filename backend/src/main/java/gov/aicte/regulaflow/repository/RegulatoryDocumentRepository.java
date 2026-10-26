package gov.aicte.regulaflow.repository;

import gov.aicte.regulaflow.entity.RegulatoryDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface RegulatoryDocumentRepository extends JpaRepository<RegulatoryDocument, Long> {
    Optional<RegulatoryDocument> findByRegulationCode(String regulationCode);
    List<RegulatoryDocument> findByIsActiveTrue();
    List<RegulatoryDocument> findByAcademicYear(String academicYear);
}
