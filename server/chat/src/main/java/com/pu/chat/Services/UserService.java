package com.pu.chat.Services;

import com.pu.chat.Entity.User;
import com.pu.chat.Repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private final UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    public List<User> getAll() {
        return repository.findAll();
    }

    public User getById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public User getAuthUser(String email, String password) {
        return repository.findByEmailAndPasswordAndIsDeletedFalse(email, password).orElse(null);
    }

    public User getByUsername(String username) {
        return repository.findByUsernameAndIsDeletedFalse(username).orElse(null);
    }

    public User insert(String email, String password, String username) {
        var user = this.getAuthUser(email, password);

        if (user != null) {
            return user;
        }

        var newUser = new User();
        newUser.setEmail(email);
        newUser.setPassword(password);
        newUser.setUsername(username);
        return repository.save(newUser);
    }

    public void delete(Long id) {
        var user = this.getById(id);

        if (user == null) {
            return;
        }

        user.setDeleted(true);
        repository.save(user);
    }
}