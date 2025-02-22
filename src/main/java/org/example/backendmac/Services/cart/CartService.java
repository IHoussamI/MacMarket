package org.example.backendmac.Services.cart;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.backendmac.Services.user.UserService;
import org.example.backendmac.models.cart.Cart;
import org.example.backendmac.Repositories.CartItemRepository;
import org.example.backendmac.Repositories.CartRepository;
import org.example.backendmac.models.user.Users;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

@Service
@RequiredArgsConstructor
public class CartService implements iCartService{

    @Autowired
    private final CartRepository cartRepository;

    private final CartItemRepository cartItemRepository;
    private final UserService userService;
    @Override
    public Cart getCart(Long id) {
        return cartRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
    }

    @Transactional
    @Override
    public void clearCart(Long id) {
        Cart cart =getCart(id);
        cartItemRepository.deleteAllByCartId(id);
        cart.getItems().clear();
        cartRepository.deleteById(id);
    }


    @Override
    public BigDecimal getTotalPrice(Long id) {
        Cart cart = getCart(id);
        return cart.getTotalAmount();
    }

    @Override
    public Long initialiseNewCart(Long userId) {
        // Check if the user already has a cart
        Optional<Cart> existingCart = cartRepository.findByUserId(userId);

        if (existingCart.isPresent()) {
            // Return the existing cart ID
            return existingCart.get().getId();
        } else {
            // Create a new cart for the user
            Users user = userService.getUserById(userId);
            Cart newCart = new Cart();
            newCart.setUser(user);
            return cartRepository.save(newCart).getId();
        }
    }

}
