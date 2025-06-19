package org.example.backendmac.Controllers.rolesController;

import org.example.backendmac.DTO.AdminDTO.AdminStatsDTO;
import org.example.backendmac.Repositories.Order.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@CrossOrigin(origins = "http://localhost:4200")

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping("/stats")
    public AdminStatsDTO getStats() {
        long totalOrders = orderRepository.count();
        BigDecimal totalRevenue = orderRepository.getTotalRevenue();

        if (totalRevenue == null) {
            totalRevenue = BigDecimal.ZERO;
        }

        return new AdminStatsDTO(totalOrders, totalRevenue);
    }

}
