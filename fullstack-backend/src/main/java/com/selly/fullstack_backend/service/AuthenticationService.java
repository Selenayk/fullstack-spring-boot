package com.selly.fullstack_backend.service;

import com.selly.fullstack_backend.model.Role;
import com.selly.fullstack_backend.model.Token;
import com.selly.fullstack_backend.model.User;
import com.selly.fullstack_backend.repository.TokenRepository;
import com.selly.fullstack_backend.model.AuthenticationResponse;
import com.selly.fullstack_backend.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuthenticationService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    private final TokenRepository tokenRepository;

    private final AuthenticationManager authenticationManager;

    public AuthenticationService(UserRepository repository,
                                 PasswordEncoder passwordEncoder,
                                 JwtService jwtService,
                                 TokenRepository tokenRepository,
                                 AuthenticationManager authenticationManager) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.tokenRepository = tokenRepository;
        this.authenticationManager = authenticationManager;
    }

    public AuthenticationResponse register(User request) {

        if (request.getFirstName() == null || request.getFirstName().isEmpty()) {
            return new AuthenticationResponse(null, null, "First name is required");
        }
        if (request.getLastName() == null || request.getLastName().isEmpty()) {
            return new AuthenticationResponse(null, null, "Last name is required");
        }
        if (request.getUsername() == null || request.getUsername().isEmpty()) {
            return new AuthenticationResponse(null, null, "Username is required");
        }
        if (request.getEmail() == null || request.getEmail().isEmpty()) {
            return new AuthenticationResponse(null, null, "Email is required");
        }
        if (request.getPassword() == null || request.getPassword().isEmpty()) {
            return new AuthenticationResponse(null, null, "Password is required");
        }
        if (request.getRole() != Role.USER && request.getRole() != Role.ADMIN) {
            return new AuthenticationResponse(null, null, "Role can be 'USER' or 'ADMIN'");
        }

        if(repository.findByUsername(request.getUsername()).isPresent()) {
            return new AuthenticationResponse(null, null, "User already exists");
        }

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());

        user = repository.save(user);

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        saveUserToken(accessToken, refreshToken, user);
        
        return new AuthenticationResponse(accessToken, refreshToken, "User registration was successfull");
    }

    public AuthenticationResponse authenticate(User request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()));

        User user = repository.findByUsername(request.getUsername()).orElseThrow();
        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        revokeAllTokenByUser(user);
        saveUserToken(accessToken, refreshToken, user);

        return new AuthenticationResponse(accessToken, refreshToken, "User login was successful");
    }

    private void revokeAllTokenByUser(User user) {
        List<Token> validTokens = tokenRepository.findAllAccessTokensByUser(user.getId());
        if(validTokens.isEmpty()) {
            return;
        }

        validTokens.forEach(t -> t.setLoggedOut(true));

        tokenRepository.saveAll(validTokens);
    }

    private void saveUserToken(String accessToken, String refreshToken, User user) {
        Token token = new Token();
        token.setAccessToken(accessToken);
        token.setRefreshToken(refreshToken);
        token.setLoggedOut(false);
        token.setUser(user);
        tokenRepository.save(token);
    }

    public ResponseEntity<AuthenticationResponse> refreshToken(HttpServletRequest request) {
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        if(authHeader == null || !authHeader.startsWith("Bearer ")) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        String token = authHeader.substring(7);

        // extract username from token
        String username = jwtService.extractUsername(token);

        // check if the user exist in database
        User user = repository.findByUsername(username)
                .orElseThrow(()->new RuntimeException("No user found"));

        // check if the token is valid
        if(jwtService.isValidRefreshToken(token, user)) {
            // generate access token
            String accessToken = jwtService.generateAccessToken(user);
            String refreshToken = jwtService.generateRefreshToken(user);

            revokeAllTokenByUser(user);
            saveUserToken(accessToken, refreshToken, user);

            return new ResponseEntity<>(new AuthenticationResponse(accessToken, refreshToken, "New token generated"), HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);

    }

    public void logout(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if(authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
        }
    }
}
