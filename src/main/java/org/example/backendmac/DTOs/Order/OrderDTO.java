package org.example.backendmac.DTOs.Order;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.backendmac.DTOs.ClientInfoDTO.ClientInfoDTO;
import org.example.backendmac.DTOs.OrderItemDTO.OrderItemDTO;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {
    private Long id;
    private LocalDateTime orderDate;
    private BigDecimal totalAmount;
    private Long userId;
    private List<OrderItemDTO> orderItems;

    private String deliveryAddress;
    private String phone;
    private ClientInfoDTO clientInfo;

}