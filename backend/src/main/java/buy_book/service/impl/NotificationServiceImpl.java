package buy_book.service.impl;

import buy_book.constant.NotificationType;
import buy_book.dto.response.NotificationResponse;
import buy_book.entity.Notification;
import buy_book.entity.User;
import buy_book.exception.AppException;
import buy_book.exception.ErrorCode;
import buy_book.repository.NotificationRepository;
import buy_book.repository.UserRepository;
import buy_book.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Override
    public void create(User user, String title, String message, NotificationType type,
                       Long relatedOrderId, String relatedOrderCode) {
        notificationRepository.save(
                Notification.builder()
                        .user(user)
                        .title(title)
                        .message(message)
                        .type(type)
                        .relatedOrderId(relatedOrderId)
                        .relatedOrderCode(relatedOrderCode)
                        .build()
        );
    }

    @Override
    public List<NotificationResponse> getMyNotifications(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public long getUnreadCount(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return notificationRepository.countByUserIdAndReadFalse(user.getId());
    }

    @Override
    @Transactional
    public void markAsRead(String username, Long id) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        Notification n = notificationRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.INTERNAL_ERROR));
        if (!n.getUser().getId().equals(user.getId()))
            throw new AppException(ErrorCode.UNAUTHORIZED);
        n.setRead(true);
        notificationRepository.save(n);
    }

    @Override
    @Transactional
    public void markAllAsRead(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        notificationRepository.markAllReadByUserId(user.getId());
    }

    private NotificationResponse toResponse(Notification n) {
        return NotificationResponse.builder()
                .id(n.getId())
                .title(n.getTitle())
                .message(n.getMessage())
                .type(n.getType())
                .read(n.isRead())
                .relatedOrderId(n.getRelatedOrderId())
                .relatedOrderCode(n.getRelatedOrderCode())
                .createdAt(n.getCreatedAt())
                .build();
    }
}
