package com.pu.chat.Models;

public class AddFriendRequest extends LoginRequest {
    private String friendUsername;

    public String getFriendUsername() {
        return friendUsername;
    }

    public void setFriendUsername(String friendUsername) {
        this.friendUsername = friendUsername;
    }
}
