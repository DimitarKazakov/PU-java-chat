package com.pu.chat.Repositories;

import com.pu.chat.Entity.Friend;
import com.pu.chat.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FriendsRepository extends JpaRepository<Friend, Long> {

    List<Friend> findByUserOne(User userOne);

    List<Friend> findByUserTwo(User userTwo);
}