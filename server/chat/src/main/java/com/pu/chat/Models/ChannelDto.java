package com.pu.chat.Models;

import jakarta.persistence.Column;

import java.sql.Timestamp;
import java.util.List;

public class ChannelDto {
    private Long Id;
    private String name;
    private Timestamp createdAt;
    private List<UserChannelDto> users;

    public Long getId() {
        return Id;
    }

    public void setId(Long id) {
        this.Id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public List<UserChannelDto> getUsers() {
        return users;
    }

    public void setUsers(List<UserChannelDto> users) {
        this.users = users;
    }
}
