package buy_book.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderItemResponse {
    Long id;
    Long bookId;
    String bookTitle;
    String bookImage;
    Integer quantity;
    BigDecimal unitPrice;
    BigDecimal totalPrice;
}