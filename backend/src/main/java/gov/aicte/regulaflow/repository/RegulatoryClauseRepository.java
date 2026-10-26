package gov.aicte.regulaflow.repository;

import gov.aicte.regulaflow.entity.RegulatoryClause;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface RegulatoryClauseRepository extends JpaRepository<RegulatoryClause, Long> {
    List<RegulatoryClause> findByDocumentId(Long documentId);
    Optional<RegulatoryClause> findByClauseNumber(String clauseNumber);
    List<RegulatoryClause> findByContentContainingIgnoreCase(String keyword);
}
