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
public class CartItemResponse {
    Long cartItemId;
    Long bookId;
    String bookTitle;
    String bookImage;
    BigDecimal unitPrice;
    Integer quantity;
    BigDecimal totalPrice;
}