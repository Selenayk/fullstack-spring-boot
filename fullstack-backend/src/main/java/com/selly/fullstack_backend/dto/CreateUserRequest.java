package com.selly.fullstack_backend.dto;


import com.selly.fullstack_backend.model.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CreateUserRequest {

    private String firstName;
    private String lastName;
    private String username;
    private String email;
    private String role;

    public String getFirstName() {
        if (firstName == null || firstName.isEmpty()) {
            throw new IllegalArgumentException("First name is required");
        }
        return firstName;
    }

    public void setFirstName(String firstName) {
        if (firstName == null || firstName.isEmpty()) {
            throw new IllegalArgumentException("First name is required");
        }
        this.firstName = firstName;
    }

    public String getLastName() {
        if (lastName == null || lastName.isEmpty()) {
            throw new IllegalArgumentException("Last name is required");
        }
        return lastName;
    }

    public void setLastName(String lastName) {
        if (lastName == null || lastName.isEmpty()) {
            throw new IllegalArgumentException("Last name is required");
        }
        this.lastName = lastName;
    }

    public String getUsername() {
        if (username == null || username.isEmpty()) {
            throw new IllegalArgumentException("Username is required");
        }
        return username;
    }

    public void setUsername(String username) {
        if (username == null || username.isEmpty()) {
            throw new IllegalArgumentException("Username is required");
        }
        this.username = username;
    }

    public String getEmail() {
        if (email == null || email.isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }
        return email;
    }

    public void setEmail(String email) {
        if (email == null || email.isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        try {
            Role roleEnum = Role.valueOf(role.toUpperCase());
            if (roleEnum != Role.USER) {
                throw new IllegalArgumentException("Admins can only add users with the role 'USER'");
            }
            this.role = role;
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid role provided");
        }
    }
}
