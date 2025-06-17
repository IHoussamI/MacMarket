package org.example.backendmac.models.cart;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.backendmac.models.cartitem.CartItem;
import org.example.backendmac.models.user.Users;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="cart")
public class Cart {

    @GeneratedValue (strategy = GenerationType.IDENTITY)
    @Id
    private Long id ;
    private BigDecimal totalAmount =BigDecimal.ZERO;


    @OneToMany (mappedBy = "cart" , cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private Set<CartItem> items= new HashSet<>();

    @OneToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private Users user;

    public void addCartItem(CartItem item) {
        this.items.add(item);
        item.setCart(this);
        updateTotalAmount();

    }

    private void updateTotalAmount() {
    this.totalAmount = items.stream()
            .map(item -> {
                BigDecimal unitPrice = item.getUnitPrice();
                if (unitPrice == null) {
                    return BigDecimal.ZERO;
                }
                return unitPrice.multiply(new BigDecimal(item.getQuantity()));
            })
            .reduce(BigDecimal.ZERO, BigDecimal::add);
}


    public void removeCartItem(CartItem item) {
        this.items.remove(item);
        item.setCart(null);
        updateTotalAmount();
    }
}
