package buy_book.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AdminCreateOrderItemRequest {

    @NotNull(message = "bookId không được để trống")
    Long bookId;

    @NotNull
    @Min(value = 1, message = "Số lượng phải ≥ 1")
    Integer quantity;
}
