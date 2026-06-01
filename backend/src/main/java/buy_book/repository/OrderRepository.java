package buy_book.repository;

import buy_book.constant.OrderStatus;
import buy_book.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<Order> findByOrderCode(String orderCode);

    @Query(value = "SELECT * FROM orders ORDER BY created_at DESC", nativeQuery = true)
    List<Order> findAllOrderByCreatedAtDesc();

    @Query(value = "SELECT * FROM orders WHERE status = :status ORDER BY created_at DESC", nativeQuery = true)
    List<Order> findByStatus(@Param("status") String status);

    @Query("""
            select distinct o from Order o
            join o.items i
            join i.book b
            where b.seller.id = :sellerId
            order by o.createdAt desc
            """)
    List<Order> findBySellerIdOrderByCreatedAtDesc(@Param("sellerId") Long sellerId);

    @Query("""
            select distinct o from Order o
            join o.items i
            join i.book b
            where b.seller.id = :sellerId and o.status = :status
            order by o.createdAt desc
            """)
    List<Order> findBySellerIdAndStatusOrderByCreatedAtDesc(@Param("sellerId") Long sellerId,
                                                            @Param("status") OrderStatus status);

    @Query("""
            SELECT CASE WHEN COUNT(o) > 0 THEN true ELSE false END
            FROM Order o JOIN o.items i
            WHERE o.user.id = :userId AND i.book.id = :bookId AND o.status = :status
            """)
    boolean existsByUserAndBookAndStatus(@Param("userId") Long userId,
                                         @Param("bookId") Long bookId,
                                         @Param("status") OrderStatus status);
}
