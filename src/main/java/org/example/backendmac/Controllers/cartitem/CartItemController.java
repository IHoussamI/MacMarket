package org.example.backendmac.Controllers.cartitem;


import lombok.RequiredArgsConstructor;
import org.example.backendmac.Others.ApiResponse;

import org.example.backendmac.Others.ResourceNotFoundException;
import org.example.backendmac.Services.cart.iCartItemService;
import org.example.backendmac.Services.cart.iCartService;
import org.example.backendmac.models.cart.Cart;
import org.example.backendmac.models.cartitem.CartItem;
import org.example.backendmac.models.user.Users;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@RequiredArgsConstructor
@RestController
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@RequestMapping("/cartItem")

public class CartItemController {
    private final iCartItemService cartItemService;
    private final iCartService cartService;

    @PostMapping("/item/add")
    public ResponseEntity<ApiResponse> addCartItem(@RequestParam (required = false) Long cartId,
                                                   @RequestParam Long productId,
                                                   @RequestParam int quantity) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            System.out.println("=== DEBUG INFO ===");
            System.out.println("Authentication object: " + authentication);
            System.out.println("Is authenticated: " + (authentication != null ? authentication.isAuthenticated() : "null"));

            if (authentication == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponse("No authentication found", null));
            }

            Object principal = authentication.getPrincipal();
            System.out.println("Principal class: " + principal.getClass().getName());
            System.out.println("Principal value: " + principal.toString());

            if (principal instanceof Users) {
                System.out.println("Principal is Users - SUCCESS!");
                Users user = (Users) principal;
                System.out.println("User ID: " + user.getId());
                System.out.println("User email: " + user.getEmail());

                Long userId = user.getId();

                if (cartId == null) {
                    cartId = cartService.initialiseNewCart(userId);
                }

                cartItemService.addCartItem(cartId, productId, quantity);
                return ResponseEntity.ok(new ApiResponse("Item added to cart successfully", null));

            } else if (principal instanceof String) {
                System.out.println("Principal is String: " + principal);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(new ApiResponse("Authentication principal is String, not Users object", null));

            } else {
                System.out.println("Principal is unknown type: " + principal.getClass().getName());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(new ApiResponse("Unknown principal type: " + principal.getClass().getName(), null));
            }

        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        } catch (Exception e) {
            System.out.println("Unexpected error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("Unexpected error: " + e.getMessage(), null));
        }
    }



    @GetMapping()
    public ResponseEntity<?> getCartItemsForUser() {
        Users user = (Users) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Long userId = user.getId();

        Cart cart = cartService.getCartByUserIdIfExists(userId); // return null if not found

        if (cart == null) {
            Map<String, Object> emptyResponse = new HashMap<>();
            emptyResponse.put("cartId", null);
            emptyResponse.put("items", Set.of());
            return ResponseEntity.ok(emptyResponse);
        }

        Set<CartItem> items = cartItemService.getCartItemsByCartId(cart.getId());

        Map<String, Object> response = new HashMap<>();
        response.put("cartId", cart.getId());
        response.put("items", items);

        return ResponseEntity.ok(response);
    }


    @DeleteMapping("/cart/{cartId}/item/{productId}")
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
                                                       @RequestParam  int quantity) {
        try{
        cartItemService.updateCartItem(cartId, productId, quantity);
        return ResponseEntity.ok(new ApiResponse("Item updated successfully ", null));
        }catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(),null));
        }
    }
}
