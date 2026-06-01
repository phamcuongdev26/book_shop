package buy_book.service.impl;

import buy_book.constant.OrderStatus;
import buy_book.dto.request.ReviewRequest;
import buy_book.dto.response.ReviewResponse;
import buy_book.dto.response.ReviewStatusResponse;
import buy_book.entity.Book;
import buy_book.entity.Review;
import buy_book.entity.User;
import buy_book.exception.AppException;
import buy_book.exception.ErrorCode;
import buy_book.repository.BookRepository;
import buy_book.repository.OrderRepository;
import buy_book.repository.ReviewRepository;
import buy_book.repository.UserRepository;
import buy_book.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final OrderRepository orderRepository;

    @Override
    @Transactional
    public ReviewResponse createReview(Long bookId, String username, ReviewRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));

        if (!orderRepository.existsByUserAndBookAndStatus(user.getId(), bookId, OrderStatus.DELIVERED)) {
            throw new RuntimeException("Bạn cần mua và nhận sách này trước khi đánh giá.");
        }
        if (reviewRepository.existsByUserIdAndBookId(user.getId(), bookId)) {
            throw new RuntimeException("Bạn đã đánh giá cuốn sách này rồi.");
        }

        Review review = Review.builder()
                .user(user)
                .book(book)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();
        reviewRepository.save(review);

        Double avg = reviewRepository.avgRatingByBookId(bookId);
        book.setAvgRating(avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0);
        bookRepository.save(book);

        return toResponse(review);
    }

    @Override
    public List<ReviewResponse> getBookReviews(Long bookId) {
        return reviewRepository.findByBookIdOrderByCreatedAtDesc(bookId)
                .stream().map(this::toResponse).toList();
    }

    @Override
    public ReviewStatusResponse getMyStatus(Long bookId, String username) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) return ReviewStatusResponse.builder().build();

        User user = userOpt.get();
        boolean hasPurchased = orderRepository.existsByUserAndBookAndStatus(user.getId(), bookId, OrderStatus.DELIVERED);
        Optional<Review> myReview = reviewRepository.findByUserIdAndBookId(user.getId(), bookId);
        boolean canReview = hasPurchased && myReview.isEmpty();

        return ReviewStatusResponse.builder()
                .hasPurchased(hasPurchased)
                .canReview(canReview)
                .myReview(myReview.map(this::toResponse).orElse(null))
                .build();
    }

    private ReviewResponse toResponse(Review r) {
        String displayName = r.getUser().getFullName();
        if (displayName == null || displayName.isBlank()) displayName = r.getUser().getUsername();
        return ReviewResponse.builder()
                .id(r.getId())
                .username(r.getUser().getUsername())
                .fullName(displayName)
                .rating(r.getRating())
                .comment(r.getComment())
                .createdAt(r.getCreatedAt())
                .build();
    }
}
