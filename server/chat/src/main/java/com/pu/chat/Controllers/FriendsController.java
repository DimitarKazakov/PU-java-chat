package com.pu.chat.Controllers;

import com.pu.chat.Models.AddFriendRequest;
import com.pu.chat.Models.LoginRequest;
import com.pu.chat.Models.UserDto;
import com.pu.chat.Services.FriendsService;
import com.pu.chat.Services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@RestController
public class FriendsController {
    private final FriendsService friendsService;
    private final UserService userService;

    public FriendsController(FriendsService friendsService, UserService userService) {
        this.friendsService = friendsService;
        this.userService = userService;
    }

    @GetMapping("/friends")
    public ResponseEntity getAllFriends(@ModelAttribute LoginRequest request) {
        var user = userService.getAuthUser(request.getEmail(), request.getPassword());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("unauthorized");
        }

        var friends = this.friendsService.getAllForUser(user);
        var results = new ArrayList<UserDto>();
        for (int i = 0; i < friends.size(); i++) {
            var userDto = new UserDto();

            var userFriend = friends.get(i).getUserOne();
            if (userFriend.getEmail().equals(request.getEmail())) {
                userFriend = friends.get(i).getUserTwo();
            }

            userDto.setEmail(userFriend.getEmail());
            userDto.setUsername(userFriend.getUsername());
            results.add(userDto);
        }

        return ResponseEntity.ok(results);
    }

    @PostMapping("/friends")
    public ResponseEntity addFriend(@RequestBody AddFriendRequest  request) {
        var user =  userService.getAuthUser(request.getEmail(), request.getPassword());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("unauthorized");
        }

        var userTwo = userService.getByUsername(request.getFriendUsername());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("friend user not found");
        }

       var existingFriend =  this.friendsService.getFriendForUser(user, userTwo);
        if (existingFriend != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("friend already exists");
        }

        var friends = this.friendsService.insert(user.getUsername(), userTwo.getUsername());
        if (friends == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("error adding friend user");
        }

        return ResponseEntity.ok().body("OK");
    }
}
