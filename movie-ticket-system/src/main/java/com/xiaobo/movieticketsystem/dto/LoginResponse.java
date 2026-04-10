package com.xiaobo.movieticketsystem.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class LoginResponse {

    private String message;
    private String token;
    private UserResponse user;
}