package com.pu.chat.Services;

import com.pu.chat.Entity.Channel;
import com.pu.chat.Entity.Friend;
import com.pu.chat.Entity.Message;
import com.pu.chat.Entity.User;
import com.pu.chat.Repositories.FriendsRepository;
import com.pu.chat.Repositories.MessagesRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessagesService {
    private final MessagesRepository repository;

    public MessagesService(MessagesRepository repository) {
        this.repository = repository;
    }

    public List<Message> getAllByChannel(Channel channel) {
        return repository.findByChannel(channel);
    }

    public List<Message> getAllByFriend(Friend friend) {
        return repository.findByFriends(friend);
    }

    public Message addMessageToChannel(Channel channel, User senderUser, String messageStr) {
        var message = new Message();
        message.setMessage(messageStr);
        message.setSenderUser(senderUser);
        message.setChannel(channel);
        this.repository.save(message);
        return message;
    }

    public Message addMessageToFriend(Friend friend,User senderUser, String messageStr) {
        var message = new Message();
        message.setMessage(messageStr);
        message.setSenderUser(senderUser);
        message.setFriends(friend);
        this.repository.save(message);
        return message;
    }
}