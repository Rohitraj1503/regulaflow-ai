package gov.aicte.regulaflow.repository;

import gov.aicte.regulaflow.entity.WorkflowHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface WorkflowHistoryRepository extends JpaRepository<WorkflowHistory, Long> {
    List<WorkflowHistory> findByApplicationIdOrderByTimestampDesc(Long applicationId);
    List<WorkflowHistory> findByApplicationIdOrderByTimestampAsc(Long applicationId);
}
