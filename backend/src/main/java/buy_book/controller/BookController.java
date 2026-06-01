package buy_book.controller;

// v2
import buy_book.constant.NotificationType;
import buy_book.constant.Role;
import buy_book.dto.request.BookRequest;
import buy_book.dto.response.ApiResponse;
import buy_book.dto.response.BookDetailResponse;
import buy_book.dto.response.BookSummaryResponse;
import buy_book.dto.response.PageResponse;
import buy_book.repository.UserRepository;
import buy_book.service.AuditLogService;
import buy_book.service.BookService;
import buy_book.service.NotificationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BookController {

    private final BookService bookService;
    private final AuditLogService auditLogService;
    private final NotificationService notificationService;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    // ==================== PUBLIC ====================

    @GetMapping("/api/books")
    public ResponseEntity<ApiResponse<PageResponse<BookSummaryResponse>>> getAllBooks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "newest") String sortBy,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice) {

        PageResponse<BookSummaryResponse> result = (categoryId != null || minPrice != null || maxPrice != null)
                ? bookService.filterBooks(null, null, null, minPrice, maxPrice, categoryId, null, sortBy, page, size, null)
                : bookService.getAllBooks(page, size, sortBy);

        return ResponseEntity.ok(ApiResponse.<PageResponse<BookSummaryResponse>>builder()
                .code(200)
                .result(result)
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
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String sellerName) {

        return ResponseEntity.ok(ApiResponse.<PageResponse<BookSummaryResponse>>builder()
                .code(200)
                .result(bookService.filterBooks(title, author, publishYear, minPrice, maxPrice, categoryId, hasDiscount, sortBy, page, size, sellerName))
                .build());
    }

    @GetMapping("/api/books/search")
    public ResponseEntity<ApiResponse<PageResponse<BookSummaryResponse>>> searchBooks(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(ApiResponse.<PageResponse<BookSummaryResponse>>builder()
                .code(200)
                .result(bookService.searchBooks(keyword, page, size))
                .build());
    }

    @GetMapping("/api/books/category/{categoryId}")
    public ResponseEntity<ApiResponse<PageResponse<BookSummaryResponse>>> getBooksByCategory(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(ApiResponse.<PageResponse<BookSummaryResponse>>builder()
                .code(200)
                .result(bookService.getBooksByCategory(categoryId, page, size))
                .build());
    }

    @GetMapping("/api/books/{id}")
    public ResponseEntity<ApiResponse<BookDetailResponse>> getBookDetail(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.<BookDetailResponse>builder()
                .code(200)
                .result(bookService.getBookDetail(id))
                .build());
    }

    // ==================== SELLER / ADMIN ====================

    @PostMapping("/api/seller/books")
    public ResponseEntity<ApiResponse<BookDetailResponse>> createBook(
            @Valid @RequestBody BookRequest request,
            @AuthenticationPrincipal Jwt jwt,
            HttpServletRequest httpRequest) {

        String username = jwt.getSubject();
        BookDetailResponse created = bookService.createBook(request, username);

        auditLogService.log(username, "CREATE", "BOOK",
                created.getId(), created.getTitle(),
                "Thêm sách mới",
                null,
                toJson(bookMap(created)),
                getClientIp(httpRequest));

        notifyAdmins("Sản phẩm mới được thêm",
                "Người dùng " + username + " đã thêm sách \"" + created.getTitle() + "\"");

        return ResponseEntity.ok(ApiResponse.<BookDetailResponse>builder()
                .code(200)
                .message("Thêm sách thành công")
                .result(created)
                .build());
    }

    @PutMapping("/api/seller/books/{id}")
    public ResponseEntity<ApiResponse<BookDetailResponse>> updateBook(
            @PathVariable Long id,
            @Valid @RequestBody BookRequest request,
            @AuthenticationPrincipal Jwt jwt,
            HttpServletRequest httpRequest) {

        String username = jwt.getSubject();
        BookDetailResponse old = bookService.getBookDetailAdmin(id);
        BookDetailResponse updated = bookService.updateBook(id, request, username);

        auditLogService.log(username, "UPDATE", "BOOK",
                updated.getId(), updated.getTitle(),
                "Cập nhật thông tin sách",
                toJson(bookMap(old)),
                toJson(bookMap(updated)),
                getClientIp(httpRequest));

        notifyAdmins("Sản phẩm được cập nhật",
                "Người dùng " + username + " đã cập nhật sách \"" + updated.getTitle() + "\"");

        return ResponseEntity.ok(ApiResponse.<BookDetailResponse>builder()
                .code(200)
                .message("Cập nhật sách thành công")
                .result(updated)
                .build());
    }

    @DeleteMapping("/api/seller/books/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBook(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt,
            HttpServletRequest httpRequest) {

        String username = jwt != null ? jwt.getSubject() : "system";
        BookDetailResponse book = bookService.getBookDetailAdmin(id);
        bookService.deleteBook(id, username);

        auditLogService.log(username, "DELETE", "BOOK",
                book.getId(), book.getTitle(),
                "Ẩn sách khỏi hệ thống",
                toJson(bookMap(book)),
                null,
                getClientIp(httpRequest));

        notifyAdmins("Sản phẩm bị xóa",
                "Người dùng " + username + " đã xóa sách \"" + book.getTitle() + "\"");

        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .code(200)
                .message("Xóa sách thành công")
                .build());
    }

    @GetMapping("/api/seller/books")
    public ResponseEntity<ApiResponse<List<BookDetailResponse>>> getMyBooks(
            @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(ApiResponse.<List<BookDetailResponse>>builder()
                .code(200)
                .result(bookService.getMyBooks(jwt.getSubject()))
                .build());
    }

    @GetMapping("/api/admin/sellers/{sellerId}/books")
    public ResponseEntity<ApiResponse<PageResponse<BookSummaryResponse>>> getBooksBySeller(
            @PathVariable Long sellerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        return ResponseEntity.ok(ApiResponse.<PageResponse<BookSummaryResponse>>builder()
                .code(200)
                .result(bookService.getBooksBySeller(sellerId, page, size))
                .build());
    }

    // ── helpers ──────────────────────────────────────────────

    private Map<String, Object> bookMap(BookDetailResponse b) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("title",         nvl(b.getTitle()));
        m.put("author",        nvl(b.getAuthor()));
        m.put("publisher",     nvl(b.getPublisher()));
        m.put("price",         b.getPrice() != null ? b.getPrice() : BigDecimal.ZERO);
        m.put("discountPrice", b.getDiscountPrice() != null ? b.getDiscountPrice() : "");
        m.put("stockQuantity", b.getStockQuantity() != null ? b.getStockQuantity() : 0);
        m.put("category",      nvl(b.getCategoryName()));
        m.put("status",        nvl(b.getStatus()));
        return m;
    }

    private String nvl(String s) { return s != null ? s : ""; }

    private String toJson(Object obj) {
        try { return objectMapper.writeValueAsString(obj); }
        catch (Exception e) { return "{}"; }
    }

    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isBlank()) return request.getRemoteAddr();
        return ip.split(",")[0].trim();
    }

    private void notifyAdmins(String title, String message) {
        userRepository.findByRole(Role.ADMIN).forEach(admin ->
                notificationService.create(admin, title, message, NotificationType.SYSTEM, null, null));
    }
}
