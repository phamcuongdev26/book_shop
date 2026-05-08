package buy_book.controller;

import buy_book.dto.request.BookRequest;
import buy_book.dto.response.ApiResponse;
import buy_book.dto.response.BookDetailResponse;
import buy_book.dto.response.BookSummaryResponse;
import buy_book.dto.response.PageResponse;
import buy_book.service.BookService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BookController {

    private final BookService bookService;

    // ==================== PUBLIC ====================

    @GetMapping("/api/books")
    public ResponseEntity<ApiResponse<PageResponse<BookSummaryResponse>>> getAllBooks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "newest") String sortBy) {

        return ResponseEntity.ok(ApiResponse.<PageResponse<BookSummaryResponse>>builder()
                .code(200)
                .data(bookService.getAllBooks(page, size, sortBy))
                .build());
    }

    @GetMapping("/api/books/filter")
    public ResponseEntity<ApiResponse<PageResponse<BookSummaryResponse>>> filterBooks(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String author,
            @RequestParam(required = false) Integer publishYear,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Boolean hasDiscount,
            @RequestParam(defaultValue = "newest") String sortBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {

        return ResponseEntity.ok(ApiResponse.<PageResponse<BookSummaryResponse>>builder()
                .code(200)
                .data(bookService.filterBooks(title, author, publishYear, minPrice, maxPrice, categoryId, hasDiscount, sortBy, page, size))
                .build());
    }

    @GetMapping("/api/books/search")
    public ResponseEntity<ApiResponse<PageResponse<BookSummaryResponse>>> searchBooks(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(ApiResponse.<PageResponse<BookSummaryResponse>>builder()
                .code(200)
                .data(bookService.searchBooks(keyword, page, size))
                .build());
    }

    @GetMapping("/api/books/category/{categoryId}")
    public ResponseEntity<ApiResponse<PageResponse<BookSummaryResponse>>> getBooksByCategory(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(ApiResponse.<PageResponse<BookSummaryResponse>>builder()
                .code(200)
                .data(bookService.getBooksByCategory(categoryId, page, size))
                .build());
    }

    @GetMapping("/api/books/{id}")
    public ResponseEntity<ApiResponse<BookDetailResponse>> getBookDetail(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.<BookDetailResponse>builder()
                .code(200)
                .data(bookService.getBookDetail(id))
                .build());
    }

    // ==================== SELLER / ADMIN ====================

    @PostMapping("/api/seller/books")
    public ResponseEntity<ApiResponse<BookDetailResponse>> createBook(
            @Valid @RequestBody BookRequest request,
            @AuthenticationPrincipal Jwt jwt) {

        String username = jwt.getSubject();
        return ResponseEntity.ok(ApiResponse.<BookDetailResponse>builder()
                .code(200)
                .message("Thêm sách thành công")
                .data(bookService.createBook(request, username))
                .build());
    }

    @PutMapping("/api/seller/books/{id}")
    public ResponseEntity<ApiResponse<BookDetailResponse>> updateBook(
            @PathVariable Long id,
            @Valid @RequestBody BookRequest request,
            @AuthenticationPrincipal Jwt jwt) {

        String username = jwt.getSubject();
        return ResponseEntity.ok(ApiResponse.<BookDetailResponse>builder()
                .code(200)
                .message("Cập nhật sách thành công")
                .data(bookService.updateBook(id, request, username))
                .build());
    }

    @DeleteMapping("/api/seller/books/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .code(200)
                .message("Xóa sách thành công")
                .build());
    }
}