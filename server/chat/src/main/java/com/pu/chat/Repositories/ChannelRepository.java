package com.pu.chat.Repositories;

import com.pu.chat.Entity.Channel;
import com.pu.chat.Entity.Friend;
import com.pu.chat.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChannelRepository extends JpaRepository<Channel, Long> {
    // TODO: remove ?
}