package buy_book.dto.response;

import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookSummaryResponse {

    private Long id;
    private String title;
    private String author;
    private String publisher;
    private BigDecimal price;
    private BigDecimal discountPrice;
    private String imageUrl;
    private String categoryName;
    private Double avgRating;
    private Integer totalSold;
    private Integer stockQuantity;
    private String status;
}