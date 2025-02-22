package org.example.backendmac.Authentification.Auth;

import lombok.RequiredArgsConstructor;
import org.example.backendmac.Authentification.Config.JwtService;
import org.example.backendmac.Others.Role.Role;
import org.example.backendmac.Repositories.UserRepository;
import org.example.backendmac.Services.cart.CartService;
import org.example.backendmac.models.user.Users;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

  private final UserRepository repository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;
  private final AuthenticationManager authenticationManager;

  @Autowired
  private final CartService cartService;

  public AuthenticationResponse register(RegisterRequest request) {
    var user = Users.builder()
            .firstname(request.getFirstname())
            .lastname(request.getLastname())
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .role(Role.USER)
            .build();
    repository.save(user);
    cartService.initialiseNewCart(user.getId());

    var jwtToken = jwtService.generateToken(user);
    return AuthenticationResponse.builder()
            .token(jwtToken)
            .build();
  }

  public AuthenticationResponse authenticate(AuthenticationRequest request) {
    authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                    request.getEmail(),
                    request.getPassword()
            )
    );
    var user = repository.findByEmail(request.getEmail())
            .orElseThrow();
    var jwtToken = jwtService.generateToken((UserDetails) user);
    return AuthenticationResponse.builder()
            .token(jwtToken)
            .firstname(user.getFirstname())
            .build();
  }
}
