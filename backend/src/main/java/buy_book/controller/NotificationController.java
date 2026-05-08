package buy_book.controller;

import buy_book.dto.response.ApiResponse;
import buy_book.dto.response.NotificationResponse;
import buy_book.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getMyNotifications(
            @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(ApiResponse.<List<NotificationResponse>>builder()
                .code(200)
                .data(notificationService.getMyNotifications(jwt.getSubject()))
                .build());
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount(
            @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(ApiResponse.<Long>builder()
                .code(200)
                .data(notificationService.getUnreadCount(jwt.getSubject()))
                .build());
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Long id) {
        notificationService.markAsRead(jwt.getSubject(), id);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .code(200)
                .message("Đã đánh dấu đã đọc")
                .build());
    }

    @PatchMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(
            @AuthenticationPrincipal Jwt jwt) {
        notificationService.markAllAsRead(jwt.getSubject());
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .code(200)
                .message("Đã đánh dấu tất cả đã đọc")
                .build());
    }
}
