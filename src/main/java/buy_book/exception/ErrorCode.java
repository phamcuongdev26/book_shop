package buy_book.exception;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public enum ErrorCode {

    // Auth
    USER_NOT_FOUND(1001, "User không tồn tại", HttpStatus.NOT_FOUND),
    EMAIL_ALREADY_EXISTS(1002, "Email đã tồn tại", HttpStatus.CONFLICT),
    USERNAME_ALREADY_EXISTS(1003, "Username đã tồn tại", HttpStatus.CONFLICT),
    WRONG_PASSWORD(1004, "Mật khẩu không đúng", HttpStatus.UNAUTHORIZED),
    UNAUTHENTICATED(1005, "Chưa đăng nhập", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1006, "Bạn không có quyền thực hiện thao tác này", HttpStatus.FORBIDDEN),
    ACCOUNT_LOCKED(1007, "Tài khoản đã bị khóa", HttpStatus.FORBIDDEN),

    // Validation
    INVALID_EMAIL(2001, "Email không hợp lệ", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD(2002, "Mật khẩu phải ít nhất 6 ký tự", HttpStatus.BAD_REQUEST),

    // Book & Category
    BOOK_NOT_FOUND(3001, "Sách không tồn tại", HttpStatus.NOT_FOUND),
    CATEGORY_NOT_FOUND(3002, "Danh mục không tồn tại", HttpStatus.NOT_FOUND),
    BOOK_INACTIVE(3003, "Sách đã ngừng bán", HttpStatus.BAD_REQUEST),
    OUT_OF_STOCK(3004, "Sách không đủ tồn kho", HttpStatus.BAD_REQUEST),

    // Cart
    CART_NOT_FOUND(4001, "Giỏ hàng không tồn tại", HttpStatus.NOT_FOUND),
    CART_ITEM_NOT_FOUND(4002, "Không tìm thấy sản phẩm trong giỏ hàng", HttpStatus.NOT_FOUND),

    // Order
    ORDER_NOT_FOUND(5001, "Đơn hàng không tồn tại", HttpStatus.NOT_FOUND),
    ORDER_CANNOT_CANCEL(5002, "Đơn hàng không thể huỷ ở trạng thái hiện tại", HttpStatus.BAD_REQUEST),
    ORDER_STATUS_INVALID(5003, "Chuyển trạng thái không hợp lệ", HttpStatus.BAD_REQUEST),

    // Server
    INTERNAL_ERROR(9999, "Lỗi hệ thống", HttpStatus.INTERNAL_SERVER_ERROR);

    int code;
    String message;
    HttpStatus httpStatus;
}