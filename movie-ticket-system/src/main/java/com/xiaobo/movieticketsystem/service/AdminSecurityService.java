package com.xiaobo.movieticketsystem.service;

import com.xiaobo.movieticketsystem.entity.User;
import com.xiaobo.movieticketsystem.exception.ForbiddenException;
import com.xiaobo.movieticketsystem.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class AdminSecurityService {

    private final UserRepository userRepository;

    public AdminSecurityService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void requireAdmin(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            throw new ForbiddenException("Admin access required");
        }

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ForbiddenException("User not found"));

        if (!"ADMIN".equalsIgnoreCase(user.getRole())) {
            throw new ForbiddenException("Admin access required");
        }
    }

    public boolean isAdmin(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ForbiddenException("User not found"));

        return "ADMIN".equalsIgnoreCase(user.getRole());
    }
}