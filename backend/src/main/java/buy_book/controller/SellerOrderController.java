package buy_book.controller;

import buy_book.constant.OrderStatus;
import buy_book.dto.request.UpdateOrderStatusRequest;
import buy_book.dto.response.ApiResponse;
import buy_book.dto.response.OrderResponse;
import buy_book.service.AdminOrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seller/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SellerOrderController {

    private final AdminOrderService adminOrderService;

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody @Valid UpdateOrderStatusRequest request,
            @AuthenticationPrincipal Jwt jwt) {
        OrderResponse updated = adminOrderService.updateSellerOrderStatus(id, jwt.getSubject(), request.getStatus());
        return ResponseEntity.ok(ApiResponse.<OrderResponse>builder()
                .code(200)
                .result(updated)
                .build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getSellerOrders(
            @RequestParam(required = false) OrderStatus status,
            @AuthenticationPrincipal Jwt jwt) {
        List<OrderResponse> orders = status != null
                ? adminOrderService.getSellerOrdersByStatus(jwt.getSubject(), status)
                : adminOrderService.getSellerOrders(jwt.getSubject());
        return ResponseEntity.ok(ApiResponse.<List<OrderResponse>>builder()
                .code(200)
                .result(orders)
                .build());
    }
}
