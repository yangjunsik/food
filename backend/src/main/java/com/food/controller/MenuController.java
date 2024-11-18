// src/main/java/com/food/controller/MenuController.java
package com.food.controller;

import com.food.config.JwtUtil;
import com.food.dto.MenuDTO;
import com.food.service.MenuService;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
public class MenuController {

    @Autowired
    private MenuService menuService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/menu")
    public ResponseEntity<List<MenuDTO>> getMenu(@RequestHeader("Authorization") String token) {
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7); // "Bearer " 제거

            try {
                Claims claims = jwtUtil.extractClaims(token); // 토큰에서 클레임 추출
                String userId = claims.getSubject(); // 사용자 ID 확인

                if (userId != null) {
                    return ResponseEntity.ok(menuService.getMenuList());
                }
            } catch (Exception e) {
                System.out.println("Invalid JWT Token: " + e.getMessage());
            }
        }

        // 인증 실패 시 401 Unauthorized 반환
        return ResponseEntity.status(401).build();
    }
}

