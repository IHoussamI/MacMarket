package org.example.backendmac.Services.cart;

public interface iCartItemService {


    void addCartItem(Long cartId, Long productId, int quantity);

    void removeCartItem(Long cartId, Long productId);

    void updateCartItem(Long cartId, Long productId,int quantity);




}
