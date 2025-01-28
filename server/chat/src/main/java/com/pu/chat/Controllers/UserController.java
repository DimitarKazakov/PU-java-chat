package com.pu.chat.Controllers;

import com.pu.chat.Models.LoginRequest;
import com.pu.chat.Models.UserDto;
import com.pu.chat.Services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;


@RestController
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users")
    public ResponseEntity getAllUsers(@ModelAttribute LoginRequest request) {
        var user =  userService.getAuthUser(request.getEmail(), request.getPassword());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("unauthorized");
        }

        var users = userService.getAll();

        var results = new ArrayList<UserDto>();
        for (int i = 0; i < users.size(); i++) {
            var userDto = new UserDto();
            userDto.setEmail(users.get(i).getEmail());
            userDto.setUsername(users.get(i).getUsername());
            results.add(userDto);
        }

        return ResponseEntity.ok(results);
    }
}