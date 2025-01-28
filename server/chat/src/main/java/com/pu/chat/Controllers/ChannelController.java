package com.pu.chat.Controllers;

import com.pu.chat.Models.*;
import com.pu.chat.Services.ChannelService;
import com.pu.chat.Services.FriendsService;
import com.pu.chat.Services.UserService;
import org.apache.juli.logging.Log;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@RestController
public class ChannelController {
    private final ChannelService channelService;
    private final UserService userService;

    public ChannelController(ChannelService channelService, UserService userService) {
        this.channelService = channelService;
        this.userService = userService;
    }

    @GetMapping("/channels")
    public ResponseEntity getAvailableChannels(@ModelAttribute LoginRequest request) {
        var user =  userService.getAuthUser(request.getEmail(), request.getPassword());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("unauthorized");
        }

        var userChannels = this.channelService.getAllForUser(user);

        var results = new ArrayList<ChannelDto>();
        for (int i = 0; i < userChannels.size(); i++) {
            var currentUserChannel = userChannels.get(i);

            var userForChannel = this.channelService.getAllUserByChannel(currentUserChannel.getChannel());
            var currentChannel = currentUserChannel.getChannel();

            var channelUserDtos = new ArrayList<UserChannelDto>();
            for (int j = 0; j < userForChannel.size(); j++) {
                var currentUserForChannel = userForChannel.get(j).getUser();

                var channelUserDto = new UserChannelDto();
                channelUserDto.setId(currentUserForChannel.getId());
                channelUserDto.setEmail(currentUserForChannel.getEmail());
                channelUserDto.setRole(userForChannel.get(j).getRole());
                channelUserDto.setUsername(currentUserForChannel.getUsername());

                channelUserDtos.add(channelUserDto);
            }

            var channelDto = new ChannelDto();
            channelDto.setId(currentChannel.getId());
            channelDto.setCreatedAt(currentChannel.getCreatedAt());
            channelDto.setName(currentChannel.getName());
            channelDto.setUsers(channelUserDtos);

            results.add(channelDto);
        }

        return ResponseEntity.ok(results);
    }

    @PostMapping("/channels")
    public ResponseEntity createChannel(@RequestBody StoreChannelRequest request) {
        var user =  userService.getAuthUser(request.getEmail(), request.getPassword());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("unauthorized");
        }

        if (request.getName().length() < 6) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("channel name is too short");
        }


        var channel = this.channelService.createChannel(request.getName(), user);
        if (channel == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("error adding channel");
        }

        return ResponseEntity.ok().body("OK");
    }

    @PutMapping("/channels/name/{Id}")
    public ResponseEntity editChannelName(@RequestBody StoreChannelRequest request, @PathVariable("Id") Long channelId) {
        var user =  userService.getAuthUser(request.getEmail(), request.getPassword());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("unauthorized");
        }

        if (request.getName().length() < 6) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("channel name is too short");
        }

        var channel = this.channelService.getById(channelId);
        if (channel == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("channel not found");
        }

        var userChannel = this.channelService.getUserChannel(user, channel);
        if (userChannel == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("user is not part of this channel");
        }

        if (userChannel.getRole().equals("GUEST")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("only owners and admins can change channel name");
        }

        this.channelService.editChannelName(channel, request.getName());

        return ResponseEntity.ok().body("OK");
    }

    @PostMapping("/channels/member/{Id}")
    public ResponseEntity addUserChannel(@RequestBody EditChannelMemberRequest request, @PathVariable("Id") Long channelId) {
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

        if (userChannel.getRole().equals("GUEST")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("only owners and admins can change roles in channels");
        }

        var userToEdit = userService.getByUsername(request.getUsername());
        if (userToEdit == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("user not found");
        }

        var userChannelToEdit = this.channelService.getUserChannel(userToEdit, channel);
        if (userChannelToEdit != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("user is already part of this channel");
        }

        this.channelService.addUserToChannel(userToEdit, channel);

        return ResponseEntity.ok().body("OK");
    }

    @DeleteMapping("/channels/member/{Id}")
    public ResponseEntity removeUserChannel(@RequestBody EditChannelMemberRequest request, @PathVariable("Id") Long channelId) {
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

        if (!userChannel.getRole().equals("OWNER")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("only owners can change roles in channels");
        }

        var userToEdit = userService.getByUsername(request.getUsername());
        if (userToEdit == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("user not found");
        }

        var userChannelToEdit = this.channelService.getUserChannel(userToEdit, channel);
        if (userChannelToEdit == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("user to edit is not part of this channel");
        }

        this.channelService.removeUserFromChannel(userChannelToEdit);

        return ResponseEntity.ok().body("OK");
    }

    @PutMapping("/channels/member/{Id}")
    public ResponseEntity editUserChannelRole(@RequestBody EditChannelMemberRoleRequest request, @PathVariable("Id") Long channelId) {
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

        if (!userChannel.getRole().equals("OWNER")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("only owners can change roles in channels");
        }

        var userToEdit = userService.getByUsername(request.getUsername());
        if (userToEdit == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("user not found");
        }

        var userChannelToEdit = this.channelService.getUserChannel(userToEdit, channel);
        if (userChannelToEdit == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("user to edit is not part of this channel");
        }

        if (!request.getRole().equals("ADMIN") && !request.getRole().equals("GUEST")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("only ADMIN and GUEST roles are allowed");
        }

        this.channelService.editUserChannelRole(userChannelToEdit, request.getRole());

        return ResponseEntity.ok().body("OK");
    }

    @DeleteMapping("/channels/{Id}")
    public ResponseEntity deleteChannel(@RequestBody LoginRequest request, @PathVariable("Id") Long channelId) {
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

        if (!userChannel.getRole().equals("OWNER")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("only owners can delete channels");
        }

        this.channelService.deleteChannel(channel);
        return ResponseEntity.ok().body("OK");
    }
}