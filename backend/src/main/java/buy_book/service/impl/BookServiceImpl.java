package buy_book.service.impl;

import buy_book.constant.BookStatus;
import buy_book.dto.request.BookRequest;
import buy_book.dto.response.BookDetailResponse;
import buy_book.dto.response.BookSummaryResponse;
import buy_book.dto.response.PageResponse;
import buy_book.entity.Book;
import buy_book.entity.Category;
import buy_book.entity.User;
import buy_book.exception.AppException;
import buy_book.exception.ErrorCode;
import buy_book.repository.BookRepository;
import buy_book.repository.CategoryRepository;
import buy_book.repository.UserRepository;
import buy_book.service.BookService;
import buy_book.specification.BookSpecification;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public PageResponse<BookSummaryResponse> getAllBooks(int page, int size, String sortBy) {
        Sort sort = getSort(sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Book> bookPage = bookRepository.findByActiveTrue(pageable);
        return toPageResponse(bookPage);
    }

    @Override
    public PageResponse<BookSummaryResponse> searchBooks(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Book> bookPage = bookRepository.searchByKeyword(keyword, pageable);
        return toPageResponse(bookPage);
    }

    @Override
    public PageResponse<BookSummaryResponse> getBooksByCategory(Long categoryId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Book> bookPage = bookRepository.findByCategoryIdAndActiveTrue(categoryId, pageable);
        return toPageResponse(bookPage);
    }

    @Override
    public BookDetailResponse getBookDetail(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));
        if (!book.isActive()) {
            throw new AppException(ErrorCode.BOOK_INACTIVE);
        }
        return toDetailResponse(book);
    }

    @Override
    public BookDetailResponse createBook(BookRequest request, String username) {
        User seller = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
        }

        String isbn = normalizeBlank(request.getIsbn());
        if (isbn != null && bookRepository.existsByIsbn(isbn)) {
            throw new RuntimeException("ISBN đã tồn tại");
        }

        BookStatus bookStatus = BookStatus.ACTIVE;
        if (request.getStatus() != null) {
            try { bookStatus = BookStatus.valueOf(request.getStatus()); } catch (IllegalArgumentException ignored) {}
        }

        Book book = Book.builder()
                .title(request.getTitle())
                .author(request.getAuthor())
                .publisher(request.getPublisher())
                .publishYear(request.getPublishYear())
                .description(request.getDescription())
                .price(request.getPrice())
                .discountPrice(request.getDiscountPrice())
                .stockQuantity(request.getStockQuantity() != null ? request.getStockQuantity() : 0)
                .imageUrl(request.getImageUrl())
                .isbn(isbn)
                .pageCount(request.getPageCount())
                .language(request.getLanguage())
                .category(category)
                .seller(seller)
                .status(bookStatus)
                .active(bookStatus == BookStatus.ACTIVE)
                .build();

        return toDetailResponse(bookRepository.save(book));
    }

    @Override
    public BookDetailResponse updateBook(Long id, BookRequest request, String username) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));

        User requester = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        if (requester.getRole() == buy_book.constant.Role.SELLER) {
            if (book.getSeller() == null || !book.getSeller().getId().equals(requester.getId()))
                throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
        }

        String isbn = normalizeBlank(request.getIsbn());
        if (isbn != null && !isbn.equals(book.getIsbn())
                && bookRepository.existsByIsbnAndIdNot(isbn, id)) {
            throw new RuntimeException("ISBN đã tồn tại");
        }

        book.setTitle(request.getTitle());
        book.setAuthor(request.getAuthor());
        book.setPublisher(request.getPublisher());
        book.setPublishYear(request.getPublishYear());
        book.setDescription(request.getDescription());
        book.setPrice(request.getPrice());
        book.setDiscountPrice(request.getDiscountPrice());
        book.setStockQuantity(request.getStockQuantity());
        book.setImageUrl(request.getImageUrl());
        book.setIsbn(isbn);
        book.setPageCount(request.getPageCount());
        book.setLanguage(request.getLanguage());
        book.setCategory(category);
        if (request.getStatus() != null) {
            try {
                BookStatus s = BookStatus.valueOf(request.getStatus());
                book.setStatus(s);
                book.setActive(s == BookStatus.ACTIVE);
            } catch (IllegalArgumentException ignored) {}
        }

        return toDetailResponse(bookRepository.save(book));
    }

    @Override
    public PageResponse<BookSummaryResponse> filterBooks(
            String title, String author, Integer publishYear,
            BigDecimal minPrice, BigDecimal maxPrice,
            Long categoryId, Boolean hasDiscount, String sortBy, int page, int size,
            String sellerName) {

        Sort sort = getSort(sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        Specification<Book> spec = BookSpecification.filter(title, author, publishYear, minPrice, maxPrice, categoryId, hasDiscount, sellerName);
        return toPageResponse(bookRepository.findAll(spec, pageable));
    }

    @Override
    public BookDetailResponse getBookDetailAdmin(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));
        return toDetailResponse(book);
    }

    @Override
    public PageResponse<BookSummaryResponse> getBooksBySeller(Long sellerId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Book> bookPage = bookRepository.findBySellerId(sellerId, pageable);
        return toPageResponse(bookPage);
    }

    @Override
    public void deleteBook(Long id, String username) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));

        User requester = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        if (requester.getRole() == buy_book.constant.Role.SELLER) {
            if (book.getSeller() == null || !book.getSeller().getId().equals(requester.getId()))
                throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        book.setActive(false);
        book.setStatus(BookStatus.INACTIVE);
        bookRepository.save(book);
    }

    @Override
    public List<BookDetailResponse> getMyBooks(String username) {
        User seller = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return bookRepository.findBySellerIdOrderByCreatedAtDesc(seller.getId())
                .stream()
                .map(this::toDetailResponse)
                .toList();
    }

    // ==================== HELPER METHODS ====================

    private String normalizeBlank(String value) {
        if (value == null) return null;
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private Sort getSort(String sortBy) {
        if (sortBy == null) return Sort.by("createdAt").descending();
        return switch (sortBy) {
            case "price_asc"   -> Sort.by("price").ascending();
            case "price_desc"  -> Sort.by("price").descending();
            case "best_seller" -> Sort.by("totalSold").descending();
            case "rating"      -> Sort.by("avgRating").descending();
            case "year_asc"    -> Sort.by("publishYear").ascending();
            case "year_desc"   -> Sort.by("publishYear").descending();
            case "title_asc"   -> Sort.by("title").ascending();
            default            -> Sort.by("id").descending();
        };
    }

    private PageResponse<BookSummaryResponse> toPageResponse(Page<Book> bookPage) {
        List<BookSummaryResponse> content = bookPage.getContent()
                .stream()
                .map(this::toSummaryResponse)
                .collect(Collectors.toList());

        return PageResponse.<BookSummaryResponse>builder()
                .content(content)
                .pageNumber(bookPage.getNumber())
                .pageSize(bookPage.getSize())
                .totalElements(bookPage.getTotalElements())
                .totalPages(bookPage.getTotalPages())
                .last(bookPage.isLast())
                .build();
    }

    private BookSummaryResponse toSummaryResponse(Book book) {
        return BookSummaryResponse.builder()
                .id(book.getId())
                .title(book.getTitle())
                .author(book.getAuthor())
                .publisher(book.getPublisher())
                .price(book.getPrice())
                .discountPrice(book.getDiscountPrice())
                .imageUrl(book.getImageUrl())
                .categoryName(safeCategoryName(book))
                .avgRating(book.getAvgRating())
                .totalSold(book.getTotalSold())
                .stockQuantity(book.getStockQuantity())
                .status(book.getStatus() != null ? book.getStatus().name() : (book.isActive() ? "ACTIVE" : "INACTIVE"))
                .sellerName(safeSellerName(book))
                .build();
    }

    private BookDetailResponse toDetailResponse(Book book) {
        return BookDetailResponse.builder()
                .id(book.getId())
                .title(book.getTitle())
                .author(book.getAuthor())
                .publisher(book.getPublisher())
                .publishYear(book.getPublishYear())
                .description(book.getDescription())
                .price(book.getPrice())
                .discountPrice(book.getDiscountPrice())
                .stockQuantity(book.getStockQuantity())
                .imageUrl(book.getImageUrl())
                .isbn(book.getIsbn())
                .pageCount(book.getPageCount())
                .language(book.getLanguage())
                .categoryName(safeCategoryName(book))
                .categoryId(safeCategoryId(book))
                .sellerName(safeSellerName(book))
                .sellerId(safeSellerId(book))
                .avgRating(book.getAvgRating())
                .totalSold(book.getTotalSold())
                .status(book.getStatus() != null ? book.getStatus().name() : (book.isActive() ? "ACTIVE" : "INACTIVE"))
                .createdAt(book.getCreatedAt())
                .updatedAt(book.getUpdatedAt())
                .build();
    }

    private String safeCategoryName(Book book) {
        try {
            Category category = book.getCategory();
            return category != null ? category.getName() : null;
        } catch (EntityNotFoundException e) {
            return null;
        }
    }

    private Long safeCategoryId(Book book) {
        try {
            Category category = book.getCategory();
            return category != null ? category.getId() : null;
        } catch (EntityNotFoundException e) {
            return null;
        }
    }

    private String safeSellerName(Book book) {
        try {
            User seller = book.getSeller();
            return seller != null ? seller.getFullName() : null;
        } catch (EntityNotFoundException e) {
            return null;
        }
    }

    private Long safeSellerId(Book book) {
        try {
            User seller = book.getSeller();
            return seller != null ? seller.getId() : null;
        } catch (EntityNotFoundException e) {
            return null;
        }
    }
}
