package org.example.backendmac.DTOs.SalesDTO;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
public class SalesDataDTO {
    private LocalDate date;
    private BigDecimal totalSales;

    }
