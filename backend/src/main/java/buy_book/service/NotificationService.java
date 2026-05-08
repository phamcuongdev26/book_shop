package buy_book.service;

import buy_book.constant.NotificationType;
import buy_book.dto.response.NotificationResponse;
import buy_book.entity.User;

import java.util.List;

public interface NotificationService {
    void create(User user, String title, String message, NotificationType type,
                Long relatedOrderId, String relatedOrderCode);
    List<NotificationResponse> getMyNotifications(String username);
    long getUnreadCount(String username);
    void markAsRead(String username, Long id);
    void markAllAsRead(String username);
}
