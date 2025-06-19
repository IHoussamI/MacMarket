package org.example.backendmac.DTO.mapper;

import org.example.backendmac.DTO.ClientInfoDTO.ClientInfoDTO;
import org.example.backendmac.DTO.Order.OrderDTO;
import org.example.backendmac.DTO.OrderItemDTO.OrderItemDTO;
import org.example.backendmac.models.Order.Order;
import org.example.backendmac.models.OrderItem.OrderItem;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class OrderMapper {

    public static OrderDTO toDTO(Order order) {
        if (order == null) return null;

        List<OrderItemDTO> orderItemsDTO = order.getOrderItems().stream()
                .map(OrderMapper::toDTO)
                .collect(Collectors.toList());

        ClientInfoDTO clientInfoDTO = null;
        if (order.getUser() != null) {
            clientInfoDTO = new ClientInfoDTO(
                    order.getUser().getFirstname(),
                    order.getUser().getLastname(),
                    order.getUser().getEmail(),
                    order.getUser().getCity()
            );
        }

        return new OrderDTO(
                order.getId(),
                order.getOrderDate(),
                order.getTotalAmount(),
                order.getUser() != null ? order.getUser().getId() : null,
                orderItemsDTO,
                order.getAddress(),
                order.getPhone(),
                clientInfoDTO
        );
    }

    public static OrderItemDTO toDTO(OrderItem orderItem) {
        if (orderItem == null) return null;

        return new OrderItemDTO(
                orderItem.getId(),
                orderItem.getQuantity(),
                orderItem.getUnitPrice(),
                orderItem.getTotalPrice(),
                orderItem.getProduct() != null ? orderItem.getProduct().getId() : null,
                orderItem.getProduct() != null ? orderItem.getProduct().getName() : null // optional
        );
    }

    public static Order toEntity(OrderDTO orderDTO) {
        if (orderDTO == null) return null;

        Order order = new Order();
        order.setId(orderDTO.getId());
        order.setOrderDate(orderDTO.getOrderDate());
        order.setTotalAmount(orderDTO.getTotalAmount());
        order.setAddress(orderDTO.getDeliveryAddress()); // ✅ deliveryAddress → address
        order.setPhone(orderDTO.getPhone());

        if (orderDTO.getOrderItems() != null) {
            List<OrderItem> orderItems = orderDTO.getOrderItems().stream()
                    .map(OrderMapper::toEntity)
                    .collect(Collectors.toList());
            order.setOrderItems(Set.copyOf(orderItems));
        }

        return order;
    }

    public static OrderItem toEntity(OrderItemDTO dto) {
        if (dto == null) return null;

        OrderItem orderItem = new OrderItem();
        orderItem.setId(dto.getId());
        orderItem.setQuantity(dto.getQuantity());
        orderItem.setUnitPrice(dto.getUnitPrice());
        orderItem.setTotalPrice(dto.getTotalPrice());


        return orderItem;
    }
}
