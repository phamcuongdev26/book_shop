package buy_book.repository;

import buy_book.constant.OrderStatus;
import buy_book.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    @Query("""
            SELECT i FROM OrderItem i
            WHERE i.order.user.id = :userId
              AND i.book.id = :bookId
              AND i.order.status = :status
            """)
    List<OrderItem> findByUserIdAndBookIdAndOrderStatus(
            @Param("userId") Long userId,
            @Param("bookId") Long bookId,
            @Param("status") OrderStatus status);
}
