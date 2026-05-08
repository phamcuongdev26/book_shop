package buy_book.controller;

import buy_book.dto.request.AddToCartRequest;
import buy_book.dto.request.CheckoutRequest;
import buy_book.dto.response.*;
import buy_book.service.CartService;
import buy_book.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CartAndOrderController {

    private final CartService cartService;
    private final OrderService orderService;

    // ==================== CART ====================

    @GetMapping("/api/cart")
    public ResponseEntity<ApiResponse<CartResponse>> getCart(
            @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(ApiResponse.<CartResponse>builder()
                .code(200)
                .data(cartService.getCart(jwt.getSubject()))
                .build());
    }

    @PostMapping("/api/cart")
    public ResponseEntity<ApiResponse<CartResponse>> addToCart(
            @Valid @RequestBody AddToCartRequest request,
            @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(ApiResponse.<CartResponse>builder()
                .code(200)
                .message("Thêm vào giỏ hàng thành công")
                .data(cartService.addToCart(jwt.getSubject(), request))
                .build());
    }

    @PutMapping("/api/cart/{cartItemId}")
    public ResponseEntity<ApiResponse<CartResponse>> updateCartItem(
            @PathVariable Long cartItemId,
            @RequestParam int quantity,
            @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(ApiResponse.<CartResponse>builder()
                .code(200)
                .message("Cập nhật giỏ hàng thành công")
                .data(cartService.updateCartItem(jwt.getSubject(), cartItemId, quantity))
                .build());
    }

    @DeleteMapping("/api/cart/{cartItemId}")
    public ResponseEntity<ApiResponse<Void>> removeCartItem(
            @PathVariable Long cartItemId,
            @AuthenticationPrincipal Jwt jwt) {
        cartService.removeCartItem(jwt.getSubject(), cartItemId);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .code(200)
                .message("Xóa sản phẩm khỏi giỏ hàng thành công")
                .build());
    }

    @DeleteMapping("/api/cart")
    public ResponseEntity<ApiResponse<Void>> clearCart(
            @AuthenticationPrincipal Jwt jwt) {
        cartService.clearCart(jwt.getSubject());
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .code(200)
                .message("Xóa giỏ hàng thành công")
                .build());
    }

    // ==================== ORDER ====================

    @PostMapping("/api/orders/checkout")
    public ResponseEntity<ApiResponse<OrderResponse>> checkout(
            @Valid @RequestBody CheckoutRequest request,
            @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(ApiResponse.<OrderResponse>builder()
                .code(200)
                .message("Đặt hàng thành công")
                .data(orderService.checkout(jwt.getSubject(), request))
                .build());
    }

    @PostMapping("/api/orders/checkout-all")
    public ResponseEntity<ApiResponse<CheckoutAllResponse>> checkoutAll(
            @Valid @RequestBody CheckoutRequest request,
            @AuthenticationPrincipal Jwt jwt) {
        CheckoutAllResponse result = orderService.checkoutAll(jwt.getSubject(), request);
        String message = result.getSkippedItems().isEmpty()
                ? "Đặt hàng thành công"
                : "Đặt hàng thành công (" + result.getSkippedItems().size() + " sản phẩm bị bỏ qua)";
        return ResponseEntity.ok(ApiResponse.<CheckoutAllResponse>builder()
                .code(200)
                .message(message)
                .data(result)
                .build());
    }

    @GetMapping("/api/orders")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getOrderHistory(
            @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(ApiResponse.<List<OrderResponse>>builder()
                .code(200)
                .data(orderService.getOrderHistory(jwt.getSubject()))
                .build());
    }

    @GetMapping("/api/orders/{orderId}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderDetail(
            @PathVariable Long orderId,
            @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(ApiResponse.<OrderResponse>builder()
                .code(200)
                .data(orderService.getOrderDetail(jwt.getSubject(), orderId))
                .build());
    }
}