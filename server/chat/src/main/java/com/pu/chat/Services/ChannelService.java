package com.pu.chat.Services;

import com.pu.chat.Entity.Channel;
import com.pu.chat.Entity.Friend;
import com.pu.chat.Entity.User;
import com.pu.chat.Entity.UserChannel;
import com.pu.chat.Repositories.ChannelRepository;
import com.pu.chat.Repositories.FriendsRepository;
import com.pu.chat.Repositories.UserChannelRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Stream;

@Service
public class ChannelService {
    private final ChannelRepository channelRepository;
    private final UserChannelRepository userChannelRepository;

    public ChannelService(ChannelRepository channelRepository, UserChannelRepository userChannelRepository, UserService userService) {
        this.channelRepository = channelRepository;
        this.userChannelRepository = userChannelRepository;
    }

    public List<UserChannel> getAllForUser(User user) {
        return userChannelRepository.findByUserAndIsDeletedFalse(user);
    }

    public List<UserChannel> getAllUserByChannel(Channel channel) {
        return userChannelRepository.findByChannelAndIsDeletedFalse(channel);
    }

    public Channel getById(Long id) {
        return channelRepository.findById(id).orElse(null);
    }

    public UserChannel getUserChannel(User user, Channel channel) {
        return userChannelRepository.findByChannelAndUserAndIsDeletedFalse(channel, user).orElse(null);
    }

    public Channel editChannelName(Channel channel, String name) {
        channel.setName(name);
        this.channelRepository.save(channel);
        return channel;
    }

    public UserChannel editUserChannelRole(UserChannel userChannel, String role) {
        userChannel.setRole(role);
        this.userChannelRepository.save(userChannel);
        return userChannel;
    }

    public UserChannel removeUserFromChannel(UserChannel userChannel) {
        userChannel.setDeleted(true);
        this.userChannelRepository.save(userChannel);
        return userChannel;
    }

    public UserChannel addUserToChannel(User user, Channel channel) {
        var userChannel = new UserChannel();
        userChannel.setChannel(channel);
        userChannel.setUser(user);
        userChannel.setRole("GUEST");
        this.userChannelRepository.save(userChannel);
        return userChannel;
    }

    public Channel deleteChannel(Channel channel) {
        channel.setDeleted(true);
        this.channelRepository.save(channel);
        return channel;
    }

    public Channel createChannel(String name, User user) {
        var newChannel = new Channel();
        newChannel.setName(name);
        var channel = this.channelRepository.save(newChannel);

        var newUserChannel = new UserChannel();
        newUserChannel.setChannel(channel);
        newUserChannel.setUser(user);
        newUserChannel.setRole("OWNER");

        this.userChannelRepository.save(newUserChannel);

        return channel;
    }

}