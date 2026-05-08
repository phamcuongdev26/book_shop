package buy_book.service;

import buy_book.dto.request.AddToCartRequest;
import buy_book.dto.response.CartResponse;

public interface CartService {
    CartResponse getCart(String username);
    CartResponse addToCart(String username, AddToCartRequest request);
    CartResponse updateCartItem(String username, Long cartItemId, int quantity);
    void removeCartItem(String username, Long cartItemId);
    void clearCart(String username);
}