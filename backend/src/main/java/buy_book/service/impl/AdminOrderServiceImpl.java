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
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AdminOrderServiceImpl implements AdminOrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final NotificationService notificationService;

    private OrderItemResponse toItemResponse(OrderItem item) {
        User seller = item.getBook().getSeller();
        return OrderItemResponse.builder()
                .id(item.getId())
                .bookId(item.getBook().getId())
                .bookTitle(item.getBook().getTitle())
                .bookImage(item.getBook().getImageUrl())
                .sellerName(seller != null ? (seller.getFullName() != null ? seller.getFullName() : seller.getUsername()) : null)
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

    private OrderResponse toSellerResponse(Order order, Long sellerId) {
        List<OrderItemResponse> sellerItems = order.getItems().stream()
                .filter(item -> item.getBook().getSeller() != null
                        && item.getBook().getSeller().getId().equals(sellerId))
                .map(this::toItemResponse)
                .toList();
        BigDecimal sellerTotal = sellerItems.stream()
                .map(OrderItemResponse::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

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
                .totalAmount(sellerTotal)
                .note(order.getNote())
                .items(sellerItems)
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
    public List<OrderResponse> getSellerOrders(String sellerUsername) {
        User seller = userRepository.findByUsername(sellerUsername)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return orderRepository.findBySellerIdOrderByCreatedAtDesc(seller.getId())
                .stream().map(order -> toSellerResponse(order, seller.getId())).toList();
    }

    @Override
    public List<OrderResponse> getSellerOrdersByStatus(String sellerUsername, OrderStatus status) {
        User seller = userRepository.findByUsername(sellerUsername)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return orderRepository.findBySellerIdAndStatusOrderByCreatedAtDesc(seller.getId(), status)
                .stream().map(order -> toSellerResponse(order, seller.getId())).toList();
    }

    @Override
    public OrderResponse getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
        return toResponse(order);
    }

    @Override
    @Transactional
    public OrderResponse updateOrderStatus(Long id, OrderStatus status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        OrderStatus current = order.getStatus();

        if (current == status) return toResponse(order);

        if (current == OrderStatus.CANCELLED || current == OrderStatus.RETURNED) {
            throw new RuntimeException("Đơn hàng đã " + statusLabel(current) + ", không thể thay đổi trạng thái.");
        }

        // Whitelist of valid forward transitions (mirrors the UI's VALID_NEXT map)
        boolean validTransition = switch (current) {
            case PENDING    -> status == OrderStatus.CONFIRMED  || status == OrderStatus.PROCESSING
                            || status == OrderStatus.SHIPPING   || status == OrderStatus.DELIVERED
                            || status == OrderStatus.CANCELLED;
            case CONFIRMED  -> status == OrderStatus.PROCESSING || status == OrderStatus.SHIPPING
                            || status == OrderStatus.DELIVERED  || status == OrderStatus.CANCELLED;
            case PROCESSING -> status == OrderStatus.SHIPPING   || status == OrderStatus.DELIVERED
                            || status == OrderStatus.CANCELLED;
            case SHIPPING   -> status == OrderStatus.DELIVERED;
            case DELIVERED  -> status == OrderStatus.RETURNED;
            default         -> false;
        };
        if (!validTransition) {
            throw new RuntimeException(
                    "Không thể chuyển từ \"" + statusLabel(current) + "\" sang \"" + statusLabel(status) + "\".");
        }

        boolean shouldRestoreInventory = status == OrderStatus.CANCELLED || status == OrderStatus.RETURNED;

        if (shouldRestoreInventory) {
            for (OrderItem item : order.getItems()) {
                Book book = item.getBook();
                book.setStockQuantity(book.getStockQuantity() + item.getQuantity());
                int currentSold = book.getTotalSold() != null ? book.getTotalSold() : 0;
                book.setTotalSold(Math.max(0, currentSold - item.getQuantity()));
                bookRepository.save(book);
            }
        }

        order.setStatus(status);
        Order saved = orderRepository.save(order);

        notificationService.create(saved.getUser(),
                "Cập nhật đơn hàng",
                "Đơn hàng #" + saved.getOrderCode() + " đã chuyển sang trạng thái: " + statusLabel(status),
                NotificationType.ORDER_STATUS_CHANGED,
                saved.getId(), saved.getOrderCode());

        notifySellers(saved,
                "Cập nhật đơn hàng",
                "Đơn hàng #" + saved.getOrderCode() + " có sản phẩm của bạn đã chuyển sang trạng thái: " + statusLabel(status),
                NotificationType.ORDER_STATUS_CHANGED);

        String adminUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        userRepository.findByUsername(adminUsername).ifPresent(admin ->
                notificationService.create(admin,
                        "Đã cập nhật đơn hàng",
                        "Bạn đã cập nhật đơn hàng #" + saved.getOrderCode() + " → " + statusLabel(status),
                        NotificationType.SYSTEM,
                        saved.getId(), saved.getOrderCode()));

        return toResponse(saved);
    }

    private void notifySellers(Order order, String title, String message, NotificationType type) {
        Set<User> sellers = new LinkedHashSet<>();
        order.getItems().forEach(item -> {
            User seller = item.getBook().getSeller();
            if (seller != null) {
                sellers.add(seller);
            }
        });
        sellers.forEach(seller ->
                notificationService.create(seller, title, message, type, order.getId(), order.getOrderCode()));
    }

    @Override
    @Transactional
    public OrderResponse updateSellerOrderStatus(Long orderId, String sellerUsername, OrderStatus status) {
        User seller = userRepository.findByUsername(sellerUsername)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        boolean sellerOwnsItem = order.getItems().stream()
                .anyMatch(item -> item.getBook().getSeller() != null
                        && item.getBook().getSeller().getId().equals(seller.getId()));
        if (!sellerOwnsItem) {
            throw new RuntimeException("Bạn không có quyền cập nhật đơn hàng này.");
        }

        OrderStatus current = order.getStatus();
        if (current == status) return toSellerResponse(order, seller.getId());

        if (current == OrderStatus.CANCELLED || current == OrderStatus.RETURNED) {
            throw new RuntimeException("Đơn hàng đã " + statusLabel(current) + ", không thể thay đổi trạng thái.");
        }

        boolean validTransition = switch (current) {
            case PENDING    -> status == OrderStatus.CONFIRMED;
            case CONFIRMED  -> status == OrderStatus.PROCESSING;
            case PROCESSING -> status == OrderStatus.SHIPPING;
            case SHIPPING   -> status == OrderStatus.DELIVERED;
            default         -> false;
        };
        if (!validTransition) {
            throw new RuntimeException(
                    "Shop không thể chuyển từ \"" + statusLabel(current) + "\" sang \"" + statusLabel(status) + "\".");
        }

        order.setStatus(status);
        Order saved = orderRepository.save(order);

        notificationService.create(saved.getUser(),
                "Cập nhật đơn hàng từ shop",
                "Đơn hàng #" + saved.getOrderCode() + " đã được shop cập nhật sang trạng thái: " + statusLabel(status),
                NotificationType.ORDER_STATUS_CHANGED,
                saved.getId(), saved.getOrderCode());

        return toSellerResponse(saved, seller.getId());
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
            book.setTotalSold((book.getTotalSold() != null ? book.getTotalSold() : 0) + itemReq.getQuantity());
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

        notifySellers(saved,
                "Có đơn hàng chứa sản phẩm của bạn",
                "Đơn hàng #" + saved.getOrderCode() + " có sản phẩm của bạn. Vui lòng kiểm tra và xử lý.",
                NotificationType.ORDER_PLACED);

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
