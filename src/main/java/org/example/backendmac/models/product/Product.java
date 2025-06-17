package org.example.backendmac.models.product;


import jakarta.persistence.*;
import lombok.Data;
import org.antlr.v4.runtime.misc.NotNull;

import java.math.BigDecimal;

@Entity
@Data
@Table (name="products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private String name;

    private BigDecimal oldprice;
    @NotNull
    private BigDecimal price;
    private String description;

    @Column(name = "image_url")
    private String imageUrl;



}
