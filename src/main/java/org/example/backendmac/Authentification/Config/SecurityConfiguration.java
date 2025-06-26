package org.example.backendmac.Authentification.Config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

import static org.example.backendmac.Others.Role.Permission.*;
import static org.example.backendmac.Others.Role.Role.*;
import static org.springframework.http.HttpMethod.*;
import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfiguration {


    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(req -> req

                        // PUBLIC
                        .requestMatchers("/auth/**", "/images/**").permitAll()

                        // CART (USER)
                        .requestMatchers(POST, "/cart/create").hasRole(USER.name())
                        .requestMatchers(GET, "/cart/{cartId}").hasRole(USER.name())
                        .requestMatchers(DELETE, "/cart/{cartId}/clear").hasRole(USER.name())
                        .requestMatchers(GET, "/cart/{cartId}/totalprice").hasRole(USER.name())

                        // CART ITEM (USER)
                        .requestMatchers(POST, "/cartItem/item/add").hasRole(USER.name())
                        .requestMatchers(GET, "/cartItem").hasRole(USER.name())
                        .requestMatchers(DELETE, "/cartItem/cart/{cartId}/item/{productId}").hasRole(USER.name())
                        .requestMatchers(PUT, "/cartItem/cart/{cartId}/item/{productId}/update").hasRole(USER.name())

                        //PRODUCT
                        .requestMatchers(GET, "/products").permitAll()
                        .requestMatchers(GET,"/products/{id}").permitAll()
                        .requestMatchers(POST,"/create").hasRole((ADMIN.name()))
                        .requestMatchers(PUT,"/{id}").hasRole(ADMIN.name())
                        .requestMatchers(DELETE,"/{id}").hasRole(ADMIN.name())


                        // ORDERS
                        .requestMatchers(POST, "/orders/create/**").hasRole(USER.name())
                        .requestMatchers(GET, "/orders").hasRole(ADMIN.name())
                        .requestMatchers(GET, "/orders/user/**").hasRole(ADMIN.name())
                        .requestMatchers(GET, "/orders/{orderId}").hasRole(ADMIN.name())
                        .requestMatchers(GET, "/orders/statistics/sales-over-time").hasRole(ADMIN.name())
                        .requestMatchers(GET, "/orders/top-products").hasRole(ADMIN.name())

                        // USERS
                        .requestMatchers(POST, "/users").permitAll()
                        .requestMatchers(GET, "/users").permitAll()
                        .requestMatchers(GET, "/users/{id}").hasRole(ADMIN.name())
                        .requestMatchers(PUT, "/users/{id}").hasRole(ADMIN.name())
                        .requestMatchers(DELETE, "/users/{id}").hasRole(ADMIN.name())

                        // DEFAULT RULE
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);


        return http.build();
    }
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:4200"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}

