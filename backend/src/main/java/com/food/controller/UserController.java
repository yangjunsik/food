// backend/src/main/java/com/food/controller/UserController.java
package com.food.controller;

import com.food.dto.UserDTO;
import com.food.service.UserService;
import jakarta.servlet.http.HttpSession;
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

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody UserDTO userDTO, HttpSession session) {
        boolean isAuthenticated = userService.authenticateUser(userDTO);
        Map<String, String> response = new HashMap<>();

        if (isAuthenticated) {
            session.setAttribute("user", userDTO.getId()); // 세션에 사용자 정보 저장

            // 세션 ID를 로그로 출력
            String sessionId = session.getId();
            System.out.println("Session ID: " + sessionId);

            response.put("message", "Login successful");
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "Invalid credentials");
            return ResponseEntity.status(401).body(response);
        }
    }

    @GetMapping("/check-auth")
    public ResponseEntity<Void> checkAuth(HttpSession session) {
        if (session.getAttribute("user") != null) {
            System.out.println("Session is valid for user: " + session.getAttribute("user"));
            return ResponseEntity.ok().build(); // 세션이 유효하면 200 OK 반환
        } else {
            System.out.println("Session is not valid or expired");
            return ResponseEntity.status(401).build(); // 세션이 유효하지 않으면 401 Unauthorized 반환
        }
    }
}



