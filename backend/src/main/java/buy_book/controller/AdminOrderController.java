package buy_book.controller;

import buy_book.constant.OrderStatus;
import buy_book.dto.request.AdminCreateOrderRequest;
import buy_book.dto.request.UpdateOrderStatusRequest;
import buy_book.dto.response.ApiResponse;
import buy_book.dto.response.OrderResponse;
import buy_book.service.AdminOrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminOrderController {

    private final AdminOrderService adminOrderService;

    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(
            @Valid @RequestBody AdminCreateOrderRequest request) {
        return ResponseEntity.ok(ApiResponse.<OrderResponse>builder()
                .code(200)
                .message("Tạo đơn hàng thành công")
                .data(adminOrderService.createOrder(request))
                .build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getAllOrders(
            @RequestParam(required = false) OrderStatus status) {
        List<OrderResponse> orders = status != null
                ? adminOrderService.getOrdersByStatus(status)
                : adminOrderService.getAllOrders();
        return ResponseEntity.ok(ApiResponse.<List<OrderResponse>>builder()
                .code(200)
                .data(orders)
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.<OrderResponse>builder()
                .code(200)
                .data(adminOrderService.getOrderById(id))
                .build());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateOrderStatusRequest request) {
        return ResponseEntity.ok(ApiResponse.<OrderResponse>builder()
                .code(200)
                .message("Cập nhật trạng thái đơn hàng thành công")
                .data(adminOrderService.updateOrderStatus(id, request.getStatus()))
                .build());
    }
}