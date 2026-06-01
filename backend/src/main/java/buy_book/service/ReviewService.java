package buy_book.service;

import buy_book.dto.request.ReviewRequest;
import buy_book.dto.response.ReviewResponse;
import buy_book.dto.response.ReviewStatusResponse;

import java.util.List;

public interface ReviewService {
    ReviewResponse createReview(Long bookId, String username, ReviewRequest request);
    ReviewResponse updateReview(Long reviewId, String username, ReviewRequest request);
    void deleteReview(Long reviewId, String username);
    ReviewResponse replyToReview(Long reviewId, String sellerUsername, String shopReply);
    List<ReviewResponse> getBookReviews(Long bookId);
    ReviewStatusResponse getMyStatus(Long bookId, String username);
}
