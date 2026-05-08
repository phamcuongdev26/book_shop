package buy_book.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SkippedItemInfo {
    Long cartItemId;
    Long bookId;
    String bookTitle;
    String reason;
}
