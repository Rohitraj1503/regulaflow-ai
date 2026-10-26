package gov.aicte.regulaflow.service;

import gov.aicte.regulaflow.entity.Notification;
import gov.aicte.regulaflow.entity.User;
import gov.aicte.regulaflow.exception.ResourceNotFoundException;
import gov.aicte.regulaflow.repository.NotificationRepository;
import gov.aicte.regulaflow.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Notification sendNotification(Long userId, String title, String message, String type, String urgency, String referenceId, String referenceType) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);
        notification.setUrgency(urgency != null ? urgency : "INFO");
        notification.setIsRead(false);
        notification.setReferenceId(referenceId);
        notification.setReferenceType(referenceType);

        return notificationRepository.save(notification);
    }

    public List<Notification> getNotificationsForUser(Long userId, boolean unreadOnly) {
        if (unreadOnly) {
            return notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
        }
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    @Transactional
    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", "id", notificationId));
        notification.setIsRead(true);
        notificationRepository.save(notification);
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        List<Notification> unread = notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
        unread.forEach(n -> n.setIsRead(true));
        notificationRepository.saveAll(unread);
    }
}
