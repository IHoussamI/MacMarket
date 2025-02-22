package org.example.backendmac.Controllers.cartitem;


import lombok.RequiredArgsConstructor;
import org.example.backendmac.Others.ApiResponse;

import org.example.backendmac.Others.ResourceNotFoundException;
import org.example.backendmac.Services.cart.iCartItemService;
import org.example.backendmac.Services.cart.iCartService;
import org.example.backendmac.models.user.Users;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@RequiredArgsConstructor
@RestController
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@RequestMapping("/api/v1/cartItem")
@PreAuthorize("hasRole('USER')")

public class CartItemController {
    private final iCartItemService cartItemService;
    private final iCartService cartService;

    @PostMapping("/item/add")
    public ResponseEntity<ApiResponse> addCartItem(@RequestParam (required = false) Long cartId,
                                                    @RequestParam Long productId,
                                                    @RequestParam int quantity) {
        try {
            Users user = (Users) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            Long userId = user.getId();

            if (cartId == null) {
                cartId = cartService.initialiseNewCart(userId);
            }


        cartItemService.addCartItem(cartId, productId, quantity);
        return ResponseEntity.ok(new ApiResponse("Item added to cart successfully ", null));
    }catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(),null));
        }
    }
    @DeleteMapping("/cart/{cartId}/item/{productId}/remove")
    public ResponseEntity<ApiResponse> removeCartItem(@PathVariable Long cartId,
                                                       @PathVariable Long productId) {
        try{
        cartItemService.removeCartItem(cartId, productId);
        return ResponseEntity.ok(new ApiResponse("Item removed from cart successfully ", null));
        }catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(),null));
        }
    }
    @PutMapping("/cart/{cartId}/item/{productId}/update")
    public ResponseEntity<ApiResponse> updateCartItem(@PathVariable Long cartId,
                                                       @PathVariable Long productId,
                                                       @RequestParam int quantity) {
        try{
        cartItemService.updateCartItem(cartId, productId, quantity);
        return ResponseEntity.ok(new ApiResponse("Item updated successfully ", null));
        }catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(),null));
        }
    }
}
