package org.example.backendmac.Repositories.OrderItem;

import org.example.backendmac.models.OrderItem.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    void deleteByProductId(Long productId);

}

