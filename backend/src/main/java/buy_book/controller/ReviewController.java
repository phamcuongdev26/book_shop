package buy_book.controller;

import buy_book.dto.request.ReviewRequest;
import buy_book.dto.request.ShopReplyRequest;
import buy_book.dto.response.ApiResponse;
import buy_book.dto.response.ReviewResponse;
import buy_book.dto.response.ReviewStatusResponse;
import buy_book.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/book/{bookId}")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getBookReviews(@PathVariable Long bookId) {
        return ResponseEntity.ok(ApiResponse.<List<ReviewResponse>>builder()
                .code(200)
                .result(reviewService.getBookReviews(bookId))
                .build());
    }

    @PostMapping("/book/{bookId}")
    public ResponseEntity<ApiResponse<ReviewResponse>> createReview(
            @PathVariable Long bookId,
            @RequestBody @Valid ReviewRequest request,
            @AuthenticationPrincipal Jwt jwt) {
        ReviewResponse review = reviewService.createReview(bookId, jwt.getSubject(), request);
        return ResponseEntity.ok(ApiResponse.<ReviewResponse>builder()
                .code(200).result(review).build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ReviewResponse>> updateReview(
            @PathVariable Long id,
            @RequestBody @Valid ReviewRequest request,
            @AuthenticationPrincipal Jwt jwt) {
        ReviewResponse review = reviewService.updateReview(id, jwt.getSubject(), request);
        return ResponseEntity.ok(ApiResponse.<ReviewResponse>builder()
                .code(200).result(review).build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteReview(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt) {
        reviewService.deleteReview(id, jwt.getSubject());
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .code(200).message("Đã xóa đánh giá").build());
    }

    @PatchMapping("/{id}/reply")
    public ResponseEntity<ApiResponse<ReviewResponse>> replyToReview(
            @PathVariable Long id,
            @RequestBody @Valid ShopReplyRequest request,
            @AuthenticationPrincipal Jwt jwt) {
        ReviewResponse review = reviewService.replyToReview(id, jwt.getSubject(), request.getShopReply());
        return ResponseEntity.ok(ApiResponse.<ReviewResponse>builder()
                .code(200).result(review).build());
    }

    @GetMapping("/book/{bookId}/my-status")
    public ResponseEntity<ApiResponse<ReviewStatusResponse>> getMyStatus(
            @PathVariable Long bookId,
            @AuthenticationPrincipal Jwt jwt) {
        ReviewStatusResponse status = reviewService.getMyStatus(bookId, jwt.getSubject());
        return ResponseEntity.ok(ApiResponse.<ReviewStatusResponse>builder()
                .code(200).result(status).build());
    }
}
