package com.selly.fullstack_backend.controller;


import com.selly.fullstack_backend.dto.CreateUserRequest;
import com.selly.fullstack_backend.exception.UserNotFoundException;
import com.selly.fullstack_backend.model.Role;
import com.selly.fullstack_backend.model.User;
import com.selly.fullstack_backend.repository.UserRepository;
import com.selly.fullstack_backend.service.JwtService;
import com.selly.fullstack_backend.service.UserDetailsServiceImp;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserDetailsServiceImp userDetailsService;

    @PostMapping("/admin/user")
    public ResponseEntity<?> createUser(@Valid @RequestBody CreateUserRequest request){
        UserDetails currentUser = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // Check if the current user has admin authority
        if(currentUser.getAuthorities().stream().noneMatch(authority -> authority.getAuthority().equals("ADMIN"))) {
            return new ResponseEntity<>("Only admins can create users", HttpStatus.FORBIDDEN);
        }

        try {
            // Create and set user properties using the validated request object
            User newUser = new User();
            newUser.setFirstName(request.getFirstName());
            newUser.setLastName(request.getLastName());
            newUser.setUsername(request.getUsername());
            newUser.setEmail(request.getEmail());
            newUser.setRole(Role.valueOf(request.getRole().toUpperCase()));

            User createdUser = userRepository.save(newUser);
            return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/admin/users")
    public ResponseEntity<List<User>> getAllUsers() {
        UserDetails currentUser = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // Check if the current user has admin authority
        if(currentUser.getAuthorities().stream().noneMatch(role -> role.getAuthority().equals("ADMIN"))) {
            throw new RuntimeException("Only admins can view users");
        }

        // Fetch all users and filter for those with the USER role
        List<User> filteredUsers = userRepository.findAll().stream()
                .filter(user -> Role.USER.equals(user.getRole()))
                .collect(Collectors.toList());

        return new ResponseEntity<>(filteredUsers, HttpStatus.OK);
    }

    @GetMapping("/admin/user/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Integer id) {
        UserDetails currentUser = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // Check if the current user has admin authority
        if(currentUser.getAuthorities().stream().noneMatch(role -> role.getAuthority().equals("ADMIN"))) {
            throw new RuntimeException("Only admins can view user details");
        }

        // Find the user to be displayed
        User user = userRepository.findById(id).orElse(null);

        if (user == null) {
            return new ResponseEntity<>("User not found with id: " + id, HttpStatus.NOT_FOUND);
        }

        // Prevent viewing to other admins
        if (user.getRole() == Role.ADMIN) {
            return new ResponseEntity<>("You are not allowed to view other admins", HttpStatus.FORBIDDEN);
        }

        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @PutMapping("/admin/user/{id}")
    public ResponseEntity<?> updateUser(@RequestBody User newUser, @PathVariable Integer id){
        UserDetails currentUser = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // Check if the current user has admin authority
        if(currentUser.getAuthorities().stream().noneMatch(role -> role.getAuthority().equals("ADMIN"))) {
            throw new RuntimeException("Only admins can update user");
        }

        // Find the user to be updated
        User user = userRepository.findById(id).orElse(null);

        if (user == null) {
            return new ResponseEntity<>("User not found with id: " + id, HttpStatus.NOT_FOUND);
        }

        // Prevent updates to other admins' details
        if (user.getRole() == Role.ADMIN) {
            return new ResponseEntity<>("You are not allowed to change other admins' details", HttpStatus.FORBIDDEN);
        }

        // Update fields if provided in the request
        if (newUser.getFirstName() != null) {
            user.setFirstName(newUser.getFirstName());
        }
        if (newUser.getLastName() != null) {
            user.setLastName(newUser.getLastName());
        }
        if (newUser.getUsername() != null) {
            user.setUsername(newUser.getUsername());
        }
        if (newUser.getEmail() != null) {
            user.setEmail(newUser.getEmail());
        }
        // Ensure the role is not changed
        if (newUser.getRole() != null && !user.getRole().equals(newUser.getRole())) {
            return new ResponseEntity<>("Role cannot be changed", HttpStatus.FORBIDDEN);
        }

        // Save the updated user
        User updatedUser = userRepository.save(user);
        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }

    @DeleteMapping("/admin/user/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Integer id) {
        UserDetails currentUser = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // Check if the current user has admin authority
        if (currentUser.getAuthorities().stream().noneMatch(role -> role.getAuthority().equals("ADMIN"))) {
            throw new RuntimeException("Only admins can delete user");
        }

        // Find the user to be deleted
        User user = userRepository.findById(id).orElse(null);

        if (user == null) {
            return new ResponseEntity<>("User not found with id: " + id, HttpStatus.NOT_FOUND);
        }

        // Prevent deleting other admins
        if (user.getRole() == Role.ADMIN) {
            return new ResponseEntity<>("You are not allowed to delete other admins", HttpStatus.FORBIDDEN);
        }

        // Delete the user
        userRepository.deleteById(id);
        return new ResponseEntity<>("User deleted with id: " + id, HttpStatus.OK);
    }
}
