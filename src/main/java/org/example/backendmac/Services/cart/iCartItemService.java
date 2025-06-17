package org.example.backendmac.Services.cart;

import org.example.backendmac.models.cartitem.CartItem;

import java.util.Set;

public interface iCartItemService {


    void addCartItem(Long cartId, Long productId, int quantity);

    void removeCartItem(Long cartId, Long productId);

    void updateCartItem(Long cartId, Long productId,int quantity);

    Set<CartItem> getCartItemsByCartId(Long cartId);



}
