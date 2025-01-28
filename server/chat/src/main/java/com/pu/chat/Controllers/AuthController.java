package com.pu.chat.Controllers;

import com.pu.chat.Entity.User;
import com.pu.chat.Models.LoginRequest;
import com.pu.chat.Models.RegisterRequest;
import com.pu.chat.Services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody LoginRequest request) {
        var user =  userService.getAuthUser(request.getEmail(), request.getPassword());

        if (user == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("user not found");
        }

        return ResponseEntity.ok(user);
    }

    @PostMapping("/register")
    public ResponseEntity register(@RequestBody RegisterRequest request) {
        if (request.getEmail().length() < 6 || !request.getEmail().contains("@")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("invalid email");
        }

        if (request.getPassword().length() < 6) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("invalid password");
        }

        if (request.getUsername().length() < 6 || request.getUsername() == request.getEmail()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("invalid username");
        }

        var user =  userService.getAuthUser(request.getEmail(), request.getPassword());
        if (user != null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("user already exists");
        }

        var newUser =  userService.insert(request.getEmail(), request.getPassword(), request.getUsername());

        if (newUser == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("error creating the user");
        }

        return ResponseEntity.ok(newUser);
    }
}