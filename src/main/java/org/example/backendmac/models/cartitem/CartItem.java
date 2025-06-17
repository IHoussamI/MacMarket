package org.example.backendmac.models.cartitem;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.backendmac.models.cart.Cart;
import org.example.backendmac.models.product.Product;

import java.math.BigDecimal;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "cart_item")
public class CartItem {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private Long id;

    private int quantity;
    private BigDecimal unitPrice;
    private BigDecimal totalPrice;


    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)

    private Product product;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "cart_id")
    @JsonBackReference

    private Cart cart;

    public void setTotalPrice() {
        this.totalPrice = this.unitPrice.multiply(new BigDecimal(quantity));

    }

}
