package buy_book.dto.response;

import buy_book.constant.NotificationType;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {
    private Long id;
    private String title;
    private String message;
    private NotificationType type;
    private boolean read;
    private Long relatedOrderId;
    private String relatedOrderCode;
    private LocalDateTime createdAt;
}
