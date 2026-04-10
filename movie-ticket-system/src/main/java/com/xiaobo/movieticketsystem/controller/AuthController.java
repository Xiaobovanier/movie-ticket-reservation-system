package com.xiaobo.movieticketsystem.controller;

import com.xiaobo.movieticketsystem.dto.LoginRequest;
import com.xiaobo.movieticketsystem.dto.LoginResponse;
import com.xiaobo.movieticketsystem.dto.RegisterRequest;
import com.xiaobo.movieticketsystem.dto.UserResponse;
import com.xiaobo.movieticketsystem.entity.User;
import com.xiaobo.movieticketsystem.service.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public UserResponse register(@RequestBody RegisterRequest request) {
        User user = userService.registerUser(request);

        UserResponse userResponse = new UserResponse();
        userResponse.setId(user.getId());
        userResponse.setFullName(user.getFullName());
        userResponse.setEmail(user.getEmail());
        userResponse.setRole(user.getRole());

        return userResponse;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return userService.loginUser(request);
    }
}