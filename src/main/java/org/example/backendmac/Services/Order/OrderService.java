package org.example.backendmac.Services.Order;

import lombok.RequiredArgsConstructor;
import org.example.backendmac.DTOs.Order.OrderDTO;
import org.example.backendmac.DTOs.SalesDTO.SalesDataDTO;
import org.example.backendmac.DTOs.TopProductDTO.TopProductDTO;
import org.example.backendmac.DTOs.mapper.OrderMapper;
import org.example.backendmac.Repositories.Order.OrderRepository;
import org.example.backendmac.Services.cart.CartService;
import org.example.backendmac.Services.user.UserService;
import org.example.backendmac.models.Order.Order;
import org.example.backendmac.models.OrderItem.OrderItem;
import org.example.backendmac.models.cart.Cart;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserService userService;
    private final CartService cartService;

    public Order createOrderFromCart(Long cartId) {
        Cart cart = cartService.getCart(cartId);

        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty. Cannot create order.");
        }

        Order order = new Order();
        order.setUser(cart.getUser());
        order.setOrderDate(LocalDateTime.now());

        List<OrderItem> orderItems = cart.getItems().stream().map(cartItem -> {
            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setUnitPrice(cartItem.getUnitPrice());
            orderItem.setTotalPrice(cartItem.getTotalPrice());
            orderItem.setOrder(order);
            return orderItem;
        }).toList();

        order.setOrderItems(new HashSet<>(orderItems));

        BigDecimal totalAmount = orderItems.stream()
                .map(OrderItem::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        order.setTotalAmount(totalAmount);

        Order savedOrder = orderRepository.save(order);
        cartService.clearCart(cartId);

        return savedOrder;
    }
    public List<OrderDTO> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream()
                .map(OrderMapper::toDTO)
                .collect(Collectors.toList());
    }


    public List<Order> getOrdersForUser(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    public Order getOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    public List<SalesDataDTO> getSalesOverTime() {
        return orderRepository.getSalesGroupedByDate();
    }

    public List<TopProductDTO> getTopSellingProducts() {
        return orderRepository.findTopSellingProducts();
    }
}
