package org.example.backendmac.Controllers.Order;

import lombok.RequiredArgsConstructor;
import org.example.backendmac.DTO.Order.OrderDTO;
import org.example.backendmac.DTO.mapper.OrderMapper;
import org.example.backendmac.Services.Order.OrderService;
import org.example.backendmac.models.Order.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/create/{cartId}")
    public ResponseEntity<?> createOrder(@PathVariable Long cartId) {
        Order order = orderService.createOrderFromCart(cartId);
        OrderDTO orderDTO = OrderMapper.toDTO(order);
        return ResponseEntity.ok(orderDTO);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OrderDTO>> getOrdersByUser(@PathVariable Long userId) {
        List<Order> orders = orderService.getOrdersForUser(userId);
        List<OrderDTO> dtos = orders.stream()
                .map(OrderMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderDTO> getOrder(@PathVariable Long orderId) {
        Order order = orderService.getOrderById(orderId);
        OrderDTO dto = OrderMapper.toDTO(order);
        return ResponseEntity.ok(dto);
    }

    @GetMapping()
    public ResponseEntity<List<OrderDTO>> getOrders() {
        List<OrderDTO> Orders = orderService.getAllOrders();
        return new ResponseEntity<>(Orders, HttpStatus.OK);
    }
    }