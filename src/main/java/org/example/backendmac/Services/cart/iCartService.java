package org.example.backendmac.Services.cart;

import org.example.backendmac.models.cart.Cart;

import java.math.BigDecimal;

public interface iCartService {
    Cart getCart(Long id);
    void clearCart(Long id);
    BigDecimal getTotalPrice(Long id);


    Long initialiseNewCart(Long userId);
}
