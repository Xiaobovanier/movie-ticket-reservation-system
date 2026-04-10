package com.xiaobo.movieticketsystem.service;

import com.xiaobo.movieticketsystem.dto.LoginRequest;
import com.xiaobo.movieticketsystem.dto.LoginResponse;
import com.xiaobo.movieticketsystem.dto.RegisterRequest;
import com.xiaobo.movieticketsystem.dto.UserResponse;
import com.xiaobo.movieticketsystem.entity.User;
import com.xiaobo.movieticketsystem.exception.EmailAlreadyExistsException;
import com.xiaobo.movieticketsystem.exception.InvalidPasswordException;
import com.xiaobo.movieticketsystem.exception.UserNotFoundException;
import com.xiaobo.movieticketsystem.repository.UserRepository;
import com.xiaobo.movieticketsystem.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public User registerUser(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new EmailAlreadyExistsException("Email already exists");
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");

        return userRepository.save(user);
    }

    public LoginResponse loginUser(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidPasswordException("Invalid password");
        }

        UserResponse userResponse = new UserResponse();
        userResponse.setId(user.getId());
        userResponse.setFullName(user.getFullName());
        userResponse.setEmail(user.getEmail());
        userResponse.setRole(user.getRole());

        LoginResponse loginResponse = new LoginResponse();
        loginResponse.setMessage("Login successful");
        loginResponse.setToken(jwtUtil.generateToken(user.getEmail()));
        loginResponse.setUser(userResponse);

        return loginResponse;
    }
}