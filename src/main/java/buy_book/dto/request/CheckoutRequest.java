package buy_book.dto.request;

import buy_book.constant.PaymentMethod;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CheckoutRequest {

    @NotBlank(message = "Địa chỉ giao hàng không được để trống")
    String shippingAddress;

    @NotBlank(message = "Tên người nhận không được để trống")
    String recipientName;

    @NotBlank(message = "Số điện thoại không được để trống")
    String recipientPhone;

    @NotNull(message = "Phương thức thanh toán không được để trống")
    PaymentMethod paymentMethod;

    String note;

    // Nếu null/rỗng → checkout toàn bộ giỏ; nếu có → chỉ checkout những item được chọn
    List<Long> selectedItemIds;
}