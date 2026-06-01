package buy_book.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReviewStatusResponse {
    boolean canReview;
    boolean hasPurchased;
    ReviewResponse myReview;
}
