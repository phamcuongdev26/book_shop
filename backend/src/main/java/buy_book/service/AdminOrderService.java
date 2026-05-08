package buy_book.service;

import buy_book.constant.OrderStatus;
import buy_book.dto.response.OrderResponse;

import java.util.List;

public interface AdminOrderService {
    List<OrderResponse> getAllOrders();
    List<OrderResponse> getOrdersByStatus(OrderStatus status);
    OrderResponse getOrderById(Long id);
    OrderResponse updateOrderStatus(Long id, OrderStatus status);
}