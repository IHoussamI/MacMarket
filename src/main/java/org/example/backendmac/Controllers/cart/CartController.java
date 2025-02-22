package org.example.backendmac.Controllers.cart;


import lombok.RequiredArgsConstructor;
import org.example.backendmac.Others.ApiResponse;
import org.example.backendmac.models.cart.Cart;
import org.example.backendmac.Others.ResourceNotFoundException;
import org.example.backendmac.Services.cart.iCartService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/cart")
@PreAuthorize("hasRole('USER')")
public class CartController {

    private final iCartService cartService;

    @PostMapping("/cart/create")
    public ResponseEntity<ApiResponse> createCart(@RequestParam Long userId) {
        try {
            Long newCartId = cartService.initialiseNewCart(userId);
            return ResponseEntity.ok(new ApiResponse("New cart created successfully", newCartId));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }


    @GetMapping("/{cartId}")
    public ResponseEntity<ApiResponse> getCart (@PathVariable Long cartId){
        try{

        Cart cart = cartService.getCart(cartId);
        return ResponseEntity.ok(new ApiResponse("Successfully",cart));
        }catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(),null));
        }

    }
    @DeleteMapping("/{cartId}/clear")
    public ResponseEntity<ApiResponse> clearCart (@PathVariable Long CartId){
        try{
        cartService.clearCart(CartId);
        return ResponseEntity.ok(new ApiResponse("Clear cart Successfully done !",null));
        }catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(),null));
        }
    }
    @GetMapping("/{cartId}/totalprice")
    public ResponseEntity<ApiResponse>getTotalPrice (@PathVariable Long CartId){
        try{
        BigDecimal totalprice = cartService.getTotalPrice(CartId);
        return ResponseEntity.ok(new ApiResponse("Total price",totalprice));
        }catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(),null));
        }
}
    }
