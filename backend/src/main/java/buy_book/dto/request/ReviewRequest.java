package buy_book.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReviewRequest {

    @NotNull(message = "Vui lòng chọn sản phẩm trong đơn hàng")
    Long orderItemId;

    @NotNull(message = "Điểm đánh giá không được để trống")
    @Min(value = 1, message = "Điểm tối thiểu là 1")
    @Max(value = 5, message = "Điểm tối đa là 5")
    Integer rating;

    @Size(max = 1000, message = "Nhận xét tối đa 1000 ký tự")
    String comment;
}
