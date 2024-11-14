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
            System.out.println("로그인 권한 성공");
            String token = jwtUtil.generateToken(userDTO.getId());
            response.put("message", "Login successful");
            response.put("token", token);
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "Invalid credentials");
            return ResponseEntity.status(401).body(response);
        }
    }
}




