package buy_book.service.impl;

import buy_book.dto.request.CheckoutRequest;
import buy_book.dto.response.OrderItemResponse;
import buy_book.dto.response.OrderResponse;
import buy_book.entity.*;
import buy_book.exception.AppException;
import buy_book.exception.ErrorCode;
import buy_book.repository.*;
import buy_book.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public OrderResponse checkout(String username, CheckoutRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new AppException(ErrorCode.CART_NOT_FOUND));

        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Giỏ hàng trống!");
        }

        // Lọc items được chọn (nếu có selectedItemIds, chỉ checkout những item đó)
        List<CartItem> selectedItems;
        boolean isPartialCheckout = request.getSelectedItemIds() != null
                && !request.getSelectedItemIds().isEmpty();
        if (isPartialCheckout) {
            selectedItems = cart.getItems().stream()
                    .filter(i -> request.getSelectedItemIds().contains(i.getId()))
                    .collect(Collectors.toList());
            if (selectedItems.isEmpty()) throw new RuntimeException("Không có sản phẩm nào được chọn!");
        } else {
            selectedItems = cart.getItems();
        }

        // Tạo order
        Order order = Order.builder()
                .user(user)
                .shippingAddress(request.getShippingAddress())
                .recipientName(request.getRecipientName())
                .recipientPhone(request.getRecipientPhone())
                .paymentMethod(request.getPaymentMethod())
                .note(request.getNote())
                .totalAmount(BigDecimal.ZERO)
                .build();

        // Tạo order items
        List<OrderItem> orderItems = selectedItems.stream().map(cartItem -> {
            Book book = cartItem.getBook();

            if (!book.isActive()) throw new AppException(ErrorCode.BOOK_INACTIVE);
            if (book.getStockQuantity() < cartItem.getQuantity())
                throw new AppException(ErrorCode.OUT_OF_STOCK);

            // Trừ tồn kho
            book.setStockQuantity(book.getStockQuantity() - cartItem.getQuantity());
            book.setTotalSold(book.getTotalSold() + cartItem.getQuantity());
            bookRepository.save(book);

            BigDecimal unitPrice = book.getDiscountPrice() != null
                    ? book.getDiscountPrice() : book.getPrice();
            BigDecimal totalPrice = unitPrice.multiply(BigDecimal.valueOf(cartItem.getQuantity()));

            return OrderItem.builder()
                    .order(order)
                    .book(book)
                    .quantity(cartItem.getQuantity())
                    .unitPrice(unitPrice)
                    .totalPrice(totalPrice)
                    .build();
        }).collect(Collectors.toList());

        // Tính tổng tiền
        BigDecimal totalAmount = orderItems.stream()
                .map(OrderItem::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        order.setItems(orderItems);
        order.setTotalAmount(totalAmount);
        orderRepository.save(order);

        // Xóa các item đã checkout khỏi giỏ hàng
        if (isPartialCheckout) {
            cart.getItems().removeIf(i -> request.getSelectedItemIds().contains(i.getId()));
        } else {
            cart.getItems().clear();
        }
        cartRepository.save(cart);

        return toOrderResponse(order);
    }

    @Override
    public List<OrderResponse> getOrderHistory(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::toOrderResponse)
                .collect(Collectors.toList());
    }

    @Override
    public OrderResponse getOrderDetail(String username, Long orderId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
        if (!order.getUser().getId().equals(user.getId()))
            throw new AppException(ErrorCode.UNAUTHORIZED);
        return toOrderResponse(order);
    }

    private OrderResponse toOrderResponse(Order order) {
        List<OrderItemResponse> items = order.getItems().stream()
                .map(item -> OrderItemResponse.builder()
                        .bookId(item.getBook().getId())
                        .bookTitle(item.getBook().getTitle())
                        .bookImage(item.getBook().getImageUrl())
                        .quantity(item.getQuantity())
                        .unitPrice(item.getUnitPrice())
                        .totalPrice(item.getTotalPrice())
                        .build())
                .collect(Collectors.toList());

        return OrderResponse.builder()
                .id(order.getId())
                .orderCode(order.getOrderCode())
                .status(order.getStatus())
                .paymentMethod(order.getPaymentMethod())
                .paymentStatus(order.getPaymentStatus())
                .shippingAddress(order.getShippingAddress())
                .recipientName(order.getRecipientName())
                .recipientPhone(order.getRecipientPhone())
                .totalAmount(order.getTotalAmount())
                .note(order.getNote())
                .items(items)
                .createdAt(order.getCreatedAt())
                .build();
    }
}