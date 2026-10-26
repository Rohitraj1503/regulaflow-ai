package gov.aicte.regulaflow.repository;

import gov.aicte.regulaflow.entity.Deficiency;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DeficiencyRepository extends JpaRepository<Deficiency, Long> {
    List<Deficiency> findByApplicationId(Long applicationId);
    List<Deficiency> findByApplicationIdAndStatus(Long applicationId, String status);
    Long countByStatus(String status);
}
