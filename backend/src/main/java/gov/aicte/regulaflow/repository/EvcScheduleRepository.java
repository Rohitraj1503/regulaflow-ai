package gov.aicte.regulaflow.repository;

import gov.aicte.regulaflow.entity.EvcSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface EvcScheduleRepository extends JpaRepository<EvcSchedule, Long> {
    List<EvcSchedule> findByApplicationId(Long applicationId);
    List<EvcSchedule> findByLeadOfficerId(Long officerId);
    List<EvcSchedule> findByStatus(String status);
    Optional<EvcSchedule> findFirstByApplicationIdOrderByCreatedAtDesc(Long applicationId);
}
