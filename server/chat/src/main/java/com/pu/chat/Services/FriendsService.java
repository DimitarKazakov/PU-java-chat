package com.pu.chat.Services;

import com.pu.chat.Entity.Friend;
import com.pu.chat.Entity.User;
import com.pu.chat.Repositories.FriendsRepository;
import com.pu.chat.Repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Stream;

@Service
public class FriendsService {
    private final FriendsRepository repository;
    private final UserService userService;

    public FriendsService(FriendsRepository repository, UserService userService) {
        this.repository = repository;
        this.userService = userService;
    }


    public List<Friend> getAllForUser(User user) {
        var friendsOne = this.repository.findByUserOne(user);
        var friendsTwo = this.repository.findByUserTwo(user);

        return Stream.concat(friendsOne.stream(), friendsTwo.stream()).toList();
    }

    public Friend getFriendForUser(User user, User friend) {
        var allFriends = this.getAllForUser(user);

        for (int i = 0; i < allFriends.size(); i++) {
            var currentFriend = allFriends.get(i);

            if (currentFriend.getUserOne().getId() == friend.getId() || currentFriend.getUserTwo().getId() == friend.getId()) {
                return currentFriend;
            }
        }

        return null;
    }

    public Friend getById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public Friend insert(String usernameOne, String usernameTwo) {
        var userOne = this.userService.getByUsername(usernameOne);
        if (userOne == null) {
            return null;
        }

        var userTwo = this.userService.getByUsername(usernameTwo);
        if (userTwo == null) {
            return null;
        }

        var newFriend = new Friend();
        newFriend.setUserOne(userOne);
        newFriend.setUserTwo(userTwo);
        return repository.save(newFriend);
    }

    public void delete(Long id) {
        var friend = this.getById(id);
        if (friend == null) {
            return;
        }

        friend.setDeleted(true);
        repository.save(friend);
    }
}