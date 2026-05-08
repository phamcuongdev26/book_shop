package buy_book.dto.response;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookDetailResponse {

    private Long id;
    private String title;
    private String author;
    private String publisher;
    private Integer publishYear;
    private String description;
    private BigDecimal price;
    private BigDecimal discountPrice;
    private Integer stockQuantity;
    private String imageUrl;
    private String isbn;
    private Integer pageCount;
    private String language;
    private String categoryName;
    private Long categoryId;
    private String sellerName;
    private Long sellerId;
    private Double avgRating;
    private Integer totalSold;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}