package buy_book.service;

import buy_book.constant.OrderStatus;
import buy_book.dto.request.AdminCreateOrderRequest;
import buy_book.dto.response.OrderResponse;

import java.util.List;

public interface AdminOrderService {
    List<OrderResponse> getAllOrders();
    List<OrderResponse> getOrdersByStatus(OrderStatus status);
    List<OrderResponse> getSellerOrders(String sellerUsername);
    List<OrderResponse> getSellerOrdersByStatus(String sellerUsername, OrderStatus status);
    OrderResponse getOrderById(Long id);
    OrderResponse updateOrderStatus(Long id, OrderStatus status);
    OrderResponse updateSellerOrderStatus(Long orderId, String sellerUsername, OrderStatus status);
    OrderResponse createOrder(AdminCreateOrderRequest request);
}
