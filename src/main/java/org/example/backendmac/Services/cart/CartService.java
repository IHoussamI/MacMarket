package org.example.backendmac.Services.cart;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.backendmac.Others.ResourceNotFoundException;
import org.example.backendmac.Services.user.UserService;
import org.example.backendmac.models.cart.Cart;
import org.example.backendmac.Repositories.CartItem.CartItemRepository;
import org.example.backendmac.Repositories.Cart.CartRepository;
import org.example.backendmac.models.cartitem.CartItem;
import org.example.backendmac.models.user.Users;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Optional;

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

    @Override
    public Cart getCartByUserId(Long userId) {
        return cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found for user id " + userId));
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
        return cart.getItems()
                .stream()
                .map(CartItem::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }


    @Override
    public Long initialiseNewCart(Long userId) {
        Optional<Cart> existingCart = cartRepository.findByUserId(userId);

        if (existingCart.isPresent()) {
            return existingCart.get().getId();
        } else {
            Users user = userService.getUserById(userId);
            Cart newCart = new Cart();
            newCart.setUser(user);
            return cartRepository.save(newCart).getId();
        }
    }

}
