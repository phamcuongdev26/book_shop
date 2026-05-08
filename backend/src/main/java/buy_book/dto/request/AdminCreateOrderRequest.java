package buy_book.dto.request;

import buy_book.constant.PaymentMethod;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AdminCreateOrderRequest {

    @NotBlank(message = "Username không được để trống")
    String username;

    @NotEmpty(message = "Đơn hàng phải có ít nhất 1 sản phẩm")
    @Valid
    List<AdminCreateOrderItemRequest> items;

    @NotBlank(message = "Địa chỉ giao hàng không được để trống")
    String shippingAddress;

    @NotBlank(message = "Tên người nhận không được để trống")
    String recipientName;

    @NotBlank(message = "Số điện thoại không được để trống")
    String recipientPhone;

    @NotNull(message = "Phương thức thanh toán không được để trống")
    PaymentMethod paymentMethod;

    String note;
}
