package org.example.backendmac.DTO.AdminDTO;

import lombok.Getter;

import java.math.BigDecimal;

@Getter
public class AdminStatsDTO {
    private long totalOrders;
    private BigDecimal totalRevenue;

    public AdminStatsDTO(long totalOrders, BigDecimal totalRevenue) {
        this.totalOrders = totalOrders;
        this.totalRevenue = totalRevenue;
    }

}