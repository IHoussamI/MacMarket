package org.example.backendmac.Repositories.Order;

import org.example.backendmac.DTOs.SalesDTO.SalesDataDTO;
import org.example.backendmac.DTOs.TopProductDTO.TopProductDTO;
import org.example.backendmac.models.Order.Order;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;

import java.math.BigDecimal;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);

    @Query("SELECT SUM(o.totalAmount) FROM Order o")
    BigDecimal getTotalRevenue();


    @Query("SELECT new org.example.backendmac.DTOs.SalesDTO.SalesDataDTO(CAST(o.orderDate AS localdate), SUM(o.totalAmount)) " +
            "FROM Order o GROUP BY CAST(o.orderDate AS localdate) ORDER BY CAST(o.orderDate AS localdate)")
    List<SalesDataDTO> getSalesGroupedByDate();

    @Query("SELECT new org.example.backendmac.DTOs.TopProductDTO.TopProductDTO(oi.product.name, SUM(oi.quantity)) " +
            "FROM OrderItem oi GROUP BY oi.product.name ORDER BY SUM(oi.quantity) DESC")
    List<TopProductDTO> findTopSellingProducts();





}