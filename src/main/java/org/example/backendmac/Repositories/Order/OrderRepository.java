package org.example.backendmac.Repositories.Order;

import org.example.backendmac.models.Order.Order;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;

import java.math.BigDecimal;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);

    @Query("SELECT SUM(o.totalAmount) FROM Order o")
    BigDecimal getTotalRevenue();


}