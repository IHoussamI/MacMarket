package org.example.backendmac.Services.cart;

import lombok.RequiredArgsConstructor;
import org.example.backendmac.models.cart.Cart;
import org.example.backendmac.models.cartitem.CartItem;
import org.example.backendmac.Repositories.CartItemRepository;
import org.example.backendmac.Repositories.CartRepository;
import org.example.backendmac.models.product.Product;
import org.example.backendmac.Services.product.iProductService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;


@Service
@RequiredArgsConstructor
public class CartItemService implements iCartItemService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final iProductService productService;
    private final iCartService cartService;


    @Override
    public void addCartItem(Long cartId, Long productId, int quantity) {
        Cart cart = cartService.getCart(cartId);
        Product product = productService.getProductById(productId);
        CartItem cartItem = cart.getItems()
                .stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst()
                .orElseGet(() -> {
                    CartItem newItem = new CartItem();
                    newItem.setCart(cart);
                    newItem.setProduct(product);
                    newItem.setUnitPrice(product.getPrice());
                    return newItem;
                });

        // Update quantity
        cartItem.setQuantity(cartItem.getQuantity() + quantity);
        cartItem.setTotalPrice(); // Ensure this method calculates the total price correctly

        // Add to cart and save
        cart.addCartItem(cartItem);
        cartItemRepository.save(cartItem);
        cartRepository.save(cart);
    }
    @Override
    public void removeCartItem(Long cartId, Long productId) {

        Cart cart = cartService.getCart(cartId);
        CartItem itemToRemove = cart.getItems()
                .stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Item not found"));
        cart.removeCartItem(itemToRemove);
        cartRepository.save(cart);
        cartItemRepository.delete(itemToRemove);
    }

    @Override
    public void updateCartItem(Long cartId, Long productId, int quantity) {
        Cart cart = cartService.getCart(cartId);
        cart.getItems()
                .stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst()
                .ifPresent(item -> {
                    item.setQuantity(quantity);
                    item.setTotalPrice();
                    item.setQuantity(quantity);
                    item.setUnitPrice(item.getProduct().getPrice());
                });
        BigDecimal totalAmount = cart.getTotalAmount();
        cart.setTotalAmount(totalAmount);

        cartRepository.save(cart);
    }

    }
