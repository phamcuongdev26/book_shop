package buy_book.repository;

import buy_book.entity.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Long>, JpaSpecificationExecutor<Book> {
    Optional<Book> findByIsbn(String isbn);
    boolean existsByIsbn(String isbn);
    boolean existsByIsbnAndIdNot(String isbn, Long id);

    Page<Book> findByActiveTrue(Pageable pageable);
    Page<Book> findByCategoryIdAndActiveTrue(Long categoryId, Pageable pageable);

    @Query("SELECT b FROM Book b WHERE b.active = true AND " +
           "(LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(b.author) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Book> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT b FROM Book b WHERE b.active = true AND b.price BETWEEN :minPrice AND :maxPrice")
    Page<Book> findByPriceRange(@Param("minPrice") BigDecimal minPrice,
                                @Param("maxPrice") BigDecimal maxPrice, Pageable pageable);

    @Query("SELECT b FROM Book b WHERE b.active = true AND b.category.id = :categoryId AND " +
           "(LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(b.author) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Book> searchByCategoryAndKeyword(@Param("categoryId") Long categoryId,
                                          @Param("keyword") String keyword, Pageable pageable);

    Page<Book> findBySellerId(Long sellerId, Pageable pageable);

    List<Book> findBySellerIdOrderByCreatedAtDesc(Long sellerId);

    long countBySellerId(Long sellerId);

    @Modifying
    @Query("UPDATE Book b SET b.stockQuantity = b.stockQuantity - :quantity, b.totalSold = b.totalSold + :quantity " +
           "WHERE b.id = :bookId AND b.stockQuantity >= :quantity")
    int decrementStock(@Param("bookId") Long bookId, @Param("quantity") int quantity);
}