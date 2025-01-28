package com.pu.chat.Controllers;

import com.pu.chat.Models.LoginRequest;
import com.pu.chat.Models.MessageDto;
import com.pu.chat.Models.MessageRequest;
import com.pu.chat.Services.ChannelService;
import com.pu.chat.Services.FriendsService;
import com.pu.chat.Services.MessagesService;
import com.pu.chat.Services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@RestController
public class MessagesController {
    private final MessagesService messagesService;
    private final UserService userService;
    private final ChannelService channelService;
    private final FriendsService friendsService;

    public MessagesController(MessagesService messagesService, UserService userService, ChannelService channelService, FriendsService friendsService) {
        this.messagesService = messagesService;
        this.userService = userService;
        this.channelService = channelService;
        this.friendsService = friendsService;
    }

    @GetMapping("/messages/channels/{Id}")
    public ResponseEntity getAllMessagesForChannel(@ModelAttribute LoginRequest request, @PathVariable("Id") Long channelId) {
        var user =  userService.getAuthUser(request.getEmail(), request.getPassword());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("unauthorized");
        }

        var channel = this.channelService.getById(channelId);
        if (channel == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("channel not found");
        }

        var userChannel = this.channelService.getUserChannel(user, channel);
        if (userChannel == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("user is not part of this channel");
        }

        var messages = this.messagesService.getAllByChannel(channel);

        var result = new ArrayList<MessageDto>();
        for (int i = 0; i < messages.size(); i++) {
            var currentMessage = messages.get(i);

            var dto = new MessageDto();
            dto.setMessage(currentMessage.getMessage());
            dto.setCreatedAt(currentMessage.getCreatedAt());
            dto.setSenderEmail(currentMessage.getSenderUser().getEmail());
            dto.setSenderUsername(currentMessage.getSenderUser().getUsername());
            result.add(dto);
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/messages/friends/{username}")
    public ResponseEntity getAllMessagesForFriend(@ModelAttribute LoginRequest request, @PathVariable("username") String username) {
        var user =  userService.getAuthUser(request.getEmail(), request.getPassword());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("unauthorized");
        }

        var userTwo = this.userService.getByUsername(username);
        if (userTwo == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("user not found");
        }

        var friend = this.friendsService.getFriendForUser(user, userTwo);
        if (friend == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("you are not friend with that user");
        }

        var messages = this.messagesService.getAllByFriend(friend);

        var result = new ArrayList<MessageDto>();
        for (int i = 0; i < messages.size(); i++) {
            var currentMessage = messages.get(i);

            var dto = new MessageDto();
            dto.setMessage(currentMessage.getMessage());
            dto.setCreatedAt(currentMessage.getCreatedAt());
            dto.setSenderEmail(currentMessage.getSenderUser().getEmail());
            dto.setSenderUsername(currentMessage.getSenderUser().getUsername());
            result.add(dto);
        }
        return ResponseEntity.ok(result);
    }

    @PostMapping("/messages/channels/{Id}")
    public ResponseEntity postMessageToChannel(@RequestBody MessageRequest request, @PathVariable("Id") Long channelId) {
        var user =  userService.getAuthUser(request.getEmail(), request.getPassword());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("unauthorized");
        }

        var channel = this.channelService.getById(channelId);
        if (channel == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("channel not found");
        }

        var userChannel = this.channelService.getUserChannel(user, channel);
        if (userChannel == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("user is not part of this channel");
        }

        this.messagesService.addMessageToChannel(channel, user, request.getMessage());
        return ResponseEntity.ok("OK");
    }

    @PostMapping("/messages/friends/{username}")
    public ResponseEntity postMessageToFriend(@RequestBody MessageRequest request, @PathVariable("username") String username) {
        var user =  userService.getAuthUser(request.getEmail(), request.getPassword());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("unauthorized");
        }

        var userTwo = this.userService.getByUsername(username);
        if (userTwo == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("user not found");
        }

        var friend = this.friendsService.getFriendForUser(user, userTwo);
        if (friend == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("you are not friend with that user");
        }

        this.messagesService.addMessageToFriend(friend, user, request.getMessage());
        return ResponseEntity.ok("OK");
    }
}