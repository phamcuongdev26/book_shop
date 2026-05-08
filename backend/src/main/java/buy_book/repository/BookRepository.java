package buy_book.repository;

import buy_book.entity.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Long>, JpaSpecificationExecutor<Book> {
    Optional<Book> findByIsbn(String isbn);
    boolean existsByIsbn(String isbn);

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
}