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
}