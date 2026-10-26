package gov.aicte.regulaflow.repository;

import gov.aicte.regulaflow.entity.AuditEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditEventRepository extends JpaRepository<AuditEvent, Long> {
    List<AuditEvent> findAllByOrderByTimestampDesc();
    List<AuditEvent> findByEntityTypeAndEntityIdOrderByTimestampDesc(String entityType, String entityId);
    List<AuditEvent> findByActorUsernameOrderByTimestampDesc(String actorUsername);
    List<AuditEvent> findByTimestampBetweenOrderByTimestampDesc(LocalDateTime start, LocalDateTime end);
}
