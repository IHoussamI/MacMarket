package org.example.backendmac.DTOs.TopProductDTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TopProductDTO {
    private String productName;     // Name of the product
    private Long quantitySold;      // Total quantity sold
}