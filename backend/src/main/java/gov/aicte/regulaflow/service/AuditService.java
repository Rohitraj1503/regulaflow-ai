package gov.aicte.regulaflow.service;

import gov.aicte.regulaflow.dto.AuditEventDto;
import gov.aicte.regulaflow.entity.AuditEvent;
import gov.aicte.regulaflow.repository.AuditEventRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuditService {

    private final AuditEventRepository auditEventRepository;

    public AuditService(AuditEventRepository auditEventRepository) {
        this.auditEventRepository = auditEventRepository;
    }

    @Transactional
    public void recordEvent(String actorUsername, String actorRole, String action, String entityType, String entityId, String previousState, String newState, String ipAddress) {
        AuditEvent event = new AuditEvent();
        event.setActorUsername(actorUsername != null ? actorUsername : "SYSTEM");
        event.setActorRole(actorRole != null ? actorRole : "ROLE_SYSTEM");
        event.setAction(action);
        event.setEntityType(entityType);
        event.setEntityId(entityId);
        event.setPreviousState(previousState);
        event.setNewState(newState);
        if (ipAddress != null && ipAddress.length() > 45) {
            ipAddress = ipAddress.substring(0, 45);
        }
        event.setIpAddress(ipAddress != null ? ipAddress : "127.0.0.1");

        auditEventRepository.save(event);
    }

    public List<AuditEventDto> getAllAuditEvents() {
        return auditEventRepository.findAllByOrderByTimestampDesc().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<AuditEventDto> getAuditEventsByEntity(String entityType, String entityId) {
        return auditEventRepository.findByEntityTypeAndEntityIdOrderByTimestampDesc(entityType, entityId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public ByteArrayInputStream exportAuditCsv() {
        List<AuditEvent> events = auditEventRepository.findAllByOrderByTimestampDesc();
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PrintWriter writer = new PrintWriter(out);

        writer.println("ID,Timestamp,Actor Username,Actor Role,Action,Entity Type,Entity ID,Previous State,New State,IP Address");

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        for (AuditEvent event : events) {
            String ts = event.getTimestamp() != null ? event.getTimestamp().format(formatter) : "";
            writer.printf("%d,\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\"%n",
                    event.getId(),
                    ts,
                    escapeCsv(event.getActorUsername()),
                    escapeCsv(event.getActorRole()),
                    escapeCsv(event.getAction()),
                    escapeCsv(event.getEntityType()),
                    escapeCsv(event.getEntityId()),
                    escapeCsv(event.getPreviousState()),
                    escapeCsv(event.getNewState()),
                    escapeCsv(event.getIpAddress())
            );
        }

        writer.flush();
        return new ByteArrayInputStream(out.toByteArray());
    }

    private String escapeCsv(String value) {
        if (value == null) return "";
        return value.replace("\"", "\"\"");
    }

    private AuditEventDto mapToDto(AuditEvent event) {
        AuditEventDto dto = new AuditEventDto();
        dto.setId(event.getId());
        dto.setActorUsername(event.getActorUsername());
        dto.setActorRole(event.getActorRole());
        dto.setAction(event.getAction());
        dto.setEntityType(event.getEntityType());
        dto.setEntityId(event.getEntityId());
        dto.setPreviousState(event.getPreviousState());
        dto.setNewState(event.getNewState());
        dto.setIpAddress(event.getIpAddress());
        dto.setTimestamp(event.getTimestamp());
        return dto;
    }
}
