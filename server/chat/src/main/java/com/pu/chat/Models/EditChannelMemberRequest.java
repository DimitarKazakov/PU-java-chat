package com.pu.chat.Models;

public class EditChannelMemberRequest extends LoginRequest {
    private String username;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
