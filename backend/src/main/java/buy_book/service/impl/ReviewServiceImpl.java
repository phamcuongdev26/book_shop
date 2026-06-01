package buy_book.service.impl;

import buy_book.constant.OrderStatus;
import buy_book.dto.request.ReviewRequest;
import buy_book.dto.response.OrderItemInfo;
import buy_book.dto.response.ReviewResponse;
import buy_book.dto.response.ReviewStatusResponse;
import buy_book.entity.Book;
import buy_book.entity.OrderItem;
import buy_book.entity.Review;
import buy_book.entity.User;
import buy_book.exception.AppException;
import buy_book.exception.ErrorCode;
import buy_book.repository.BookRepository;
import buy_book.repository.OrderItemRepository;
import buy_book.repository.ReviewRepository;
import buy_book.repository.UserRepository;
import buy_book.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final OrderItemRepository orderItemRepository;

    @Override
    @Transactional
    public ReviewResponse createReview(Long bookId, String username, ReviewRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        OrderItem orderItem = orderItemRepository.findById(request.getOrderItemId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm trong đơn hàng."));

        if (!orderItem.getOrder().getUser().getId().equals(user.getId()))
            throw new AppException(ErrorCode.UNAUTHORIZED);

        if (orderItem.getOrder().getStatus() != OrderStatus.DELIVERED)
            throw new RuntimeException("Đơn hàng chưa được giao, không thể đánh giá.");

        if (!orderItem.getBook().getId().equals(bookId))
            throw new RuntimeException("Sản phẩm không khớp với đơn hàng.");

        if (reviewRepository.existsByOrderItemId(orderItem.getId()))
            throw new RuntimeException("Bạn đã đánh giá sản phẩm này rồi.");

        Book book = orderItem.getBook();
        User shop = book.getSeller();

        Review review = Review.builder()
                .user(user)
                .orderItem(orderItem)
                .book(book)
                .shop(shop)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();
        reviewRepository.save(review);
        recalcAvgRating(book);
        return toResponse(review);
    }

    @Override
    @Transactional
    public ReviewResponse updateReview(Long reviewId, String username, ReviewRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đánh giá."));
        if (!review.getUser().getId().equals(user.getId()))
            throw new AppException(ErrorCode.UNAUTHORIZED);

        review.setRating(request.getRating());
        review.setComment(request.getComment());
        reviewRepository.save(review);
        recalcAvgRating(review.getBook());
        return toResponse(review);
    }

    @Override
    @Transactional
    public void deleteReview(Long reviewId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đánh giá."));
        if (!review.getUser().getId().equals(user.getId()))
            throw new AppException(ErrorCode.UNAUTHORIZED);

        Book book = review.getBook();
        reviewRepository.delete(review);
        reviewRepository.flush();
        recalcAvgRating(book);
    }

    @Override
    @Transactional
    public ReviewResponse replyToReview(Long reviewId, String sellerUsername, String shopReply) {
        User seller = userRepository.findByUsername(sellerUsername)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đánh giá."));

        if (review.getShop() == null || !review.getShop().getId().equals(seller.getId()))
            throw new AppException(ErrorCode.UNAUTHORIZED);

        review.setShopReply(shopReply);
        review.setRepliedAt(LocalDateTime.now());
        reviewRepository.save(review);
        return toResponse(review);
    }

    @Override
    public List<ReviewResponse> getBookReviews(Long bookId) {
        return reviewRepository.findByBookIdOrderByCreatedAtDesc(bookId)
                .stream().map(this::toResponse).toList();
    }

    @Override
    public ReviewStatusResponse getMyStatus(Long bookId, String username) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) return ReviewStatusResponse.builder()
                .reviewableItems(List.of()).myReviews(List.of()).build();

        List<OrderItem> deliveredItems = orderItemRepository
                .findByUserIdAndBookIdAndOrderStatus(user.getId(), bookId, OrderStatus.DELIVERED);

        List<Review> myReviews = reviewRepository
                .findByUserIdAndBookIdOrderByCreatedAtDesc(user.getId(), bookId);

        Set<Long> reviewedOrderItemIds = myReviews.stream()
                .map(r -> r.getOrderItem().getId())
                .collect(Collectors.toSet());

        List<OrderItemInfo> reviewableItems = deliveredItems.stream()
                .filter(i -> !reviewedOrderItemIds.contains(i.getId()))
                .map(i -> OrderItemInfo.builder()
                        .orderItemId(i.getId())
                        .orderCode(i.getOrder().getOrderCode())
                        .purchasedAt(i.getOrder().getCreatedAt())
                        .build())
                .toList();

        return ReviewStatusResponse.builder()
                .reviewableItems(reviewableItems)
                .myReviews(myReviews.stream().map(this::toResponse).toList())
                .build();
    }

    private void recalcAvgRating(Book book) {
        Double avg = reviewRepository.avgRatingByBookId(book.getId());
        book.setAvgRating(avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0);
        bookRepository.save(book);
    }

    private ReviewResponse toResponse(Review r) {
        String displayName = r.getUser().getFullName();
        if (displayName == null || displayName.isBlank()) displayName = r.getUser().getUsername();
        String shopName = null;
        if (r.getShop() != null) {
            shopName = r.getShop().getFullName();
            if (shopName == null || shopName.isBlank()) shopName = r.getShop().getUsername();
        }
        return ReviewResponse.builder()
                .id(r.getId())
                .orderItemId(r.getOrderItem() != null ? r.getOrderItem().getId() : null)
                .username(r.getUser().getUsername())
                .fullName(displayName)
                .shopId(r.getShop() != null ? r.getShop().getId() : null)
                .shopName(shopName)
                .rating(r.getRating())
                .comment(r.getComment())
                .shopReply(r.getShopReply())
                .repliedAt(r.getRepliedAt())
                .createdAt(r.getCreatedAt())
                .build();
    }
}
