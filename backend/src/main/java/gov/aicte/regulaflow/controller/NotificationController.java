package gov.aicte.regulaflow.controller;

import gov.aicte.regulaflow.entity.Notification;
import gov.aicte.regulaflow.security.UserPrincipal;
import gov.aicte.regulaflow.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public ResponseEntity<List<Notification>> getUserNotifications(
            @RequestParam(defaultValue = "false") boolean unreadOnly,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(notificationService.getNotificationsForUser(currentUser.getId(), unreadOnly));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(@AuthenticationPrincipal UserPrincipal currentUser) {
        Map<String, Long> res = new HashMap<>();
        res.put("unreadCount", notificationService.getUnreadCount(currentUser.getId()));
        return ResponseEntity.ok(res);
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(@AuthenticationPrincipal UserPrincipal currentUser) {
        notificationService.markAllAsRead(currentUser.getId());
        return ResponseEntity.noContent().build();
    }
}
