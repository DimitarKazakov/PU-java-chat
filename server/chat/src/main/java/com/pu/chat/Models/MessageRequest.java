package com.pu.chat.Models;

public class MessageRequest extends LoginRequest{
    private String message;

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
