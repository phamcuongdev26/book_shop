package buy_book.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReviewStatusResponse {
    List<OrderItemInfo> reviewableItems;
    List<ReviewResponse> myReviews;
}
