package gov.aicte.regulaflow.repository;

import gov.aicte.regulaflow.entity.InstitutionImportHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InstitutionImportHistoryRepository extends JpaRepository<InstitutionImportHistory, Long> {
    List<InstitutionImportHistory> findAllByOrderByCreatedAtDesc();
}
