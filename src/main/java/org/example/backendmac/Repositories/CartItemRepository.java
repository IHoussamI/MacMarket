package org.example.backendmac.Repositories;

import org.example.backendmac.models.cartitem.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository <CartItem, Long> {
    void deleteAllByCartId(Long id);
}
