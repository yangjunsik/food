// backend/src/main/java/com/food/controller/UserController.java
package com.food.controller;

import com.food.config.JwtUtil;
import com.food.dto.UserDTO;
import com.food.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody UserDTO userDTO) {
        boolean isAuthenticated = userService.authenticateUser(userDTO);
        Map<String, String> response = new HashMap<>();

        if (isAuthenticated) {
            System.out.println("로그인 정보보내기 성공");
            String token = jwtUtil.generateToken(userDTO.getId());
            response.put("message", "Login successful");
            response.put("token", token);
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "Invalid credentials");
            return ResponseEntity.status(401).body(response);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody UserDTO userDTO) {
        boolean isRegistered = userService.registerUser(userDTO);
        Map<String, String> response = new HashMap<>();

        if (isRegistered) {
            System.out.println("회원가입 벡엔드 정보보내기 성공");
            response.put("message", "Registration successful");
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "Registration failed. User may already exist.");
            return ResponseEntity.status(400).body(response);
        }
    }

    @PostMapping("/checkDuplicateId")
    public ResponseEntity<Map<String, Boolean>> checkDuplicateId(@RequestBody Map<String, String> request) {
        String id = request.get("id");
        Map<String, Boolean> response = new HashMap<>();

        if (id == null || id.isEmpty()) {
            response.put("isDuplicate", false);
            return ResponseEntity.badRequest().body(response);
        }

        try {
            boolean isDuplicate = userService.isIdDuplicated(id);
            response.put("isDuplicate", isDuplicate);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("아이디 중복 확인 중 오류: " + e.getMessage());
            response.put("isDuplicate", false);
            return ResponseEntity.status(500).body(response);
        }
    }

}




