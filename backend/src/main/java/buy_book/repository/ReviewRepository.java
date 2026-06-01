package buy_book.repository;

import buy_book.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByBookIdOrderByCreatedAtDesc(Long bookId);

    List<Review> findByUserIdAndBookIdOrderByCreatedAtDesc(Long userId, Long bookId);

    boolean existsByOrderItemId(Long orderItemId);

    Optional<Review> findByOrderItemId(Long orderItemId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.book.id = :bookId")
    Double avgRatingByBookId(@Param("bookId") Long bookId);
}
