package buy_book.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookRequest {

    @NotBlank(message = "Tiêu đề không được để trống")
    String title;

    String author;
    String publisher;
    Integer publishYear;
    String description;

    @NotNull(message = "Giá không được để trống")
    @Min(value = 0, message = "Giá không được âm")
    BigDecimal price;

    BigDecimal discountPrice;

    @Min(value = 0, message = "Số lượng không được âm")
    Integer stockQuantity;

    String imageUrl;
    String isbn;
    Integer pageCount;
    String language;
    Long categoryId;
}