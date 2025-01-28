package com.pu.chat.Repositories;

import com.pu.chat.Entity.Channel;
import com.pu.chat.Entity.Friend;
import com.pu.chat.Entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessagesRepository extends JpaRepository<Message, Long> {
    List<Message> findByFriends(Friend friend);

    List<Message> findByChannel(Channel channel);
}