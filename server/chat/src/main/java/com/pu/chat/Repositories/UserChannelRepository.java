package com.pu.chat.Repositories;

import com.pu.chat.Entity.Channel;
import com.pu.chat.Entity.Friend;
import com.pu.chat.Entity.User;
import com.pu.chat.Entity.UserChannel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface UserChannelRepository extends JpaRepository<UserChannel, Long> {

    List<UserChannel> findByUserAndIsDeletedFalse(User user);

    List<UserChannel> findByChannelAndIsDeletedFalse(Channel channel);

    Optional<UserChannel> findByChannelAndUserAndIsDeletedFalse(Channel channel, User user);
}