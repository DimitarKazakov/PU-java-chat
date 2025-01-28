package com.pu.chat.Repositories;

import java.util.Optional;

import com.pu.chat.Entity.User;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmailAndPasswordAndIsDeletedFalse(String email, String password);

    Optional<User> findByUsernameAndIsDeletedFalse(String username);
}