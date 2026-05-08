package buy_book.service.impl;

import buy_book.dto.request.AddToCartRequest;
import buy_book.dto.response.CartItemResponse;
import buy_book.dto.response.CartResponse;
import buy_book.entity.*;
import buy_book.exception.AppException;
import buy_book.exception.ErrorCode;
import buy_book.repository.*;
import buy_book.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    private Cart getOrCreateCart(User user) {
        return cartRepository.findByUserId(user.getId())
                .orElseGet(() -> cartRepository.save(
                        Cart.builder().user(user).build()));
    }

    @Override
    public CartResponse getCart(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        Cart cart = getOrCreateCart(user);
        return toCartResponse(cart);
    }

    @Override
    public CartResponse addToCart(String username, AddToCartRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));

        if (!book.isActive()) throw new AppException(ErrorCode.BOOK_INACTIVE);
        if (book.getStockQuantity() < request.getQuantity())
            throw new AppException(ErrorCode.OUT_OF_STOCK);

        Cart cart = getOrCreateCart(user);

        CartItem cartItem = cartItemRepository
                .findByCartIdAndBookId(cart.getId(), book.getId())
                .orElse(CartItem.builder().cart(cart).book(book).quantity(0).build());

        cartItem.setQuantity(cartItem.getQuantity() + request.getQuantity());
        cartItemRepository.save(cartItem);

        return toCartResponse(cartRepository.findById(cart.getId()).get());
    }

    @Override
    public CartResponse updateCartItem(String username, Long cartItemId, int quantity) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Cart cart = getOrCreateCart(user);
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new AppException(ErrorCode.CART_ITEM_NOT_FOUND));

        if (!cartItem.getCart().getId().equals(cart.getId()))
            throw new AppException(ErrorCode.UNAUTHORIZED);

        if (quantity <= 0) {
            cartItemRepository.delete(cartItem);
        } else {
            cartItem.setQuantity(quantity);
            cartItemRepository.save(cartItem);
        }

        return toCartResponse(cartRepository.findById(cart.getId()).get());
    }

    @Override
    public void removeCartItem(String username, Long cartItemId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Cart cart = getOrCreateCart(user);
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new AppException(ErrorCode.CART_ITEM_NOT_FOUND));

        if (!cartItem.getCart().getId().equals(cart.getId()))
            throw new AppException(ErrorCode.UNAUTHORIZED);

        cartItemRepository.delete(cartItem);
    }

    @Override
    public void clearCart(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        Cart cart = getOrCreateCart(user);
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    private CartResponse toCartResponse(Cart cart) {
        List<CartItemResponse> items = cart.getItems().stream()
                .map(item -> {
                    BigDecimal price = item.getBook().getDiscountPrice() != null
                            ? item.getBook().getDiscountPrice()
                            : item.getBook().getPrice();
                    return CartItemResponse.builder()
                            .cartItemId(item.getId())
                            .bookId(item.getBook().getId())
                            .bookTitle(item.getBook().getTitle())
                            .bookImage(item.getBook().getImageUrl())
                            .unitPrice(price)
                            .quantity(item.getQuantity())
                            .totalPrice(price.multiply(BigDecimal.valueOf(item.getQuantity())))
                            .build();
                })
                .collect(Collectors.toList());

        BigDecimal totalPrice = items.stream()
                .map(CartItemResponse::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return CartResponse.builder()
                .cartId(cart.getId())
                .items(items)
                .totalPrice(totalPrice)
                .build();
    }
}