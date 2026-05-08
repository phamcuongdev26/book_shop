package buy_book.service.impl;

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

        if (request.getIsbn() != null && bookRepository.existsByIsbn(request.getIsbn())) {
            throw new RuntimeException("ISBN đã tồn tại");
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
                .isbn(request.getIsbn())
                .pageCount(request.getPageCount())
                .language(request.getLanguage())
                .category(category)
                .seller(seller)
                .active(true)
                .build();

        return toDetailResponse(bookRepository.save(book));
    }

    @Override
    public BookDetailResponse updateBook(Long id, BookRequest request, String username) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));

        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
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
        book.setIsbn(request.getIsbn());
        book.setPageCount(request.getPageCount());
        book.setLanguage(request.getLanguage());
        book.setCategory(category);

        return toDetailResponse(bookRepository.save(book));
    }

    @Override
    public PageResponse<BookSummaryResponse> filterBooks(
            String title, String author, Integer publishYear,
            BigDecimal minPrice, BigDecimal maxPrice,
            Long categoryId, Boolean hasDiscount, String sortBy, int page, int size) {

        Sort sort = getSort(sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        Specification<Book> spec = BookSpecification.filter(title, author, publishYear, minPrice, maxPrice, categoryId, hasDiscount);
        return toPageResponse(bookRepository.findAll(spec, pageable));
    }

    @Override
    public void deleteBook(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));
        book.setActive(false);
        bookRepository.save(book);
    }

    // ==================== HELPER METHODS ====================

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
            default            -> Sort.by("createdAt").descending();
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
                .categoryName(book.getCategory() != null ? book.getCategory().getName() : null)
                .avgRating(book.getAvgRating())
                .totalSold(book.getTotalSold())
                .stockQuantity(book.getStockQuantity())
                .status(book.isActive() ? "ACTIVE" : "INACTIVE")
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
                .categoryName(book.getCategory() != null ? book.getCategory().getName() : null)
                .categoryId(book.getCategory() != null ? book.getCategory().getId() : null)
                .sellerName(book.getSeller() != null ? book.getSeller().getFullName() : null)
                .sellerId(book.getSeller() != null ? book.getSeller().getId() : null)
                .avgRating(book.getAvgRating())
                .totalSold(book.getTotalSold())
                .status(book.isActive() ? "ACTIVE" : "INACTIVE")
                .createdAt(book.getCreatedAt())
                .updatedAt(book.getUpdatedAt())
                .build();
    }
}