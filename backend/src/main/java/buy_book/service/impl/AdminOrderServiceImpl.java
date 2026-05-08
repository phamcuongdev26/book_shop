package buy_book.service.impl;

import buy_book.constant.NotificationType;
import buy_book.constant.OrderStatus;
import buy_book.dto.response.OrderItemResponse;
import buy_book.dto.response.OrderResponse;
import buy_book.entity.Order;
import buy_book.entity.OrderItem;
import buy_book.exception.AppException;
import buy_book.exception.ErrorCode;
import buy_book.repository.OrderRepository;
import buy_book.service.AdminOrderService;
import buy_book.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminOrderServiceImpl implements AdminOrderService {

    private final OrderRepository orderRepository;
    private final NotificationService notificationService;

    private OrderItemResponse toItemResponse(OrderItem item) {
        return OrderItemResponse.builder()
                .id(item.getId())
                .bookId(item.getBook().getId())
                .bookTitle(item.getBook().getTitle())
                .bookImage(item.getBook().getImageUrl())
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .totalPrice(item.getTotalPrice())
                .build();
    }

    private OrderResponse toResponse(Order order) {
        return OrderResponse.builder()
                .id(order.getId())
                .orderCode(order.getOrderCode())
                .username(order.getUser().getUsername())
                .status(order.getStatus())
                .paymentMethod(order.getPaymentMethod())
                .paymentStatus(order.getPaymentStatus())
                .shippingAddress(order.getShippingAddress())
                .recipientName(order.getRecipientName())
                .recipientPhone(order.getRecipientPhone())
                .totalAmount(order.getTotalAmount())
                .note(order.getNote())
                .items(order.getItems().stream().map(this::toItemResponse).toList())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }

    @Override
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAllOrderByCreatedAtDesc()
                .stream().map(this::toResponse).toList();
    }

    @Override
    public List<OrderResponse> getOrdersByStatus(OrderStatus status) {
        return orderRepository.findByStatus(status.name())
                .stream().map(this::toResponse).toList();
    }

    @Override
    public OrderResponse getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
        return toResponse(order);
    }

    @Override
    public OrderResponse updateOrderStatus(Long id, OrderStatus status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
        order.setStatus(status);
        Order saved = orderRepository.save(order);

        notificationService.create(saved.getUser(),
                "Cập nhật đơn hàng",
                "Đơn hàng #" + saved.getOrderCode() + " đã chuyển sang trạng thái: " + statusLabel(status),
                NotificationType.ORDER_STATUS_CHANGED,
                saved.getId(), saved.getOrderCode());

        return toResponse(saved);
    }

    private String statusLabel(OrderStatus s) {
        return switch (s) {
            case PENDING -> "Chờ xác nhận";
            case CONFIRMED -> "Đã xác nhận";
            case PROCESSING -> "Đang xử lý";
            case SHIPPING -> "Đang giao hàng";
            case DELIVERED -> "Đã giao hàng";
            case CANCELLED -> "Đã hủy";
            case RETURNED -> "Đã hoàn trả";
        };
    }
}