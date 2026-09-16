package com.azimov.lms.service;

import com.azimov.lms.dto.*;
import com.azimov.lms.model.User;
import com.azimov.lms.repository.UserRepository;
import com.azimov.lms.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    
    @Value("${jwt.access-token-expiration}")
    private Long accessTokenExpiration;
    
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        log.info("Регистрация пользователя: {}", request.getEmail());
        
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Пользователь с таким email уже зарегистрирован");
        }
        
        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role(User.UserRole.TEACHER)
                .status(User.UserStatus.PENDING)
                .build();
        
        user = userRepository.save(user);
        log.info("Пользователь зарегистрирован: {} (ID: {})", user.getEmail(), user.getId());
        
        // Генерируем токены
        String accessToken = jwtUtil.generateAccessToken(user.getId(), user.getEmail(), user.getRole().name());
        String refreshToken = jwtUtil.generateRefreshToken(user.getId());
        
        return AuthResponse.of(accessToken, refreshToken, accessTokenExpiration, UserDto.fromEntity(user));
    }
    
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        log.info("Попытка входа: {}", request.getEmail());
        
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            log.warn("Неверный пароль для пользователя: {}", request.getEmail());
            throw new RuntimeException("Неверный email или пароль");
        }
        
        if (user.getStatus() == User.UserStatus.PENDING) {
            throw new RuntimeException("Ваш аккаунт ожидает подтверждения администратора");
        }
        
        if (user.getStatus() == User.UserStatus.REJECTED) {
            throw new RuntimeException("Ваша регистрация была отклонена");
        }
        
        log.info("Пользователь вошел: {} (ID: {})", user.getEmail(), user.getId());
        
        // Генерируем токены
        String accessToken = jwtUtil.generateAccessToken(user.getId(), user.getEmail(), user.getRole().name());
        String refreshToken = jwtUtil.generateRefreshToken(user.getId());
        
        return AuthResponse.of(accessToken, refreshToken, accessTokenExpiration, UserDto.fromEntity(user));
    }
    
    @Transactional(readOnly = true)
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        String refreshToken = request.getRefreshToken();
        
        if (!jwtUtil.validateToken(refreshToken)) {
            throw new RuntimeException("Недействительный refresh token");
        }
        
        String tokenType = jwtUtil.extractTokenType(refreshToken);
        if (!"refresh".equals(tokenType)) {
            throw new RuntimeException("Это не refresh token");
        }
        
        String userId = jwtUtil.extractUserId(refreshToken);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));
        
        // Генерируем новые токены
        String newAccessToken = jwtUtil.generateAccessToken(user.getId(), user.getEmail(), user.getRole().name());
        String newRefreshToken = jwtUtil.generateRefreshToken(user.getId());
        
        return AuthResponse.of(newAccessToken, newRefreshToken, accessTokenExpiration, UserDto.fromEntity(user));
    }
    
    @Transactional(readOnly = true)
    public UserDto getCurrentUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));
        return UserDto.fromEntity(user);
    }
}
