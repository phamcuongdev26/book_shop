package buy_book.service.impl;

import buy_book.constant.NotificationType;
import buy_book.constant.OrderStatus;
import buy_book.constant.PaymentStatus;
import buy_book.dto.request.AdminCreateOrderItemRequest;
import buy_book.dto.request.AdminCreateOrderRequest;
import buy_book.dto.response.OrderItemResponse;
import buy_book.dto.response.OrderResponse;
import buy_book.entity.Book;
import buy_book.entity.Order;
import buy_book.entity.OrderItem;
import buy_book.entity.User;
import buy_book.exception.AppException;
import buy_book.exception.ErrorCode;
import buy_book.repository.BookRepository;
import buy_book.repository.OrderRepository;
import buy_book.repository.UserRepository;
import buy_book.service.AdminOrderService;
import buy_book.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminOrderServiceImpl implements AdminOrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
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

    @Override
    @Transactional
    public OrderResponse createOrder(AdminCreateOrderRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Order order = Order.builder()
                .user(user)
                .shippingAddress(request.getShippingAddress())
                .recipientName(request.getRecipientName())
                .recipientPhone(request.getRecipientPhone())
                .paymentMethod(request.getPaymentMethod())
                .paymentStatus(PaymentStatus.UNPAID)
                .totalAmount(BigDecimal.ZERO)
                .note(request.getNote())
                .build();

        BigDecimal total = BigDecimal.ZERO;

        for (AdminCreateOrderItemRequest itemReq : request.getItems()) {
            Book book = bookRepository.findById(itemReq.getBookId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy sách ID=" + itemReq.getBookId()));

            if (book.getStockQuantity() < itemReq.getQuantity()) {
                throw new RuntimeException("Sách \"" + book.getTitle() + "\" không đủ tồn kho (còn " + book.getStockQuantity() + ")");
            }

            BigDecimal unitPrice = book.getDiscountPrice() != null ? book.getDiscountPrice() : book.getPrice();
            BigDecimal lineTotal = unitPrice.multiply(BigDecimal.valueOf(itemReq.getQuantity()));

            OrderItem item = OrderItem.builder()
                    .order(order)
                    .book(book)
                    .quantity(itemReq.getQuantity())
                    .unitPrice(unitPrice)
                    .totalPrice(lineTotal)
                    .build();
            order.getItems().add(item);

            book.setStockQuantity(book.getStockQuantity() - itemReq.getQuantity());
            bookRepository.save(book);

            total = total.add(lineTotal);
        }

        order.setTotalAmount(total);
        Order saved = orderRepository.save(order);

        notificationService.create(user,
                "Đơn hàng mới",
                "Đơn hàng #" + saved.getOrderCode() + " đã được tạo bởi Admin.",
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