package org.example.backendmac.DTOs.ProductDTO;




import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.DecimalMin;

import java.math.BigDecimal;


@Data
public class ProductRequestDTO {

    @NotBlank(message = "Product name is required")
    private String name;

    private BigDecimal oldprice;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than zero")
    private BigDecimal price;

    private String description;

    private String imageUrl;
}