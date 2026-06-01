package buy_book.dto.request;

import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ShopReplyRequest {

    @Size(max = 1000, message = "Phản hồi tối đa 1000 ký tự")
    String shopReply;
}
