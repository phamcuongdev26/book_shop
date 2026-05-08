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
public class AddToCartRequest {

    @NotNull(message = "BookId không được để trống")
    Long bookId;

    @Min(value = 1, message = "Số lượng tối thiểu là 1")
    int quantity;
}