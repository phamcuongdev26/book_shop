package buy_book.service;

import buy_book.dto.request.CheckoutRequest;
import buy_book.dto.response.CheckoutAllResponse;
import buy_book.dto.response.OrderResponse;

import java.util.List;

public interface OrderService {
    OrderResponse checkout(String username, CheckoutRequest request);
    CheckoutAllResponse checkoutAll(String username, CheckoutRequest request);
    List<OrderResponse> getOrderHistory(String username);
    OrderResponse getOrderDetail(String username, Long orderId);
}